import 'package:flutter/cupertino.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/admin_user_model.dart';

class AuthService extends ChangeNotifier {
  AdminUser? _currentUser;
  bool _isLoading = true;

  AdminUser? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _currentUser != null;

  // Predefined Admin Credentials (Source of Truth)
  final List<AdminUser> _mockAccounts = const [
    AdminUser(username: 'superadmin', password: '111111', role: AdminRole.superAdmin),
    AdminUser(username: 'admin', password: '222222', role: AdminRole.admin),
    AdminUser(username: 'moderator', password: '333333', role: AdminRole.moderator),
  ];

  AuthService() {
    _checkAutoLogin();
  }

  Future<void> _checkAutoLogin() async {
    final prefs = await SharedPreferences.getInstance();
    final savedUsername = prefs.getString('auth_username');
    final savedRole = prefs.getString('auth_role');
    
    if (savedUsername != null && savedRole != null) {
      _currentUser = AdminUser.fromRoleName(savedUsername, '', savedRole);
    }
    
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> login(String username, String password) async {
    // Artificial delay for UX
    await Future.delayed(const Duration(milliseconds: 400));

    try {
      final user = _mockAccounts.firstWhere(
        (u) => u.username.toLowerCase() == username.toLowerCase() && u.password == password,
      );

      _currentUser = user;
      
      // Persist session
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_username', user.username);
      await prefs.setString('auth_role', user.roleName);

      notifyListeners();
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    _currentUser = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear(); // Complete wipe to prevent stale data conflicts
    
    notifyListeners();
  }
}
