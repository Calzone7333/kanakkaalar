import UIKit

struct DesignSystem {
    struct Colors {
        static let primary = UIColor(red: 26/255, green: 127/255, blue: 125/255, alpha: 1.0) // #1A7F7D
        static let primaryDark = UIColor(red: 19/255, green: 96/255, blue: 95/255, alpha: 1.0) // #13605F
        static let accent = UIColor(red: 255/255, green: 193/255, blue: 7/255, alpha: 1.0) // #FFC107
        static let windowBackground = UIColor(red: 248/255, green: 250/255, blue: 252/255, alpha: 1.0) // #F8FAFC
        
        static let textPrimary = UIColor(red: 17/255, green: 24/255, blue: 39/255, alpha: 1.0) // #111827
        static let textSecondary = UIColor(red: 75/255, green: 85/255, blue: 99/255, alpha: 1.0) // #4B5563
        static let textTertiary = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1.0) // #9CA3AF
        
        static let white = UIColor.white
        static let black = UIColor.black
        static let success = UIColor(red: 16/255, green: 185/255, blue: 129/255, alpha: 1.0) // #10B981
        static let error = UIColor(red: 239/255, green: 68/255, blue: 68/255, alpha: 1.0) // #EF4444
    }
    
    struct Fonts {
        static func bold(size: CGFloat) -> UIFont {
            return UIFont.boldSystemFont(ofSize: size)
        }
        
        static func regular(size: CGFloat) -> UIFont {
            return UIFont.systemFont(ofSize: size)
        }
    }
}
