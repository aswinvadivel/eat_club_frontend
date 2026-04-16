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
  user_id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER' NOT NULL,
  phone_number VARCHAR(20),
  address TEXT,
  profile_image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at BIGINT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_active (is_active)
) ENGINE=InnoDB;

CREATE TABLE restaurants (
  restaurant_id VARCHAR(36) PRIMARY KEY,
  admin_id VARCHAR(36) NOT NULL,
  restaurant_name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone_number VARCHAR(20),
  cuisine_type VARCHAR(100),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_restaurants_admin (admin_id),
  INDEX idx_restaurants_name (restaurant_name),
  INDEX idx_restaurants_active (is_active),
  INDEX idx_restaurants_cuisine (cuisine_type)
) ENGINE=InnoDB;

CREATE TABLE menu_items (
  item_id VARCHAR(36) PRIMARY KEY,
  restaurant_id VARCHAR(36) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_spicy BOOLEAN DEFAULT FALSE,
  preparation_time INT DEFAULT 20,
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT TRUE,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
  INDEX idx_menu_restaurant (restaurant_id),
  INDEX idx_menu_category (category),
  INDEX idx_menu_available (is_available),
  INDEX idx_menu_veg (is_vegetarian)
) ENGINE=InnoDB;

CREATE TABLE carts (
  cart_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  restaurant_id VARCHAR(36) NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE SET NULL,
  INDEX idx_carts_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE cart_items (
  cart_item_id VARCHAR(36) PRIMARY KEY,
  cart_id VARCHAR(36) NOT NULL,
  item_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  special_instructions TEXT,
  added_at BIGINT NOT NULL,
  FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (cart_id, item_id),
  INDEX idx_cart_items_cart (cart_id),
  INDEX idx_cart_items_item (item_id)
) ENGINE=InnoDB;

CREATE TABLE orders (
  order_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  restaurant_id VARCHAR(36) NOT NULL,
  delivery_address TEXT NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_charges DECIMAL(10,2) NOT NULL DEFAULT 40.00,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  order_status ENUM('CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') DEFAULT 'CONFIRMED',
  payment_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
  payment_method VARCHAR(50),
  special_instructions TEXT,
  estimated_delivery_time BIGINT,
  delivered_at BIGINT NULL,
  cancelled_at BIGINT NULL,
  cancellation_reason VARCHAR(255),
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE RESTRICT,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_restaurant (restaurant_id),
  INDEX idx_orders_status (order_status),
  INDEX idx_orders_createdAt (created_at)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  order_item_id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  item_id VARCHAR(36) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  created_at BIGINT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE RESTRICT,
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_item (item_id)
) ENGINE=InnoDB;

-- ============================================================
-- Seed Users
-- Password hint for test users: password123
-- ============================================================
INSERT INTO users (user_id, name, email, password, role, phone_number, address, profile_image_url, is_active, created_at, updated_at) VALUES
('usr-101', 'Rohan Mehta', 'rohan.mehta@example.com', '$2a$10$xTgLkJoU8bYbAXVYz5Kp2e2l1m1n1o1p1q1r1s1t1u1v1w1x1y1z2', 'USER', '+91-9876500011', '31 Park Street, Chennai, Tamil Nadu 600001', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', TRUE, 1714500000000, 1714500000000),
('usr-102', 'Ananya Iyer', 'ananya.iyer@example.com', '$2a$10$xTgLkJoU8bYbAXVYz5Kp2e2l1m1n1o1p1q1r1s1t1u1v1w1x1y1z2', 'USER', '+91-9876500022', '18 Lake View, Bengaluru, Karnataka 560034', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', TRUE, 1714501000000, 1714501000000),
('adm-201', 'Kunal Arora', 'kunal.arora@eatclub.com', '$2a$10$xTgLkJoU8bYbAXVYz5Kp2e2l1m1n1o1p1q1r1s1t1u1v1w1x1y1z2', 'ADMIN', '+91-9000001111', 'Chennai, Tamil Nadu', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', TRUE, 1714502000000, 1714502000000),
('adm-202', 'Meera Nair', 'meera.nair@eatclub.com', '$2a$10$xTgLkJoU8bYbAXVYz5Kp2e2l1m1n1o1p1q1r1s1t1u1v1w1x1y1z2', 'ADMIN', '+91-9000002222', 'Bengaluru, Karnataka', 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg', TRUE, 1714503000000, 1714503000000),
('adm-203', 'Sana Qureshi', 'sana.qureshi@eatclub.com', '$2a$10$xTgLkJoU8bYbAXVYz5Kp2e2l1m1n1o1p1q1r1s1t1u1v1w1x1y1z2', 'ADMIN', '+91-9000003333', 'Hyderabad, Telangana', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', TRUE, 1714504000000, 1714504000000);

-- ============================================================
-- Seed Restaurants (6)
-- ============================================================
INSERT INTO restaurants (restaurant_id, admin_id, restaurant_name, description, address, phone_number, cuisine_type, image_url, is_active, created_at, updated_at) VALUES
('rest-101', 'adm-201', 'Bombay Spice House', 'Classic North Indian curries, kebabs, and tandoor favorites.', 'Nungambakkam High Road, Chennai', '+91-4440011001', 'North Indian', 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714510000000, 1714510000000),
('rest-102', 'adm-202', 'Coastal Curry Co', 'Authentic South Indian meals, dosas, and traditional breakfast.', 'Indiranagar 100 Feet Road, Bengaluru', '+91-8040011002', 'South Indian', 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714511000000, 1714511000000),
('rest-103', 'adm-203', 'Wok and Bowl', 'Pan-Asian bowls, noodles, and bold wok-tossed flavors.', 'Banjara Hills Road No. 12, Hyderabad', '+91-4040011003', 'Chinese', 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714512000000, 1714512000000),
('rest-104', 'adm-201', 'Firewood Pizza Lab', 'Hand-stretched sourdough pizzas and gourmet Italian comfort food.', 'Anna Nagar West, Chennai', '+91-4440011004', 'Continental', 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714513000000, 1714513000000),
('rest-105', 'adm-202', 'Green Leaf Kitchen', 'Healthy vegetarian and vegan bowls, salads, and wraps.', 'Koramangala 5th Block, Bengaluru', '+91-8040011005', 'Fast Food', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714514000000, 1714514000000),
('rest-106', 'adm-203', 'Smoke and Grill Hub', 'Smoked meats, grilled platters, and signature sauces.', 'Jubilee Hills Check Post, Hyderabad', '+91-4040011006', 'North Indian', 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714515000000, 1714515000000);

-- ============================================================
-- Seed Menu Items (6 each restaurant = 36)
-- ============================================================
INSERT INTO menu_items (item_id, restaurant_id, item_name, description, price, category, is_vegetarian, is_spicy, preparation_time, image_url, is_available, created_at, updated_at) VALUES
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
INSERT INTO carts (cart_id, user_id, restaurant_id, created_at, updated_at) VALUES
('cart-101', 'usr-101', NULL, 1714530000000, 1714530000000),
('cart-102', 'usr-102', NULL, 1714531000000, 1714531000000);

-- ============================================================
-- Seed Orders for order history module
-- ============================================================
INSERT INTO orders (order_id, user_id, restaurant_id, delivery_address, phone_number, subtotal, tax, delivery_charges, discount_amount, total, order_status, payment_status, payment_method, special_instructions, estimated_delivery_time, delivered_at, created_at, updated_at) VALUES
('ORD-EC-250410-001', 'usr-101', 'rest-101', '31 Park Street, Chennai, Tamil Nadu 600001', '+91-9876500011', 618.00, 111.24, 40.00, 50.00, 719.24, 'DELIVERED', 'COMPLETED', 'UPI', 'Medium spicy only', 1714542000000, 1714543800000, 1714540200000, 1714543800000),
('ORD-EC-250411-002', 'usr-102', 'rest-104', '18 Lake View, Bengaluru, Karnataka 560034', '+91-9876500022', 848.00, 152.64, 40.00, 0.00, 1040.64, 'PREPARING', 'COMPLETED', 'CREDIT_CARD', 'Extra cheese on farmhouse pizza', 1714629300000, NULL, 1714627800000, 1714628400000),
('ORD-EC-250412-003', 'usr-101', 'rest-102', '31 Park Street, Chennai, Tamil Nadu 600001', '+91-9876500011', 298.00, 53.64, 40.00, 0.00, 391.64, 'OUT_FOR_DELIVERY', 'COMPLETED', 'DEBIT_CARD', NULL, 1714716600000, NULL, 1714714800000, 1714715400000),
('ORD-EC-250413-004', 'usr-102', 'rest-105', '18 Lake View, Bengaluru, Karnataka 560034', '+91-9876500022', 518.00, 93.24, 40.00, 30.00, 621.24, 'CONFIRMED', 'PENDING', 'WALLET', 'No plastic cutlery', 1714803900000, NULL, 1714802100000, 1714802100000);

INSERT INTO order_items (order_item_id, order_id, item_id, item_name, quantity, unit_price, total_price, special_instructions, created_at) VALUES
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
-- SELECT restaurant_id, COUNT(*) AS menu_count FROM menu_items GROUP BY restaurant_id;
-- SELECT order_id, order_status, total FROM orders ORDER BY created_at DESC;

-- ============================================================
-- Additional Seed Restaurants (5) - snake_case IDs
-- ============================================================
INSERT INTO restaurants (restaurant_id, admin_id, restaurant_name, description, address, phone_number, cuisine_type, image_url, is_active, created_at, updated_at) VALUES
('rest_107', 'adm-201', 'Tandoor Theory', 'Signature tandoori grills, kebabs, and rich Indian mains.', 'Velachery Main Road, Chennai', '+91-4440011007', 'North Indian', 'https://images.pexels.com/photos/958546/pexels-photo-958546.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714516000000, 1714516000000),
('rest_108', 'adm-202', 'Sushi Street', 'Fresh sushi rolls, ramen bowls, and Japanese small plates.', 'HSR Layout Sector 2, Bengaluru', '+91-8040011008', 'Japanese', 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714517000000, 1714517000000),
('rest_109', 'adm-203', 'Taco Trail', 'Mexican favorites with tacos, burritos, and loaded nachos.', 'Madhapur Main Street, Hyderabad', '+91-4040011009', 'Mexican', 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714518000000, 1714518000000),
('rest_110', 'adm-201', 'Biryani Junction', 'Dum biryanis, kebabs, and classic Mughlai comfort food.', 'OMR Sholinganallur, Chennai', '+91-4440011010', 'Biryani', 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714519000000, 1714519000000),
('rest_111', 'adm-202', 'Cafe Roast Republic', 'Artisan coffee, all-day breakfast, and bakery specials.', 'MG Road, Bengaluru', '+91-8040011011', 'Cafe', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714520000000, 1714520000000);

-- ============================================================
-- Additional Seed Menu Items (6 each for new restaurants)
-- ============================================================
INSERT INTO menu_items (item_id, restaurant_id, item_name, description, price, category, is_vegetarian, is_spicy, preparation_time, image_url, is_available, created_at, updated_at) VALUES
('itm_701', 'rest_107', 'Chicken Tikka', 'Char-grilled chicken tikka with house spices.', 289.00, 'Appetizer', FALSE, TRUE, 16, 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714523600000, 1714523600000),
('itm_702', 'rest_107', 'Dal Makhani', 'Slow-cooked black lentils in buttery gravy.', 239.00, 'Main Course', TRUE, FALSE, 18, 'https://images.pexels.com/photos/12737811/pexels-photo-12737811.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714523700000, 1714523700000),
('itm_703', 'rest_107', 'Paneer Tikka', 'Smoky paneer cubes with onion and capsicum.', 269.00, 'Appetizer', TRUE, TRUE, 14, 'https://images.pexels.com/photos/12737918/pexels-photo-12737918.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714523800000, 1714523800000),
('itm_704', 'rest_107', 'Jeera Rice', 'Fragrant basmati rice tempered with cumin.', 129.00, 'Rice', TRUE, FALSE, 10, 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714523900000, 1714523900000),
('itm_705', 'rest_107', 'Butter Naan', 'Soft tandoor naan finished with butter.', 69.00, 'Bread', TRUE, FALSE, 7, 'https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714524000000, 1714524000000),
('itm_706', 'rest_107', 'Mango Lassi', 'Chilled mango yogurt drink.', 99.00, 'Beverage', TRUE, FALSE, 5, 'https://images.pexels.com/photos/5946623/pexels-photo-5946623.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714524100000, 1714524100000),

('itm_801', 'rest_108', 'California Roll', 'Crab, cucumber, and avocado sushi roll.', 349.00, 'Main Course', FALSE, FALSE, 14, 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714524200000, 1714524200000),
('itm_802', 'rest_108', 'Veg Tempura', 'Crispy battered seasonal vegetables.', 259.00, 'Appetizer', TRUE, FALSE, 12, 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714524300000, 1714524300000),
('itm_803', 'rest_108', 'Chicken Ramen', 'Rich broth ramen with chicken and egg.', 389.00, 'Main Course', FALSE, TRUE, 18, 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714524400000, 1714524400000),
('itm_804', 'rest_108', 'Veg Udon', 'Stirred udon noodles with mixed veggies.', 299.00, 'Main Course', TRUE, FALSE, 15, 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714524500000, 1714524500000),
('itm_805', 'rest_108', 'Matcha Cheesecake', 'Creamy cheesecake with matcha notes.', 229.00, 'Dessert', TRUE, FALSE, 7, 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714524600000, 1714524600000),
('itm_806', 'rest_108', 'Iced Matcha Latte', 'Cold matcha latte with milk.', 179.00, 'Beverage', TRUE, FALSE, 4, 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714524700000, 1714524700000),

('itm_901', 'rest_109', 'Chicken Tacos', 'Soft tacos with grilled chicken and salsa.', 279.00, 'Main Course', FALSE, TRUE, 12, 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714524800000, 1714524800000),
('itm_902', 'rest_109', 'Bean Burrito', 'Flour tortilla stuffed with beans and rice.', 249.00, 'Main Course', TRUE, FALSE, 13, 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714524900000, 1714524900000),
('itm_903', 'rest_109', 'Loaded Nachos', 'Corn chips with cheese, jalapenos, and salsa.', 229.00, 'Appetizer', TRUE, TRUE, 10, 'https://images.pexels.com/photos/5737247/pexels-photo-5737247.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714525000000, 1714525000000),
('itm_904', 'rest_109', 'Chicken Quesadilla', 'Toasted tortilla with chicken and cheese.', 299.00, 'Main Course', FALSE, TRUE, 14, 'https://images.pexels.com/photos/5848490/pexels-photo-5848490.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714525100000, 1714525100000),
('itm_905', 'rest_109', 'Churros', 'Cinnamon sugar churros with chocolate dip.', 169.00, 'Dessert', TRUE, FALSE, 8, 'https://images.pexels.com/photos/6163263/pexels-photo-6163263.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714525200000, 1714525200000),
('itm_906', 'rest_109', 'Lime Soda', 'Fresh lime soda with mint.', 99.00, 'Beverage', TRUE, FALSE, 4, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714525300000, 1714525300000),

('itm_1001', 'rest_110', 'Hyderabadi Chicken Biryani', 'Dum-cooked biryani with saffron basmati rice.', 379.00, 'Main Course', FALSE, TRUE, 28, 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714525400000, 1714525400000),
('itm_1002', 'rest_110', 'Veg Dum Biryani', 'Aromatic layered biryani with vegetables.', 319.00, 'Main Course', TRUE, TRUE, 24, 'https://images.pexels.com/photos/5409021/pexels-photo-5409021.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714525500000, 1714525500000),
('itm_1003', 'rest_110', 'Mutton Seekh Kebab', 'Juicy minced mutton kebabs from tandoor.', 349.00, 'Appetizer', FALSE, TRUE, 18, 'https://images.pexels.com/photos/236781/pexels-photo-236781.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714525600000, 1714525600000),
('itm_1004', 'rest_110', 'Mirchi Ka Salan', 'Classic spicy peanut-sesame gravy.', 189.00, 'Main Course', TRUE, TRUE, 14, 'https://images.pexels.com/photos/5410407/pexels-photo-5410407.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714525700000, 1714525700000),
('itm_1005', 'rest_110', 'Double Ka Meetha', 'Bread pudding dessert with dry fruits.', 149.00, 'Dessert', TRUE, FALSE, 7, 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714525800000, 1714525800000),
('itm_1006', 'rest_110', 'Raita', 'Cooling yogurt with onion and herbs.', 79.00, 'Sides', TRUE, FALSE, 5, 'https://images.pexels.com/photos/15108544/pexels-photo-15108544.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714525900000, 1714525900000),

('itm_1101', 'rest_111', 'Classic Cappuccino', 'Espresso with steamed milk foam.', 149.00, 'Beverage', TRUE, FALSE, 5, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714526000000, 1714526000000),
('itm_1102', 'rest_111', 'Cold Brew', 'Slow-steeped chilled black coffee.', 169.00, 'Beverage', TRUE, FALSE, 4, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714526100000, 1714526100000),
('itm_1103', 'rest_111', 'Avocado Sandwich', 'Multigrain sandwich with avocado and greens.', 259.00, 'Main Course', TRUE, FALSE, 10, 'https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714526200000, 1714526200000),
('itm_1104', 'rest_111', 'Pancake Stack', 'Fluffy pancakes with maple syrup.', 239.00, 'Breakfast', TRUE, FALSE, 12, 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714526300000, 1714526300000),
('itm_1105', 'rest_111', 'Blueberry Muffin', 'Freshly baked muffin with blueberries.', 129.00, 'Bakery', TRUE, FALSE, 6, 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714526400000, 1714526400000),
('itm_1106', 'rest_111', 'Chocolate Croissant', 'Buttery croissant filled with chocolate.', 149.00, 'Bakery', TRUE, FALSE, 6, 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=1200', TRUE, 1714526500000, 1714526500000);

-- Optional verification for newly added records
-- SELECT COUNT(*) AS new_restaurants_count FROM restaurants WHERE restaurant_id IN ('rest_107','rest_108','rest_109','rest_110','rest_111');
-- SELECT restaurant_id, COUNT(*) AS menu_count FROM menu_items WHERE restaurant_id IN ('rest_107','rest_108','rest_109','rest_110','rest_111') GROUP BY restaurant_id ORDER BY restaurant_id;

