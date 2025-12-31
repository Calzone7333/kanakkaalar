import UIKit

class CrmViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = DesignSystem.Colors.windowBackground
        title = "CRM"
        
        let label = UILabel()
        label.text = "CRM Dashboard\n(Coming Soon)"
        label.numberOfLines = 0
        label.textAlignment = .center
        label.font = DesignSystem.Fonts.bold(size: 20)
        label.textColor = DesignSystem.Colors.textSecondary
        label.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(label)
        
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
}
