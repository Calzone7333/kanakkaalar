import UIKit

// MARK: - Base Placeholder Controller
class BasePlaceholderViewController: UIViewController {
    var pageTitle: String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        title = pageTitle
        
        let label = UILabel()
        label.text = "\(pageTitle)\nComing Soon"
        label.numberOfLines = 0
        label.textAlignment = .center
        label.font = UIFont.systemFont(ofSize: 20, weight: .medium)
        label.textColor = .gray
        label.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(label)
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
}

// MARK: - Admin Controllers
// All Admin controllers are now implemented in separate files.

// MARK: - Employee Controllers
// All Employee controllers are now implemented in separate files.

// MARK: - Agent Controllers
// All Agent controllers are now implemented in separate files.

// MARK: - User Controllers
// MARK: - User Controllers
// All user controllers are now implemented in separate files.


