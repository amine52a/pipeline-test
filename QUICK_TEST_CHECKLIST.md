# Quick Test Checklist ⚡

## 5-Minute Quick Test

### Setup (30 seconds)
- [ ] Frontend running: http://localhost:4200
- [ ] Backend running: http://localhost:4000
- [ ] Two browser windows ready (Company + Freelancer)

### Company Flow (2 minutes)
1. [ ] Login to backoffice
2. [ ] Create project: "Test Project"
3. [ ] Add milestone: "Test Task" ($1000, Open)
4. [ ] Verify milestone appears

### Freelancer Flow (1.5 minutes)
1. [ ] Login to frontoffice
2. [ ] Go to Projects → Find "Test Project"
3. [ ] Apply to "Test Task" milestone
4. [ ] Check "My Applications" page
5. [ ] Verify application shows "Pending"

### Company Review (1 minute)
1. [ ] Check notifications (badge should show "1")
2. [ ] Click notification → Review application
3. [ ] Accept application
4. [ ] Verify milestone status = "Assigned"

### Workspace Test (30 seconds)
1. [ ] Freelancer: Go to "My Applications"
2. [ ] Click "Open Workspace"
3. [ ] Send chat message
4. [ ] Submit work
5. [ ] Company: Go to "Workspace Manager"
6. [ ] View chat and submission
7. [ ] Review and approve work with 5 stars

### Final Verification (30 seconds)
- [ ] Freelancer sees approved status
- [ ] Rating displayed (5 stars)
- [ ] Feedback visible
- [ ] Notifications working

---

## Critical Features Checklist

### Core Functionality
- [ ] Create project ✓
- [ ] Create milestone ✓
- [ ] Apply to milestone ✓
- [ ] Accept application ✓
- [ ] Access workspace ✓
- [ ] Submit work ✓
- [ ] Review work ✓

### Notifications
- [ ] Application received (Company) ✓
- [ ] Application accepted (Freelancer) ✓
- [ ] Badge updates ✓
- [ ] Real-time polling ✓

### Workspace
- [ ] Team chat works ✓
- [ ] Submit work works ✓
- [ ] View submissions works ✓
- [ ] All 4 tabs functional ✓

### Review System
- [ ] Approve with rating ✓
- [ ] Request revision ✓
- [ ] Reject with feedback ✓
- [ ] Status updates ✓

### Data Persistence
- [ ] Refresh page - data persists ✓
- [ ] Navigate away - data persists ✓
- [ ] Close/reopen - data persists ✓

---

## One-Line Test Commands

### Check Servers
```bash
# Frontend
curl http://localhost:4200

# Backend
curl http://localhost:4000/health
```

### Quick Database Check
```sql
-- Check if data exists
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM milestones;
SELECT COUNT(*) FROM applications;
SELECT COUNT(*) FROM notifications;
SELECT COUNT(*) FROM work_submissions;
```

---

## Red Flags 🚩

Stop and investigate if you see:
- ❌ Notifications not appearing after 10 seconds
- ❌ Chat messages not updating after 5 seconds
- ❌ "Review" button not visible on Submissions tab
- ❌ Data disappears after page refresh
- ❌ Application count not updating
- ❌ Status not changing after actions
- ❌ Console errors (F12)
- ❌ Network errors in browser dev tools

---

## Quick Fixes

### Notifications not working?
1. Check backend is running
2. Refresh the page
3. Check browser console for errors

### Chat not updating?
1. Wait 5 seconds (polling interval)
2. Refresh the page
3. Check both users are in same milestone

### Review button missing?
1. Click "📤 Submissions" tab (not Team Chat!)
2. Verify submission exists
3. Refresh the page

### Data not persisting?
1. Check backend is running
2. Check MySQL is running
3. Check browser console for API errors

---

## Test Status Template

```
✅ PASS - All features working
⚠️  PARTIAL - Some issues found
❌ FAIL - Critical issues

Date: __________
Status: __________
Issues: __________
```

---

## Speed Test (1 Minute)

Can you complete this in under 60 seconds?

1. Create milestone (10s)
2. Apply to milestone (10s)
3. Accept application (10s)
4. Open workspace (5s)
5. Send chat message (5s)
6. Submit work (10s)
7. Review and approve (10s)

**Target: < 60 seconds** ⏱️

---

## Automated Test Ideas (Future)

```javascript
// Example test structure
describe('Complete Workflow', () => {
  it('should create project and milestone', () => {});
  it('should allow freelancer to apply', () => {});
  it('should send notification to company', () => {});
  it('should allow company to accept', () => {});
  it('should grant workspace access', () => {});
  it('should allow work submission', () => {});
  it('should allow work review', () => {});
});
```

---

**Use this for quick daily checks or before demos!** ⚡
