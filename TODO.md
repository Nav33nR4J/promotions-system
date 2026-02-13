# TODO: Fix server hanging issue on port 5000

## Problem
Server hangs and nothing is displayed because:
1. `connectDB()` blocks indefinitely waiting for database connection
2. No timeout handling on database operations

## Plan
- [x] Update `backend/src/config/db.ts` - Add timeout to database operations
- [x] Update `backend/src/server.ts` - Add timeout wrapper for connectDB and handle DB connection errors gracefully
- [ ] Test the server starts without blocking

