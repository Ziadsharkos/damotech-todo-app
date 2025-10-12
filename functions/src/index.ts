import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getFirestore} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin/app";

// Initialize Firebase Admin SDK
initializeApp();

/**
 * Trigger Function: Runs automatically when a new todo is created
 */
export const onTaskCreated = onDocumentCreated(
  "todos/{todoId}",
  async (event) => {
    const todoData = event.data?.data();
    
    if (!todoData) {
      logger.warn("No data found in the created document");
      return;
    }

    logger.info("New task created!", {
      todoId: event.params.todoId,
      title: todoData.title,
      userId: todoData.userId,
      createdAt: todoData.createdAt,
    });

    // can send push notifications, trigger email notifs if needed

    logger.info(`Task "${todoData.title}" successfully processed`);
  }
);

/**
 * Callable Function: Get task statistics for the current user
 */
export const getTaskStats = onCall(async (request) => {
  // Authentication check
  if (!request.auth) {
    throw new Error("User must be authenticated to get task stats");
  }

  const userId = request.auth.uid;
  const db = getFirestore();

  try {
    // Query all todos for the authenticated user
    const todosSnapshot = await db
      .collection("todos")
      .where("userId", "==", userId)
      .get();

    // Calculate statistics
    let activeCount = 0;
    let completedCount = 0;

    todosSnapshot.forEach((doc) => {
      const todo = doc.data();
      if (todo.completed) {
        completedCount++;
      } else {
        activeCount++;
      }
    });

    const stats = {
      total: todosSnapshot.size,
      active: activeCount,
      completed: completedCount,
      userId: userId,
      timestamp: new Date().toISOString(),
    };

    logger.info("Task stats calculated successfully", {
      userId,
      stats,
    });

    return stats;
  } catch (error) {
    logger.error("Error calculating task stats:", error);
    throw new Error("Failed to retrieve task statistics");
  }
});

/**
 *  verify functions are deployed
 */
export const healthCheck = onCall(async () => {
  return {
    status: "healthy",
    message: "Cloud Functions are running successfully",
    timestamp: new Date().toISOString(),
    functions: ["onTaskCreated", "getTaskStats", "healthCheck"],
  };
});
