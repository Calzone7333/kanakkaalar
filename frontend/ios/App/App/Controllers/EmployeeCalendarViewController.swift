import UIKit

class EmployeeCalendarViewController: UIViewController {

    private let calendarView = UIDatePicker()
    private let tableView = UITableView()
    private let emptyLabel = UILabel()
    private let activityIndicator = UIActivityIndicatorView(style: .large)
    
    private var allOrders: [Order] = []
    private var filteredOrders: [Order] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Schedule"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        // Calendar (Inline DatePicker)
        calendarView.datePickerMode = .date
        if #available(iOS 14.0, *) {
            calendarView.preferredDatePickerStyle = .inline
        } else {
            calendarView.preferredDatePickerStyle = .wheels // Fallback
        }
        calendarView.backgroundColor = .white
        calendarView.layer.cornerRadius = 12
        calendarView.translatesAutoresizingMaskIntoConstraints = false
        calendarView.addTarget(self, action: #selector(dateChanged), for: .valueChanged)
        view.addSubview(calendarView)
        
        // TableView
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(CalendarEventCell.self, forCellReuseIdentifier: "CalendarEventCell")
        tableView.separatorStyle = .none
        tableView.backgroundColor = .clear
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        
        // Empty Label
        emptyLabel.text = "No events for this date"
        emptyLabel.textColor = DesignSystem.Colors.textSecondary
        emptyLabel.textAlignment = .center
        emptyLabel.isHidden = true
        emptyLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emptyLabel)
        
         activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)
        
        NSLayoutConstraint.activate([
            calendarView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            calendarView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            calendarView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            
            tableView.topAnchor.constraint(equalTo: calendarView.bottomAnchor, constant: 16),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            emptyLabel.centerXAnchor.constraint(equalTo: tableView.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: tableView.centerYAnchor),
            
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
    
    @objc private func dateChanged() {
        filterOrders(for: calendarView.date)
    }
    
    private func loadData() {
        activityIndicator.startAnimating()
        APIService.shared.getAllOrders { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                switch result {
                case .success(let data):
                    self?.allOrders = data
                    self?.filterOrders(for: self?.calendarView.date ?? Date())
                case .failure(let error):
                    print("Error fetching orders: \(error)")
                    // Show generic error or toast
                }
            }
        }
    }
    
    private func filterOrders(for date: Date) {
        let calendar = Calendar.current
        filteredOrders = allOrders.filter { order in
             // Ideally order has a dueDate or scheduleDate. Using 'createdAt' for now as per Android logic.
             // Android logic: parse createdAt and check if same day.
             // iOS logic: we need to parse string date.
             // Note: Order model needs a date parsing helper or we do it here.
             // Assuming APIService provided Order struct does not parse Date automatically.
             // We need to parse string manually.
             guard let dateStr = order.createdAtStr() else { return false }
             
             return calendar.isDate(dateStr, inSameDayAs: date)
        }
        
        tableView.reloadData()
        emptyLabel.isHidden = !filteredOrders.isEmpty
    }
}

extension EmployeeCalendarViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return filteredOrders.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "CalendarEventCell", for: indexPath) as! CalendarEventCell
        cell.configure(with: filteredOrders[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 90
    }
}

class CalendarEventCell: UITableViewCell {
    private let containerView = UIView()
    private let titleLabel = UILabel()
    private let clientLabel = UILabel() // Added Client
    private let statusLabel = UILabel()
    private let sideBar = UIView()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.clipsToBounds = true
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        sideBar.backgroundColor = DesignSystem.Colors.primary
        sideBar.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(sideBar)
        
        titleLabel.font = DesignSystem.Fonts.bold(size: 16)
        titleLabel.textColor = DesignSystem.Colors.textPrimary
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(titleLabel)
        
        clientLabel.font = DesignSystem.Fonts.regular(size: 14)
        clientLabel.textColor = DesignSystem.Colors.textSecondary
        clientLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(clientLabel)
        
        statusLabel.font = DesignSystem.Fonts.bold(size: 12)
        statusLabel.textAlignment = .right
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(statusLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            sideBar.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            sideBar.topAnchor.constraint(equalTo: containerView.topAnchor),
            sideBar.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
            sideBar.widthAnchor.constraint(equalToConstant: 6),
            
            titleLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            titleLabel.leadingAnchor.constraint(equalTo: sideBar.trailingAnchor, constant: 12),
            titleLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -12),
            
            clientLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            clientLabel.leadingAnchor.constraint(equalTo: sideBar.trailingAnchor, constant: 12),
            
            statusLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -12)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with order: Order) {
        titleLabel.text = order.serviceName ?? "Service Order"
        clientLabel.text = order.customerEmail ?? "Unknown Client"
        
        let status = order.status?.uppercased() ?? "PENDING"
        statusLabel.text = status
        
        if status == "COMPLETED" {
            statusLabel.textColor = UIColor(hex: "#10B981") // Green
            sideBar.backgroundColor = UIColor(hex: "#10B981")
        } else if status == "CANCELLED" {
            statusLabel.textColor = UIColor(hex: "#EF4444") // Red
            sideBar.backgroundColor = UIColor(hex: "#EF4444")
        } else {
            statusLabel.textColor = UIColor(hex: "#F59E0B") // Amber
            sideBar.backgroundColor = UIColor(hex: "#F59E0B")
        }
    }
}

// Helper for Order Date parsing
extension Order {
    func createdAtStr() -> Date? {
        guard let dateString = createdAt else { return nil }
        // Try ISO8601
        let isoFormatter = ISO8601DateFormatter()
        isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let date = isoFormatter.date(from: dateString) {
            return date
        }
        // Fallback or other formats
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        if let date = formatter.date(from: dateString) { return date }
        
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.date(from: dateString)
    }
}
