import UIKit

class EmployeeReportsViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "Reports"
        setupPlaceholder()
    }
    
    private func setupPlaceholder() {
        let label = UILabel()
        label.text = "Reports functionality coming soon."
        label.textColor = .gray
        label.font = DesignSystem.Fonts.regular(size: 16)
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(label)
        
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
}
