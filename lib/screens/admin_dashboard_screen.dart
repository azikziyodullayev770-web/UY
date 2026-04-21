import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../models/admin_user_model.dart';
import '../models/property_model.dart';
import 'admin_property_review_screen.dart';
import 'login_screen.dart';

class AdminDashboardScreen extends StatelessWidget {
  final AuthService authService;

  const AdminDashboardScreen({Key? key, required this.authService}) : super(key: key);

  void _handleLogout(BuildContext context) async {
    await authService.logout();
    if (context.mounted) {
      Navigator.pushReplacement(
        context, 
        MaterialPageRoute(builder: (_) => LoginScreen(authService: authService))
      );
    }
  }

  Color _getRoleColor(AdminRole role) {
    switch (role) {
      case AdminRole.superAdmin: return Colors.deepPurple;
      case AdminRole.admin: return Colors.blue;
      case AdminRole.moderator: return Colors.orange;
    }
  }

  void _openPropertyReview(BuildContext context) {
    // Generate a dummy property object demonstrating the data load behavior structurally
    final stubProperty = Property(
      id: 'demo-prop',
      title: 'Modern Apartment 3-Beds',
      description: 'A beautiful highly-suspicious clickbait description right here.',
      price: 15.00, // Very low suspicious price
      latitude: 41.2995,
      longitude: 69.2401,
      address: 'Tashkent City Center',
      imageUrls: ['https://via.placeholder.com/600', 'https://via.placeholder.com/800'],
    );

    Navigator.push(context, MaterialPageRoute(
      builder: (_) => AdminPropertyReviewScreen(
        property: stubProperty,
        activeRole: authService.currentUser!.role, // Pass down active role constraint securely
      )
    ));
  }

  @override
  Widget build(BuildContext context) {
    final user = authService.currentUser;
    if (user == null) return const Scaffold(body: Center(child: Text('Unauthorized access')));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 1,
        actions: [
          IconButton(icon: const Icon(Icons.logout), onPressed: () => _handleLogout(context))
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Structural Banner explicit mapping based on roles
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              decoration: BoxDecoration(
                color: _getRoleColor(user.role).withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: _getRoleColor(user.role).withOpacity(0.5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Welcome back,', style: TextStyle(fontSize: 18, color: Colors.grey[700])),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.admin_panel_settings, color: _getRoleColor(user.role), size: 32),
                      const SizedBox(width: 12),
                      Text(
                        user.roleName,
                        style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: _getRoleColor(user.role)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            const Text('Controls', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),

            // Base access mapping
            ListTile(
              onTap: () => _openPropertyReview(context),
              leading: const Icon(Icons.rate_review, color: Colors.blueAccent),
              title: const Text('Property Listings Setup / Validation AI'),
              subtitle: const Text('Review unapproved properties using AI tools'),
              tileColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey[200]!)),
            ),

            // Admin // SuperAdmin access mappings explicitly
            if (user.role == AdminRole.superAdmin || user.role == AdminRole.admin) ...[
               const SizedBox(height: 12),
               ListTile(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Dummy Route: Direct Database Controls')));
                },
                leading: const Icon(Icons.history, color: Colors.green),
                title: const Text('Approve Historic Logs'),
                tileColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey[200]!)),
              ),
            ],

            // SuperAdmin Exclusives completely constrained natively
            if (user.role == AdminRole.superAdmin) ...[
               const SizedBox(height: 12),
               ListTile(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Dummy Route: Deletion Logs')));
                },
                leading: const Icon(Icons.delete_forever, color: Colors.redAccent),
                title: const Text('Delete Corrupted Entries'),
                tileColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey[200]!)),
              ),
               const SizedBox(height: 12),
               ListTile(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Dummy Route: Block Users')));
                },
                leading: const Icon(Icons.block, color: Colors.red),
                title: const Text('Block App Accounts'),
                tileColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey[200]!)),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
