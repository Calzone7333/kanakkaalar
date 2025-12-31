import UIKit

class LoginViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    private let logoImageView = UIImageView()
    private let welcomeLabel = UILabel()
    private let subtitleLabel = UILabel()
    
    private let toggleContainer = UIView()
    private let emailModeButton = UIButton(type: .system)
    private let phoneModeButton = UIButton(type: .system)
    
    private let emailTextField = UITextField()
    private let passwordTextField = UITextField()
    private let forgotPasswordButton = UIButton(type: .system)
    private let loginButton = UIButton(type: .system)
    
    private let signupLabel = UILabel()
    private let signupButton = UIButton(type: .system)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        
        setupUI()
        setupActions()
    }
    
    private func setupUI() {
        // ScrollView Setup
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor)
        ])
        
        // Logo
        logoImageView.image = UIImage(named: "Logo") // Matches Android logo
        logoImageView.backgroundColor = DesignSystem.Colors.primary // Placeholder color
        logoImageView.layer.cornerRadius = 16
        logoImageView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(logoImageView)
        
        // Welcome Text
        welcomeLabel.text = "Welcome Back"
        welcomeLabel.font = DesignSystem.Fonts.bold(size: 28)
        welcomeLabel.textColor = DesignSystem.Colors.textPrimary
        welcomeLabel.textAlignment = .center
        welcomeLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(welcomeLabel)
        
        subtitleLabel.text = "Sign in to your account"
        subtitleLabel.font = DesignSystem.Fonts.regular(size: 16)
        subtitleLabel.textColor = DesignSystem.Colors.textSecondary
        subtitleLabel.textAlignment = .center
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(subtitleLabel)
        
        // Toggle Buttons
        toggleContainer.backgroundColor = UIColor(red: 243/255, green: 244/255, blue: 246/255, alpha: 1.0)
        toggleContainer.layer.cornerRadius = 12
        toggleContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(toggleContainer)
        
        emailModeButton.setTitle("Email", for: .normal)
        emailModeButton.backgroundColor = DesignSystem.Colors.primary
        emailModeButton.setTitleColor(.white, for: .normal)
        emailModeButton.layer.cornerRadius = 10
        emailModeButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
        emailModeButton.translatesAutoresizingMaskIntoConstraints = false
        toggleContainer.addSubview(emailModeButton)
        
        phoneModeButton.setTitle("Phone", for: .normal)
        phoneModeButton.backgroundColor = .clear
        phoneModeButton.setTitleColor(DesignSystem.Colors.textSecondary, for: .normal)
        phoneModeButton.layer.cornerRadius = 10
        phoneModeButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
        phoneModeButton.translatesAutoresizingMaskIntoConstraints = false
        toggleContainer.addSubview(phoneModeButton)
        
        // Text Fields
        setupTextField(emailTextField, placeholder: "Email Address", icon: "envelope")
        setupTextField(passwordTextField, placeholder: "Password", icon: "lock", isSecure: true)
        
        contentView.addSubview(emailTextField)
        contentView.addSubview(passwordTextField)
        
        // Forgot Password
        forgotPasswordButton.setTitle("Forgot Password?", for: .normal)
        forgotPasswordButton.setTitleColor(DesignSystem.Colors.primary, for: .normal)
        forgotPasswordButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
        forgotPasswordButton.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(forgotPasswordButton)
        
        // Login Button
        loginButton.setTitle("Sign In", for: .normal)
        loginButton.backgroundColor = DesignSystem.Colors.primary
        loginButton.setTitleColor(.white, for: .normal)
        loginButton.layer.cornerRadius = 12
        loginButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 16)
        loginButton.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(loginButton)
        
        // Signup Link
        let signupStack = UIStackView()
        signupStack.axis = .horizontal
        signupStack.spacing = 4
        signupStack.alignment = .center
        signupStack.translatesAutoresizingMaskIntoConstraints = false
        
        signupLabel.text = "Don't have an account?"
        signupLabel.textColor = DesignSystem.Colors.textSecondary
        signupLabel.font = DesignSystem.Fonts.regular(size: 14)
        
        signupButton.setTitle("Sign Up", for: .normal)
        signupButton.setTitleColor(DesignSystem.Colors.primary, for: .normal)
        signupButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
        
        signupStack.addArrangedSubview(signupLabel)
        signupStack.addArrangedSubview(signupButton)
        contentView.addSubview(signupStack)
        
        // Constraints
        NSLayoutConstraint.activate([
            logoImageView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 48),
            logoImageView.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            logoImageView.widthAnchor.constraint(equalToConstant: 80),
            logoImageView.heightAnchor.constraint(equalToConstant: 80),
            
            welcomeLabel.topAnchor.constraint(equalTo: logoImageView.bottomAnchor, constant: 24),
            welcomeLabel.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            
            subtitleLabel.topAnchor.constraint(equalTo: welcomeLabel.bottomAnchor, constant: 8),
            subtitleLabel.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            
            toggleContainer.topAnchor.constraint(equalTo: subtitleLabel.bottomAnchor, constant: 32),
            toggleContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            toggleContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            toggleContainer.heightAnchor.constraint(equalToConstant: 50),
            
            emailModeButton.leadingAnchor.constraint(equalTo: toggleContainer.leadingAnchor, constant: 4),
            emailModeButton.topAnchor.constraint(equalTo: toggleContainer.topAnchor, constant: 4),
            emailModeButton.bottomAnchor.constraint(equalTo: toggleContainer.bottomAnchor, constant: -4),
            emailModeButton.widthAnchor.constraint(equalTo: toggleContainer.widthAnchor, multiplier: 0.5, constant: -4),
            
            phoneModeButton.trailingAnchor.constraint(equalTo: toggleContainer.trailingAnchor, constant: -4),
            phoneModeButton.topAnchor.constraint(equalTo: toggleContainer.topAnchor, constant: 4),
            phoneModeButton.bottomAnchor.constraint(equalTo: toggleContainer.bottomAnchor, constant: -4),
            phoneModeButton.widthAnchor.constraint(equalTo: toggleContainer.widthAnchor, multiplier: 0.5, constant: -4),
            
            emailTextField.topAnchor.constraint(equalTo: toggleContainer.bottomAnchor, constant: 24),
            emailTextField.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            emailTextField.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            emailTextField.heightAnchor.constraint(equalToConstant: 56),
            
            passwordTextField.topAnchor.constraint(equalTo: emailTextField.bottomAnchor, constant: 16),
            passwordTextField.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            passwordTextField.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            passwordTextField.heightAnchor.constraint(equalToConstant: 56),
            
            forgotPasswordButton.topAnchor.constraint(equalTo: passwordTextField.bottomAnchor, constant: 8),
            forgotPasswordButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            
            loginButton.topAnchor.constraint(equalTo: forgotPasswordButton.bottomAnchor, constant: 32),
            loginButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            loginButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            loginButton.heightAnchor.constraint(equalToConstant: 56),
            
            signupStack.topAnchor.constraint(equalTo: loginButton.bottomAnchor, constant: 24),
            signupStack.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            signupStack.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -32)
        ])
    }
    
    private func setupTextField(_ textField: UITextField, placeholder: String, icon: String, isSecure: Bool = false) {
        textField.placeholder = placeholder
        textField.isSecureTextEntry = isSecure
        textField.borderStyle = .none
        textField.backgroundColor = .white
        textField.layer.cornerRadius = 12
        textField.layer.borderWidth = 1
        textField.layer.borderColor = DesignSystem.Colors.primary.cgColor
        textField.textColor = DesignSystem.Colors.textPrimary
        textField.translatesAutoresizingMaskIntoConstraints = false
        
        let paddingView = UIView(frame: CGRect(x: 0, y: 0, width: 16, height: 56))
        textField.leftView = paddingView
        textField.leftViewMode = .always
        
        // Note: Right icon setup omitted for brevity, but can be added similarly
    }
    
    private func setupActions() {
        loginButton.addTarget(self, action: #selector(handleLogin), for: .touchUpInside)
        phoneModeButton.addTarget(self, action: #selector(handlePhoneMode), for: .touchUpInside)
        signupButton.addTarget(self, action: #selector(handleSignup), for: .touchUpInside)
        forgotPasswordButton.addTarget(self, action: #selector(handleForgotPassword), for: .touchUpInside)
    }

    @objc private func handleForgotPassword() {
        let forgotVC = ForgotPasswordViewController()
        navigationController?.pushViewController(forgotVC, animated: true)
    }
    
    @objc private func handleLogin() {
        guard let email = emailTextField.text, !email.isEmpty,
              let password = passwordTextField.text, !password.isEmpty else {
            showAlert(message: "Please enter email and password")
            return
        }
        
        // Mock Login Logic
        loginButton.isEnabled = false
        loginButton.setTitle("Signing in...", for: .normal)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
            self?.loginButton.isEnabled = true
            self?.loginButton.setTitle("Sign In", for: .normal)
            
            // Mock Success
            let role = email.lowercased().contains("admin") ? "ADMIN" : "USER"
            SessionManager.shared.saveSession(token: "mock_token", role: role, name: "Test User", email: email)
            
            self?.navigateToDashboard(role: role)
        }
    }
    
    private func navigateToDashboard(role: String) {
        let dashboardVC = DashboardViewController()
        dashboardVC.userRole = role
        dashboardVC.modalPresentationStyle = .fullScreen
        present(dashboardVC, animated: true)
    }
    
    @objc private func handlePhoneMode() {
        showAlert(message: "Phone Login coming soon")
    }
    
    @objc private func handleSignup() {
        let signupVC = SignupViewController()
        if let nav = navigationController {
            nav.pushViewController(signupVC, animated: true)
        } else {
            // Present if not in nav stack
            let nav = UINavigationController(rootViewController: signupVC)
            nav.modalPresentationStyle = .fullScreen
            present(nav, animated: true)
        }
    }
    
    private func showAlert(message: String) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
