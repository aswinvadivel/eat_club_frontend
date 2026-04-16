# EatClub - API Contracts

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication

All endpoints except login and signup require an Authorization header with a JWT token:
```
Authorization: Bearer <token>
```

---

## 1. Authentication Endpoints

### 1.1 User Sign Up
**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "USER"
}
```

**Response (201 Created):**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "USER",
  "createdAt": 1712200800000
}
```

---

### 1.2 User Sign In
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "USER"
}
```

---

### 1.3 User Sign Out
**Endpoint:** `POST /auth/logout`

**Headers:** Authorization required

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 2. User Management Endpoints

### 2.1 Get User Profile
**Endpoint:** `GET /users/profile`

**Headers:** Authorization required

**Response (200 OK):**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "USER",
  "phoneNumber": "+91-9876543210",
  "address": "123 Main St, City, State 12345",
  "createdAt": 1712200800000,
  "updatedAt": 1712200800000
}
```

---

### 2.2 Update User Profile
**Endpoint:** `PUT /users/profile`

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "John Doe",
  "phoneNumber": "+91-9876543210",
  "address": "123 Main St, City, State 12345"
}
```

**Response (200 OK):**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+91-9876543210",
  "address": "123 Main St, City, State 12345",
  "updatedAt": 1712200800000
}
```

---

## 3. Restaurant Management Endpoints (Admin Only)

### 3.1 Create Restaurant
**Endpoint:** `POST /restaurants`

**Headers:** Authorization required (Admin role)

**Request Body:**
```json
{
  "restaurantName": "Tasty Bites",
  "description": "North Indian cuisine",
  "address": "456 Food Street, City, State 67890",
  "phoneNumber": "+91-9999888877",
  "cuisineType": "North Indian",
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "restaurantId": "rest-001",
  "adminId": "123e4567-e89b-12d3-a456-426614174000",
  "restaurantName": "Tasty Bites",
  "description": "North Indian cuisine",
  "address": "456 Food Street, City, State 67890",
  "phoneNumber": "+91-9999888877",
  "cuisineType": "North Indian",
  "isActive": true,
  "createdAt": 1712200800000
}
```

---

### 3.2 Get All Restaurants (Public)
**Endpoint:** `GET /restaurants`

**Query Parameters:**
- `page`: integer (default: 0)
- `size`: integer (default: 10)
- `cuisineType`: string (optional)

**Response (200 OK):**
```json
{
  "content": [
    {
      "restaurantId": "rest-001",
      "restaurantName": "Tasty Bites",
      "description": "North Indian cuisine",
      "cuisineType": "North Indian",
      "address": "456 Food Street, City, State 67890",
      "isActive": true,
      "averageRating": 4.5,
      "totalOrders": 150
    }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 10
}
```

---

### 3.3 Get Restaurant Details
**Endpoint:** `GET /restaurants/{restaurantId}`

**Response (200 OK):**
```json
{
  "restaurantId": "rest-001",
  "restaurantName": "Tasty Bites",
  "description": "North Indian cuisine",
  "address": "456 Food Street, City, State 67890",
  "phoneNumber": "+91-9999888877",
  "cuisineType": "North Indian",
  "isActive": true,
  "menuItems": [
    {
      "itemId": "item-001",
      "itemName": "Butter Chicken",
      "description": "Creamy butter chicken",
      "price": 299.99,
      "isAvailable": true
    }
  ],
  "createdAt": "2024-04-16T12:00:00Z"
}
```

---

### 3.4 Update Restaurant
**Endpoint:** `PUT /restaurants/{restaurantId}`

**Headers:** Authorization required (Admin - must be owner)

**Request Body:**
```json
{
  "restaurantName": "Tasty Bites Premium",
  "description": "North Indian & Chinese cuisine",
  "address": "456 Food Street, City, State 67890",
  "phoneNumber": "+91-9999888877",
  "cuisineType": "North Indian & Chinese",
  "isActive": true
}
```

**Response (200 OK):** Returns updated restaurant object

---

### 3.5 Delete Restaurant
**Endpoint:** `DELETE /restaurants/{restaurantId}`

**Headers:** Authorization required (Admin - must be owner)

**Response (204 No Content)**

---

## 4. Menu Management Endpoints (Admin Only)

### 4.1 Create Menu Item
**Endpoint:** `POST /restaurants/{restaurantId}/menu-items`

**Headers:** Authorization required (Admin - must be owner)

**Request Body:**
```json
{
  "itemName": "Butter Chicken",
  "description": "Creamy butter chicken with aromatic spices",
  "price": 299.99,
  "category": "Main Course",
  "isVegetarian": false,
  "isSpicy": true,
  "preparationTime": 20,
  "imageUrl": "https://example.com/butter-chicken.jpg",
  "isAvailable": true
}
```

**Response (201 Created):**
```json
{
  "itemId": "item-001",
  "restaurantId": "rest-001",
  "itemName": "Butter Chicken",
  "description": "Creamy butter chicken with aromatic spices",
  "price": 299.99,
  "category": "Main Course",
  "isVegetarian": false,
  "isSpicy": true,
  "preparationTime": 20,
  "imageUrl": "https://example.com/butter-chicken.jpg",
  "isAvailable": true,
  "createdAt": 1712200800000
}
```

---

### 4.2 Get Menu Items by Restaurant
**Endpoint:** `GET /restaurants/{restaurantId}/menu-items`

**Query Parameters:**
- `category`: string (optional)
- `isVegetarian`: boolean (optional)
- `page`: integer (default: 0)
- `size`: integer (default: 20)

**Response (200 OK):**
```json
{
  "content": [
    {
      "itemId": "item-001",
      "itemName": "Butter Chicken",
      "description": "Creamy butter chicken with aromatic spices",
      "price": 299.99,
      "category": "Main Course",
      "isVegetarian": false,
      "isSpicy": true,
      "preparationTime": 20,
      "imageUrl": "https://example.com/butter-chicken.jpg",
      "isAvailable": true
    }
  ],
  "totalElements": 45,
  "totalPages": 3,
  "currentPage": 0
}
```

---

### 4.3 Update Menu Item
**Endpoint:** `PUT /restaurants/{restaurantId}/menu-items/{itemId}`

**Headers:** Authorization required (Admin - must be owner)

**Request Body:** Same as create (all fields optional for update)

**Response (200 OK):** Returns updated menu item

---

### 4.4 Delete Menu Item
**Endpoint:** `DELETE /restaurants/{restaurantId}/menu-items/{itemId}`

**Headers:** Authorization required (Admin - must be owner)

**Response (204 No Content)**

---

### 4.5 Update Item Availability
**Endpoint:** `PATCH /restaurants/{restaurantId}/menu-items/{itemId}/availability`

**Headers:** Authorization required (Admin - must be owner)

**Request Body:**
```json
{
  "isAvailable": false
}
```

**Response (200 OK):**
```json
{
  "itemId": "item-001",
  "isAvailable": false,
  "updatedAt": "2024-04-16T14:00:00Z"
}
```

---

## 5. Cart Endpoints

### 5.1 Add Item to Cart
**Endpoint:** `POST /cart/items`

**Headers:** Authorization required

**Request Body:**
```json
{
  "itemId": "item-001",
  "restaurantId": "rest-001",
  "quantity": 2,
  "specialInstructions": "Extra spicy"
}
```

**Response (201 Created):**
```json
{
  "cartItemId": "cart-item-001",
  "itemId": "item-001",
  "itemName": "Butter Chicken",
  "restaurantId": "rest-001",
  "quantity": 2,
  "unitPrice": 299.99,
  "totalPrice": 599.98,
  "specialInstructions": "Extra spicy",
  "addedAt": 1712200800000
}
```

---

### 5.2 Get Cart
**Endpoint:** `GET /cart`

**Headers:** Authorization required

**Response (200 OK):**
```json
{
  "cartId": "cart-123",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "restaurantId": "rest-001",
  "cartItems": [
    {
      "cartItemId": "cart-item-001",
      "itemId": "item-001",
      "itemName": "Butter Chicken",
      "quantity": 2,
      "unitPrice": 299.99,
      "totalPrice": 599.98,
      "specialInstructions": "Extra spicy"
    }
  ],
  "subtotal": 599.98,
  "tax": 107.99,
  "deliveryCharges": 50.00,
  "total": 757.97,
  "lastUpdated": 1712200800000
}
```

---

### 5.3 Update Cart Item
**Endpoint:** `PUT /cart/items/{cartItemId}`

**Headers:** Authorization required

**Request Body:**
```json
{
  "quantity": 3,
  "specialInstructions": "Extra spicy, light oil"
}
```

**Response (200 OK):** Returns updated cart item

---

### 5.4 Remove Item from Cart
**Endpoint:** `DELETE /cart/items/{cartItemId}`

**Headers:** Authorization required

**Response (204 No Content)**

---

### 5.5 Clear Cart
**Endpoint:** `DELETE /cart`

**Headers:** Authorization required

**Response (204 No Content)**

---

## 6. Order Endpoints

### 6.1 Create Order
**Endpoint:** `POST /orders`

**Headers:** Authorization required

**Request Body:**
```json
{
  "deliveryAddress": "123 Main St, City, State 12345",
  "phoneNumber": "+91-9876543210",
  "paymentMethod": "CREDIT_CARD",
  "specialInstructions": "Ring the bell twice"
}
```

**Response (201 Created):**
```json
{
  "orderId": "ORD-20240416-001",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "restaurantId": "rest-001",
  "restaurantName": "Tasty Bites",
  "orderItems": [
    {
      "itemId": "item-001",
      "itemName": "Butter Chicken",
      "quantity": 2,
      "unitPrice": 299.99,
      "totalPrice": 599.98,
      "specialInstructions": "Extra spicy"
    }
  ],
  "deliveryAddress": "123 Main St, City, State 12345",
  "subtotal": 599.98,
  "tax": 107.99,
  "deliveryCharges": 50.00,
  "total": 757.97,
  "orderStatus": "CONFIRMED",
  "paymentStatus": "PENDING",
  "paymentMethod": "CREDIT_CARD",
  "estimatedDeliveryTime": 1712204400000,
  "createdAt": 1712200800000
}
```

---

### 6.2 Get Order Details
**Endpoint:** `GET /orders/{orderId}`

**Headers:** Authorization required

**Response (200 OK):** Returns complete order object (see 6.1)

---

### 6.3 Get User's Order History
**Endpoint:** `GET /orders`

**Headers:** Authorization required

**Query Parameters:**
- `page`: integer (default: 0)
- `size`: integer (default: 10)
- `status`: string (optional - CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED)

**Response (200 OK):**
```json
{
  "content": [
    {
      "orderId": "ORD-20240416-001",
      "restaurantName": "Tasty Bites",
      "total": 757.97,
      "orderStatus": "DELIVERED",
      "createdAt": 1712200800000,
      "deliveredAt": 1712202600000
    }
  ],
  "totalElements": 12,
  "totalPages": 2,
  "currentPage": 0
}
```

---

### 6.4 Cancel Order
**Endpoint:** `PUT /orders/{orderId}/cancel`

**Headers:** Authorization required

**Request Body:**
```json
{
  "reason": "Need to change address"
}
```

**Response (200 OK):**
```json
{
  "orderId": "ORD-20240416-001",
  "orderStatus": "CANCELLED",
  "reason": "Need to change address",
  "refundStatus": "INITIATED",
  "cancelledAt": 1712200900000
}
```

---

### 6.5 Update Order Status (Admin Only)
**Endpoint:** `PATCH /orders/{orderId}/status`

**Headers:** Authorization required (Admin - restaurant owner)

**Request Body:**
```json
{
  "orderStatus": "OUT_FOR_DELIVERY"
}
```

**Response (200 OK):**
```json
{
  "orderId": "ORD-20240416-001",
  "orderStatus": "OUT_FOR_DELIVERY",
  "updatedAt": 1712200800000
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": 1712200800000,
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid input parameters",
  "path": "/api/v1/auth/login"
}
```

### 401 Unauthorized
```json
{
  "timestamp": 1712200800000,
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "path": "/api/v1/orders"
}
```

### 403 Forbidden
```json
{
  "timestamp": 1712200800000,
  "status": 403,
  "error": "Forbidden",
  "message": "You don't have permission to access this resource",
  "path": "/api/v1/restaurants/rest-001"
}
```

### 404 Not Found
```json
{
  "timestamp": 1712200800000,
  "status": 404,
  "error": "Not Found",
  "message": "Restaurant not found",
  "path": "/api/v1/restaurants/rest-999"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": 1712200800000,
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/v1/orders"
}
```

---

## Status Codes Reference

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content to return |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |

---

## Notes

- All timestamps are in epoch milliseconds (long)
- Authentication uses JWT tokens
- Admins can only manage their own restaurant(s)
- Users can only view/modify their own data
- All numeric prices are in the local currency (e.g., INR)
- Pagination is 0-indexed
