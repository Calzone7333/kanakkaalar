import UIKit

class ForgotPasswordViewController: UIViewController {

    // MARK: - Properties
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Step 1: Email
    private let emailContainer = UIView()
    private let emailTitle = UILabel()
    private let emailField = UITextField()
    private let sendLinkButton = UIButton(type: .system)
    
    // Step 2: Reset
    private let resetContainer = UIView()
    private let resetTitle = UILabel()
    private let otpField = UITextField()
    private let newPassField = UITextField()
    private let confirmPassField = UITextField()
    private let resetButton = UIButton(type: .system)
    
    private var currentEmail: String?
    
    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Forgot Password"
        
        setupUI()
        showStep1()
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
        
        setupStep1()
        setupStep2()
    }
    
    private func setupStep1() {
        emailContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(emailContainer)
        
        emailTitle.text = "Enter your registered email address to receive an OTP."
        emailTitle.font = DesignSystem.Fonts.regular(size: 16)
        emailTitle.textColor = DesignSystem.Colors.textSecondary
        emailTitle.numberOfLines = 0
        emailTitle.translatesAutoresizingMaskIntoConstraints = false
        
        setupTextField(emailField, placeholder: "Email Address", icon: "envelope")
        
        sendLinkButton.setTitle("Send OTP", for: .normal)
        sendLinkButton.backgroundColor = DesignSystem.Colors.primary
        sendLinkButton.setTitleColor(.white, for: .normal)
        sendLinkButton.layer.cornerRadius = 8
        sendLinkButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 16)
        sendLinkButton.translatesAutoresizingMaskIntoConstraints = false
        sendLinkButton.addTarget(self, action: #selector(handleSendOTP), for: .touchUpInside)
        
        emailContainer.addSubview(emailTitle)
        emailContainer.addSubview(emailField)
        emailContainer.addSubview(sendLinkButton)
        
        NSLayoutConstraint.activate([
            emailContainer.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 32),
            emailContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            emailContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            emailContainer.bottomAnchor.constraint(equalTo: contentView.bottomAnchor),
            
            emailTitle.topAnchor.constraint(equalTo: emailContainer.topAnchor),
            emailTitle.leadingAnchor.constraint(equalTo: emailContainer.leadingAnchor),
            emailTitle.trailingAnchor.constraint(equalTo: emailContainer.trailingAnchor),
            
            emailField.topAnchor.constraint(equalTo: emailTitle.bottomAnchor, constant: 24),
            emailField.leadingAnchor.constraint(equalTo: emailContainer.leadingAnchor),
            emailField.trailingAnchor.constraint(equalTo: emailContainer.trailingAnchor),
            emailField.heightAnchor.constraint(equalToConstant: 50),
            
            sendLinkButton.topAnchor.constraint(equalTo: emailField.bottomAnchor, constant: 32),
            sendLinkButton.leadingAnchor.constraint(equalTo: emailContainer.leadingAnchor),
            sendLinkButton.trailingAnchor.constraint(equalTo: emailContainer.trailingAnchor),
            sendLinkButton.heightAnchor.constraint(equalToConstant: 50)
        ])
    }
    
    private func setupStep2() {
        resetContainer.isHidden = true
        resetContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(resetContainer)
        
        resetTitle.text = "Enter the OTP sent to your email and set a new password."
        resetTitle.font = DesignSystem.Fonts.regular(size: 16)
        resetTitle.textColor = DesignSystem.Colors.textSecondary
        resetTitle.numberOfLines = 0
        resetTitle.translatesAutoresizingMaskIntoConstraints = false
        
        setupTextField(otpField, placeholder: "OTP Code", icon: "number")
        setupTextField(newPassField, placeholder: "New Password", icon: "lock", isSecure: true)
        setupTextField(confirmPassField, placeholder: "Confirm Password", icon: "lock", isSecure: true)
        
        resetButton.setTitle("Reset Password", for: .normal)
        resetButton.backgroundColor = DesignSystem.Colors.primary
        resetButton.setTitleColor(.white, for: .normal)
        resetButton.layer.cornerRadius = 8
        resetButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 16)
        resetButton.translatesAutoresizingMaskIntoConstraints = false
        resetButton.addTarget(self, action: #selector(handleResetPassword), for: .touchUpInside)
        
        resetContainer.addSubview(resetTitle)
        resetContainer.addSubview(otpField)
        resetContainer.addSubview(newPassField)
        resetContainer.addSubview(confirmPassField)
        resetContainer.addSubview(resetButton)
        
        NSLayoutConstraint.activate([
            resetContainer.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 32),
            resetContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            resetContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            resetContainer.bottomAnchor.constraint(equalTo: contentView.bottomAnchor),
            
            resetTitle.topAnchor.constraint(equalTo: resetContainer.topAnchor),
            resetTitle.leadingAnchor.constraint(equalTo: resetContainer.leadingAnchor),
            resetTitle.trailingAnchor.constraint(equalTo: resetContainer.trailingAnchor),
            
            otpField.topAnchor.constraint(equalTo: resetTitle.bottomAnchor, constant: 24),
            otpField.leadingAnchor.constraint(equalTo: resetContainer.leadingAnchor),
            otpField.trailingAnchor.constraint(equalTo: resetContainer.trailingAnchor),
            otpField.heightAnchor.constraint(equalToConstant: 50),
            
            newPassField.topAnchor.constraint(equalTo: otpField.bottomAnchor, constant: 16),
            newPassField.leadingAnchor.constraint(equalTo: resetContainer.leadingAnchor),
            newPassField.trailingAnchor.constraint(equalTo: resetContainer.trailingAnchor),
            newPassField.heightAnchor.constraint(equalToConstant: 50),
            
            confirmPassField.topAnchor.constraint(equalTo: newPassField.bottomAnchor, constant: 16),
            confirmPassField.leadingAnchor.constraint(equalTo: resetContainer.leadingAnchor),
            confirmPassField.trailingAnchor.constraint(equalTo: resetContainer.trailingAnchor),
            confirmPassField.heightAnchor.constraint(equalToConstant: 50),
            
            resetButton.topAnchor.constraint(equalTo: confirmPassField.bottomAnchor, constant: 32),
            resetButton.leadingAnchor.constraint(equalTo: resetContainer.leadingAnchor),
            resetButton.trailingAnchor.constraint(equalTo: resetContainer.trailingAnchor),
            resetButton.heightAnchor.constraint(equalToConstant: 50)
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
        textField.translatesAutoresizingMaskIntoConstraints = false
        
        let container = UIView(frame: CGRect(x: 0, y: 0, width: 44, height: 50))
        let imgView = UIImageView(image: UIImage(systemName: icon))
        imgView.tintColor = DesignSystem.Colors.textSecondary
        imgView.contentMode = .scaleAspectFit
        imgView.frame = CGRect(x: 12, y: 15, width: 20, height: 20)
        container.addSubview(imgView)
        textField.leftView = container
    }
    
    // MARK: - Actions
    
    @objc private func handleSendOTP() {
        guard let email = emailField.text, !email.isEmpty else {
            showAlert(message: "Please enter your email")
            return
        }
        
        sendLinkButton.isEnabled = false
        sendLinkButton.setTitle("Sending...", for: .normal)
        
        // Mock API
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            self.sendLinkButton.isEnabled = true
            self.sendLinkButton.setTitle("Send OTP", for: .normal)
            
            self.currentEmail = email
            self.showStep2()
            self.showToast(message: "OTP Sent to \(email)")
        }
    }
    
    @objc private func handleResetPassword() {
        guard let otp = otpField.text, !otp.isEmpty,
              let pass = newPassField.text, !pass.isEmpty,
              let confirm = confirmPassField.text, !confirm.isEmpty else {
            showAlert(message: "All fields are required")
            return
        }
        
        if pass != confirm {
            showAlert(message: "Passwords do not match")
            return
        }
        
        resetButton.isEnabled = false
        resetButton.setTitle("Processing...", for: .normal)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            self.resetButton.isEnabled = true
            self.resetButton.setTitle("Reset Password", for: .normal)
            
            let alert = UIAlertController(title: "Success", message: "Password reset successfully. Please login.", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Login", style: .default, handler: { _ in
                self.navigationController?.popViewController(animated: true)
            }))
            self.present(alert, animated: true)
        }
    }
    
    // MARK: - Helper
    
    private func showStep1() {
        emailContainer.isHidden = false
        resetContainer.isHidden = true
    }
    
    private func showStep2() {
        emailContainer.isHidden = true
        resetContainer.isHidden = false
    }
    
    private func showAlert(message: String) {
        let alert = UIAlertController(title: "Alert", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
    
    private func showToast(message: String) {
        let toast = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        present(toast, animated: true)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            toast.dismiss(animated: true)
        }
    }
}
