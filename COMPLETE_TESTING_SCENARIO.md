# Complete Testing Scenario - End-to-End Workflow

## Overview
This document provides a complete testing scenario to verify all features of the Matchy platform, including projects, milestones, applications, notifications, workspace collaboration, and reviews.

---

## Prerequisites

### Servers Running
- ✅ Frontend: http://localhost:4200
- ✅ Backend: http://localhost:4000
- ✅ Database: matchy_db (MySQL)

### Test Accounts
You'll need two types of accounts:
1. **Company Account** (Backoffice)
2. **Freelancer Account** (Frontoffice)

---

## 🎯 Complete Testing Scenario

### PHASE 1: Company Creates Project & Milestone (Backoffice)

#### Step 1.1: Login as Company
1. Navigate to: http://localhost:4200/backoffice/login
2. Login with company credentials
3. ✅ **Verify**: You're redirected to the dashboard

#### Step 1.2: Create a New Project
1. Click **"Company Projects"** in the sidebar
2. Click **"Add New Project"** button
3. Fill in the form:
   - **Company Name**: "Tech Solutions Inc"
   - **Project Title**: "Mobile App Development"
   - **Description**: "We need a mobile app for our e-commerce platform"
   - **Details of Work**: "iOS and Android app with payment integration"
   - **Number of People**: 3
   - **Budget**: 15000
   - **Currency**: USD
   - **Category**: "Mobile Development"
   - **Status**: Open
   - **Skills**: React Native, Node.js, MongoDB
4. Click **"Save"**
5. ✅ **Verify**: Project appears in the list
6. ✅ **Verify**: Project shows "0 applications"

#### Step 1.3: Create Milestones for the Project
1. Find your project in the list
2. Click **"Manage Milestones"** button
3. Click **"Add Milestone"** button
4. Fill in Milestone 1:
   - **Title**: "UI/UX Design Phase"
   - **Description**: "Design all app screens and user flows"
   - **Skills**: Figma, UI Design, UX Research
   - **Budget**: 3000
   - **Duration**: "2 weeks"
   - **Status**: Open
5. Click **"Save Milestone"**
6. Create Milestone 2:
   - **Title**: "Backend API Development"
   - **Description**: "Build RESTful API with authentication"
   - **Skills**: Node.js, Express, MongoDB
   - **Budget**: 5000
   - **Duration**: "3 weeks"
   - **Status**: Open
7. Create Milestone 3:
   - **Title**: "Mobile App Implementation"
   - **Description**: "Develop iOS and Android apps"
   - **Skills**: React Native, Redux, API Integration
   - **Budget**: 7000
   - **Duration**: "4 weeks"
   - **Status**: Open
8. ✅ **Verify**: All 3 milestones appear in the list
9. ✅ **Verify**: Each milestone shows "0 applications"

---

### PHASE 2: Freelancer Discovers & Applies (Frontoffice)

#### Step 2.1: Login as Freelancer
1. Open a new browser window/tab (or use incognito)
2. Navigate to: http://localhost:4200
3. Login with freelancer credentials
4. ✅ **Verify**: You're on the frontoffice homepage

#### Step 2.2: Browse Available Projects
1. Click **"Projects"** in the navbar
2. ✅ **Verify**: You see the "Mobile App Development" project
3. ✅ **Verify**: Project shows "3 milestones available"
4. Click on the project card to view details

#### Step 2.3: View Project Details & Milestones
1. On the project details page:
   - ✅ **Verify**: Project information is displayed
   - ✅ **Verify**: All 3 milestones are listed
   - ✅ **Verify**: Each milestone shows "Apply" button
   - ✅ **Verify**: Milestones show budget and duration

#### Step 2.4: Apply to a Milestone
1. Find "Backend API Development" milestone
2. Click **"Apply"** button
3. Fill in the application form:
   - **CV URL**: https://example.com/my-cv.pdf
   - **Motivation Letter**: "I have 5 years of experience in Node.js and have built similar APIs for e-commerce platforms. I'm confident I can deliver high-quality work within the timeline."
   - **Years of Experience**: 5
   - **Proposed Budget**: 4800
4. Click **"Submit Application"**
5. ✅ **Verify**: Success message appears
6. ✅ **Verify**: Button changes to "Applied" (disabled)
7. ✅ **Verify**: Application count increases

#### Step 2.5: Check Notifications (Freelancer)
1. Look at the navbar - you should see the bell icon (🔔)
2. ✅ **Verify**: No new notifications yet (application just submitted)

---

### PHASE 3: Company Reviews Application (Backoffice)

#### Step 3.1: Check Notifications (Company)
1. Switch back to the company browser window
2. Look at the sidebar
3. ✅ **Verify**: "Notifications" menu item shows a badge with "1"
4. Click **"Notifications"** in the sidebar
5. ✅ **Verify**: You see a notification: "New application received for Backend API Development"
6. ✅ **Verify**: Notification shows freelancer name and timestamp
7. Click on the notification
8. ✅ **Verify**: You're redirected to review the application

#### Step 3.2: Review the Application
1. You should be on the "Review Applications" page
2. ✅ **Verify**: You see the freelancer's application
3. ✅ **Verify**: Application shows:
   - Freelancer name and email
   - CV link
   - Motivation letter
   - Years of experience (5)
   - Proposed budget ($4800)
   - Status: Pending
4. Review the application details

#### Step 3.3: Schedule an Interview
1. Click **"Schedule Interview"** button
2. Fill in the interview form:
   - **Meet Link**: https://meet.google.com/abc-defg-hij
   - **Date**: Select tomorrow's date
   - **Time**: 14:00
   - **Notes**: "Looking forward to discussing your experience with Node.js and MongoDB"
3. Click **"Schedule Interview"**
4. ✅ **Verify**: Success message appears
5. ✅ **Verify**: Application status changes to "Interview Scheduled"
6. ✅ **Verify**: Interview details are displayed

---

### PHASE 4: Freelancer Receives Interview Notification

#### Step 4.1: Check Notifications (Freelancer)
1. Switch to the freelancer browser window
2. Look at the navbar bell icon (🔔)
3. ✅ **Verify**: Badge shows "1" (new notification)
4. Click on the bell icon
5. ✅ **Verify**: Dropdown shows notification: "Interview scheduled for Backend API Development"
6. ✅ **Verify**: Notification shows date and time
7. Click on the notification
8. ✅ **Verify**: You're redirected to "My Applications" page

#### Step 4.2: View Interview Details
1. On "My Applications" page:
   - ✅ **Verify**: Stats show "1 Interview Scheduled"
   - ✅ **Verify**: Application card shows "Interview Scheduled" badge
2. Find the application card
3. ✅ **Verify**: Interview details are displayed:
   - Meet link
   - Date and time
   - Company notes
4. ✅ **Verify**: "Confirm Attendance" button is visible

#### Step 4.3: Confirm Interview Attendance
1. Click **"Confirm Attendance"** button
2. ✅ **Verify**: Success message appears
3. ✅ **Verify**: Button changes to "Attendance Confirmed" (disabled)
4. ✅ **Verify**: Status updates to "Interview Confirmed"

---

### PHASE 5: Company Accepts Application (Backoffice)

#### Step 5.1: Accept the Application
1. Switch back to company browser window
2. Go to **"Company Projects"** → Find your project → **"Manage Milestones"**
3. Find "Backend API Development" milestone
4. Click **"Review Applications"** button
5. Find the freelancer's application
6. ✅ **Verify**: Status shows "Interview Confirmed"
7. Click **"Accept"** button
8. Confirm the acceptance
9. ✅ **Verify**: Success message appears
10. ✅ **Verify**: Application status changes to "Accepted"
11. ✅ **Verify**: Milestone status changes to "Assigned"

#### Step 5.2: Check History
1. Click **"History"** in the sidebar
2. ✅ **Verify**: Timeline shows all activities:
   - Application received
   - Interview scheduled
   - Application accepted
3. ✅ **Verify**: Each entry has correct timestamp and details

---

### PHASE 6: Freelancer Accesses Workspace

#### Step 6.1: Check Acceptance Notification
1. Switch to freelancer browser window
2. Look at the bell icon (🔔)
3. ✅ **Verify**: Badge shows new notification
4. Click on the bell icon
5. ✅ **Verify**: Notification says "Your application has been accepted for Backend API Development"
6. Click on the notification
7. ✅ **Verify**: Redirected to "My Applications" page

#### Step 6.2: Access Workspace
1. On "My Applications" page:
   - ✅ **Verify**: Stats show "1 Accepted"
   - ✅ **Verify**: Application card shows "Accepted" badge (green)
2. Find the accepted application
3. ✅ **Verify**: "Open Workspace" button is visible
4. Click **"Open Workspace"** button
5. ✅ **Verify**: Workspace modal opens

#### Step 6.3: Explore Workspace Tabs

**Tab 1: Overview**
1. Click **"Overview"** tab
2. ✅ **Verify**: Team members list is displayed
3. ✅ **Verify**: Your name appears in the team
4. ✅ **Verify**: Milestone details are shown
5. ✅ **Verify**: Skills are listed

**Tab 2: Team Chat**
1. Click **"Team Chat"** tab
2. ✅ **Verify**: Chat interface is displayed
3. Type a message: "Hello! Excited to start working on this project!"
4. Click **"Send"**
5. ✅ **Verify**: Message appears in the chat
6. ✅ **Verify**: Message shows your name and timestamp
7. ✅ **Verify**: Message has freelancer badge (👤)

**Tab 3: Submit Work**
1. Click **"Submit Work"** tab
2. Fill in the submission form:
   - **Title**: "API Authentication Module"
   - **Description**: "Implemented JWT authentication with refresh tokens and role-based access control"
   - **File URL**: https://github.com/myrepo/api-auth
   - **File Name**: api-authentication.zip
   - **File Type**: application/zip
3. Click **"Submit Work"**
4. ✅ **Verify**: Success message appears
5. ✅ **Verify**: Form is cleared

**Tab 4: My Submissions**
1. Click **"My Submissions"** tab
2. ✅ **Verify**: Your submission appears in the list
3. ✅ **Verify**: Submission shows:
   - Title: "API Authentication Module"
   - Status: "Pending Review" (yellow badge)
   - Submission date
   - File link
4. ✅ **Verify**: No feedback yet (status is pending)

---

### PHASE 7: Company Reviews Work (Backoffice)

#### Step 7.1: Access Workspace Manager
1. Switch to company browser window
2. Click **"Workspace Manager"** (💼) in the sidebar
3. ✅ **Verify**: Workspace Manager page loads
4. ✅ **Verify**: Left panel shows active milestones
5. Find "Backend API Development" milestone
6. ✅ **Verify**: Milestone shows "Assigned" status
7. Click on the milestone card
8. ✅ **Verify**: Right panel shows workspace details

#### Step 7.2: View Team Chat
1. ✅ **Verify**: "Team Chat" tab is active by default
2. ✅ **Verify**: You see the freelancer's message: "Hello! Excited to start working on this project!"
3. ✅ **Verify**: Message shows freelancer badge (👤)
4. Type a reply: "Welcome to the team! Looking forward to seeing your work."
5. Click **"Send"**
6. ✅ **Verify**: Your message appears with company badge (🏢)

#### Step 7.3: Review Submission
1. Click **"📤 Submissions"** tab
2. ✅ **Verify**: Tab badge shows "1"
3. ✅ **Verify**: Submission card is displayed
4. ✅ **Verify**: Submission shows:
   - Title: "API Authentication Module"
   - Freelancer name
   - Status: "Pending Review"
   - Description
   - File link
   - Submission date
5. ✅ **Verify**: "Review" button is visible at the bottom
6. Click **"Review"** button
7. ✅ **Verify**: Review modal opens

#### Step 7.4: Complete the Review (Approve)
1. In the review modal:
   - ✅ **Verify**: Submission preview section shows all details
   - ✅ **Verify**: File download link is clickable
2. Click **"✓ Approve"** button (green)
3. ✅ **Verify**: Button highlights in green
4. ✅ **Verify**: Star rating section appears
5. Click on the 5th star to give 5-star rating
6. ✅ **Verify**: All 5 stars turn gold
7. ✅ **Verify**: "5 / 5" text appears
8. Type feedback: "Excellent work! The authentication module is well-implemented with clean code and proper error handling. The JWT implementation follows best practices. Great job!"
9. ✅ **Verify**: Submit button shows "✓ Approve Work" in green
10. Click **"✓ Approve Work"**
11. ✅ **Verify**: Success message appears
12. ✅ **Verify**: Modal closes
13. ✅ **Verify**: Submission status updates to "Approved" (green badge)

---

### PHASE 8: Freelancer Sees Review Results

#### Step 8.1: Check Workspace Submissions
1. Switch to freelancer browser window
2. If workspace modal is still open, click **"My Submissions"** tab
3. If closed, go to "My Applications" → Click "Open Workspace" → "My Submissions" tab
4. ✅ **Verify**: Submission status changed to "Approved" (green badge)
5. ✅ **Verify**: 5-star rating is displayed (⭐⭐⭐⭐⭐)
6. ✅ **Verify**: Company feedback is displayed
7. ✅ **Verify**: Feedback shows: "Excellent work! The authentication module is well-implemented..."

---

### PHASE 9: Test Revision Request Flow

#### Step 9.1: Freelancer Submits Another Work
1. In the workspace modal, click **"Submit Work"** tab
2. Submit a second piece of work:
   - **Title**: "User Management API"
   - **Description**: "CRUD operations for user management"
   - **File URL**: https://github.com/myrepo/user-api
3. Click **"Submit Work"**
4. ✅ **Verify**: Success message appears

#### Step 9.2: Company Requests Revision
1. Switch to company browser window
2. In Workspace Manager → Submissions tab
3. ✅ **Verify**: New submission appears
4. Click **"Review"** button on the new submission
5. Click **"↻ Request Revision"** button (orange)
6. ✅ **Verify**: Button highlights in orange
7. ✅ **Verify**: Rating section is hidden (not required for revision)
8. Type feedback: "Good start, but please add input validation for email and phone fields. Also, implement pagination for the user list endpoint."
9. Click **"↻ Request Revision"**
10. ✅ **Verify**: Success message appears
11. ✅ **Verify**: Status updates to "Revision Requested" (orange badge)

#### Step 9.3: Freelancer Sees Revision Request
1. Switch to freelancer browser window
2. In workspace → "My Submissions" tab
3. ✅ **Verify**: Second submission shows "Revision Requested" status
4. ✅ **Verify**: Feedback is displayed with revision instructions
5. ✅ **Verify**: No rating shown (only for approved work)

---

### PHASE 10: Test Rejection Flow

#### Step 10.1: Freelancer Submits Third Work
1. In workspace modal → "Submit Work" tab
2. Submit third work:
   - **Title**: "Payment Integration"
   - **Description**: "Basic payment processing"
   - **File URL**: https://github.com/myrepo/payment
3. Click **"Submit Work"**

#### Step 10.2: Company Rejects Work
1. Switch to company browser window
2. In Workspace Manager → Submissions tab
3. Click **"Review"** on the third submission
4. Click **"✕ Reject"** button (red)
5. ✅ **Verify**: Button highlights in red
6. Type feedback: "Unfortunately, this implementation doesn't meet our security requirements. Payment processing needs PCI compliance and proper encryption. Please review our security guidelines."
7. Click **"✕ Reject Work"**
8. ✅ **Verify**: Success message appears
9. ✅ **Verify**: Status updates to "Rejected" (red badge)

#### Step 10.3: Freelancer Sees Rejection
1. Switch to freelancer browser window
2. In workspace → "My Submissions" tab
3. ✅ **Verify**: Third submission shows "Rejected" status (red)
4. ✅ **Verify**: Rejection feedback is displayed

---

### PHASE 11: Test Multiple Freelancers (Optional)

#### Step 11.1: Second Freelancer Applies
1. Open another browser window (or use a different browser)
2. Login as a different freelancer
3. Navigate to Projects → Find "Mobile App Development"
4. Apply to "UI/UX Design Phase" milestone
5. ✅ **Verify**: Application submitted successfully

#### Step 11.2: Company Accepts Second Freelancer
1. In company browser window
2. Check notifications
3. ✅ **Verify**: New notification for second application
4. Accept the second freelancer
5. ✅ **Verify**: Milestone status changes to "Assigned"

#### Step 11.3: Test Multi-User Chat
1. In Workspace Manager, select "UI/UX Design Phase" milestone
2. Go to Team Chat tab
3. ✅ **Verify**: Team members count shows "1"
4. Send a message from company
5. Switch to second freelancer browser
6. Open workspace for "UI/UX Design Phase"
7. Go to Team Chat tab
8. ✅ **Verify**: Company message is visible
9. Send a reply from freelancer
10. Switch back to company browser
11. ✅ **Verify**: Freelancer message appears (real-time polling)

---

### PHASE 12: Notification System Testing

#### Step 12.1: Test Notification Polling
1. Keep both browser windows open (company and freelancer)
2. In company window, accept another application
3. Wait 10 seconds (notification polling interval)
4. In freelancer window:
   - ✅ **Verify**: Bell icon badge updates automatically
   - ✅ **Verify**: New notification appears in dropdown

#### Step 12.2: Test Mark as Read
1. In freelancer window, click bell icon
2. Click on a notification
3. ✅ **Verify**: Notification is marked as read (styling changes)
4. ✅ **Verify**: Unread count decreases

#### Step 12.3: Test Delete Notification
1. In notification dropdown, find a notification
2. Click the delete button (×)
3. ✅ **Verify**: Notification is removed from list
4. ✅ **Verify**: Count updates

#### Step 12.4: Test Mark All as Read
1. In company window, go to Notifications page
2. Click **"Mark All as Read"** button
3. ✅ **Verify**: All notifications are marked as read
4. ✅ **Verify**: Sidebar badge disappears

---

### PHASE 13: Data Persistence Testing

#### Step 13.1: Test Page Refresh
1. In any browser window, refresh the page (F5)
2. ✅ **Verify**: All data persists:
   - Projects still visible
   - Milestones still visible
   - Applications still visible
   - Notifications still visible
   - Chat messages still visible
   - Submissions still visible

#### Step 13.2: Test Navigation
1. Navigate away from a page
2. Navigate back
3. ✅ **Verify**: Data is still there
4. ✅ **Verify**: No data loss

#### Step 13.3: Test Browser Close/Reopen
1. Close the browser completely
2. Reopen and login
3. ✅ **Verify**: All data persists
4. ✅ **Verify**: Application state is maintained

---

### PHASE 14: Edge Cases & Error Handling

#### Step 14.1: Test Empty States
1. Create a new project with no milestones
2. ✅ **Verify**: "No milestones" message appears
3. Go to a milestone with no applications
4. ✅ **Verify**: "No applications" message appears
5. Go to workspace with no chat messages
6. ✅ **Verify**: "No messages yet" message appears

#### Step 14.2: Test Validation
1. Try to create a project without required fields
2. ✅ **Verify**: Validation errors appear
3. Try to submit work without title
4. ✅ **Verify**: Validation prevents submission
5. Try to approve work without rating
6. ✅ **Verify**: Alert shows "Please provide a rating"

#### Step 14.3: Test Status Transitions
1. Try to apply to a closed milestone
2. ✅ **Verify**: "Apply" button is disabled or milestone not shown
3. Try to apply to a milestone you already applied to
4. ✅ **Verify**: Button shows "Applied" (disabled)

---

## 📊 Testing Checklist Summary

### Projects & Milestones
- [ ] Create project in backoffice
- [ ] Create multiple milestones
- [ ] View projects in frontoffice
- [ ] View milestone details
- [ ] Milestone status updates correctly

### Applications
- [ ] Freelancer can apply to milestone
- [ ] Application appears in backoffice
- [ ] Application count updates
- [ ] CV and motivation letter are saved
- [ ] Proposed budget is displayed

### Interviews
- [ ] Company can schedule interview
- [ ] Interview details are saved
- [ ] Freelancer receives notification
- [ ] Freelancer can confirm attendance
- [ ] Interview status updates

### Acceptance
- [ ] Company can accept application
- [ ] Milestone status changes to "Assigned"
- [ ] Freelancer receives notification
- [ ] Workspace access is granted

### Workspace - Chat
- [ ] Freelancer can send messages
- [ ] Company can send messages
- [ ] Messages show correct user type
- [ ] Real-time polling works
- [ ] Timestamps are correct

### Workspace - Submissions
- [ ] Freelancer can submit work
- [ ] Submission appears in company workspace
- [ ] File links work
- [ ] Submission count updates

### Reviews
- [ ] Company can approve work
- [ ] Rating system works (1-5 stars)
- [ ] Company can request revision
- [ ] Company can reject work
- [ ] Feedback is saved and displayed
- [ ] Status updates correctly

### Notifications
- [ ] Application received notification (company)
- [ ] Interview scheduled notification (freelancer)
- [ ] Application accepted notification (freelancer)
- [ ] Notification badges update
- [ ] Real-time polling works
- [ ] Mark as read works
- [ ] Delete notification works
- [ ] Mark all as read works

### History
- [ ] All activities are logged
- [ ] Timeline displays correctly
- [ ] Timestamps are accurate
- [ ] Click to navigate works

### Data Persistence
- [ ] Data survives page refresh
- [ ] Data survives navigation
- [ ] Data survives browser close/reopen
- [ ] No data loss

### UI/UX
- [ ] All buttons are visible
- [ ] All forms are functional
- [ ] All modals open/close correctly
- [ ] All tabs switch correctly
- [ ] All badges update correctly
- [ ] All status colors are correct
- [ ] All animations work smoothly

---

## 🐛 Common Issues & Solutions

### Issue: Notifications not updating
**Solution**: Check that polling is working (10-second interval). Refresh the page.

### Issue: Chat messages not appearing
**Solution**: Check that polling is working (5-second interval). Verify both users are in the same milestone.

### Issue: Review button not visible
**Solution**: Make sure you're on the "Submissions" tab, not "Team Chat" tab.

### Issue: Can't apply to milestone
**Solution**: Check that milestone status is "Open". Check that you haven't already applied.

### Issue: Workspace not accessible
**Solution**: Check that application status is "Accepted". Check that milestone status is "Assigned".

---

## ✅ Success Criteria

All features are working correctly if:
1. ✅ Projects and milestones can be created and viewed
2. ✅ Freelancers can apply to milestones
3. ✅ Companies receive application notifications
4. ✅ Interviews can be scheduled and confirmed
5. ✅ Applications can be accepted/rejected
6. ✅ Workspace is accessible after acceptance
7. ✅ Team chat works in real-time
8. ✅ Work can be submitted and reviewed
9. ✅ Reviews include ratings and feedback
10. ✅ All notifications work correctly
11. ✅ History tracks all activities
12. ✅ Data persists across sessions
13. ✅ UI is responsive and intuitive

---

## 📝 Test Results Template

Use this template to document your test results:

```
Date: _______________
Tester: _______________

PHASE 1 - Company Creates Project: ✅ / ❌
PHASE 2 - Freelancer Applies: ✅ / ❌
PHASE 3 - Company Reviews Application: ✅ / ❌
PHASE 4 - Freelancer Receives Notification: ✅ / ❌
PHASE 5 - Company Accepts Application: ✅ / ❌
PHASE 6 - Freelancer Accesses Workspace: ✅ / ❌
PHASE 7 - Company Reviews Work: ✅ / ❌
PHASE 8 - Freelancer Sees Results: ✅ / ❌
PHASE 9 - Revision Request Flow: ✅ / ❌
PHASE 10 - Rejection Flow: ✅ / ❌
PHASE 11 - Multiple Freelancers: ✅ / ❌
PHASE 12 - Notification System: ✅ / ❌
PHASE 13 - Data Persistence: ✅ / ❌
PHASE 14 - Edge Cases: ✅ / ❌

Issues Found:
1. _______________
2. _______________
3. _______________

Overall Status: ✅ PASS / ❌ FAIL
```

---

**Happy Testing! 🚀**

This comprehensive test covers all major features and workflows in the Matchy platform.
