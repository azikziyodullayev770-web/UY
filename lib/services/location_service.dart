import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:yandex_mapkit/yandex_mapkit.dart';

class LocationService {
  /// Checks and requests location permission
  Future<bool> requestLocationPermission() async {
    var status = await Permission.locationWhenInUse.status;
    
    if (status.isDenied) {
      status = await Permission.locationWhenInUse.request();
    }
    
    if (status.isPermanentlyDenied) {
      await openAppSettings();
      return false;
    }
    
    return status.isGranted;
  }

  /// Retrieves the current device location
  Future<Position?> getCurrentLocation() async {
    final hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      // Location services are disabled.
      return null;
    }

    try {
      return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
    } catch (e) {
      return null;
    }
  }

  /// Reverse Geocoding using Yandex MapKit
  /// Converts Latitude/Longitude to a human-readable address
  Future<String?> getAddressFromCoordinates(double lat, double lng) async {
    try {
      final resultWithSession = YandexSearch.searchByPoint(
        point: Point(latitude: lat, longitude: lng),
        searchOptions: const SearchOptions(
          searchType: SearchType.geo,
          geometry: false,
        ),
      );

      final result = await resultWithSession.result;
      
      if (result.error != null) {
        return null;
      }

      if (result.items != null && result.items!.isNotEmpty) {
        // Extract the formatted address from topocentric metadata
        final toponym = result.items!.first.toponymMetadata;
        if (toponym != null) {
          return toponym.address.formattedAddress;
        }
      }
    } catch (e) {
      // Ignore or log error in production
    }
    return null;
  }
}
