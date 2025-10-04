export interface Todo {
  id?: string;              // Firestore document ID (optional, set after creation)
  title: string;            // Task title
  description?: string;
  completed: boolean;       // Task status
  userId: string;           // Who's task
  createdAt: Date;          // When created
  updatedAt: Date;          // When last modified
}