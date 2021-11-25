class UserRole {
    static Visitor = "Visitor"
    static User = "User"
    static Admin = "Admin"
}

class AuthType {
    static Email = "Email"
    static Google = "Google"
}

module.exports = {
    UserRole, AuthType
}