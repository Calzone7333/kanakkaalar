import UIKit

class ServiceDetailViewController: UIViewController {

    private let titleString: String
    private let categoryString: String?
    private let descriptionString: String
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Header
    private let headerContainer = UIView()
    private let titleLabel = UILabel()
    private let priceLabel = UILabel()
    private let descLabel = UILabel()
    
    // Tabs
    private let tabsContainer = UIView()
    private let overviewButton = UIButton(type: .system)
    private let processButton = UIButton(type: .system)
    private let activeTabIndicator = UIView()
    private var isOverviewSelected = true
    
    // Content
    private let contentStack = UIStackView()
    
    // Footer
    private let footerView = UIView()
    private let applyButton = UIButton(type: .system)
    
    init(title: String, description: String, category: String? = nil) {
        self.titleString = title
        self.descriptionString = description
        self.categoryString = category
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) { fatalError() }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        self.title = "Service Details"
        
        setupUI()
        loadContent()
    }
    
    private func setupUI() {
        // Footer
        footerView.backgroundColor = .white
        footerView.layer.shadowColor = UIColor.black.cgColor
        footerView.layer.shadowOpacity = 0.1
        footerView.layer.shadowOffset = CGSize(width: 0, height: -2)
        footerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(footerView)
        
        applyButton.setTitle("Apply Now", for: .normal)
        applyButton.backgroundColor = DesignSystem.Colors.primary
        applyButton.setTitleColor(.white, for: .normal)
        applyButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 16)
        applyButton.layer.cornerRadius = 8
        applyButton.translatesAutoresizingMaskIntoConstraints = false
        applyButton.addTarget(self, action: #selector(handleApply), for: .touchUpInside)
        footerView.addSubview(applyButton)
        
        // ScrollView
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        // Header
        headerContainer.backgroundColor = DesignSystem.Colors.primary
        headerContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(headerContainer)
        
        titleLabel.text = titleString
        titleLabel.font = DesignSystem.Fonts.bold(size: 24)
        titleLabel.textColor = .white
        titleLabel.numberOfLines = 0
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(titleLabel)
        
        priceLabel.text = "Starts from ₹499" // Dynamic in logic
        priceLabel.font = DesignSystem.Fonts.bold(size: 16)
        priceLabel.textColor = UIColor(white: 0.9, alpha: 1)
        priceLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(priceLabel)
        
        descLabel.text = descriptionString
        descLabel.font = DesignSystem.Fonts.regular(size: 14)
        descLabel.textColor = UIColor(white: 0.8, alpha: 1)
        descLabel.numberOfLines = 0
        descLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(descLabel)
        
        // Tabs
        tabsContainer.backgroundColor = .white
        tabsContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(tabsContainer)
        
        overviewButton.setTitle("Overview", for: .normal)
        overviewButton.addTarget(self, action: #selector(handleOverviewTab), for: .touchUpInside)
        
        processButton.setTitle("Process & Docs", for: .normal)
        processButton.addTarget(self, action: #selector(handleProcessTab), for: .touchUpInside)
        
        configureTabButton(overviewButton)
        configureTabButton(processButton)
        
        tabsContainer.addSubview(overviewButton)
        tabsContainer.addSubview(processButton)
        
        activeTabIndicator.backgroundColor = DesignSystem.Colors.primary
        activeTabIndicator.translatesAutoresizingMaskIntoConstraints = false
        tabsContainer.addSubview(activeTabIndicator)
        
        // Content Stack
        contentStack.axis = .vertical
        contentStack.spacing = 16
        contentStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(contentStack)
        
        // Constraints
        NSLayoutConstraint.activate([
            footerView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            footerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            footerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            footerView.heightAnchor.constraint(equalToConstant: 80),
            
            applyButton.topAnchor.constraint(equalTo: footerView.topAnchor, constant: 16),
            applyButton.leadingAnchor.constraint(equalTo: footerView.leadingAnchor, constant: 16),
            applyButton.trailingAnchor.constraint(equalTo: footerView.trailingAnchor, constant: -16),
            applyButton.bottomAnchor.constraint(equalTo: footerView.safeAreaLayoutGuide.bottomAnchor, constant: -16),
            
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: footerView.topAnchor),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            headerContainer.topAnchor.constraint(equalTo: contentView.topAnchor),
            headerContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            headerContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            
            titleLabel.topAnchor.constraint(equalTo: headerContainer.topAnchor, constant: 24),
            titleLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor, constant: 24),
            titleLabel.trailingAnchor.constraint(equalTo: headerContainer.trailingAnchor, constant: -24),
            
            priceLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            priceLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor, constant: 24),
            
            descLabel.topAnchor.constraint(equalTo: priceLabel.bottomAnchor, constant: 12),
            descLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor, constant: 24),
            descLabel.trailingAnchor.constraint(equalTo: headerContainer.trailingAnchor, constant: -24),
            descLabel.bottomAnchor.constraint(equalTo: headerContainer.bottomAnchor, constant: -24),
            
            tabsContainer.topAnchor.constraint(equalTo: headerContainer.bottomAnchor),
            tabsContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            tabsContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            tabsContainer.heightAnchor.constraint(equalToConstant: 50),
            
            overviewButton.leadingAnchor.constraint(equalTo: tabsContainer.leadingAnchor),
            overviewButton.topAnchor.constraint(equalTo: tabsContainer.topAnchor),
            overviewButton.bottomAnchor.constraint(equalTo: tabsContainer.bottomAnchor),
            overviewButton.widthAnchor.constraint(equalTo: tabsContainer.widthAnchor, multiplier: 0.5),
            
            processButton.trailingAnchor.constraint(equalTo: tabsContainer.trailingAnchor),
            processButton.topAnchor.constraint(equalTo: tabsContainer.topAnchor),
            processButton.bottomAnchor.constraint(equalTo: tabsContainer.bottomAnchor),
            processButton.widthAnchor.constraint(equalTo: tabsContainer.widthAnchor, multiplier: 0.5),
            
            activeTabIndicator.bottomAnchor.constraint(equalTo: tabsContainer.bottomAnchor),
            activeTabIndicator.heightAnchor.constraint(equalToConstant: 3),
            activeTabIndicator.widthAnchor.constraint(equalTo: tabsContainer.widthAnchor, multiplier: 0.5),
            // We'll update leading anchor of indicator dynamically
            
            contentStack.topAnchor.constraint(equalTo: tabsContainer.bottomAnchor, constant: 16),
            contentStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            contentStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            contentStack.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -24)
        ])
        
        updateTabSelection()
    }
    
    private var indicatorLeadingConstraint: NSLayoutConstraint?
    
    private func configureTabButton(_ button: UIButton) {
        button.setTitleColor(DesignSystem.Colors.textPrimary, for: .normal)
        button.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
        button.translatesAutoresizingMaskIntoConstraints = false
    }
    
    private func updateTabSelection() {
        if isOverviewSelected {
            overviewButton.setTitleColor(DesignSystem.Colors.primary, for: .normal)
            processButton.setTitleColor(DesignSystem.Colors.textSecondary, for: .normal)
            
            indicatorLeadingConstraint?.isActive = false
            indicatorLeadingConstraint = activeTabIndicator.leadingAnchor.constraint(equalTo: tabsContainer.leadingAnchor)
            indicatorLeadingConstraint?.isActive = true
        } else {
            overviewButton.setTitleColor(DesignSystem.Colors.textSecondary, for: .normal)
            processButton.setTitleColor(DesignSystem.Colors.primary, for: .normal)
            
            indicatorLeadingConstraint?.isActive = false
            indicatorLeadingConstraint = activeTabIndicator.leadingAnchor.constraint(equalTo: tabsContainer.centerXAnchor)
            indicatorLeadingConstraint?.isActive = true
        }
        
        UIView.animate(withDuration: 0.3) {
            self.view.layoutIfNeeded()
        }
    }
    
    @objc private func handleOverviewTab() {
        isOverviewSelected = true
        updateTabSelection()
        loadContent()
    }
    
    @objc private func handleProcessTab() {
        isOverviewSelected = false
        updateTabSelection()
        loadContent()
    }
    
    @objc private func handleApply() {
        let price = priceLabel.text ?? "0"
        let orderVC = ServiceOrderViewController(serviceTitle: titleString, priceString: price)
        navigationController?.pushViewController(orderVC, animated: true)
    }
    
    private func loadContent() {
        // Clear stack
        contentStack.arrangedSubviews.forEach { $0.removeFromSuperview() }
        
        let titleLower = titleString.lowercased()
        
        if isOverviewSelected {
            if titleLower.contains("gst") {
                loadGSTOverview()
            } else if titleLower.contains("msme") {
                loadMSMEOverview()
            } else if titleLower.contains("pvt ltd") || titleLower.contains("company") {
                loadCompanyOverview()
            } else {
                loadGenericOverview()
            }
        } else {
            if titleLower.contains("gst") {
                loadGSTProcess()
            } else if titleLower.contains("msme") {
                loadMSMEProcess()
            } else if titleLower.contains("pvt ltd") || titleLower.contains("company") {
                loadCompanyProcess()
            } else {
                loadGenericProcess()
            }
        }
        
        // Update price label logic if needed, usually fixed per service
        if titleLower.contains("gst") { priceLabel.text = "Starts from ₹499" }
        else if titleLower.contains("msme") { priceLabel.text = "Starts from ₹699" }
        else if titleLower.contains("pvt ltd") { priceLabel.text = "Starts from ₹999" }
    }
    
    // MARK: - Content Helpers
    
    private func addSection(title: String, content: String) {
        let v = UIView()
        v.backgroundColor = .white
        v.layer.cornerRadius = 12
        v.layer.borderWidth = 1
        v.layer.borderColor = UIColor.systemGray6.cgColor
        v.translatesAutoresizingMaskIntoConstraints = false
        
        let t = UILabel()
        t.text = title
        t.font = DesignSystem.Fonts.bold(size: 16)
        t.translatesAutoresizingMaskIntoConstraints = false
        
        let c = UILabel()
        c.text = content
        c.font = DesignSystem.Fonts.regular(size: 14)
        c.textColor = DesignSystem.Colors.textSecondary
        c.numberOfLines = 0
        c.translatesAutoresizingMaskIntoConstraints = false
        
        v.addSubview(t)
        v.addSubview(c)
        
        NSLayoutConstraint.activate([
            t.topAnchor.constraint(equalTo: v.topAnchor, constant: 16),
            t.leadingAnchor.constraint(equalTo: v.leadingAnchor, constant: 16),
            t.trailingAnchor.constraint(equalTo: v.trailingAnchor, constant: -16),
            
            c.topAnchor.constraint(equalTo: t.bottomAnchor, constant: 8),
            c.leadingAnchor.constraint(equalTo: v.leadingAnchor, constant: 16),
            c.trailingAnchor.constraint(equalTo: v.trailingAnchor, constant: -16),
            c.bottomAnchor.constraint(equalTo: v.bottomAnchor, constant: -16)
        ])
        
        contentStack.addArrangedSubview(v)
    }
    
    // MARK: - Specific Content (Mocked similar to Android XML/Java logic)
    
    private func loadGSTOverview() {
        addSection(title: "About GST", content: "GST is a single tax on the supply of goods and services, right from the manufacturer to the consumer.")
        addSection(title: "Benefits", content: "• Legal Recognition\n• Input Tax Credit\n• E-commerce Sales")
    }
    
    private func loadGSTProcess() {
        addSection(title: "Documents Required", content: "• PAN Card\n• Aadhaar Card\n• Bank Proof\n• Address Proof")
        addSection(title: "Process", content: "1. Upload Documents\n2. Application Filling\n3. ARN Generation\n4. GST Certificate")
    }
    
    private func loadMSMEOverview() {
        addSection(title: "About MSME", content: "MSME Registration is for micro, small and medium enterprises to avail government benefits.")
        addSection(title: "Benefits", content: "• Collateral Free Loans\n• Subsidy on Patent\n• Utility Bill Concession")
    }
    
    private func loadMSMEProcess() {
        addSection(title: "Documents Required", content: "• Aadhaar Card\n• PAN Card\n• Business Address Proof")
        addSection(title: "Process", content: "1. Udyam Registration\n2. Verification\n3. Certificate Issue")
    }
    
    private func loadCompanyOverview() {
        addSection(title: "About Pvt Ltd", content: "Private Limited Company is the most popular legal structure for businesses in India.")
        addSection(title: "Why Register?", content: "• Limited Liability\n• Separate Legal Entity\n• Easy Fundraising")
    }
    
    private func loadCompanyProcess() {
        addSection(title: "Documents Required", content: "• Directors' KYC\n• Office Address Proof\n• NOC from Owner")
        addSection(title: "Process", content: "1. DSC & DIN\n2. Name Approval\n3. Incorporation Form\n4. COI Issuance")
    }
    
    private func loadGenericOverview() {
        addSection(title: "About Service", content: descriptionString)
        addSection(title: "Key Features", content: "• Professional Support\n• Timely Updates\n• Secure Process")
    }
    
    private func loadGenericProcess() {
        addSection(title: "Checklist", content: "• ID Proofs\n• Address Proofs\n• Application Form")
        addSection(title: "Steps", content: "1. Submit Request\n2. Document Verification\n3. Processing\n4. Completion")
    }
}
