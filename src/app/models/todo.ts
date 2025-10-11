export interface Todo {
  id?: string;              // document ID (optional, set after creation)
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}