import UIKit

class EmployeeSalesViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Revenue Stats
    private let revenueStack = UIStackView()
    private var cards: [SalesStatCard] = []
    
    // High Value Orders
    private let listHeader = UILabel()
    private let tableView = UITableView()
    
    // Data
    private struct Deal {
        let client: String
        let service: String
        let amount: String
        let stage: String
    }
    
    private var deals: [Deal] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "My Sales"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        revenueStack.axis = .vertical
        revenueStack.spacing = 16
        revenueStack.distribution = .fillEqually
        revenueStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(revenueStack)
        
        // Row 1
        let row1 = UIStackView()
        row1.axis = .horizontal
        row1.spacing = 16
        row1.distribution = .fillEqually
        
        // Row 2
        let row2 = UIStackView()
        row2.axis = .horizontal
        row2.spacing = 16
        row2.distribution = .fillEqually
        
        let c1 = SalesStatCard(title: "Total Revenue", value: "₹0", color: .systemBlue)
        let c2 = SalesStatCard(title: "Realized", value: "₹0", color: .systemGreen)
        let c3 = SalesStatCard(title: "Pipeline", value: "₹0", color: .systemOrange)
        let c4 = SalesStatCard(title: "Active Clients", value: "0", color: .systemPurple)
        
        cards = [c1, c2, c3, c4]
        
        row1.addArrangedSubview(c1)
        row1.addArrangedSubview(c2)
        row2.addArrangedSubview(c3)
        row2.addArrangedSubview(c4)
        
        revenueStack.addArrangedSubview(row1)
        revenueStack.addArrangedSubview(row2)
        
        // List Header
        listHeader.text = "High Value Deals"
        listHeader.font = DesignSystem.Fonts.bold(size: 18)
        listHeader.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(listHeader)
        
        // TableView
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(EmployeeSalesCell.self, forCellReuseIdentifier: "EmployeeSalesCell")
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
            
            revenueStack.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 16),
            revenueStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            revenueStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            revenueStack.heightAnchor.constraint(equalToConstant: 200),
            
            listHeader.topAnchor.constraint(equalTo: revenueStack.bottomAnchor, constant: 24),
            listHeader.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            
            tableView.topAnchor.constraint(equalTo: listHeader.bottomAnchor, constant: 12),
            tableView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20),
            tableView.heightAnchor.constraint(equalToConstant: 400) // Placeholder
        ])
    }
    
    private func loadData() {
        cards[0].setValue("₹12.5L")
        cards[1].setValue("₹8.2L")
        cards[2].setValue("₹4.3L")
        cards[3].setValue("24")
        
        deals = [
            Deal(client: "Tech Corp", service: "App Development", amount: "₹5.0L", stage: "Won"),
            Deal(client: "Global Traders", service: "Enterprise ERP", amount: "₹3.2L", stage: "Negotiation"),
            Deal(client: "Startup Hub", service: "Website Redesign", amount: "₹1.5L", stage: "Proposal"),
            Deal(client: "Retail King", service: "POS System", amount: "₹80k", stage: "Lost")
        ]
        
        tableView.reloadData()
        tableView.heightAnchor.constraint(equalToConstant: CGFloat(deals.count * 90)).isActive = true
    }
}

extension EmployeeSalesViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return deals.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "EmployeeSalesCell", for: indexPath) as! EmployeeSalesCell
        cell.configure(with: deals[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 90
    }
}

class SalesStatCard: UIView {
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
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        valueLabel.text = value
        valueLabel.font = DesignSystem.Fonts.bold(size: 20)
        valueLabel.textColor = color
        valueLabel.translatesAutoresizingMaskIntoConstraints = false
        
        addSubview(titleLabel)
        addSubview(valueLabel)
        
        NSLayoutConstraint.activate([
            valueLabel.centerYAnchor.constraint(equalTo: centerYAnchor, constant: -8),
            valueLabel.centerXAnchor.constraint(equalTo: centerXAnchor),
            
            titleLabel.topAnchor.constraint(equalTo: valueLabel.bottomAnchor, constant: 4),
            titleLabel.centerXAnchor.constraint(equalTo: centerXAnchor)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func setValue(_ value: String) {
        valueLabel.text = value
    }
}

class EmployeeSalesCell: UITableViewCell {
    private let containerView = UIView()
    private let clientLabel = UILabel()
    private let serviceLabel = UILabel()
    private let amountLabel = UILabel()
    private let stageLabel = UILabel()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        clientLabel.font = DesignSystem.Fonts.bold(size: 16)
        clientLabel.textColor = DesignSystem.Colors.textPrimary
        clientLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(clientLabel)
        
        serviceLabel.font = DesignSystem.Fonts.regular(size: 14)
        serviceLabel.textColor = DesignSystem.Colors.textSecondary
        serviceLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(serviceLabel)
        
        amountLabel.font = DesignSystem.Fonts.bold(size: 16)
        amountLabel.textColor = DesignSystem.Colors.primary
        amountLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(amountLabel)
        
        stageLabel.font = DesignSystem.Fonts.bold(size: 12)
        stageLabel.layer.cornerRadius = 4
        stageLabel.layer.masksToBounds = true
        stageLabel.textAlignment = .center
        stageLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(stageLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            clientLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            clientLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            serviceLabel.topAnchor.constraint(equalTo: clientLabel.bottomAnchor, constant: 4),
            serviceLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            amountLabel.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            amountLabel.trailingAnchor.constraint(equalTo: stageLabel.leadingAnchor, constant: -16),
            
            stageLabel.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            stageLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            stageLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 80),
            stageLabel.heightAnchor.constraint(equalToConstant: 24)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with deal: EmployeeSalesViewController.Deal) {
        clientLabel.text = deal.client
        serviceLabel.text = deal.service
        amountLabel.text = deal.amount
        stageLabel.text = deal.stage
        
        switch deal.stage {
        case "Won":
            stageLabel.backgroundColor = UIColor(hex: "#ECFDF5")
            stageLabel.textColor = UIColor(hex: "#059669")
        case "Lost":
            stageLabel.backgroundColor = UIColor(hex: "#FEF2F2")
            stageLabel.textColor = UIColor(hex: "#DC2626")
        default:
            stageLabel.backgroundColor = UIColor(hex: "#FFFBEB")
            stageLabel.textColor = UIColor(hex: "#D97706")
        }
    }
}
