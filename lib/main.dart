import 'package:flutter/material.dart';
import 'services/auth_service.dart';
import 'screens/login_screen.dart';
import 'screens/admin_dashboard_screen.dart';

void main() {
  runApp(const RealEstateAdminApp());
}

class RealEstateAdminApp extends StatefulWidget {
  const RealEstateAdminApp({Key? key}) : super(key: key);

  @override
  State<RealEstateAdminApp> createState() => _RealEstateAdminAppState();
}

class _RealEstateAdminAppState extends State<RealEstateAdminApp> {
  final AuthService _authService = AuthService();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Real Estate Admin',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
        fontFamily: 'Roboto',
      ),
      home: ListenableBuilder(
        listenable: _authService,
        builder: (context, _) {
          if (_authService.isLoading) {
            return const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          }

          if (_authService.isAuthenticated) {
            return AdminDashboardScreen(authService: _authService);
          } else {
            return LoginScreen(authService: _authService);
          }
        },
      ),
    );
  }
}
