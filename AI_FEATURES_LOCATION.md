# AI Features Location Guide

## 🎯 Where is the AI-Powered Smart Matching?

### Backend (✅ Already Working)

**Location**: `backend/ai-matching.service.js`

**What it does**:
- Calculates match scores between freelancers and projects
- Uses 5 factors: Skills (40%), Experience (20%), Rating (20%), Success Rate (15%), Availability (5%)
- Returns top 10 best matches

**API Endpoints**:
```
GET /api/projects/:projectId/recommended-freelancers?limit=10
GET /api/freelancers/:freelancerId/recommended-projects?limit=10
```

**Test it**:
```bash
# Get recommended freelancers for project 1
curl http://localhost:8091/api/projects/1/recommended-freelancers

# Get recommended projects for freelancer 1
curl http://localhost:8091/api/freelancers/1/recommended-projects
```

---

### Frontend (✅ Just Created)

**Location**: `src/app/frontoffice/ai-recommendations/`

**Files**:
- `ai-recommendations.component.ts` - Component logic
- `ai-recommendations.component.html` - UI template
- `ai-recommendations.component.scss` - Styling
- `services/ai-recommendations.service.ts` - API service

**Route**: `/frontoffice/ai-recommendations`

**Access it**:
1. Start Angular: `npm start`
2. Navigate to: `http://localhost:4200/frontoffice/ai-recommendations`

---

## 📊 What You'll See

### For Freelancers:
When you visit `/frontoffice/ai-recommendations`, you'll see:

1. **Match Score Badge** (0-100%)
   - Green (80-100%): Excellent Match
   - Orange (60-79%): Good Match
   - Red (0-59%): Fair Match

2. **Project Information**
   - Title, company, description
   - Budget, location, deadline, category

3. **Matching Skills** (highlighted in green)
   - Shows which of your skills match the project

4. **Score Breakdown**
   - Skills Match: X/40 points
   - Experience: X/20 points
   - Rating: X/20 points
   - Success Rate: X/15 points
   - Availability: X/5 points

5. **Actions**
   - View Project button
   - Apply Now button

---

## 🔧 How to Test

### Step 1: Run Database Migration
```sql
-- In phpMyAdmin, run:
-- File: database/advanced_features_migration.sql
```

This creates:
- `freelancer_profiles` table with sample data (5 freelancers)
- `project_recommendations` table
- Sample skills and profiles

### Step 2: Start Services
```bash
# Backend (already running)
cd backend
npm start

# Angular
npm start
```

### Step 3: View AI Recommendations
1. Open browser: `http://localhost:4200`
2. Navigate to: `/frontoffice/ai-recommendations`
3. You'll see AI-recommended projects for freelancer ID 1

---

## 🎨 UI Features

### Visual Elements:
- **Match Score Badge**: Color-coded (green/orange/red)
- **Matching Skills**: Highlighted in green
- **Progress Bars**: Visual score breakdown
- **Hover Effects**: Cards lift on hover
- **Responsive**: Works on mobile and desktop

### Information Displayed:
- Project title and company
- Description
- Budget and currency
- Location
- Deadline
- Category
- Required skills (with matching ones highlighted)
- Detailed match score breakdown

---

## 🔗 Integration Points

### Add to Navigation Menu:
Edit `src/app/frontoffice/layout/fo-navbar/fo-navbar.component.html`:

```html
<a routerLink="/frontoffice/ai-recommendations" routerLinkActive="active">
  <i class="fas fa-magic"></i>
  AI Recommendations
</a>
```

### Add to Home Page:
Show top 3 recommendations on the home page:

```typescript
// In home.component.ts
recommendations$ = this.aiService.getRecommendedProjects(this.freelancerId, 3);
```

---

## 📱 For Companies (To Be Added)

You can create a similar component for companies to see recommended freelancers:

**Component**: `recommended-freelancers.component`
**Route**: `/backoffice/recommended-freelancers/:projectId`
**API**: `GET /api/projects/:projectId/recommended-freelancers`

This will show:
- Freelancer profiles
- Match scores
- Matching skills
- Experience, rating, success rate
- Hourly rate
- Availability

---

## 🧪 Sample Data

The migration includes 5 sample freelancers:
1. Ahmed Ben Ali - Angular, TypeScript, Node.js (5 years, 4.8★)
2. Fatma Mansour - React, Vue.js, JavaScript (3 years, 4.6★)
3. Mohamed Trabelsi - Python, Django, PostgreSQL (7 years, 4.9★)
4. Salma Karoui - Figma, UI/UX, Adobe XD (4 years, 4.7★)
5. Youssef Gharbi - React Native, Flutter (4 years, 4.5★)

---

## 🚀 Next Steps

1. **Run the migration** to create tables and sample data
2. **Restart backend** to load AI services
3. **Visit** `/frontoffice/ai-recommendations` to see it in action
4. **Customize** the freelancer ID (currently hardcoded to 1)
5. **Add navigation** link to the menu
6. **Create company version** for recommended freelancers

---

## 📍 Quick Access

- **Backend API**: `http://localhost:9090/api/freelancers/1/recommended-projects`
- **Through Gateway**: `http://localhost:8091/api/freelancers/1/recommended-projects`
- **Frontend UI**: `http://localhost:4200/frontoffice/ai-recommendations`

---

**Status**: ✅ Fully Implemented and Ready to Use!
