# **Dir Collaboration Platform**

*Dir Collaboration Platform is a high-performance, real-time developer workspace designed for seamless team collaboration. Built with a modern stack of React, Express, and Socket.io, the platform allows teams to import GitHub repositories into interactive environments featuring instant file navigation and deep repository analytics. By categorizing projects into intuitive topics and integrating real-time GitHub Actions updates, the platform enables users to track project changes, development workflows, and team discussions in a single unified interface. With built-in multi-channel chat and an optimized loading architecture, it ensures developers stay updated on every commit, action, and conversation without the lag of traditional project management tools.*

🔗 **Live** [http://localhost:5173](http://localhost:5173) (Local Development)
<br/>
📧 **Contact:** [dir.collab.platform@gmail.com](mailto:dir.collab.platform@gmail.com)

---

## 📌 **Overview**

Dir bridges the gap between static repositories and dynamic team interaction through:

### 💻 Developers

* **Import Repositories:** Instantly import public or private GitHub repos into a workspace.
* **Real-Time Chat:** Context-aware messaging scoped to specific channels and workspaces.
* **File Navigation:** Cache-first file tree exploration for instant access to code.
* **GitHub Actions:** Track live build statuses and workflow runs directly in the dashboard.

### 🚀 Teams

* **Workspaces:** Dedicated environments for projects with persistent chat history.
* **Collaboration:** See typing indicators, live reactions, and member presence.
* **Sync:** Manual and automatic synchronization with GitHub metadata.

### 📊 Project Leads

* **Analytics:** View repository statistics, star counts, and contribution heatmaps.
* **Management:** Organize workspaces with custom tags and topics.
* **Activity Feeds:** Monitor global and repository-specific activity logs.

---

## 🏗 **Project Architecture**

The system operates on a loosely coupled Client-Server architecture optimized for high concurrency:

```
Dir-Collaboration-Platform/
│
├── frontend/      # React 19 + Vite SPA
├── backend/       # Node.js + Express 5 API Gateway
├── Screenshots/   # Some screenshots of Dir platform

```

🟦 **Frontend:** React 19 (Vite, TailwindCSS 4, Socket.io-client) <br/>
🟩 **Backend:** Node.js (Express 5, Passport.js, Socket.io) <br/>
🗄 **Database:** MongoDB (Persistence) & Redis (Caching) <br/>
🔌 **Real-Time:** Socket.io (Event broadcasting) <br/>
🐙 **Integration:** GitHub REST API

---

## 🔧 **Tech Stack**

| Layer           | Technologies                   |
| --------------- | ------------------------------ |
| Frontend        | React 19, Vite, TailwindCSS 4  |
| Backend         | Node.js, Express 5             |
| Database        | MongoDB (Mongoose)             |
| Caching         | Redis                          |
| Real-Time       | Socket.io                      |
| Auth            | Passport.js (GitHub OAuth)     |
| Routing         | React Router v7                |

---

## 👥 **Authentication & Access**

The platform uses **GitHub OAuth** for authentication. There are no hardcoded test accounts; access is granted via your GitHub account.

### 🔹 User

* **Login:** Authenticate via GitHub.
* **Permissions:** Read/Write access depends on your GitHub repository permissions.
* **Session:** Managed via secure HTTP-only cookies (`dir.sid`).

---

## 🐙 **GitHub Integration**

The application relies heavily on the GitHub API.

⚠️ **Important for Setup:**

* You must create a **GitHub OAuth App** in your developer settings.
* The **Client ID** and **Client Secret** are required in the backend `.env` file.
* **Webhooks** are registered automatically for real-time repo updates.

---

# 🚀 **Getting Started**

## 1️⃣ Clone the Repository

```sh
git clone https://github.com/Dir-Collab-Platform/Dir-Collab
cd Dir-Collaboration-Platform
```

---

## 2️⃣ Install Dependencies

### Backend

```sh
cd backend
npm install
```

### Frontend

```sh
cd ../frontend
npm install
```

---

# 🔐 **Environment Variables**

### Backend (`/backend/.env`)

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/dir_collab
SESSION_SECRET=your_super_secret_session_key
MAIN_URL=http://localhost:5173
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
REDIS_URL=redis://localhost:6379
REDIS_DB=0
BASE_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
CLIENT_URL=http://localhost:5173
```

### Frontend (`/frontend/.env`)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK=false  # Set to true to use mock data without backend
```

---

# ▶️ **Run Locally**

### Start Backend

Ensure MongoDB and Redis are running, then:

```sh
cd backend
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
