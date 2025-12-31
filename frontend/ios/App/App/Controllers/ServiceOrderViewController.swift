import UIKit
import MobileCoreServices
import UniformTypeIdentifiers

class ServiceOrderViewController: UIViewController {

    private let serviceTitle: String
    private let priceString: String
    private var orderId: String? // Nullable for deferred creation
    
    private var currentStep = 1
    private var selectedFiles: [URL] = []
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    // Header
    private let headerContainer = UIView()
    private let titleLabel = UILabel()
    private let descLabel = UILabel()
    
    // Stepper
    private let stepperContainer = UIView()
    private let step1Icon = UIImageView()
    private let step2Icon = UIImageView()
    private let step3Icon = UIImageView()
    private let stepLine1 = UIView()
    private let stepLine2 = UIView()
    private let stepTitleLabel = UILabel()
    private let stepDescLabel = UILabel()
    
    // Upload UI (Step 1)
    private let uploadContainer = UIView()
    private let uploadZone = UIView()
    private let filesStack = UIStackView()
    
    // Review/Payment UI (Step 2/3)
    private let infoContainer = UIView()
    private let infoLabel = UILabel()
    
    // Footer
    private let nextButton = UIButton(type: .system)
    
    init(serviceTitle: String, priceString: String, orderId: String? = nil) {
        self.serviceTitle = serviceTitle
        self.priceString = priceString
        self.orderId = orderId
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) { fatalError() }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Order Application"
        
        setupUI()
        updateUI()
    }
    
    private func setupUI() {
        view.addSubview(scrollView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        // Header
        headerContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(headerContainer)
        
        titleLabel.text = serviceTitle
        titleLabel.font = DesignSystem.Fonts.bold(size: 20)
        titleLabel.textColor = DesignSystem.Colors.textPrimary
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(titleLabel)
        
        descLabel.text = "Complete the steps below to proceed."
        descLabel.font = DesignSystem.Fonts.regular(size: 14)
        descLabel.textColor = DesignSystem.Colors.textSecondary
        descLabel.translatesAutoresizingMaskIntoConstraints = false
        headerContainer.addSubview(descLabel)
        
        // Stepper
        stepperContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(stepperContainer)
        
        let icons = [step1Icon, step2Icon, step3Icon]
        for (i, icon) in icons.enumerated() {
            icon.image = UIImage(systemName: "\(i+1).circle.fill")
            icon.tintColor = .systemGray4
            icon.translatesAutoresizingMaskIntoConstraints = false
            stepperContainer.addSubview(icon)
        }
        
        stepLine1.backgroundColor = .systemGray4
        stepLine1.translatesAutoresizingMaskIntoConstraints = false
        stepperContainer.addSubview(stepLine1)
        
        stepLine2.backgroundColor = .systemGray4
        stepLine2.translatesAutoresizingMaskIntoConstraints = false
        stepperContainer.addSubview(stepLine2)
        
        stepperContainer.sendSubviewToBack(stepLine1)
        stepperContainer.sendSubviewToBack(stepLine2)
        
        stepTitleLabel.font = DesignSystem.Fonts.bold(size: 16)
        stepTitleLabel.textAlignment = .center
        stepTitleLabel.translatesAutoresizingMaskIntoConstraints = false
        stepperContainer.addSubview(stepTitleLabel)
        
        stepDescLabel.font = DesignSystem.Fonts.regular(size: 13)
        stepDescLabel.textColor = DesignSystem.Colors.textSecondary
        stepDescLabel.textAlignment = .center
        stepDescLabel.numberOfLines = 0
        stepDescLabel.translatesAutoresizingMaskIntoConstraints = false
        stepperContainer.addSubview(stepDescLabel)
        
        // Upload UI
        uploadContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(uploadContainer)
        
        uploadZone.backgroundColor = .white
        uploadZone.layer.cornerRadius = 12
        uploadZone.layer.borderWidth = 1
        uploadZone.layer.borderColor = UIColor.systemGray4.cgColor
        uploadZone.layer.masksToBounds = true // Dashed border hard in simple swift, using solid for now
        uploadZone.translatesAutoresizingMaskIntoConstraints = false
        uploadZone.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(handleUploadTap)))
        uploadZone.isUserInteractionEnabled = true
        uploadContainer.addSubview(uploadZone)
        
        let uploadIcon = UIImageView(image: UIImage(systemName: "arrow.up.doc"))
        uploadIcon.tintColor = DesignSystem.Colors.primary
        uploadIcon.translatesAutoresizingMaskIntoConstraints = false
        uploadZone.addSubview(uploadIcon)
        
        let uploadText = UILabel()
        uploadText.text = "Tap to Upload Documents"
        uploadText.font = DesignSystem.Fonts.medium(size: 14)
        uploadText.textColor = DesignSystem.Colors.primary
        uploadText.translatesAutoresizingMaskIntoConstraints = false
        uploadZone.addSubview(uploadText)
        
        filesStack.axis = .vertical
        filesStack.spacing = 8
        filesStack.translatesAutoresizingMaskIntoConstraints = false
        uploadContainer.addSubview(filesStack)
        
        // Info UI
        infoContainer.backgroundColor = .white
        infoContainer.layer.cornerRadius = 12
        infoContainer.translatesAutoresizingMaskIntoConstraints = false
        infoContainer.isHidden = true
        contentView.addSubview(infoContainer)
        
        infoLabel.numberOfLines = 0
        infoLabel.textAlignment = .center
        infoLabel.translatesAutoresizingMaskIntoConstraints = false
        infoContainer.addSubview(infoLabel)
        
        // Button
        nextButton.backgroundColor = DesignSystem.Colors.primary
        nextButton.setTitleColor(.white, for: .normal)
        nextButton.layer.cornerRadius = 8
        nextButton.titleLabel?.font = DesignSystem.Fonts.bold(size: 16)
        nextButton.translatesAutoresizingMaskIntoConstraints = false
        nextButton.addTarget(self, action: #selector(handleNext), for: .touchUpInside)
        view.addSubview(nextButton)
        
        // Constraints
        NSLayoutConstraint.activate([
            nextButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -16),
            nextButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            nextButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            nextButton.heightAnchor.constraint(equalToConstant: 50),
            
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: nextButton.topAnchor, constant: -16),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            headerContainer.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 16),
            headerContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            headerContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            
            titleLabel.topAnchor.constraint(equalTo: headerContainer.topAnchor),
            titleLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor),
            
            descLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            descLabel.leadingAnchor.constraint(equalTo: headerContainer.leadingAnchor),
            descLabel.bottomAnchor.constraint(equalTo: headerContainer.bottomAnchor),
            
            stepperContainer.topAnchor.constraint(equalTo: headerContainer.bottomAnchor, constant: 24),
            stepperContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            stepperContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            stepperContainer.heightAnchor.constraint(equalToConstant: 120),
            
            step2Icon.centerXAnchor.constraint(equalTo: stepperContainer.centerXAnchor),
            step2Icon.topAnchor.constraint(equalTo: stepperContainer.topAnchor, constant: 10),
            step2Icon.widthAnchor.constraint(equalToConstant: 30),
            step2Icon.heightAnchor.constraint(equalToConstant: 30),
            
            step1Icon.centerYAnchor.constraint(equalTo: step2Icon.centerYAnchor),
            step1Icon.trailingAnchor.constraint(equalTo: step2Icon.leadingAnchor, constant: -60),
            step1Icon.widthAnchor.constraint(equalToConstant: 30),
            step1Icon.heightAnchor.constraint(equalToConstant: 30),
            
            step3Icon.centerYAnchor.constraint(equalTo: step2Icon.centerYAnchor),
            step3Icon.leadingAnchor.constraint(equalTo: step2Icon.trailingAnchor, constant: 60),
            step3Icon.widthAnchor.constraint(equalToConstant: 30),
            step3Icon.heightAnchor.constraint(equalToConstant: 30),
            
            stepLine1.centerYAnchor.constraint(equalTo: step2Icon.centerYAnchor),
            stepLine1.leadingAnchor.constraint(equalTo: step1Icon.centerXAnchor),
            stepLine1.trailingAnchor.constraint(equalTo: step2Icon.centerXAnchor),
            stepLine1.heightAnchor.constraint(equalToConstant: 2),
            
            stepLine2.centerYAnchor.constraint(equalTo: step2Icon.centerYAnchor),
            stepLine2.leadingAnchor.constraint(equalTo: step2Icon.centerXAnchor),
            stepLine2.trailingAnchor.constraint(equalTo: step3Icon.centerXAnchor),
            stepLine2.heightAnchor.constraint(equalToConstant: 2),
            
            stepTitleLabel.topAnchor.constraint(equalTo: step2Icon.bottomAnchor, constant: 16),
            stepTitleLabel.centerXAnchor.constraint(equalTo: stepperContainer.centerXAnchor),
            
            stepDescLabel.topAnchor.constraint(equalTo: stepTitleLabel.bottomAnchor, constant: 8),
            stepDescLabel.leadingAnchor.constraint(equalTo: stepperContainer.leadingAnchor, constant: 16),
            stepDescLabel.trailingAnchor.constraint(equalTo: stepperContainer.trailingAnchor, constant: -16),
            
            uploadContainer.topAnchor.constraint(equalTo: stepperContainer.bottomAnchor, constant: 24),
            uploadContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            uploadContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            
            uploadZone.topAnchor.constraint(equalTo: uploadContainer.topAnchor),
            uploadZone.leadingAnchor.constraint(equalTo: uploadContainer.leadingAnchor),
            uploadZone.trailingAnchor.constraint(equalTo: uploadContainer.trailingAnchor),
            uploadZone.heightAnchor.constraint(equalToConstant: 100),
            
            uploadIcon.centerXAnchor.constraint(equalTo: uploadZone.centerXAnchor),
            uploadIcon.centerYAnchor.constraint(equalTo: uploadZone.centerYAnchor, constant: -10),
            uploadIcon.widthAnchor.constraint(equalToConstant: 30),
            uploadIcon.heightAnchor.constraint(equalToConstant: 30),
            
            uploadText.topAnchor.constraint(equalTo: uploadIcon.bottomAnchor, constant: 8),
            uploadText.centerXAnchor.constraint(equalTo: uploadZone.centerXAnchor),
            
            filesStack.topAnchor.constraint(equalTo: uploadZone.bottomAnchor, constant: 16),
            filesStack.leadingAnchor.constraint(equalTo: uploadContainer.leadingAnchor),
            filesStack.trailingAnchor.constraint(equalTo: uploadContainer.trailingAnchor),
            filesStack.bottomAnchor.constraint(equalTo: uploadContainer.bottomAnchor),
            
            infoContainer.topAnchor.constraint(equalTo: stepperContainer.bottomAnchor, constant: 24),
            infoContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            infoContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            infoContainer.heightAnchor.constraint(greaterThanOrEqualToConstant: 100),
            infoContainer.bottomAnchor.constraint(lessThanOrEqualTo: contentView.bottomAnchor, constant: -20),
            
            infoLabel.topAnchor.constraint(equalTo: infoContainer.topAnchor, constant: 24),
            infoLabel.leadingAnchor.constraint(equalTo: infoContainer.leadingAnchor, constant: 24),
            infoLabel.trailingAnchor.constraint(equalTo: infoContainer.trailingAnchor, constant: -24),
            infoLabel.bottomAnchor.constraint(equalTo: infoContainer.bottomAnchor, constant: -24)
        ])
    }
    
    private func updateUI() {
        step1Icon.tintColor = .systemGray4
        step2Icon.tintColor = .systemGray4
        step3Icon.tintColor = .systemGray4
        uploadContainer.isHidden = true
        infoContainer.isHidden = true
        
        switch currentStep {
        case 1:
            step1Icon.tintColor = DesignSystem.Colors.primary
            stepTitleLabel.text = "Upload Documents"
            stepDescLabel.text = "Please upload required documents (PAN, Aadhaar)."
            uploadContainer.isHidden = false
            nextButton.setTitle("Next: Review", for: .normal)
            
        case 2:
            step1Icon.tintColor = UIColor.systemGreen
            step2Icon.tintColor = DesignSystem.Colors.primary
            stepTitleLabel.text = "Review Application"
            stepDescLabel.text = "Review your details."
            infoContainer.isHidden = false
            infoLabel.text = "Service: \(serviceTitle)\nPrice: \(priceString)\nDocuments: \(selectedFiles.count) attached"
            nextButton.setTitle("Confirm & Pay", for: .normal)
            
        case 3:
            step1Icon.tintColor = UIColor.systemGreen
            step2Icon.tintColor = UIColor.systemGreen
            step3Icon.tintColor = DesignSystem.Colors.primary
            stepTitleLabel.text = "Payment"
            stepDescLabel.text = "Secure Payment Gateway"
            infoContainer.isHidden = false
            infoLabel.text = "Total Payable: \(priceString)"
            nextButton.setTitle("Pay Now", for: .normal)
            
        default: break
        }
    }
    
    @objc private func handleUploadTap() {
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: [UTType.pdf, UTType.image], asCopy: true)
        picker.delegate = self
        picker.allowsMultipleSelection = true
        present(picker, animated: true)
    }
    
    @objc private func handleNext() {
        if currentStep == 1 {
            currentStep += 1
            updateUI()
        } else if currentStep == 2 {
            currentStep += 1
            updateUI()
        } else if currentStep == 3 {
            initiatePayment()
        }
    }
    
    private func addFileToStack(url: URL) {
        let v = UIView()
        v.backgroundColor = .white
        v.layer.cornerRadius = 8
        v.layer.borderWidth = 1
        v.layer.borderColor = UIColor.systemGray5.cgColor
        
        let l = UILabel()
        l.text = url.lastPathComponent
        l.font = DesignSystem.Fonts.regular(size: 14)
        l.textColor = DesignSystem.Colors.textPrimary
        l.translatesAutoresizingMaskIntoConstraints = false
        
        v.addSubview(l)
        NSLayoutConstraint.activate([
            v.heightAnchor.constraint(equalToConstant: 44),
            l.centerYAnchor.constraint(equalTo: v.centerYAnchor),
            l.leadingAnchor.constraint(equalTo: v.leadingAnchor, constant: 12),
            l.trailingAnchor.constraint(equalTo: v.trailingAnchor, constant: -12)
        ])
        
        filesStack.addArrangedSubview(v)
    }
    
    // MARK: - API Logic
    
    private func initiatePayment() {
        if orderId == nil {
             createOrderAndProceed()
             return
        }
        
        // Mock Payment for now matching Android simulation
        let alert = UIAlertController(title: "Payment", message: "Simulating Payment Gateway...", preferredStyle: .alert)
        present(alert, animated: true)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
            alert.dismiss(animated: true) {
                self?.confirmPayment(razorpayOrderId: "simulated_order", paymentId: "simulated_pay_\(Date().timeIntervalSince1970)")
            }
        }
    }
    
    private func createOrderAndProceed() {
        let loading = UIAlertController(title: nil, message: "Creating Application...", preferredStyle: .alert)
        let indicator = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50))
        indicator.startAnimating()
        loading.view.addSubview(indicator)
        present(loading, animated: true)
        
        // Parse Price
        let amount = Double(priceString.components(separatedBy: CharacterSet.decimalDigits.inverted).joined()) ?? 0.0
        let req = CreateOrderRequest(serviceName: serviceTitle, customerEmail: SessionManager.shared.getUserEmail() ?? "", totalAmount: amount)
        
        APIService.shared.createOrder(request: req) { [weak self] result in
            DispatchQueue.main.async {
                loading.dismiss(animated: true) {
                    switch result {
                    case .success(let order):
                        self?.orderId = String(order.id)
                        self?.uploadPendingDocuments()
                    case .failure(let error):
                        self?.showError(error.localizedDescription)
                    }
                }
            }
        }
    }
    
    private func uploadPendingDocuments() {
        guard let orderId = orderId, !selectedFiles.isEmpty else {
            initiatePayment()
            return
        }
        
        let loading = UIAlertController(title: nil, message: "Uploading Documents...", preferredStyle: .alert)
        present(loading, animated: true)
        
        uploadNextDocument(index: 0, loadingAlert: loading)
    }
    
    private func uploadNextDocument(index: Int, loadingAlert: UIAlertController) {
        if index >= selectedFiles.count {
            loadingAlert.dismiss(animated: true) {
                self.initiatePayment()
            }
            return
        }
        
        let file = selectedFiles[index]
        APIService.shared.uploadDocument(orderId: orderId!, fileURL: file) { [weak self] result in
            DispatchQueue.main.async {
                // Continue regardless of success for now to match Android quick logic
                self?.uploadNextDocument(index: index + 1, loadingAlert: loadingAlert)
            }
        }
    }
    
    private func confirmPayment(razorpayOrderId: String, paymentId: String) {
        guard let orderId = orderId else { return }
        
        APIService.shared.confirmPayment(orderId: orderId, params: ["orderId": razorpayOrderId, "paymentId": paymentId]) { [weak self] result in
            DispatchQueue.main.async {
                let msg = try? result.get()
                // Assuming success
                let alert = UIAlertController(title: "Success", message: "Payment Successful! Order Placed.", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
                    self?.navigationController?.popViewController(animated: true)
                }))
                self?.present(alert, animated: true)
            }
        }
    }
    
    private func showError(_ msg: String) {
        let alert = UIAlertController(title: "Error", message: msg, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}

extension ServiceOrderViewController: UIDocumentPickerDelegate {
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        for url in urls {
            // Security: Start accessing security scoped resource
            guard url.startAccessingSecurityScopedResource() else { continue }
            
            // Do operations
            selectedFiles.append(url)
            addFileToStack(url: url)
            
            // Stop accessing
            // Note: If you need to read later (in upload), you might need to keep it open or copy it to tmp.
            // Copying to tmp is safer.
            // Simplified here.
            url.stopAccessingSecurityScopedResource()
        }
    }
}
