import 'dart:async';
import 'package:flutter/material.dart';
import 'package:yandex_mapkit/yandex_mapkit.dart';
import '../services/location_service.dart';

class LocationPickerResult {
  final double latitude;
  final double longitude;
  final String address;

  LocationPickerResult({
    required this.latitude,
    required this.longitude,
    required this.address,
  });
}

class LocationPickerScreen extends StatefulWidget {
  const LocationPickerScreen({Key? key}) : super(key: key);

  @override
  State<LocationPickerScreen> createState() => _LocationPickerScreenState();
}

class _LocationPickerScreenState extends State<LocationPickerScreen> {
  final _locationService = LocationService();
  late YandexMapController _mapController;
  
  Point? _currentCenter;
  String? _currentAddress;
  bool _isLoadingAddress = false;
  bool _isMapMoved = false;

  @override
  void initState() {
    super.initState();
    // Initially request permission
    _locationService.requestLocationPermission();
  }

  Future<void> _fetchAddress(Point point) async {
    setState(() {
      _isLoadingAddress = true;
    });

    final address = await _locationService.getAddressFromCoordinates(point.latitude, point.longitude);
    
    if (mounted) {
      setState(() {
        _currentAddress = address ?? "Address not found";
        _isLoadingAddress = false;
      });
    }
  }

  Future<void> _moveToCurrentLocation() async {
    setState(() {
      _isLoadingAddress = true;
    });

    final position = await _locationService.getCurrentLocation();
    
    if (position != null && mounted) {
      final point = Point(latitude: position.latitude, longitude: position.longitude);
      
      await _mapController.moveCamera(
        CameraUpdate.newCameraPosition(
          CameraPosition(target: point, zoom: 15),
        ),
        animation: const MapAnimation(type: MapAnimationType.smooth, duration: 1.5),
      );
      
      setState(() {
        _currentCenter = point;
      });
      await _fetchAddress(point);
    } else {
      setState(() {
        _isLoadingAddress = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to get current location.')),
        );
      }
    }
  }

  void _confirmLocation() {
    if (_currentCenter != null && _currentAddress != null) {
      Navigator.pop(
        context,
        LocationPickerResult(
          latitude: _currentCenter!.latitude,
          longitude: _currentCenter!.longitude,
          address: _currentAddress!,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pick Location'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: Stack(
        children: [
          // 1. Fullscreen Map
          YandexMap(
            onMapCreated: (controller) {
              _mapController = controller;
              // Optionally move to a default city like Tashkent immediately
              _mapController.moveCamera(
                CameraUpdate.newCameraPosition(
                  const CameraPosition(
                    target: Point(latitude: 41.2995, longitude: 69.2401),
                    zoom: 12,
                  ),
                ),
              );
            },
            onCameraPositionChanged: (cameraPosition, reason, finished) {
              if (finished) {
                // When map stops moving, extract center point
                setState(() {
                  _currentCenter = cameraPosition.target;
                });
                _fetchAddress(cameraPosition.target);
              }
            },
          ),

          // 2. Center Pin Overlay
          const Center(
            child: Padding(
              padding: EdgeInsets.only(bottom: 40.0), // Adjust to make the pin base point exactly at center
              child: Icon(
                Icons.location_on,
                size: 50,
                color: Colors.red,
              ),
            ),
          ),

          // 3. Current Location Button
          Positioned(
            right: 16,
            bottom: 180,
            child: FloatingActionButton(
              heroTag: 'my_location_btn',
              backgroundColor: Colors.white,
              onPressed: _moveToCurrentLocation,
              child: const Icon(Icons.my_location, color: Colors.blueAccent),
            ),
          ),

          // 4. Address Card & Confirm Button
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 10,
                    spreadRadius: 2,
                  )
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.location_city, color: Colors.grey),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _isLoadingAddress
                            ? const Text('Fetching address...', style: TextStyle(color: Colors.grey))
                            : Text(
                                _currentAddress ?? 'Move map to select location',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                      ),
                      if (_isLoadingAddress)
                        const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: (_currentCenter != null && _currentAddress != null && !_isLoadingAddress)
                        ? _confirmLocation
                        : null,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: Colors.blueAccent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Confirm Location',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
