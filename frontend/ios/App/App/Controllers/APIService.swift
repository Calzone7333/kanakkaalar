import Foundation
import UIKit

// MARK: - Models

struct User: Codable {
    let id: Int
    let fullName: String?
    let email: String
    let phone: String?
    let role: String?
}

struct AttendanceRecord: Codable {
    let id: Int
    let date: String
    let checkInTime: String?
    let checkOutTime: String?
    let status: String?
    let user: User?
    let duration: String?
}

struct Company: Codable {
    let id: Int
    let businessName: String?
    let businessType: String?
    let incorporationDate: String?
    let panNumber: String?
    let gstin: String?
    let user: User?
    let status: String?
}

struct Agent: Codable {
    let id: Int
    let fullName: String
    let email: String
    let phone: String?
    let status: String?
    let profileImage: String?
}

struct Employee: Codable {
    let id: String
    let fullName: String
    let email: String
    let role: String
    let status: String
}

struct Order: Codable {
    let id: Int
    let serviceName: String?
    let totalAmount: Double?
    let customerEmail: String?
    let status: String?
    let createdAt: String?
    let user: User?
}

struct CreateOrderRequest: Codable {
    let serviceName: String
    let customerEmail: String
    let totalAmount: Double
}

struct RazorpayOrderResponse: Codable {
    let id: String
    let entity: String
    let amount: Int
    let currency: String
    var orderId: String { return id }
}

struct CustomerProfile: Codable {
    let id: Int
    let user: User?
    let whatsappNumber: String?
    let status: String?
}

struct Expert: Codable {
    let id: Int
    let name: String
    let qualification: String?
    let experience: String?
    let price: String?
    let rating: Double?
    let reviews: Int?
    let bio: String?
    let available: Bool?
    let languages: [String]?
    let specialization: [String]?
}

struct Deal: Codable {
    let id: Int?
    let name: String?
    let customer: String?
    let amount: Double?
    let stage: String?
    let probability: Int?
    let owner: String?
    let dueDate: String?
}

struct Lead: Codable {
    let id: Int?
    let name: String
    let email: String
    let phone: String?
    let service: String?
    let status: String?
    let createdAt: String?
}

struct ChartData: Codable {
    let name: String?
    let value: Double?
    let leads: Int?
    let deals: Int?
}

struct DashboardStatsResponse: Codable {
    let totalRevenue: Double
    let totalEmployees: Int
    let totalAgents: Int
    let totalCustomers: Int
    let totalLeads: Int
    let totalDeals: Int
    let orderStatusChart: [ChartData]?
    let leadsVsDealsChart: [ChartData]?
}

struct AgentWallet: Codable {
    let id: Int
    let balance: Double
    let updatedAt: String
}

struct WalletTransaction: Codable {
    let id: Int
    let amount: Double
    let type: String // CREDIT, DEBIT
    let description: String
    let createdAt: String
}

enum RazorpayKeyResponse: Codable {
    case string(String)
    case object(KeyObject)

    struct KeyObject: Codable {
        let key: String
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let x = try? container.decode(String.self) {
            self = .string(x)
            return
        }
        if let x = try? container.decode(KeyObject.self) {
            self = .object(x)
            return
        }
        throw DecodingError.typeMismatch(RazorpayKeyResponse.self, DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Wrong type for RazorpayKeyResponse"))
    }
}


// MARK: - APIService

class APIService {
    static let shared = APIService()
    private let baseURL = "http://115.97.59.230:8081/api"
    
    private init() {}
    
    func getHeaders() -> [String: String] {
        var headers = ["Content-Type": "application/json"]
        if let token = SessionManager.shared.getToken() {
            headers["Authorization"] = "Bearer \(token)"
        }
        return headers
    }
    
    // MARK: - Generic Request
    
    private func request<T: Codable>(endpoint: String, method: String = "GET", body: Data? = nil, completion: @escaping (Result<T, Error>) -> Void) {
        guard let url = URL(string: baseURL + endpoint) else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.allHTTPHeaderFields = getHeaders()
        request.httpBody = body
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "No Data", code: 0, userInfo: nil)))
                return
            }
            
            do {
                let decoded = try JSONDecoder().decode(T.self, from: data)
                completion(.success(decoded))
            } catch {
                print("Decoding Error: \(error)")
                completion(.failure(error))
            }
        }.resume()
    }
    
    // MARK: - Methods
    
    func getAdminDashboardStats(completion: @escaping (Result<DashboardStatsResponse, Error>) -> Void) {
        request(endpoint: "/admin/dashboard-stats", completion: completion)
    }

    func fetchEmployees(completion: @escaping (Result<[Employee], Error>) -> Void) {
        request(endpoint: "/admin/employees", completion: completion)
    }
    
    func getAllAttendance(completion: @escaping (Result<[AttendanceRecord], Error>) -> Void) {
        request(endpoint: "/attendance/all", completion: completion)
    }
    
    func getAllCompanies(completion: @escaping (Result<[Company], Error>) -> Void) {
        request(endpoint: "/companies/all", completion: completion)
    }
    
    func getAllAgents(completion: @escaping (Result<[Agent], Error>) -> Void) {
        request(endpoint: "/admin/agents", completion: completion)
    }
    
    func getAllOrders(completion: @escaping (Result<[Order], Error>) -> Void) {
        request(endpoint: "/orders/all", completion: completion)
    }
    
    func createOrder(request: CreateOrderRequest, completion: @escaping (Result<Order, Error>) -> Void) {
        guard let body = try? JSONEncoder().encode(request) else { return }
        self.request(endpoint: "/orders/create", method: "POST", body: body, completion: completion)
    }
    
    func getAllCustomerProfiles(completion: @escaping (Result<[CustomerProfile], Error>) -> Void) {
        request(endpoint: "/admin/customers", completion: completion)
    }

    func getExperts(completion: @escaping (Result<[Expert], Error>) -> Void) {
        request(endpoint: "/admin/experts", completion: completion)
    }
    
    func createExpert(expertData: [String: Any], completion: @escaping (Result<Expert, Error>) -> Void) {
         guard let body = try? JSONSerialization.data(withJSONObject: expertData) else { return }
         self.request(endpoint: "/admin/experts/create", method: "POST", body: body, completion: completion)
    }

    func getAllDeals(completion: @escaping (Result<[Deal], Error>) -> Void) {
        request(endpoint: "/crm/deals", completion: completion)
    }
    
    func createDeal(dealRequest: Deal, completion: @escaping (Result<Deal, Error>) -> Void) {
        guard let body = try? JSONEncoder().encode(dealRequest) else { return }
        self.request(endpoint: "/crm/deals", method: "POST", body: body, completion: completion)
    }
    
    func getAllLeads(completion: @escaping (Result<[Lead], Error>) -> Void) {
        request(endpoint: "/leads", completion: completion)
    }
    
    func createLead(lead: Lead, completion: @escaping (Result<Lead, Error>) -> Void) {
        guard let body = try? JSONEncoder().encode(lead) else { return }
        self.request(endpoint: "/leads", method: "POST", body: body, completion: completion)
    }
    
    func createRazorpayOrder(params: [String: Any], completion: @escaping (Result<RazorpayOrderResponse, Error>) -> Void) {
         guard let body = try? JSONSerialization.data(withJSONObject: params) else { return }
         self.request(endpoint: "/payment/create-order", method: "POST", body: body, completion: completion)
    }

    func getRazorpayKey(completion: @escaping (Result<String, Error>) -> Void) {
        request(endpoint: "/payment/key") { (result: Result<RazorpayKeyResponse, Error>) in
            switch result {
            case .success(let response):
                switch response {
                case .string(let s): completion(.success(s.replacingOccurrences(of: "\"", with: "")))
                case .object(let o): completion(.success(o.key))
                }
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func confirmPayment(orderId: String, params: [String: String], completion: @escaping (Result<Void, Error>) -> Void) {
        guard let body = try? JSONEncoder().encode(params) else { return }
        guard let url = URL(string: baseURL + "/orders/\(orderId)/confirm-payment") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.allHTTPHeaderFields = getHeaders()
        request.httpBody = body
        
        URLSession.shared.dataTask(with: request) { _, response, error in
            if let error = error { completion(.failure(error)); return }
            if let httpResp = response as? HTTPURLResponse, httpResp.statusCode == 200 {
                completion(.success(()))
            } else {
                completion(.failure(NSError(domain: "Payment Failed", code: 0, userInfo: nil)))
            }
        }.resume()
    }
    
    func uploadDocument(orderId: String, fileURL: URL, completion: @escaping (Result<Void, Error>) -> Void) {
        guard let url = URL(string: baseURL + "/orders/\(orderId)/upload-document") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        let boundary = "Boundary-\(UUID().uuidString)"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        if let token = SessionManager.shared.getToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        var data = Data()
        let filename = fileURL.lastPathComponent
        let mimeType = "application/pdf"
        
        data.append("--\(boundary)\r\n".data(using: .utf8)!)
        data.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(filename)\"\r\n".data(using: .utf8)!)
        data.append("Content-Type: \(mimeType)\r\n\r\n".data(using: .utf8)!)
        
        if let fileData = try? Data(contentsOf: fileURL) {
            data.append(fileData)
        }
        
        data.append("\r\n".data(using: .utf8)!)
        data.append("--\(boundary)--\r\n".data(using: .utf8)!)
        
        URLSession.shared.uploadTask(with: request, from: data) { _, response, error in
             if let error = error { completion(.failure(error)); return }
             if let httpResp = response as? HTTPURLResponse, httpResp.statusCode == 200 {
                 completion(.success(()))
             } else {
                 completion(.failure(NSError(domain: "Upload Failed", code: 0, userInfo: nil)))
             }
        }.resume()
    }
    
    // MARK: - Agent Wallet
    
    func getAgentWallet(completion: @escaping (Result<AgentWallet, Error>) -> Void) {
        request(endpoint: "/agent/wallet", completion: completion)
    }
    
    func getWalletTransactions(completion: @escaping (Result<[WalletTransaction], Error>) -> Void) {
        request(endpoint: "/agent/wallet/transactions", completion: completion)
    }
}
