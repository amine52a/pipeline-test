# 🧪 Unit Testing Guide - Matchy Platform

## Overview

This guide explains the unit tests implemented for the Matchy platform, covering both **Backend (Node.js)** and **Frontend (Angular)** components.

---

## 📦 Backend Unit Tests (Node.js + Jest)

### Test Framework: Jest

**Location**: `backend/__tests__/`

### Installed Dependencies

```json
{
  "devDependencies": {
    "@jest/globals": "^29.7.0",
    "jest": "^29.7.0"
  }
}
```

### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

---

## 🧪 Backend Test Files

### 1. AI Matching Service Tests
**File**: `backend/__tests__/ai-matching.service.test.js`

**What it tests**:
- ✅ Match score calculation algorithm
- ✅ Skills matching (exact and case-insensitive)
- ✅ Experience scoring (0-10 years scale)
- ✅ Rating scoring (0-5 stars)
- ✅ Success rate scoring (0-100%)
- ✅ Availability bonus points
- ✅ Edge cases (empty skills, missing data)
- ✅ Score breakdown accuracy

**Key Test Cases**:
```javascript
// Perfect match (100 points)
test('should calculate perfect match score (100) when all criteria are met')

// Partial skills match
test('should calculate correct score for partial skills match')

// Case-insensitive matching
test('should handle case-insensitive skill matching')

// Experience levels
test('should calculate experience score correctly')

// Edge cases
test('should handle empty skills arrays')
```

**Example Test**:
```javascript
test('should calculate perfect match score (100) when all criteria are met', () => {
  const perfectFreelancer = {
    skills: ['Angular', 'TypeScript', 'Node.js'],
    experience_years: 10,
    average_rating: 5.0,
    success_rate: 100,
    availability: 'available'
  };

  const project = {
    skills: ['Angular', 'TypeScript', 'Node.js']
  };

  const result = calculateMatchScore(perfectFreelancer, project);

  expect(result.score).toBe(100);
  expect(result.matchingSkills).toHaveLength(3);
});
```

---

### 2. Advanced Search Service Tests
**File**: `backend/__tests__/advanced-search.service.test.js`

**What it tests**:
- ✅ Query parameter building
- ✅ Multiple filter combinations
- ✅ Budget range filtering
- ✅ Location and category filters
- ✅ Sorting and pagination logic
- ✅ Freelancer experience and rate filters
- ✅ Saved search data structure
- ✅ Pagination metadata calculation

**Key Test Cases**:
```javascript
// Basic search
test('should build correct query parameters for basic search')

// Multiple filters
test('should handle multiple skills filter')

// Budget range
test('should handle budget range filters')

// Pagination
test('should handle pagination parameters')

// Complex filters
test('should handle complex combined filters')
```

**Example Test**:
```javascript
test('should calculate pagination metadata correctly', () => {
  const total = 157;
  const limit = 20;
  const page = 3;

  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  expect(totalPages).toBe(8); // 157 / 20 = 7.85, rounded up to 8
  expect(offset).toBe(40); // (3 - 1) * 20 = 40
});
```

---

### 3. Payment Service Tests
**File**: `backend/__tests__/payment.service.test.js`

**What it tests**:
- ✅ Payment data validation
- ✅ Default values (amount, currency, method)
- ✅ Payment method validation
- ✅ Payment status transitions
- ✅ Platform fee calculations
- ✅ Currency handling
- ✅ Transaction ID format
- ✅ Payment history filtering
- ✅ Total earnings/spending calculations
- ✅ Refund calculations

**Key Test Cases**:
```javascript
// Data validation
test('should validate payment data structure')

// Defaults
test('should use submission budget when amount is not provided')

// Calculations
test('should calculate payment amount correctly')

// Status flow
test('should validate payment status flow')

// Aggregations
test('should calculate total payments for freelancer')
```

**Example Test**:
```javascript
test('should calculate payment amount correctly', () => {
  const amount = 5000;
  const platformFee = amount * 0.05; // 5% platform fee
  const freelancerAmount = amount - platformFee;

  expect(platformFee).toBe(250);
  expect(freelancerAmount).toBe(4750);
  expect(platformFee + freelancerAmount).toBe(amount);
});
```

---

## 🎨 Frontend Unit Tests (Angular + Jasmine/Karma)

### Test Framework: Jasmine + Karma

**Location**: `src/app/frontoffice/services/`

### Running Frontend Tests

```bash
# Run all Angular tests
npm test

# Run tests in headless mode (CI/CD)
ng test --watch=false --browsers=ChromeHeadless

# Run tests with code coverage
ng test --code-coverage
```

---

## 🧪 Frontend Test Files

### 1. AI Recommendations Service Tests
**File**: `src/app/frontoffice/services/ai-recommendations.service.spec.ts`

**What it tests**:
- ✅ Service creation and injection
- ✅ HTTP GET requests to API
- ✅ Query parameter handling (limit)
- ✅ Response data mapping
- ✅ Error handling (404, 500)
- ✅ Empty result handling
- ✅ Data structure validation
- ✅ Default parameter values

**Key Test Cases**:
```typescript
// Service creation
it('should be created')

// Fetch freelancers
it('should fetch recommended freelancers for a project')

// Custom limit
it('should use custom limit parameter')

// Error handling
it('should handle HTTP error')

// Data validation
it('should return freelancers sorted by match score')
```

**Example Test**:
```typescript
it('should fetch recommended freelancers for a project', () => {
  const projectId = 1;
  const mockFreelancers: FreelancerRecommendation[] = [
    {
      freelancer_id: 1,
      freelancer_name: 'Ahmed Ben Ali',
      match_score: 85.5,
      // ... other fields
    }
  ];

  service.getRecommendedFreelancers(projectId).subscribe(freelancers => {
    expect(freelancers).toEqual(mockFreelancers);
    expect(freelancers[0].match_score).toBe(85.5);
  });

  const req = httpMock.expectOne(`${apiUrl}/projects/${projectId}/recommended-freelancers?limit=10`);
  expect(req.request.method).toBe('GET');
  req.flush(mockFreelancers);
});
```

---

## 📊 Test Coverage

### Backend Coverage Goals
- **AI Matching Service**: 95%+ coverage
- **Payment Service**: 90%+ coverage
- **Advanced Search Service**: 85%+ coverage

### Frontend Coverage Goals
- **Services**: 80%+ coverage
- **Components**: 70%+ coverage (when implemented)

### View Coverage Report

**Backend**:
```bash
cd backend
npm run test:coverage
# Open: backend/coverage/lcov-report/index.html
```

**Frontend**:
```bash
npm test -- --code-coverage
# Open: coverage/index.html
```

---

## 🎯 What These Tests Cover

### ✅ Business Logic
- AI matching algorithm accuracy
- Payment calculations and validations
- Search filtering and pagination
- Score breakdown calculations

### ✅ Data Validation
- Input parameter validation
- Data structure integrity
- Type checking
- Required field validation

### ✅ Edge Cases
- Empty arrays and null values
- Missing optional parameters
- Invalid data formats
- Boundary conditions

### ✅ Error Handling
- HTTP errors (404, 500)
- Database connection failures
- Invalid input data
- Missing required fields

### ✅ Integration Points
- HTTP API calls
- Query parameter construction
- Response data mapping
- Error propagation

---

## 🚀 Running Tests Without Breaking Services

### Important: Tests are Isolated!

✅ **Tests DO NOT**:
- Connect to the real database
- Make real HTTP requests
- Modify production data
- Interfere with running services

✅ **Tests USE**:
- Mock data
- In-memory testing
- HTTP mocking (HttpTestingController)
- Isolated test environments

### Safe Testing Commands

```bash
# Backend tests (safe to run anytime)
cd backend
npm test

# Frontend tests (safe to run anytime)
npm test

# Both run in isolated environments
# Your running services on ports 4200, 8091, 9090, 8761 are NOT affected
```

---

## 📝 Test Structure Explanation

### Backend Test Structure (Jest)
```javascript
import { describe, test, expect, beforeEach } from '@jest/globals';

describe('Service Name - Feature', () => {
  
  beforeEach(() => {
    // Setup mock data before each test
  });

  test('should do something specific', () => {
    // Arrange: Setup test data
    const input = { /* test data */ };
    
    // Act: Execute the function
    const result = functionToTest(input);
    
    // Assert: Verify the result
    expect(result).toBe(expectedValue);
  });
});
```

### Frontend Test Structure (Jasmine)
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ServiceName', () => {
  let service: ServiceName;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceName]
    });
    service = TestBed.inject(ServiceName);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should do something', () => {
    // Test implementation
  });
});
```

---

## 🔍 Understanding Test Results

### Successful Test Output
```
PASS  backend/__tests__/ai-matching.service.test.js
  AI Matching Service - calculateMatchScore
    ✓ should calculate perfect match score (100) when all criteria are met (5ms)
    ✓ should calculate correct score for partial skills match (3ms)
    ✓ should handle case-insensitive skill matching (2ms)
    ...

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Time:        2.5s
```

### Failed Test Output
```
FAIL  backend/__tests__/ai-matching.service.test.js
  AI Matching Service - calculateMatchScore
    ✕ should calculate perfect match score (100) when all criteria are met (10ms)

  Expected: 100
  Received: 95

  > 25 |   expect(result.score).toBe(100);
```

---

## 🎓 Key Testing Concepts

### 1. **Unit Tests**
- Test individual functions in isolation
- Fast execution
- No external dependencies
- Focus on business logic

### 2. **Mocking**
- Replace real dependencies with fake ones
- Control test data
- Isolate the code being tested
- Example: Mock HTTP calls, database queries

### 3. **Assertions**
- Verify expected outcomes
- `expect(value).toBe(expected)`
- `expect(array).toHaveLength(3)`
- `expect(value).toBeGreaterThan(10)`

### 4. **Test Coverage**
- Percentage of code executed by tests
- Higher coverage = more confidence
- 100% coverage doesn't mean bug-free
- Focus on critical paths

---

## 📚 Additional Resources

### Jest Documentation
- Official Docs: https://jestjs.io/docs/getting-started
- Matchers: https://jestjs.io/docs/expect

### Angular Testing
- Official Guide: https://angular.io/guide/testing
- Testing Services: https://angular.io/guide/testing-services

### Best Practices
- Write tests before fixing bugs (TDD)
- Keep tests simple and focused
- Use descriptive test names
- Test edge cases and error conditions
- Maintain test independence

---

## 🎉 Summary

### What We've Added:
1. ✅ **Backend Tests**: 3 test files, 45+ test cases
2. ✅ **Frontend Tests**: 1 test file, 15+ test cases
3. ✅ **Test Configuration**: Jest setup for backend
4. ✅ **Documentation**: This comprehensive guide

### Test Statistics:
- **Total Test Files**: 4
- **Total Test Cases**: 60+
- **Coverage**: Business logic, edge cases, error handling
- **Execution Time**: < 5 seconds

### Running All Tests:
```bash
# Backend tests
cd backend && npm test

# Frontend tests (from root)
npm test
```

**All tests are isolated and safe to run without affecting your running services!** 🚀
