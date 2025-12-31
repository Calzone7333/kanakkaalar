import UIKit

class DashboardViewController: UITabBarController {

    var userRole: String = "USER"

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        
        if let role = SessionManager.shared.getUserRole() {
             userRole = role
        }
        
        setupTabs()
    }
    
    private func setupTabs() {
        var controllers: [UIViewController] = []
        
        if userRole == "ADMIN" {
            controllers = [
                createNavController(for: AdminWelcomeViewController(), title: "Home", image: "house"),
                createNavController(for: AdminOrdersViewController(), title: "Orders", image: "list.bullet.clipboard"),
                createNavController(for: AdminEmployeesViewController(), title: "Employees", image: "person.3"),
                createNavController(for: AdminCrmViewController(), title: "CRM", image: "chart.bar"),
                createNavController(for: AdminSettingsViewController(), title: "Settings", image: "gear")
            ]
        } else if userRole == "EMPLOYEE" {
            controllers = [
                createNavController(for: EmployeeHomeViewController(), title: "Home", image: "house"),
                createNavController(for: EmployeeTasksViewController(), title: "Tasks", image: "checklist"),
                createNavController(for: EmployeeLeadsViewController(), title: "Leads", image: "person.2.wave.2"),
                createNavController(for: EmployeeSalesViewController(), title: "Sales", image: "dollarsign.circle"),
                createNavController(for: ProfileViewController(), title: "Profile", image: "person.circle")
            ]
        } else if userRole == "AGENT" {
            controllers = [
                createNavController(for: AgentHomeViewController(), title: "Home", image: "house"),
                createNavController(for: AgentOrdersViewController(), title: "Orders", image: "list.bullet"),
                createNavController(for: AgentWalletViewController(), title: "Wallet", image: "creditcard"),
                createNavController(for: ProfileViewController(), title: "Profile", image: "person.circle")
            ]
        } else {
            // USER (Default)
            controllers = [
                createNavController(for: HomeViewController(), title: "Home", image: "house"),
                createNavController(for: ServicesViewController(), title: "Services", image: "square.grid.2x2"),
                createNavController(for: OrdersViewController(), title: "Orders", image: "bag"),
                createNavController(for: ProfileViewController(), title: "Profile", image: "person.circle")
            ]
        }
        
        viewControllers = controllers
        tabBar.tintColor = UIColor(red: 26/255, green: 127/255, blue: 125/255, alpha: 1.0) // Teal
        tabBar.backgroundColor = .white
    }
    
    private func createNavController(for rootViewController: UIViewController, title: String, image: String) -> UIViewController {
        let navController = UINavigationController(rootViewController: rootViewController)
        navController.tabBarItem.title = title
        navController.tabBarItem.image = UIImage(systemName: image)
        rootViewController.navigationItem.title = title
        return navController
    }
}
