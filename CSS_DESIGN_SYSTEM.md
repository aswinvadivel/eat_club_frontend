# EatClub Frontend - CSS Architecture & Design System

## Overview
The frontend has been reorganized with a professional, modular CSS architecture featuring:
- **Green & Black Color Scheme** (Swiggy/Zomato style)
- **Mobile-First Responsive Design**
- **Component-Scoped Styling**
- **Consistent Design System with CSS Variables**

## Color Palette

### Primary Colors
- **Primary Green**: `#1DB854` - Main brand color (buttons, links, accents)
- **Dark Green**: `#0B6C39` - Hover states, emphasized text
- **Black**: `#1C1C1C` - Body text, headings
- **Off-Black**: `#2C2C2C` - Secondary text

### Neutral Colors
- **White**: `#FFFFFF` - Card backgrounds, text backgrounds
- **Light Gray**: `#F5F5F5` - Page background, disabled states
- **Medium Gray**: `#757575` - Secondary text, placeholders
- **Dark Gray**: `#424242` - Body text
- **Border Color**: `#E8E8E8` - Dividers, borders

### Semantic Colors
- **Success**: `#1DB854` (green)
- **Error**: `#D32F2F` (red)
- **Warning**: `#F57C00` (orange)
- **Info**: `#1976D2` (blue)

## CSS File Structure

### Core System
- **`index.css`** - Global styles, design system variables, base typography, utility classes
- **`App.css`** - App layout, main container styling

### Component-Specific Styles
- **`Header.css`** - Header navigation, logo, user menu, cart badge, mobile nav
- **`RestaurantCard.css`** - Restaurant card grid, images, rating badges
- **`MenuItem.css`** - Menu items, quantity controls, price display
- **`RestaurantFilter.css`** - Search bars, filter buttons, sort dropdowns
- **`Loading.css`** - Loading spinners, skeleton screens, progress bars

### Page Layouts
- **`Pages.css`** - Page containers, layouts, sidebars, empty states, card grids

## Design Tokens

### Spacing
```
--spacing-xs:  0.25rem (4px)
--spacing-sm:  0.5rem  (8px)
--spacing-md:  1rem    (16px)
--spacing-lg:  1.5rem  (24px)
--spacing-xl:  2rem    (32px)
--spacing-2xl: 3rem    (48px)
```

### Border Radius
```
--border-radius-sm:  4px
--border-radius-md:  8px
--border-radius-lg:  12px
--border-radius-xl:  16px
```

### Shadows
```
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.08)
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.12)
--shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.15)
--shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.2)
```

### Typography
```
--font-size-xs:   0.75rem   (12px)
--font-size-sm:   0.875rem  (14px)
--font-size-base: 1rem      (16px)
--font-size-lg:   1.125rem  (18px)
--font-size-xl:   1.25rem   (20px)
--font-size-2xl:  1.5rem    (24px)
--font-size-3xl:  1.875rem  (30px)
```

### Transitions
```
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-fast: all 0.15s ease-in-out
```

## Button Variants

### Primary Button
```jsx
<button className="btn-primary">Click me</button>
```
- Background: Primary Green
- Hover: Dark Green with shadow
- Disabled: Medium Gray

### Secondary Button
```jsx
<button className="btn-secondary">Click me</button>
```
- Background: White
- Border: Primary Green
- Hover: Light green background

### Ghost Button
```jsx
<button className="btn-ghost">Click me</button>
```
- Background: Transparent
- Border: Light border
- Hover: Light gray background

### Size Variants
- `.btn-small` - Compact button
- `.btn-large` - Large button

## Component Guide

### Header Component (`Header.css`)
- Sticky header with logo
- Desktop navigation with underline hover effect
- Cart badge with item counter
- User avatar dropdown menu
- Mobile navigation toggle
- Professional green branding

**Key Classes:**
- `.header` - Main header container
- `.header-nav` - Desktop navigation
- `.cart-badge` - Shopping cart icon with count
- `.user-avatar` - User profile avatar
- `.user-dropdown` - User menu dropdown

### Restaurant Card (`RestaurantCard.css`)
- Responsive grid layout (auto-fills based on screen size)
- Image with 16:9 aspect ratio
- Rating badge (green background)
- Meta information (time, orders, location)
- Hover animation (lifts up)
- Skeleton loading state

**Key Classes:**
- `.restaurant-grid` - Responsive grid container
- `.restaurant-card` - Individual card
- `.restaurant-image` - Image container with aspect ratio
- `.restaurant-rating` - Green rating badge
- `.restaurant-meta` - Info icons and text

### Menu Item (`MenuItem.css`)
- Horizontal layout with image and content
- Vegetarian/Spicy badges (color-coded)
- Quantity selector with +/- buttons
- "Add to Cart" button in green
- Special instructions textarea
- Unavailable state with reduced opacity

**Key Classes:**
- `.menu-item` - Item container
- `.menu-item-badge.vegetarian` - Green veg badge
- `.menu-item-badge.spicy` - Red spicy badge
- `.quantity-control` - Quantity selector
- `.add-to-cart-btn` - Add button

### Filter Panel (`RestaurantFilter.css`)
- Search bar with icon positioning
- Cuisine type filter buttons
- Vegetarian filter checkbox
- Sort dropdown
- Mobile-responsive with toggle button
- Filter chips display

**Key Classes:**
- `.filter-panel` - Main filter container
- `.search-bar` - Search input with icon
- `.filter-button` - Filter option button
- `.filter-button.active` - Active filter state
- `.vegetarian-filter` - Veg-specific styling

### Loading Component (`Loading.css`)
- Smooth spinning animation
- Pulsing dots animation
- Wave animation
- Skeleton screens for content preview

**Key Classes:**
- `.spinner` - Main loading spinner
- `.spinner-dot` - Pulsing dot animation
- `.skeleton-line` - Content skeleton

## Responsive Breakpoints

### Tablet & Below (max-width: 768px)
- Mobile menu appears
- Navigation becomes hamburger menu
- Filters become collapsible
- Reduced spacing
- Adjusted typography

### Mobile (max-width: 480px)
- Increased touch targets
- Stacked layouts
- Single column grids
- Reduced font sizes
- Minimal spacing

### Extra Small (max-width: 360px)
- 2-column grids for cards
- Maximum space optimization
- Reduced animations for performance

## Mobile Responsive Features

### Header
- Hamburger menu on small screens
- Collapsible navigation
- Maintained cart and user menu

### Restaurant Grid
- Adapts from 5+ columns to 2 columns
- Maintains card proportions
- Touch-friendly spacing

### Menu Items
- Stacks vertically on mobile
- Full-width images
- Easy quantity adjustment
- Large touch targets for buttons

### Filters
- Collapsible filter panel
- Mobile-optimized search
- Button-based cuisine filters
- Checkbox for vegetarian filter

## Utility Classes

```css
.flex                 /* Display flex */
.flex-col            /* Flex direction column */
.flex-center         /* Center content */
.gap-sm / -md / -lg  /* Gap spacing */
.text-center / -left / -right
.mt-md / mb-md       /* Margin top/bottom */
.p-md                /* Padding */
.rounded-md          /* Border radius */
.shadow-sm / -md     /* Box shadows */
```

## Best Practices

1. **Use CSS Variables** - Never hardcode colors or values
   ```css
   /* Good */
   color: var(--primary-green);
   padding: var(--spacing-md);
   
   /* Avoid */
   color: #1DB854;
   padding: 16px;
   ```

2. **Mobile-First Approach** - Start with mobile styles, add breakpoints
   ```css
   /* Base mobile styles */
   .container { padding: var(--spacing-md); }
   
   /* Desktop adjustments */
   @media (min-width: 768px) {
     .container { padding: var(--spacing-lg); }
   }
   ```

3. **Semantic Naming** - Use meaningful class names
   ```css
   /* Good */
   .restaurant-card
   .menu-item-badge
   
   /* Avoid */
   .card-green
   .item-label
   ```

4. **Component Scoping** - Keep styles in component files
   - Import CSS directly in components
   - Avoid global component styles
   - Use specific class names to prevent conflicts

## Import Structure

Each component should import its CSS:

```jsx
// Header.jsx
import '../styles/Header.css';

// RestaurantCard.jsx
import '../styles/RestaurantCard.css';

// etc.
```

## Future Enhancements

- Dark mode support (add dark theme CSS variables)
- Animation library integration (smooth page transitions)
- Accessibility improvements (ARIA labels, focus states)
- Print styles (for receipts, confirmations)
- Advanced breakpoints for landscape mobile

## Component File Map

| Component | CSS File | Key Classes |
|-----------|----------|------------|
| Header | Header.css | .header, .header-nav, .user-dropdown |
| RestaurantCard | RestaurantCard.css | .restaurant-card, .restaurant-grid |
| MenuItem | MenuItem.css | .menu-item, .quantity-control |
| RestaurantFilter | RestaurantFilter.css | .filter-panel, .filter-button |
| Loading | Loading.css | .spinner, .skeleton-line |
| App | App.css | .app-layout, .content-wrapper |
| Pages | Pages.css | .page-container, .empty-state |

---

**Last Updated:** April 2026
**Design System Version:** 1.0
**Mobile Support:** iOS, Android, Web
**Browser Support:** All modern browsers (Chrome, Firefox, Safari, Edge)
