class Property {
  final String id;
  final String title;
  final String description;
  final double price;
  
  // Location Fields
  final double? latitude;
  final double? longitude;
  final String? address;
  final List<String>? imageUrls;

  Property({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    this.latitude,
    this.longitude,
    this.address,
    this.imageUrls,
  });

  bool get hasLocation => latitude != null && longitude != null && address != null;

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'price': price,
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'imageUrls': imageUrls,
    };
  }

  factory Property.fromMap(Map<String, dynamic> map) {
    return Property(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      price: map['price']?.toDouble() ?? 0.0,
      latitude: map['latitude']?.toDouble(),
      longitude: map['longitude']?.toDouble(),
      address: map['address'],
      imageUrls: (map['imageUrls'] as List<dynamic>?)?.cast<String>(),
    );
  }

  Property copyWith({
    String? id,
    String? title,
    String? description,
    double? price,
    double? latitude,
    double? longitude,
    String? address,
    List<String>? imageUrls,
  }) {
    return Property(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      price: price ?? this.price,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      address: address ?? this.address,
      imageUrls: imageUrls ?? this.imageUrls,
    );
  }
}
