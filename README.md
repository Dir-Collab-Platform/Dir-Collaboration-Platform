# Dir Collaboration Platform

**Dir** is a high-performance, developer-centric collaboration platform designed to bridge the gap between static GitHub repositories and dynamic, real-time team interaction. It transforms robust version control data into live "Workspaces," integrating code exploration with persistent, context-aware chat, reactions, and project management tools.

---

## 🏗 High-Level Architecture

The platform operates on a loosely coupled **Client-Server** architecture, optimized for high concurrency and real-time data flow.

-   **Frontend (SPA)**: A **React 19** based Single Page Application utilizing **Vite** for build performance. It handles optimistic UI updates, communicates via REST for transactional data, and uses WebSockets for real-time events.
-   **Backend (API Gateway & Orchestration)**: A **Node.js/Express 5** server acting as the central orchestration layer. It manages authentication (JWT/Passport), business logic, and proxies data requests to the GitHub API.
-   **Data Persistence Layer**:
    -   **MongoDB**: Stores application state (Workspaces, Channels, Messages, Users, Activity Logs, Tags).
    -   **Redis**: Acts as a high-speed throughput cache for GitHub API responses and complex query results (e.g., repository stars, file trees) to prevent rate-limiting and ensure sub-millisecond response times.
-   **Real-Time Engine**: A dedicated **Socket.io** layer handles event broadcasting (message received, user typing, channel updates, stats updates) to specific "rooms" based on Workspace IDs.

---

## 🛠 Technical Stack

### **Frontend**
| Technology | Justification |
| :--- | :--- |
| **React 19** | Leveraging the latest concurrent features for smooth rendering of complex file trees and chat lists. |
| **Vite** | Chosen for its lightning-fast HMR (Hot Module Replacement) and optimized production builds. |
| **TailwindCSS 4** | Provides a utility-first, performant styling engine that enables rapid UI iteration without style bloat. |
| **react-router v7** | Handles client-side routing with modern data loading capabilities. |
| **Socket.io-client** | Ensures robust, bidirectional communication for chat and notifications with automatic reconnection logic. |
| **Context API** | Simplified global state management for Authentication, Workspaces, and Chat data. |

### **Backend**
| Technology | Justification |
| :--- | :--- |
| **Node.js / Express 5** | Asynchronous, non-blocking I/O ideal for handling concurrent API requests and socket connections. |
| **Socket.io** | Powers the event-driven architecture required for "Leave Channel", "Reaction Updates", "Stats Updates", and "Typing Indicators". |
| **Redis** | **CRITICAL**: Serves as a volatile cache for GitHub repository contents and discovery lists. Prevents hitting GitHub's strict API rate limits. |
| **MongoDB (Mongoose)** | Flexible schema design perfect for the nested nature of `Workspaces -> Channels -> Messages`. |
| **Passport.js** | Modular authentication middleware handling GitHub OAuth strategies seamlessly. |

---

## 🚀 Implemented Capabilities

The following advanced features are currently production-ready:

### 1. **Workspace Management (Import & Create)**
-   **Import Existing:** Users can import any public or private GitHub repository they have access to. The system validates the repo, bootstraps a local `Workspace` record, and sets up a default `#general` channel.
-   **Create Remote:** Users can create **brand new repositories** on GitHub directly from the platform. This initializes the repo on GitHub (with README/GitIgnore) and immediately provisions a corresponding Workspace in Dir.
-   **Tags:** Custom tagging system for organizing workspaces ("Active", "Archived", "Learning", etc.).

### 2. **Cache-First File System Exploration**
Browsing large repositories is instantaneous. When a user utilizes the File Tree:
1.  **Lazy Loading:** The frontend only fetches the *immediate* children of a folder when expanded.
2.  **Redis Caching:** The backend checks Redis for the specific path key (`repo:content:owner:repo:path`).
3.  **Result:** < 5ms response times for cached paths, with automatic fallback to GitHub API on miss (then cached).

### 3. **Advanced Discovery & Search**
-   **Real-time Search:** Filter active workspaces by name, GitHub repo name, or tags.
-   **Pagination:** Efficiently handles user workspace lists with "Load More" functionality.
-   **Smart Caching:** Discovery lists are cached per user but invalidated instantly upon Import/Create/Delete actions to ensure data consistency.

### 4. **Real-Time Contextual Chat**
Chat is scoped to "Channels" within "Workspaces".
-   **Optimistic Updates:** UI shows messages/reactions immediately while confirming with the server.
-   **Rich Interactions:** Supports message deletion, granular reaction tracking (`:thumbsup:`, etc.), and user mentions.
-   **Socket Rooms:** Users only receive events for the specific workspace/channel they are viewing.

### 5. **GitHub Synchronization**
-   **Webhooks:** Intelligent webhook registration upon workspace creation to listen for remote changes.
-   **Manual Sync:** "Propagate" button to force-pull latest metadata (description, language, privacy status) from GitHub.
-   **Stats Tracking:** Caches and displays live repository stars from GitHub with a dedicated TTL to avoid rate limits.

---

## ⚡ Performance Highlights

### **Handling Large Repositories**
Fetching a file tree for a repo like `facebook/react` can overwhelm the browser if done recursively. **Dir** solves this by:
1.  **Lazy Loading Strategy:** Only fetching what is visible.
2.  **Aggressive Redis Caching:** Caching individual API responses from GitHub.
3.  **Lean Queries:** Using Mongoose `.lean()` for read-heavy operations to avoid the overhead of full Mongoose document hydration.

---

## 📦 Installation & Setup

### **Prerequisites**
-   Node.js (v18+)
-   MongoDB Instance (Local or Atlas)
-   Redis Instance (Local or Cloud)
-   GitHub OAuth App (Client ID & Secret)

### **1. Backend Setup**
```bash
cd backend
# Create .env file
echo "NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/dir_collab
SESSION_SECRET=your_session_secret
MAIN_URL=http://localhost:5173
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
REDIS_URL=redis://localhost:6379
REDIS_DB=0
BASE_URL=http://localhost:5000
JWT_SECRET=supersecret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
CLIENT_URL=http://localhost:5173" > .env

npm install
npm run dev
```

### **2. Frontend Setup**
```bash
cd frontend
# Create .env file (if needed)
echo "VITE_API_URL=http://localhost:5000" > .env

npm install
npm run dev
```

The application will be available at `http://localhost:5173`.
