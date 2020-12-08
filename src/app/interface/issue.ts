import { JComment } from './comment';

export enum IssueType {
  STORY = 'Story',
  TASK = 'Task',
  BUG = 'Bug'
}

// export enum IssueStatus {
//   BACKLOG = 'Backlog',
//   SELECTED = 'Selected',
//   IN_PROGRESS = 'InProgress',
//   DONE = 'Done'
// }

export const IssueStatusDisplay = [
  { status: "Backlog", position: 0},
  { status: "Selected", position: 1},
  { status: "InProgress", position: 2},
  { status: "Done", position: 3}
];

// export enum IssuePriority {
//   LOWEST = 'Lowest',
//   LOW = 'Low',
//   MEDIUM = 'Medium',
//   HIGH = 'High',
//   HIGHEST = 'Highest'
// }

export const IssuePriorityColors = {
  5: '#CD1317',
  4: '#E9494A',
  3: '#E97F33',
  2: '#2D8738',
  1: '#57A55A'
};

export interface JIssue {
  id: string;
  title: string;
  issueTypeId: number;
  issueStatusId: number;
  issuePriorityId: number;
  listPosition: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  deadlineAt: string;
  reporterId: string;
  userIds: string;
}

export interface JIssueStatus {
  id: number;
  position: number;
  status: string;
  projectId: number;
}

export interface JIssueTypes {
  id: number;
  type: string;
}

export interface JIssuePriorities {
  id: number;
  priority: string;
}
