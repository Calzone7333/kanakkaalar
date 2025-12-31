import UIKit

class EmployeeTableViewCell: UITableViewCell {
    
    static let identifier = "EmployeeTableViewCell"
    
    private let nameLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.boldSystemFont(ofSize: 18)
        label.textColor = UIColor(red: 30/255, green: 41/255, blue: 59/255, alpha: 1.0)
        return label
    }()
    
    private let emailLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: 14)
        label.textColor = UIColor(red: 100/255, green: 116/255, blue: 139/255, alpha: 1.0)
        return label
    }()
    
    private let roleLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.boldSystemFont(ofSize: 12)
        label.textColor = UIColor(red: 26/255, green: 127/255, blue: 125/255, alpha: 1.0)
        label.backgroundColor = UIColor(red: 240/255, green: 253/255, blue: 250/255, alpha: 1.0)
        label.layer.cornerRadius = 4
        label.layer.masksToBounds = true
        return label
    }()
    
    private let statusLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: 12)
        return label
    }()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupViews()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupViews() {
        let stackView = UIStackView(arrangedSubviews: [nameLabel, emailLabel])
        stackView.axis = .vertical
        stackView.spacing = 4
        stackView.translatesAutoresizingMaskIntoConstraints = false
        
        contentView.addSubview(stackView)
        contentView.addSubview(roleLabel)
        contentView.addSubview(statusLabel)
        
        roleLabel.translatesAutoresizingMaskIntoConstraints = false
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            stackView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 12),
            stackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            stackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            
            roleLabel.topAnchor.constraint(equalTo: stackView.bottomAnchor, constant: 8),
            roleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            roleLabel.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -12),
            
            statusLabel.centerYAnchor.constraint(equalTo: roleLabel.centerYAnchor),
            statusLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16)
        ])
    }
    
    func configure(name: String, email: String, role: String, status: String) {
        nameLabel.text = name
        emailLabel.text = email
        roleLabel.text = "  \(role)  " // Padding hack
        statusLabel.text = status
        
        if status.uppercased() == "ACTIVE" {
            statusLabel.textColor = UIColor(red: 16/255, green: 185/255, blue: 129/255, alpha: 1.0) // Green
        } else {
            statusLabel.textColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1.0) // Red
        }
    }
}
