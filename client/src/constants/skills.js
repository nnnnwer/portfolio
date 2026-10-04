import { Braces, Database, LayoutTemplate, Server, Shapes, Wrench } from 'lucide-react';

/** Display order and labels for skill categories (keys match the database). */
export const SKILL_CATEGORIES = [
  { key: 'language', label: 'Programming languages', icon: Braces },
  { key: 'frontend', label: 'Frontend', icon: LayoutTemplate },
  { key: 'backend', label: 'Backend', icon: Server },
  { key: 'database', label: 'Databases', icon: Database },
  { key: 'tools', label: 'Development tools', icon: Wrench },
  { key: 'other', label: 'Other', icon: Shapes },
];

export const SKILL_LEVELS = {
  1: 'Beginner',
  2: 'Elementary',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

export const MAX_SKILL_LEVEL = 5;
