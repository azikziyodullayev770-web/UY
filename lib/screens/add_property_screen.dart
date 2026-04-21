import 'package:flutter/material.dart';
import '../models/property_model.dart';
import 'location_picker_screen.dart';

class AddPropertyScreen extends StatefulWidget {
  const AddPropertyScreen({Key? key}) : super(key: key);

  @override
  State<AddPropertyScreen> createState() => _AddPropertyScreenState();
}

class _AddPropertyScreenState extends State<AddPropertyScreen> {
  final _formKey = GlobalKey<FormState>();
  
  // Controllers
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _priceController = TextEditingController();
  
  // Location State
  double? _selectedLatitude;
  double? _selectedLongitude;
  String? _selectedAddress;

  Future<void> _openLocationPicker() async {
    // Navigate to LocationPickerScreen and await the result
    final result = await Navigator.push<LocationPickerResult>(
      context,
      MaterialPageRoute(builder: (_) => const LocationPickerScreen()),
    );

    // If perfectly retrieved, update the UI
    if (result != null) {
      setState(() {
        _selectedLatitude = result.latitude;
        _selectedLongitude = result.longitude;
        _selectedAddress = result.address;
      });
    }
  }

  void _submitProperty() {
    if (_formKey.currentState!.validate()) {
      // Prevent form submission if location is missing
      if (_selectedLatitude == null || _selectedLongitude == null || _selectedAddress == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please select a property location mapping.'), backgroundColor: Colors.redAccent),
        );
        return;
      }

      // Create model
      final newProperty = Property(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: _titleController.text,
        description: _descController.text,
        price: double.tryParse(_priceController.text) ?? 0.0,
        latitude: _selectedLatitude,
        longitude: _selectedLongitude,
        address: _selectedAddress,
      );

      // Usually here you'd send `newProperty` to your backend/provider
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Property "${newProperty.title}" successfully added!')),
      );
      
      // Return to previous screen
      Navigator.pop(context);
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _priceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Property')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Title', border: OutlineInputBorder()),
                validator: (v) => v!.isEmpty ? 'Enter a title' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descController,
                maxLines: 3,
                decoration: const InputDecoration(labelText: 'Description', border: OutlineInputBorder()),
                validator: (v) => v!.isEmpty ? 'Enter a description' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _priceController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Price', prefixText: '\$', border: OutlineInputBorder()),
                validator: (v) => v!.isEmpty ? 'Enter price' : null,
              ),
              const SizedBox(height: 32),
              
              // Location Section
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.blue.withOpacity(0.3)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Property Location', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 12),
                    if (_selectedAddress != null) ...[
                      Row(
                        children: [
                          const Icon(Icons.location_on, color: Colors.green),
                          const SizedBox(width: 8),
                          Expanded(child: Text(_selectedAddress!, style: const TextStyle(fontWeight: FontWeight.w500))),
                        ],
                      ),
                      const SizedBox(height: 8),
                    ],
                    OutlinedButton.icon(
                      onPressed: _openLocationPicker,
                      icon: const Icon(Icons.map),
                      label: Text(_selectedAddress == null ? 'Choose on Map' : 'Change Location'),
                      style: OutlinedButton.styleFrom(
                        minimumSize: const Size.infinity,
                      ),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 48),
              ElevatedButton(
                onPressed: _submitProperty,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Colors.blueAccent,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Save Property', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
