import UIKit

class AdminAgentsViewController: UIViewController {

    private let searchContainer = UIView()
    private let searchField = UITextField()
    private let tableView = UITableView()
    private let emptyLabel = UILabel()
    private let addAgentButton = UIButton(type: .system)
    private let loadingIndicator = UIActivityIndicatorView(style: .medium)
    
    private var allAgents: [Agent] = []
    private var displayedAgents: [Agent] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Agents"
        
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
        
        searchField.placeholder = "Search agents..."
        searchField.font = DesignSystem.Fonts.regular(size: 14)
        searchField.addTarget(self, action: #selector(handleSearchChanged), for: .editingChanged)
        searchField.translatesAutoresizingMaskIntoConstraints = false
        searchContainer.addSubview(searchField)
        
        // Add Button
        addAgentButton.setTitle("+ Add Agent", for: .normal)
        addAgentButton.backgroundColor = DesignSystem.Colors.primary
        addAgentButton.setTitleColor(.white, for: .normal)
        addAgentButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
        addAgentButton.layer.cornerRadius = 8
        addAgentButton.translatesAutoresizingMaskIntoConstraints = false
        addAgentButton.addTarget(self, action: #selector(handleAddAgent), for: .touchUpInside)
        view.addSubview(addAgentButton)
        
        // Empty State
        emptyLabel.text = "No agents found"
        emptyLabel.textColor = .gray
        emptyLabel.font = DesignSystem.Fonts.regular(size: 16)
        emptyLabel.textAlignment = .center
        emptyLabel.isHidden = true
        emptyLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emptyLabel)
        
        // TableView
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(AdminAgentCell.self, forCellReuseIdentifier: "AdminAgentCell")
        tableView.separatorStyle = .none
        tableView.backgroundColor = .clear
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        
        // Loading
        loadingIndicator.translatesAutoresizingMaskIntoConstraints = false
        loadingIndicator.hidesWhenStopped = true
        view.addSubview(loadingIndicator)
        
        NSLayoutConstraint.activate([
            searchContainer.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            searchContainer.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            searchContainer.trailingAnchor.constraint(equalTo: addAgentButton.leadingAnchor, constant: -12),
            searchContainer.heightAnchor.constraint(equalToConstant: 44),
            
            searchIcon.leadingAnchor.constraint(equalTo: searchContainer.leadingAnchor, constant: 12),
            searchIcon.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor),
            searchIcon.widthAnchor.constraint(equalToConstant: 20),
            searchIcon.heightAnchor.constraint(equalToConstant: 20),
            
            searchField.leadingAnchor.constraint(equalTo: searchIcon.trailingAnchor, constant: 8),
            searchField.trailingAnchor.constraint(equalTo: searchContainer.trailingAnchor, constant: -12),
            searchField.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor),
            searchField.heightAnchor.constraint(equalToConstant: 40),
            
            addAgentButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            addAgentButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            addAgentButton.heightAnchor.constraint(equalToConstant: 44),
            addAgentButton.widthAnchor.constraint(equalToConstant: 120),
            
            emptyLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            
            tableView.topAnchor.constraint(equalTo: searchContainer.bottomAnchor, constant: 12),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            loadingIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            loadingIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
    
    private func loadData() {
        loadingIndicator.startAnimating()
        APIService.shared.getAllAgents { [weak self] result in
            DispatchQueue.main.async {
                self?.loadingIndicator.stopAnimating()
                switch result {
                case .success(let data):
                    self?.allAgents = data
                    self?.applyFilters()
                case .failure(let error):
                    let alert = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default))
                    self?.present(alert, animated: true)
                }
            }
        }
    }
    
    @objc private func handleSearchChanged() {
        applyFilters()
    }
    
    private func applyFilters() {
        let query = searchField.text?.lowercased() ?? ""
        if query.isEmpty {
            displayedAgents = allAgents
        } else {
            displayedAgents = allAgents.filter {
                $0.fullName.lowercased().contains(query) || $0.email.lowercased().contains(query)
            }
        }
        tableView.reloadData()
        emptyLabel.isHidden = !displayedAgents.isEmpty
    }
    
    @objc private func handleAddAgent() {
        let alert = UIAlertController(title: "Add Agent", message: nil, preferredStyle: .alert)
        alert.addTextField { tf in tf.placeholder = "Full Name" }
        alert.addTextField { tf in tf.placeholder = "Email Address"; tf.keyboardType = .emailAddress }
        alert.addTextField { tf in tf.placeholder = "Phone Number"; tf.keyboardType = .phonePad }
        alert.addTextField { tf in tf.placeholder = "Password"; tf.isSecureTextEntry = true }
        
        let saveAction = UIAlertAction(title: "Save", style: .default) { _ in
            guard let name = alert.textFields?[0].text, !name.isEmpty,
                  let email = alert.textFields?[1].text, !email.isEmpty else { return }
            
            // Mock Save for now as API endpoint for creation is not confirmed
            // Ideally call APIService.createAgent(...)
            let newAgent = Agent(id: Int.random(in: 100...999), fullName: name, email: email, phone: "N/A", status: "Active", profileImage: nil)
            self.allAgents.insert(newAgent, at: 0)
            self.applyFilters()
        }
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(saveAction)
        
        present(alert, animated: true)
    }
}

extension AdminAgentsViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return displayedAgents.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "AdminAgentCell", for: indexPath) as! AdminAgentCell
        cell.configure(with: displayedAgents[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 100
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let agent = displayedAgents[indexPath.row]
        
        let alert = UIAlertController(title: "Options", message: "Manage \(agent.fullName)", preferredStyle: .actionSheet)
        alert.addAction(UIAlertAction(title: "Edit", style: .default))
        alert.addAction(UIAlertAction(title: (agent.status == "Active" || agent.status == nil) ? "Deactivate" : "Activate", style: .default))
        alert.addAction(UIAlertAction(title: "Delete", style: .destructive))
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        
        if let popover = alert.popoverPresentationController {
            let cell = tableView.cellForRow(at: indexPath)
            popover.sourceView = cell
            popover.sourceRect = cell?.bounds ?? .zero
        }
        present(alert, animated: true)
    }
}

class AdminAgentCell: UITableViewCell {
    private let containerView = UIView()
    private let nameLabel = UILabel()
    private let emailLabel = UILabel()
    private let roleLabel = UILabel()
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
        
        emailLabel.font = DesignSystem.Fonts.regular(size: 14)
        emailLabel.textColor = DesignSystem.Colors.textSecondary
        emailLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(emailLabel)
        
        roleLabel.text = "AGENT"
        roleLabel.font = DesignSystem.Fonts.bold(size: 12)
        roleLabel.textColor = .systemGray
        roleLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(roleLabel)
        
        statusLabel.font = DesignSystem.Fonts.bold(size: 12)
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(statusLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            nameLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            emailLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            emailLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            
            roleLabel.topAnchor.constraint(equalTo: emailLabel.bottomAnchor, constant: 8),
            roleLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            roleLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12),
            
            statusLabel.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with agent: Agent) {
        nameLabel.text = agent.fullName
        emailLabel.text = agent.email
        let status = agent.status ?? "Active"
        statusLabel.text = status.uppercased()
        
        if status == "Active" {
            statusLabel.textColor = UIColor(hex: "#10B981")
        } else {
            statusLabel.textColor = UIColor(hex: "#EF4444")
        }
    }
}
