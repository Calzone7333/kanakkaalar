import UIKit

class ServicesViewController: UIViewController {

    private let searchContainer = UIView()
    private let searchField = UITextField()
    private let categoriesCollectionView: UICollectionView
    private let servicesCollectionView: UICollectionView
    
    private var allServices: [ServiceItem] = []
    private var displayedServices: [ServiceItem] = []
    private var categories: [String] = []
    private var currentCategory = "All"
    
    struct ServiceItem {
        let title: String
        let desc: String
        let category: String
        let bgColor: UIColor
        let textColor: UIColor
        let iconName: String
    }
    
    init() {
        let catLayout = UICollectionViewFlowLayout()
        catLayout.scrollDirection = .horizontal
        catLayout.estimatedItemSize = UICollectionViewFlowLayout.automaticSize
        catLayout.sectionInset = UIEdgeInsets(top: 0, left: 16, bottom: 0, right: 16)
        categoriesCollectionView = UICollectionView(frame: .zero, collectionViewLayout: catLayout)
        
        let servLayout = UICollectionViewFlowLayout()
        servLayout.scrollDirection = .vertical
        servLayout.minimumInteritemSpacing = 16
        servLayout.minimumLineSpacing = 16
        servLayout.sectionInset = UIEdgeInsets(top: 16, left: 16, bottom: 16, right: 16)
        servicesCollectionView = UICollectionView(frame: .zero, collectionViewLayout: servLayout)
        
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) { fatalError() }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Services"
        
        setupUI()
        loadData()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: animated)
    }
    
    private func setupUI() {
        // Search
        searchContainer.backgroundColor = .white
        searchContainer.layer.cornerRadius = 8
        searchContainer.layer.borderWidth = 1
        searchContainer.layer.borderColor = UIColor.systemGray5.cgColor
        searchContainer.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(searchContainer)
        
        let searchIcon = UIImageView(image: UIImage(systemName: "magnifyingglass"))
        searchIcon.tintColor = .gray
        searchIcon.translatesAutoresizingMaskIntoConstraints = false
        searchContainer.addSubview(searchIcon)
        
        searchField.placeholder = "Search Services..."
        searchField.font = DesignSystem.Fonts.regular(size: 14)
        searchField.addTarget(self, action: #selector(handleSearchChanged), for: .editingChanged)
        searchField.translatesAutoresizingMaskIntoConstraints = false
        searchContainer.addSubview(searchField)
        
        // Categories
        categoriesCollectionView.backgroundColor = .clear
        categoriesCollectionView.showsHorizontalScrollIndicator = false
        categoriesCollectionView.delegate = self
        categoriesCollectionView.dataSource = self
        categoriesCollectionView.register(CategoryCell.self, forCellWithReuseIdentifier: "CategoryCell")
        categoriesCollectionView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(categoriesCollectionView)
        
        // Services
        servicesCollectionView.backgroundColor = .clear
        servicesCollectionView.delegate = self
        servicesCollectionView.dataSource = self
        servicesCollectionView.register(ServiceGridCell.self, forCellWithReuseIdentifier: "ServiceGridCell")
        servicesCollectionView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(servicesCollectionView)
        
        NSLayoutConstraint.activate([
            searchContainer.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            searchContainer.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            searchContainer.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            searchContainer.heightAnchor.constraint(equalToConstant: 44),
            
            searchIcon.leadingAnchor.constraint(equalTo: searchContainer.leadingAnchor, constant: 12),
            searchIcon.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor),
            searchIcon.widthAnchor.constraint(equalToConstant: 20),
            searchIcon.heightAnchor.constraint(equalToConstant: 20),
            
            searchField.leadingAnchor.constraint(equalTo: searchIcon.trailingAnchor, constant: 8),
            searchField.trailingAnchor.constraint(equalTo: searchContainer.trailingAnchor, constant: -12),
            searchField.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor),
            searchField.heightAnchor.constraint(equalToConstant: 40),
            
            categoriesCollectionView.topAnchor.constraint(equalTo: searchContainer.bottomAnchor, constant: 16),
            categoriesCollectionView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            categoriesCollectionView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            categoriesCollectionView.heightAnchor.constraint(equalToConstant: 40),
            
            servicesCollectionView.topAnchor.constraint(equalTo: categoriesCollectionView.bottomAnchor, constant: 8),
            servicesCollectionView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            servicesCollectionView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            servicesCollectionView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func loadData() {
        categories = ["All", "Licenses", "IP & Trademark", "Company", "Tax & Compliance", "New Business"]
        
        allServices = [
            // Licenses
            ServiceItem(title: "GST Registration", desc: "Starts from ₹499", category: "Licenses", bgColor: UIColor(hex: "#E0F2FE"), textColor: UIColor(hex: "#0369A1"), iconName: "doc.text"),
            ServiceItem(title: "MSME Registration", desc: "Starts from ₹699", category: "Licenses", bgColor: UIColor(hex: "#E0F2FE"), textColor: UIColor(hex: "#0369A1"), iconName: "building.2"),
            ServiceItem(title: "Food License (FSSAI)", desc: "Contact for Price", category: "Licenses", bgColor: UIColor(hex: "#E0F2FE"), textColor: UIColor(hex: "#0369A1"), iconName: "leaf"),
            ServiceItem(title: "Digital Signature", desc: "Starts from ₹847", category: "Licenses", bgColor: UIColor(hex: "#E0F2FE"), textColor: UIColor(hex: "#0369A1"), iconName: "signature"),
            ServiceItem(title: "Trade License", desc: "Starts from ₹999", category: "Licenses", bgColor: UIColor(hex: "#E0F2FE"), textColor: UIColor(hex: "#0369A1"), iconName: "doc.plaintext"),
            ServiceItem(title: "Import Export Code", desc: "Starts from ₹249", category: "Licenses", bgColor: UIColor(hex: "#E0F2FE"), textColor: UIColor(hex: "#0369A1"), iconName: "globe"),
            ServiceItem(title: "ISO Certification", desc: "Contact for Price", category: "Licenses", bgColor: UIColor(hex: "#E0F2FE"), textColor: UIColor(hex: "#0369A1"), iconName: "checkmark.seal"),
            
            // IP & Trademark
            ServiceItem(title: "Trademark Reg", desc: "Starts from ₹1349", category: "IP & Trademark", bgColor: UIColor(hex: "#F3E8FF"), textColor: UIColor(hex: "#7E22CE"), iconName: "r.circle"),
            ServiceItem(title: "Trademark Objection", desc: "Starts from ₹2999", category: "IP & Trademark", bgColor: UIColor(hex: "#F3E8FF"), textColor: UIColor(hex: "#7E22CE"), iconName: "exclamationmark.shield"),
            ServiceItem(title: "Copyright Music", desc: "Starts from ₹499", category: "IP & Trademark", bgColor: UIColor(hex: "#F3E8FF"), textColor: UIColor(hex: "#7E22CE"), iconName: "music.note"),
            ServiceItem(title: "Patent Search", desc: "Starts from ₹1999", category: "IP & Trademark", bgColor: UIColor(hex: "#F3E8FF"), textColor: UIColor(hex: "#7E22CE"), iconName: "magnifyingglass"),
            ServiceItem(title: "Patent Registration", desc: "Starts from ₹5999", category: "IP & Trademark", bgColor: UIColor(hex: "#F3E8FF"), textColor: UIColor(hex: "#7E22CE"), iconName: "scroll"),
            
            // Company Change (Company)
            ServiceItem(title: "Change Name", desc: "Contact for Price", category: "Company", bgColor: UIColor(hex: "#DCFCE7"), textColor: UIColor(hex: "#15803D"), iconName: "pencil"),
            ServiceItem(title: "Add Director", desc: "Contact for Price", category: "Company", bgColor: UIColor(hex: "#DCFCE7"), textColor: UIColor(hex: "#15803D"), iconName: "person.badge.plus"),
            ServiceItem(title: "Remove Director", desc: "Contact for Price", category: "Company", bgColor: UIColor(hex: "#DCFCE7"), textColor: UIColor(hex: "#15803D"), iconName: "person.badge.minus"),
            ServiceItem(title: "Change Address", desc: "Contact for Price", category: "Company", bgColor: UIColor(hex: "#DCFCE7"), textColor: UIColor(hex: "#15803D"), iconName: "map"),
            ServiceItem(title: "Transfer Shares", desc: "Contact for Price", category: "Company", bgColor: UIColor(hex: "#DCFCE7"), textColor: UIColor(hex: "#15803D"), iconName: "arrow.triangle.2.circlepath"),
            ServiceItem(title: "Increase Capital", desc: "Contact for Price", category: "Company", bgColor: UIColor(hex: "#DCFCE7"), textColor: UIColor(hex: "#15803D"), iconName: "indianrupeesign.circle"),
            
            // Tax & Compliance
            ServiceItem(title: "ITR Filing", desc: "Contact for Price", category: "Tax & Compliance", bgColor: UIColor(hex: "#FFEDD5"), textColor: UIColor(hex: "#C2410C"), iconName: "doc.text.fill"),
            ServiceItem(title: "TDS Return", desc: "Contact for Price", category: "Tax & Compliance", bgColor: UIColor(hex: "#FFEDD5"), textColor: UIColor(hex: "#C2410C"), iconName: "percent"),
            ServiceItem(title: "GST Filing", desc: "Starts from ₹2999", category: "Tax & Compliance", bgColor: UIColor(hex: "#FFEDD5"), textColor: UIColor(hex: "#C2410C"), iconName: "doc.plaintext.fill"),
            ServiceItem(title: "Annual Compliance", desc: "Contact for Price", category: "Tax & Compliance", bgColor: UIColor(hex: "#FFEDD5"), textColor: UIColor(hex: "#C2410C"), iconName: "calendar"),
            ServiceItem(title: "Payroll", desc: "Contact for Price", category: "Tax & Compliance", bgColor: UIColor(hex: "#FFEDD5"), textColor: UIColor(hex: "#C2410C"), iconName: "banknote"),
            ServiceItem(title: "Due Diligence", desc: "Starts from ₹999", category: "Tax & Compliance", bgColor: UIColor(hex: "#FFEDD5"), textColor: UIColor(hex: "#C2410C"), iconName: "checkmark.shield.fill"),
            
            // New Business
            ServiceItem(title: "Pvt Ltd Company", desc: "Starts from ₹999", category: "New Business", bgColor: UIColor(hex: "#FFE4E6"), textColor: UIColor(hex: "#BE123C"), iconName: "building.2.fill"),
            ServiceItem(title: "LLP Registration", desc: "Starts from ₹1499", category: "New Business", bgColor: UIColor(hex: "#FFE4E6"), textColor: UIColor(hex: "#BE123C"), iconName: "building.columns"),
            ServiceItem(title: "Sole Proprietorship", desc: "Starts from ₹699", category: "New Business", bgColor: UIColor(hex: "#FFE4E6"), textColor: UIColor(hex: "#BE123C"), iconName: "person.fill"),
            ServiceItem(title: "One Person Company", desc: "Starts from ₹999", category: "New Business", bgColor: UIColor(hex: "#FFE4E6"), textColor: UIColor(hex: "#BE123C"), iconName: "person.crop.circle.fill"),
            ServiceItem(title: "Partnership Firm", desc: "Starts from ₹2499", category: "New Business", bgColor: UIColor(hex: "#FFE4E6"), textColor: UIColor(hex: "#BE123C"), iconName: "person.2.fill"),
            ServiceItem(title: "Section 8 NGO", desc: "Starts from ₹999", category: "New Business", bgColor: UIColor(hex: "#FFE4E6"), textColor: UIColor(hex: "#BE123C"), iconName: "heart.fill")
        ]
        
        applyFilters()
    }
    
    @objc private func handleSearchChanged() {
        applyFilters()
    }
    
    private func applyFilters() {
        let query = searchField.text?.lowercased() ?? ""
        displayedServices = allServices.filter { item in
            let matchesCategory = currentCategory == "All" || item.category == currentCategory
            let matchesQuery = query.isEmpty || item.title.lowercased().contains(query)
            return matchesCategory && matchesQuery
        }
        servicesCollectionView.reloadData()
    }
}

extension ServicesViewController: UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {
    
    // MARK: - Collection View
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        if collectionView == categoriesCollectionView {
            return categories.count
        } else {
            return displayedServices.count
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        if collectionView == categoriesCollectionView {
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "CategoryCell", for: indexPath) as! CategoryCell
            let category = categories[indexPath.item]
            cell.configure(with: category, isSelected: category == currentCategory)
            return cell
        } else {
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "ServiceGridCell", for: indexPath) as! ServiceGridCell
            cell.configure(with: displayedServices[indexPath.item])
            return cell
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        if collectionView == categoriesCollectionView {
            currentCategory = categories[indexPath.item]
            categoriesCollectionView.reloadData()
            applyFilters()
        } else {
            let item = displayedServices[indexPath.item]
            let detailVC = ServiceDetailViewController(title: item.title, description: item.desc, category: item.category)
            navigationController?.pushViewController(detailVC, animated: true)
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        if collectionView == categoriesCollectionView {
            return CGSize(width: 80, height: 32)
        } else {
            let width = (collectionView.bounds.width - 48) / 2 // 2 columns, 16 spacing * 3
            return CGSize(width: width, height: 130)
        }
    }
}

// MARK: - Cells

class CategoryCell: UICollectionViewCell {
    private let label = UILabel()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        contentView.layer.cornerRadius = 16
        contentView.layer.borderWidth = 1
        
        label.font = DesignSystem.Fonts.medium(size: 12)
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(label)
        
        NSLayoutConstraint.activate([
            label.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 12),
            label.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -12),
            label.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            
            contentView.heightAnchor.constraint(equalToConstant: 32)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with text: String, isSelected: Bool) {
        label.text = text
        if isSelected {
            contentView.backgroundColor = DesignSystem.Colors.primary
            contentView.layer.borderColor = DesignSystem.Colors.primary.cgColor
            label.textColor = .white
        } else {
            contentView.backgroundColor = .white
            contentView.layer.borderColor = UIColor.systemGray4.cgColor
            label.textColor = DesignSystem.Colors.textSecondary
        }
    }
    
    override func preferredLayoutAttributesFitting(_ layoutAttributes: UICollectionViewLayoutAttributes) -> UICollectionViewLayoutAttributes {
        let attributes = super.preferredLayoutAttributesFitting(layoutAttributes)
        // Adjust width dynamically based on text
        let size = label.systemLayoutSizeFitting(UIView.layoutFittingCompressedSize)
        attributes.frame.size.width = size.width + 24
        return attributes
    }
}

class ServiceGridCell: UICollectionViewCell {
    private let containerView = UIView()
    private let iconView = UIImageView()
    private let titleLabel = UILabel()
    private let priceLabel = UILabel()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        containerView.layer.cornerRadius = 12
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        iconView.contentMode = .scaleAspectFit
        iconView.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(iconView)
        
        titleLabel.font = DesignSystem.Fonts.bold(size: 14)
        titleLabel.numberOfLines = 2
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(titleLabel)
        
        priceLabel.font = DesignSystem.Fonts.regular(size: 11)
        priceLabel.numberOfLines = 1
        priceLabel.textAlignment = .center
        priceLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(priceLabel)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor),
            
            iconView.centerXAnchor.constraint(equalTo: containerView.centerXAnchor),
            iconView.centerYAnchor.constraint(equalTo: containerView.centerYAnchor, constant: -20),
            iconView.widthAnchor.constraint(equalToConstant: 36),
            iconView.heightAnchor.constraint(equalToConstant: 36),
            
            titleLabel.topAnchor.constraint(equalTo: iconView.bottomAnchor, constant: 12),
            titleLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 8),
            titleLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -8),
            
            priceLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            priceLabel.centerXAnchor.constraint(equalTo: containerView.centerXAnchor)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with item: ServicesViewController.ServiceItem) {
        containerView.backgroundColor = item.bgColor
        iconView.image = UIImage(systemName: item.iconName)
        iconView.tintColor = item.textColor
        titleLabel.textColor = item.textColor
        titleLabel.text = item.title
        priceLabel.textColor = item.textColor.withAlphaComponent(0.8)
        priceLabel.text = item.desc
    }
}
