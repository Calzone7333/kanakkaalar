import UIKit

class DocumentUploadViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Upload Zone
    private let uploadZone = UIView()
    private let uploadIcon = UIImageView()
    private let uploadLabel = UILabel()
    
    // List
    private let tableView = UITableView()
    
    // Mock Data
    private struct UploadItem {
        let name: String
        let meta: String
        let progress: Float
        let isCompleted: Bool
    }
    
    private var uploads: [UploadItem] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Upload Documents"
        
        setupUI()
        loadData()
    }
    
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        // Upload Zone
        uploadZone.backgroundColor = .white
        uploadZone.layer.cornerRadius = 12
        uploadZone.layer.borderWidth = 1
        uploadZone.layer.borderColor = DesignSystem.Colors.textSecondary.withAlphaComponent(0.3).cgColor
        uploadZone.layer.masksToBounds = true
        uploadZone.translatesAutoresizingMaskIntoConstraints = false
        
        // Dotted Border visual simulation or just standard border
        let borderLayer = CAShapeLayer()
        borderLayer.strokeColor = DesignSystem.Colors.primary.withAlphaComponent(0.5).cgColor
        borderLayer.lineDashPattern = [6, 4]
        borderLayer.fillColor = nil
        borderLayer.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: view.bounds.width - 48, height: 120), cornerRadius: 12).cgPath
        // Note: Frame calculation in viewDidLoad is tricky for layers, relying on standard border for now
        
        uploadIcon.image = UIImage(systemName: "icloud.and.arrow.up")
        uploadIcon.tintColor = DesignSystem.Colors.primary
        uploadIcon.translatesAutoresizingMaskIntoConstraints = false
        
        uploadLabel.text = "Tap to browse files to upload"
        uploadLabel.font = DesignSystem.Fonts.bold(size: 16)
        uploadLabel.textColor = DesignSystem.Colors.textSecondary
        uploadLabel.translatesAutoresizingMaskIntoConstraints = false
        
        uploadZone.addSubview(uploadIcon)
        uploadZone.addSubview(uploadLabel)
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(handleBrowse))
        uploadZone.addGestureRecognizer(tap)
        uploadZone.isUserInteractionEnabled = true
        
        contentView.addSubview(uploadZone)
        
        // TableView
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(DocumentUploadCell.self, forCellReuseIdentifier: "DocumentUploadCell")
        tableView.separatorStyle = .none
        tableView.backgroundColor = .clear
        tableView.isScrollEnabled = false
        tableView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(tableView)
        
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            uploadZone.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 24),
            uploadZone.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            uploadZone.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            uploadZone.heightAnchor.constraint(equalToConstant: 120),
            
            uploadIcon.centerXAnchor.constraint(equalTo: uploadZone.centerXAnchor),
            uploadIcon.centerYAnchor.constraint(equalTo: uploadZone.centerYAnchor, constant: -16),
            uploadIcon.widthAnchor.constraint(equalToConstant: 40),
            uploadIcon.heightAnchor.constraint(equalToConstant: 40),
            
            uploadLabel.topAnchor.constraint(equalTo: uploadIcon.bottomAnchor, constant: 12),
            uploadLabel.centerXAnchor.constraint(equalTo: uploadZone.centerXAnchor),
            
            tableView.topAnchor.constraint(equalTo: uploadZone.bottomAnchor, constant: 24),
            tableView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -24),
            tableView.heightAnchor.constraint(equalToConstant: 300) // Estimate
        ])
    }
    
    private func loadData() {
        uploads = [
            UploadItem(name: "Company_budget.xls", meta: "Date: 2023-10-27  Size: 20 MB", progress: 0.53, isCompleted: false),
            UploadItem(name: "Registration.csv", meta: "Date: 2023-10-27  Size: 20 MB", progress: 1.0, isCompleted: true)
        ]
        tableView.reloadData()
    }
    
    @objc private func handleBrowse() {
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: [.item])
        picker.delegate = self
        picker.modalPresentationStyle = .formSheet
        present(picker, animated: true)
    }
}

extension DocumentUploadViewController: UIDocumentPickerDelegate {
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        guard let url = urls.first else { return }
        // Simulate Upload Start
        let newItem = UploadItem(name: url.lastPathComponent, meta: "Size: Calculating...", progress: 0.1, isCompleted: false)
        uploads.insert(newItem, at: 0)
        tableView.reloadData()
    }
}

extension DocumentUploadViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return uploads.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "DocumentUploadCell", for: indexPath) as! DocumentUploadCell
        cell.configure(with: uploads[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 80
    }
}

class DocumentUploadCell: UITableViewCell {
    private let containerView = UIView()
    private let iconView = UIImageView()
    private let titleLabel = UILabel()
    private let metaLabel = UILabel()
    private let progressView = UIProgressView(progressViewStyle: .default)
    private let statusLabel = UILabel()
    private let checkIcon = UIImageView()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        selectionStyle = .none
        
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 8
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        iconView.image = UIImage(systemName: "doc.fill")
        iconView.tintColor = DesignSystem.Colors.secondary
        iconView.contentMode = .scaleAspectFit
        iconView.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(iconView)
        
        titleLabel.font = DesignSystem.Fonts.bold(size: 14)
        titleLabel.textColor = DesignSystem.Colors.textPrimary
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(titleLabel)
        
        metaLabel.font = DesignSystem.Fonts.regular(size: 12)
        metaLabel.textColor = DesignSystem.Colors.textSecondary
        metaLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(metaLabel)
        
        progressView.trackTintColor = .systemGray5
        progressView.progressTintColor = DesignSystem.Colors.primary
        progressView.layer.cornerRadius = 2
        progressView.clipsToBounds = true
        progressView.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(progressView)
        
        statusLabel.text = "Uploading..."
        statusLabel.font = DesignSystem.Fonts.regular(size: 12)
        statusLabel.textColor = DesignSystem.Colors.primary
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(statusLabel)
        
        checkIcon.image = UIImage(systemName: "checkmark.circle.fill")
        checkIcon.tintColor = .systemGreen
        checkIcon.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(checkIcon)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            iconView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 12),
            iconView.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            iconView.widthAnchor.constraint(equalToConstant: 32),
            iconView.heightAnchor.constraint(equalToConstant: 32),
            
            titleLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            titleLabel.leadingAnchor.constraint(equalTo: iconView.trailingAnchor, constant: 12),
            titleLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -40),
            
            metaLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            metaLabel.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor),
            
            progressView.topAnchor.constraint(equalTo: metaLabel.bottomAnchor, constant: 8),
            progressView.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor),
            progressView.trailingAnchor.constraint(equalTo: titleLabel.trailingAnchor),
            progressView.heightAnchor.constraint(equalToConstant: 4),
            
            statusLabel.centerYAnchor.constraint(equalTo: metaLabel.centerYAnchor),
            statusLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -12),
            
            checkIcon.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            checkIcon.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -12),
            checkIcon.widthAnchor.constraint(equalToConstant: 24),
            checkIcon.heightAnchor.constraint(equalToConstant: 24)
        ])
    }
    
    required init?(coder: NSCoder) { fatalError() }
    
    func configure(with item: UploadItem) {
        titleLabel.text = item.name
        metaLabel.text = item.meta
        
        if item.isCompleted {
            progressView.isHidden = true
            statusLabel.isHidden = true
            checkIcon.isHidden = false
        } else {
            progressView.isHidden = false
            progressView.progress = item.progress
            statusLabel.isHidden = false
            checkIcon.isHidden = true
        }
    }
}
