import UIKit

class AdminWelcomeViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Header
    private let headerContainer = UIView()
    private let welcomeLabel = UILabel()
    private let dateLabel = UILabel()
    private let profileImageView = UIImageView()
    
    // Search
    private let searchContainer = UIView()
    private let searchIcon = UIImageView()
    private let searchField = UITextField()
    
    // Grid
    private let gridStack = UIStackView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Admin Home"
        
        setupUI()
        setupListeners()
        loadData()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: animated)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        navigationController?.setNavigationBarHidden(false, animated: animated)
    }
    
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        // Header
        headerContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(headerContainer)
        
        welcomeLabel.text = "Welcome, Admin"
        welcomeLabel.font = DesignSystem.Fonts.bold(size: 24)
        welcomeLabel.textColor = DesignSystem.Colors.textPrimary
        welcomeLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(welcomeLabel)
        
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        dateLabel.text = formatter.string(from: Date())
        dateLabel.font = DesignSystem.Fonts.regular(size: 14)
        dateLabel.textColor = DesignSystem.Colors.textSecondary
        dateLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(dateLabel)
        
        profileImageView.backgroundColor = .systemGray5
        profileImageView.layer.cornerRadius = 20
        profileImageView.layer.masksToBounds = true
        profileImageView.contentMode = .scaleAspectFill
        profileImageView.image = UIImage(systemName: "person.circle.fill")
        profileImageView.tintColor = .systemGray3
        profileImageView.translatesAutoresizingMaskIntoConstraints = false
        profileImageView.isUserInteractionEnabled = true
        headerContainer.addSubview(profileImageView)
        
        // Search
        searchContainer.backgroundColor = .white
        searchContainer.layer.cornerRadius = 12
        searchContainer.layer.shadowColor = UIColor.black.cgColor
        searchContainer.layer.shadowOpacity = 0.05
        searchContainer.layer.shadowOffset = CGSize(width: 0, height: 2)
        searchContainer.layer.shadowRadius = 4
        searchContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(searchContainer)
        
        searchIcon.image = UIImage(systemName: "magnifyingglass")
        searchIcon.tintColor = DesignSystem.Colors.textSecondary
        searchIcon.translatesAutoresizingMaskIntoConstraints = false
        searchContainer.addSubview(searchIcon)
        
        searchField.placeholder = "Search anything..."
        searchField.font = DesignSystem.Fonts.regular(size: 16)
        searchField.translatesAutoresizingMaskIntoConstraints = false
        searchContainer.addSubview(searchField)
        
        // Grid
        gridStack.axis = .vertical
        gridStack.spacing = 16
        gridStack.distribution = .fillEqually
        gridStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(gridStack)
        
        let row1 = UIStackView()
        row1.axis = .horizontal
        row1.spacing = 16
        row1.distribution = .fillEqually
        
        let row2 = UIStackView()
        row2.axis = .horizontal
        row2.spacing = 16
        row2.distribution = .fillEqually
        
        let row3 = UIStackView()
        row3.axis = .horizontal
        row3.spacing = 16
        row3.distribution = .fillEqually
        
        row1.addArrangedSubview(createCard(title: "Users", icon: "person.2.fill", color: .systemBlue, action: #selector(handleUsers)))
        row1.addArrangedSubview(createCard(title: "Orders", icon: "list.clipboard.fill", color: .systemGreen, action: #selector(handleOrders)))
        
        row2.addArrangedSubview(createCard(title: "Agents", icon: "briefcase.fill", color: .systemOrange, action: #selector(handleAgents)))
        row2.addArrangedSubview(createCard(title: "Experts", icon: "star.circle.fill", color: .systemPurple, action: #selector(handleReports)))
        
        row3.addArrangedSubview(createCard(title: "CRM / Leads", icon: "person.3.fill", color: .systemTeal, action: #selector(handleCRM)))
        row3.addArrangedSubview(createCard(title: "Settings", icon: "gearshape.fill", color: .systemGray, action: #selector(handleSettings)))
        
        gridStack.addArrangedSubview(row1)
        gridStack.addArrangedSubview(row2)
        gridStack.addArrangedSubview(row3)
        
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
            
            headerContainer.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 16),
            headerContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            headerContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            headerContainer.heightAnchor.constraint(equalToConstant: 60),
            
            welcomeLabel.topAnchor.constraint(equalTo: headerContainer.topAnchor),
            welcomeLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor),
            
            dateLabel.topAnchor.constraint(equalTo: welcomeLabel.bottomAnchor, constant: 4),
            dateLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor),
            
            profileImageView.centerYAnchor.constraint(equalTo: headerContainer.centerYAnchor),
            profileImageView.trailingAnchor.constraint(equalTo: headerContainer.trailingAnchor),
            profileImageView.widthAnchor.constraint(equalToConstant: 40),
            profileImageView.heightAnchor.constraint(equalToConstant: 40),
            
            searchContainer.topAnchor.constraint(equalTo: headerContainer.bottomAnchor, constant: 24),
            searchContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            searchContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            searchContainer.heightAnchor.constraint(equalToConstant: 50),
            
            searchIcon.leadingAnchor.constraint(equalTo: searchContainer.leadingAnchor, constant: 16),
            searchIcon.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor),
            searchIcon.widthAnchor.constraint(equalToConstant: 20),
            searchIcon.heightAnchor.constraint(equalToConstant: 20),
            
            searchField.leadingAnchor.constraint(equalTo: searchIcon.trailingAnchor, constant: 12),
            searchField.trailingAnchor.constraint(equalTo: searchContainer.trailingAnchor, constant: -16),
            searchField.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor),
            
            gridStack.topAnchor.constraint(equalTo: searchContainer.bottomAnchor, constant: 32),
            gridStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            gridStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            gridStack.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -32),
            gridStack.heightAnchor.constraint(equalToConstant: 360) // 3 rows * ~110 + spacing
        ])
    }
    
    private func createCard(title: String, icon: String, color: UIColor, action: Selector) -> UIView {
        let container = UIView()
        container.backgroundColor = .white
        container.layer.cornerRadius = 16
        container.layer.shadowColor = UIColor.black.cgColor
        container.layer.shadowOpacity = 0.05
        container.layer.shadowOffset = CGSize(width: 0, height: 2)
        container.layer.shadowRadius = 4
        
        let iconView = UIImageView(image: UIImage(systemName: icon))
        iconView.tintColor = color
        iconView.contentMode = .scaleAspectFit
        iconView.translatesAutoresizingMaskIntoConstraints = false
        
        let label = UILabel()
        label.text = title
        label.font = DesignSystem.Fonts.bold(size: 16)
        label.textColor = DesignSystem.Colors.textPrimary
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        
        container.addSubview(iconView)
        container.addSubview(label)
        
        NSLayoutConstraint.activate([
            iconView.centerXAnchor.constraint(equalTo: container.centerXAnchor),
            iconView.centerYAnchor.constraint(equalTo: container.centerYAnchor, constant: -12),
            iconView.widthAnchor.constraint(equalToConstant: 32),
            iconView.heightAnchor.constraint(equalToConstant: 32),
            
            label.topAnchor.constraint(equalTo: iconView.bottomAnchor, constant: 12),
            label.leadingAnchor.constraint(equalTo: container.leadingAnchor, constant: 8),
            label.trailingAnchor.constraint(equalTo: container.trailingAnchor, constant: -8)
        ])
        
        let tap = UITapGestureRecognizer(target: self, action: action)
        container.addGestureRecognizer(tap)
        container.isUserInteractionEnabled = true
        
        return container
    }
    
    private func setupListeners() {
        let profileTap = UITapGestureRecognizer(target: self, action: #selector(handleProfile))
        profileImageView.addGestureRecognizer(profileTap)
    }
    
    private func loadData() {
        welcomeLabel.text = "Welcome, \(SessionManager.shared.getUserName())"
    }
    
    // MARK: - Actions
    
    @objc private func handleUsers() {
        let vc = AdminCustomersViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleOrders() {
        let vc = AdminOrdersViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleAgents() {
        let vc = AdminAgentsViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleReports() {
        // Renaming Reports slot to Experts as Reports is placeholder
        let vc = AdminExpertsViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleCRM() {
        let vc = AdminCrmViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleSettings() {
        let vc = AdminSettingsViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleProfile() {
        let vc = ProfileViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    private func showToast(message: String) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        present(alert, animated: true)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            alert.dismiss(animated: true)
        }
    }
}
