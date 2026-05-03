# ⚠️ IMPORTANT: Run Database Migration First!

## The AI Recommendations page won't work until you run this SQL!

### Step 1: Open phpMyAdmin
1. Open XAMPP Control Panel
2. Click "Admin" next to MySQL
3. This opens phpMyAdmin in your browser

### Step 2: Select Database
1. Click on `matchy_db` in the left sidebar
2. Click on the "SQL" tab at the top

### Step 3: Copy and Paste SQL
1. Open the file: `database/advanced_features_migration.sql`
2. Copy ALL the content (Ctrl+A, Ctrl+C)
3. Paste it into the SQL text area in phpMyAdmin
4. Click "Go" button at the bottom

### Step 4: Verify Tables Created
After running the SQL, you should see these new tables in the left sidebar:
- ✅ payments
- ✅ freelancer_profiles
- ✅ project_recommendations
- ✅ search_history
- ✅ saved_searches
- ✅ freelancer_skills

### Step 5: Check Sample Data
Click on `freelancer_profiles` table and you should see 5 sample freelancers:
1. Ahmed Ben Ali (Angular, TypeScript, Node.js)
2. Fatma Mansour (React, Vue.js, JavaScript)
3. Mohamed Trabelsi (Python, Django, PostgreSQL)
4. Salma Karoui (Figma, UI/UX, Adobe XD)
5. Youssef Gharbi (React Native, Flutter)

### Step 6: Refresh Angular Page
1. Go back to: `http://localhost:4200/frontoffice/ai-recommendations`
2. You should now see AI-recommended projects!

---

## If You See Errors:

### Error: "Table 'work_submissions' doesn't exist"
This means you need to run the workspace migration first:
```sql
-- Run this in phpMyAdmin first:
-- File: database/workspace_migration.sql
```

### Error: "Failed to load recommendations"
1. Check browser console (F12) for detailed error
2. Make sure backend is running on port 9090
3. Make sure API Gateway is running on port 8091
4. Check that tables were created successfully

---

## Quick Test:

After running the migration, test the API directly:

**Open in browser**: `http://localhost:8091/api/freelancers/1/recommended-projects`

You should see JSON with recommended projects!

---

**Once the migration is done, the AI Recommendations page will work! 🎉**
