# TODO - Promo Code Validation Feature

## Task: Create small floating button on main page with popup for promo code validation

### Steps:
1. [x] Add floating round button on HomeScreen
2. [x] Add modal popup with input field for promo code
3. [x] Add validation logic connecting to backend API
4. [x] Display color-coded status: INVALID (red), DISABLED (orange), ENABLED (green)

### Implementation Details:
- A small floating round button (56x56) with a checkmark (✓) is positioned at bottom-right of HomeScreen
- Clicking the button opens a modal popup
- Modal contains: Input field for promo code, Validate button
- After validation, displays status:
  - 🟢 ENABLED (green): Promo code is valid and active
  - 🟠 DISABLED (orange): Promo code exists but is inactive/expired
  - 🔴 INVALID (red): Promo code not found
- Uses existing backend /api/promotions/validate endpoint

