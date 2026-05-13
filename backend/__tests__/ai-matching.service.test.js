/**
 * Unit Tests for AI Matching Service
 * Tests the AI-powered freelancer matching algorithm
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateMatchScore } from '../ai-matching.service.js';

describe('AI Matching Service - calculateMatchScore', () => {
  
  let mockFreelancer;
  let mockProject;

  beforeEach(() => {
    // Setup mock data before each test
    mockFreelancer = {
      freelancer_id: 1,
      freelancer_name: 'Ahmed Ben Ali',
      skills: JSON.stringify(['Angular', 'TypeScript', 'Node.js', 'MySQL']),
      experience_years: 5,
      average_rating: 4.5,
      success_rate: 90,
      availability: 'available'
    };

    mockProject = {
      id: 1,
      project_title: 'E-commerce Platform',
      skills: JSON.stringify(['Angular', 'TypeScript', 'Node.js']),
      budget: 5000,
      status: 'open'
    };
  });

  test('should calculate perfect match score (100) when all criteria are met', () => {
    // Perfect freelancer
    const perfectFreelancer = {
      ...mockFreelancer,
      experience_years: 10,
      average_rating: 5.0,
      success_rate: 100,
      availability: 'available'
    };

    const result = calculateMatchScore(perfectFreelancer, mockProject);

    expect(result.score).toBe(100);
    expect(result.matchingSkills).toHaveLength(3);
    expect(result.breakdown.skills).toBe(40); // 100% skills match
    expect(result.breakdown.experience).toBe(20); // 10 years experience
    expect(result.breakdown.rating).toBe(20); // 5.0 rating
    expect(result.breakdown.successRate).toBe(15); // 100% success rate
    expect(result.breakdown.availability).toBe(5); // available
  });

  test('should calculate correct score for partial skills match', () => {
    // Freelancer with only 2 out of 3 matching skills
    const partialFreelancer = {
      ...mockFreelancer,
      skills: JSON.stringify(['Angular', 'TypeScript', 'React']) // 2/3 match
    };

    const result = calculateMatchScore(partialFreelancer, mockProject);

    // 2/3 skills match = 66.67% * 40 points = 26.67 points
    expect(result.breakdown.skills).toBeCloseTo(26.67, 1);
    expect(result.matchingSkills).toHaveLength(2);
    expect(result.matchingSkills).toContain('Angular');
    expect(result.matchingSkills).toContain('TypeScript');
  });

  test('should handle case-insensitive skill matching', () => {
    const freelancerWithDifferentCase = {
      ...mockFreelancer,
      skills: JSON.stringify(['angular', 'TYPESCRIPT', 'node.js'])
    };

    const result = calculateMatchScore(freelancerWithDifferentCase, mockProject);

    expect(result.matchingSkills).toHaveLength(3);
    expect(result.breakdown.skills).toBe(40); // Full skills match
  });

  test('should calculate experience score correctly', () => {
    // Test different experience levels
    const juniorFreelancer = { ...mockFreelancer, experience_years: 2 };
    const midFreelancer = { ...mockFreelancer, experience_years: 5 };
    const seniorFreelancer = { ...mockFreelancer, experience_years: 10 };

    const juniorResult = calculateMatchScore(juniorFreelancer, mockProject);
    const midResult = calculateMatchScore(midFreelancer, mockProject);
    const seniorResult = calculateMatchScore(seniorFreelancer, mockProject);

    // Experience score = (years / 10) * 20 points
    expect(juniorResult.breakdown.experience).toBe(4); // 2/10 * 20 = 4
    expect(midResult.breakdown.experience).toBe(10); // 5/10 * 20 = 10
    expect(seniorResult.breakdown.experience).toBe(20); // 10/10 * 20 = 20
  });

  test('should cap experience score at 20 points for 10+ years', () => {
    const veryExperiencedFreelancer = {
      ...mockFreelancer,
      experience_years: 15 // More than 10 years
    };

    const result = calculateMatchScore(veryExperiencedFreelancer, mockProject);

    expect(result.breakdown.experience).toBe(20); // Capped at 20
  });

  test('should calculate rating score correctly', () => {
    const lowRatedFreelancer = { ...mockFreelancer, average_rating: 2.5 };
    const highRatedFreelancer = { ...mockFreelancer, average_rating: 5.0 };

    const lowResult = calculateMatchScore(lowRatedFreelancer, mockProject);
    const highResult = calculateMatchScore(highRatedFreelancer, mockProject);

    // Rating score = (rating / 5) * 20 points
    expect(lowResult.breakdown.rating).toBe(10); // 2.5/5 * 20 = 10
    expect(highResult.breakdown.rating).toBe(20); // 5/5 * 20 = 20
  });

  test('should calculate success rate score correctly', () => {
    const lowSuccessFreelancer = { ...mockFreelancer, success_rate: 50 };
    const highSuccessFreelancer = { ...mockFreelancer, success_rate: 100 };

    const lowResult = calculateMatchScore(lowSuccessFreelancer, mockProject);
    const highResult = calculateMatchScore(highSuccessFreelancer, mockProject);

    // Success rate score = (rate / 100) * 15 points
    expect(lowResult.breakdown.successRate).toBe(7.5); // 50/100 * 15 = 7.5
    expect(highResult.breakdown.successRate).toBe(15); // 100/100 * 15 = 15
  });

  test('should give 5 points for available freelancers', () => {
    const availableFreelancer = { ...mockFreelancer, availability: 'available' };
    const busyFreelancer = { ...mockFreelancer, availability: 'busy' };

    const availableResult = calculateMatchScore(availableFreelancer, mockProject);
    const busyResult = calculateMatchScore(busyFreelancer, mockProject);

    expect(availableResult.breakdown.availability).toBe(5);
    expect(busyResult.breakdown.availability).toBe(0);
  });

  test('should handle empty skills arrays', () => {
    const noSkillsFreelancer = {
      ...mockFreelancer,
      skills: JSON.stringify([])
    };

    const result = calculateMatchScore(noSkillsFreelancer, mockProject);

    expect(result.breakdown.skills).toBe(0);
    expect(result.matchingSkills).toHaveLength(0);
  });

  test('should handle project with no required skills', () => {
    const noSkillsProject = {
      ...mockProject,
      skills: JSON.stringify([])
    };

    const result = calculateMatchScore(mockFreelancer, noSkillsProject);

    expect(result.breakdown.skills).toBe(0);
    expect(result.matchingSkills).toHaveLength(0);
  });

  test('should handle skills as array (not JSON string)', () => {
    const freelancerWithArraySkills = {
      ...mockFreelancer,
      skills: ['Angular', 'TypeScript', 'Node.js']
    };

    const projectWithArraySkills = {
      ...mockProject,
      skills: ['Angular', 'TypeScript', 'Node.js']
    };

    const result = calculateMatchScore(freelancerWithArraySkills, projectWithArraySkills);

    expect(result.matchingSkills).toHaveLength(3);
    expect(result.breakdown.skills).toBe(40);
  });

  test('should return score rounded to 2 decimal places', () => {
    const result = calculateMatchScore(mockFreelancer, mockProject);

    // Check that score has at most 2 decimal places
    const decimalPlaces = (result.score.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });

  test('should return all required properties in result', () => {
    const result = calculateMatchScore(mockFreelancer, mockProject);

    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('matchingSkills');
    expect(result).toHaveProperty('breakdown');
    expect(result.breakdown).toHaveProperty('skills');
    expect(result.breakdown).toHaveProperty('experience');
    expect(result.breakdown).toHaveProperty('rating');
    expect(result.breakdown).toHaveProperty('successRate');
    expect(result.breakdown).toHaveProperty('availability');
  });

  test('should calculate realistic score for typical freelancer', () => {
    // Typical mid-level freelancer
    const typicalFreelancer = {
      ...mockFreelancer,
      skills: JSON.stringify(['Angular', 'TypeScript']), // 2/3 match
      experience_years: 3,
      average_rating: 4.0,
      success_rate: 85,
      availability: 'available'
    };

    const result = calculateMatchScore(typicalFreelancer, mockProject);

    // Expected: ~26.67 (skills) + 6 (exp) + 16 (rating) + 12.75 (success) + 5 (avail) = ~66.42
    expect(result.score).toBeGreaterThan(60);
    expect(result.score).toBeLessThan(70);
  });
});
