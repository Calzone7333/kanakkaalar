import UIKit

class AdminCrmViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private let refreshControl = UIRefreshControl()
    
    // Stats
    private let statsStack = UIStackView()
    private var statsCards: [CrmStatsCard] = []
    
    // Chart Placeholder
    private let chartContainer = UIView()
    private let chartLabel = UILabel()
    private let chartView = UIView() // Placeholder for Bar Chart
    
    // Recent Leads
    private let leadsLabel = UILabel()
    private let leadsTableView = UITableView()
    
    private var recentLeads: [Lead] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "CRM"
        
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
        
        // Stats
        statsStack.axis = .vertical
        statsStack.spacing = 16
        statsStack.distribution = .fillEqually
        statsStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(statsStack)
        
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
        
        let card1 = CrmStatsCard(title: "Total Leads", value: "0", color: .systemBlue)
        let card2 = CrmStatsCard(title: "Active Deals", value: "0", color: .systemOrange)
        let card3 = CrmStatsCard(title: "Pipeline Value", value: "₹0", color: .systemGreen)
        let card4 = CrmStatsCard(title: "Conversion", value: "0%", color: .systemPurple)
        
        statsCards = [card1, card2, card3, card4]
        
        row1.addArrangedSubview(card1)
        row1.addArrangedSubview(card2)
        row2.addArrangedSubview(card3)
        row2.addArrangedSubview(card4)
        
        statsStack.addArrangedSubview(row1)
        statsStack.addArrangedSubview(row2)
        
        // Chart Container
        chartContainer.backgroundColor = .white
        chartContainer.layer.cornerRadius = 12
        chartContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(chartContainer)
        
        chartLabel.text = "Deal Stages"
        chartLabel.font = DesignSystem.Fonts.bold(size: 16)
        chartLabel.translatesAutoresizingMaskIntoConstraints = false
        chartContainer.addSubview(chartLabel)
        
        chartView.backgroundColor = .systemGray6 // Placeholder
        chartView.layer.cornerRadius = 8
        chartView.translatesAutoresizingMaskIntoConstraints = false
        chartContainer.addSubview(chartView)
        
        // Leads Label Container
        let leadsHeaderContainer = UIView()
        leadsHeaderContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(leadsHeaderContainer)
        
        leadsLabel.text = "Recent Leads"
        leadsLabel.font = DesignSystem.Fonts.bold(size: 18)
        leadsLabel.translatesAutoresizingMaskIntoConstraints = false
        leadsHeaderContainer.addSubview(leadsLabel)
        
        let viewAllButton = UIButton(type: .system)
        viewAllButton.setTitle("View All", for: .normal)
        viewAllButton.setTitleColor(DesignSystem.Colors.primary, for: .normal)
        viewAllButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
        viewAllButton.translatesAutoresizingMaskIntoConstraints = false
        viewAllButton.addTarget(self, action: #selector(handleViewAllLeads), for: .touchUpInside)
        leadsHeaderContainer.addSubview(viewAllButton)
        
        // Add Deals Button to Navigation
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Deals", style: .plain, target: self, action: #selector(handleViewDeals))
        
        leadsTableView.dataSource = self
        leadsTableView.delegate = self
        leadsTableView.register(AdminLeadCell.self, forCellReuseIdentifier: "AdminLeadCell")
        leadsTableView.separatorStyle = .none
        leadsTableView.backgroundColor = .clear
        leadsTableView.isScrollEnabled = false
        leadsTableView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(leadsTableView)
        
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
            statsStack.heightAnchor.constraint(equalToConstant: 200),
            
            chartContainer.topAnchor.constraint(equalTo: statsStack.bottomAnchor, constant: 24),
            chartContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            chartContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            chartContainer.heightAnchor.constraint(equalToConstant: 250),
            
            chartLabel.topAnchor.constraint(equalTo: chartContainer.topAnchor, constant: 16),
            chartLabel.leadingAnchor.constraint(equalTo: chartContainer.leadingAnchor, constant: 16),
            
            chartView.topAnchor.constraint(equalTo: chartLabel.bottomAnchor, constant: 16),
            chartView.leadingAnchor.constraint(equalTo: chartContainer.leadingAnchor, constant: 16),
            chartView.trailingAnchor.constraint(equalTo: chartContainer.trailingAnchor, constant: -16),
            chartView.bottomAnchor.constraint(equalTo: chartContainer.bottomAnchor, constant: -16),
            
            leadsHeaderContainer.topAnchor.constraint(equalTo: chartContainer.bottomAnchor, constant: 24),
            leadsHeaderContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            leadsHeaderContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            leadsHeaderContainer.heightAnchor.constraint(equalToConstant: 30),
            
            leadsLabel.leadingAnchor.constraint(equalTo: leadsHeaderContainer.leadingAnchor),
            leadsLabel.centerYAnchor.constraint(equalTo: leadsHeaderContainer.centerYAnchor),
            
            viewAllButton.trailingAnchor.constraint(equalTo: leadsHeaderContainer.trailingAnchor),
            viewAllButton.centerYAnchor.constraint(equalTo: leadsHeaderContainer.centerYAnchor),
            
            leadsTableView.topAnchor.constraint(equalTo: leadsHeaderContainer.bottomAnchor, constant: 12),
            leadsTableView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            leadsTableView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            leadsTableView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20),
            leadsTableView.heightAnchor.constraint(equalToConstant: 300)
        ])
    }
    
    @objc private func handleRefresh() {
        loadData()
    }
    
    private func loadData() {
        let group = DispatchGroup()
        
        // Fetch Leads
        group.enter()
        APIService.shared.getAllLeads { [weak self] result in
            defer { group.leave() }
            switch result {
            case .success(let leads):
                DispatchQueue.main.async {
                    self?.statsCards[0].setValue("\(leads.count)")
                    // Take top 5
                    self?.recentLeads = Array(leads.prefix(5))
                    self?.leadsTableView.reloadData()
                    self?.leadsTableView.heightAnchor.constraint(equalToConstant: CGFloat(max(1, (self?.recentLeads.count ?? 0)) * 90)).isActive = true
                }
            case .failure(let error):
                print("Error loading leads: \(error)")
            }
        }
        
        // Fetch Deals
        group.enter()
        APIService.shared.getAllDeals { [weak self] result in
            defer { group.leave() }
            switch result {
            case .success(let deals):
                DispatchQueue.main.async {
                    self?.calculateDealStats(deals)
                }
            case .failure(let error):
                print("Error loading deals: \(error)")
            }
        }
        
        group.notify(queue: .main) {
            self.refreshControl.endRefreshing()
        }
    }
    
    private func calculateDealStats(_ deals: [Deal]) {
        var activeCount = 0
        var pipelineValue: Double = 0
        var wonCount = 0
        
        for deal in deals {
            let stage = (deal.stage ?? "").uppercased()
            if stage.contains("WON") || stage.contains("COMPLETED") {
                wonCount += 1
            } else if !stage.contains("LOST") && !stage.contains("CANCELLED") {
                activeCount += 1
                pipelineValue += deal.amount ?? 0
            }
        }
        
        let conversion = deals.isEmpty ? 0 : (Double(wonCount) / Double(deals.count)) * 100
        
        statsCards[1].setValue("\(activeCount)")
        
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencySymbol = "₹"
        formatter.maximumFractionDigits = 0
        
        if let val = formatter.string(from: NSNumber(value: pipelineValue)) {
            statsCards[2].setValue(val)
        } else {
            statsCards[2].setValue("₹\(Int(pipelineValue))")
        }
        
        statsCards[3].setValue(String(format: "%.1f%%", conversion))
    }
    
    @objc private func handleViewAllLeads() {
        let vc = AdminLeadsViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleViewDeals() {
        let vc = AdminDealsViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
}

extension AdminCrmViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return recentLeads.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "AdminLeadCell", for: indexPath) as! AdminLeadCell
        cell.configure(with: recentLeads[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 90
    }
}

class CrmStatsCard: UIView {
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

class AdminLeadCell: UITableViewCell {
    private let containerView = UIView()
    private let nameLabel = UILabel()
    private let serviceLabel = UILabel()
    private let statusLabel = UILabel()
    
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
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            nameLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            serviceLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            serviceLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            serviceLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12),
            
            statusLabel.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            statusLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 80),
            statusLabel.heightAnchor.constraint(equalToConstant: 24)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with lead: Lead) {
        nameLabel.text = lead.name
        serviceLabel.text = lead.service ?? "Inquiry"
        
        let status = lead.status ?? "New"
        statusLabel.text = "  \(status)  "
        
        switch status {
        case "New":
            statusLabel.backgroundColor = UIColor(hex: "#FFF7ED")
            statusLabel.textColor = UIColor(hex: "#F97316") // Orange
        case "Contacted":
            statusLabel.backgroundColor = UIColor(hex: "#EFF6FF")
            statusLabel.textColor = UIColor(hex: "#3B82F6") // Blue
        case "Qualified", "Converted":
            statusLabel.backgroundColor = UIColor(hex: "#ECFDF5")
            statusLabel.textColor = UIColor(hex: "#10B981") // Green
        default:
            statusLabel.backgroundColor = UIColor(hex: "#F1F5F9")
            statusLabel.textColor = UIColor(hex: "#64748B") // Gray
        }
    }
}
