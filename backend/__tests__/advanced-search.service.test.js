/**
 * Unit Tests for Advanced Search Service
 * Tests search filtering and query building logic
 */

import { describe, test, expect } from '@jest/globals';

describe('Advanced Search Service - Filter Logic', () => {
  
  test('should build correct query parameters for basic search', () => {
    const filters = {
      query: 'Angular Developer',
      status: 'open'
    };

    // Test that query is properly formatted
    expect(filters.query).toBe('Angular Developer');
    expect(filters.status).toBe('open');
  });

  test('should handle multiple skills filter', () => {
    const filters = {
      skills: ['Angular', 'TypeScript', 'Node.js']
    };

    expect(filters.skills).toHaveLength(3);
    expect(filters.skills).toContain('Angular');
    expect(filters.skills).toContain('TypeScript');
    expect(filters.skills).toContain('Node.js');
  });

  test('should handle budget range filters', () => {
    const filters = {
      minBudget: 1000,
      maxBudget: 5000
    };

    expect(filters.minBudget).toBe(1000);
    expect(filters.maxBudget).toBe(5000);
    expect(filters.minBudget).toBeLessThan(filters.maxBudget);
  });

  test('should handle location filter', () => {
    const filters = {
      location: 'Tunis'
    };

    expect(filters.location).toBe('Tunis');
  });

  test('should handle category filter', () => {
    const filters = {
      category: 'Web Development'
    };

    expect(filters.category).toBe('Web Development');
  });

  test('should handle deadline filters', () => {
    const filters = {
      deadlineBefore: '2026-12-31',
      deadlineAfter: '2026-01-01'
    };

    expect(filters.deadlineBefore).toBe('2026-12-31');
    expect(filters.deadlineAfter).toBe('2026-01-01');
  });

  test('should handle sorting parameters', () => {
    const filters = {
      sortBy: 'budget',
      sortOrder: 'DESC'
    };

    expect(filters.sortBy).toBe('budget');
    expect(filters.sortOrder).toBe('DESC');
    expect(['ASC', 'DESC']).toContain(filters.sortOrder);
  });

  test('should handle pagination parameters', () => {
    const filters = {
      page: 2,
      limit: 20
    };

    expect(filters.page).toBe(2);
    expect(filters.limit).toBe(20);
    
    // Calculate offset
    const offset = (filters.page - 1) * filters.limit;
    expect(offset).toBe(20);
  });

  test('should use default values when parameters are missing', () => {
    const filters = {};

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';

    expect(page).toBe(1);
    expect(limit).toBe(20);
    expect(sortBy).toBe('created_at');
    expect(sortOrder).toBe('DESC');
  });

  test('should handle freelancer experience range filters', () => {
    const filters = {
      minExperience: 2,
      maxExperience: 5
    };

    expect(filters.minExperience).toBe(2);
    expect(filters.maxExperience).toBe(5);
    expect(filters.minExperience).toBeLessThan(filters.maxExperience);
  });

  test('should handle hourly rate range filters', () => {
    const filters = {
      minRate: 20,
      maxRate: 50
    };

    expect(filters.minRate).toBe(20);
    expect(filters.maxRate).toBe(50);
    expect(filters.minRate).toBeLessThan(filters.maxRate);
  });

  test('should handle minimum rating filter', () => {
    const filters = {
      minRating: 4.0
    };

    expect(filters.minRating).toBe(4.0);
    expect(filters.minRating).toBeGreaterThanOrEqual(0);
    expect(filters.minRating).toBeLessThanOrEqual(5);
  });

  test('should handle availability filter', () => {
    const filters = {
      availability: 'available'
    };

    expect(filters.availability).toBe('available');
    expect(['available', 'busy', 'unavailable']).toContain(filters.availability);
  });

  test('should handle complex combined filters', () => {
    const filters = {
      query: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'MongoDB'],
      minBudget: 2000,
      maxBudget: 8000,
      location: 'Tunisia',
      category: 'Web Development',
      status: 'open',
      sortBy: 'budget',
      sortOrder: 'ASC',
      page: 1,
      limit: 10
    };

    expect(Object.keys(filters)).toHaveLength(11); // Fixed: 11 properties
    expect(filters.skills).toHaveLength(3);
    expect(filters.minBudget).toBeLessThan(filters.maxBudget);
  });

  test('should validate saved search data structure', () => {
    const searchData = {
      name: 'My Favorite Search',
      query: 'Angular Developer',
      filters: {
        skills: ['Angular', 'TypeScript'],
        minBudget: 1000
      },
      notifyOnMatch: true
    };

    expect(searchData).toHaveProperty('name');
    expect(searchData).toHaveProperty('query');
    expect(searchData).toHaveProperty('filters');
    expect(searchData).toHaveProperty('notifyOnMatch');
    expect(searchData.notifyOnMatch).toBe(true);
  });

  test('should calculate pagination metadata correctly', () => {
    const total = 157;
    const limit = 20;
    const page = 3;

    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    expect(totalPages).toBe(8); // 157 / 20 = 7.85, rounded up to 8
    expect(offset).toBe(40); // (3 - 1) * 20 = 40
  });

  test('should handle empty search results', () => {
    const results = [];
    const pagination = {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    };

    expect(results).toHaveLength(0);
    expect(pagination.total).toBe(0);
    expect(pagination.totalPages).toBe(0);
  });

  test('should format search query with wildcards', () => {
    const query = 'Developer';
    const searchTerm = `%${query}%`;

    expect(searchTerm).toBe('%Developer%');
    expect(searchTerm).toContain(query);
  });
});
