export interface JUser {
  id: string;
  name: string;
  email: string;
  password: string;
  description: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  projectAdmin: string;
}

export interface JUserProjects {
  userId: string;
  projectId: number;
}
