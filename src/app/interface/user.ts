export interface JUser {
  id: string;
  name: string;
  email: string;
  description: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  projectAdmin: number[];
}

export interface JUserProjects {
  userId: string;
  projectId: number;
}
