import UIKit

class UserReportsViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Stats Grid
    private let statsStack = UIStackView()
    private var statsCards: [StatsCard] = []
    
    // Recent Orders
    private let recentLabel = UILabel()
    private let recentTableView = UITableView()
    
    // Mock Data
    private struct Order {
        let id: String
        let serviceName: String
        let status: String
        let date: String
    }
    
    private var recentOrders: [Order] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Reports"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        // Stats
        statsStack.axis = .vertical
        statsStack.spacing = 16
        statsStack.distribution = .fillEqually
        statsStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(statsStack)
        
        // Create 2 rows of 2 columns
        let row1 = UIStackView()
        row1.axis = .horizontal
        row1.spacing = 16
        row1.distribution = .fillEqually
        
        let row2 = UIStackView()
        row2.axis = .horizontal
        row2.spacing = 16
        row2.distribution = .fillEqually
        
        let card1 = StatsCard(title: "Total Orders", value: "0", color: DesignSystem.Colors.primary)
        let card2 = StatsCard(title: "In Progress", value: "0", color: .systemBlue)
        let card3 = StatsCard(title: "Needs Attention", value: "0", color: .systemOrange)
        let card4 = StatsCard(title: "Completed", value: "0", color: .systemGreen)
        
        statsCards = [card1, card2, card3, card4]
        
        row1.addArrangedSubview(card1)
        row1.addArrangedSubview(card2)
        row2.addArrangedSubview(card3)
        row2.addArrangedSubview(card4)
        
        statsStack.addArrangedSubview(row1)
        statsStack.addArrangedSubview(row2)
        
        // Recent Orders
        recentLabel.text = "Recent Orders"
        recentLabel.font = DesignSystem.Fonts.bold(size: 18)
        recentLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(recentLabel)
        
        recentTableView.dataSource = self
        recentTableView.delegate = self
        recentTableView.register(ReportOrderCell.self, forCellReuseIdentifier: "ReportOrderCell")
        recentTableView.isScrollEnabled = false // Let main scrollview handle it
        recentTableView.separatorStyle = .none
        recentTableView.backgroundColor = .clear
        recentTableView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(recentTableView)
        
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
            
            statsStack.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 24),
            statsStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            statsStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            statsStack.heightAnchor.constraint(equalToConstant: 200), // 2 rows * ~90 + spacing
            
            recentLabel.topAnchor.constraint(equalTo: statsStack.bottomAnchor, constant: 32),
            recentLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            
            recentTableView.topAnchor.constraint(equalTo: recentLabel.bottomAnchor, constant: 16),
            recentTableView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            recentTableView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            recentTableView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20),
            recentTableView.heightAnchor.constraint(equalToConstant: 400) // Estimate height or dynamic
        ])
    }
    
    private func loadData() {
        // Mock Data
        recentOrders = [
            Order(id: "ORD-001", serviceName: "GST Registration", status: "In Progress", date: "2023-12-01"),
            Order(id: "ORD-002", serviceName: "Company Incorporation", status: "Completed", date: "2023-11-15"),
            Order(id: "ORD-003", serviceName: "Trademark Filing", status: "Needs Attention", date: "2023-12-05")
        ]
        
        statsCards[0].setValue("12")
        statsCards[1].setValue("5")
        statsCards[2].setValue("1")
        statsCards[3].setValue("6")
        
        recentTableView.reloadData()
        
        // Update Table Height
        let height = CGFloat(recentOrders.count * 100)
        recentTableView.heightAnchor.constraint(equalToConstant: height).isActive = true
    }
}

// MARK: - Table View
extension UserReportsViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return recentOrders.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ReportOrderCell", for: indexPath) as! ReportOrderCell
        cell.configure(with: recentOrders[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 100
    }
}

// MARK: - Components
class StatsCard: UIView {
    private let valueLabel = UILabel()
    
    init(title: String, value: String, color: UIColor) {
        super.init(frame: .zero)
        backgroundColor = .white
        layer.cornerRadius = 12
        layer.borderWidth = 1
        layer.borderColor = UIColor.systemGray5.cgColor
        
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = DesignSystem.Fonts.regular(size: 14)
        titleLabel.textColor = DesignSystem.Colors.textSecondary
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        valueLabel.text = value
        valueLabel.font = DesignSystem.Fonts.bold(size: 24)
        valueLabel.textColor = color
        valueLabel.translatesAutoresizingMaskIntoConstraints = false
        
        addSubview(titleLabel)
        addSubview(valueLabel)
        
        NSLayoutConstraint.activate([
            valueLabel.centerYAnchor.constraint(equalTo: centerYAnchor, constant: -10),
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

class ReportOrderCell: UITableViewCell {
    private let containerView = UIView()
    private let titleLabel = UILabel()
    private let statusLabel = UILabel()
    private let idLabel = UILabel()
    private let dateLabel = UILabel()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        titleLabel.font = DesignSystem.Fonts.bold(size: 16)
        statusLabel.font = DesignSystem.Fonts.bold(size: 12)
        idLabel.font = DesignSystem.Fonts.regular(size: 12)
        dateLabel.font = DesignSystem.Fonts.regular(size: 12)
        
        idLabel.textColor = .gray
        dateLabel.textColor = .gray
        
        let stack = UIStackView(arrangedSubviews: [titleLabel, statusLabel, idLabel, dateLabel])
        stack.axis = .vertical
        stack.spacing = 4
        stack.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(stack)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 8),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -8),
            
            stack.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            stack.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            stack.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            stack.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with order: Order) {
        titleLabel.text = order.serviceName
        statusLabel.text = order.status
        idLabel.text = "ID: \(order.id)"
        dateLabel.text = "Date: \(order.date)"
        
        if order.status == "Completed" {
            statusLabel.textColor = .systemGreen
        } else if order.status == "In Progress" {
            statusLabel.textColor = .systemBlue
        } else {
            statusLabel.textColor = .systemOrange
        }
    }
}
