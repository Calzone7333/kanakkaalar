import UIKit

class EmployeeLeadsViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Stats
    private let statsStack = UIStackView()
    private var statsCards: [StatCard] = []
    
    // List
    private let searchContainer = UIView()
    private let searchField = UITextField()
    private let tableView = UITableView()
    
    // Data
    private struct Lead {
        let name: String
        let service: String
        let status: String
        let phone: String
        let email: String
    }
    
    private var allLeads: [Lead] = []
    private var displayedLeads: [Lead] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "My Leads"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        // Stats
        statsStack.axis = .horizontal
        statsStack.spacing = 8
        statsStack.distribution = .fillEqually
        statsStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(statsStack)
        
        let card1 = StatCard(title: "New", value: "0", color: .systemBlue)
        let card2 = StatCard(title: "Converted", value: "0", color: .systemGreen)
        let card3 = StatCard(title: "Lost", value: "0", color: .systemRed)
        let card4 = StatCard(title: "Follow Up", value: "0", color: .systemOrange)
        
        statsCards = [card1, card2, card3, card4]
        for card in statsCards {
            statsStack.addArrangedSubview(card)
        }
        
        // Search
        searchContainer.backgroundColor = .white
        searchContainer.layer.cornerRadius = 8
        searchContainer.layer.borderWidth = 1
        searchContainer.layer.borderColor = UIColor.systemGray5.cgColor
        searchContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(searchContainer)
        
        let searchIcon = UIImageView(image: UIImage(systemName: "magnifyingglass"))
        searchIcon.tintColor = .gray
        searchIcon.translatesAutoresizingMaskIntoConstraints = false
        searchContainer.addSubview(searchIcon)
        
        searchField.placeholder = "Search leads..."
        searchField.font = DesignSystem.Fonts.regular(size: 14)
        searchField.addTarget(self, action: #selector(handleSearchChanged), for: .editingChanged)
        searchField.translatesAutoresizingMaskIntoConstraints = false
        searchContainer.addSubview(searchField)
        
        // TableView
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(EmployeeLeadCell.self, forCellReuseIdentifier: "EmployeeLeadCell")
        tableView.separatorStyle = .none
        tableView.backgroundColor = .clear
        tableView.isScrollEnabled = false
        tableView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(tableView)
        
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
            
            statsStack.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 16),
            statsStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            statsStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            statsStack.heightAnchor.constraint(equalToConstant: 80),
            
            searchContainer.topAnchor.constraint(equalTo: statsStack.bottomAnchor, constant: 16),
            searchContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            searchContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            searchContainer.heightAnchor.constraint(equalToConstant: 44),
            
            searchIcon.leadingAnchor.constraint(equalTo: searchContainer.leadingAnchor, constant: 12),
            searchIcon.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor),
            searchIcon.widthAnchor.constraint(equalToConstant: 20),
            searchIcon.heightAnchor.constraint(equalToConstant: 20),
            
            searchField.leadingAnchor.constraint(equalTo: searchIcon.trailingAnchor, constant: 8),
            searchField.trailingAnchor.constraint(equalTo: searchContainer.trailingAnchor, constant: -12),
            searchField.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor),
            searchField.heightAnchor.constraint(equalToConstant: 40),
            
            tableView.topAnchor.constraint(equalTo: searchContainer.bottomAnchor, constant: 12),
            tableView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20),
            tableView.heightAnchor.constraint(equalToConstant: 500) // Placeholder
        ])
    }
    
    private func loadData() {
        allLeads = [
            Lead(name: "John Doe", service: "GST Registration", status: "New", phone: "9876543210", email: "john@example.com"),
            Lead(name: "Tech Solutions", service: "Import Code", status: "Converted", phone: "8765432109", email: "info@techsol.com"),
            Lead(name: "Global Exports", service: "Company Formation", status: "Contacted", phone: "7654321098", email: "contact@global.com"),
            Lead(name: "Retail King", service: "FSSAI", status: "Lost", phone: "6543210987", email: "retail@king.com"),
            Lead(name: "StartUp Hub", service: "Trademark", status: "New", phone: "9988776655", email: "hub@startup.com")
        ]
        
        applyFilters()
        calculateStats()
    }
    
    private func calculateStats() {
        var newL = 0, conv = 0, lost = 0, follow = 0
        
        for l in allLeads {
            if l.status == "New" { newL += 1 }
            else if l.status == "Converted" { conv += 1 }
            else if l.status == "Lost" { lost += 1 }
            else if l.status == "Contacted" { follow += 1 }
        }
        
        statsCards[0].setValue(String(newL))
        statsCards[1].setValue(String(conv))
        statsCards[2].setValue(String(lost))
        statsCards[3].setValue(String(follow))
    }
    
    @objc private func handleSearchChanged() {
        applyFilters()
    }
    
    private func applyFilters() {
        let query = searchField.text?.lowercased() ?? ""
        
        if query.isEmpty {
            displayedLeads = allLeads
        } else {
            displayedLeads = allLeads.filter {
                $0.name.lowercased().contains(query) ||
                $0.email.lowercased().contains(query)
            }
        }
        
        tableView.reloadData()
        // Adjust height
        tableView.heightAnchor.constraint(equalToConstant: CGFloat(displayedLeads.count * 110)).isActive = true
    }
}

extension EmployeeLeadsViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return displayedLeads.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "EmployeeLeadCell", for: indexPath) as! EmployeeLeadCell
        cell.configure(with: displayedLeads[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 110
    }
}

class StatCard: UIView {
    private let valueLabel = UILabel()
    
    init(title: String, value: String, color: UIColor) {
        super.init(frame: .zero)
        backgroundColor = .white
        layer.cornerRadius = 8
        layer.borderWidth = 1
        layer.borderColor = UIColor.systemGray6.cgColor
        
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = DesignSystem.Fonts.regular(size: 10)
        titleLabel.textColor = DesignSystem.Colors.textSecondary
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        valueLabel.text = value
        valueLabel.font = DesignSystem.Fonts.bold(size: 18)
        valueLabel.textColor = color
        valueLabel.textAlignment = .center
        valueLabel.translatesAutoresizingMaskIntoConstraints = false
        
        addSubview(titleLabel)
        addSubview(valueLabel)
        
        NSLayoutConstraint.activate([
            valueLabel.centerYAnchor.constraint(equalTo: centerYAnchor, constant: -6),
            valueLabel.centerXAnchor.constraint(equalTo: centerXAnchor),
            
            titleLabel.topAnchor.constraint(equalTo: valueLabel.bottomAnchor, constant: 2),
            titleLabel.centerXAnchor.constraint(equalTo: centerXAnchor)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func setValue(_ value: String) {
        valueLabel.text = value
    }
}

class EmployeeLeadCell: UITableViewCell {
    private let containerView = UIView()
    private let nameLabel = UILabel()
    private let serviceLabel = UILabel()
    private let statusLabel = UILabel()
    private let phoneLabel = UILabel()
    private let emailLabel = UILabel()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        nameLabel.font = DesignSystem.Fonts.bold(size: 16)
        nameLabel.textColor = DesignSystem.Colors.textPrimary
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(nameLabel)
        
        serviceLabel.font = DesignSystem.Fonts.regular(size: 14)
        serviceLabel.textColor = DesignSystem.Colors.textSecondary
        serviceLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(serviceLabel)
        
        statusLabel.font = DesignSystem.Fonts.bold(size: 12)
        statusLabel.layer.cornerRadius = 4
        statusLabel.layer.masksToBounds = true
        statusLabel.textAlignment = .center
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(statusLabel)
        
        phoneLabel.font = DesignSystem.Fonts.regular(size: 12)
        phoneLabel.textColor = .systemGray
        phoneLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(phoneLabel)
        
        emailLabel.font = DesignSystem.Fonts.regular(size: 12)
        emailLabel.textColor = .systemGray
        emailLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(emailLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            nameLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            serviceLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            serviceLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            statusLabel.centerYAnchor.constraint(equalTo: nameLabel.centerYAnchor),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            statusLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 80),
            statusLabel.heightAnchor.constraint(equalToConstant: 24),
            
            phoneLabel.topAnchor.constraint(equalTo: serviceLabel.bottomAnchor, constant: 8),
            phoneLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            emailLabel.topAnchor.constraint(equalTo: phoneLabel.bottomAnchor, constant: 2),
            emailLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            emailLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with lead: EmployeeLeadsViewController.Lead) {
        nameLabel.text = lead.name
        serviceLabel.text = lead.service
        statusLabel.text = lead.status
        phoneLabel.text = "Phone: \(lead.phone)"
        emailLabel.text = "Email: \(lead.email)"
        
        switch lead.status {
        case "Converted":
            statusLabel.backgroundColor = UIColor(hex: "#F0FDF4")
            statusLabel.textColor = UIColor(hex: "#16A34A")
        case "Lost":
            statusLabel.backgroundColor = UIColor(hex: "#FEF2F2")
            statusLabel.textColor = UIColor(hex: "#DC2626")
        case "Contacted":
            statusLabel.backgroundColor = UIColor(hex: "#FFFBEB")
            statusLabel.textColor = UIColor(hex: "#D97706")
        default:
            statusLabel.backgroundColor = UIColor(hex: "#EFF6FF")
            statusLabel.textColor = UIColor(hex: "#2563EB")
        }
    }
}
