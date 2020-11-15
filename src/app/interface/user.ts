export interface JUser {
  id: string;
  name: string;
  email: string;
  description: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface JUserProjects {
  userId: string;
  projectId: number;
}
