import 'package:flutter/material.dart';
import '../models/property_model.dart';
import 'map_view_screen.dart';

class PropertyDetailScreen extends StatelessWidget {
  final Property property;

  const PropertyDetailScreen({Key? key, required this.property}) : super(key: key);

  void _openMapView(BuildContext context) {
    if (property.hasLocation) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => MapViewScreen(property: property)),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No map data available for this property.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Property Details'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Dummy Header Image
            Container(
              height: 250,
              color: Colors.grey[300],
              child: const Icon(Icons.home, size: 100, color: Colors.grey),
            ),
            
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          property.title,
                          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                        ),
                      ),
                      Text(
                        '\$${property.price.toStringAsFixed(2)}',
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blueAccent),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  
                  const Text('Description', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(property.description, style: const TextStyle(fontSize: 16, color: Colors.black87)),
                  
                  const SizedBox(height: 32),
                  const Text('Location', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  
                  // Location displaying
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey[300]!),
                    ),
                    child: Column(
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.location_on, color: Colors.red),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                property.address ?? 'Location not specified',
                                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                              ),
                            ),
                          ],
                        ),
                        if (property.hasLocation) ...[
                          const SizedBox(height: 16),
                          OutlinedButton.icon(
                            onPressed: () => _openMapView(context),
                            icon: const Icon(Icons.map),
                            label: const Text('View on Map'),
                            style: OutlinedButton.styleFrom(
                              minimumSize: const Size.infinity,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                          ),
                        ]
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
