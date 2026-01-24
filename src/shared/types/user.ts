/**
 * User and authentication related types for NumberSense K-3
 */

/**
 * Grade levels supported by the application (Kindergarten through 3rd grade)
 */
export type GradeLevel = 'K' | '1' | '2' | '3';

/**
 * Parent account - the primary account holder
 */
export interface Parent {
  /** Unique identifier for the parent */
  id: string;
  /** Parent's email address (used for login) */
  email: string;
  /** Account creation timestamp */
  createdAt: Date;
}

/**
 * Child profile - linked to a parent account
 */
export interface Child {
  /** Unique identifier for the child */
  id: string;
  /** Reference to the parent's ID */
  parentId: string;
  /** Child's display name */
  name: string;
  /** Child's grade level */
  grade: GradeLevel;
  /** Selected avatar identifier */
  avatar: string;
  /** Profile creation timestamp */
  createdAt: Date;
}

/**
 * User session information
 */
export interface UserSession {
  /** The authenticated parent */
  parent: Parent;
  /** Children associated with this parent */
  children: Child[];
  /** Currently active child profile (if selected) */
  activeChildId: string | null;
}
