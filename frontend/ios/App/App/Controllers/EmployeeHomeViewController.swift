import UIKit

class EmployeeHomeViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Header
    private let headerContainer = UIView()
    private let nameLabel = UILabel()
    private let dateLabel = UILabel()
    private let profileImageView = UIImageView()
    
    // Stats
    private let subtitleLabel = UILabel()
    private let statsStack = UIStackView()
    
    // Recent Tasks
    private let tasksLabel = UILabel()
    private let viewAllButton = UIButton(type: .system)
    private let taskTableView = UITableView()
    
    // Stats (Docs)
    private let docsLabel = UILabel()
    
    // Mock Data
    private struct Order {
        let id: String
        let serviceName: String
        let status: String
        let customerEmail: String
        let date: String
    }
    
    private var recentTasks: [Order] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Employee Dashboard"
        
        setupUI()
        loadData()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: animated)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        navigationController?.setNavigationBarHidden(false, animated: animated)
    }
    
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        // Header
        headerContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(headerContainer)
        
        nameLabel.font = DesignSystem.Fonts.bold(size: 24)
        nameLabel.textColor = DesignSystem.Colors.textPrimary
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(nameLabel)
        
        dateLabel.font = DesignSystem.Fonts.regular(size: 14)
        dateLabel.textColor = DesignSystem.Colors.textSecondary
        dateLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(dateLabel)
        
        profileImageView.backgroundColor = .systemGray5
        profileImageView.layer.cornerRadius = 20
        profileImageView.layer.masksToBounds = true
        profileImageView.contentMode = .scaleAspectFill
        profileImageView.image = UIImage(systemName: "person.circle.fill")
        profileImageView.tintColor = .systemGray3
        profileImageView.translatesAutoresizingMaskIntoConstraints = false
        profileImageView.isUserInteractionEnabled = true
        let profileTap = UITapGestureRecognizer(target: self, action: #selector(handleProfile))
        profileImageView.addGestureRecognizer(profileTap)
        headerContainer.addSubview(profileImageView)
        
        // Stats
        subtitleLabel.font = DesignSystem.Fonts.regular(size: 14)
        subtitleLabel.textColor = DesignSystem.Colors.textPrimary
        subtitleLabel.text = "You have 0 active tasks requiring attention today."
        subtitleLabel.numberOfLines = 0
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(subtitleLabel)
        
        statsStack.axis = .horizontal
        statsStack.spacing = 12
        statsStack.distribution = .fillEqually
        statsStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(statsStack)
        
        statsStack.addArrangedSubview(createStatCard(title: "Assigned", value: "0", color: .systemBlue))
        statsStack.addArrangedSubview(createStatCard(title: "In Progress", value: "0", color: .systemOrange))
        statsStack.addArrangedSubview(createStatCard(title: "Completed", value: "0", color: .systemGreen))
        
        // Recent Tasks Header
        let tasksHeader = UIView()
        tasksHeader.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(tasksHeader)
        
        tasksLabel.text = "Recent Tasks"
        tasksLabel.font = DesignSystem.Fonts.bold(size: 18)
        tasksLabel.translatesAutoresizingMaskIntoConstraints = false
        tasksHeader.addSubview(tasksLabel)
        
        viewAllButton.setTitle("View All", for: .normal)
        viewAllButton.setTitleColor(DesignSystem.Colors.primary, for: .normal)
        viewAllButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
        viewAllButton.translatesAutoresizingMaskIntoConstraints = false
        viewAllButton.addTarget(self, action: #selector(handleViewAll), for: .touchUpInside)
        tasksHeader.addSubview(viewAllButton)
        
        // Task Table
        taskTableView.dataSource = self
        taskTableView.delegate = self
        taskTableView.register(EmployeeTaskCell.self, forCellReuseIdentifier: "EmployeeTaskCell")
        taskTableView.separatorStyle = .none
        taskTableView.backgroundColor = .clear
        taskTableView.isScrollEnabled = false
        taskTableView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(taskTableView)
        
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
            
            nameLabel.topAnchor.constraint(equalTo: headerContainer.topAnchor),
            nameLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor),
            
            dateLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            dateLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor),
            
            profileImageView.centerYAnchor.constraint(equalTo: headerContainer.centerYAnchor),
            profileImageView.trailingAnchor.constraint(equalTo: headerContainer.trailingAnchor),
            profileImageView.widthAnchor.constraint(equalToConstant: 40),
            profileImageView.heightAnchor.constraint(equalToConstant: 40),
            
            subtitleLabel.topAnchor.constraint(equalTo: headerContainer.bottomAnchor, constant: 16),
            subtitleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            subtitleLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            
            statsStack.topAnchor.constraint(equalTo: subtitleLabel.bottomAnchor, constant: 24),
            statsStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            statsStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            statsStack.heightAnchor.constraint(equalToConstant: 100),
            
            tasksHeader.topAnchor.constraint(equalTo: statsStack.bottomAnchor, constant: 32),
            tasksHeader.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            tasksHeader.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            tasksHeader.heightAnchor.constraint(equalToConstant: 30),
            
            tasksLabel.leadingAnchor.constraint(equalTo: tasksHeader.leadingAnchor),
            tasksLabel.centerYAnchor.constraint(equalTo: tasksHeader.centerYAnchor),
            
            viewAllButton.trailingAnchor.constraint(equalTo: tasksHeader.trailingAnchor),
            viewAllButton.centerYAnchor.constraint(equalTo: tasksHeader.centerYAnchor),
            
            taskTableView.topAnchor.constraint(equalTo: tasksHeader.bottomAnchor, constant: 12),
            taskTableView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            taskTableView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            taskTableView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20),
            taskTableView.heightAnchor.constraint(equalToConstant: 400) // Placeholder height
        ])
    }
    
    private func createStatCard(title: String, value: String, color: UIColor) -> UIView {
        let container = UIView()
        container.backgroundColor = .white
        container.layer.cornerRadius = 12
        container.layer.borderWidth = 1
        container.layer.borderColor = UIColor.systemGray5.cgColor
        
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = DesignSystem.Fonts.regular(size: 12)
        titleLabel.textColor = DesignSystem.Colors.textSecondary
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let valueLabel = UILabel()
        valueLabel.text = value
        valueLabel.font = DesignSystem.Fonts.bold(size: 24)
        valueLabel.textColor = color
        valueLabel.translatesAutoresizingMaskIntoConstraints = false
        
        container.addSubview(titleLabel)
        container.addSubview(valueLabel)
        
        NSLayoutConstraint.activate([
            valueLabel.centerYAnchor.constraint(equalTo: container.centerYAnchor, constant: -8),
            valueLabel.centerXAnchor.constraint(equalTo: container.centerXAnchor),
            
            titleLabel.topAnchor.constraint(equalTo: valueLabel.bottomAnchor, constant: 4),
            titleLabel.centerXAnchor.constraint(equalTo: container.centerXAnchor)
        ])
        
        return container
    }
    
    private func loadData() {
        let userName = SessionManager.shared.getUserName()
        nameLabel.text = "Hi, \(userName)"
        
        let formatter = DateFormatter()
        formatter.dateStyle = .full
        dateLabel.text = formatter.string(from: Date())
        
        // Mock Stats update
        if let stack = statsStack.arrangedSubviews as? [UIView] {
             // Safe casting logic here, but for simplicity assuming order
             // In real app, bind views to variables
            // Quick mock update
            func updateLabel(in view: UIView, val: String) {
               if let label = view.subviews.first(where: { ($0 as? UILabel)?.font == DesignSystem.Fonts.bold(size: 24) }) as? UILabel {
                   label.text = val
               }
            }
            // Mock values matching Android initial state or realistic mock
            updateLabel(in: stack[0], val: "5") // Assigned
            updateLabel(in: stack[1], val: "2") // In Progress
            updateLabel(in: stack[2], val: "12") // Completed
        }
        subtitleLabel.text = "You have 2 active tasks requiring attention today."
        
        // Mock Tasks
        recentTasks = [
            Order(id: "1023", serviceName: "GST Registration", status: "IN_PROGRESS", customerEmail: "client1@example.com", date: "Today"),
            Order(id: "1024", serviceName: "ITR Filing", status: "ASSIGNED", customerEmail: "client2@example.com", date: "Yesterday"),
            Order(id: "1021", serviceName: "Trademark", status: "COMPLETED", customerEmail: "client3@example.com", date: "2 days ago")
        ]
        
        taskTableView.reloadData()
        taskTableView.heightAnchor.constraint(equalToConstant: CGFloat(recentTasks.count * 100)).isActive = true
    }
    
    @objc private func handleProfile() {
        let vc = ProfileViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func handleViewAll() {
        if let tabBarController = self.tabBarController {
             tabBarController.selectedIndex = 1 // Navigate to Tasks Tab
        }
    }
}

extension EmployeeHomeViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return recentTasks.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "EmployeeTaskCell", for: indexPath) as! EmployeeTaskCell
        cell.configure(with: recentTasks[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 100
    }
}

class EmployeeTaskCell: UITableViewCell {
    private let containerView = UIView()
    private let serviceLabel = UILabel()
    private let clientLabel = UILabel()
    private let statusLabel = UILabel()
    private let dateLabel = UILabel()
    
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
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            serviceLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            serviceLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            clientLabel.topAnchor.constraint(equalTo: serviceLabel.bottomAnchor, constant: 4),
            clientLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            dateLabel.topAnchor.constraint(equalTo: clientLabel.bottomAnchor, constant: 8),
            dateLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            dateLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12),
            
            statusLabel.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            statusLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 80),
            statusLabel.heightAnchor.constraint(equalToConstant: 24)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with task: EmployeeHomeViewController.Order) {
        serviceLabel.text = task.serviceName
        clientLabel.text = task.customerEmail
        dateLabel.text = task.date
        statusLabel.text = " \(task.status) "
        
        switch task.status {
        case "COMPLETED":
            statusLabel.backgroundColor = UIColor(hex: "#ECFDF5")
            statusLabel.textColor = UIColor(hex: "#10B981") // Green
        case "IN_PROGRESS", "ASSIGNED":
            statusLabel.backgroundColor = UIColor(hex: "#FFFBEB")
            statusLabel.textColor = UIColor(hex: "#D97706") // Amber
        default:
            statusLabel.backgroundColor = UIColor(hex: "#F1F5F9")
            statusLabel.textColor = UIColor(hex: "#64748B") // Slate
        }
    }
}
