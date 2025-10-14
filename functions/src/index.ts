import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getFirestore} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {defineSecret} from "firebase-functions/params";
import {MailService} from "@sendgrid/mail";
const sgMail = new MailService();
// Initialize Firebase Admin SDK
initializeApp();

const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");
const APP_URL = "https://damotech-todo-app.web.app";

/**
 * Trigger: email notification when a new todo is created
 */
export const onTaskCreated = onDocumentCreated(
  {
    document: "todos/{todoId}",
    secrets: [SENDGRID_API_KEY],
    region: "us-central1",
    database: "(default)",
    namespace: "(default)",
  },
  async (event) => {
    const todoData = event.data?.data();

    if (!todoData) {
      logger.warn("onTaskCreated: no data in created document");
      return;
    }

    const title: string = todoData.title;
    const description: string | undefined = todoData.description;
    const userId: string = todoData.userId;

    logger.info("onTaskCreated: new task", {
      todoId: event.params.todoId,
      title,
      userId,
      createdAt: todoData.createdAt,
    });

    try {
      // Fetch the user's email
      const userRecord = await getAuth().getUser(userId);
      const userEmail = userRecord.email;

      if (!userEmail) {
        logger.warn("onTaskCreated: user has no email", {userId});
        return;
      }

      // Configure SendGrid with secret
      const apiKey = SENDGRID_API_KEY.value();
      if (!apiKey) {
        logger.error("onTaskCreated: SENDGRID_API_KEY missing");
        return;
      }
      sgMail.setApiKey(apiKey);

      // Send the email
      const msg = {
        to: userEmail,
        from: "patrickjanesalah@gmail.com",
        subject: "✅ New Task Created - Damotech Task Manager",
        text: `Your task "${title}" has been created successfully!`,
        html: [
          "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">",
          "<h2 style=\"color: #f38b3c;\">Task Created Successfully!</h2>",
          "<p>Hello!</p>",
          "<p>Your task has been created:</p>",
          "<div style=\"background: #f5f5f5; padding: 15px; border-left: 4px solid #f38b3c; margin: 20px 0;\">",
          `<strong style="font-size: 18px;">${title}</strong>`,
          description ? `<p style="margin-top: 10px; color: #666;">${description}</p>` : "",
          "</div>",
          "<p>Open your tasks:</p>", // <- shorter line
          `<p><a href="${APP_URL}" style="color: #f38b3c;">Damotech Task Manager</a></p>`,
          "<hr style=\"border: none; border-top: 1px solid #ddd; margin: 20px 0;\">",
          // eslint-disable-next-line max-len
          "<p style=\"color: #999; font-size: 12px;\">This is an automated notification from Damotech Task Manager.</p>",
          "</div>",
        ].join(""),
      };

      await sgMail.send(msg);
      logger.info("onTaskCreated: email sent", {to: userEmail, taskTitle: title});
    } catch (err: unknown) {
      logger.error("onTaskCreated: email send failed", err);
    }
  }
);

/**
 * Callable: Get task statistics for the current user
 */
export const getTaskStats = onCall(async (request) => {
  if (!request.auth) {
    throw new Error("User must be authenticated to get task stats");
  }

  const userId = request.auth.uid;
  const db = getFirestore();

  try {
    const todosSnapshot = await db
      .collection("todos")
      .where("userId", "==", userId)
      .get();

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
      userId,
      timestamp: new Date().toISOString(),
    };

    logger.info("getTaskStats: calculated", {userId, stats});
    return stats;
  } catch (error) {
    logger.error("getTaskStats: error calculating stats", error);
    throw new Error("Failed to retrieve task statistics");
  }
});

/**
 * Callable: health check
 */
export const healthCheck = onCall(async () => {
  return {
    status: "healthy",
    message: "Cloud Functions are running successfully",
    timestamp: new Date().toISOString(),
    functions: ["onTaskCreated", "getTaskStats", "healthCheck"],
  };
});
