import UIKit

class ProfileViewController: UIViewController {

    // MARK: - Properties
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Header
    private let headerContainer = UIView()
    private let profileImageView = UIImageView()
    private let cameraButton = UIButton(type: .system)
    
    private let nameLabel = UILabel()
    private let emailLabel = UILabel()
    private let phoneLabel = UILabel()
    private let editButton = UIButton(type: .system)
    
    // Menu
    private let menuContainer = UIStackView()
    
    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Profile"
        
        setupUI()
        setupListeners()
        loadData()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        loadData()
    }
    
    // MARK: - Setup
    
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        // Header Setup
        headerContainer.backgroundColor = .white
        headerContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(headerContainer)
        
        // Profile Image
        profileImageView.backgroundColor = .systemGray5
        profileImageView.layer.cornerRadius = 50
        profileImageView.layer.masksToBounds = true
        profileImageView.contentMode = .scaleAspectFill
        profileImageView.image = UIImage(systemName: "person.fill")
        profileImageView.tintColor = .systemGray3
        profileImageView.translatesAutoresizingMaskIntoConstraints = false
        profileImageView.isUserInteractionEnabled = true
        headerContainer.addSubview(profileImageView)
        
        cameraButton.setImage(UIImage(systemName: "camera.fill"), for: .normal)
        cameraButton.tintColor = .white
        cameraButton.backgroundColor = DesignSystem.Colors.primary
        cameraButton.layer.cornerRadius = 15
        cameraButton.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(cameraButton)
        
        // Info
        nameLabel.font = DesignSystem.Fonts.bold(size: 20)
        nameLabel.textColor = DesignSystem.Colors.textPrimary
        nameLabel.textAlignment = .center
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(nameLabel)
        
        emailLabel.font = DesignSystem.Fonts.regular(size: 14)
        emailLabel.textColor = DesignSystem.Colors.textSecondary
        emailLabel.textAlignment = .center
        emailLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(emailLabel)
        
        phoneLabel.font = DesignSystem.Fonts.regular(size: 14)
        phoneLabel.textColor = DesignSystem.Colors.textSecondary
        phoneLabel.textAlignment = .center
        phoneLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(phoneLabel)
        
        editButton.setTitle("Edit Profile", for: .normal)
        editButton.setTitleColor(DesignSystem.Colors.primary, for: .normal)
        editButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
        editButton.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(editButton)
        
        // Menu Setup
        menuContainer.axis = .vertical
        menuContainer.spacing = 1
        menuContainer.backgroundColor = .systemGray6 // For separator effect
        menuContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(menuContainer)
        
        // Add Menu Items
        addMenuItem(title: "Company Details", icon: "building.2", action: #selector(handleCompanyDetails))
        addMenuItem(title: "Compliance Calendar", icon: "calendar", action: #selector(handleCalendar))
        addMenuItem(title: "My Reports", icon: "chart.bar.doc.horizontal", action: #selector(handleReports))
        addMenuItem(title: "My Compliances", icon: "checkmark.shield", action: #selector(handleCompliances))
        addMenuItem(title: "My Documents", icon: "folder", action: #selector(handleMyDocuments))
        addMenuItem(title: "CRM", icon: "person.3", action: #selector(handleCRM))
        addMenuItem(title: "Change Password", icon: "lock", action: #selector(handleChangePassword))
        addMenuItem(title: "Privacy Policy", icon: "hand.raised", action: #selector(handlePrivacyPolicy))
        addMenuItem(title: "Logout", icon: "arrow.right.square", isDestructive: true, action: #selector(handleLogout))
        
        // Constraints
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
            
            headerContainer.topAnchor.constraint(equalTo: contentView.topAnchor),
            headerContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            headerContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            
            profileImageView.topAnchor.constraint(equalTo: headerContainer.topAnchor, constant: 32),
            profileImageView.centerXAnchor.constraint(equalTo: headerContainer.centerXAnchor),
            profileImageView.widthAnchor.constraint(equalToConstant: 100),
            profileImageView.heightAnchor.constraint(equalToConstant: 100),
            
            cameraButton.bottomAnchor.constraint(equalTo: profileImageView.bottomAnchor),
            cameraButton.trailingAnchor.constraint(equalTo: profileImageView.trailingAnchor),
            cameraButton.widthAnchor.constraint(equalToConstant: 30),
            cameraButton.heightAnchor.constraint(equalToConstant: 30),
            
            nameLabel.topAnchor.constraint(equalTo: profileImageView.bottomAnchor, constant: 16),
            nameLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor, constant: 16),
            nameLabel.trailingAnchor.constraint(equalTo: headerContainer.trailingAnchor, constant: -16),
            
            emailLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            emailLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor, constant: 16),
            emailLabel.trailingAnchor.constraint(equalTo: headerContainer.trailingAnchor, constant: -16),
            
            phoneLabel.topAnchor.constraint(equalTo: emailLabel.bottomAnchor, constant: 4),
            phoneLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor, constant: 16),
            phoneLabel.trailingAnchor.constraint(equalTo: headerContainer.trailingAnchor, constant: -16),
            
            editButton.topAnchor.constraint(equalTo: phoneLabel.bottomAnchor, constant: 16),
            editButton.centerXAnchor.constraint(equalTo: headerContainer.centerXAnchor),
            editButton.bottomAnchor.constraint(equalTo: headerContainer.bottomAnchor, constant: -32),
            
            menuContainer.topAnchor.constraint(equalTo: headerContainer.bottomAnchor, constant: 24),
            menuContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            menuContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            menuContainer.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -32)
        ])
    }
    
    private func addMenuItem(title: String, icon: String, isDestructive: Bool = false, action: Selector) {
        let button = UIButton(type: .system)
        button.backgroundColor = .white
        button.contentHorizontalAlignment = .left
        
        // Inner View
        let container = UIView()
        container.isUserInteractionEnabled = false
        container.translatesAutoresizingMaskIntoConstraints = false
        button.addSubview(container)
        
        let iconView = UIImageView(image: UIImage(systemName: icon))
        iconView.tintColor = isDestructive ? DesignSystem.Colors.error : DesignSystem.Colors.textSecondary
        iconView.contentMode = .scaleAspectFit
        iconView.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(iconView)
        
        let label = UILabel()
        label.text = title
        label.font = DesignSystem.Fonts.regular(size: 16)
        label.textColor = isDestructive ? DesignSystem.Colors.error : DesignSystem.Colors.textPrimary
        label.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(label)
        
        let chevron = UIImageView(image: UIImage(systemName: "chevron.right"))
        chevron.tintColor = .systemGray4
        chevron.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(chevron)
        
        NSLayoutConstraint.activate([
            container.topAnchor.constraint(equalTo: button.topAnchor),
            container.leadingAnchor.constraint(equalTo: button.leadingAnchor),
            container.trailingAnchor.constraint(equalTo: button.trailingAnchor),
            container.bottomAnchor.constraint(equalTo: button.bottomAnchor),
            
            iconView.leadingAnchor.constraint(equalTo: container.leadingAnchor, constant: 24),
            iconView.centerYAnchor.constraint(equalTo: container.centerYAnchor),
            iconView.widthAnchor.constraint(equalToConstant: 24),
            iconView.heightAnchor.constraint(equalToConstant: 24),
            
            label.leadingAnchor.constraint(equalTo: iconView.trailingAnchor, constant: 16),
            label.centerYAnchor.constraint(equalTo: container.centerYAnchor),
            
            chevron.trailingAnchor.constraint(equalTo: container.trailingAnchor, constant: -24),
            chevron.centerYAnchor.constraint(equalTo: container.centerYAnchor)
        ])
        
        button.translatesAutoresizingMaskIntoConstraints = false
        button.heightAnchor.constraint(equalToConstant: 56).isActive = true
        button.addTarget(self, action: action, for: .touchUpInside)
        
        menuContainer.addArrangedSubview(button)
    }
    
    private func setupListeners() {
        editButton.addTarget(self, action: #selector(handleEditProfile), for: .touchUpInside)
        cameraButton.addTarget(self, action: #selector(handleProfileImage), for: .touchUpInside)
        
        // Tap allows image pick too
        let tap = UITapGestureRecognizer(target: self, action: #selector(handleProfileImage))
        profileImageView.addGestureRecognizer(tap)
    }
    
    // MARK: - Handlers
    
    private func loadData() {
        // Mock Data / Session
        nameLabel.text = SessionManager.shared.getUserName()
        emailLabel.text = SessionManager.shared.getUserEmail() ?? "email@example.com"
        phoneLabel.text = "9354784411" // Mock phone
        // In real app, fetch from APIService.shared.getUserProfile()
    }
    
    @objc private func handleEditProfile() {
        let alert = UIAlertController(title: "Edit Profile", message: nil, preferredStyle: .alert)
        
        alert.addTextField { tf in
            tf.placeholder = "Full Name"
            tf.text = self.nameLabel.text
        }
        
        alert.addTextField { tf in
            tf.placeholder = "Phone Number"
            tf.text = self.phoneLabel.text
            tf.keyboardType = .phonePad
        }
        
        alert.addAction(UIAlertAction(title: "Save", style: .default, handler: { _ in
            if let name = alert.textFields?[0].text, let phone = alert.textFields?[1].text {
                // Update UI (Mock)
                self.nameLabel.text = name
                self.phoneLabel.text = phone
                // Call API here
            }
        }))
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        present(alert, animated: true)
    }
    
    @objc private func handleProfileImage() {
        let picker = UIImagePickerController()
        picker.delegate = self
        picker.allowsEditing = true
        picker.sourceType = .photoLibrary
        present(picker, animated: true)
    }
    
    @objc private func handleMyDocuments() {
        let docsVC = DocumentsViewController()
        navigationController?.pushViewController(docsVC, animated: true)
    }
    
    @objc private func handleCompanyDetails() {
        let vc = CompanyDetailsViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleCalendar() {
        let vc = UserCalendarViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleReports() {
        let vc = UserReportsViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleCompliances() {
        let vc = CompliancesViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleCRM() {
        let vc = CrmViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleChangePassword() {
        let alert = UIAlertController(title: "Change Password", message: "Redirecting...", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
    
    @objc private func handlePrivacyPolicy() {
        if let url = URL(string: "https://bizzfilling.com/privacy-policy") {
            UIApplication.shared.open(url)
        }
    }
    
    @objc private func handleLogout() {
        let alert = UIAlertController(title: "Logout", message: "Are you sure you want to logout?", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Logout", style: .destructive, handler: { _ in
            SessionManager.shared.logout()
            // Switch to Login
            let loginVC = UINavigationController(rootViewController: LoginViewController())
            loginVC.modalPresentationStyle = .fullScreen
            self.present(loginVC, animated: true)
        }))
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        present(alert, animated: true)
    }
}

// MARK: - Image Picker
extension ProfileViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        if let image = info[.editedImage] as? UIImage ?? info[.originalImage] as? UIImage {
            profileImageView.image = image
            // Upload Logic Here
        }
        picker.dismiss(animated: true)
    }
}
