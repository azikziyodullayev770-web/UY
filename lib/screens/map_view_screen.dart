import 'package:flutter/material.dart';
import 'package:yandex_mapkit/yandex_mapkit.dart';
import '../models/property_model.dart';
import '../services/location_service.dart';

class MapViewScreen extends StatefulWidget {
  final Property property;

  const MapViewScreen({Key? key, required this.property}) : super(key: key);

  @override
  State<MapViewScreen> createState() => _MapViewScreenState();
}

class _MapViewScreenState extends State<MapViewScreen> {
  late YandexMapController _mapController;
  final _locationService = LocationService();

  void _moveToCurrentLocation() async {
    final position = await _locationService.getCurrentLocation();
    if (position != null && mounted) {
      await _mapController.moveCamera(
        CameraUpdate.newCameraPosition(
          CameraPosition(
            target: Point(latitude: position.latitude, longitude: position.longitude),
            zoom: 14,
          ),
        ),
        animation: const MapAnimation(type: MapAnimationType.smooth, duration: 1.5),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.property.hasLocation) {
      return Scaffold(
        appBar: AppBar(title: const Text('Map View')),
        body: const Center(child: Text('Location is not available for this property.')),
      );
    }

    final targetPoint = Point(
      latitude: widget.property.latitude!,
      longitude: widget.property.longitude!,
    );

    // Using a map object for the property marker
    final mapObjects = <MapObject>[
      PlacemarkMapObject(
        mapId: const MapObjectId('property_marker'),
        point: targetPoint,
        opacity: 1,
        // In a real application, you'd convert a Flutter Text Widget to a BitmapDescriptor
        // to show the price exactly on the marker. For now, we use a default styling / custom icon.
        icon: PlacemarkIcon.single(
          PlacemarkIconStyle(
            image: BitmapDescriptor.fromAssetImage('lib/assets/marker.png'), // Add your marker asset here
            scale: 1.0,
          ),
        ),
        text: PlacemarkText(
          text: '\$${widget.property.price.toStringAsFixed(0)}',
          style: const PlacemarkTextStyle(
            placement: TextStylePlacement.bottom,
            color: Colors.red,
            size: 14,
            outlineColor: Colors.white,
            weight: TextStyleWeight.bold,
          )
        ),
      )
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.property.title),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: Stack(
        children: [
          YandexMap(
            mapObjects: mapObjects,
            onMapCreated: (controller) {
              _mapController = controller;
              // Center the map securely over the property
              _mapController.moveCamera(
                CameraUpdate.newCameraPosition(
                  CameraPosition(target: targetPoint, zoom: 16),
                ),
              );
            },
          ),
          
          // My Location action
          Positioned(
            right: 16,
            bottom: 32,
            child: FloatingActionButton(
              heroTag: 'my_loc_btn_map_view',
              backgroundColor: Colors.white,
              onPressed: _moveToCurrentLocation,
              child: const Icon(Icons.my_location, color: Colors.blueAccent),
            ),
          ),

          // Price Tag Overlay Box (Alternative way to ensure price is always visible and beautiful)
          Positioned(
            top: 24,
            left: 24,
            right: 24,
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.95),
                borderRadius: BorderRadius.circular(12),
                boxShadow: const [
                  BoxShadow(color: Colors.black12, blurRadius: 10, spreadRadius: 2),
                ],
              ),
              child: Row(
                children: [
                  const Icon(Icons.sell, color: Colors.green),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Property Price',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                      Text(
                        '\$${widget.property.price.toStringAsFixed(2)}',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87),
                      ),
                    ],
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
