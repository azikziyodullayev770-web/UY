enum AdminRole {
  superAdmin,
  admin,
  moderator,
}

class AdminUser {
  final String username;
  final String password;
  final AdminRole role;

  const AdminUser({
    required this.username,
    required this.password,
    required this.role,
  });

  String get roleName {
    switch (role) {
      case AdminRole.superAdmin:
        return 'SuperAdmin';
      case AdminRole.admin:
        return 'Admin';
      case AdminRole.moderator:
        return 'Moderator';
    }
  }

  factory AdminUser.fromRoleName(String username, String password, String name) {
    AdminRole parsed;
    switch (name) {
      case 'SuperAdmin':
        parsed = AdminRole.superAdmin;
        break;
      case 'Admin':
        parsed = AdminRole.admin;
        break;
      case 'Moderator':
      default:
        parsed = AdminRole.moderator;
        break;
    }
    return AdminUser(username: username, password: password, role: parsed);
  }
}
