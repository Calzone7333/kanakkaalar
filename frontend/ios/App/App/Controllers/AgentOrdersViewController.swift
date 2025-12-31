import UIKit

class AgentOrdersViewController: UIViewController {

    private let tableView = UITableView()
    private let refreshControl = UIRefreshControl()
    private let activityIndicator = UIActivityIndicatorView(style: .large)
    
    private var orders: [Order] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "My Referrals"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        tableView.backgroundColor = DesignSystem.Colors.windowBackground
        tableView.separatorStyle = .none
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(AgentOrderCell.self, forCellReuseIdentifier: "AgentOrderCell")
        tableView.refreshControl = refreshControl
        refreshControl.addTarget(self, action: #selector(handleRefresh), for: .valueChanged)
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)
        
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
    
    @objc private func handleRefresh() {
        loadData()
    }
    
    private func loadData() {
        if !refreshControl.isRefreshing {
            activityIndicator.startAnimating()
        }
        
        APIService.shared.getAllOrders { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                self?.refreshControl.endRefreshing()
                
                switch result {
                case .success(let data):
                    self?.orders = data
                    self?.tableView.reloadData()
                case .failure(let error):
                    print("Error fetching orders: \(error)")
                }
            }
        }
    }
}

extension AgentOrdersViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return orders.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "AgentOrderCell", for: indexPath) as! AgentOrderCell
        cell.configure(with: orders[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 110
    }
}

class AgentOrderCell: UITableViewCell {
    private let containerView = UIView()
    private let serviceLabel = UILabel()
    private let clientLabel = UILabel()
    private let statusLabel = UILabel()
    private let dateLabel = UILabel()
    private let earningsLabel = UILabel()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        serviceLabel.font = DesignSystem.Fonts.bold(size: 16)
        serviceLabel.textColor = DesignSystem.Colors.textPrimary
        serviceLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(serviceLabel)
        
        clientLabel.font = DesignSystem.Fonts.regular(size: 14)
        clientLabel.textColor = DesignSystem.Colors.textSecondary
        clientLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(clientLabel)
        
        statusLabel.font = DesignSystem.Fonts.bold(size: 12)
        statusLabel.layer.cornerRadius = 4
        statusLabel.layer.masksToBounds = true
        statusLabel.textAlignment = .center
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(statusLabel)
        
        dateLabel.font = DesignSystem.Fonts.regular(size: 12)
        dateLabel.textColor = .systemGray
        dateLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(dateLabel)
        
        earningsLabel.font = DesignSystem.Fonts.bold(size: 14)
        earningsLabel.textColor = DesignSystem.Colors.primary
        earningsLabel.textAlignment = .right
        earningsLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(earningsLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            serviceLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            serviceLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            clientLabel.topAnchor.constraint(equalTo: serviceLabel.bottomAnchor, constant: 4),
            clientLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            statusLabel.centerYAnchor.constraint(equalTo: serviceLabel.centerYAnchor),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            statusLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 80),
            statusLabel.heightAnchor.constraint(equalToConstant: 24),
            
            dateLabel.topAnchor.constraint(equalTo: clientLabel.bottomAnchor, constant: 16),
            dateLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            dateLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12),
            
            earningsLabel.centerYAnchor.constraint(equalTo: dateLabel.centerYAnchor),
            earningsLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with order: Order) {
        serviceLabel.text = order.serviceName
        clientLabel.text = "Client: \(order.customerEmail ?? "Unknown")"
        dateLabel.text = "Order #\(order.id)"
        statusLabel.text = " \(order.status ?? "Pending") "
        
        // Mock logic for earnings as order model doesn't have commission field yet
        // In real app, we'd calculate or fetch commission.
        earningsLabel.text = "Earn: ₹0 (Est)"
        
        let status = order.status?.uppercased() ?? ""
        switch status {
        case "COMPLETED":
            statusLabel.backgroundColor = UIColor(hex: "#ECFDF5")
            statusLabel.textColor = UIColor(hex: "#059669")
        case "PROCESSING":
             statusLabel.backgroundColor = UIColor(hex: "#EFF6FF")
             statusLabel.textColor = UIColor(hex: "#3B82F6")
        case "CANCELLED":
             statusLabel.backgroundColor = UIColor(hex: "#FEF2F2")
             statusLabel.textColor = UIColor(hex: "#EF4444")
        default: // Pending
            statusLabel.backgroundColor = UIColor(hex: "#FFFBEB")
            statusLabel.textColor = UIColor(hex: "#D97706")
        }
    }
}
