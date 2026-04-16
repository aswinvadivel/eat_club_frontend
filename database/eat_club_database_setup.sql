-- One-run setup for Eat Club
-- DB Name: eat_club_database

DROP DATABASE IF EXISTS eat_club_database;
CREATE DATABASE eat_club_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eat_club_database;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  userId VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER' NOT NULL,
  phoneNumber VARCHAR(20),
  address TEXT,
  profileImageUrl VARCHAR(500),
  isActive BOOLEAN DEFAULT TRUE,
  lastLoginAt BIGINT NULL,
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_active (isActive)
) ENGINE=InnoDB;

CREATE TABLE restaurants (
  restaurantId VARCHAR(36) PRIMARY KEY,
  adminId VARCHAR(36) NOT NULL,
  restaurantName VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phoneNumber VARCHAR(20),
  cuisineType VARCHAR(100),
  imageUrl VARCHAR(500),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL,
  FOREIGN KEY (adminId) REFERENCES users(userId) ON DELETE CASCADE,
  INDEX idx_restaurants_admin (adminId),
  INDEX idx_restaurants_name (restaurantName),
  INDEX idx_restaurants_active (isActive),
  INDEX idx_restaurants_cuisine (cuisineType)
) ENGINE=InnoDB;

CREATE TABLE menu_items (
  itemId VARCHAR(36) PRIMARY KEY,
  restaurantId VARCHAR(36) NOT NULL,
  itemName VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  isVegetarian BOOLEAN DEFAULT FALSE,
  isSpicy BOOLEAN DEFAULT FALSE,
  preparationTime INT DEFAULT 20,
  imageUrl VARCHAR(500),
  isAvailable BOOLEAN DEFAULT TRUE,
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(restaurantId) ON DELETE CASCADE,
  INDEX idx_menu_restaurant (restaurantId),
  INDEX idx_menu_category (category),
  INDEX idx_menu_available (isAvailable),
  INDEX idx_menu_veg (isVegetarian)
) ENGINE=InnoDB;

CREATE TABLE carts (
  cartId VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) UNIQUE NOT NULL,
  restaurantId VARCHAR(36) NULL,
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(restaurantId) ON DELETE SET NULL,
  INDEX idx_carts_user (userId)
) ENGINE=InnoDB;

CREATE TABLE cart_items (
  cartItemId VARCHAR(36) PRIMARY KEY,
  cartId VARCHAR(36) NOT NULL,
  itemId VARCHAR(36) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  specialInstructions TEXT,
  addedAt BIGINT NOT NULL,
  FOREIGN KEY (cartId) REFERENCES carts(cartId) ON DELETE CASCADE,
  FOREIGN KEY (itemId) REFERENCES menu_items(itemId) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (cartId, itemId),
  INDEX idx_cart_items_cart (cartId),
  INDEX idx_cart_items_item (itemId)
) ENGINE=InnoDB;

CREATE TABLE orders (
  orderId VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  restaurantId VARCHAR(36) NOT NULL,
  deliveryAddress TEXT NOT NULL,
  phoneNumber VARCHAR(20) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  deliveryCharges DECIMAL(10,2) NOT NULL DEFAULT 40.00,
  discountAmount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  orderStatus ENUM('CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') DEFAULT 'CONFIRMED',
  paymentStatus ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
  paymentMethod VARCHAR(50),
  specialInstructions TEXT,
  estimatedDeliveryTime BIGINT,
  deliveredAt BIGINT NULL,
  cancelledAt BIGINT NULL,
  cancellationReason VARCHAR(255),
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE RESTRICT,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(restaurantId) ON DELETE RESTRICT,
  INDEX idx_orders_user (userId),
  INDEX idx_orders_restaurant (restaurantId),
  INDEX idx_orders_status (orderStatus),
  INDEX idx_orders_createdAt (createdAt)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  orderItemId VARCHAR(36) PRIMARY KEY,
  orderId VARCHAR(36) NOT NULL,
  itemId VARCHAR(36) NOT NULL,
  itemName VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  unitPrice DECIMAL(10,2) NOT NULL,
  totalPrice DECIMAL(10,2) NOT NULL,
  specialInstructions TEXT,
  createdAt BIGINT NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(orderId) ON DELETE CASCADE,
  FOREIGN KEY (itemId) REFERENCES menu_items(itemId) ON DELETE RESTRICT,
  INDEX idx_order_items_order (orderId),
  INDEX idx_order_items_item (itemId)
) ENGINE=InnoDB;

-- ============================================================
-- Seed Users
-- Password hint for test users: password123
-- ============================================================
INSERT INTO users (userId, name, email, password, role, phoneNumber, address, profileImageUrl, isActive, createdAt, updatedAt) VALUES
('usr-101', 'Rohan Mehta', 'rohan.mehta@example.com', '$2a$10$xTgLkJoU8bYbAXVYz5Kp2e2l1m1n1o1p1q1r1s1t1u1v1w1x1y1z2', 'USER', '+91-9876500011', '31 Park Street, Chennai, Tamil Nadu 600001', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', TRUE, 1714500000000, 1714500000000),
('usr-102', 'Ananya Iyer', 'ananya.iyer@example.com', '$2a$10$xTgLkJoU8bYbAXVYz5Kp2e2l1m1n1o1p1q1r1s1t1u1v1w1x1y1z2', 'USER', '+91-9876500022', '18 Lake View, Bengaluru, Karnataka 560034', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', TRUE, 1714501000000, 1714501000000),
('adm-201', 'Kunal Arora', 'kunal.arora@eatclub.com', '$2a$10$xTgLkJoU8bYbAXVYz5Kp2e2l1m1n1o1p1q1r1s1t1u1v1w1x1y1z2', 'ADMIN', '+91-9000001111', 'Chennai, Tamil Nadu', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', TRUE, 1714502000000, 1714502000000),
('adm-202', 'Meera Nair', 'meera.nair@eatclub.com', '$2a$10$xTgLkJoU8bYbAXVYz5Kp2e2l1m1n1o1p1q1r1s1t1u1v1w1x1y1z2', 'ADMIN', '+91-9000002222', 'Bengaluru, Karnataka', 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg', TRUE, 1714503000000, 1714503000000),
('adm-203', 'Sana Qureshi', 'sana.qureshi@eatclub.com', '$2a$10$xTgLkJoU8bYbAXVYz5Kp2e2l1m1n1o1p1q1r1s1t1u1v1w1x1y1z2', 'ADMIN', '+91-9000003333', 'Hyderabad, Telangana', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', TRUE, 1714504000000, 1714504000000);

-- ============================================================
-- Seed Restaurants (6)
-- ============================================================
INSERT INTO restaurants (restaurantId, adminId, restaurantName, description, address, phoneNumber, cuisineType, imageUrl, isActive, createdAt, updatedAt) VALUES
('rest-101', 'adm-201', 'Bombay Spice House', 'Classic North Indian curries, kebabs, and tandoor favorites.', 'Nungambakkam High Road, Chennai', '+91-4440011001', 'North Indian', 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714510000000, 1714510000000),
('rest-102', 'adm-202', 'Coastal Curry Co', 'Authentic South Indian meals, dosas, and traditional breakfast.', 'Indiranagar 100 Feet Road, Bengaluru', '+91-8040011002', 'South Indian', 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714511000000, 1714511000000),
('rest-103', 'adm-203', 'Wok and Bowl', 'Pan-Asian bowls, noodles, and bold wok-tossed flavors.', 'Banjara Hills Road No. 12, Hyderabad', '+91-4040011003', 'Chinese', 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714512000000, 1714512000000),
('rest-104', 'adm-201', 'Firewood Pizza Lab', 'Hand-stretched sourdough pizzas and gourmet Italian comfort food.', 'Anna Nagar West, Chennai', '+91-4440011004', 'Continental', 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714513000000, 1714513000000),
('rest-105', 'adm-202', 'Green Leaf Kitchen', 'Healthy vegetarian and vegan bowls, salads, and wraps.', 'Koramangala 5th Block, Bengaluru', '+91-8040011005', 'Fast Food', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714514000000, 1714514000000),
('rest-106', 'adm-203', 'Smoke and Grill Hub', 'Smoked meats, grilled platters, and signature sauces.', 'Jubilee Hills Check Post, Hyderabad', '+91-4040011006', 'North Indian', 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714515000000, 1714515000000);

-- ============================================================
-- Seed Menu Items (6 each restaurant = 36)
-- ============================================================
INSERT INTO menu_items (itemId, restaurantId, itemName, description, price, category, isVegetarian, isSpicy, preparationTime, imageUrl, isAvailable, createdAt, updatedAt) VALUES
('itm-101', 'rest-101', 'Butter Chicken', 'Slow-cooked chicken in buttery tomato gravy.', 329.00, 'Main Course', FALSE, TRUE, 20, 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714520000000, 1714520000000),
('itm-102', 'rest-101', 'Paneer Lababdar', 'Paneer cubes in rich onion-tomato masala.', 289.00, 'Main Course', TRUE, FALSE, 18, 'https://images.pexels.com/photos/12737918/pexels-photo-12737918.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714520100000, 1714520100000),
('itm-103', 'rest-101', 'Garlic Naan', 'Freshly baked naan with garlic butter.', 79.00, 'Bread', TRUE, FALSE, 8, 'https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714520200000, 1714520200000),
('itm-104', 'rest-101', 'Chicken Biryani', 'Fragrant basmati rice layered with spiced chicken.', 359.00, 'Rice', FALSE, TRUE, 30, 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714520300000, 1714520300000),
('itm-105', 'rest-101', 'Gulab Jamun', 'Classic milk dumplings in sugar syrup.', 119.00, 'Dessert', TRUE, FALSE, 6, 'https://images.pexels.com/photos/15108544/pexels-photo-15108544.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714520400000, 1714520400000),
('itm-106', 'rest-101', 'Masala Chaas', 'Spiced buttermilk with mint and cumin.', 69.00, 'Beverage', TRUE, FALSE, 4, 'https://images.pexels.com/photos/6544379/pexels-photo-6544379.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714520500000, 1714520500000),

('itm-201', 'rest-102', 'Masala Dosa', 'Golden crispy dosa with spiced potato filling.', 169.00, 'Main Course', TRUE, TRUE, 14, 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714520600000, 1714520600000),
('itm-202', 'rest-102', 'Idli Sambar', 'Steamed rice cakes with hot sambar and chutneys.', 129.00, 'Main Course', TRUE, FALSE, 12, 'https://images.pexels.com/photos/14608723/pexels-photo-14608723.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714520700000, 1714520700000),
('itm-203', 'rest-102', 'Podi Uttapam', 'Thick rice pancake topped with podi masala.', 179.00, 'Main Course', TRUE, TRUE, 15, 'https://images.pexels.com/photos/5410407/pexels-photo-5410407.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714520800000, 1714520800000),
('itm-204', 'rest-102', 'Medu Vada', 'Crispy lentil fritters served with chutney.', 119.00, 'Appetizer', TRUE, FALSE, 10, 'https://images.pexels.com/photos/5410418/pexels-photo-5410418.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714520900000, 1714520900000),
('itm-205', 'rest-102', 'Kesari Bath', 'Semolina sweet with saffron and ghee.', 99.00, 'Dessert', TRUE, FALSE, 8, 'https://images.pexels.com/photos/15108553/pexels-photo-15108553.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714521000000, 1714521000000),
('itm-206', 'rest-102', 'Filter Coffee', 'Traditional South Indian strong filter coffee.', 79.00, 'Beverage', TRUE, FALSE, 5, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714521100000, 1714521100000),

('itm-301', 'rest-103', 'Veg Hakka Noodles', 'Wok-tossed noodles with crunchy vegetables.', 229.00, 'Main Course', TRUE, TRUE, 15, 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714521200000, 1714521200000),
('itm-302', 'rest-103', 'Chicken Manchurian', 'Crispy chicken tossed in spicy manchurian sauce.', 299.00, 'Appetizer', FALSE, TRUE, 18, 'https://images.pexels.com/photos/3928854/pexels-photo-3928854.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714521300000, 1714521300000),
('itm-303', 'rest-103', 'Paneer Chilli Dry', 'Paneer cubes tossed with peppers and soy.', 269.00, 'Appetizer', TRUE, TRUE, 16, 'https://images.pexels.com/photos/12737662/pexels-photo-12737662.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714521400000, 1714521400000),
('itm-304', 'rest-103', 'Schezwan Fried Rice', 'Spicy fried rice with house-made schezwan paste.', 249.00, 'Rice', TRUE, TRUE, 16, 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714521500000, 1714521500000),
('itm-305', 'rest-103', 'Veg Spring Rolls', 'Crispy rolls with cabbage and carrot filling.', 189.00, 'Appetizer', TRUE, FALSE, 12, 'https://images.pexels.com/photos/2878741/pexels-photo-2878741.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714521600000, 1714521600000),
('itm-306', 'rest-103', 'Lemon Iced Tea', 'Fresh iced tea with lemon and mint.', 99.00, 'Beverage', TRUE, FALSE, 4, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714521700000, 1714521700000),

('itm-401', 'rest-104', 'Margherita Pizza', 'Classic pizza with mozzarella and basil.', 349.00, 'Main Course', TRUE, FALSE, 15, 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714521800000, 1714521800000),
('itm-402', 'rest-104', 'Farmhouse Pizza', 'Loaded with capsicum, onion, olives, and corn.', 429.00, 'Main Course', TRUE, FALSE, 18, 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714521900000, 1714521900000),
('itm-403', 'rest-104', 'Chicken Pepperoni Pizza', 'Pepperoni pizza with smoked mozzarella.', 499.00, 'Main Course', FALSE, TRUE, 18, 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714522000000, 1714522000000),
('itm-404', 'rest-104', 'Pesto Pasta', 'Penne in basil pesto sauce with parmesan.', 319.00, 'Main Course', TRUE, FALSE, 15, 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714522100000, 1714522100000),
('itm-405', 'rest-104', 'Garlic Bread', 'Toasted baguette with garlic herb butter.', 149.00, 'Bread', TRUE, FALSE, 10, 'https://images.pexels.com/photos/5410410/pexels-photo-5410410.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714522200000, 1714522200000),
('itm-406', 'rest-104', 'Tiramisu', 'Coffee-soaked layered Italian dessert.', 199.00, 'Dessert', TRUE, FALSE, 6, 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714522300000, 1714522300000),

('itm-501', 'rest-105', 'Quinoa Buddha Bowl', 'Quinoa, chickpeas, greens, and tahini dressing.', 289.00, 'Main Course', TRUE, FALSE, 12, 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714522400000, 1714522400000),
('itm-502', 'rest-105', 'Falafel Wrap', 'Whole wheat wrap with crispy falafel and hummus.', 229.00, 'Main Course', TRUE, FALSE, 10, 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714522500000, 1714522500000),
('itm-503', 'rest-105', 'Grilled Veg Sandwich', 'Multigrain sandwich with grilled seasonal veggies.', 189.00, 'Main Course', TRUE, FALSE, 9, 'https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714522600000, 1714522600000),
('itm-504', 'rest-105', 'Avocado Toast', 'Toasted sourdough topped with avocado mash.', 249.00, 'Appetizer', TRUE, FALSE, 8, 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714522700000, 1714522700000),
('itm-505', 'rest-105', 'Fruit Parfait', 'Layered yogurt, granola, and fresh fruits.', 159.00, 'Dessert', TRUE, FALSE, 5, 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714522800000, 1714522800000),
('itm-506', 'rest-105', 'Cold Pressed Juice', 'Detox blend of carrot, orange, and ginger.', 129.00, 'Beverage', TRUE, FALSE, 4, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714522900000, 1714522900000),

('itm-601', 'rest-106', 'Smoked Chicken Platter', 'Slow-smoked chicken served with mashed potatoes.', 489.00, 'Main Course', FALSE, TRUE, 25, 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714523000000, 1714523000000),
('itm-602', 'rest-106', 'BBQ Wings', 'House BBQ glazed wings with herbs.', 329.00, 'Appetizer', FALSE, TRUE, 18, 'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714523100000, 1714523100000),
('itm-603', 'rest-106', 'Grilled Fish Fillet', 'Fresh fish fillet with lemon butter sauce.', 459.00, 'Main Course', FALSE, FALSE, 20, 'https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714523200000, 1714523200000),
('itm-604', 'rest-106', 'Loaded Fries', 'Fries topped with cheese, jalapenos, and sauces.', 219.00, 'Appetizer', TRUE, TRUE, 12, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714523300000, 1714523300000),
('itm-605', 'rest-106', 'Classic Burger', 'Juicy grilled patty burger with lettuce and onion.', 279.00, 'Main Course', FALSE, FALSE, 14, 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714523400000, 1714523400000),
('itm-606', 'rest-106', 'Chocolate Shake', 'Creamy chocolate milkshake with whipped cream.', 149.00, 'Beverage', TRUE, FALSE, 5, 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714523500000, 1714523500000);

-- ============================================================
-- Seed Carts (empty carts for empty-cart UI testing)
-- ============================================================
INSERT INTO carts (cartId, userId, restaurantId, createdAt, updatedAt) VALUES
('cart-101', 'usr-101', NULL, 1714530000000, 1714530000000),
('cart-102', 'usr-102', NULL, 1714531000000, 1714531000000);

-- ============================================================
-- Seed Orders for order history module
-- ============================================================
INSERT INTO orders (orderId, userId, restaurantId, deliveryAddress, phoneNumber, subtotal, tax, deliveryCharges, discountAmount, total, orderStatus, paymentStatus, paymentMethod, specialInstructions, estimatedDeliveryTime, deliveredAt, createdAt, updatedAt) VALUES
('ORD-EC-250410-001', 'usr-101', 'rest-101', '31 Park Street, Chennai, Tamil Nadu 600001', '+91-9876500011', 618.00, 111.24, 40.00, 50.00, 719.24, 'DELIVERED', 'COMPLETED', 'UPI', 'Medium spicy only', 1714542000000, 1714543800000, 1714540200000, 1714543800000),
('ORD-EC-250411-002', 'usr-102', 'rest-104', '18 Lake View, Bengaluru, Karnataka 560034', '+91-9876500022', 848.00, 152.64, 40.00, 0.00, 1040.64, 'PREPARING', 'COMPLETED', 'CREDIT_CARD', 'Extra cheese on farmhouse pizza', 1714629300000, NULL, 1714627800000, 1714628400000),
('ORD-EC-250412-003', 'usr-101', 'rest-102', '31 Park Street, Chennai, Tamil Nadu 600001', '+91-9876500011', 298.00, 53.64, 40.00, 0.00, 391.64, 'OUT_FOR_DELIVERY', 'COMPLETED', 'DEBIT_CARD', NULL, 1714716600000, NULL, 1714714800000, 1714715400000),
('ORD-EC-250413-004', 'usr-102', 'rest-105', '18 Lake View, Bengaluru, Karnataka 560034', '+91-9876500022', 518.00, 93.24, 40.00, 30.00, 621.24, 'CONFIRMED', 'PENDING', 'WALLET', 'No plastic cutlery', 1714803900000, NULL, 1714802100000, 1714802100000);

INSERT INTO order_items (orderItemId, orderId, itemId, itemName, quantity, unitPrice, totalPrice, specialInstructions, createdAt) VALUES
('oitm-001', 'ORD-EC-250410-001', 'itm-101', 'Butter Chicken', 1, 329.00, 329.00, 'Medium spicy only', 1714540200000),
('oitm-002', 'ORD-EC-250410-001', 'itm-103', 'Garlic Naan', 2, 79.00, 158.00, NULL, 1714540200000),
('oitm-003', 'ORD-EC-250410-001', 'itm-105', 'Gulab Jamun', 1, 119.00, 119.00, NULL, 1714540200000),

('oitm-004', 'ORD-EC-250411-002', 'itm-402', 'Farmhouse Pizza', 1, 429.00, 429.00, 'Extra cheese', 1714627800000),
('oitm-005', 'ORD-EC-250411-002', 'itm-404', 'Pesto Pasta', 1, 319.00, 319.00, NULL, 1714627800000),
('oitm-006', 'ORD-EC-250411-002', 'itm-406', 'Tiramisu', 1, 199.00, 199.00, NULL, 1714627800000),

('oitm-007', 'ORD-EC-250412-003', 'itm-201', 'Masala Dosa', 1, 169.00, 169.00, NULL, 1714714800000),
('oitm-008', 'ORD-EC-250412-003', 'itm-202', 'Idli Sambar', 1, 129.00, 129.00, NULL, 1714714800000),

('oitm-009', 'ORD-EC-250413-004', 'itm-501', 'Quinoa Buddha Bowl', 1, 289.00, 289.00, NULL, 1714802100000),
('oitm-010', 'ORD-EC-250413-004', 'itm-502', 'Falafel Wrap', 1, 229.00, 229.00, NULL, 1714802100000);

ANALYZE TABLE users;
ANALYZE TABLE restaurants;
ANALYZE TABLE menu_items;
ANALYZE TABLE carts;
ANALYZE TABLE cart_items;
ANALYZE TABLE orders;
ANALYZE TABLE order_items;

-- Quick sanity checks
-- SELECT COUNT(*) AS restaurants_count FROM restaurants;
-- SELECT restaurantId, COUNT(*) AS menu_count FROM menu_items GROUP BY restaurantId;
-- SELECT orderId, orderStatus, total FROM orders ORDER BY createdAt DESC;
