# Promotions System - Implementation Plan

## 1. Backend Enhancements

### 1.1 Update Types
- Add optional fields for edit/update operations

### 1.2 Update Repository
- Add `updatePromotionRepo` function
- Add `togglePromotionStatusRepo` function
- Add `deletePromotionRepo` function

### 1.3 Update Service
- Add `updatePromotionService` function
- Add `togglePromotionStatusService` function
- Add `deletePromotionService` function

### 1.4 Update Controller
- Add `updatePromotion` handler
- Add `togglePromotionStatus` handler
- Add `deletePromotion` handler

### 1.5 Update Routes
- Add PUT route for update
- Add PATCH route for toggle status
- Add DELETE route for delete

### 1.6 Consolidate Warnings
- Move all custom warnings to `warnings.ts`
- Create functions for all warning messages

## 2. Frontend Enhancements

### 2.1 Create Unified Styles
- Create `src/theme/styles.ts` - All CSS/styles in one file using StyleSheet.flatten pattern

### 2.2 Update Redux Slice
- Add updatePromotion async thunk
- Add togglePromotionStatus async thunk
- Add deletePromotion async thunk
- Add memoization where needed

### 2.3 Update PromotionCard
- Add gradient styling
- Add toggle switch for enable/disable
- Add edit and delete icons
- Show status with color coding

### 2.4 Update PromotionList
- Add filter tabs (Active/Upcoming/Expired)
- Add pull-to-refresh
- Add loading states

### 2.5 Update HomeScreen
- Add filter tabs UI
- Better header with gradient

### 2.6 Update CreatePromotionScreen
- Handle edit mode
- Better date picker UI

### 2.7 Create Edit Promotion Screen
- New screen for editing promotions

## 3. Code Quality

### 3.1 Modularization
- Ensure no file exceeds 250 lines
- Split large files if needed

### 3.2 Memoization
- Use React.memo for components
- Use useMemo for expensive calculations

### 3.3 No Duplication
- Extract common logic to utilities

## Dependencies
- Already have react-native-linear-gradient for gradients
- Need icons - use react-native-vector-icons or similar

