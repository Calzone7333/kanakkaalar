import UIKit

class OrderDetailViewController: UIViewController {

    // MARK: - Properties
    
    private let orderId: String
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // MARK: - Init
    
    init(orderId: String) {
        self.orderId = orderId
        super.init(nibName: nil, bundle: nil)
        self.title = "Order Details"
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        
        setupUI()
        loadData()
    }
    
    // MARK: - Setup
    
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
        
        // 1. Header Card (Status, ID)
        let headerCard = createCard()
        contentView.addSubview(headerCard)
        
        let statusLabel = UILabel()
        statusLabel.text = "In Progress"
        statusLabel.font = DesignSystem.Fonts.bold(size: 14)
        statusLabel.textColor = .white
        statusLabel.backgroundColor = DesignSystem.Colors.primary
        statusLabel.layer.cornerRadius = 8
        statusLabel.layer.masksToBounds = true
        statusLabel.textAlignment = .center
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let idLabel = UILabel()
        idLabel.text = "Order #\(orderId)"
        idLabel.font = DesignSystem.Fonts.bold(size: 18)
        idLabel.textColor = DesignSystem.Colors.textPrimary
        idLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let dateLabel = UILabel()
        dateLabel.text = "Placed on 12 Dec 2024"
        dateLabel.font = DesignSystem.Fonts.regular(size: 14)
        dateLabel.textColor = DesignSystem.Colors.textSecondary
        dateLabel.translatesAutoresizingMaskIntoConstraints = false
        
        headerCard.addSubview(statusLabel)
        headerCard.addSubview(idLabel)
        headerCard.addSubview(dateLabel)
        
        NSLayoutConstraint.activate([
            headerCard.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 16),
            headerCard.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            headerCard.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            headerCard.heightAnchor.constraint(equalToConstant: 100),
            
            idLabel.topAnchor.constraint(equalTo: headerCard.topAnchor, constant: 16),
            idLabel.leadingAnchor.constraint(equalTo: headerCard.leadingAnchor, constant: 16),
            
            dateLabel.topAnchor.constraint(equalTo: idLabel.bottomAnchor, constant: 4),
            dateLabel.leadingAnchor.constraint(equalTo: headerCard.leadingAnchor, constant: 16),
            
            statusLabel.topAnchor.constraint(equalTo: headerCard.topAnchor, constant: 16),
            statusLabel.trailingAnchor.constraint(equalTo: headerCard.trailingAnchor, constant: -16),
            statusLabel.widthAnchor.constraint(equalToConstant: 100),
            statusLabel.heightAnchor.constraint(equalToConstant: 28)
        ])
        
        // 2. Service Info
        let infoCard = createCard()
        contentView.addSubview(infoCard)
        
        let serviceTitle = UILabel()
        serviceTitle.text = "GST Registration"
        serviceTitle.font = DesignSystem.Fonts.bold(size: 16)
        serviceTitle.textColor = DesignSystem.Colors.textPrimary
        serviceTitle.translatesAutoresizingMaskIntoConstraints = false
        
        let serviceDesc = UILabel()
        serviceDesc.text = "Full GST Registration process for proprietorship. Includes application filing and follow-up."
        serviceDesc.font = DesignSystem.Fonts.regular(size: 14)
        serviceDesc.textColor = DesignSystem.Colors.textSecondary
        serviceDesc.numberOfLines = 0
        serviceDesc.translatesAutoresizingMaskIntoConstraints = false
        
        infoCard.addSubview(serviceTitle)
        infoCard.addSubview(serviceDesc)
        
        NSLayoutConstraint.activate([
            infoCard.topAnchor.constraint(equalTo: headerCard.bottomAnchor, constant: 16),
            infoCard.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            infoCard.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            
            serviceTitle.topAnchor.constraint(equalTo: infoCard.topAnchor, constant: 16),
            serviceTitle.leadingAnchor.constraint(equalTo: infoCard.leadingAnchor, constant: 16),
            
            serviceDesc.topAnchor.constraint(equalTo: serviceTitle.bottomAnchor, constant: 8),
            serviceDesc.leadingAnchor.constraint(equalTo: infoCard.leadingAnchor, constant: 16),
            serviceDesc.trailingAnchor.constraint(equalTo: infoCard.trailingAnchor, constant: -16),
            serviceDesc.bottomAnchor.constraint(equalTo: infoCard.bottomAnchor, constant: -16)
        ])
        
        // 3. Timeline (Simple List)
        let timelineLabel = UILabel()
        timelineLabel.text = "Timeline"
        timelineLabel.font = DesignSystem.Fonts.bold(size: 16)
        timelineLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(timelineLabel)
        
        let timelineStack = UIStackView()
        timelineStack.axis = .vertical
        timelineStack.spacing = 16
        timelineStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(timelineStack)
        
        // Items
        timelineStack.addArrangedSubview(createTimelineItem(title: "Order Placed", date: "12 Dec, 10:00 AM", isCompleted: true))
        timelineStack.addArrangedSubview(createTimelineItem(title: "Documents Verified", date: "12 Dec, 02:00 PM", isCompleted: true))
        timelineStack.addArrangedSubview(createTimelineItem(title: "Application Submitted", date: "Pending", isCompleted: false))
        
        NSLayoutConstraint.activate([
            timelineLabel.topAnchor.constraint(equalTo: infoCard.bottomAnchor, constant: 24),
            timelineLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            
            timelineStack.topAnchor.constraint(equalTo: timelineLabel.bottomAnchor, constant: 16),
            timelineStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            timelineStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            timelineStack.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -24)
        ])
    }
    
    private func createCard() -> UIView {
        let view = UIView()
        view.backgroundColor = .white
        view.layer.cornerRadius = 12
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }
    
    private func createTimelineItem(title: String, date: String, isCompleted: Bool) -> UIView {
        let container = UIView()
        container.translatesAutoresizingMaskIntoConstraints = false
        
        let dot = UIView()
        dot.backgroundColor = isCompleted ? DesignSystem.Colors.success : .systemGray4
        dot.layer.cornerRadius = 6
        dot.translatesAutoresizingMaskIntoConstraints = false
        
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = DesignSystem.Fonts.bold(size: 14)
        titleLabel.textColor = isCompleted ? DesignSystem.Colors.textPrimary : .systemGray
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let dateLabel = UILabel()
        dateLabel.text = date
        dateLabel.font = DesignSystem.Fonts.regular(size: 12)
        dateLabel.textColor = .systemGray
        dateLabel.translatesAutoresizingMaskIntoConstraints = false
        
        container.addSubview(dot)
        container.addSubview(titleLabel)
        container.addSubview(dateLabel)
        
        NSLayoutConstraint.activate([
            dot.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            dot.topAnchor.constraint(equalTo: container.topAnchor, constant: 4),
            dot.widthAnchor.constraint(equalToConstant: 12),
            dot.heightAnchor.constraint(equalToConstant: 12),
            
            titleLabel.leadingAnchor.constraint(equalTo: dot.trailingAnchor, constant: 12),
            titleLabel.topAnchor.constraint(equalTo: container.topAnchor),
            
            dateLabel.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor),
            dateLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 2),
            dateLabel.bottomAnchor.constraint(equalTo: container.bottomAnchor)
        ])
        
        return container
    }
    
    private func loadData() {
        // Mock load
    }
}
