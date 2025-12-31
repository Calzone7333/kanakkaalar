import UIKit

class AdminExpertsViewController: UIViewController {

    private let tableView = UITableView()
    private let refreshControl = UIRefreshControl()
    private let activityIndicator = UIActivityIndicatorView(style: .large)
    private let emptyLabel = UILabel()
    private let fabButton = UIButton(type: .system)
    
    private var experts: [Expert] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Experts"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        // TableView
        tableView.backgroundColor = DesignSystem.Colors.windowBackground
        tableView.separatorStyle = .none
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(ExpertCell.self, forCellReuseIdentifier: "ExpertCell")
        tableView.refreshControl = refreshControl
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        
        // Refresh Control
        refreshControl.addTarget(self, action: #selector(handleRefresh), for: .valueChanged)
        
        // Empty State
        emptyLabel.text = "No Experts Found"
        emptyLabel.textColor = .gray
        emptyLabel.textAlignment = .center
        emptyLabel.isHidden = true
        emptyLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emptyLabel)
        
        // Activity Indicator
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
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
        fabButton.addTarget(self, action: #selector(handleFab), for: .touchUpInside)
        view.addSubview(fabButton)
        
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            emptyLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            
            fabButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -24),
            fabButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            fabButton.widthAnchor.constraint(equalToConstant: 56),
            fabButton.heightAnchor.constraint(equalToConstant: 56)
        ])
    }
    
    @objc private func handleRefresh() {
        loadData()
    }
    
    @objc private func handleFab() {
        let alert = UIAlertController(title: "Add Expert", message: nil, preferredStyle: .alert)
        
        alert.addTextField { $0.placeholder = "Name" }
        alert.addTextField { $0.placeholder = "Qualification" }
        alert.addTextField { $0.placeholder = "Experience" }
        alert.addTextField { $0.placeholder = "Price (e.g. ₹500)" }
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Create", style: .default, handler: { [weak self] _ in
            guard let name = alert.textFields?[0].text, !name.isEmpty,
                  let qual = alert.textFields?[1].text else { return }
            let exp = alert.textFields?[2].text ?? ""
            let price = alert.textFields?[3].text ?? ""
            
            let data: [String: Any] = [
                "name": name,
                "qualification": qual,
                "experience": exp,
                "price": price,
                "available": true,
                "rating": 5.0,
                "reviews": 0
            ]
            
            self?.createExpert(data: data)
        }))
        
        present(alert, animated: true)
    }
    
    private func createExpert(data: [String: Any]) {
        activityIndicator.startAnimating()
        APIService.shared.createExpert(expertData: data) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                switch result {
                case .success(_):
                    self?.loadData()
                    self?.showToast("Expert Created")
                case .failure(let error):
                    self?.showError(error.localizedDescription)
                }
            }
        }
    }
    
    private func loadData() {
        if !refreshControl.isRefreshing {
            activityIndicator.startAnimating()
        }
        
        APIService.shared.getExperts { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                self?.refreshControl.endRefreshing()
                
                switch result {
                case .success(let data):
                    self?.experts = data
                    self?.emptyLabel.isHidden = !data.isEmpty
                    self?.tableView.reloadData()
                case .failure(let error):
                    self?.showError(error.localizedDescription)
                }
            }
        }
    }
    
    private func showError(_ msg: String) {
        let alert = UIAlertController(title: "Error", message: msg, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
    
    private func showToast(_ msg: String) {
         let alert = UIAlertController(title: nil, message: msg, preferredStyle: .alert)
         present(alert, animated: true)
         DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
             alert.dismiss(animated: true)
         }
    }
}

extension AdminExpertsViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return experts.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ExpertCell", for: indexPath) as! ExpertCell
        cell.configure(with: experts[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 120
    }
}

class ExpertCell: UITableViewCell {
    
    private let containerView = UIView()
    private let nameLabel = UILabel()
    private let qualificationLabel = UILabel()
    private let ratingLabel = UILabel()
    private let statusLabel = UILabel()
    private let specLabel = UILabel()
    
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
        
        nameLabel.font = DesignSystem.Fonts.bold(size: 16)
        nameLabel.textColor = DesignSystem.Colors.textPrimary
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(nameLabel)
        
        qualificationLabel.font = DesignSystem.Fonts.regular(size: 14)
        qualificationLabel.textColor = .gray
        qualificationLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(qualificationLabel)
        
        ratingLabel.font = DesignSystem.Fonts.bold(size: 14)
        ratingLabel.textColor = .systemOrange
        ratingLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(ratingLabel)
        
        specLabel.font = DesignSystem.Fonts.regular(size: 12)
        specLabel.textColor = .systemBlue
        specLabel.numberOfLines = 1
        specLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(specLabel)
        
        statusLabel.font = DesignSystem.Fonts.bold(size: 12)
        statusLabel.layer.cornerRadius = 4
        statusLabel.layer.masksToBounds = true
        statusLabel.textAlignment = .center
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(statusLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            nameLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            nameLabel.trailingAnchor.constraint(equalTo: statusLabel.leadingAnchor, constant: -8),
            
            qualificationLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            qualificationLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            
            ratingLabel.topAnchor.constraint(equalTo: qualificationLabel.bottomAnchor, constant: 4),
            ratingLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            
            specLabel.topAnchor.constraint(equalTo: ratingLabel.bottomAnchor, constant: 4),
            specLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            specLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12),
            
            statusLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            statusLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 70),
            statusLabel.heightAnchor.constraint(equalToConstant: 24)
        ])
    }
    
    func configure(with expert: Expert) {
        nameLabel.text = expert.name
        qualificationLabel.text = expert.qualification
        ratingLabel.text = "\(expert.rating ?? 0.0) ★"
        
        let specs = expert.specialization?.joined(separator: ", ") ?? "General"
        specLabel.text = specs.isEmpty ? "General" : specs
        
        if expert.available == true {
            statusLabel.text = " Available "
            statusLabel.backgroundColor = UIColor(hex: "#ECFDF5")
            statusLabel.textColor = UIColor(hex: "#10B981")
        } else {
            statusLabel.text = " Busy "
            statusLabel.backgroundColor = UIColor(hex: "#FEF2F2")
            statusLabel.textColor = UIColor(hex: "#EF4444")
        }
    }
}
