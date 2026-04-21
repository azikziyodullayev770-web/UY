import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/property_model.dart';

class ModerationResult {
  final String status;
  final String reason;
  final String riskLevel;
  final String notes;

  ModerationResult({
    required this.status,
    required this.reason,
    required this.riskLevel,
    required this.notes,
  });

  factory ModerationResult.parse(String text) {
    // Basic parser for the strictly formatted response
    final statusMatch = RegExp(r'Status:\s*([A-Za-z]+)', caseSensitive: false).firstMatch(text);
    final reasonMatch = RegExp(r'Reason:\s*(.+?)\n(?:Risk Level:|$)', dotAll: true, caseSensitive: false).firstMatch(text);
    final riskMatch = RegExp(r'Risk Level:\s*([A-Za-z]+)', caseSensitive: false).firstMatch(text);
    final notesMatch = RegExp(r'Notes:\s*(.+?)(?:$)', dotAll: true, caseSensitive: false).firstMatch(text);

    return ModerationResult(
      status: statusMatch?.group(1)?.toUpperCase() ?? 'REVIEW',
      reason: reasonMatch?.group(1)?.trim() ?? 'Could not parse reason.',
      riskLevel: riskMatch?.group(1)?.toUpperCase() ?? 'UNKNOWN',
      notes: notesMatch?.group(1)?.trim() ?? 'No additional notes provided.',
    );
  }
}

class AdminModerationAIService {
  // IMPORTANT: For production, do NOT hardcode this in the app bundle. 
  // Read it from environment variables or secure storage.
  static const String _apiKey = 'YOUR_GEMINI_API_KEY'; 

  Future<ModerationResult> moderateProperty(Property property) async {
    final uri = Uri.parse('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$_apiKey');

    // 1. Build the explicit system instructions & strict format rules
    final String prompt = '''
You are a Real Estate Content Moderator and Validator.
Analyze the following property listing and evaluate its realism, write quality, and consistency.
Check if the location matches the description and if the price is realistic.
Detect spam, clickbait, or mismatching information.

Title: ${property.title}
Description: ${property.description}
Price: \$${property.price}
Location string: ${property.address ?? 'Not provided'}
Latitude: ${property.latitude ?? 'Unknown'}
Longitude: ${property.longitude ?? 'Unknown'}

STRICT RESPONSE FORMAT:
Status: 
(APPROVE / REJECT / REVIEW)

Reason: 
(Short explanation of your decision)

Risk Level: 
(Low / Medium / High)

Notes: 
(Additional comments for admin, including image analysis notes if images were checked)
''';

    // 2. We will assemble the contents list
    List<dynamic> contentsParts = [
      {'text': prompt}
    ];

    // 3. Optional: Process visual assets if they exist and are accessible URLs
    // We download up to 2 images to restrict payload sizing for Gemini HTTP calls
    if (property.imageUrls != null && property.imageUrls!.isNotEmpty) {
      for (int i = 0; i < property.imageUrls!.length && i < 2; i++) {
        final imgUrl = property.imageUrls![i];
        try {
          final imgResponse = await http.get(Uri.parse(imgUrl)).timeout(const Duration(seconds: 5));
          if (imgResponse.statusCode == 200) {
            String base64Image = base64Encode(imgResponse.bodyBytes);
            
            // Very rudimentary mime-type parsing
            String mimeType = 'image/jpeg';
            if (imgUrl.toLowerCase().endsWith('.png')) mimeType = 'image/png';
            if (imgUrl.toLowerCase().endsWith('.webp')) mimeType = 'image/webp';
            
            contentsParts.add({
              'inlineData': {
                'mimeType': mimeType,
                'data': base64Image,
              }
            });
          }
        } catch (e) {
          print('Skipping image download for Gemini Context: $e');
        }
      }
    }

    final Map<String, dynamic> bodyPayload = {
      'contents': [
        {
          'parts': contentsParts
        }
      ],
      'generationConfig': {
        'temperature': 0.2, // Low temperature for consistent validation outputs
      }
    };

    // 4. Send Request
    try {
      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(bodyPayload),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final String rawOutput = data['candidates'][0]['content']['parts'][0]['text'];
        
        return ModerationResult.parse(rawOutput);
      } else {
        throw Exception('Generative API returned status: ${response.statusCode}');
      }
    } catch (e) {
      return ModerationResult(
        status: 'REVIEW',
        reason: 'Service Error during AI Check: \$e',
        riskLevel: 'UNKNOWN',
        notes: 'Please review manually or verify the Gemini API Key is configured.',
      );
    }
  }
}
