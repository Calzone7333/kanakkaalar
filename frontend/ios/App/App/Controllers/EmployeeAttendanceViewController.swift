import UIKit

class EmployeeAttendanceViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Overview
    private let dateLabel = UILabel()
    private let timeLabel = UILabel()
    private let durationLabel = UILabel()
    private let checkInOutButton = UIButton(type: .system)
    
    // Stats
    private let statsContainer = UIView()
    private let daysPresentLabel = UILabel()
    
    // History
    private let historyLabel = UILabel()
    private let tableView = UITableView()
    
    // State
    private var isCheckedIn = false
    private var checkInTime: Date?
    private var timer: Timer?
    
    // Data
    private struct AttendanceHistory {
        let date: String
        let timeIn: String
        let timeOut: String
        let status: String
    }
    
    private var history: [AttendanceHistory] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "My Attendance"
        
        setupUI()
        startTimer()
        loadData()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        timer?.invalidate()
    }
    
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        // Date & Time
        dateLabel.font = DesignSystem.Fonts.regular(size: 16)
        dateLabel.textColor = DesignSystem.Colors.textSecondary
        dateLabel.textAlignment = .center
        dateLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(dateLabel)
        
        timeLabel.font = DesignSystem.Fonts.bold(size: 32)
        timeLabel.textColor = DesignSystem.Colors.textPrimary
        timeLabel.textAlignment = .center
        timeLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(timeLabel)
        
        durationLabel.text = "00:00:00"
        durationLabel.font = DesignSystem.Fonts.medium(size: 20)
        durationLabel.textColor = DesignSystem.Colors.primary
        durationLabel.textAlignment = .center
        durationLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(durationLabel)
        
        // Check In/Out Button
        checkInOutButton.backgroundColor = .white
        checkInOutButton.layer.cornerRadius = 60
        checkInOutButton.layer.borderWidth = 1
        checkInOutButton.layer.borderColor = DesignSystem.Colors.primary.cgColor
        checkInOutButton.setTitleColor(DesignSystem.Colors.primary, for: .normal)
        checkInOutButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 18)
        checkInOutButton.setTitle("Check In", for: .normal)
        checkInOutButton.addTarget(self, action: #selector(handleCheckInOut), for: .touchUpInside)
        checkInOutButton.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(checkInOutButton)
        
        // Stats
        statsContainer.backgroundColor = .white
        statsContainer.layer.cornerRadius = 12
        statsContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(statsContainer)
        
        let label = UILabel()
        label.text = "Days Present (This Month)"
        label.font = DesignSystem.Fonts.regular(size: 14)
        label.textColor = DesignSystem.Colors.textSecondary
        label.translatesAutoresizingMaskIntoConstraints = false
        statsContainer.addSubview(label)
        
        daysPresentLabel.text = "0 Days"
        daysPresentLabel.font = DesignSystem.Fonts.bold(size: 20)
        daysPresentLabel.textColor = DesignSystem.Colors.textPrimary
        daysPresentLabel.translatesAutoresizingMaskIntoConstraints = false
        statsContainer.addSubview(daysPresentLabel)
        
        // History
        historyLabel.text = "Recent History"
        historyLabel.font = DesignSystem.Fonts.bold(size: 18)
        historyLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(historyLabel)
        
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(UserAttendanceCell.self, forCellReuseIdentifier: "UserAttendanceCell")
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
            
            dateLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 24),
            dateLabel.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            
            timeLabel.topAnchor.constraint(equalTo: dateLabel.bottomAnchor, constant: 8),
            timeLabel.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            
            durationLabel.topAnchor.constraint(equalTo: timeLabel.bottomAnchor, constant: 8),
            durationLabel.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            
            checkInOutButton.topAnchor.constraint(equalTo: durationLabel.bottomAnchor, constant: 32),
            checkInOutButton.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            checkInOutButton.widthAnchor.constraint(equalToConstant: 120),
            checkInOutButton.heightAnchor.constraint(equalToConstant: 120),
            
            statsContainer.topAnchor.constraint(equalTo: checkInOutButton.bottomAnchor, constant: 32),
            statsContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            statsContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            statsContainer.heightAnchor.constraint(equalToConstant: 80),
            
            label.topAnchor.constraint(equalTo: statsContainer.topAnchor, constant: 16),
            label.leadingAnchor.constraint(equalTo: statsContainer.leadingAnchor, constant: 16),
            
            daysPresentLabel.topAnchor.constraint(equalTo: label.bottomAnchor, constant: 4),
            daysPresentLabel.leadingAnchor.constraint(equalTo: statsContainer.leadingAnchor, constant: 16),
            
            historyLabel.topAnchor.constraint(equalTo: statsContainer.bottomAnchor, constant: 32),
            historyLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            
            tableView.topAnchor.constraint(equalTo: historyLabel.bottomAnchor, constant: 12),
            tableView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20),
            tableView.heightAnchor.constraint(equalToConstant: 300)
        ])
    }
    
    private func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.updateTime()
        }
        updateTime()
    }
    
    private func updateTime() {
        let now = Date()
        let timeFormatter = DateFormatter()
        timeFormatter.dateFormat = "hh:mm:ss a"
        timeLabel.text = timeFormatter.string(from: now)
        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "EEEE, d MMMM yyyy"
        dateLabel.text = dateFormatter.string(from: now)
        
        if isCheckedIn, let start = checkInTime {
            let diff = Int(now.timeIntervalSince(start))
            let hours = diff / 3600
            let minutes = (diff % 3600) / 60
            let seconds = diff % 60
            durationLabel.text = String(format: "%02d:%02d:%02d", hours, minutes, seconds)
        }
    }
    
    private func loadData() {
        // Mock
        daysPresentLabel.text = "18 Days"
        history = [
            AttendanceHistory(date: "Yesterday", timeIn: "09:05 AM", timeOut: "06:10 PM", status: "Present"),
            AttendanceHistory(date: "Mon, 8 Dec", timeIn: "09:00 AM", timeOut: "06:00 PM", status: "Present"),
            AttendanceHistory(date: "Sun, 7 Dec", timeIn: "-", timeOut: "-", status: "Absent")
        ]
        tableView.reloadData()
        tableView.heightAnchor.constraint(equalToConstant: CGFloat(history.count * 80)).isActive = true
    }
    
    @objc private func handleCheckInOut() {
        if isCheckedIn {
            // Check Out
            isCheckedIn = false
            checkInTime = nil
            checkInOutButton.setTitle("Check In", for: .normal)
            checkInOutButton.setTitleColor(DesignSystem.Colors.primary, for: .normal)
            checkInOutButton.layer.borderColor = DesignSystem.Colors.primary.cgColor
            checkInOutButton.backgroundColor = .white
            durationLabel.text = "00:00:00"
        } else {
            // Check In
            isCheckedIn = true
            checkInTime = Date()
            checkInOutButton.setTitle("Check Out", for: .normal)
            checkInOutButton.setTitleColor(.white, for: .normal)
            checkInOutButton.layer.borderColor = UIColor.systemRed.cgColor
            checkInOutButton.backgroundColor = UIColor.systemRed
        }
    }
}

extension EmployeeAttendanceViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return history.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "UserAttendanceCell", for: indexPath) as! UserAttendanceCell
        cell.configure(with: history[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 80
    }
}

class UserAttendanceCell: UITableViewCell {
    private let containerView = UIView()
    private let dateLabel = UILabel()
    private let timeLabel = UILabel()
    private let statusLabel = UILabel()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        dateLabel.font = DesignSystem.Fonts.bold(size: 16)
        dateLabel.textColor = DesignSystem.Colors.textPrimary
        dateLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(dateLabel)
        
        timeLabel.font = DesignSystem.Fonts.regular(size: 12)
        timeLabel.textColor = DesignSystem.Colors.textSecondary
        timeLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(timeLabel)
        
        statusLabel.font = DesignSystem.Fonts.bold(size: 12)
        statusLabel.textAlignment = .right
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(statusLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 4),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -4),
            
            dateLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 16),
            dateLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            timeLabel.topAnchor.constraint(equalTo: dateLabel.bottomAnchor, constant: 4),
            timeLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            timeLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -16),
            
            statusLabel.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with item: EmployeeAttendanceViewController.AttendanceHistory) {
        dateLabel.text = item.date
        timeLabel.text = "In: \(item.timeIn) | Out: \(item.timeOut)"
        statusLabel.text = item.status
        
        if item.status == "Present" {
            statusLabel.textColor = UIColor(hex: "#10B981")
        } else {
            statusLabel.textColor = UIColor(hex: "#EF4444")
        }
    }
}
