# How to Review Freelancer Submissions

## Step-by-Step Guide

### 1. Navigate to Workspace Manager
- Open the backoffice
- Click on **"Workspace Manager"** (💼 icon) in the left sidebar

### 2. Select a Milestone
- On the left panel, you'll see a list of active milestones
- Click on any milestone card to select it
- The right panel will show the workspace details

### 3. Switch to Submissions Tab
**IMPORTANT**: You need to click on the "Submissions" tab!

The workspace has TWO tabs:
- **💬 Team Chat** - For viewing team conversations
- **📤 Submissions** - For reviewing freelancer work (THIS IS WHERE THE REVIEW BUTTON IS!)

**Click on the "📤 Submissions" tab** to see the submissions list.

### 4. Review a Submission
Once you're on the Submissions tab:
- You'll see all work submissions from freelancers
- Each submission card shows:
  - Title and description
  - Freelancer name
  - Submission date
  - File link
  - Current status badge
- At the bottom of each card, there's a **"Review"** button
- Click the **"Review"** button to open the review modal

### 5. Complete the Review
In the review modal:

1. **View the submission details**
   - Read the description
   - Click the file link to download and review the work

2. **Make your decision**
   - Click one of three buttons:
     - ✓ **Approve** (green)
     - ↻ **Request Revision** (orange)
     - ✕ **Reject** (red)

3. **Rate the work** (if approving)
   - Click on the stars to rate 1-5
   - Hover to preview the rating
   - Rating is REQUIRED for approval

4. **Provide feedback**
   - Type detailed feedback in the textarea
   - The placeholder text will guide you based on your decision
   - Feedback is REQUIRED for all decisions

5. **Submit the review**
   - Click the color-coded submit button at the bottom
   - The button text changes based on your decision:
     - "✓ Approve Work"
     - "↻ Request Revision"
     - "✕ Reject Work"

### Visual Guide

```
┌─────────────────────────────────────────────────────────┐
│  Workspace Manager                                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌────────────────────────────────┐  │
│  │              │  │  Milestone: hi                  │  │
│  │  Milestones  │  │  E-commerce Platform Dev        │  │
│  │    List      │  │                                 │  │
│  │              │  │  ┌──────────┐  ┌─────────────┐ │  │
│  │  [hi]        │  │  │💬 Team   │  │📤 Submissions│ │  │
│  │  [fff]       │  │  │  Chat    │  │   (1)       │ │  │ <- CLICK HERE!
│  │              │  │  └──────────┘  └─────────────┘ │  │
│  │              │  │                                 │  │
│  │              │  │  ┌──────────────────────────┐  │  │
│  │              │  │  │ Submission Card          │  │  │
│  │              │  │  │ Title: nnnn              │  │  │
│  │              │  │  │ by: Admin Matchy         │  │  │
│  │              │  │  │ Status: Pending Review   │  │  │
│  │              │  │  │                          │  │  │
│  │              │  │  │ [Review] <- BUTTON HERE! │  │  │
│  │              │  │  └──────────────────────────┘  │  │
│  └──────────────┘  └────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Troubleshooting

### "I don't see the Review button"
- **Solution**: Make sure you clicked on the **"📤 Submissions"** tab (not the Team Chat tab)
- The tab should be highlighted in purple/blue when active
- There's a badge showing the number of submissions

### "The Submissions tab is empty"
- **Solution**: Make sure the freelancer has submitted work
- Check that you selected a milestone that has submissions
- The freelancer needs to go to their workspace and submit work first

### "I can't click the Review button"
- **Solution**: Try refreshing the page
- Check the browser console for errors (F12)
- Make sure both frontend and backend servers are running

### "The modal doesn't open"
- **Solution**: Check browser console for JavaScript errors
- Try clicking the button again
- Refresh the page and try again

## Quick Checklist

Before reviewing:
- [ ] I'm in the Workspace Manager page
- [ ] I've selected a milestone from the left panel
- [ ] I've clicked on the **"📤 Submissions"** tab (NOT Team Chat)
- [ ] I can see the submission cards
- [ ] I can see the "Review" button at the bottom of each card

## Need Help?

If you still can't see the Review button:
1. Open browser console (F12)
2. Check for any red error messages
3. Take a screenshot showing:
   - The full page
   - Which tab is active
   - The submission card
4. Check that the submission actually exists in the database

---

**Remember**: The Review button is ONLY visible on the **Submissions tab**, not on the Team Chat tab!
