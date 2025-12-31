import UIKit

class AdminEmployeesViewController: UIViewController {

    private let tableView = UITableView()
    private let refreshControl = UIRefreshControl()
    private let activityIndicator = UIActivityIndicatorView(style: .large)
    private let fabButton = UIButton(type: .system)
    
    private var employees: [Employee] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Employees"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        // TableView
        tableView.backgroundColor = DesignSystem.Colors.windowBackground
        tableView.separatorStyle = .none
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(AdminUserCell.self, forCellReuseIdentifier: "AdminUserCell")
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
        fabButton.addTarget(self, action: #selector(showAddEmployeeDialog), for: .touchUpInside)
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
    
    @objc private func showAddEmployeeDialog() {
        let alert = UIAlertController(title: "Add Employee", message: nil, preferredStyle: .alert)
        
        alert.addTextField { tf in tf.placeholder = "Full Name" }
        alert.addTextField { tf in tf.placeholder = "Email"; tf.keyboardType = .emailAddress }
        alert.addTextField { tf in tf.placeholder = "Password"; tf.isSecureTextEntry = true }
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Create", style: .default, handler: { [weak self] _ in
            guard let name = alert.textFields?[0].text, !name.isEmpty,
                  let email = alert.textFields?[1].text, !email.isEmpty else { return }
            
            self?.createEmployee(name: name, email: email)
        }))
        
        present(alert, animated: true)
    }
    
    private func createEmployee(name: String, email: String) {
        // Mock success for now as add employee endpoint not fully standard in APIService
        let alert = UIAlertController(title: "Success", message: "Employee created (Mock).", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
        loadData()
    }
    
    private func loadData() {
        if !refreshControl.isRefreshing {
            activityIndicator.startAnimating()
        }
        
        APIService.shared.fetchEmployees { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                self?.refreshControl.endRefreshing()
                
                switch result {
                case .success(let data):
                    self?.employees = data
                    self?.tableView.reloadData()
                case .failure(let error):
                    print("Error fetching employees: \(error.localizedDescription)")
                }
            }
        }
    }
}

// MARK: - TableView
extension AdminEmployeesViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return employees.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "AdminUserCell", for: indexPath) as! AdminUserCell
        cell.configure(with: employees[indexPath.row])
        cell.moreAction = { [weak self] in
            self?.showMoreOptions(for: indexPath.row)
        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 100
    }
    
    private func showMoreOptions(for index: Int) {
        let employee = employees[index]
        let sheet = UIAlertController(title: "Options for \(employee.fullName)", message: nil, preferredStyle: .actionSheet)
        
        sheet.addAction(UIAlertAction(title: "Edit", style: .default))
        sheet.addAction(UIAlertAction(title: employee.status == "Active" ? "Deactivate" : "Activate", style: .default))
        sheet.addAction(UIAlertAction(title: "Delete", style: .destructive))
        sheet.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        
        if let popover = sheet.popoverPresentationController {
             let cell = tableView.cellForRow(at: IndexPath(row: index, section: 0))
             popover.sourceView = cell
             popover.sourceRect = cell?.bounds ?? .zero
        }
        present(sheet, animated: true)
    }
}

// MARK: - Cell
class AdminUserCell: UITableViewCell {
    
    var moreAction: (() -> Void)?
    
    private let containerView = UIView()
    private let avatarView = UIImageView()
    private let nameLabel = UILabel()
    private let emailLabel = UILabel()
    private let roleLabel = UILabel()
    private let statusLabel = UILabel()
    private let moreButton = UIButton(type: .system)
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        setupUI()
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    private func setupUI() {
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        avatarView.image = UIImage(systemName: "person.circle.fill")
        avatarView.tintColor = .systemGray4
        avatarView.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(avatarView)
        
        nameLabel.font = DesignSystem.Fonts.bold(size: 16)
        nameLabel.textColor = DesignSystem.Colors.textPrimary
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(nameLabel)
        
        emailLabel.font = DesignSystem.Fonts.regular(size: 14)
        emailLabel.textColor = DesignSystem.Colors.textSecondary
        emailLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(emailLabel)
        
        roleLabel.text = "EMPLOYEE"
        roleLabel.font = DesignSystem.Fonts.bold(size: 10)
        roleLabel.textColor = DesignSystem.Colors.primary
        roleLabel.backgroundColor = DesignSystem.Colors.primary.withAlphaComponent(0.1)
        roleLabel.layer.cornerRadius = 4
        roleLabel.layer.masksToBounds = true
        roleLabel.textAlignment = .center
        roleLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(roleLabel)
        
        statusLabel.font = DesignSystem.Fonts.bold(size: 12)
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(statusLabel)
        
        moreButton.setImage(UIImage(systemName: "ellipsis"), for: .normal)
        moreButton.tintColor = .gray
        moreButton.translatesAutoresizingMaskIntoConstraints = false
        moreButton.addTarget(self, action: #selector(handleMore), for: .touchUpInside)
        containerView.addSubview(moreButton)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 8),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -8),
            
            avatarView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            avatarView.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            avatarView.widthAnchor.constraint(equalToConstant: 40),
            avatarView.heightAnchor.constraint(equalToConstant: 40),
            
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            nameLabel.leadingAnchor.constraint(equalTo: avatarView.trailingAnchor, constant: 12),
            nameLabel.trailingAnchor.constraint(equalTo: moreButton.leadingAnchor, constant: -8),
            
            emailLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            emailLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            emailLabel.trailingAnchor.constraint(equalTo: moreButton.leadingAnchor, constant: -8),
            
            roleLabel.topAnchor.constraint(equalTo: emailLabel.bottomAnchor, constant: 8),
            roleLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            roleLabel.widthAnchor.constraint(equalToConstant: 70),
            roleLabel.heightAnchor.constraint(equalToConstant: 20),
            
            statusLabel.centerYAnchor.constraint(equalTo: roleLabel.centerYAnchor),
            statusLabel.leadingAnchor.constraint(equalTo: roleLabel.trailingAnchor, constant: 12),
            
            moreButton.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            moreButton.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -8),
            moreButton.widthAnchor.constraint(equalToConstant: 40),
            moreButton.heightAnchor.constraint(equalToConstant: 40)
        ])
    }
    
    func configure(with employee: Employee) {
        nameLabel.text = employee.fullName
        emailLabel.text = employee.email
        statusLabel.text = employee.status
        roleLabel.text = employee.role.uppercased()
        
        if employee.status == "Active" {
            statusLabel.textColor = .systemGreen
        } else {
            statusLabel.textColor = .systemRed
        }
    }
    
    @objc private func handleMore() {
        moreAction?()
    }
}
