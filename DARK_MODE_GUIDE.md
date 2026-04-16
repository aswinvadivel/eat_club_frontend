# EatClub Dark Mode Implementation Guide

## Overview
The EatClub frontend now includes a complete light/dark mode theme system with persistent user preference storage and smooth transitions.

## Features

✅ **Theme Toggle Button** - Located in the header's top right corner
✅ **Persistent Storage** - User theme preference saved in localStorage
✅ **System Preference Detection** - Respects OS dark mode settings on first visit
✅ **Smooth Transitions** - All color changes animate smoothly
✅ **Complete Coverage** - Every component updated for both themes
✅ **WCAG Compliant** - Proper color contrasts in both modes

## How It Works

### Theme Context
The `ThemeContext` manages the theme state globally using React Context API.

**Location:** `src/context/ThemeContext.jsx`

**Key Functions:**
- `useTheme()` - Hook to access theme state and toggle function
- `toggleTheme()` - Switches between light and dark mode
- `isDark` - Boolean indicating current theme

### Theme Application
Theme is applied via the `data-theme` attribute on the HTML element:
```html
<!-- Light Mode -->
<html data-theme="light">

<!-- Dark Mode -->
<html data-theme="dark">
```

### CSS Variables System

The application uses CSS variables organized in two groups:

#### Light Mode (Default)
```css
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --text-primary: #1C1C1C;
  --text-secondary: #757575;
  /* ... more variables */
}
```

#### Dark Mode
```css
[data-theme="dark"] {
  --bg-primary: #121212;
  --bg-secondary: #1E1E1E;
  --text-primary: #E0E0E0;
  --text-secondary: #B0B0B0;
  /* ... more variables */
}
```

## Component Integration

### Theme Toggle Button
Located in `Header.jsx`, the toggle button shows:
- 🌕 **Sun Icon** in dark mode (click to switch to light)
- 🌙 **Moon Icon** in light mode (click to switch to dark)

**Location in Header:** Top right corner, next to cart and user menu

### Styling with Theme Variables

All components use theme-aware CSS variables:

```css
/* Good - Uses theme variables */
background-color: var(--card-bg);
color: var(--text-primary);
border: 1px solid var(--card-border);

/* Avoid - Hardcoded colors */
background-color: #FFFFFF;
color: #1C1C1C;
```

## CSS Variables Reference

### Background Colors
```
--bg-primary      /* Main page background */
--bg-secondary    /* Secondary background (sidebar, inputs) */
--bg-tertiary     /* Tertiary background (hover states) */
--card-bg         /* Card/component background */
--input-bg        /* Input field background */
```

### Text Colors
```
--text-primary    /* Main text color */
--text-secondary  /* Secondary text (labels, descriptions) */
--text-tertiary   /* Tertiary text (placeholders, hints) */
```

### Border & Divider Colors
```
--card-border     /* Card and input borders */
```

### Theme-Independent Colors
```
--primary-green   /* #1DB854 - Main brand (same in both themes) */
--dark-green      /* #0B6C39 - Brand dark (same in both themes) */
--error           /* #D32F2F - Error red (same in both themes) */
--success         /* #1DB854 - Success green (same in both themes) */
--warning         /* #F57C00 - Warning orange (same in both themes) */
--info            /* #1976D2 - Info blue (same in both themes) */
```

## Color Schemes

### Light Mode Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Background | #FFFFFF | Primary backgrounds |
| Secondary BG | #F5F5F5 | Secondary areas |
| Primary Text | #1C1C1C | Main text |
| Secondary Text | #757575 | Secondary text |
| Border | #E8E8E8 | Borders, dividers |
| Primary Green | #1DB854 | Buttons, links |
| Dark Green | #0B6C39 | Hover states |

### Dark Mode Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Background | #121212 | Primary backgrounds |
| Secondary BG | #1E1E1E | Secondary areas |
| Primary Text | #E0E0E0 | Main text |
| Secondary Text | #B0B0B0 | Secondary text |
| Border | #2C2C2C | Borders, dividers |
| Primary Green | #1DB854 | Buttons, links (same) |
| Dark Green | #0B6C39 | Hover states (same) |

## Storage

Theme preference is stored in localStorage under the key `theme-preference`:

```javascript
// Check current theme
const currentTheme = localStorage.getItem('theme-preference');

// Set theme manually
localStorage.setItem('theme-preference', 'dark');
localStorage.setItem('theme-preference', 'light');
```

## System Preference Detection

On first visit, the app respects the user's OS dark mode setting:

```javascript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

This ensures a seamless experience for new users.

## Components Updated

All components have been updated to use theme variables:

- ✅ Header (with new theme toggle button)
- ✅ RestaurantCard
- ✅ MenuItem
- ✅ RestaurantFilter
- ✅ Loading
- ✅ Page layouts
- ✅ Forms and inputs
- ✅ Buttons and controls

## Adding Theme Support to New Components

When creating new components:

1. **Import the hook** (if needed):
```javascript
import { useTheme } from '../context/ThemeContext';
```

2. **Use theme variables** in CSS:
```css
.my-component {
  background-color: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--card-border);
}
```

3. **No need to manually detect theme** - CSS variables handle everything!

## Transitions

All color changes include smooth transitions defined in index.css:

```css
body {
  transition: background-color var(--transition), color var(--transition);
}
```

Standard timing: **0.3 seconds** with cubic-bezier easing.

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 85+
- ✅ Safari 15+
- ✅ All modern browsers supporting CSS variables

## Accessibility

### Color Contrast
Both light and dark modes maintain WCAG AA contrast ratios:
- Text: 4.5:1 minimum for normal text
- Large text: 3:1 minimum for 18pt+ text

### Focus States
Theme toggle button includes visible focus states for keyboard navigation.

### Reduced Motion
Consider respecting `prefers-reduced-motion` for users with motion sensitivity:

```css
@media (prefers-reduced-motion: reduce) {
  body {
    transition: none;
  }
}
```

## Testing

### Manual Testing Checklist
- [ ] Toggle theme and verify all components update
- [ ] Refresh page and theme preference persists
- [ ] Test on different browsers
- [ ] Verify colors meet contrast requirements
- [ ] Check all page types (home, restaurant, admin, etc.)
- [ ] Test mobile responsiveness in both modes

### System Preference Testing
1. Set OS to dark mode
2. Clear browser localStorage
3. Visit app - should load in dark mode

## Future Enhancements

- Auto-detect theme based on time of day
- Theme previews before switching
- Custom theme creation
- Theme scheduling
- High contrast mode
- Color blindness-friendly themes

## Troubleshooting

### Theme not persisting
- Clear browser localStorage
- Check if localStorage is enabled

### Toggle button not working
- Verify ThemeProvider wraps the app in App.jsx
- Check console for errors

### Colors not changing
- Verify data-theme attribute is set
- Check CSS variable names match
- Ensure no !important declarations override variables

---

**Last Updated:** April 2026
**Version:** 1.0
**Status:** Production Ready
