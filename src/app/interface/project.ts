import { JIssue } from './issue';
import { JUser } from './user';

export interface JProject {
  id: string;
  name: string;
  url: string;
  description: string;
  category: ProjectCategory;
  createdAt: string;
  updateAt: string;
  issues: JIssue[];
  users: JUser[];
}

export enum ProjectCategory {
  SOFTWARE = 'Software',
  MARKETING = 'Marketing',
  BUSINESS = 'Business'
}

export interface JProjectDemo {
  id: number;
  name: string;
  description: string;
  projectCategoriesId: number;
  createdAt: string;
  updateAt: string;
  groupId: number;
}

export interface JProjectCategories {
  id: number;
  category: string;
}
