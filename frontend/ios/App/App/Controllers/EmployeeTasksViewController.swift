import UIKit

class EmployeeTasksViewController: UIViewController {

    private let searchContainer = UIView()
    private let searchField = UITextField()
    private let filterScrollView = UIScrollView()
    private let filterStack = UIStackView()
    private let emptyLabel = UILabel()
    private let tableView = UITableView()
    
    // Data
    private struct EmployeeTask {
        let id: String
        let service: String
        let customer: String
        let status: String
        let date: String
    }
    
    private var allTasks: [EmployeeTask] = []
    private var displayedTasks: [EmployeeTask] = []
    private var currentFilter = "ALL" // ALL, ASSIGNED, IN_PROGRESS, COMPLETED
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "My Tasks"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        // Search
        searchContainer.backgroundColor = .white
        searchContainer.layer.cornerRadius = 8
        searchContainer.layer.borderWidth = 1
        searchContainer.layer.borderColor = UIColor.systemGray5.cgColor
        searchContainer.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(searchContainer)
        
        let searchIcon = UIImageView(image: UIImage(systemName: "magnifyingglass"))
        searchIcon.tintColor = .gray
        searchIcon.translatesAutoresizingMaskIntoConstraints = false
        searchContainer.addSubview(searchIcon)
        
        searchField.placeholder = "Search tasks..."
        searchField.font = DesignSystem.Fonts.regular(size: 14)
        searchField.addTarget(self, action: #selector(handleSearchChanged), for: .editingChanged)
        searchField.translatesAutoresizingMaskIntoConstraints = false
        searchContainer.addSubview(searchField)
        
        // Filters
        filterScrollView.showsHorizontalScrollIndicator = false
        filterScrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(filterScrollView)
        
        filterStack.axis = .horizontal
        filterStack.spacing = 8
        filterStack.translatesAutoresizingMaskIntoConstraints = false
        filterScrollView.addSubview(filterStack)
        
        let filters = ["All", "Assigned", "In Progress", "Completed"]
        for (index, filter) in filters.enumerated() {
            let chip = UIButton(type: .system)
            chip.setTitle(filter, for: .normal)
            chip.titleLabel?.font = DesignSystem.Fonts.medium(size: 14)
            chip.layer.cornerRadius = 16
            chip.contentEdgeInsets = UIEdgeInsets(top: 8, left: 16, bottom: 8, right: 16)
            chip.tag = index
            chip.addTarget(self, action: #selector(handleFilterTapped(_:)), for: .touchUpInside)
            
            if index == 0 {
                styleChip(chip, selected: true)
            } else {
                styleChip(chip, selected: false)
            }
            
            filterStack.addArrangedSubview(chip)
        }
        
        // Empty State
        emptyLabel.text = "No tasks found"
        emptyLabel.textColor = .gray
        emptyLabel.font = DesignSystem.Fonts.regular(size: 16)
        emptyLabel.textAlignment = .center
        emptyLabel.isHidden = true
        emptyLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emptyLabel)
        
        // TableView
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(EmployeeTaskCell.self, forCellReuseIdentifier: "EmployeeTaskCell") // Reusing from Home logic
        tableView.separatorStyle = .none
        tableView.backgroundColor = .clear
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        
        NSLayoutConstraint.activate([
            searchContainer.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            searchContainer.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            searchContainer.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            searchContainer.heightAnchor.constraint(equalToConstant: 44),
            
            searchIcon.leadingAnchor.constraint(equalTo: searchContainer.leadingAnchor, constant: 12),
            searchIcon.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor),
            searchIcon.widthAnchor.constraint(equalToConstant: 20),
            searchIcon.heightAnchor.constraint(equalToConstant: 20),
            
            searchField.leadingAnchor.constraint(equalTo: searchIcon.trailingAnchor, constant: 8),
            searchField.trailingAnchor.constraint(equalTo: searchContainer.trailingAnchor, constant: -12),
            searchField.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor),
            searchField.heightAnchor.constraint(equalToConstant: 40),
            
            filterScrollView.topAnchor.constraint(equalTo: searchContainer.bottomAnchor, constant: 12),
            filterScrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            filterScrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            filterScrollView.heightAnchor.constraint(equalToConstant: 40),
            
            filterStack.topAnchor.constraint(equalTo: filterScrollView.topAnchor),
            filterStack.leadingAnchor.constraint(equalTo: filterScrollView.leadingAnchor),
            filterStack.trailingAnchor.constraint(equalTo: filterScrollView.trailingAnchor),
            filterStack.bottomAnchor.constraint(equalTo: filterScrollView.bottomAnchor),
            filterStack.heightAnchor.constraint(equalTo: filterScrollView.heightAnchor),
            
            emptyLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            
            tableView.topAnchor.constraint(equalTo: filterScrollView.bottomAnchor, constant: 12),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func styleChip(_ button: UIButton, selected: Bool) {
        if selected {
            button.backgroundColor = DesignSystem.Colors.primary
            button.setTitleColor(.white, for: .normal)
            button.layer.borderWidth = 0
        } else {
            button.backgroundColor = .white
            button.setTitleColor(DesignSystem.Colors.textPrimary, for: .normal)
            button.layer.borderWidth = 1
            button.layer.borderColor = UIColor.systemGray4.cgColor
        }
    }
    
    @objc private func handleFilterTapped(_ sender: UIButton) {
        // Reset styles
        for case let btn as UIButton in filterStack.arrangedSubviews {
            styleChip(btn, selected: false)
        }
        styleChip(sender, selected: true)
        
        let tag = sender.tag
        switch tag {
        case 0: currentFilter = "ALL"
        case 1: currentFilter = "ASSIGNED"
        case 2: currentFilter = "IN_PROGRESS"
        case 3: currentFilter = "COMPLETED"
        default: currentFilter = "ALL"
        }
        
        applyFilters()
    }
    
    @objc private func handleSearchChanged() {
        applyFilters()
    }
    
    private func applyFilters() {
        let query = searchField.text?.lowercased() ?? ""
        
        displayedTasks = allTasks.filter { task in
            // Status Check
            let statusMatch = (currentFilter == "ALL") || 
                              (currentFilter == "ASSIGNED" && task.status == "ASSIGNED") ||
                              (currentFilter == "IN_PROGRESS" && task.status == "IN_PROGRESS") ||
                              (currentFilter == "COMPLETED" && task.status == "COMPLETED")
            
            // Query Check
            let queryMatch = query.isEmpty || 
                             task.service.lowercased().contains(query) ||
                             task.customer.lowercased().contains(query)
            
            return statusMatch && queryMatch
        }
        
        tableView.reloadData()
        emptyLabel.isHidden = !displayedTasks.isEmpty
    }
    
    private func loadData() {
        allTasks = [
            EmployeeTask(id: "1023", service: "GST Registration", customer: "client1@example.com", status: "IN_PROGRESS", date: "Today"),
            EmployeeTask(id: "1024", service: "ITR Filing", customer: "client2@example.com", status: "ASSIGNED", date: "Yesterday"),
            EmployeeTask(id: "1021", service: "Trademark", customer: "client3@example.com", status: "COMPLETED", date: "2 days ago"),
            EmployeeTask(id: "1025", service: "FSSAI License", customer: "freshfoods@example.com", status: "ASSIGNED", date: "3 days ago"),
            EmployeeTask(id: "1026", service: "Company Formation", customer: "startup@india.com", status: "IN_PROGRESS", date: "4 days ago")
        ]
        applyFilters()
    }
}

extension EmployeeTasksViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return displayedTasks.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        // Reusing EmployeeTaskCell defined in EmployeeHomeViewController if public/available.
        // Swift classes in same module are internal by default, so it should be visible.
        // But EmployeeTaskCell was defined inside EmployeeHomeViewController file, but OUTSIDE the class.
        // However, I used EmployeeHomeViewController.Order inside it. 
        // Here I have EmployeeTasksViewController.EmployeeTask. Data types mismatch.
        // I will duplicate/adapt the cell here to be safe and avoid tight coupling with Home VC's model.
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "EmployeeTaskCell", for: indexPath) as! TaskListCell
        cell.configure(with: displayedTasks[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 100
    }
}

class TaskListCell: UITableViewCell {
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
    
    func configure(with task: EmployeeTasksViewController.EmployeeTask) {
        serviceLabel.text = task.service
        clientLabel.text = task.customer
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
