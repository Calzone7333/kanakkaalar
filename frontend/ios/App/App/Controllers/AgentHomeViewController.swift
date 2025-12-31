import UIKit

class AgentHomeViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private let refreshControl = UIRefreshControl()
    
    // Header
    private let headerContainer = UIView()
    private let helloLabel = UILabel()
    private let roleLabel = UILabel()
    private let profileImageView = UIImageView()
    
    // Stats
    private let statsStack = UIStackView()
    private var statsCards: [StatCard] = []
    
    // Recent Activity (Placeholder for quick links or list)
    private let actionStack = UIStackView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Agent Dashboard"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.refreshControl = refreshControl
        refreshControl.addTarget(self, action: #selector(handleRefresh), for: .valueChanged)
        
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        // Header
        headerContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(headerContainer)
        
        profileImageView.image = UIImage(systemName: "person.circle.fill")
        profileImageView.tintColor = .systemGray4
        profileImageView.layer.cornerRadius = 24
        profileImageView.layer.masksToBounds = true
        profileImageView.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(profileImageView)
        
        helloLabel.text = "Hello, Agent"
        helloLabel.font = DesignSystem.Fonts.bold(size: 20)
        helloLabel.textColor = DesignSystem.Colors.textPrimary
        helloLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(helloLabel)
        
        roleLabel.text = "Agent Dashboard"
        roleLabel.font = DesignSystem.Fonts.regular(size: 14)
        roleLabel.textColor = DesignSystem.Colors.textSecondary
        roleLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(roleLabel)
        
        // Stats
        statsStack.axis = .horizontal
        statsStack.spacing = 16
        statsStack.distribution = .fillEqually
        statsStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(statsStack)
        
        // Create Stat Cards
        let c1 = StatCard(title: "Wallet Balance", value: "₹0", color: .systemGreen)
        let c2 = StatCard(title: "Active Referrals", value: "0", color: .systemBlue)
        let c3 = StatCard(title: "Pending Orders", value: "0", color: .systemOrange)
        
        statsCards = [c1, c2, c3]
        for card in statsCards {
            statsStack.addArrangedSubview(card)
        }
        
        // Action Stack
        actionStack.axis = .vertical
        actionStack.spacing = 16
        actionStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(actionStack)
        
        let addOrderBtn = UIButton(type: .system)
        addOrderBtn.setTitle("Create New Order", for: .normal)
        addOrderBtn.backgroundColor = DesignSystem.Colors.primary
        addOrderBtn.setTitleColor(.white, for: .normal)
        addOrderBtn.titleLabel?.font = DesignSystem.Fonts.bold(size: 16)
        addOrderBtn.layer.cornerRadius = 8
        addOrderBtn.heightAnchor.constraint(equalToConstant: 50).isActive = true
        addOrderBtn.addTarget(self, action: #selector(handleCreateOrder), for: .touchUpInside)
        
        let referUserBtn = UIButton(type: .system)
        referUserBtn.setTitle("Refer New User", for: .normal)
        referUserBtn.backgroundColor = .white
        referUserBtn.setTitleColor(DesignSystem.Colors.primary, for: .normal)
        referUserBtn.titleLabel?.font = DesignSystem.Fonts.bold(size: 16)
        referUserBtn.layer.cornerRadius = 8
        referUserBtn.layer.borderWidth = 1
        referUserBtn.layer.borderColor = DesignSystem.Colors.primary.cgColor
        referUserBtn.heightAnchor.constraint(equalToConstant: 50).isActive = true
        referUserBtn.addTarget(self, action: #selector(handleReferUser), for: .touchUpInside)
        
        actionStack.addArrangedSubview(addOrderBtn)
        actionStack.addArrangedSubview(referUserBtn)
        
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
            
            profileImageView.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor),
            profileImageView.centerYAnchor.constraint(equalTo: headerContainer.centerYAnchor),
            profileImageView.widthAnchor.constraint(equalToConstant: 48),
            profileImageView.heightAnchor.constraint(equalToConstant: 48),
            
            helloLabel.leadingAnchor.constraint(equalTo: profileImageView.trailingAnchor, constant: 12),
            helloLabel.topAnchor.constraint(equalTo: headerContainer.topAnchor, constant: 8),
            
            roleLabel.leadingAnchor.constraint(equalTo: helloLabel.leadingAnchor),
            roleLabel.topAnchor.constraint(equalTo: helloLabel.bottomAnchor, constant: 4),
            
            statsStack.topAnchor.constraint(equalTo: headerContainer.bottomAnchor, constant: 24),
            statsStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            statsStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            statsStack.heightAnchor.constraint(equalToConstant: 100),
            
            actionStack.topAnchor.constraint(equalTo: statsStack.bottomAnchor, constant: 32),
            actionStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            actionStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            actionStack.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -32)
        ])
    }
    
    @objc private func handleRefresh() {
        loadData()
    }
    
    private func loadData() {
        let name = SessionManager.shared.getUserName()
        helloLabel.text = "Hello, \(name)"
        
        APIService.shared.getAgentWallet { [weak self] result in
            DispatchQueue.main.async {
                self?.refreshControl.endRefreshing()
                switch result {
                case .success(let wallet):
                    let formatter = NumberFormatter()
                    formatter.numberStyle = .currency
                    formatter.currencySymbol = "₹"
                    let bal = formatter.string(from: NSNumber(value: wallet.balance)) ?? "₹0.00"
                    self?.statsCards[0].setValue(bal)
                case .failure:
                    self?.statsCards[0].setValue("₹0.00") // Fallback
                }
            }
        }
        
        // Mock other stats for parity/until real endpoints exist
        statsCards[1].setValue("8") 
        statsCards[2].setValue("2")
    }
    
    @objc private func handleCreateOrder() {
        let vc = ServicesViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleReferUser() {
        let alert = UIAlertController(title: "Refer User", message: "Enter email of the user you want to refer.", preferredStyle: .alert)
        alert.addTextField { tf in tf.placeholder = "Client Email" }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Refer", style: .default, handler: { _ in
            // Mock API or implement real logic
            // Ideally call APIService.referUser(...)
        }))
        present(alert, animated: true)
    }
}

// MARK: - StatCard

private class StatCard: UIView {
    private let valueLabel = UILabel()
    
    init(title: String, value: String, color: UIColor) {
        super.init(frame: .zero)
        backgroundColor = .white
        layer.cornerRadius = 12
        layer.borderWidth = 1
        layer.borderColor = UIColor.systemGray5.cgColor
        
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = DesignSystem.Fonts.regular(size: 12)
        titleLabel.textColor = DesignSystem.Colors.textSecondary
        titleLabel.numberOfLines = 2
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        valueLabel.text = value
        valueLabel.font = DesignSystem.Fonts.bold(size: 18)
        valueLabel.textColor = color
        valueLabel.translatesAutoresizingMaskIntoConstraints = false
        
        addSubview(titleLabel)
        addSubview(valueLabel)
        
        NSLayoutConstraint.activate([
            valueLabel.centerYAnchor.constraint(equalTo: centerYAnchor, constant: -8),
            valueLabel.centerXAnchor.constraint(equalTo: centerXAnchor),
            
            titleLabel.topAnchor.constraint(equalTo: valueLabel.bottomAnchor, constant: 4),
            titleLabel.centerXAnchor.constraint(equalTo: centerXAnchor),
            titleLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 4),
            titleLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -4)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func setValue(_ value: String) {
        valueLabel.text = value
    }
}
