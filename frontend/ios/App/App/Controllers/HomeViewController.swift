import UIKit

class HomeViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Header Elements
    private let headerContainer = UIView()
    private let menuButton = UIButton(type: .system)
    private let profileImageView = UIImageView()
    private let notificationButton = UIButton(type: .system)
    private let greetingLabel = UILabel()
    private let userNameLabel = UILabel()
    
    // Content Elements
    private let searchContainer = UIView()
    private let bannerScrollView = UIScrollView()
    private let bannerStackView = UIStackView()
    
    private let recentActivityScrollView = UIScrollView()
    private let recentActivityStack = UIStackView()
    
    private let servicesGridContainer = UIStackView()
    private let whyChooseUsStack = UIStackView()
    private let clientStoriesScrollView = UIScrollView()
    private let clientStoriesStack = UIStackView()
    private let ctaCard = UIView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        
        setupScrollView()
        setupHeader()
        setupSearch()
        setupBanners()
        setupRecentActivity()
        setupServices()
        setupWhyChooseUs()
        setupClientStories()
        setupCTA()
        
        loadUserData()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: animated)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        navigationController?.setNavigationBarHidden(false, animated: animated)
    }
    
    private func setupScrollView() {
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor)
        ])
    }
    
    // MARK: - Header & Search
    
    private func setupHeader() {
        headerContainer.backgroundColor = UIColor(red: 31/255, green: 41/255, blue: 55/255, alpha: 1.0) // Dark Slate
        headerContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(headerContainer)
        
        // Menu (Placeholder for Drawer)
        menuButton.setImage(UIImage(systemName: "line.3.horizontal"), for: .normal)
        menuButton.tintColor = .white
        menuButton.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(menuButton)
        
        // Profile
        profileImageView.backgroundColor = .lightGray
        profileImageView.layer.cornerRadius = 20
        profileImageView.layer.masksToBounds = true
        profileImageView.translatesAutoresizingMaskIntoConstraints = false
        profileImageView.isUserInteractionEnabled = true
        profileImageView.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(handleProfileTap)))
        headerContainer.addSubview(profileImageView)
        
        // Notification
        notificationButton.setImage(UIImage(systemName: "bell.fill"), for: .normal)
        notificationButton.tintColor = .white
        notificationButton.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(notificationButton)
        
        // Text
        greetingLabel.text = "Welcome Back"
        greetingLabel.textColor = .white
        greetingLabel.font = DesignSystem.Fonts.bold(size: 20)
        greetingLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(greetingLabel)
        
        userNameLabel.text = "Let's handle your business"
        userNameLabel.textColor = UIColor(white: 0.9, alpha: 1.0)
        userNameLabel.font = DesignSystem.Fonts.regular(size: 14)
        userNameLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(userNameLabel)
        
        NSLayoutConstraint.activate([
            headerContainer.topAnchor.constraint(equalTo: contentView.topAnchor),
            headerContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            headerContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            
            // Top Bar Row
            menuButton.topAnchor.constraint(equalTo: headerContainer.safeAreaLayoutGuide.topAnchor, constant: 16),
            menuButton.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor, constant: 16),
            menuButton.widthAnchor.constraint(equalToConstant: 24),
            menuButton.heightAnchor.constraint(equalToConstant: 24),
            
            profileImageView.centerYAnchor.constraint(equalTo: menuButton.centerYAnchor),
            profileImageView.trailingAnchor.constraint(equalTo: headerContainer.trailingAnchor, constant: -16),
            profileImageView.widthAnchor.constraint(equalToConstant: 40),
            profileImageView.heightAnchor.constraint(equalToConstant: 40),
            
            notificationButton.centerYAnchor.constraint(equalTo: menuButton.centerYAnchor),
            notificationButton.trailingAnchor.constraint(equalTo: profileImageView.leadingAnchor, constant: -16),
            
            // Greeting Row
            greetingLabel.topAnchor.constraint(equalTo: menuButton.bottomAnchor, constant: 24),
            greetingLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor, constant: 16),
            
            userNameLabel.topAnchor.constraint(equalTo: greetingLabel.bottomAnchor, constant: 4),
            userNameLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor, constant: 16),
            userNameLabel.bottomAnchor.constraint(equalTo: headerContainer.bottomAnchor, constant: -40) // Space for Search overlap
        ])
    }
    
    private func setupSearch() {
        searchContainer.backgroundColor = .white
        searchContainer.layer.cornerRadius = 12
        searchContainer.layer.shadowColor = UIColor.black.cgColor
        searchContainer.layer.shadowOpacity = 0.1
        searchContainer.layer.shadowOffset = CGSize(width: 0, height: 2)
        searchContainer.layer.shadowRadius = 4
        searchContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(searchContainer)
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(handleSeeAllTap))
        searchContainer.addGestureRecognizer(tap)
        searchContainer.isUserInteractionEnabled = true
        
        let iconView = UIImageView(image: UIImage(systemName: "magnifyingglass"))
        iconView.tintColor = .gray
        iconView.translatesAutoresizingMaskIntoConstraints = false
        searchContainer.addSubview(iconView)
        
        let label = UILabel()
        label.text = "Search services..."
        label.textColor = DesignSystem.Colors.textTertiary
        label.font = DesignSystem.Fonts.regular(size: 14)
        label.translatesAutoresizingMaskIntoConstraints = false
        searchContainer.addSubview(label)
        
        NSLayoutConstraint.activate([
            searchContainer.topAnchor.constraint(equalTo: headerContainer.bottomAnchor, constant: -25),
            searchContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            searchContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            searchContainer.heightAnchor.constraint(equalToConstant: 50),
            
            iconView.leadingAnchor.constraint(equalTo: searchContainer.leadingAnchor, constant: 16),
            iconView.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor),
            
            label.leadingAnchor.constraint(equalTo: iconView.trailingAnchor, constant: 12),
            label.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor)
        ])
    }
    
    // MARK: - Banners
    
    private func setupBanners() {
        bannerScrollView.showsHorizontalScrollIndicator = false
        bannerScrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(bannerScrollView)
        
        bannerStackView.axis = .horizontal
        bannerStackView.spacing = 16
        bannerStackView.translatesAutoresizingMaskIntoConstraints = false
        bannerScrollView.addSubview(bannerStackView)
        
        // Mock Banners
        let banners = [
            ("Start Your Business", "Register company in minutes.", "paperplane.fill", UIColor(hex: "#EEF2FF"), UIColor(hex: "#4F46E5")),
            ("File Your Taxes", "Hassle-free tax filing.", "doc.text.fill", UIColor(hex: "#FFF7ED"), UIColor(hex: "#EA580C")),
            ("Legal Compliance", "Expert legal advice.", "scale.3d", UIColor(hex: "#F0FDF4"), UIColor(hex: "#16A34A"))
        ]
        
        for banner in banners {
            let view = createBannerCard(title: banner.0, desc: banner.1, icon: banner.2, bg: banner.3, tint: banner.4)
            bannerStackView.addArrangedSubview(view)
        }
        
        NSLayoutConstraint.activate([
            bannerScrollView.topAnchor.constraint(equalTo: searchContainer.bottomAnchor, constant: 24),
            bannerScrollView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            bannerScrollView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            bannerScrollView.heightAnchor.constraint(equalToConstant: 140),
            
            bannerStackView.topAnchor.constraint(equalTo: bannerScrollView.contentLayoutGuide.topAnchor),
            bannerStackView.leadingAnchor.constraint(equalTo: bannerScrollView.contentLayoutGuide.leadingAnchor, constant: 24),
            bannerStackView.trailingAnchor.constraint(equalTo: bannerScrollView.contentLayoutGuide.trailingAnchor, constant: -24),
            bannerStackView.bottomAnchor.constraint(equalTo: bannerScrollView.contentLayoutGuide.bottomAnchor),
            bannerStackView.heightAnchor.constraint(equalTo: bannerScrollView.heightAnchor)
        ])
    }
    
    private func createBannerCard(title: String, desc: String, icon: String, bg: UIColor, tint: UIColor) -> UIView {
        let card = UIView()
        card.backgroundColor = bg
        card.layer.cornerRadius = 16
        card.translatesAutoresizingMaskIntoConstraints = false
        card.widthAnchor.constraint(equalToConstant: 280).isActive = true
        
        let stack = UIStackView()
        stack.axis = .vertical
        stack.spacing = 4
        stack.translatesAutoresizingMaskIntoConstraints = false
        
        let titleLbl = UILabel()
        titleLbl.text = title
        titleLbl.font = DesignSystem.Fonts.bold(size: 16)
        titleLbl.textColor = DesignSystem.Colors.textPrimary
        
        let descLbl = UILabel()
        descLbl.text = desc
        descLbl.font = DesignSystem.Fonts.regular(size: 14)
        descLbl.textColor = DesignSystem.Colors.textSecondary
        descLbl.numberOfLines = 2
        
        let iconView = UIImageView(image: UIImage(systemName: icon))
        iconView.tintColor = tint
        iconView.contentMode = .scaleAspectFit
        iconView.translatesAutoresizingMaskIntoConstraints = false
        iconView.widthAnchor.constraint(equalToConstant: 30).isActive = true
        iconView.heightAnchor.constraint(equalToConstant: 30).isActive = true
        
        stack.addArrangedSubview(titleLbl)
        stack.addArrangedSubview(descLbl)
        
        card.addSubview(stack)
        card.addSubview(iconView)
        
        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 16),
            stack.centerYAnchor.constraint(equalTo: card.centerYAnchor),
            stack.trailingAnchor.constraint(equalTo: iconView.leadingAnchor, constant: -8),
            
            iconView.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -16),
            iconView.centerYAnchor.constraint(equalTo: card.centerYAnchor)
        ])
        
        return card
    }

    // MARK: - Recent Activity
    
    private func setupRecentActivity() {
        let header = createSectionHeader(title: "Recent Activity", showSeeAll: false)
        contentView.addSubview(header)
        
        recentActivityScrollView.showsHorizontalScrollIndicator = false
        recentActivityScrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(recentActivityScrollView)
        
        recentActivityStack.axis = .horizontal
        recentActivityStack.spacing = 16
        recentActivityStack.translatesAutoresizingMaskIntoConstraints = false
        recentActivityScrollView.addSubview(recentActivityStack)
        
        // Mock Data
        let activities = [
            ("GST Registration", "In Progress", "Managed by BizzFilling", UIColor(hex: "#FEF3C7"), UIColor(hex: "#D97706")),
            ("Company Inc", "Completed", "Completed on 05 Sep", UIColor(hex: "#D1FAE5"), UIColor(hex: "#059669"))
        ]
        
        for act in activities {
            let view = createActivityCard(title: act.0, status: act.1, desc: act.2, badgeBg: act.3, badgeText: act.4)
            recentActivityStack.addArrangedSubview(view)
        }
        
        NSLayoutConstraint.activate([
            header.topAnchor.constraint(equalTo: bannerScrollView.bottomAnchor, constant: 24),
            header.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            header.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            
            recentActivityScrollView.topAnchor.constraint(equalTo: header.bottomAnchor, constant: 12),
            recentActivityScrollView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            recentActivityScrollView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            recentActivityScrollView.heightAnchor.constraint(equalToConstant: 110),
            
            recentActivityStack.topAnchor.constraint(equalTo: recentActivityScrollView.contentLayoutGuide.topAnchor),
            recentActivityStack.leadingAnchor.constraint(equalTo: recentActivityScrollView.contentLayoutGuide.leadingAnchor, constant: 24),
            recentActivityStack.trailingAnchor.constraint(equalTo: recentActivityScrollView.contentLayoutGuide.trailingAnchor, constant: -24),
            recentActivityStack.bottomAnchor.constraint(equalTo: recentActivityScrollView.contentLayoutGuide.bottomAnchor),
            recentActivityStack.heightAnchor.constraint(equalTo: recentActivityScrollView.heightAnchor)
        ])
    }
    
    private func createActivityCard(title: String, status: String, desc: String, badgeBg: UIColor, badgeText: UIColor) -> UIView {
        let card = UIView()
        card.backgroundColor = .white
        card.layer.cornerRadius = 12
        card.layer.borderWidth = 1
        card.layer.borderColor = UIColor.systemGray6.cgColor
        card.translatesAutoresizingMaskIntoConstraints = false
        card.widthAnchor.constraint(equalToConstant: 280).isActive = true
        
        let titleLbl = UILabel()
        titleLbl.text = title
        titleLbl.font = DesignSystem.Fonts.bold(size: 14)
        
        let statusLbl = UILabel()
        statusLbl.text = "  \(status)  "
        statusLbl.font = DesignSystem.Fonts.bold(size: 10)
        statusLbl.textColor = badgeText
        statusLbl.backgroundColor = badgeBg
        statusLbl.layer.cornerRadius = 4
        statusLbl.layer.masksToBounds = true
        
        let descLbl = UILabel()
        descLbl.text = desc
        descLbl.font = DesignSystem.Fonts.regular(size: 12)
        descLbl.textColor = DesignSystem.Colors.textTertiary
        
        card.addSubview(titleLbl)
        card.addSubview(statusLbl)
        card.addSubview(descLbl)
        
        titleLbl.translatesAutoresizingMaskIntoConstraints = false
        statusLbl.translatesAutoresizingMaskIntoConstraints = false
        descLbl.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            titleLbl.topAnchor.constraint(equalTo: card.topAnchor, constant: 16),
            titleLbl.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 16),
            
            statusLbl.centerYAnchor.constraint(equalTo: titleLbl.centerYAnchor),
            statusLbl.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -16),
            
            descLbl.topAnchor.constraint(equalTo: titleLbl.bottomAnchor, constant: 8),
            descLbl.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 16),
            descLbl.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -16)
        ])
        
        return card
    }
    
    // MARK: - Services
    
    private func setupServices() {
        let header = createSectionHeader(title: "Our Services", showSeeAll: true)
        contentView.addSubview(header)
        
        servicesGridContainer.axis = .vertical
        servicesGridContainer.spacing = 16
        servicesGridContainer.distribution = .fillEqually
        servicesGridContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(servicesGridContainer)
        
        // Mock Services (3 cols)
        let services = [
            ("GST", "doc.plaintext"), ("Tax Filing", "dollarsign.circle"), ("Company", "building.2"),
            ("ISO Cert", "checkmark.seal"), ("FSSAI", "leaf"), ("IE Code", "globe")
        ]
        
        for i in stride(from: 0, to: services.count, by: 3) {
            let row = UIStackView()
            row.axis = .horizontal
            row.spacing = 16
            row.distribution = .fillEqually
            
            for j in 0..<3 {
                if i+j < services.count {
                    let s = services[i+j]
                    row.addArrangedSubview(createServiceGridItem(title: s.0, icon: s.1))
                } else {
                    row.addArrangedSubview(UIView())
                }
            }
            servicesGridContainer.addArrangedSubview(row)
        }
        
        NSLayoutConstraint.activate([
            header.topAnchor.constraint(equalTo: recentActivityScrollView.bottomAnchor, constant: 24),
            header.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            header.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            
            servicesGridContainer.topAnchor.constraint(equalTo: header.bottomAnchor, constant: 16),
            servicesGridContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            servicesGridContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16)
        ])
    }
    
    private func createServiceGridItem(title: String, icon: String) -> UIView {
        let container = UIView()
        container.backgroundColor = .white
        container.layer.cornerRadius = 12
        container.layer.borderWidth = 1
        container.layer.borderColor = UIColor.systemGray6.cgColor
        container.translatesAutoresizingMaskIntoConstraints = false
        container.heightAnchor.constraint(equalToConstant: 100).isActive = true
        
        // Tap
        container.isUserInteractionEnabled = true
        container.accessibilityIdentifier = title
        container.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(handleServiceTap(_:))))
        
        let iconView = UIImageView(image: UIImage(systemName: icon))
        iconView.tintColor = UIColor(hex: "#2F5C46")
        iconView.translatesAutoresizingMaskIntoConstraints = false
        
        let lbl = UILabel()
        lbl.text = title
        lbl.font = DesignSystem.Fonts.bold(size: 12)
        lbl.textColor = DesignSystem.Colors.textPrimary
        lbl.textAlignment = .center
        lbl.translatesAutoresizingMaskIntoConstraints = false
        
        container.addSubview(iconView)
        container.addSubview(lbl)
        
        NSLayoutConstraint.activate([
            iconView.centerXAnchor.constraint(equalTo: container.centerXAnchor),
            iconView.centerYAnchor.constraint(equalTo: container.centerYAnchor, constant: -10),
            iconView.widthAnchor.constraint(equalToConstant: 30),
            iconView.heightAnchor.constraint(equalToConstant: 30),
            
            lbl.topAnchor.constraint(equalTo: iconView.bottomAnchor, constant: 8),
            lbl.centerXAnchor.constraint(equalTo: container.centerXAnchor),
            lbl.leadingAnchor.constraint(equalTo: container.leadingAnchor, constant: 4),
            lbl.trailingAnchor.constraint(equalTo: container.trailingAnchor, constant: -4)
        ])
        
        return container
    }
    
    // MARK: - Why Choose Us
    
    private func setupWhyChooseUs() {
        let label = UILabel()
        label.text = "Why Choose Us?"
        label.font = DesignSystem.Fonts.bold(size: 18)
        label.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(label)
        
        whyChooseUsStack.axis = .horizontal
        whyChooseUsStack.spacing = 12
        whyChooseUsStack.distribution = .fillEqually
        whyChooseUsStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(whyChooseUsStack)
        
        let items = [("Expert Team", "person.3.fill"), ("Secure Process", "lock.shield.fill"), ("Fast Service", "bolt.fill")]
        
        for item in items {
            let v = createFeatureCard(title: item.0, icon: item.1)
            whyChooseUsStack.addArrangedSubview(v)
        }
        
        NSLayoutConstraint.activate([
            label.topAnchor.constraint(equalTo: servicesGridContainer.bottomAnchor, constant: 32),
            label.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            
            whyChooseUsStack.topAnchor.constraint(equalTo: label.bottomAnchor, constant: 16),
            whyChooseUsStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            whyChooseUsStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16)
        ])
    }
    
    private func createFeatureCard(title: String, icon: String) -> UIView {
        let v = UIView()
        v.backgroundColor = .white
        v.layer.cornerRadius = 12
        v.layer.borderWidth = 1
        v.layer.borderColor = UIColor.systemGray6.cgColor
        
        let iv = UIImageView(image: UIImage(systemName: icon))
        iv.tintColor = UIColor(hex: "#2F5C46")
        iv.contentMode = .scaleAspectFit
        iv.translatesAutoresizingMaskIntoConstraints = false
        
        let l = UILabel()
        l.text = title.replacingOccurrences(of: " ", with: "\n")
        l.font = DesignSystem.Fonts.bold(size: 12)
        l.numberOfLines = 2
        l.textAlignment = .center
        l.translatesAutoresizingMaskIntoConstraints = false
        
        v.addSubview(iv)
        v.addSubview(l)
        
        NSLayoutConstraint.activate([
            v.heightAnchor.constraint(equalToConstant: 110),
            iv.topAnchor.constraint(equalTo: v.topAnchor, constant: 20),
            iv.centerXAnchor.constraint(equalTo: v.centerXAnchor),
            iv.widthAnchor.constraint(equalToConstant: 30),
            iv.heightAnchor.constraint(equalToConstant: 30),
            
            l.topAnchor.constraint(equalTo: iv.bottomAnchor, constant: 8),
            l.centerXAnchor.constraint(equalTo: v.centerXAnchor),
            l.leadingAnchor.constraint(equalTo: v.leadingAnchor, constant: 4),
            l.trailingAnchor.constraint(equalTo: v.trailingAnchor, constant: -4)
        ])
        
        return v
    }
    
    // MARK: - Client Stories & CTA
    
    private func setupClientStories() {
        let label = UILabel()
        label.text = "Client Stories"
        label.font = DesignSystem.Fonts.bold(size: 18)
        label.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(label)
        
        clientStoriesScrollView.showsHorizontalScrollIndicator = false
        clientStoriesScrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(clientStoriesScrollView)
        
        clientStoriesStack.axis = .horizontal
        clientStoriesStack.spacing = 16
        clientStoriesStack.translatesAutoresizingMaskIntoConstraints = false
        clientStoriesScrollView.addSubview(clientStoriesStack)
        
        let stories = [
            ("Excellent Service!", "Bizzfilling helped me register my company in just 2 days.", "- Rahul Kumar"),
            ("Hassle-free GST", "Filing taxes was never this easy. Supportive team.", "- Priya Sharma")
        ]
        
        for s in stories {
            clientStoriesStack.addArrangedSubview(createStoryCard(title: s.0, desc: s.1, author: s.2))
        }
        
        NSLayoutConstraint.activate([
            label.topAnchor.constraint(equalTo: whyChooseUsStack.bottomAnchor, constant: 32),
            label.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            
            clientStoriesScrollView.topAnchor.constraint(equalTo: label.bottomAnchor, constant: 16),
            clientStoriesScrollView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            clientStoriesScrollView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            clientStoriesScrollView.heightAnchor.constraint(equalToConstant: 140),
            
            clientStoriesStack.topAnchor.constraint(equalTo: clientStoriesScrollView.contentLayoutGuide.topAnchor),
            clientStoriesStack.leadingAnchor.constraint(equalTo: clientStoriesScrollView.contentLayoutGuide.leadingAnchor, constant: 24),
            clientStoriesStack.trailingAnchor.constraint(equalTo: clientStoriesScrollView.contentLayoutGuide.trailingAnchor, constant: -24),
            clientStoriesStack.bottomAnchor.constraint(equalTo: clientStoriesScrollView.contentLayoutGuide.bottomAnchor),
            clientStoriesStack.heightAnchor.constraint(equalTo: clientStoriesScrollView.heightAnchor)
        ])
    }
    
    private func createStoryCard(title: String, desc: String, author: String) -> UIView {
        let v = UIView()
        v.backgroundColor = .white
        v.layer.cornerRadius = 12
        v.layer.borderWidth = 1
        v.layer.borderColor = UIColor.systemGray6.cgColor
        v.widthAnchor.constraint(equalToConstant: 260).isActive = true
        
        let t = UILabel()
        t.text = title
        t.font = DesignSystem.Fonts.bold(size: 14)
        
        let d = UILabel()
        d.text = desc
        d.font = DesignSystem.Fonts.regular(size: 12)
        d.textColor = DesignSystem.Colors.textSecondary
        d.numberOfLines = 3
        
        let a = UILabel()
        a.text = author
        a.font = DesignSystem.Fonts.regular(size: 12)
        a.textColor = DesignSystem.Colors.textTertiary
        a.textAlignment = .right
        
        let st = UIStackView(arrangedSubviews: [t, d, a])
        st.axis = .vertical
        st.spacing = 8
        st.translatesAutoresizingMaskIntoConstraints = false
        
        v.addSubview(st)
        NSLayoutConstraint.activate([
            st.topAnchor.constraint(equalTo: v.topAnchor, constant: 16),
            st.leadingAnchor.constraint(equalTo: v.leadingAnchor, constant: 16),
            st.trailingAnchor.constraint(equalTo: v.trailingAnchor, constant: -16),
            st.bottomAnchor.constraint(lessThanOrEqualTo: v.bottomAnchor, constant: -16)
        ])
        
        return v
    }
    
    private func setupCTA() {
        ctaCard.backgroundColor = UIColor(hex: "#2F5C46")
        ctaCard.layer.cornerRadius = 16
        ctaCard.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(ctaCard)
        
        let stack = UIStackView()
        stack.axis = .horizontal
        stack.alignment = .center
        stack.spacing = 16
        stack.translatesAutoresizingMaskIntoConstraints = false
        ctaCard.addSubview(stack)
        
        let txtStack = UIStackView()
        txtStack.axis = .vertical
        txtStack.spacing = 4
        
        let t = UILabel()
        t.text = "Need Expert Advice?"
        t.font = DesignSystem.Fonts.bold(size: 16)
        t.textColor = .white
        
        let s = UILabel()
        s.text = "Our consultants are ready."
        s.font = DesignSystem.Fonts.regular(size: 13)
        s.textColor = UIColor(white: 0.9, alpha: 1)
        
        txtStack.addArrangedSubview(t)
        txtStack.addArrangedSubview(s)
        
        let btn = UIButton(type: .system)
        btn.setTitle("Call Now", for: .normal)
        btn.setTitleColor(UIColor(hex: "#2F5C46"), for: .normal)
        btn.backgroundColor = .white
        btn.layer.cornerRadius = 8
        btn.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
        btn.contentEdgeInsets = UIEdgeInsets(top: 8, left: 16, bottom: 8, right: 16)
        btn.widthAnchor.constraint(equalToConstant: 100).isActive = true
        btn.addTarget(self, action: #selector(handleCallNow), for: .touchUpInside)
        
        stack.addArrangedSubview(txtStack)
        stack.addArrangedSubview(btn)
        
        NSLayoutConstraint.activate([
            ctaCard.topAnchor.constraint(equalTo: clientStoriesScrollView.bottomAnchor, constant: 24),
            ctaCard.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            ctaCard.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            ctaCard.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -40),
            
            stack.topAnchor.constraint(equalTo: ctaCard.topAnchor, constant: 24),
            stack.leadingAnchor.constraint(equalTo: ctaCard.leadingAnchor, constant: 24),
            stack.trailingAnchor.constraint(equalTo: ctaCard.trailingAnchor, constant: -24),
            stack.bottomAnchor.constraint(equalTo: ctaCard.bottomAnchor, constant: -24)
        ])
    }
    
    private func createSectionHeader(title: String, showSeeAll: Bool) -> UIView {
        let v = UIView()
        v.translatesAutoresizingMaskIntoConstraints = false
        
        let t = UILabel()
        t.text = title
        t.font = DesignSystem.Fonts.bold(size: 18)
        t.translatesAutoresizingMaskIntoConstraints = false
        v.addSubview(t)
        
        NSLayoutConstraint.activate([
            t.leadingAnchor.constraint(equalTo: v.leadingAnchor),
            t.centerYAnchor.constraint(equalTo: v.centerYAnchor)
        ])
        
        if showSeeAll {
            let b = UIButton(type: .system)
            b.setTitle("See All", for: .normal)
            b.setTitleColor(UIColor(hex: "#2F5C46"), for: .normal)
            b.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
            b.translatesAutoresizingMaskIntoConstraints = false
            b.addTarget(self, action: #selector(handleSeeAllTap), for: .touchUpInside)
            v.addSubview(b)
            
            NSLayoutConstraint.activate([
                b.trailingAnchor.constraint(equalTo: v.trailingAnchor),
                b.centerYAnchor.constraint(equalTo: v.centerYAnchor)
            ])
        }
        
        v.heightAnchor.constraint(equalToConstant: 30).isActive = true
        return v
    }
    
    // MARK: - Handlers
    
    @objc private func handleProfileTap() {
        let profileVC = ProfileViewController()
        navigationController?.pushViewController(profileVC, animated: true)
    }
    
    @objc private func handleSeeAllTap() {
         if let tabBar = self.tabBarController {
             tabBar.selectedIndex = 1
         } else {
             navigationController?.pushViewController(ServicesViewController(), animated: true)
         }
    }
    
    @objc private func handleServiceTap(_ sender: UITapGestureRecognizer) {
        guard let view = sender.view, let title = view.accessibilityIdentifier else { return }
        let detailVC = ServiceDetailViewController(title: title, description: "Details about \(title)")
        navigationController?.pushViewController(detailVC, animated: true)
    }
    
    @objc private func handleCallNow() {
        let consultVC = ConsultViewController()
        navigationController?.pushViewController(consultVC, animated: true)
    }
    
    private func loadUserData() {
        userNameLabel.text = SessionManager.shared.getUserName() ?? "Let's handle your business"
    }
}
