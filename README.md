# 🍽️ EatClub - Food Ordering Platform Frontend

A modern, responsive React + Vite frontend for the EatClub food ordering platform. Built with a beautiful green and black theme, featuring restaurant browsing, menu management, cart functionality, and order tracking.

## 🎨 Features

### User Features
- **Authentication**: Secure signup and login with JWT token management
- **Restaurant Browsing**: Search, filter by cuisine, and sort restaurants
- **Menu Exploration**: Browse restaurant menus with item details and special instructions
- **Smart Cart**: Single-restaurant cart with quantity management and price calculation
- **Checkout**: Multi-step checkout with delivery address and payment method selection
- **Order Tracking**: View order history with real-time status updates
- **Profile Management**: Update personal information and delivery address

### Admin Features
- **Dashboard**: View statistics and manage operations
- **Restaurant Management**: Add, edit, and manage restaurant details
- **Menu Management**: Create and manage menu items with categories and availability

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0 with Vite 5.0.8
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.2 with JWT interceptors
- **Icons**: Lucide React 0.294.0
- **State Management**: Context API with useReducer
- **Styling**: CSS with CSS custom properties and responsive design
- **Build Tool**: Vite for fast development and optimized builds

## 🎨 Design System

### Color Theme
- **Primary Green**: `#22c55e` - Main brand color
- **Dark Green**: `#16a34a` - Hover and active states
- **Light Green**: `#dcfce7` - Backgrounds and highlights
- **Black**: `#000000` - Text and accents
- **Dark Gray**: `#1f2937` - Secondary text

### Components
- Responsive navigation with mobile hamburger menu
- Restaurant cards with rating and delivery time
- Menu item cards with dietary badges (veg/spicy)
- Cart item management with quantity controls
- Order cards with status tracking
- Form inputs with validation feedback

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.jsx
│   ├── ProtectedRoute.jsx
│   ├── RestaurantCard.jsx
│   ├── RestaurantFilter.jsx
│   ├── MenuItem.jsx
│   └── Loading.jsx
├── pages/               # Page components
│   ├── Login.jsx
│   ├── Home.jsx
│   ├── Restaurant.jsx
│   ├── Cart.jsx
│   ├── Orders.jsx
│   ├── Profile.jsx
│   └── admin/
│       ├── AdminConsole.jsx
│       ├── AdminRestaurants.jsx
│       └── AdminMenu.jsx
├── context/             # State management
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── services/            # API client
│   └── api.js
├── utils/               # Utilities and helpers
│   ├── constants.js
│   ├── validators.js
│   └── helpers.js
├── styles/              # CSS stylesheets
│   ├── index.css
│   └── components.css
├── App.jsx
└── main.jsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm 8+
- Backend server running on `http://localhost:8080`

### Installation

1. **Clone the repository**
   ```bash
   cd eat_club_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure API endpoint** in `.env`
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Create production build:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🔐 Authentication

### JWT Token Management
- Tokens are stored in localStorage
- Axios interceptor automatically includes token in request headers
- Invalid or expired tokens trigger automatic redirect to login page

### Demo Credentials
**User Account:**
- Email: `rajesh.kumar@example.com`
- Password: `password123`

**Admin Account:**
- Email: `arjun.verma@restaurant.com`
- Password: `password123`

## 📝 API Integration

All API endpoints are centralized in `src/services/api.js` with the following modules:
- `authAPI` - Authentication endpoints
- `userAPI` - User profile management
- `restaurantAPI` - Restaurant listing and details
- `menuItemAPI` - Menu items and categories
- `cartAPI` - Cart operations
- `orderAPI` - Order management

### Request/Response Format
All requests/responses use JSON format with proper error handling and HTTP status codes.

## 🎯 Key Features Implementation

### Single Restaurant Cart
- Users can only have items from one restaurant in their cart
- Adding items from different restaurant shows warning
- Must clear cart to switch restaurants

### Form Validation
All forms include client-side validation:
- Email format validation
- Password strength requirements
- Phone number validation (10 digits)
- Address validation (minimum length)

### Responsive Design
- Mobile-first approach
- Breakpoint at 768px for tablet/desktop
- Touch-friendly button sizes
- Readable font sizes on all devices

### Loading States
- Loading spinners during data fetching
- Disabled buttons during form submission
- Skeleton screens for better UX

### Error Handling
- User-friendly error messages
- Automatic 401 redirect to login on authentication failure
- Form validation error display

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## 🔧 Component Usage Examples

### Using Authentication
```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, logout, isAdmin } = useAuth();
  // Your component logic
};
```

### Using Cart
```javascript
import { useCart } from '../context/CartContext';

const MyComponent = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  // Your component logic
};
```

### API Calls
```javascript
import { restaurantAPI } from '../services/api';

const restaurants = await restaurantAPI.getAll({ page: 0, size: 20 });
```

## 🌐 Routing

### User Routes
- `/login` - Authentication page
- `/` - Home (restaurant browsing)
- `/restaurant/:restaurantId` - Restaurant details and menu
- `/cart` - Shopping cart
- `/orders` - Order history
- `/profile` - User profile

### Admin Routes
- `/admin-console` - Dashboard
- `/admin-console/restaurants` - Restaurant management
- `/admin-console/menu/:restaurantId` - Menu management

## 💡 Best Practices

1. **Component Organization**: Keep components small and focused
2. **CSS Organization**: Use utility classes for common patterns
3. **Error Handling**: Always handle API errors gracefully
4. **Loading States**: Show loading indicators during async operations
5. **Validation**: Validate forms before submission
6. **Accessibility**: Use semantic HTML and ARIA labels

## 🐛 Common Issues

### API Connection Failed
- Ensure backend is running on the configured URL
- Check `VITE_API_BASE_URL` in `.env` file
- Verify network connectivity

### Login Not Working
- Clear browser localStorage if token is corrupted
- Check if backend authentication service is running
- Verify credentials are correct

### Cart Not Persisting
- Cart is stored in browser localStorage
- Clear cache if having issues
- Cart is cleared on logout

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔮 Future Enhancements

- [ ] Real-time order tracking with WebSocket
- [ ] Payment gateway integration
- [ ] Review and rating system
- [ ] Wishlist and favorites
- [ ] Push notifications
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Advanced filtering and search

## 📄 License

This project is part of the HCL Training program.

## 🤝 Contributing

For the hackathon team:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit for review

## 📞 Support

For issues or questions:
- Check the API contracts in `API-CONTRACTS.md`
- Review the API flow guide in `API-FLOW-GUIDE.md`
- Check database schema in `dbml/eatclub.dbml`

---

**Built with ❤️ for the EatClub Hackathon**
