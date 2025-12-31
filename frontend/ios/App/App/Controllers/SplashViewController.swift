import UIKit

class SplashViewController: UIViewController {

    private let logoImageView = UIImageView()
    private let titleLabel = UILabel()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        
        setupUI()
        animate()
        
        // Timer
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
            self.checkSession()
        }
    }
    
    private func setupUI() {
        logoImageView.image = UIImage(named: "Logo")
        logoImageView.backgroundColor = DesignSystem.Colors.primary
        logoImageView.layer.cornerRadius = 20
        logoImageView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(logoImageView)
        
        titleLabel.text = "BizzFilling"
        titleLabel.font = DesignSystem.Fonts.bold(size: 32)
        titleLabel.textColor = DesignSystem.Colors.primary
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(titleLabel)
        
        NSLayoutConstraint.activate([
            logoImageView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            logoImageView.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -40),
            logoImageView.widthAnchor.constraint(equalToConstant: 100),
            logoImageView.heightAnchor.constraint(equalToConstant: 100),
            
            titleLabel.topAnchor.constraint(equalTo: logoImageView.bottomAnchor, constant: 16),
            titleLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor)
        ])
    }
    
    private func animate() {
        logoImageView.transform = CGAffineTransform(scaleX: 0.5, y: 0.5)
        logoImageView.alpha = 0
        titleLabel.transform = CGAffineTransform(translationX: 0, y: 20)
        titleLabel.alpha = 0
        
        UIView.animate(withDuration: 1.0, delay: 0.2, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.8, options: [], animations: {
            self.logoImageView.transform = .identity
            self.logoImageView.alpha = 1
            self.titleLabel.transform = .identity
            self.titleLabel.alpha = 1
        }, completion: nil)
    }
    
    private func checkSession() {
        if let token = SessionManager.shared.getToken() {
            // Logged In
            let role = SessionManager.shared.getRole() ?? "USER"
            let dashboardVC = DashboardViewController()
            dashboardVC.userRole = role
            
            // Switch Root
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first {
                window.rootViewController = dashboardVC
                UIView.transition(with: window, duration: 0.5, options: .transitionCrossDissolve, animations: nil, completion: nil)
            }
        } else {
            // Not Logged In
            let loginVC = UINavigationController(rootViewController: LoginViewController())
            
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first {
                window.rootViewController = loginVC
                UIView.transition(with: window, duration: 0.5, options: .transitionCrossDissolve, animations: nil, completion: nil)
            }
        }
    }
}
