# Damotech Task Manager

A full-stack task management application built with Angular and Firebase, demonstrating modern web development practices.

## Live Demo

**Deployed Application:** https://damotech-todo-app.web.app *(will add after deployment)*

**Test it now** - No setup required! Just visit the link, register, and start managing tasks.

## Technologies Used

### Frontend
- **Angular 18** - Modern web framework with standalone components
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming for real-time updates
- **SCSS** - Advanced styling with Damotech brand colors

### Backend
- **Firebase Authentication** - Secure user management
- **Cloud Firestore** - NoSQL real-time database
- **Cloud Functions** - Serverless backend logic
- **Firebase Hosting** - Fast, secure web hosting

## Features

- ✅ User authentication (register/login with email/password)
- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as completed
- ✅ Filter tasks (All/Active/Completed)
- ✅ Real-time task statistics via Cloud Functions
- ✅ Responsive design with Damotech branding
- ✅ Protected routes with authentication guards
- ✅ Firestore security rules for data isolation

## Prerequisites for Development

- Node.js 20.19+ or 22.12+
- npm 10+
- Git

## Local Development Setup

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/Ziadsharkos/damotech-todo-app.git
cd damotech-todo-app
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Run locally

\`\`\`bash
npm start
\`\`\`

Application runs on `http://localhost:4200`

**Note:** The application is configured to use the deployed Firebase backend. You can test locally without any Firebase setup!

## For Evaluators: Running Locally

The application is **ready to run** without any configuration:

\`\`\`bash
git clone https://github.com/Ziadsharkos/damotech-todo-app.git
cd damotech-todo-app
npm install
npm start
\`\`\`

Visit `http://localhost:4200` and the app will connect to the deployed Firebase backend.

## Project Structure

\`\`\`
damotech-todo-app/
├── src/
│   ├── app/
│   │   ├── components/          # UI components
│   │   │   ├── login/           # Authentication - login page
│   │   │   ├── register/        # Authentication - registration
│   │   │   └── todo-list/       # Main todo management interface
│   │   ├── services/            # Business logic services
│   │   │   ├── auth.ts          # Firebase Authentication service
│   │   │   ├── todo.ts          # Firestore CRUD operations
│   │   │   └── cloud-functions.ts  # Cloud Functions integration
│   │   ├── guards/              # Route protection
│   │   │   └── auth-guard.ts    # Prevents unauthorized access
│   │   ├── models/              # TypeScript interfaces
│   │   │   └── todo.ts          # Todo data model
│   │   └── environments/        # Firebase configuration
│   └── styles.scss              # Global styles (Damotech branding)
├── functions/                   # Backend Cloud Functions
│   └── src/
│       └── index.ts             # Serverless functions (triggers, callables)
├── firestore.rules              # Database security rules
├── firebase.json                # Firebase hosting configuration
└── README.md                    # This file
\`\`\`

## Architecture & Design Decisions

### Data Flow

\`\`\`
User Interface (Angular)
       ↓
Firebase Authentication → User Login/Registration
       ↓
Firestore Database → Real-time CRUD Operations
       ↓
Cloud Functions → Task Statistics & Background Tasks
\`\`\`

### Key Architectural Choices

#### 1. **Direct Firestore Access for CRUD Operations**

**Why not use Cloud Functions for all database operations?**

- ✅ **Real-time updates**: Firestore Observables provide automatic UI updates
- ✅ **Offline support**: Built-in caching and sync
- ✅ **Lower latency**: Direct database connection
- ✅ **Cost-effective**: No function invocations for simple CRUD
- ✅ **Simpler code**: Less boilerplate

**Security:** Firestore Security Rules ensure data isolation (users only access their own todos).

#### 2. **Cloud Functions for Aggregation**

Used for:
- **Task statistics calculation** (demonstrates backend capability)
- **Automatic logging** when tasks are created (Firestore triggers)
- **Health checks** for monitoring

**Why?**
- Server-side calculations prevent client manipulation
- Demonstrates full-stack expertise
- Shows understanding of serverless architecture

#### 3. **Standalone Components (Modern Angular)**

- Simpler dependency management
- Better tree-shaking (smaller bundle sizes)
- Future-proof architecture

#### 4. **TypeScript Throughout**

- Type safety in both frontend and backend
- Better IDE support and developer experience
- Catch errors at compile-time

### Security Implementation

**Three-layer security:**

1. **Firebase Authentication**: Verifies user identity
2. **Firestore Security Rules**: Enforces data access policies at database level
3. **Cloud Functions Auth Check**: Validates user in callable functions

\`\`\`javascript
// Firestore rule example
allow read: if request.auth != null && 
               resource.data.userId == request.auth.uid;
\`\`\`

Users can **only** access their own data, even if they try to manipulate API calls.

## Security Rules

**Implemented rules ensure:**
- ✅ Users must be authenticated to access any data
- ✅ Users can only read/write their own todos
- ✅ Required fields (`title`, `completed`, `userId`) are validated on creation
- ✅ `userId` cannot be changed after task creation
- ❌ No cross-user data access possible

## Cloud Functions

### 1. **onTaskCreated** (Firestore Trigger)
**Type:** Event-driven trigger  
**Trigger:** Fires automatically when a document is created in the `todos` collection  
**Purpose:** Logs task creation for monitoring and analytics

**Use cases in production:**
- Send email notifications
- Update user statistics
- Trigger workflows
- Log to analytics platforms

### 2. **getTaskStats** (HTTPS Callable)
**Type:** Callable function (called from Angular)  
**Purpose:** Calculates and returns task statistics (total, active, completed)  
**Security:** Requires authentication, only returns current user's stats

**Why not calculate client-side?**
- Prevents data manipulation
- Demonstrates secure server-side logic
- Could aggregate data from multiple sources

### 3. **healthCheck** (HTTPS Callable)
**Type:** Callable function  
**Purpose:** Verifies Cloud Functions are deployed and operational  
**Use:** Monitoring and debugging

## UI/UX Design

- **Color Scheme:** Damotech orange (#f38b3c) with white
- **Typography:** Work Sans (similar to Craft Gothic)
- **Layout:** Clean, modern, responsive
- **Interactions:** Smooth animations and hover effects
- **Accessibility:** Proper contrast ratios and semantic HTML

## Deployment Process

This application is deployed on Firebase:

\`\`\`bash
# Build Angular app
ng build --configuration production

# Deploy everything
firebase deploy
\`\`\`

**Services deployed:**
- ✅ Firebase Hosting (Angular SPA)
- ✅ Cloud Functions (3 functions)
- ✅ Firestore Rules

## Git Workflow

Professional branching strategy used:

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/firebase-setup` - Firebase configuration
- `feature/authentication` - User authentication system
- `feature/todo-management` - CRUD operations
- `feature/cloud-functions-integration` - Backend functions
- `feature/branding-and-titles` - UI/UX improvements

**Commits follow Conventional Commits:**
- `feat:` New features
- `fix:` Bug fixes
- `chore:` Configuration/tooling
- `docs:` Documentation
- `refactor:` Code restructuring

## Technical Highlights for Assessment

### What This Project Demonstrates

1. ✅ **Full-stack development** - Frontend (Angular) + Backend (Cloud Functions)
2. ✅ **Modern Angular** - Standalone components, inject() pattern, RxJS
3. ✅ **Firebase expertise** - Auth, Firestore, Functions, Hosting
4. ✅ **Security awareness** - Authentication, authorization, data validation
5. ✅ **Real-time features** - Firestore Observables for live updates
6. ✅ **Serverless architecture** - Event-driven and callable functions
7. ✅ **TypeScript proficiency** - Full type safety throughout
8. ✅ **Professional Git practices** - Feature branches, atomic commits
9. ✅ **Production deployment** - Live application on Firebase
10. ✅ **Clean code** - Well-organized, documented, maintainable

### Challenges Overcome

- **Async auth state management** - Handled race conditions in component initialization
- **Firestore type handling** - Managed Timestamp vs Date conversions
- **Query indexing** - Configured composite indexes for complex queries
- **Injection context** - Resolved Angular DI issues with `inject()` function
- **Security rules** - Implemented robust user data isolation

## Author

**Ziad Elsharkawi**  
GitHub: [@Ziadsharkos](https://github.com/Ziadsharkos)

## Assessment Details

**Company:** Damotech  
**Position:** Full-stack Developer  
**Date:** October 2025

This project fulfills all requirements:
- ✅ Angular web application
- ✅ Firebase Hosting deployment
- ✅ Firestore database integration
- ✅ Firebase Authentication
- ✅ At least one deployed Cloud Function (3 implemented)
- ✅ User account creation and authentication
- ✅ Protected routes
- ✅ Complete todo list CRUD operations
- ✅ Professional documentation
- ✅ Clean, maintainable code
\`\`\`

---

# This is Better Because:

1. **No setup required** - Evaluators just clone and run
2. **Works immediately** - Points to your deployed Firebase
3. **Clear documentation** - Architecture and design decisions explained
4. **Professional presentation** - Shows your thought process

---

## Update README
```bash
# Update the README.md file with the content above
git add README.md
git commit -m "docs: update README for evaluators with architecture details and no-setup instructions"