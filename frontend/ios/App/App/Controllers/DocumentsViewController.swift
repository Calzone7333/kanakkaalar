import UIKit
import MobileCoreServices
import UniformTypeIdentifiers

class DocumentsViewController: UIViewController {

    // MARK: - Properties
    
    private let tableView = UITableView()
    private let uploadButton = UIButton(type: .system)
    private var documents: [DocumentModel] = []
    
    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "My Documents"
        view.backgroundColor = DesignSystem.Colors.windowBackground
        
        setupUI()
        fetchDocuments()
    }
    
    // MARK: - Setup
    
    private func setupUI() {
        // Upload Button Header
        let headerView = UIView()
        headerView.backgroundColor = .white
        headerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(headerView)
        
        uploadButton.setTitle("+ Upload Document", for: .normal)
        uploadButton.backgroundColor = DesignSystem.Colors.primary
        uploadButton.setTitleColor(.white, for: .normal)
        uploadButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 14)
        uploadButton.layer.cornerRadius = 8
        uploadButton.translatesAutoresizingMaskIntoConstraints = false
        uploadButton.addTarget(self, action: #selector(handleUploadTap), for: .touchUpInside)
        headerView.addSubview(uploadButton)
        
        // TableView
        tableView.delegate = self
        tableView.dataSource = self
        tableView.backgroundColor = DesignSystem.Colors.windowBackground
        tableView.separatorStyle = .none
        tableView.register(DocumentCell.self, forCellReuseIdentifier: DocumentCell.identifier)
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        
        NSLayoutConstraint.activate([
            headerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            headerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            headerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            headerView.heightAnchor.constraint(equalToConstant: 70),
            
            uploadButton.centerYAnchor.constraint(equalTo: headerView.centerYAnchor),
            uploadButton.trailingAnchor.constraint(equalTo: headerView.trailingAnchor, constant: -16),
            uploadButton.leadingAnchor.constraint(equalTo: headerView.leadingAnchor, constant: 16),
            uploadButton.heightAnchor.constraint(equalToConstant: 44),
            
            tableView.topAnchor.constraint(equalTo: headerView.bottomAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    // MARK: - Logic
    
    private func fetchDocuments() {
        // Mock Data simulation of listMyDocs API
        // In real app: APIService.shared.fetchDocuments { ... }
        documents = [
            DocumentModel(id: "1", name: "PAN Card.pdf", size: "2.1 MB", date: "2024-12-01"),
            DocumentModel(id: "2", name: "Aadhar_Front.jpg", size: "1.5 MB", date: "2024-12-02"),
            DocumentModel(id: "3", name: "Incorporation_Cert.pdf", size: "5.4 MB", date: "2024-12-05")
        ]
        tableView.reloadData()
    }
    
    @objc private func handleUploadTap() {
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: [UTType.pdf, UTType.image], asCopy: true)
        picker.delegate = self
        picker.allowsMultipleSelection = false
        present(picker, animated: true)
    }
    
    private func uploadFile(url: URL) {
        let alert = UIAlertController(title: "Uploading", message: "Uploading \(url.lastPathComponent)...", preferredStyle: .alert)
        present(alert, animated: true)
        
        // Simulate API delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            alert.dismiss(animated: true) {
                let newDoc = DocumentModel(id: UUID().uuidString, name: url.lastPathComponent, size: "1.2 MB", date: "Just now")
                self.documents.insert(newDoc, at: 0)
                self.tableView.reloadData()
                self.showToast(message: "Upload Successful")
            }
        }
    }
    
    private func deleteDocument(at indexPath: IndexPath) {
        let doc = documents[indexPath.row]
        let alert = UIAlertController(title: "Delete", message: "Are you sure you want to delete \(doc.name)?", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Delete", style: .destructive, handler: { _ in
            // Simulate API
            self.documents.remove(at: indexPath.row)
            self.tableView.deleteRows(at: [indexPath], with: .automatic)
        }))
        present(alert, animated: true)
    }
    
    private func downloadDocument(doc: DocumentModel) {
        // Simulate download
        let alert = UIAlertController(title: "Downloading", message: "Saving \(doc.name) to Files...", preferredStyle: .alert)
        present(alert, animated: true)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            alert.dismiss(animated: true) {
                self.showToast(message: "Saved to Downloads")
            }
        }
    }
    
    private func showToast(message: String) {
        let toast = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        present(toast, animated: true)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            toast.dismiss(animated: true)
        }
    }
}

// MARK: - Delegates
extension DocumentsViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return documents.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: DocumentCell.identifier, for: indexPath) as! DocumentCell
        let doc = documents[indexPath.row]
        cell.configure(doc: doc)
        
        cell.downloadAction = { [weak self] in
            self?.downloadDocument(doc: doc)
        }
        
        cell.deleteAction = { [weak self] in
            self?.deleteDocument(at: indexPath)
        }
        
        return cell
    }
}

extension DocumentsViewController: UIDocumentPickerDelegate {
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        if let url = urls.first {
            uploadFile(url: url)
        }
    }
}

// MARK: - Model & Cell
struct DocumentModel {
    let id: String
    let name: String
    let size: String
    let date: String
}

class DocumentCell: UITableViewCell {
    static let identifier = "DocumentCell"
    
    var downloadAction: (() -> Void)?
    var deleteAction: (() -> Void)?
    
    private let containerView = UIView()
    private let iconView = UIImageView()
    private let nameLabel = UILabel()
    private let metaLabel = UILabel()
    private let downloadButton = UIButton(type: .system)
    private let deleteButton = UIButton(type: .system)
    
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
        containerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(containerView)
        
        iconView.image = UIImage(systemName: "doc.fill")
        iconView.tintColor = DesignSystem.Colors.primary
        iconView.translatesAutoresizingMaskIntoConstraints = false
        
        nameLabel.font = DesignSystem.Fonts.bold(size: 14)
        nameLabel.textColor = DesignSystem.Colors.textPrimary
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        
        metaLabel.font = DesignSystem.Fonts.regular(size: 12)
        metaLabel.textColor = DesignSystem.Colors.textTertiary
        metaLabel.translatesAutoresizingMaskIntoConstraints = false
        
        downloadButton.setImage(UIImage(systemName: "arrow.down.circle"), for: .normal)
        downloadButton.tintColor = DesignSystem.Colors.success
        downloadButton.translatesAutoresizingMaskIntoConstraints = false
        downloadButton.addTarget(self, action: #selector(handleDownload), for: .touchUpInside)
        
        deleteButton.setImage(UIImage(systemName: "trash"), for: .normal)
        deleteButton.tintColor = DesignSystem.Colors.error
        deleteButton.translatesAutoresizingMaskIntoConstraints = false
        deleteButton.addTarget(self, action: #selector(handleDelete), for: .touchUpInside)
        
        containerView.addSubview(iconView)
        containerView.addSubview(nameLabel)
        containerView.addSubview(metaLabel)
        containerView.addSubview(downloadButton)
        containerView.addSubview(deleteButton)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 6),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6),
            
            iconView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            iconView.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            iconView.widthAnchor.constraint(equalToConstant: 24),
            iconView.heightAnchor.constraint(equalToConstant: 24),
            
            nameLabel.leadingAnchor.constraint(equalTo: iconView.trailingAnchor, constant: 12),
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            nameLabel.trailingAnchor.constraint(equalTo: downloadButton.leadingAnchor, constant: -8),
            
            metaLabel.leadingAnchor.constraint(equalTo: nameLabel.leadingAnchor),
            metaLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            metaLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12),
            
            deleteButton.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            deleteButton.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            deleteButton.widthAnchor.constraint(equalToConstant: 30),
            
            downloadButton.trailingAnchor.constraint(equalTo: deleteButton.leadingAnchor, constant: -8),
            downloadButton.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),
            downloadButton.widthAnchor.constraint(equalToConstant: 30)
        ])
    }
    
    func configure(doc: DocumentModel) {
        nameLabel.text = doc.name
        metaLabel.text = "Size: \(doc.size) • \(doc.date)"
    }
    
    @objc private func handleDownload() { downloadAction?() }
    @objc private func handleDelete() { deleteAction?() }
}
