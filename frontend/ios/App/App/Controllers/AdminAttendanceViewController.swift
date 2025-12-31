import UIKit

class AdminAttendanceViewController: UIViewController {

    private let chartContainer = UIView()
    private let listContainer = UIView()
    private let tableView = UITableView()
    private let emptyLabel = UILabel()
    private let loadingIndicator = UIActivityIndicatorView(style: .medium)
    
    private var records: [AttendanceRecord] = []
    
    // Stats
    private var presentCount = 0
    private var lateCount = 0
    private var absentCount = 0

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Attendance"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        // Chart Place holder
        chartContainer.backgroundColor = .white
        chartContainer.layer.cornerRadius = 12
        chartContainer.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(chartContainer)
        
        let chartLabel = UILabel()
        chartLabel.text = "Today's Overview"
        chartLabel.font = DesignSystem.Fonts.bold(size: 16)
        chartLabel.translatesAutoresizingMaskIntoConstraints = false
        chartContainer.addSubview(chartLabel)
        
        // Simple Visual Stats instead of complex Pie Chart for now (Native-like simple UI)
        let statsStack = UIStackView()
        statsStack.axis = .horizontal
        statsStack.distribution = .fillEqually
        statsStack.spacing = 8
        statsStack.translatesAutoresizingMaskIntoConstraints = false
        chartContainer.addSubview(statsStack)
        
        statsStack.addArrangedSubview(createStatView(title: "Present", color: .systemGreen, tag: 1))
        statsStack.addArrangedSubview(createStatView(title: "Late", color: .systemOrange, tag: 2))
        statsStack.addArrangedSubview(createStatView(title: "Absent", color: .systemRed, tag: 3))
        
        // Empty Label
        emptyLabel.text = "No attendance records for today."
        emptyLabel.textColor = .gray
        emptyLabel.font = DesignSystem.Fonts.regular(size: 16)
        emptyLabel.textAlignment = .center
        emptyLabel.isHidden = true
        emptyLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emptyLabel)
        
        // List
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(AttendanceCell.self, forCellReuseIdentifier: "AttendanceCell")
        tableView.separatorStyle = .none
        tableView.backgroundColor = .clear
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        
        // Loading
        loadingIndicator.translatesAutoresizingMaskIntoConstraints = false
        loadingIndicator.hidesWhenStopped = true
        view.addSubview(loadingIndicator)
        
        NSLayoutConstraint.activate([
            chartContainer.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            chartContainer.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            chartContainer.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            chartContainer.heightAnchor.constraint(equalToConstant: 120),
            
            chartLabel.topAnchor.constraint(equalTo: chartContainer.topAnchor, constant: 12),
            chartLabel.leadingAnchor.constraint(equalTo: chartContainer.leadingAnchor, constant: 16),
            
            statsStack.topAnchor.constraint(equalTo: chartLabel.bottomAnchor, constant: 12),
            statsStack.leadingAnchor.constraint(equalTo: chartContainer.leadingAnchor, constant: 16),
            statsStack.trailingAnchor.constraint(equalTo: chartContainer.trailingAnchor, constant: -16),
            statsStack.bottomAnchor.constraint(equalTo: chartContainer.bottomAnchor, constant: -16),
            
            tableView.topAnchor.constraint(equalTo: chartContainer.bottomAnchor, constant: 16),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            emptyLabel.centerXAnchor.constraint(equalTo: tableView.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: tableView.centerYAnchor),
            
            loadingIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            loadingIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
    
    private func createStatView(title: String, color: UIColor, tag: Int) -> UIView {
        let view = UIView()
        view.backgroundColor = color.withAlphaComponent(0.1)
        view.layer.cornerRadius = 8
        
        let titleLbl = UILabel()
        titleLbl.text = title
        titleLbl.font = DesignSystem.Fonts.medium(size: 12)
        titleLbl.textColor = color
        titleLbl.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(titleLbl)
        
        let valueLbl = UILabel()
        valueLbl.tag = tag // 1: Present, 2: Late, 3: Absent
        valueLbl.text = "0"
        valueLbl.font = DesignSystem.Fonts.bold(size: 20)
        valueLbl.textColor = color
        valueLbl.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(valueLbl)
        
        NSLayoutConstraint.activate([
            valueLbl.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            valueLbl.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -8),
            
            titleLbl.topAnchor.constraint(equalTo: valueLbl.bottomAnchor, constant: 4),
            titleLbl.centerXAnchor.constraint(equalTo: view.centerXAnchor)
        ])
        
        return view
    }
    
    private func loadData() {
        loadingIndicator.startAnimating()
        APIService.shared.getAllAttendance { [weak self] result in
            DispatchQueue.main.async {
                self?.loadingIndicator.stopAnimating()
                switch result {
                case .success(let data):
                    self?.processData(data)
                case .failure(let error):
                    let alert = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default))
                    self?.present(alert, animated: true)
                }
            }
        }
    }
    
    private func processData(_ allRecords: [AttendanceRecord]) {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let today = formatter.string(from: Date())
        
        // Filter for today
        // Note: Assuming API date is full ISO or yyyy-MM-dd. Adjust logic if needed.
        // Android logic: recordDate.startsWith(todayDate)
        
        let todayRecords = allRecords.filter { record in
            guard let date = record.date.split(separator: "T").first else { return false }
            return String(date) == today
        }
        
        self.records = todayRecords
        
        // Calculate Stats
        presentCount = 0
        lateCount = 0
        absentCount = 0
        
        for record in todayRecords {
            let status = record.status?.lowercased() ?? "present"
            if status == "present" {
                presentCount += 1
            } else if status == "late" {
                lateCount += 1
            } else {
                absentCount += 1 // Absent or others
            }
        }
        
        // Update UI
        updateStatsUI()
        
        tableView.reloadData()
        emptyLabel.isHidden = !todayRecords.isEmpty
    }
    
    private func updateStatsUI() {
        if let presentLabel = view.viewWithTag(1) as? UILabel {
            presentLabel.text = "\(presentCount)"
        }
        if let lateLabel = view.viewWithTag(2) as? UILabel {
            lateLabel.text = "\(lateCount)"
        }
        if let absentLabel = view.viewWithTag(3) as? UILabel {
            absentLabel.text = "\(absentCount)"
        }
    }
}

extension AdminAttendanceViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return records.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "AttendanceCell", for: indexPath) as! AttendanceCell
        cell.configure(with: records[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 90
    }
}

class AttendanceCell: UITableViewCell {
    private let containerView = UIView()
    private let nameLabel = UILabel()
    private let timeLabel = UILabel()
    private let statusLabel = UILabel()
    private let durationLabel = UILabel()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        nameLabel.font = DesignSystem.Fonts.bold(size: 14)
        nameLabel.textColor = DesignSystem.Colors.textPrimary
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(nameLabel)
        
        timeLabel.font = DesignSystem.Fonts.regular(size: 12)
        timeLabel.textColor = DesignSystem.Colors.textSecondary
        timeLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(timeLabel)
        
        durationLabel.font = DesignSystem.Fonts.medium(size: 11)
        durationLabel.textColor = .systemGray
        durationLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(durationLabel)
        
        statusLabel.font = DesignSystem.Fonts.bold(size: 10)
        statusLabel.layer.cornerRadius = 4
        statusLabel.layer.masksToBounds = true
        statusLabel.textAlignment = .center
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(statusLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 4),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -4),
            
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            nameLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            timeLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            timeLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            durationLabel.topAnchor.constraint(equalTo: timeLabel.bottomAnchor, constant: 4),
            durationLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            durationLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12),
            
            statusLabel.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            statusLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 60),
            statusLabel.heightAnchor.constraint(equalToConstant: 22)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with record: AttendanceRecord) {
        nameLabel.text = record.user?.fullName ?? "Unknown"
        
        let inTime = formatTime(record.checkInTime)
        let outTime = formatTime(record.checkOutTime)
        timeLabel.text = "In: \(inTime) | Out: \(outTime)"
        
        durationLabel.text = record.duration != nil ? "Dur: \(record.duration!)" : ""
        
        let status = record.status ?? "Present"
        statusLabel.text = status.uppercased()
        
        switch status.lowercased() {
        case "present":
            statusLabel.backgroundColor = UIColor(hex: "#ECFDF5")
            statusLabel.textColor = UIColor(hex: "#10B981")
        case "late":
            statusLabel.backgroundColor = UIColor(hex: "#FFFBEB")
            statusLabel.textColor = UIColor(hex: "#F59E0B")
        default:
            statusLabel.backgroundColor = UIColor(hex: "#FEF2F2")
            statusLabel.textColor = UIColor(hex: "#EF4444")
        }
    }
    
    private func formatTime(_ raw: String?) -> String {
        guard let raw = raw else { return "-" }
        // Attempt to parse ISO8601 or similar
        // Simplification: if it contains 'T', split. If not, just return prefix 5 chars (HH:mm)
        if raw.contains("T") {
            let components = raw.components(separatedBy: "T")
            if components.count > 1 {
                let timePart = components[1]
                return String(timePart.prefix(5))
            }
        }
        return String(raw.prefix(5))
    }
}
