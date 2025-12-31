import UIKit

class CompanyDetailsViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    private let cardView = UIView()
    private let companyNameLabel = UILabel()
    private let metaLabel = UILabel()
    private let dateLabel = UILabel()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Company Details"
        
        setupUI()
        fetchDetails()
    }
    
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor)
        ])
        
        cardView.backgroundColor = .white
        cardView.layer.cornerRadius = 12
        cardView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(cardView)
        
        companyNameLabel.font = DesignSystem.Fonts.bold(size: 20)
        companyNameLabel.textColor = DesignSystem.Colors.textPrimary
        companyNameLabel.translatesAutoresizingMaskIntoConstraints = false
        cardView.addSubview(companyNameLabel)
        
        metaLabel.font = DesignSystem.Fonts.regular(size: 16)
        metaLabel.textColor = DesignSystem.Colors.textSecondary
        metaLabel.translatesAutoresizingMaskIntoConstraints = false
        cardView.addSubview(metaLabel)
        
        dateLabel.font = DesignSystem.Fonts.regular(size: 16)
        dateLabel.textColor = DesignSystem.Colors.textSecondary
        dateLabel.translatesAutoresizingMaskIntoConstraints = false
        cardView.addSubview(dateLabel)
        
        NSLayoutConstraint.activate([
            cardView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 16),
            cardView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            cardView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            cardView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -16),
            
            companyNameLabel.topAnchor.constraint(equalTo: cardView.topAnchor, constant: 16),
            companyNameLabel.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            companyNameLabel.trailingAnchor.constraint(equalTo: cardView.trailingAnchor, constant: -16),
            
            metaLabel.topAnchor.constraint(equalTo: companyNameLabel.bottomAnchor, constant: 8),
            metaLabel.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            
            dateLabel.topAnchor.constraint(equalTo: metaLabel.bottomAnchor, constant: 8),
            dateLabel.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            dateLabel.bottomAnchor.constraint(equalTo: cardView.bottomAnchor, constant: -16)
        ])
    }
    
    private func fetchDetails() {
        // Mock Data based on Session or API
        let name = SessionManager.shared.getUserName() ?? "User"
        let email = SessionManager.shared.getUserEmail() ?? "email@example.com"
        
        companyNameLabel.text = "\(name)'s Company"
        metaLabel.text = "Email: \(email)"
        dateLabel.text = "Phone: N/A"
    }
}
