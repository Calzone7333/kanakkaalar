import UIKit

class SignupViewController: UIViewController {

    // MARK: - Properties
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    private let illustrationImageView = UIImageView()
    private let titleLabel = UILabel()
    private let subtitleLabel = UILabel()
    
    private let fullNameField = UITextField()
    private let emailField = UITextField()
    private let passwordField = UITextField()
    
    private let signupButton = UIButton(type: .system)
    private let loginLinkButton = UIButton(type: .system)
    
    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        
        setupUI()
        setupAnimations()
    }
    
    // MARK: - Setup
    
    private func setupUI() {
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
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            contentView.heightAnchor.constraint(greaterThanOrEqualTo: scrollView.heightAnchor)
        ])
        
        // Illustration
        illustrationImageView.image = UIImage(systemName: "person.crop.circle.badge.plus") // Placeholder
        illustrationImageView.tintColor = DesignSystem.Colors.primary
        illustrationImageView.contentMode = .scaleAspectFit
        illustrationImageView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(illustrationImageView)
        
        // Title
        titleLabel.text = "Create Account"
        titleLabel.font = DesignSystem.Fonts.bold(size: 28)
        titleLabel.textColor = DesignSystem.Colors.textPrimary
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(titleLabel)
        
        subtitleLabel.text = "Join us and start your journey"
        subtitleLabel.font = DesignSystem.Fonts.regular(size: 16)
        subtitleLabel.textColor = DesignSystem.Colors.textSecondary
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(subtitleLabel)
        
        // Fields
        setupTextField(fullNameField, placeholder: "Full Name", icon: "person")
        setupTextField(emailField, placeholder: "Email", icon: "envelope")
        setupTextField(passwordField, placeholder: "Password", icon: "lock", isSecure: true)
        
        contentView.addSubview(fullNameField)
        contentView.addSubview(emailField)
        contentView.addSubview(passwordField)
        
        // Signup Button
        signupButton.setTitle("Create Account", for: .normal)
        signupButton.backgroundColor = DesignSystem.Colors.primary
        signupButton.setTitleColor(.white, for: .normal)
        signupButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 16)
        signupButton.layer.cornerRadius = 8
        signupButton.translatesAutoresizingMaskIntoConstraints = false
        signupButton.addTarget(self, action: #selector(handleSignup), for: .touchUpInside)
        contentView.addSubview(signupButton)
        
        // Login Link
        let attributedText = NSMutableAttributedString(string: "Already have an account? ", attributes: [
            .foregroundColor: DesignSystem.Colors.textSecondary,
            .font: DesignSystem.Fonts.regular(size: 14)
        ])
        attributedText.append(NSAttributedString(string: "Login", attributes: [
            .foregroundColor: DesignSystem.Colors.primary,
            .font: DesignSystem.Fonts.bold(size: 14)
        ]))
        loginLinkButton.setAttributedTitle(attributedText, for: .normal)
        loginLinkButton.translatesAutoresizingMaskIntoConstraints = false
        loginLinkButton.addTarget(self, action: #selector(handleLoginLink), for: .touchUpInside)
        contentView.addSubview(loginLinkButton)
        
        // Constraints
        NSLayoutConstraint.activate([
            illustrationImageView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 40),
            illustrationImageView.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            illustrationImageView.widthAnchor.constraint(equalToConstant: 120),
            illustrationImageView.heightAnchor.constraint(equalToConstant: 120),
            
            titleLabel.topAnchor.constraint(equalTo: illustrationImageView.bottomAnchor, constant: 24),
            titleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            
            subtitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            subtitleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            
            fullNameField.topAnchor.constraint(equalTo: subtitleLabel.bottomAnchor, constant: 32),
            fullNameField.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            fullNameField.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            fullNameField.heightAnchor.constraint(equalToConstant: 50),
            
            emailField.topAnchor.constraint(equalTo: fullNameField.bottomAnchor, constant: 16),
            emailField.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            emailField.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            emailField.heightAnchor.constraint(equalToConstant: 50),
            
            passwordField.topAnchor.constraint(equalTo: emailField.bottomAnchor, constant: 16),
            passwordField.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            passwordField.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            passwordField.heightAnchor.constraint(equalToConstant: 50),
            
            signupButton.topAnchor.constraint(equalTo: passwordField.bottomAnchor, constant: 32),
            signupButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            signupButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            signupButton.heightAnchor.constraint(equalToConstant: 50),
            
            loginLinkButton.topAnchor.constraint(equalTo: signupButton.bottomAnchor, constant: 24),
            loginLinkButton.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            loginLinkButton.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -24)
        ])
    }
    
    private func setupTextField(_ textField: UITextField, placeholder: String, icon: String, isSecure: Bool = false) {
        textField.placeholder = placeholder
        textField.isSecureTextEntry = isSecure
        textField.backgroundColor = .white
        textField.layer.cornerRadius = 8
        textField.layer.borderWidth = 1
        textField.layer.borderColor = UIColor.systemGray5.cgColor
        textField.leftViewMode = .always
        textField.autocapitalizationType = .none
        textField.translatesAutoresizingMaskIntoConstraints = false
        
        let container = UIView(frame: CGRect(x: 0, y: 0, width: 44, height: 50))
        let imgView = UIImageView(image: UIImage(systemName: icon))
        imgView.tintColor = DesignSystem.Colors.textSecondary
        imgView.contentMode = .scaleAspectFit
        imgView.frame = CGRect(x: 12, y: 15, width: 20, height: 20)
        container.addSubview(imgView)
        textField.leftView = container
    }
    
    private func setupAnimations() {
        // Simple Fade In
        contentView.alpha = 0
        UIView.animate(withDuration: 0.6) {
            self.contentView.alpha = 1
        }
    }
    
    // MARK: - Actions
    
    @objc private func handleSignup() {
        guard let name = fullNameField.text, !name.isEmpty,
              let email = emailField.text, !email.isEmpty,
              let password = passwordField.text, !password.isEmpty else {
            showAlert(message: "All fields are required")
            return
        }
        
        // Mock API Call
        signupButton.setTitle("Creating Account...", for: .normal)
        signupButton.isEnabled = false
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            self.signupButton.setTitle("Create Account", for: .normal)
            self.signupButton.isEnabled = true
            
            // Simulating success
            let alert = UIAlertController(title: "Success", message: "Signup Successful! Please Login.", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
                self.dismiss(animated: true) // Go back to Login (assuming it was presented)
            }))
            self.present(alert, animated: true)
        }
    }
    
    @objc private func handleLoginLink() {
        // If pushed, pop. If presented, dismiss.
        if let nav = navigationController {
            nav.popViewController(animated: true)
        } else {
            dismiss(animated: true)
        }
    }
    
    private func showAlert(message: String) {
        let alert = UIAlertController(title: "Error", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
