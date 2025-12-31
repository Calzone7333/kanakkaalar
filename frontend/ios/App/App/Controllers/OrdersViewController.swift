import UIKit

class OrdersViewController: UIViewController {

    private let tableView = UITableView()
    private let refreshControl = UIRefreshControl()
    private let activityIndicator = UIActivityIndicatorView(style: .large)
    private let emptyLabel = UILabel()
    
    private var orders: [Order] = []
    private var filterType: String = "ALL" // "ALL" or "DRAFTS"
    
    init(filterType: String = "ALL") {
        self.filterType = filterType
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) { fatalError() }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = filterType == "DRAFTS" ? "Drafts" : "My Orders"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        // TableView
        tableView.backgroundColor = DesignSystem.Colors.windowBackground
        tableView.separatorStyle = .none
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(UserOrderCell.self, forCellReuseIdentifier: "UserOrderCell")
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        
        // Refresh Control
        refreshControl.addTarget(self, action: #selector(handleRefresh), for: .valueChanged)
        tableView.refreshControl = refreshControl
        
        // Activity Indicator
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)
        
        // Empty Label
        emptyLabel.text = filterType == "DRAFTS" ? "No Draft Orders Found" : "No Orders Found"
        emptyLabel.textColor = .gray
        emptyLabel.font = DesignSystem.Fonts.regular(size: 16)
        emptyLabel.textAlignment = .center
        emptyLabel.isHidden = true
        emptyLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emptyLabel)
        
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            
            emptyLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor)
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
            guard let self = self else { return }
            DispatchQueue.main.async {
                self.activityIndicator.stopAnimating()
                self.refreshControl.endRefreshing()
                
                switch result {
                case .success(let data):
                    if self.filterType == "DRAFTS" {
                        self.orders = data.filter { order in
                            let s = order.status?.uppercased() ?? ""
                            return s == "DRAFT" || s == "DOCUMENTS_PENDING" || s == "PENDING_PAYMENT"
                        }
                    } else {
                        // "My Orders" typically excludes drafts? Or includes all? 
                        // Android: 'else { orderList.addAll(allOrders) }' - includes all.
                        self.orders = data
                    }
                    
                    self.tableView.reloadData()
                    self.emptyLabel.isHidden = !self.orders.isEmpty
                    
                case .failure(let error):
                    let alert = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default))
                    self.present(alert, animated: true)
                }
            }
        }
    }
}

// MARK: - TableView
extension OrdersViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return orders.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "UserOrderCell", for: indexPath) as! UserOrderCell
        cell.configure(with: orders[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 130
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let order = orders[indexPath.row]
        let status = order.status?.uppercased() ?? ""
        
        if status == "DRAFT" || status == "DOCUMENTS_PENDING" || status == "PENDING_PAYMENT" || status == "PAYMENT_COMPLETED" {
             // Resume Application
             let vc = ServiceOrderViewController(
                 serviceTitle: order.serviceName ?? "Service",
                 priceString: "\(order.totalAmount ?? 0)",
                 orderId: String(order.id)
             ) // Assuming we add convenience init
             navigationController?.pushViewController(vc, animated: true)
        } else {
            // Navigate to Order Detail (Not yet implemented, just show alert or placeholder)
            let alert = UIAlertController(title: "Order Detail", message: "Order #\(order.id) Details", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Close", style: .cancel))
            present(alert, animated: true)
        }
    }
}

class UserOrderCell: UITableViewCell {
    
    private let containerView = UIView()
    private let idLabel = UILabel()
    private let statusLabel = UILabel()
    private let serviceLabel = UILabel()
    private let amountLabel = UILabel()
    
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
        
        idLabel.font = DesignSystem.Fonts.bold(size: 14)
        idLabel.textColor = DesignSystem.Colors.textSecondary
        idLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(idLabel)
        
        statusLabel.font = DesignSystem.Fonts.bold(size: 12)
        statusLabel.layer.cornerRadius = 4
        statusLabel.layer.masksToBounds = true
        statusLabel.textAlignment = .center
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(statusLabel)
        
        serviceLabel.font = DesignSystem.Fonts.bold(size: 16)
        serviceLabel.textColor = DesignSystem.Colors.textPrimary
        serviceLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(serviceLabel)
        
        amountLabel.font = DesignSystem.Fonts.bold(size: 16)
        amountLabel.textColor = DesignSystem.Colors.primary
        amountLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(amountLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 8),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -8),
            
            idLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            idLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            statusLabel.centerYAnchor.constraint(equalTo: idLabel.centerYAnchor),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            statusLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 80),
            statusLabel.heightAnchor.constraint(equalToConstant: 24),
            
            serviceLabel.topAnchor.constraint(equalTo: idLabel.bottomAnchor, constant: 8),
            serviceLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            serviceLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            
            amountLabel.topAnchor.constraint(equalTo: serviceLabel.bottomAnchor, constant: 8),
            amountLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            amountLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12)
        ])
    }
    
    func configure(with order: Order) {
        idLabel.text = "#ORD-\(order.id)"
        serviceLabel.text = order.serviceName ?? "Service"
        
        if let amount = order.totalAmount {
            let formatter = NumberFormatter()
            formatter.numberStyle = .currency
            formatter.locale = Locale(identifier: "en_IN")
            amountLabel.text = formatter.string(from: NSNumber(value: amount))
        } else {
            amountLabel.text = "₹ 0.0"
        }
        
        let status = order.status ?? "Pending"
        statusLabel.text = "  \(status)  " 
        
        switch status.uppercased() {
        case "COMPLETED", "PAID":
            statusLabel.backgroundColor = UIColor(hex: "#ECFDF5")
            statusLabel.textColor = UIColor(hex: "#10B981") // Green
        case "PENDING":
            statusLabel.backgroundColor = UIColor(hex: "#FFFBEB")
            statusLabel.textColor = UIColor(hex: "#D97706") // Amber
        case "CANCELLED":
            statusLabel.backgroundColor = UIColor(hex: "#FEF2F2")
            statusLabel.textColor = UIColor(hex: "#EF4444") // Red
        default:
            statusLabel.backgroundColor = UIColor(hex: "#F1F5F9")
            statusLabel.textColor = UIColor(hex: "#64748B") // Slate
        }
    }
}
