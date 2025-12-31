import UIKit

class AdminDealsViewController: UIViewController {

    private let tableView = UITableView()
    private let refreshControl = UIRefreshControl()
    private let activityIndicator = UIActivityIndicatorView(style: .large)
    private let emptyLabel = UILabel()
    private let fabButton = UIButton(type: .system)
    
    private var deals: [Deal] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Deals"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        // TableView
        tableView.backgroundColor = DesignSystem.Colors.windowBackground
        tableView.separatorStyle = .none
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(DealCell.self, forCellReuseIdentifier: "DealCell")
        tableView.refreshControl = refreshControl
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        
        // Refresh Control
        refreshControl.addTarget(self, action: #selector(handleRefresh), for: .valueChanged)
        
        // Empty State
        emptyLabel.text = "No Deals Found"
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
        let alert = UIAlertController(title: "Add Deal", message: nil, preferredStyle: .alert)
        
        alert.addTextField { $0.placeholder = "Deal Name" }
        alert.addTextField { $0.placeholder = "Customer Name" }
        alert.addTextField { $0.placeholder = "Amount (e.g. 5000)" }
        
        // Simplified Stage Selection (Usually a picker, using text field for speed)
        alert.addTextField { $0.placeholder = "Stage (e.g. Lead In)" }
        alert.addTextField { $0.placeholder = "Probability %" }
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Create", style: .default, handler: { [weak self] _ in
            guard let name = alert.textFields?[0].text, !name.isEmpty,
                  let customer = alert.textFields?[1].text else { return }
            
            let amount = Double(alert.textFields?[2].text ?? "0") ?? 0.0
            let stage = alert.textFields?[3].text ?? "New"
            let prob = Int(alert.textFields?[4].text ?? "0") ?? 0
            
            let deal = Deal(id: nil, name: name, customer: customer, amount: amount, stage: stage, probability: prob, owner: nil, dueDate: nil)
            
            self?.createDeal(deal)
        }))
        
        present(alert, animated: true)
    }
    
    private func createDeal(_ deal: Deal) {
        activityIndicator.startAnimating()
        APIService.shared.createDeal(dealRequest: deal) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                switch result {
                case .success(_):
                    self?.loadData()
                    self?.showToast("Deal Created")
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
        
        APIService.shared.getAllDeals { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                self?.refreshControl.endRefreshing()
                
                switch result {
                case .success(let data):
                    self?.deals = data
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

extension AdminDealsViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return deals.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "DealCell", for: indexPath) as! DealCell
        cell.configure(with: deals[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 120
    }
}

class DealCell: UITableViewCell {
    
    private let containerView = UIView()
    private let nameLabel = UILabel()
    private let customerLabel = UILabel()
    private let amountLabel = UILabel()
    private let stageLabel = UILabel()
    private let probLabel = UILabel()
    
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
        
        customerLabel.font = DesignSystem.Fonts.regular(size: 14)
        customerLabel.textColor = .gray
        customerLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(customerLabel)
        
        amountLabel.font = DesignSystem.Fonts.bold(size: 16)
        amountLabel.textColor = DesignSystem.Colors.primary
        amountLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(amountLabel)
        
        stageLabel.font = DesignSystem.Fonts.bold(size: 12)
        stageLabel.layer.cornerRadius = 4
        stageLabel.layer.masksToBounds = true
        stageLabel.textAlignment = .center
        stageLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(stageLabel)
        
        probLabel.font = DesignSystem.Fonts.regular(size: 12)
        probLabel.textColor = .gray
        probLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(probLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            nameLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            // nameLabel.trailingAnchor.constraint(equalTo: amountLabel.leadingAnchor, constant: -8),
            
            customerLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            customerLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            
            amountLabel.centerYAnchor.constraint(equalTo: nameLabel.centerYAnchor),
            amountLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            
            stageLabel.topAnchor.constraint(equalTo: customerLabel.bottomAnchor, constant: 8),
            stageLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            stageLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 80),
            stageLabel.heightAnchor.constraint(equalToConstant: 24),
            stageLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12),
            
            probLabel.centerYAnchor.constraint(equalTo: stageLabel.centerYAnchor),
            probLabel.leadingAnchor.constraint(equalTo: stageLabel.trailingAnchor, constant: 12)
        ])
    }
    
    func configure(with deal: Deal) {
        nameLabel.text = deal.name ?? "Deal"
        customerLabel.text = deal.customer ?? "Unknown Customer"
        
        let amount = deal.amount ?? 0.0
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.locale = Locale(identifier: "en_IN")
        amountLabel.text = formatter.string(from: NSNumber(value: amount))
        
        let stage = deal.stage ?? "New"
        stageLabel.text = "  \(stage)  "
        stageLabel.backgroundColor = DesignSystem.Colors.primary.withAlphaComponent(0.1)
        stageLabel.textColor = DesignSystem.Colors.primary
        
        probLabel.text = "Probability: \(deal.probability ?? 0)%"
    }
}
