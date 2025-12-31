import UIKit

class ConsultViewController: UIViewController {

    // MARK: - Properties
    
    private let tableView = UITableView()
    private var experts: [ExpertModel] = []
    
    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Talk to Expert"
        view.backgroundColor = DesignSystem.Colors.windowBackground
        
        setupUI()
        fetchExperts()
    }
    
    // MARK: - Setup
    
    private func setupUI() {
        view.addSubview(tableView)
        tableView.translatesAutoresizingMaskIntoConstraints = false
        tableView.delegate = self
        tableView.dataSource = self
        tableView.backgroundColor = DesignSystem.Colors.windowBackground
        tableView.separatorStyle = .none
        tableView.register(ExpertCell.self, forCellReuseIdentifier: ExpertCell.identifier)
        
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func fetchExperts() {
        // Mock Data for now
        experts = [
            ExpertModel(name: "Amit Kumar", specialization: "GST Specialist", experience: "5 Years", rating: 4.8, image: "person.fill"),
            ExpertModel(name: "Priya Sharma", specialization: "Company Registration", experience: "7 Years", rating: 4.9, image: "person.fill.viewfinder"),
            ExpertModel(name: "Rajesh Singh", specialization: "Tax Consultant", experience: "10 Years", rating: 4.7, image: "briefcase.fill")
        ]
        tableView.reloadData()
    }
}

// MARK: - Table View
extension ConsultViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return experts.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ExpertCell.identifier, for: indexPath) as! ExpertCell
        cell.configure(expert: experts[indexPath.row])
        cell.callAction = { [weak self] in
            self?.handleCall(expert: self?.experts[indexPath.row])
        }
        return cell
    }
    
    private func handleCall(expert: ExpertModel?) {
        guard let expert = expert else { return }
        let alert = UIAlertController(title: "Call Expert", message: "Connecting to \(expert.name)...", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "End Call", style: .cancel))
        present(alert, animated: true)
    }
}

// MARK: - Model & Cell
struct ExpertModel {
    let name: String
    let specialization: String
    let experience: String
    let rating: Double
    let image: String
}

class ExpertCell: UITableViewCell {
    static let identifier = "ExpertCell"
    
    var callAction: (() -> Void)?
    
    private let containerView = UIView()
    private let profileImage = UIImageView()
    private let nameLabel = UILabel()
    private let specLabel = UILabel()
    private let expLabel = UILabel()
    private let ratingLabel = UILabel()
    private let callButton = UIButton(type: .system)
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        
        setupViews()
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    private func setupViews() {
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.layer.shadowColor = UIColor.black.cgColor
        containerView.layer.shadowOpacity = 0.05
        containerView.layer.shadowOffset = CGSize(width: 0, height: 2)
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        profileImage.contentMode = .scaleAspectFill
        profileImage.layer.cornerRadius = 25
        profileImage.layer.masksToBounds = true
        profileImage.backgroundColor = .systemGray6
        profileImage.tintColor = .systemGray3
        profileImage.translatesAutoresizingMaskIntoConstraints = false
        
        nameLabel.font = DesignSystem.Fonts.bold(size: 16)
        nameLabel.textColor = DesignSystem.Colors.textPrimary
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        
        specLabel.font = DesignSystem.Fonts.regular(size: 14)
        specLabel.textColor = DesignSystem.Colors.textSecondary
        specLabel.translatesAutoresizingMaskIntoConstraints = false
        
        expLabel.font = DesignSystem.Fonts.regular(size: 12)
        expLabel.textColor = DesignSystem.Colors.textTertiary
        expLabel.translatesAutoresizingMaskIntoConstraints = false
        
        callButton.setImage(UIImage(systemName: "phone.fill"), for: .normal)
        callButton.tintColor = .white
        callButton.backgroundColor = DesignSystem.Colors.success
        callButton.layer.cornerRadius = 20
        callButton.translatesAutoresizingMaskIntoConstraints = false
        callButton.addTarget(self, action: #selector(didTapCall), for: .touchUpInside)
        
        containerView.addSubview(profileImage)
        containerView.addSubview(nameLabel)
        containerView.addSubview(specLabel)
        containerView.addSubview(expLabel)
        containerView.addSubview(callButton)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 8),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -8),
            
            profileImage.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            profileImage.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            profileImage.widthAnchor.constraint(equalToConstant: 50),
            profileImage.heightAnchor.constraint(equalToConstant: 50),
            
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 16),
            nameLabel.leadingAnchor.constraint(equalTo: profileImage.trailingAnchor, constant: 16),
            nameLabel.trailingAnchor.constraint(equalTo: callButton.leadingAnchor, constant: -16),
            
            specLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            specLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            
            expLabel.topAnchor.constraint(equalTo: specLabel.bottomAnchor, constant: 4),
            expLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            expLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -16),
            
            callButton.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            callButton.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            callButton.widthAnchor.constraint(equalToConstant: 40),
            callButton.heightAnchor.constraint(equalToConstant: 40)
        ])
    }
    
    func configure(expert: ExpertModel) {
        nameLabel.text = expert.name
        specLabel.text = expert.specialization
        expLabel.text = "Exp: " + expert.experience
        profileImage.image = UIImage(systemName: expert.image)
    }
    
    @objc private func didTapCall() {
        callAction?()
    }
}
