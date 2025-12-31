import Foundation

class SessionManager {
    static let shared = SessionManager()
    
    private let defaults = UserDefaults.standard
    
    private let KEY_TOKEN = "auth_token"
    private let KEY_USER_ROLE = "user_role"
    private let KEY_USER_NAME = "user_name"
    private let KEY_USER_EMAIL = "user_email"
    
    private init() {}
    
    func saveSession(token: String, role: String, name: String, email: String) {
        defaults.set(token, forKey: KEY_TOKEN)
        defaults.set(role, forKey: KEY_USER_ROLE)
        defaults.set(name, forKey: KEY_USER_NAME)
        defaults.set(email, forKey: KEY_USER_EMAIL)
    }
    
    func clearSession() {
        defaults.removeObject(forKey: KEY_TOKEN)
        defaults.removeObject(forKey: KEY_USER_ROLE)
        defaults.removeObject(forKey: KEY_USER_NAME)
        defaults.removeObject(forKey: KEY_USER_EMAIL)
    }
    
    var isLoggedIn: Bool {
        return getToken() != nil
    }
    
    func getToken() -> String? {
        return defaults.string(forKey: KEY_TOKEN)
    }
    
    func getUserRole() -> String {
        return defaults.string(forKey: KEY_USER_ROLE) ?? "USER"
    }
    
    func getUserName() -> String {
        return defaults.string(forKey: KEY_USER_NAME) ?? "User"
    }
    
    func getUserEmail() -> String {
        return defaults.string(forKey: KEY_USER_EMAIL) ?? ""
    }
}
