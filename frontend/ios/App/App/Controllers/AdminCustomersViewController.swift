import UIKit

class AdminCustomersViewController: UIViewController {

    private let tableView = UITableView()
    private let refreshControl = UIRefreshControl()
    private let activityIndicator = UIActivityIndicatorView(style: .large)
    
    // Header Stats
    private let statsContainer = UIView()
    private let statsLabel = UILabel()
    private let activeLabel = UILabel()
    private let pendingLabel = UILabel()
    private let inactiveLabel = UILabel()
    
    // Data
    private var customerProfiles: [CustomerProfile] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Customers"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        // Stats Header
        statsContainer.backgroundColor = .white
        statsContainer.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(statsContainer)
        
        statsLabel.text = "Loading..."
        statsLabel.font = DesignSystem.Fonts.regular(size: 14)
        statsLabel.textColor = .gray
        statsLabel.translatesAutoresizingMaskIntoConstraints = false
        statsContainer.addSubview(statsLabel)
        
        let stack = UIStackView(arrangedSubviews: [activeLabel, pendingLabel, inactiveLabel])
        stack.axis = .horizontal
        stack.spacing = 10
        stack.distribution = .fillEqually
        stack.translatesAutoresizingMaskIntoConstraints = false
        statsContainer.addSubview(stack)
        
        setupStatLabel(activeLabel, color: .systemGreen)
        setupStatLabel(pendingLabel, color: .systemOrange)
        setupStatLabel(inactiveLabel, color: .systemRed)
        
        // TableView
        tableView.backgroundColor = DesignSystem.Colors.windowBackground
        tableView.separatorStyle = .none
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(CustomerProfileCell.self, forCellReuseIdentifier: "CustomerProfileCell")
        tableView.refreshControl = refreshControl
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        
        // Refresh
        refreshControl.addTarget(self, action: #selector(handleRefresh), for: .valueChanged)
        
        // Loader
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(activityIndicator)
        
        NSLayoutConstraint.activate([
            statsContainer.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            statsContainer.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            statsContainer.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            statsContainer.heightAnchor.constraint(equalToConstant: 80),
            
            statsLabel.topAnchor.constraint(equalTo: statsContainer.topAnchor, constant: 10),
            statsLabel.leadingAnchor.constraint(equalTo: statsContainer.leadingAnchor, constant: 16),
            
            stack.topAnchor.constraint(equalTo: statsLabel.bottomAnchor, constant: 10),
            stack.leadingAnchor.constraint(equalTo: statsContainer.leadingAnchor, constant: 16),
            stack.trailingAnchor.constraint(equalTo: statsContainer.trailingAnchor, constant: -16),
            stack.bottomAnchor.constraint(equalTo: statsContainer.bottomAnchor, constant: -10),
            
            tableView.topAnchor.constraint(equalTo: statsContainer.bottomAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
    
    private func setupStatLabel(_ label: UILabel, color: UIColor) {
        label.font = DesignSystem.Fonts.bold(size: 12)
        label.textColor = color
        label.textAlignment = .center
        label.backgroundColor = color.withAlphaComponent(0.1)
        label.layer.cornerRadius = 4
        label.layer.masksToBounds = true
    }
    
    @objc private func handleRefresh() {
        loadData()
    }
    
    private func loadData() {
        if !refreshControl.isRefreshing {
            activityIndicator.startAnimating()
        }
        
        APIService.shared.getAllCustomerProfiles { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                self?.refreshControl.endRefreshing()
                
                switch result {
                case .success(let props):
                    self?.customerProfiles = props
                    self?.processData(props)
                    self?.tableView.reloadData()
                case .failure(let error):
                    print("Error: \(error.localizedDescription)")
                    // Handle error (alert)
                }
            }
        }
    }
    
    private func processData(_ profiles: [CustomerProfile]) {
        statsLabel.text = "\(profiles.count) customers found"
        
        var active = 0
        var pending = 0
        var inactive = 0
        
        for p in profiles {
            let s = p.status?.uppercased() ?? "ACTIVE"
            if s == "ACTIVE" { active += 1 }
            else if s == "PENDING" { pending += 1 }
            else { inactive += 1 }
        }
        
        activeLabel.text = "Active: \(active)"
        pendingLabel.text = "Pending: \(pending)"
        inactiveLabel.text = "Inactive: \(inactive)"
    }
}

extension AdminCustomersViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return customerProfiles.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "CustomerProfileCell", for: indexPath) as! CustomerProfileCell
        cell.configure(with: customerProfiles[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 100
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        // Show details or edit
    }
}

class CustomerProfileCell: UITableViewCell {
    
    private let containerView = UIView()
    private let initialLabel = UILabel()
    private let nameLabel = UILabel()
    private let emailLabel = UILabel()
    private let phoneLabel = UILabel()
    private let statusLabel = UILabel()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        setupUI()
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    private func setupUI() {
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        initialLabel.backgroundColor = DesignSystem.Colors.primary.withAlphaComponent(0.2)
        initialLabel.textColor = DesignSystem.Colors.primary
        initialLabel.font = DesignSystem.Fonts.bold(size: 18)
        initialLabel.textAlignment = .center
        initialLabel.layer.cornerRadius = 20
        initialLabel.layer.masksToBounds = true
        initialLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(initialLabel)
        
        nameLabel.font = DesignSystem.Fonts.bold(size: 16)
        nameLabel.textColor = DesignSystem.Colors.textPrimary
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(nameLabel)
        
        emailLabel.font = DesignSystem.Fonts.regular(size: 14)
        emailLabel.textColor = .gray
        emailLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(emailLabel)
        
        phoneLabel.font = DesignSystem.Fonts.regular(size: 12)
        phoneLabel.textColor = .gray
        phoneLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(phoneLabel)
        
        statusLabel.font = DesignSystem.Fonts.bold(size: 12)
        statusLabel.layer.cornerRadius = 4
        statusLabel.layer.masksToBounds = true
        statusLabel.textAlignment = .center
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(statusLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            initialLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            initialLabel.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            initialLabel.widthAnchor.constraint(equalToConstant: 40),
            initialLabel.heightAnchor.constraint(equalToConstant: 40),
            
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            nameLabel.leadingAnchor.constraint(equalTo: initialLabel.trailingAnchor, constant: 12),
            nameLabel.trailingAnchor.constraint(equalTo: statusLabel.leadingAnchor, constant: -8),
            
            emailLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            emailLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            
            phoneLabel.topAnchor.constraint(equalTo: emailLabel.bottomAnchor, constant: 4),
            phoneLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            
            statusLabel.centerYAnchor.constraint(equalTo: nameLabel.centerYAnchor),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            statusLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 70),
            statusLabel.heightAnchor.constraint(equalToConstant: 24)
        ])
    }
    
    func configure(with profile: CustomerProfile) {
        let name = profile.user?.fullName ?? "No Name"
        nameLabel.text = name
        emailLabel.text = profile.user?.email ?? "No Email"
        phoneLabel.text = profile.user?.phone ?? profile.whatsappNumber ?? "No Phone"
        
        initialLabel.text = String(name.prefix(1))
        
        let status = profile.status ?? "Active"
        statusLabel.text = "  \(status)  "
        
        if status.uppercased() == "ACTIVE" {
            statusLabel.backgroundColor = UIColor(hex: "#ECFDF5")
            statusLabel.textColor = UIColor(hex: "#10B981")
        } else if status.uppercased() == "PENDING" {
            statusLabel.backgroundColor = UIColor(hex: "#FFFBEB")
            statusLabel.textColor = UIColor(hex: "#D97706")
        } else {
            statusLabel.backgroundColor = UIColor(hex: "#FEF2F2")
            statusLabel.textColor = UIColor(hex: "#EF4444")
        }
    }
}
