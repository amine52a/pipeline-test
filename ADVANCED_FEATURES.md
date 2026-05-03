# Advanced Features Documentation

## Overview
This document describes the advanced features added to the Matchy platform including AI-powered matching, payment processing, and advanced search capabilities.

---

## 1. AI-Powered Smart Matching

### Freelancer Recommendations for Projects
**Endpoint**: `GET /api/projects/:projectId/recommended-freelancers?limit=10`

**Description**: Uses AI algorithm to match freelancers to projects based on:
- Skills match (40% weight)
- Experience level (20% weight)
- Average rating (20% weight)
- Success rate (15% weight)
- Availability (5% weight)

**Response**:
```json
[
  {
    "freelancer_id": 1,
    "freelancer_name": "Ahmed Ben Ali",
    "skills": ["Angular", "TypeScript", "Node.js"],
    "experience_years": 5,
    "average_rating": 4.8,
    "success_rate": 86.67,
    "match_score": 87.5,
    "matching_skills": ["Angular", "TypeScript"],
    "score_breakdown": {
      "skills": 32.0,
      "experience": 10.0,
      "rating": 19.2,
      "successRate": 13.0,
      "availability": 5.0
    }
  }
]
```

### Project Recommendations for Freelancers
**Endpoint**: `GET /api/freelancers/:freelancerId/recommended-projects?limit=10`

**Description**: Recommends projects that match freelancer's skills and experience.

---

## 2. Payment System

### Create Payment (On Work Approval)
**Endpoint**: `POST /api/payments`

**Request Body**:
```json
{
  "submission_id": 1,
  "company_id": 1,
  "amount": 5000.00,
  "currency": "TND",
  "payment_method": "bank_transfer",
  "transaction_id": "TXN123456"
}
```

**Description**: Automatically creates payment record when company approves freelancer's work submission.

### Process Payment
**Endpoint**: `POST /api/payments/:paymentId/process`

**Description**: Processes the payment and updates freelancer statistics.

### Payment History
- **Freelancer**: `GET /api/freelancers/:freelancerId/payments`
- **Company**: `GET /api/companies/:companyId/payments`

**Payment Statuses**:
- `pending` - Payment created but not processed
- `processing` - Payment being processed
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

---

## 3. Advanced Search & Filters

### Project Search
**Endpoint**: `POST /api/search/projects`

**Request Body**:
```json
{
  "query": "web development",
  "skills": ["Angular", "Node.js"],
  "minBudget": 5000,
  "maxBudget": 20000,
  "location": "Tunis",
  "category": "Web Development",
  "status": "open",
  "deadlineBefore": "2025-12-31",
  "sortBy": "budget",
  "sortOrder": "DESC",
  "page": 1,
  "limit": 20
}
```

**Response**:
```json
{
  "results": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Freelancer Search
**Endpoint**: `POST /api/search/freelancers`

**Request Body**:
```json
{
  "query": "frontend developer",
  "skills": ["React", "Vue.js"],
  "minExperience": 3,
  "maxExperience": 10,
  "minRate": 30,
  "maxRate": 60,
  "minRating": 4.0,
  "location": "Tunis",
  "availability": "available",
  "sortBy": "average_rating",
  "sortOrder": "DESC",
  "page": 1,
  "limit": 20
}
```

### Save Search
**Endpoint**: `POST /api/saved-searches`

**Request Body**:
```json
{
  "user_id": 1,
  "user_type": "freelancer",
  "name": "Angular Projects in Tunis",
  "query": "angular",
  "filters": {
    "skills": ["Angular"],
    "location": "Tunis",
    "minBudget": 5000
  },
  "notify_on_match": true
}
```

### Get Saved Searches
**Endpoint**: `GET /api/saved-searches/:userType/:userId`

---

## 4. Freelancer Profiles

### Get Profile
**Endpoint**: `GET /api/freelancer-profiles/:freelancerId`

### Create/Update Profile
**Endpoint**: `POST /api/freelancer-profiles`

**Request Body**:
```json
{
  "freelancer_id": 1,
  "freelancer_name": "Ahmed Ben Ali",
  "freelancer_email": "ahmed@email.com",
  "skills": ["Angular", "TypeScript", "Node.js"],
  "experience_years": 5,
  "hourly_rate": 45.00,
  "availability": "available",
  "location": "Tunis",
  "bio": "Full-stack developer with 5 years experience",
  "portfolio_url": "https://portfolio.com"
}
```

---

## 5. Database Schema

### New Tables

#### payments
- Stores payment transactions
- Links to submissions, applications, milestones
- Tracks payment status and history

#### freelancer_profiles
- Extended freelancer information
- Skills, experience, ratings
- Used for AI matching

#### project_recommendations
- Stores AI-generated recommendations
- Match scores and reasons
- Tracks if viewed/applied

#### search_history
- User search tracking
- Analytics and insights

#### saved_searches
- Saved search preferences
- Optional notifications

#### freelancer_skills
- Detailed skill proficiency
- Years of experience per skill

---

## 6. Integration Guide

### Step 1: Run Database Migration
```bash
mysql -u root -p matchy_db < database/advanced_features_migration.sql
```

### Step 2: Restart Backend Service
```bash
cd backend
npm start
```

### Step 3: Test AI Recommendations
```bash
# Get recommended freelancers for project 1
curl http://localhost:9090/api/projects/1/recommended-freelancers

# Get recommended projects for freelancer 1
curl http://localhost:9090/api/freelancers/1/recommended-projects
```

### Step 4: Test Payment Flow
```bash
# Create payment when work is approved
curl -X POST http://localhost:9090/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "submission_id": 1,
    "company_id": 1,
    "amount": 5000,
    "currency": "TND",
    "payment_method": "bank_transfer"
  }'

# Process payment
curl -X POST http://localhost:9090/api/payments/1/process
```

### Step 5: Test Advanced Search
```bash
# Search projects
curl -X POST http://localhost:9090/api/search/projects \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["Angular"],
    "minBudget": 5000,
    "location": "Tunis"
  }'
```

---

## 7. Future Enhancements

- Real-time payment notifications via WebSocket
- Stripe/PayPal integration for online payments
- Machine learning model training on historical data
- Elasticsearch integration for faster search
- Chatbot for customer support
- Advanced analytics dashboard

---

## 8. API Summary

| Feature | Method | Endpoint |
|---------|--------|----------|
| AI Freelancer Match | GET | `/api/projects/:id/recommended-freelancers` |
| AI Project Match | GET | `/api/freelancers/:id/recommended-projects` |
| Create Payment | POST | `/api/payments` |
| Process Payment | POST | `/api/payments/:id/process` |
| Freelancer Payments | GET | `/api/freelancers/:id/payments` |
| Company Payments | GET | `/api/companies/:id/payments` |
| Search Projects | POST | `/api/search/projects` |
| Search Freelancers | POST | `/api/search/freelancers` |
| Save Search | POST | `/api/saved-searches` |
| Get Saved Searches | GET | `/api/saved-searches/:type/:id` |
| Get Profile | GET | `/api/freelancer-profiles/:id` |
| Save Profile | POST | `/api/freelancer-profiles` |

---

**Status**: ✅ Implemented and Ready for Testing
**Version**: 1.0.0
**Last Updated**: April 2026
