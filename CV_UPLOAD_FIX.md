# CV Upload - File Corruption Fix

## Problem
Downloaded CV files were corrupted because the base64 data was being truncated in the database.

## Root Cause
The `cv_url` column in the `applications` table was defined as `TEXT` type, which has a maximum length of 65,535 characters (64KB). A 5MB PDF file encoded in base64 becomes approximately 6.7MB of text data, which exceeds this limit.

When the data was inserted, MySQL silently truncated it at 65,535 characters, resulting in corrupted/incomplete files.

## Solution

### 1. Update Database Schema
Run the SQL migration to change the column type from `TEXT` to `LONGTEXT`:

```bash
# In phpMyAdmin, select matchy_db database and run:
```

```sql
ALTER TABLE applications MODIFY COLUMN cv_url LONGTEXT;
```

Or run the migration file:
```bash
mysql -u root -p matchy_db < database/fix_cv_column.sql
```

### 2. Column Type Comparison
- `TEXT`: Max 65,535 characters (64KB) - ❌ Too small for base64 files
- `MEDIUMTEXT`: Max 16,777,215 characters (16MB) - ✅ Good for most files
- `LONGTEXT`: Max 4,294,967,295 characters (4GB) - ✅ Best for large files

### 3. Base64 Size Calculation
Base64 encoding increases file size by approximately 33%:
- 1MB file → ~1.33MB base64
- 5MB file → ~6.7MB base64

### 4. Verify the Fix

After running the migration:

1. Check the column type:
```sql
DESCRIBE applications;
```

You should see:
```
cv_url | LONGTEXT | YES | | NULL |
```

2. Delete old corrupted applications (optional):
```sql
DELETE FROM applications WHERE cv_url IS NOT NULL;
```

3. Submit a new application with a CV file
4. Click "📥 Download CV/Portfolio" 
5. The downloaded file should open correctly

## Current Configuration

- Max file size: 5MB (validated in frontend)
- Allowed types: PDF, DOC, DOCX
- Storage: Base64 encoded in database (LONGTEXT column)
- Backend body limit: 10MB (to accommodate base64 encoding)
- API Gateway body limit: 10MB

## Files Modified

1. `database/fix_cv_column.sql` - SQL migration to fix column type
2. `src/app/backoffice/*/components.ts` - Changed CV viewing to download
3. `backend/server.js` - Increased body size limit to 10MB
4. `api-gateway/application.yml` - Increased max-in-memory-size to 10MB

## Testing

1. Apply for a milestone with a PDF CV (up to 5MB)
2. Go to backoffice → Review Applications
3. Click "📥 Download CV/Portfolio"
4. Open the downloaded file - it should work correctly

## Notes

- Old applications with corrupted CVs will need to be resubmitted
- The download button now downloads the file instead of opening in browser
- File names are timestamped: `CV_1234567890.pdf`
