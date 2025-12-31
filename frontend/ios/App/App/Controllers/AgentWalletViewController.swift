import UIKit

class AgentWalletViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private let refreshControl = UIRefreshControl()
    
    // Balance Card
    private let balanceCard = UIView()
    private let balanceLabel = UILabel()
    private let withdrawButton = UIButton(type: .system)
    
    // History
    private let historyLabel = UILabel()
    private let tableView = UITableView()
    
    // Data
    private var transactions: [WalletTransaction] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "My Wallet"
        
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
        
        // Balance Card
        balanceCard.backgroundColor = DesignSystem.Colors.primary
        balanceCard.layer.cornerRadius = 16
        balanceCard.translatesAutoresizingMaskIntoConstraints = false
        
        // Add subtle gradient or pattern visual if needed, kept simple solid for now
        
        contentView.addSubview(balanceCard)
        
        let balTitle = UILabel()
        balTitle.text = "Available Balance"
        balTitle.font = DesignSystem.Fonts.medium(size: 14)
        balTitle.textColor = UIColor.white.withAlphaComponent(0.9)
        balTitle.translatesAutoresizingMaskIntoConstraints = false
        balanceCard.addSubview(balTitle)
        
        balanceLabel.text = "₹0.00"
        balanceLabel.font = DesignSystem.Fonts.bold(size: 36)
        balanceLabel.textColor = .white
        balanceLabel.translatesAutoresizingMaskIntoConstraints = false
        balanceCard.addSubview(balanceLabel)
        
        withdrawButton.setTitle("Withdraw", for: .normal)
        withdrawButton.setTitleColor(DesignSystem.Colors.primary, for: .normal)
        withdrawButton.backgroundColor = .white
        withdrawButton.layer.cornerRadius = 20
        withdrawButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
        withdrawButton.translatesAutoresizingMaskIntoConstraints = false
        withdrawButton.addTarget(self, action: #selector(handleWithdraw), for: .touchUpInside)
        balanceCard.addSubview(withdrawButton)
        
        let walletIcon = UIImageView(image: UIImage(systemName: "wallet.pass.fill"))
        walletIcon.tintColor = UIColor.white.withAlphaComponent(0.2)
        walletIcon.contentMode = .scaleAspectFit
        walletIcon.translatesAutoresizingMaskIntoConstraints = false
        balanceCard.addSubview(walletIcon)
        
        // History Header
        historyLabel.text = "Transaction History"
        historyLabel.font = DesignSystem.Fonts.bold(size: 18)
        historyLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(historyLabel)
        
        // TableView
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(WalletTransactionCell.self, forCellReuseIdentifier: "WalletTransactionCell")
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
            
            balanceCard.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 24),
            balanceCard.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            balanceCard.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            balanceCard.heightAnchor.constraint(equalToConstant: 200),
            
            walletIcon.trailingAnchor.constraint(equalTo: balanceCard.trailingAnchor, constant: -20),
            walletIcon.topAnchor.constraint(equalTo: balanceCard.topAnchor, constant: 20),
            walletIcon.widthAnchor.constraint(equalToConstant: 60),
            walletIcon.heightAnchor.constraint(equalToConstant: 60),
            
            balTitle.topAnchor.constraint(equalTo: balanceCard.topAnchor, constant: 24),
            balTitle.leadingAnchor.constraint(equalTo: balanceCard.leadingAnchor, constant: 24),
            
            balanceLabel.topAnchor.constraint(equalTo: balTitle.bottomAnchor, constant: 8),
            balanceLabel.leadingAnchor.constraint(equalTo: balanceCard.leadingAnchor, constant: 24),
            
            withdrawButton.bottomAnchor.constraint(equalTo: balanceCard.bottomAnchor, constant: -24),
            withdrawButton.trailingAnchor.constraint(equalTo: balanceCard.trailingAnchor, constant: -24),
            withdrawButton.widthAnchor.constraint(equalToConstant: 120),
            withdrawButton.heightAnchor.constraint(equalToConstant: 40),
            
            historyLabel.topAnchor.constraint(equalTo: balanceCard.bottomAnchor, constant: 32),
            historyLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            
            tableView.topAnchor.constraint(equalTo: historyLabel.bottomAnchor, constant: 16),
            tableView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20)
        ])
    }
    
    @objc private func handleRefresh() {
        loadData()
    }
    
    private func loadData() {
        let group = DispatchGroup()
        
        group.enter()
        APIService.shared.getAgentWallet { [weak self] result in
            defer { group.leave() }
            switch result {
            case .success(let wallet):
                DispatchQueue.main.async {
                    let formatter = NumberFormatter()
                    formatter.numberStyle = .currency
                    formatter.currencySymbol = "₹"
                    self?.balanceLabel.text = formatter.string(from: NSNumber(value: wallet.balance)) ?? "₹0.00"
                }
            case .failure(let error):
                print("Wallet Error: \(error)")
            }
        }
        
        group.enter()
        APIService.shared.getWalletTransactions { [weak self] result in
            defer { group.leave() }
            switch result {
            case .success(let txs):
                DispatchQueue.main.async {
                    self?.transactions = txs
                    self?.tableView.reloadData()
                    self?.tableView.heightAnchor.constraint(equalToConstant: CGFloat(max(1, txs.count) * 85)).isActive = true
                }
            case .failure(let error):
                 print("Transactions Error: \(error)")
            }
        }
        
        group.notify(queue: .main) {
            self.refreshControl.endRefreshing()
        }
    }
    
    @objc private func handleWithdraw() {
        let alert = UIAlertController(title: "Withdraw Request", message: "Enter amount to withdraw", preferredStyle: .alert)
        alert.addTextField { tf in tf.keyboardType = .decimalPad; tf.placeholder = "Amount" }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Submit", style: .default, handler: { _ in
            // API call to request withdrawal
        }))
        present(alert, animated: true)
    }
}

extension AgentWalletViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return transactions.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "WalletTransactionCell", for: indexPath) as! WalletTransactionCell
        cell.configure(with: transactions[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 85
    }
}

class WalletTransactionCell: UITableViewCell {
    private let containerView = UIView()
    private let titleLabel = UILabel()
    private let dateLabel = UILabel()
    private let amountLabel = UILabel()
    private let iconView = UIImageView()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        iconView.layer.cornerRadius = 20
        iconView.layer.masksToBounds = true
        iconView.contentMode = .center
        iconView.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(iconView)
        
        titleLabel.font = DesignSystem.Fonts.bold(size: 15)
        titleLabel.textColor = DesignSystem.Colors.textPrimary
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(titleLabel)
        
        dateLabel.font = DesignSystem.Fonts.regular(size: 12)
        dateLabel.textColor = DesignSystem.Colors.textSecondary
        dateLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(dateLabel)
        
        amountLabel.font = DesignSystem.Fonts.bold(size: 16)
        amountLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(amountLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 4),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -4),
            
            iconView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 12),
            iconView.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            iconView.widthAnchor.constraint(equalToConstant: 40),
            iconView.heightAnchor.constraint(equalToConstant: 40),
            
            titleLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 14),
            titleLabel.leadingAnchor.constraint(equalTo: iconView.trailingAnchor, constant: 12),
            titleLabel.trailingAnchor.constraint(equalTo: amountLabel.leadingAnchor, constant: -8),
            
            dateLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            dateLabel.leadingAnchor.constraint(equalTo: iconView.trailingAnchor, constant: 12),
            dateLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -14),
            
            amountLabel.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            amountLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with txn: WalletTransaction) {
        titleLabel.text = txn.description
        // Date formatting simplified
        if let idx = txn.createdAt.firstIndex(of: "T") {
            let dateStr = String(txn.createdAt[..<idx])
            dateLabel.text = dateStr
        } else {
             dateLabel.text = txn.createdAt
        }
        
        let type = txn.type.uppercased()
        if type == "CREDIT" {
            amountLabel.text = "+ ₹\(txn.amount)"
            amountLabel.textColor = .systemGreen
            iconView.image = UIImage(systemName: "arrow.down.left")
            iconView.backgroundColor = UIColor(hex: "#ECFDF5")
            iconView.tintColor = .systemGreen
        } else {
             amountLabel.text = "- ₹\(txn.amount)"
             amountLabel.textColor = .systemRed
             iconView.image = UIImage(systemName: "arrow.up.right")
             iconView.backgroundColor = UIColor(hex: "#FEF2F2")
             iconView.tintColor = .systemRed
        }
    }
}
