# Fix Plan - Promotion Create/Update Errors

## Issues to Fix:
1. ✅ Update Error: "Value must be greater than 0" - FIXED
2. ✅ Create Error: "Data truncated for column 'type'" - FIX (SQL provided below)

## Tasks:
- [x] 1. Fix validateUpdatePromotion in promotions.validation.ts to allow value=0 for CUSTOM type
- [x] 2. Provide SQL command to alter database table

## Implementation:
### Fix 1: Validation Fix (COMPLETED)
- Modified validateUpdatePromotion to skip value check when type is CUSTOM

### Fix 2: Database Fix
- SQL file created: `backend/fix_database.sql`

---

## NEXT STEPS (User Action Required):

Run the following SQL command in your MySQL database to fix the column size issue:

```sql
ALTER TABLE promotions MODIFY COLUMN type VARCHAR(20) NOT NULL;
```

After running the SQL, restart your backend server:
```bash
cd backend && npm run dev
```

