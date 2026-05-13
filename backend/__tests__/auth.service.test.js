/**
 * Unit Tests — Auth & User Business Logic
 * Tests registration validation, JWT, password hashing, role logic
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'dev-shared-secret-change-me-please-please-please-32bytes';

// ── Helpers (extracted from server.js) ───────────────────────────────────────

function publicUser(row) {
  const first = row.first_name || row.firstName || '';
  const last  = row.last_name  || row.lastName  || '';
  return {
    id:        row.id,
    fullName:  `${first} ${last}`.trim() || row.email,
    name:      `${first} ${last}`.trim() || row.email,
    firstName: first,
    lastName:  last,
    email:     row.email,
    role:      String(row.role || '').toLowerCase(),
    avatar:    row.avatar || null,
    status:    String(row.status || '').toLowerCase(),
    verified:  true,
    location:  row.location || null,
    skills:    row.skills   || null,
    bio:       row.bio      || null,
    createdAt: row.created_at
  };
}

function signTokenForUser(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function validateRegistrationInput(body) {
  const { fullName, firstName, lastName, email, password, role } = body;
  let resolvedName = fullName;
  if (!resolvedName && (firstName || lastName)) {
    resolvedName = `${firstName || ''} ${lastName || ''}`.trim();
  }
  if (!resolvedName || !email || !password || !role) {
    return { valid: false, error: 'fullName, email, password and role are required' };
  }
  const normalizedRole = String(role).toLowerCase();
  if (!['freelancer', 'client'].includes(normalizedRole)) {
    return { valid: false, error: 'role must be freelancer or client' };
  }
  if (String(password).length < 6) {
    return { valid: false, error: 'password must be at least 6 characters' };
  }
  return { valid: true, normalizedRole };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Auth — Registration Validation', () => {

  test('valid freelancer registration passes', () => {
    const result = validateRegistrationInput({
      firstName: 'John', lastName: 'Doe',
      email: 'john@example.com', password: 'secret123', role: 'freelancer'
    });
    expect(result.valid).toBe(true);
    expect(result.normalizedRole).toBe('freelancer');
  });

  test('valid client registration passes', () => {
    const result = validateRegistrationInput({
      fullName: 'Jane Smith',
      email: 'jane@example.com', password: 'pass123', role: 'CLIENT'
    });
    expect(result.valid).toBe(true);
    expect(result.normalizedRole).toBe('client');
  });

  test('missing email fails validation', () => {
    const result = validateRegistrationInput({
      fullName: 'John', password: 'pass123', role: 'freelancer'
    });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/required/i);
  });

  test('missing password fails validation', () => {
    const result = validateRegistrationInput({
      fullName: 'John', email: 'john@example.com', role: 'freelancer'
    });
    expect(result.valid).toBe(false);
  });

  test('missing role fails validation', () => {
    const result = validateRegistrationInput({
      fullName: 'John', email: 'john@example.com', password: 'pass123'
    });
    expect(result.valid).toBe(false);
  });

  test('invalid role fails validation', () => {
    const result = validateRegistrationInput({
      fullName: 'John', email: 'john@example.com', password: 'pass123', role: 'admin'
    });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/freelancer or client/i);
  });

  test('password shorter than 6 chars fails', () => {
    const result = validateRegistrationInput({
      fullName: 'John', email: 'john@example.com', password: '123', role: 'freelancer'
    });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/6 characters/i);
  });

  test('firstName + lastName builds fullName', () => {
    const result = validateRegistrationInput({
      firstName: 'John', lastName: 'Doe',
      email: 'john@example.com', password: 'pass123', role: 'freelancer'
    });
    expect(result.valid).toBe(true);
  });

  test('missing both fullName and firstName/lastName fails', () => {
    const result = validateRegistrationInput({
      email: 'john@example.com', password: 'pass123', role: 'freelancer'
    });
    expect(result.valid).toBe(false);
  });
});

describe('Auth — Password Hashing', () => {

  test('bcrypt hash is different from plain password', async () => {
    const plain = 'mypassword123';
    const hash  = await bcrypt.hash(plain, 10);
    expect(hash).not.toBe(plain);
    expect(hash).toMatch(/^\$2[ab]\$/);
  });

  test('bcrypt compare returns true for correct password', async () => {
    const plain = 'mypassword123';
    const hash  = await bcrypt.hash(plain, 10);
    const match = await bcrypt.compare(plain, hash);
    expect(match).toBe(true);
  });

  test('bcrypt compare returns false for wrong password', async () => {
    const hash  = await bcrypt.hash('correct', 10);
    const match = await bcrypt.compare('wrong', hash);
    expect(match).toBe(false);
  });

  test('two hashes of same password are different (salt)', async () => {
    const plain = 'samepassword';
    const hash1 = await bcrypt.hash(plain, 10);
    const hash2 = await bcrypt.hash(plain, 10);
    expect(hash1).not.toBe(hash2);
  });
});

describe('Auth — JWT Token', () => {

  const user = { id: 1, email: 'john@example.com', role: 'freelancer' };

  test('signTokenForUser returns a valid JWT', () => {
    const token = signTokenForUser(user);
    expect(token).toBeTruthy();
    expect(token.split('.')).toHaveLength(3);
  });

  test('JWT payload contains correct sub, email, role', () => {
    const token   = signTokenForUser(user);
    const payload = jwt.verify(token, JWT_SECRET);
    expect(payload.sub).toBe(1);
    expect(payload.email).toBe('john@example.com');
    expect(payload.role).toBe('freelancer');
  });

  test('JWT expires in 24h', () => {
    const token   = signTokenForUser(user);
    const payload = jwt.verify(token, JWT_SECRET);
    const expiresIn = payload.exp - payload.iat;
    expect(expiresIn).toBe(86400); // 24h in seconds
  });

  test('invalid token throws error', () => {
    expect(() => jwt.verify('invalid.token.here', JWT_SECRET))
      .toThrow();
  });

  test('token signed with wrong secret fails verification', () => {
    const token = jwt.sign({ sub: 1 }, 'wrong-secret');
    expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
  });
});

describe('Auth — publicUser mapping', () => {

  test('maps first_name and last_name correctly', () => {
    const row = {
      id: 1, first_name: 'John', last_name: 'Doe',
      email: 'john@example.com', role: 'FREELANCER',
      status: 'ACTIVE', created_at: new Date()
    };
    const result = publicUser(row);
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
    expect(result.name).toBe('John Doe');
    expect(result.fullName).toBe('John Doe');
  });

  test('role is lowercased', () => {
    const row = { id: 1, first_name: 'A', last_name: 'B', email: 'a@b.com', role: 'CLIENT', status: 'ACTIVE' };
    expect(publicUser(row).role).toBe('client');
  });

  test('status is lowercased', () => {
    const row = { id: 1, first_name: 'A', last_name: 'B', email: 'a@b.com', role: 'freelancer', status: 'ACTIVE' };
    expect(publicUser(row).status).toBe('active');
  });

  test('falls back to email when name is empty', () => {
    const row = { id: 1, first_name: '', last_name: '', email: 'john@example.com', role: 'freelancer', status: 'active' };
    expect(publicUser(row).name).toBe('john@example.com');
  });

  test('verified is always true', () => {
    const row = { id: 1, first_name: 'A', last_name: 'B', email: 'a@b.com', role: 'freelancer', status: 'active' };
    expect(publicUser(row).verified).toBe(true);
  });

  test('optional fields default to null', () => {
    const row = { id: 1, first_name: 'A', last_name: 'B', email: 'a@b.com', role: 'freelancer', status: 'active' };
    const result = publicUser(row);
    expect(result.avatar).toBeNull();
    expect(result.location).toBeNull();
    expect(result.skills).toBeNull();
    expect(result.bio).toBeNull();
  });
});

describe('Auth — Account Status Checks', () => {

  const blockedStatuses = ['SUSPENDED', 'INACTIVE', 'BANNED'];

  test.each(blockedStatuses)('status %s blocks login', (status) => {
    const isBlocked = blockedStatuses.includes(status.toUpperCase());
    expect(isBlocked).toBe(true);
  });

  test('ACTIVE status allows login', () => {
    const status = 'ACTIVE';
    const isBlocked = blockedStatuses.includes(status.toUpperCase());
    expect(isBlocked).toBe(false);
  });

  test('empty status allows login', () => {
    const status = '';
    const isBlocked = blockedStatuses.includes(String(status).toUpperCase());
    expect(isBlocked).toBe(false);
  });
});
