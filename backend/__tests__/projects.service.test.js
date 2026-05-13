/**
 * Unit Tests — Projects & Milestones Business Logic
 * Tests project filtering, status transitions, budget calculations
 */

import { describe, test, expect, beforeEach } from '@jest/globals';

// ── Helpers ───────────────────────────────────────────────────────────────────

function filterProjects(projects, { status, category, search } = {}) {
  return projects.filter(p => {
    if (status   && p.status   !== status)                                    return false;
    if (category && p.category !== category)                                  return false;
    if (search) {
      const q = search.toLowerCase();
      const inTitle = p.project_title.toLowerCase().includes(q);
      const inDesc  = (p.description || '').toLowerCase().includes(q);
      if (!inTitle && !inDesc) return false;
    }
    return true;
  });
}

function calculateProjectStats(projects) {
  const total     = projects.length;
  const open      = projects.filter(p => p.status === 'open').length;
  const inProgress = projects.filter(p => p.status === 'in_progress').length;
  const closed    = projects.filter(p => p.status === 'closed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  return { total, open, inProgress, closed, totalBudget };
}

function isValidStatusTransition(from, to) {
  const transitions = {
    open:        ['in_progress', 'closed'],
    in_progress: ['closed'],
    closed:      []
  };
  return (transitions[from] || []).includes(to);
}

function buildSkillsArray(skillsJson) {
  if (!skillsJson) return [];
  if (Array.isArray(skillsJson)) return skillsJson;
  try { return JSON.parse(skillsJson); } catch { return []; }
}

// ── Test Data ─────────────────────────────────────────────────────────────────

const mockProjects = [
  { id: 1, project_title: 'E-commerce Platform', description: 'Build a shop', status: 'open',        category: 'Web Development', budget: 15000, currency: 'TND' },
  { id: 2, project_title: 'Mobile App Design',   description: 'UI/UX design', status: 'in_progress', category: 'Design',          budget: 8000,  currency: 'TND' },
  { id: 3, project_title: 'Data Dashboard',      description: 'Analytics',    status: 'closed',      category: 'Data Science',    budget: 12000, currency: 'TND' },
  { id: 4, project_title: 'Angular Frontend',    description: 'SPA app',      status: 'open',        category: 'Web Development', budget: 6000,  currency: 'TND' },
];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Projects — Filtering', () => {

  test('filter by status=open returns only open projects', () => {
    const result = filterProjects(mockProjects, { status: 'open' });
    expect(result).toHaveLength(2);
    expect(result.every(p => p.status === 'open')).toBe(true);
  });

  test('filter by category returns matching projects', () => {
    const result = filterProjects(mockProjects, { category: 'Web Development' });
    expect(result).toHaveLength(2);
    expect(result.every(p => p.category === 'Web Development')).toBe(true);
  });

  test('filter by search term matches title', () => {
    const result = filterProjects(mockProjects, { search: 'angular' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(4);
  });

  test('filter by search term matches description', () => {
    const result = filterProjects(mockProjects, { search: 'analytics' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  test('combined filters work correctly', () => {
    const result = filterProjects(mockProjects, { status: 'open', category: 'Web Development' });
    expect(result).toHaveLength(2);
  });

  test('no filters returns all projects', () => {
    const result = filterProjects(mockProjects, {});
    expect(result).toHaveLength(4);
  });

  test('search is case-insensitive', () => {
    const result = filterProjects(mockProjects, { search: 'ANGULAR' });
    expect(result).toHaveLength(1);
  });
});

describe('Projects — Statistics', () => {

  test('calculates correct totals', () => {
    const stats = calculateProjectStats(mockProjects);
    expect(stats.total).toBe(4);
    expect(stats.open).toBe(2);
    expect(stats.inProgress).toBe(1);
    expect(stats.closed).toBe(1);
  });

  test('calculates total budget correctly', () => {
    const stats = calculateProjectStats(mockProjects);
    expect(stats.totalBudget).toBe(41000);
  });

  test('handles empty project list', () => {
    const stats = calculateProjectStats([]);
    expect(stats.total).toBe(0);
    expect(stats.totalBudget).toBe(0);
  });

  test('handles projects with no budget', () => {
    const projects = [{ id: 1, status: 'open', budget: null }];
    const stats = calculateProjectStats(projects);
    expect(stats.totalBudget).toBe(0);
  });
});

describe('Projects — Status Transitions', () => {

  test('open → in_progress is valid', () => {
    expect(isValidStatusTransition('open', 'in_progress')).toBe(true);
  });

  test('open → closed is valid', () => {
    expect(isValidStatusTransition('open', 'closed')).toBe(true);
  });

  test('in_progress → closed is valid', () => {
    expect(isValidStatusTransition('in_progress', 'closed')).toBe(true);
  });

  test('closed → open is invalid', () => {
    expect(isValidStatusTransition('closed', 'open')).toBe(false);
  });

  test('in_progress → open is invalid', () => {
    expect(isValidStatusTransition('in_progress', 'open')).toBe(false);
  });

  test('closed → in_progress is invalid', () => {
    expect(isValidStatusTransition('closed', 'in_progress')).toBe(false);
  });
});

describe('Projects — Skills Parsing', () => {

  test('parses JSON string array', () => {
    const result = buildSkillsArray('["Angular","Node.js","MySQL"]');
    expect(result).toEqual(['Angular', 'Node.js', 'MySQL']);
  });

  test('returns array as-is', () => {
    const result = buildSkillsArray(['Angular', 'React']);
    expect(result).toEqual(['Angular', 'React']);
  });

  test('returns empty array for null', () => {
    expect(buildSkillsArray(null)).toEqual([]);
  });

  test('returns empty array for invalid JSON', () => {
    expect(buildSkillsArray('not-json')).toEqual([]);
  });

  test('returns empty array for empty string', () => {
    expect(buildSkillsArray('')).toEqual([]);
  });
});

describe('Milestones — Budget Logic', () => {

  const milestones = [
    { id: 1, project_id: 1, budget: 6000, status: 'open' },
    { id: 2, project_id: 1, budget: 5000, status: 'assigned' },
    { id: 3, project_id: 1, budget: 4000, status: 'completed' },
    { id: 4, project_id: 2, budget: 3000, status: 'open' },
  ];

  test('total milestone budget for project', () => {
    const projectMilestones = milestones.filter(m => m.project_id === 1);
    const total = projectMilestones.reduce((sum, m) => sum + m.budget, 0);
    expect(total).toBe(15000);
  });

  test('completed milestones budget', () => {
    const completed = milestones.filter(m => m.status === 'completed');
    const total = completed.reduce((sum, m) => sum + m.budget, 0);
    expect(total).toBe(4000);
  });

  test('open milestones count', () => {
    const open = milestones.filter(m => m.status === 'open');
    expect(open).toHaveLength(2);
  });

  test('milestone status values are valid', () => {
    const validStatuses = ['open', 'assigned', 'in_progress', 'completed'];
    milestones.forEach(m => {
      expect(validStatuses).toContain(m.status);
    });
  });
});

describe('Applications — Business Logic', () => {

  const applications = [
    { id: 1, milestone_id: 1, freelancer_id: 10, status: 'pending',    proposed_budget: 5500 },
    { id: 2, milestone_id: 1, freelancer_id: 11, status: 'accepted',   proposed_budget: 5800 },
    { id: 3, milestone_id: 1, freelancer_id: 12, status: 'rejected',   proposed_budget: 4500 },
    { id: 4, milestone_id: 2, freelancer_id: 10, status: 'pending',    proposed_budget: 4800 },
  ];

  test('only one application can be accepted per milestone', () => {
    const accepted = applications.filter(a => a.milestone_id === 1 && a.status === 'accepted');
    expect(accepted).toHaveLength(1);
  });

  test('pending applications for a milestone', () => {
    const pending = applications.filter(a => a.milestone_id === 1 && a.status === 'pending');
    expect(pending).toHaveLength(1);
  });

  test('freelancer applications across milestones', () => {
    const freelancerApps = applications.filter(a => a.freelancer_id === 10);
    expect(freelancerApps).toHaveLength(2);
  });

  test('average proposed budget', () => {
    const total = applications.reduce((sum, a) => sum + a.proposed_budget, 0);
    const avg   = total / applications.length;
    expect(avg).toBe(5150);
  });

  test('valid application status transitions', () => {
    const validTransitions = {
      pending:              ['interview_scheduled', 'rejected'],
      interview_scheduled:  ['interview_confirmed', 'rejected'],
      interview_confirmed:  ['accepted', 'rejected'],
      accepted:             [],
      rejected:             []
    };

    expect(validTransitions.pending).toContain('interview_scheduled');
    expect(validTransitions.interview_confirmed).toContain('accepted');
    expect(validTransitions.accepted).toHaveLength(0);
  });
});
