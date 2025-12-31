import UIKit

class EmployeeCompanyViewController: UIViewController {

    private let policiesLabel = UILabel()
    private let collectionView: UICollectionView
    private let contactHRButton = UIButton(type: .system)
    
    // Data
    private struct Policy {
        let title: String
        let size: String
        let type: String
    }
    
    private var policies: [Policy] = []

    init() {
        let layout = UICollectionViewFlowLayout()
        layout.itemSize = CGSize(width: (UIScreen.main.bounds.width - 48) / 2, height: 120)
        layout.minimumInteritemSpacing = 16
        layout.minimumLineSpacing = 16
        layout.sectionInset = UIEdgeInsets(top: 16, left: 16, bottom: 16, right: 16)
        collectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) { fatalError() }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Company"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        policiesLabel.text = "Company Policies"
        policiesLabel.font = DesignSystem.Fonts.bold(size: 18)
        policiesLabel.textColor = DesignSystem.Colors.textPrimary
        policiesLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(policiesLabel)
        
        collectionView.backgroundColor = .clear
        collectionView.dataSource = self
        collectionView.delegate = self
        collectionView.register(PolicyCell.self, forCellWithReuseIdentifier: "PolicyCell")
        collectionView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(collectionView)
        
        contactHRButton.setTitle("Contact HR", for: .normal)
        contactHRButton.backgroundColor = DesignSystem.Colors.primary
        contactHRButton.setTitleColor(.white, for: .normal)
        contactHRButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 16)
        contactHRButton.layer.cornerRadius = 8
        contactHRButton.translatesAutoresizingMaskIntoConstraints = false
        contactHRButton.addTarget(self, action: #selector(handleContactHR), for: .touchUpInside)
        view.addSubview(contactHRButton)
        
        NSLayoutConstraint.activate([
            policiesLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            policiesLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            
            collectionView.topAnchor.constraint(equalTo: policiesLabel.bottomAnchor, constant: 8),
            collectionView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            collectionView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            collectionView.bottomAnchor.constraint(equalTo: contactHRButton.topAnchor, constant: -16),
            
            contactHRButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            contactHRButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            contactHRButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -16),
            contactHRButton.heightAnchor.constraint(equalToConstant: 50)
        ])
    }
    
    private func loadData() {
        policies = [
            Policy(title: "Employee Handbook 2025", size: "2.4 MB", type: "PDF"),
            Policy(title: "Leave Policy", size: "1.1 MB", type: "PDF"),
            Policy(title: "Code of Conduct", size: "850 KB", type: "PDF"),
            Policy(title: "IT Security Guidelines", size: "1.5 MB", type: "PDF")
        ]
        collectionView.reloadData()
    }
    
    @objc private func handleContactHR() {
        let alert = UIAlertController(title: "Contact HR", message: "Would you like to send an email to hr@bizzfilling.com?", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Email", style: .default, handler: { _ in
            if let url = URL(string: "mailto:hr@bizzfilling.com") {
                UIApplication.shared.open(url)
            }
        }))
        present(alert, animated: true)
    }
}

extension EmployeeCompanyViewController: UICollectionViewDataSource, UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return policies.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "PolicyCell", for: indexPath) as! PolicyCell
        cell.configure(with: policies[indexPath.row])
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let policy = policies[indexPath.row]
        let alert = UIAlertController(title: "Download", message: "Downloading \(policy.title)...", preferredStyle: .alert)
        present(alert, animated: true)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            alert.dismiss(animated: true)
        }
    }
}

class PolicyCell: UICollectionViewCell {
    private let iconContainer = UIView()
    private let iconView = UIImageView()
    private let titleLabel = UILabel()
    private let infoLabel = UILabel()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        contentView.backgroundColor = .white
        contentView.layer.cornerRadius = 12
        contentView.layer.borderWidth = 1
        contentView.layer.borderColor = UIColor.systemGray5.cgColor
        
        iconContainer.backgroundColor = UIColor(hex: "#EFF6FF") // Light Blue
        iconContainer.layer.cornerRadius = 8
        iconContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(iconContainer)
        
        iconView.image = UIImage(systemName: "doc.text.fill")
        iconView.tintColor = DesignSystem.Colors.primary
        iconView.contentMode = .scaleAspectFit
        iconView.translatesAutoresizingMaskIntoConstraints = false
        iconContainer.addSubview(iconView)
        
        titleLabel.font = DesignSystem.Fonts.bold(size: 14)
        titleLabel.textColor = DesignSystem.Colors.textPrimary
        titleLabel.numberOfLines = 2
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(titleLabel)
        
        infoLabel.font = DesignSystem.Fonts.regular(size: 12)
        infoLabel.textColor = DesignSystem.Colors.textSecondary
        infoLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(infoLabel)
        
        NSLayoutConstraint.activate([
            iconContainer.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 12),
            iconContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 12),
            iconContainer.widthAnchor.constraint(equalToConstant: 40),
            iconContainer.heightAnchor.constraint(equalToConstant: 40),
            
            iconView.centerXAnchor.constraint(equalTo: iconContainer.centerXAnchor),
            iconView.centerYAnchor.constraint(equalTo: iconContainer.centerYAnchor),
            iconView.widthAnchor.constraint(equalToConstant: 24),
            iconView.heightAnchor.constraint(equalToConstant: 24),
            
            titleLabel.topAnchor.constraint(equalTo: iconContainer.bottomAnchor, constant: 12),
            titleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 12),
            titleLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -12),
            
            infoLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            infoLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 12),
            infoLabel.bottomAnchor.constraint(lessThanOrEqualTo: contentView.bottomAnchor, constant: -12)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with policy: EmployeeCompanyViewController.Policy) {
        titleLabel.text = policy.title
        infoLabel.text = "\(policy.type) • \(policy.size)"
    }
}
