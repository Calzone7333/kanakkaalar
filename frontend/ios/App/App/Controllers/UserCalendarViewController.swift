import UIKit

class UserCalendarViewController: UIViewController {

    private let calendarView = UICalendarView()
    private let tableView = UITableView()
    
    private struct ComplianceEvent {
        let title: String
        let date: String
        let priority: String
    }
    
    private var events: [ComplianceEvent] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Compliance Calendar"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        calendarView.translatesAutoresizingMaskIntoConstraints = false
        calendarView.calendar = .current
        calendarView.locale = .current
        calendarView.fontDesign = .rounded
        calendarView.backgroundColor = .white
        calendarView.layer.cornerRadius = 12
        calendarView.delegate = self
        
        // Selection behavior
        let selection = UICalendarSelectionSingleDate(delegate: self)
        calendarView.selectionBehavior = selection
        
        view.addSubview(calendarView)
        
        tableView.backgroundColor = DesignSystem.Colors.windowBackground
        tableView.translatesAutoresizingMaskIntoConstraints = false
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(ComplianceEventCell.self, forCellReuseIdentifier: "ComplianceEventCell")
        tableView.separatorStyle = .none
        view.addSubview(tableView)
        
        NSLayoutConstraint.activate([
            calendarView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            calendarView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            calendarView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            // Height is intrinsic for UICalendarView usually, but we can constrain bottom
            
            tableView.topAnchor.constraint(equalTo: calendarView.bottomAnchor, constant: 16),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func loadData() {
        // Mock Data
        events = [
            ComplianceEvent(title: "GST Return Filing (GSTR-1)", date: "11th Dec 2024", priority: "High"),
            ComplianceEvent(title: "GST Return Filing (GSTR-3B)", date: "20th Dec 2024", priority: "High"),
            ComplianceEvent(title: "TDS Payment", date: "07th Jan 2025", priority: "Medium"),
            ComplianceEvent(title: "PF Return Filing", date: "15th Jan 2025", priority: "Medium")
        ]
        tableView.reloadData()
    }
}

// MARK: - Calendar Delegate
extension UserCalendarViewController: UICalendarViewDelegate, UICalendarSelectionSingleDateDelegate {
    func dateSelection(_ selection: UICalendarSelectionSingleDate, didSelectDate dateComponents: DateComponents?) {
        guard let date = dateComponents?.date else { return }
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        let dateStr = formatter.string(from: date)
        
        let alert = UIAlertController(title: "Selected Date", message: dateStr, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}

// MARK: - TableView
extension UserCalendarViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return events.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ComplianceEventCell", for: indexPath) as! ComplianceEventCell
        let event = events[indexPath.row]
        cell.configure(with: event)
        return cell
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let view = UIView()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        let label = UILabel()
        label.text = "Upcoming Deadlines"
        label.font = DesignSystem.Fonts.bold(size: 16)
        label.textColor = DesignSystem.Colors.textPrimary
        label.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(label)
        
        NSLayoutConstraint.activate([
            label.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
        return view
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 40
    }
}

// MARK: - Cell
class ComplianceEventCell: UITableViewCell {
    
    private let containerView = UIView()
    private let titleLabel = UILabel()
    private let dateLabel = UILabel()
    private let priorityBadge = UILabel()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupUI() {
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        titleLabel.font = DesignSystem.Fonts.bold(size: 14)
        titleLabel.textColor = DesignSystem.Colors.textPrimary
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(titleLabel)
        
        dateLabel.font = DesignSystem.Fonts.regular(size: 14)
        dateLabel.textColor = DesignSystem.Colors.textSecondary
        dateLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(dateLabel)
        
        priorityBadge.font = DesignSystem.Fonts.bold(size: 12)
        priorityBadge.textAlignment = .center
        priorityBadge.layer.cornerRadius = 4
        priorityBadge.layer.masksToBounds = true
        priorityBadge.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(priorityBadge)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            titleLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            titleLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            titleLabel.trailingAnchor.constraint(lessThanOrEqualTo: priorityBadge.leadingAnchor, constant: -8),
            
            dateLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            dateLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            dateLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12),
            
            priorityBadge.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            priorityBadge.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            priorityBadge.widthAnchor.constraint(equalToConstant: 80),
            priorityBadge.heightAnchor.constraint(equalToConstant: 24)
        ])
    }
    
    func configure(with event: ComplianceEvent) {
        titleLabel.text = event.title
        dateLabel.text = "Due: \(event.date)"
        priorityBadge.text = event.priority
        
        if event.priority == "High" {
            priorityBadge.backgroundColor = UIColor(hex: "#FEF2F2") // Light Red
            priorityBadge.textColor = DesignSystem.Colors.error
            dateLabel.textColor = DesignSystem.Colors.error
        } else {
            priorityBadge.backgroundColor = UIColor(hex: "#FFFBEB") // Light Yellow
            priorityBadge.textColor = UIColor(hex: "#D97706")
            dateLabel.textColor = UIColor(hex: "#D97706")
        }
    }
}
