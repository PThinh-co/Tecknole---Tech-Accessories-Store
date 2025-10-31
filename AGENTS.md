# AGENTS.md - Tecknole E-commerce Website

## Build/Lint/Test Commands

No build system or package manager configured. This is a static HTML/CSS/JavaScript website.

- **Development server**: Open HTML files directly in browser or use `python -m http.server` in project root
- **Live reload**: Use browser extensions or VS Code Live Server extension
- **No testing framework**: Manual testing in browser
- **No linter**: Manual code review
- **No single test command**: Test individual pages by opening in browser

## Architecture and Codebase Structure

**Type**: Static e-commerce website for tech accessories (Vietnamese market)

**Key Directories**:
- `/`: HTML pages (index.html, cart.html, products.html, etc.)
- `assets/css/`: Stylesheets (reset.css, base.css, style.css)
- `assets/js/`: JavaScript modules (utils.js, cart-ui.js, auth.js, etc.)
- `assets/images/`: Product images, logos, and UI assets
- `assets/bootstrap-5.3.2-dist/`: Bootstrap 5.3.2 framework

**Pages**:
- index.html: Homepage with hero section and featured products
- products.html: Product listing page
- product-detail.html: Individual product pages
- cart.html: Shopping cart interface
- checkout.html: Checkout process
- profile.html: User profile management
- admin.html: Admin dashboard

**No backend**: Uses localStorage for cart/auth state, no database or server-side APIs.

## Code Style Guidelines

**HTML**:
- Use semantic HTML5 elements
- Vietnamese language content (`lang="vi"`)
- Bootstrap classes for responsive design
- Consistent indentation (2 spaces)

**CSS**:
- CSS custom properties for colors (`--color-one`, `--color-two`, etc.)
- Organized sections with clear comments
- BEM-like naming: `.header`, `.product-card`, `.cart-container`
- Mobile-first responsive design

**JavaScript**:
- ES6+ features (arrow functions, template literals, destructuring)
- Functional programming style
- Error handling with try/catch for localStorage operations
- Utility functions in `utils.js` for common operations
- Vietnamese comments and user-facing strings
- Modular structure with separate files per feature

**Naming Conventions**:
- Functions: camelCase (`formatCurrency`, `isValidEmail`)
- CSS classes: kebab-case with hyphens (`.product-card`, `.header-top`)
- Variables: camelCase (`userData`, `cartItems`)
- Files: kebab-case (`product-detail.js`, `cart-ui.js`)

**Error Handling**:
- Try/catch blocks for localStorage operations
- User-friendly Vietnamese error messages
- Graceful fallbacks for missing data
