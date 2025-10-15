# Damotech Task Manager

> Full-stack technical assessment - Modern task management application built with Angular and Firebase

## Live Demo

**Deployed Application:** https://damotech-todo-app.web.app  
**GitHub Repository:** https://github.com/Ziadsharkos/damotech-todo-app

**Try it now!** Register your own account and start managing tasks immediately.

---

## Features

- **User Authentication** - Secure email/password registration and login
- **Task Management** - Create, view, update, and delete tasks
- **Real-time Sync** - Instant updates across devices
- **Task Completion** - Mark tasks as done with visual feedback
- **Smart Filtering** - View All, Active, or Completed tasks
- **Live Statistics** - Real-time task counts via Cloud Functions
- **Session Persistence** - Stay logged in across browser sessions
- **Email Notifications** - Automated notifications on task creation
- **Protected Routes** - Secure access control with auth guards
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Damotech Branding** - Company colors and professional styling

---

## Technology Stack

### Frontend
- **Angular 18** - Modern web framework with standalone components
- **TypeScript 5.9** - Type-safe development
- **RxJS** - Reactive programming for real-time updates
- **SCSS**

### Backend
- **Firebase Authentication** - Secure user management
- **Cloud Firestore** - NoSQL real-time database
- **Cloud Functions (Node.js 22)** - Serverless backend logic
- **Firebase Hosting** - Fast, secure web hosting with CDN

### Development Tools
- **Git** - Version control with feature branch workflow
- **Firebase CLI** - Deployment and management
- **ESLint** - Code quality and consistency

---

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm 10+
- Git

---

## Quick Start

### For Pascal (No Setup Required)

**Option 1: Use Deployed App**
Simply visit: https://damotech-todo-app.web.app

**Option 2: Run Locally**

```
# Clone repository
git clone https://github.com/Ziadsharkos/damotech-todo-app.git
cd damotech-todo-app

# Install dependencies
npm install

# Run development server
npm start

# Visit http://localhost:4200
```

**No Firebase configuration needed!** The app connects to the deployed Firebase backend automatically.

---

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────┐
│               User Interface (Angular)              │
└─────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Firebase   │  │  Firestore  │  │   Cloud     │
│    Auth     │  │  Database   │  │  Functions  │
└─────────────┘  └─────────────┘  └─────────────┘
      │                 │                 │
      └─────────────────┴─────────────────┘
              Real-time Sync & Security
```

### Key Architectural Decisions

#### 1. Direct Firestore Access for CRUD Operations

**Why not use Cloud Functions for all database operations?**

 **Advantages:**
- Real-time updates with Firestore Observables
- Built-in offline support and caching
- Lower latency (direct connection)
- Cost-effective (no function invocations)
- Simpler code (less boilerplate)

 **Security:** Enforced through Firestore Security Rules

#### 2. Cloud Functions for Server-Side Logic

**When we use Cloud Functions:**
- Task statistics calculation (prevents client manipulation)
- Email notifications (requires server-side API access)
- Background tasks (event-driven triggers)
- Health checks and monitoring

#### 3. Session Persistence

Implemented with Firebase Auth's `browserLocalPersistence`:
- Users stay logged in across browser sessions
- Tokens stored securely in IndexedDB
- Automatic token refresh

---

## Security Implementation

### Three-Layer Security Model

**1. Firebase Authentication**
- Validates user identity
- Issues secure JWT tokens
- Handles session management

**2. Firestore Security Rules**
```
// Users can only access their own data
allow read: if request.auth.uid == resource.data.userId;
allow create: if request.auth.uid == request.resource.data.userId;
```

**3. Cloud Functions Auth Checks**
```typescript
if (!request.auth) {
  throw new Error("User must be authenticated");
}
```

**Result:** Users can **only** access their own data, even if they try to manipulate API calls.

---

## Cloud Functions

### 1. onTaskCreated (Firestore Trigger)
**Type:** Event-driven  
**Trigger:** Automatically runs when a task is created  
**Purpose:** Logs task creation and sends email notification (demo)

**Production use cases:**
- Send email notifications
- Update analytics dashboards
- Log to monitoring systems

### 2. getTaskStats (HTTPS Callable)
**Type:** On-demand callable function  
**Purpose:** Calculates task statistics server-side  
**Security:** Requires authentication, returns only user's data

**Why server-side?**
- Prevents data manipulation
- Can aggregate from multiple sources
- Demonstrates secure calculations

### 3. healthCheck (HTTPS Callable)
**Type:** Monitoring endpoint  
**Purpose:** Verifies Cloud Functions deployment  
**Use:** Status checks and debugging

---

## Deployment

### Build and Deploy

```
# Build for production
ng build --configuration production

# Deploy to Firebase
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

### Deployment URLs

- **Application:** https://damotech-todo-app.web.app
- **Firebase Console:** https://console.firebase.google.com/project/damotech-todo-app

---

## Git Workflow

Professional branching strategy:

```
main (production)
└── develop (integration)
    ├── feature/firebase-setup
    ├── feature/authentication
    ├── feature/todo-management
    ├── feature/cloud-functions-integration
    └── feature/branding-and-titles
```

**Commit Convention:** Conventional Commits
- `feat:` New features
- `fix:` Bug fixes
- `chore:` Tooling/config
- `docs:` Documentation
- `refactor:` Code restructuring

### Bonus Features

- Task filtering (All/Active/Completed)
- Real-time statistics via Cloud Functions
- Email notifications (demo implementation)
- Session persistence
- Responsive design
- Professional branding

---

## Technical Highlights

### What This Project Demonstrates

1. **Full-Stack Development** - Frontend + Backend + Database
2. **Modern Angular** - Standalone components, RxJS, TypeScript
3. **Firebase Expertise** - Auth, Firestore, Functions, Hosting
4. **Security Awareness** - Authentication, authorization, data validation
5. **Real-Time Features** - Firestore Observables for live updates
6. **Serverless Architecture** - Event-driven and callable functions
7. **Professional Git** - Feature branches, atomic commits, conventional commits
8. **Production Deployment** - Live application on Firebase
9. **Clean Code** - Well-organized, documented, maintainable

### Challenges Overcome

- **Async Auth State** - Handled race conditions with Observable patterns
- **Firestore Types** - Managed Timestamp vs Date conversions
- **Query Indexing** - Configured composite indexes
- **Security Rules** - Implemented user data isolation

---

## Author

**Ziad Elsharkawi**  
GitHub: [@Ziadsharkos](https://github.com/Ziadsharkos)
---