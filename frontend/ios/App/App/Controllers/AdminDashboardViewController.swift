import UIKit

class AdminDashboardViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private let refreshControl = UIRefreshControl()
    
    // Stats Grid
    private let statsStack = UIStackView()
    private var statsCards: [StatsCard] = []
    
    // Charts
    private let pieChartContainer = UIView()
    private let barChartContainer = UIView()
    
    // Quick Actions
    private let quickActionsLabel = UILabel()
    private let quickActionsStack = UIStackView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Dashboard"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.refreshControl = refreshControl
        refreshControl.addTarget(self, action: #selector(loadData), for: .valueChanged)
        
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        // Stats
        statsStack.axis = .vertical
        statsStack.spacing = 16
        statsStack.distribution = .fillEqually
        statsStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(statsStack)
        
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
        
        let card1 = StatsCard(title: "Revenue", value: "₹0", color: .systemGreen)
        let card2 = StatsCard(title: "Orders", value: "0", color: .systemBlue)
        let card3 = StatsCard(title: "Leads", value: "0", color: .systemOrange)
        let card4 = StatsCard(title: "Deals", value: "0", color: .systemPurple)
        let card5 = StatsCard(title: "Employees", value: "0", color: .systemTeal)
        let card6 = StatsCard(title: "Agents", value: "0", color: .systemIndigo)
        
        statsCards = [card1, card2, card3, card4, card5, card6]
        
        row1.addArrangedSubview(card1)
        row1.addArrangedSubview(card2)
        row2.addArrangedSubview(card3)
        row2.addArrangedSubview(card4)
        row3.addArrangedSubview(card5)
        row3.addArrangedSubview(card6)
        
        statsStack.addArrangedSubview(row1)
        statsStack.addArrangedSubview(row2)
        statsStack.addArrangedSubview(row3)
        
        // Pie Chart
        setupChartContainer(container: pieChartContainer, title: "Order Status")
        contentView.addSubview(pieChartContainer)
        
        // Bar Chart
        setupChartContainer(container: barChartContainer, title: "Leads vs Deals")
        contentView.addSubview(barChartContainer)
        
        // Quick Actions
        quickActionsLabel.text = "Quick Actions"
        quickActionsLabel.font = DesignSystem.Fonts.bold(size: 18)
        quickActionsLabel.textColor = DesignSystem.Colors.textPrimary
        quickActionsLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(quickActionsLabel)
        
        quickActionsStack.axis = .horizontal
        quickActionsStack.spacing = 12
        quickActionsStack.distribution = .fillEqually
        quickActionsStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(quickActionsStack)
        
        quickActionsStack.addArrangedSubview(createActionButton(title: "Add Employee", icon: "person.badge.plus", color: .systemBlue, action: #selector(actionAddEmployee)))
        quickActionsStack.addArrangedSubview(createActionButton(title: "Add Agent", icon: "briefcase.fill", color: .systemOrange, action: #selector(actionAddAgent)))
        quickActionsStack.addArrangedSubview(createActionButton(title: "Experts", icon: "star.circle.fill", color: .systemPurple, action: #selector(actionExperts))) // Replaces Reports
        quickActionsStack.addArrangedSubview(createActionButton(title: "Settings", icon: "gearshape.fill", color: .systemGray, action: #selector(actionSettings)))
        
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
            statsStack.heightAnchor.constraint(equalToConstant: 300),
            
            pieChartContainer.topAnchor.constraint(equalTo: statsStack.bottomAnchor, constant: 24),
            pieChartContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            pieChartContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            pieChartContainer.heightAnchor.constraint(equalToConstant: 250),
            
            barChartContainer.topAnchor.constraint(equalTo: pieChartContainer.bottomAnchor, constant: 24),
            barChartContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            barChartContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            barChartContainer.heightAnchor.constraint(equalToConstant: 250),
            
            quickActionsLabel.topAnchor.constraint(equalTo: barChartContainer.bottomAnchor, constant: 24),
            quickActionsLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            
            quickActionsStack.topAnchor.constraint(equalTo: quickActionsLabel.bottomAnchor, constant: 16),
            quickActionsStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            quickActionsStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            quickActionsStack.heightAnchor.constraint(equalToConstant: 80),
            quickActionsStack.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -32)
        ])
    }
    
    private func createStatsCard(title: String, value: String, color: UIColor) -> UIView {
        return StatsCard(title: title, value: value, color: color)
    }
    
    private func createActionButton(title: String, icon: String, color: UIColor, action: Selector) -> UIView {
        let container = UIView()
        container.backgroundColor = .white
        container.layer.cornerRadius = 12
        container.layer.borderWidth = 1
        container.layer.borderColor = UIColor.systemGray5.cgColor
        
        let iconView = UIImageView(image: UIImage(systemName: icon))
        iconView.tintColor = color
        iconView.contentMode = .scaleAspectFit
        iconView.translatesAutoresizingMaskIntoConstraints = false
        
        let label = UILabel()
        label.text = title
        label.font = DesignSystem.Fonts.bold(size: 10)
        label.textColor = DesignSystem.Colors.textPrimary
        label.textAlignment = .center
        label.numberOfLines = 2
        label.translatesAutoresizingMaskIntoConstraints = false
        
        container.addSubview(iconView)
        container.addSubview(label)
        
        NSLayoutConstraint.activate([
            iconView.centerXAnchor.constraint(equalTo: container.centerXAnchor),
            iconView.centerYAnchor.constraint(equalTo: container.centerYAnchor, constant: -10),
            iconView.widthAnchor.constraint(equalToConstant: 24),
            iconView.heightAnchor.constraint(equalToConstant: 24),
            
            label.topAnchor.constraint(equalTo: iconView.bottomAnchor, constant: 4),
            label.leadingAnchor.constraint(equalTo: container.leadingAnchor, constant: 4),
            label.trailingAnchor.constraint(equalTo: container.trailingAnchor, constant: -4)
        ])
        
        let tap = UITapGestureRecognizer(target: self, action: action)
        container.addGestureRecognizer(tap)
        container.isUserInteractionEnabled = true
        
        return container
    }
    
    private func setupChartContainer(container: UIView, title: String) {
        container.backgroundColor = .white
        container.layer.cornerRadius = 12
        container.layer.borderWidth = 1
        container.layer.borderColor = UIColor.systemGray5.cgColor
        container.translatesAutoresizingMaskIntoConstraints = false
        
        let label = UILabel()
        label.text = title
        label.font = DesignSystem.Fonts.bold(size: 16)
        label.textColor = DesignSystem.Colors.textPrimary
        label.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(label)
        
        NSLayoutConstraint.activate([
            label.topAnchor.constraint(equalTo: container.topAnchor, constant: 16),
            label.leadingAnchor.constraint(equalTo: container.leadingAnchor, constant: 16)
        ])
    }
    
    @objc private func loadData() {
        refreshControl.beginRefreshing()
        APIService.shared.getAdminDashboardStats { [weak self] result in
            DispatchQueue.main.async {
                self?.refreshControl.endRefreshing()
                switch result {
                case .success(let stats):
                    self?.updateUI(with: stats)
                case .failure(let error):
                    print("Stats Error: \(error)")
                }
            }
        }
    }
    
    private func updateUI(with stats: DashboardStatsResponse) {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencySymbol = "₹"
        formatter.maximumFractionDigits = 0
        
        statsCards[0].setValue(formatter.string(from: NSNumber(value: stats.totalRevenue)) ?? "₹0")
        statsCards[1].setValue("\(stats.totalOrders ?? 0)") // Assuming totalOrders is totalDeals or derived? Android maps totalOrders. Wait, Model has totalCustomers, totalLeads, totalDeals. Where is Orders? 
        // Android AdminHomeFragment maps:
        // tvTotalRevenue -> stats.getTotalRevenue()
        // tvTotalEmployees -> stats.getTotalEmployees()
        // tvTotalAgents -> stats.getTotalAgents()
        // tvTotalCustomers -> stats.getTotalCustomers()
        // tvTotalLeads -> stats.getTotalLeads()
        // tvTotalDeals -> stats.getTotalDeals()
        // Wait, where is Total ORDERS? Pie chart is "Order Status".
        // Android XML might have an Orders card?
        // Let's assume Card 2 (Orders) -> Total Deals? No, Deals is Card 4.
        // Android calls `stats.getTotalCustomers()` for one card.
        // Let's check my model `DashboardStatsResponse`: totalRevenue, totalEmployees, totalAgents, totalCustomers, totalLeads, totalDeals.
        // No totalOrders field explicitly in my Swift model step 374?
        // Let's check step 374 content.
        // "let totalRevenue: Double; let totalEmployees: Int; let totalAgents: Int; let totalCustomers: Int; let totalLeads: Int; let totalDeals: Int;"
        // Missing totalOrders?
        // Android `DashboardStatsResponse`:
        // Let's assume `totalDeals` maps to Orders in my VC card 2? Or `totalCustomers`?
        // Card 1: Revenue
        // Card 2: Orders (Android doesn't seem to have a textview for totalOrders in the code I read? tvTotalDeals, tvTotalLeads, tvTotalCustomers, tvTotalAgents, tvTotalEmployees, tvTotalRevenue. That's 6 cards.)
        // My Swift VC has 6 cards.
        // Card 1: Revenue -> totalRevenue
        // Card 2: Orders -> I'll map to totalCustomers for now or 0 if missing. Or maybe I missed `totalOrders` in my model definition?
        // Android code: "if (tvTotalCustomers != null) tvTotalCustomers.setText(String.valueOf(stats.getTotalCustomers()));"
        // Android code doesn't show `tvTotalOrders`.
        // But Android Pie Chart is "Order Status".
        // I'll map Card 2 to `totalCustomers` (Customers) and rename title in VC, or use `totalDeals` if that's what it meant.
        // Actually, let's map:
        // C1: Revenue
        // C2: Customers (renaming Orders to Customers to match Android textviews)
        // C3: Leads
        // C4: Deals
        // C5: Employees
        // C6: Agents
        
        statsCards[0].setValue(formatter.string(from: NSNumber(value: stats.totalRevenue)) ?? "₹0")
        statsCards[1].setValue("\(stats.totalCustomers)")
        statsCards[1].updateTitle(to: "Customers") 
        
        statsCards[2].setValue("\(stats.totalLeads)")
        statsCards[3].setValue("\(stats.totalDeals)")
        statsCards[4].setValue("\(stats.totalEmployees)")
        statsCards[5].setValue("\(stats.totalAgents)")
        
        // Render Charts visual (Simple bars)
        renderPieChart(stats.orderStatusChart)
        renderBarChart(stats.leadsVsDealsChart)
    }
    
    private func renderPieChart(_ data: [ChartData]?) {
        guard let data = data else { return }
        // Simple visualization: List of colored bars with %
        pieChartContainer.subviews.forEach { if $0 != pieChartContainer.subviews.first { $0.removeFromSuperview() } } // Keep title
        
        let stack = UIStackView()
        stack.axis = .vertical
        stack.spacing = 8
        stack.distribution = .fillEqually
        stack.translatesAutoresizingMaskIntoConstraints = false
        pieChartContainer.addSubview(stack)
        
        NSLayoutConstraint.activate([
            stack.topAnchor.constraint(equalTo: pieChartContainer.topAnchor, constant: 50),
            stack.leadingAnchor.constraint(equalTo: pieChartContainer.leadingAnchor, constant: 16),
            stack.trailingAnchor.constraint(equalTo: pieChartContainer.trailingAnchor, constant: -16),
            stack.bottomAnchor.constraint(equalTo: pieChartContainer.bottomAnchor, constant: -16)
        ])
        
        let colors: [UIColor] = [.systemGreen, .systemBlue, .systemOrange, .systemRed, .systemPurple]
        var total = data.reduce(0) { $0 + ($1.value ?? 0) }
        if total == 0 { total = 1 }
        
        for (index, item) in data.enumerated() {
            let row = UIView()
            let color = colors[index % colors.count]
            let pct = (item.value ?? 0) / total
            
            let bar = UIView()
            bar.backgroundColor = color
            bar.layer.cornerRadius = 4
            bar.translatesAutoresizingMaskIntoConstraints = false
            row.addSubview(bar)
            
            let lbl = UILabel()
            lbl.text = "\(item.name ?? ""): \(Int(item.value ?? 0))"
            lbl.font = DesignSystem.Fonts.regular(size: 12)
            lbl.translatesAutoresizingMaskIntoConstraints = false
            row.addSubview(lbl)
            
            NSLayoutConstraint.activate([
                lbl.leadingAnchor.constraint(equalTo: row.leadingAnchor),
                lbl.centerYAnchor.constraint(equalTo: row.centerYAnchor),
                lbl.widthAnchor.constraint(equalToConstant: 100),
                
                bar.leadingAnchor.constraint(equalTo: lbl.trailingAnchor, constant: 8),
                bar.centerYAnchor.constraint(equalTo: row.centerYAnchor),
                bar.heightAnchor.constraint(equalToConstant: 8),
                bar.widthAnchor.constraint(equalTo: row.widthAnchor, multiplier: CGFloat(pct), constant: -110)
            ])
            
            stack.addArrangedSubview(row)
        }
    }
    
    private func renderBarChart(_ data: [ChartData]?) {
        guard let data = data else { return }
        // Similar simple visualization
        barChartContainer.subviews.forEach { if $0 != barChartContainer.subviews.first { $0.removeFromSuperview() } }
        
        let stack = UIStackView()
        stack.axis = .vertical
        stack.spacing = 8
        stack.distribution = .fillEqually
        stack.translatesAutoresizingMaskIntoConstraints = false
        barChartContainer.addSubview(stack)
        
        NSLayoutConstraint.activate([
            stack.topAnchor.constraint(equalTo: barChartContainer.topAnchor, constant: 50),
            stack.leadingAnchor.constraint(equalTo: barChartContainer.leadingAnchor, constant: 16),
            stack.trailingAnchor.constraint(equalTo: barChartContainer.trailingAnchor, constant: -16),
            stack.bottomAnchor.constraint(equalTo: barChartContainer.bottomAnchor, constant: -16)
        ])
        
        for item in data.prefix(5) {
            let row = UIStackView()
            row.axis = .horizontal
            row.spacing = 8
            row.distribution = .fillProportionally
            
            let lbl = UILabel()
            lbl.text = item.name
            lbl.font = DesignSystem.Fonts.regular(size: 10)
            lbl.widthAnchor.constraint(equalToConstant: 60).isActive = true
            
            let barLead = UIView()
            barLead.backgroundColor = .systemOrange
            barLead.layer.cornerRadius = 4
            let w1 = CGFloat(item.leads ?? 0) * 5 + 10
            barLead.widthAnchor.constraint(equalToConstant: w1).isActive = true
            
            let barDeal = UIView()
            barDeal.backgroundColor = .systemPurple
            barDeal.layer.cornerRadius = 4
            let w2 = CGFloat(item.deals ?? 0) * 5 + 10
            barDeal.widthAnchor.constraint(equalToConstant: w2).isActive = true
            
            row.addArrangedSubview(lbl)
            row.addArrangedSubview(barLead)
            row.addArrangedSubview(barDeal)
            
            stack.addArrangedSubview(row)
        }
    }
    
    @objc private func actionAddEmployee() {
        let vc = AdminEmployeesViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func actionAddAgent() {
        let vc = AdminAgentsViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func actionExperts() {
        let vc = AdminExpertsViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func actionSettings() {
        let vc = AdminSettingsViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
}

class StatsCard: UIView {
    private let titleLabel = UILabel()
    private let valueLabel = UILabel()
    
    init(title: String, value: String, color: UIColor) {
        super.init(frame: .zero)
        backgroundColor = .white
        layer.cornerRadius = 12
        layer.borderWidth = 1
        layer.borderColor = UIColor.systemGray5.cgColor
        
        titleLabel.text = title
        titleLabel.font = DesignSystem.Fonts.regular(size: 14)
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
    
    func updateTitle(to newTitle: String) {
        titleLabel.text = newTitle
    }
}
