import UIKit

class AdminLeadsViewController: UIViewController {

    private let tableView = UITableView()
    private let refreshControl = UIRefreshControl()
    private let activityIndicator = UIActivityIndicatorView(style: .large)
    private let fabButton = UIButton(type: .system)
    
    private var leads: [Lead] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Leads"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        // TableView
        tableView.backgroundColor = DesignSystem.Colors.windowBackground
        tableView.separatorStyle = .none
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(AdminCrmLeadCell.self, forCellReuseIdentifier: "AdminCrmLeadCell")
        tableView.refreshControl = refreshControl
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        
        // Refresh Control
        refreshControl.addTarget(self, action: #selector(handleRefresh), for: .valueChanged)
        
        // Activity Indicator
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)
        
        // FAB
        fabButton.setImage(UIImage(systemName: "plus"), for: .normal)
        fabButton.tintColor = .white
        fabButton.backgroundColor = DesignSystem.Colors.primary
        fabButton.layer.cornerRadius = 28
        fabButton.layer.shadowColor = UIColor.black.cgColor
        fabButton.layer.shadowOpacity = 0.3
        fabButton.layer.shadowOffset = CGSize(width: 0, height: 4)
        fabButton.layer.shadowRadius = 4
        fabButton.translatesAutoresizingMaskIntoConstraints = false
        fabButton.addTarget(self, action: #selector(showAddLeadDialog), for: .touchUpInside)
        view.addSubview(fabButton)
        
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            
            fabButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            fabButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -24),
            fabButton.widthAnchor.constraint(equalToConstant: 56),
            fabButton.heightAnchor.constraint(equalToConstant: 56)
        ])
    }
    
    @objc private func handleRefresh() {
        loadData()
    }
    
    private func loadData() {
        if !refreshControl.isRefreshing {
            activityIndicator.startAnimating()
        }
        
        APIService.shared.getAllLeads { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                self?.refreshControl.endRefreshing()
                
                switch result {
                case .success(let data):
                    self?.leads = data
                    self?.tableView.reloadData()
                    if data.isEmpty {
                        // Optionally show empty state
                    }
                case .failure(let error):
                    print("Error fetching leads: \(error.localizedDescription)")
                    let alert = UIAlertController(title: "Error", message: "Failed to load leads", preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default))
                    self?.present(alert, animated: true)
                }
            }
        }
    }
    
    @objc private func showAddLeadDialog() {
        let alert = UIAlertController(title: "Add Lead", message: nil, preferredStyle: .alert)
        
        alert.addTextField { tf in tf.placeholder = "Full Name" }
        alert.addTextField { tf in tf.placeholder = "Email"; tf.keyboardType = .emailAddress }
        alert.addTextField { tf in tf.placeholder = "Phone"; tf.keyboardType = .phonePad }
        alert.addTextField { tf in tf.placeholder = "Service (e.g. GST)" }
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Create", style: .default, handler: { [weak self] _ in
            guard let name = alert.textFields?[0].text, !name.isEmpty,
                  let email = alert.textFields?[1].text, !email.isEmpty else { return }
            let phone = alert.textFields?[2].text
            let service = alert.textFields?[3].text
            
            self?.createLead(name: name, email: email, phone: phone, service: service)
        }))
        
        present(alert, animated: true)
    }
    
    private func createLead(name: String, email: String, phone: String?, service: String?) {
        let newLead = Lead(id: nil, name: name, email: email, phone: phone, service: service, status: "New", createdAt: nil)
        
        activityIndicator.startAnimating()
        APIService.shared.createLead(lead: newLead) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                switch result {
                case .success:
                    self?.loadData()
                case .failure(let error):
                    let alert = UIAlertController(title: "Error", message: "Failed to create lead: \(error.localizedDescription)", preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default))
                    self?.present(alert, animated: true)
                }
            }
        }
    }
}

extension AdminLeadsViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return leads.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "AdminCrmLeadCell", for: indexPath) as! AdminCrmLeadCell
        cell.configure(with: leads[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 100
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let lead = leads[indexPath.row]
        let alert = UIAlertController(title: "Lead Details", message: "Name: \(lead.name)\nEmail: \(lead.email)\nService: \(lead.service ?? "N/A")\nStatus: \(lead.status ?? "N/A")", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}

class AdminCrmLeadCell: UITableViewCell {
    private let containerView = UIView()
    private let nameLabel = UILabel()
    private let serviceLabel = UILabel()
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
        
        dateLabel.font = DesignSystem.Fonts.regular(size: 12)
        dateLabel.textColor = .gray
        dateLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(dateLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            nameLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            serviceLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            serviceLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            statusLabel.centerYAnchor.constraint(equalTo: nameLabel.centerYAnchor),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            statusLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 80),
            statusLabel.heightAnchor.constraint(equalToConstant: 24),
            
            dateLabel.topAnchor.constraint(equalTo: serviceLabel.bottomAnchor, constant: 8),
            dateLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            dateLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with lead: Lead) {
        nameLabel.text = lead.name
        serviceLabel.text = lead.service ?? "General Inquiry"
        
        // Format date if possible, otherwise use raw
        if let created = lead.createdAt {
            // Simple date formatter could be used here
            dateLabel.text = "Date: \(created.prefix(10))"
        } else {
            dateLabel.text = "Date: N/A"
        }
        
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
