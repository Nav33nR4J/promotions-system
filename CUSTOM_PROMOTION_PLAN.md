# Implementation Plan: Custom Promotion Type with Menu Items

## Overview
Add a new "CUSTOM" promotion type that allows selecting multiple menu items with individual discounts or combo discounts.

## Data Structure

### Menu Item
```typescript
interface MenuItem {
  id: string;
  name: string;
  price: number;
}
```

### Custom Item Discount
```typescript
interface CustomItemDiscount {
  item_id: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
}
```

### Combo Discount
```typescript
interface ComboDiscount {
  item_ids: string[]; // Array of item IDs that form a combo
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
}
```

### Custom Promotion Structure
```typescript
interface CustomPromotion {
  type: "CUSTOM";
  custom_items: CustomItemDiscount[];  // Individual item discounts
  combos: ComboDiscount[];              // Combo discounts
}
```

## Implementation Steps

### Step 1: Create Menu Data File
- Create `src/data/menu.ts` with sample menu items
- Export MenuItem[] type and data

### Step 2: Update Backend Types
- **File**: `backend/src/types/promotions.types.ts`
- Add PromoType = "PERCENTAGE" | "FIXED" | "CUSTOM"
- Add CustomItemDiscount and ComboDiscount interfaces

### Step 3: Update Backend Validation
- **File**: `backend/src/validations/promotions.validation.ts`
- Add validation for CUSTOM type (require custom_items array)

### Step 4: Update Backend Repository
- **File**: `backend/src/modules/promotions/promotions.repository.ts`
- Store custom_items as JSON in the database
- Parse JSON when fetching

### Step 5: Update Backend Service
- **File**: `backend/src/modules/promotions/promotions.service.ts`
- Add CUSTOM type to validation logic

### Step 6: Update Redux Slice
- **File**: `src/redux/slices/promotionsSlice.ts`
- Add CUSTOM type to Promotion interface
- Add custom_items and combos fields

### Step 7: Update PromotionForm Component
- **File**: `src/components/organisms/PromotionForm.tsx`
- Add CUSTOM option to type modal
- When CUSTOM selected:
  - Show menu item selector (checkboxes)
  - Allow adding individual discounts per selected item
  - Allow creating combo discounts (select 2+ items, add combo discount)
- Update validation logic for CUSTOM type

## UI/UX Flow for CUSTOM Type

1. User selects "CUSTOM" from discount type dropdown
2. Menu items list appears with checkboxes
3. User selects items they want to include
4. For each selected item:
   - User can set individual discount (percentage or fixed)
5. User can optionally create combos:
   - Select 2+ items
   - Set combo discount (applied when all combo items are purchased together)

## Database Schema Changes
Add `custom_items` JSON column to store:
```json
{
  "items": [
    { "item_id": "item1", "discount_type": "PERCENTAGE", "discount_value": 10 },
    { "item_id": "item2", "discount_type": "FIXED", "discount_value": 50 }
  ],
  "combos": [
    { "item_ids": ["item1", "item2"], "discount_type": "PERCENTAGE", "discount_value": 20 }
  ]
}
```

## Files to Create
1. `src/data/menu.ts` - Menu items data

## Files to Modify
1. `backend/src/types/promotions.types.ts`
2. `backend/src/validations/promotions.validation.ts`
3. `backend/src/modules/promotions/promotions.repository.ts`
4. `backend/src/modules/promotions/promotions.service.ts`
5. `src/redux/slices/promotionsSlice.ts`
6. `src/components/organisms/PromotionForm.tsx`

