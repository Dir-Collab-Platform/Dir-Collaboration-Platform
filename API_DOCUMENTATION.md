# Dir API Documentation

## Overviews

The Dir API is a comprehensive repository and user management system that provides endpoints for authentication, user profile management, and repository operations.

## Base URL

```
http://localhost:5000
```
*(Or your deployed URL)*

## Authentication

The API uses **GitHub OAuth** via Passport.js for authentication.

### Authentication Flow
1. **GitHub Login**: Client redirects user to `/auth/github`.
2. **Callback**: GitHub redirects back to `/auth/github/callback`, setting a session cookie (`dir.sid`).
3. **Session**: Subsequent requests must include the `dir.sid` cookie (automatically handled by browsers).
4. **Logout**: Call `/auth/logout` to destroy the session.

---

## API Endpoints

### 🔐 Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/auth/github** | Initiates GitHub OAuth login flow. Scopes: `user:email`, `read:user`, `repo`, `workflow`, `delete_repo`. | |
| `GET` | **/auth/github/callback** | Callback URL that handles the OAuth response and establishes the session. | |
| `POST` | **/auth/logout** | Destroys the user session and logs out. | |

#### POST `/auth/logout` Response
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

### 👤 User (`/api`)
*Mounted at `/api`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/me** | Get current authenticated user's profile info. | ✅ Yes |
| `PATCH` | **/api/profile** | Update user profile fields. | ✅ Yes |
| `GET` | **/api/stats** | Get user statistics (repo counts, activity). | ✅ Yes |

#### GET `/api/me` Response
```json
{
    "status": "success",
    "data": {
        "_id": "69563538bd45b3713e795fdc",
        "githubUsername": "Abe-Alefew",
        "githubId": "75578348",
        "email": "abrhamalem48829@gmail.com",
        "avatarUrl": "https://avatars.githubusercontent.com/u/75578348?v=4",
        "profileUrl": "https://github.com/Abe-Alefew",
        "role": "user",
        "isActive": true,
        "lastLogin": "2026-01-05T12:57:20.574Z",
        "preferences": {
            "notificationsEnabled": true,
            "emailNotifications": false,
            "theme": "dark"
        },
        "githubRepoCount": 27,
        "reposOwned": [
            {
                "_id": "695ab849e8baa0a99c896eea",
                "githubId": "1002903005",
                "githubRepoName": "MiniGitProject",
                "githubOwner": "Abe-Alefew",
                "workspaceName": "Mini-Git Workspace",
                "githubFullName": "Abe-Alefew/MiniGitProject",
                "description": "A lightweight Git like version control system in C++",
                "ownerId": "69563538bd45b3713e795fdc",
                "url": "https://github.com/Abe-Alefew/MiniGitProject",
                "isPrivate": false,
                "language": "C++",
                "members": [
                    {
                        "userId": "69563538bd45b3713e795fdc",
                        "role": "owner",
                        "_id": "695ab849e8baa0a99c896eeb",
                        "joinedAt": "2026-01-04T18:58:17.446Z"
                    }
                ],
                "channels": [
                    {
                        "channel_id": "695ab849e8baa0a99c896ee9",
                        "name": "general",
                        "_id": "695ab849e8baa0a99c896eec",
                        "created_at": "2026-01-04T18:58:17.448Z",
                        "participants": [
                            "69563538bd45b3713e795fdc"
                        ]
                    },
                    {
                        "channel_id": "695bd3d3143f1801cfdb2b6e",
                        "name": "backend-team",
                        "participants": [],
                        "_id": "695bd3d3143f1801cfdb2b6f",
                        "created_at": "2026-01-05T15:08:03.049Z"
                    },
                    {
                        "channel_id": "695c21fe4ba105e8fd57547c",
                        "name": "UI/ UX team",
                        "participants": [],
                        "_id": "695c21fe4ba105e8fd57547d",
                        "created_at": "2026-01-05T20:41:34.911Z"
                    }
                ],
                "tags": [
                    "DSA"
                ],
                "tasks": [],
                "files": [],
                "webhookEvents": [],
                "createdAt": "2026-01-04T18:58:17.465Z",
                "updatedAt": "2026-01-05T21:44:36.329Z",
                "__v": 0
            },
            {
                "_id": "695ac74c1d13c757f510efc9",
                "githubId": "1075251834",
                "githubRepoName": "Task-Master",
                "githubOwner": "Abe-Alefew",
                "workspaceName": "Task-Master",
                "githubFullName": "Abe-Alefew/Task-Master",
                "description": "this was a simple flask learning project",
                "ownerId": "69563538bd45b3713e795fdc",
                "url": "https://github.com/Abe-Alefew/Task-Master",
                "isPrivate": false,
                "language": "CSS",
                "members": [
                    {
                        "userId": "69563538bd45b3713e795fdc",
                        "role": "owner",
                        "_id": "695ac74c1d13c757f510efca",
                        "joinedAt": "2026-01-04T20:02:20.264Z"
                    }
                ],
                "channels": [
                    {
                        "channel_id": "695ac74c1d13c757f510efc8",
                        "name": "general",
                        "_id": "695ac74c1d13c757f510efcb",
                        "created_at": "2026-01-04T20:02:20.270Z"
                    }
                ],
                "tags": [],
                "tasks": [],
                "files": [],
                "webhookEvents": [],
                "createdAt": "2026-01-04T20:02:20.294Z",
                "updatedAt": "2026-01-04T20:02:20.294Z",
                "__v": 0
            },
            {
                "_id": "695ac96fe48c3a10d52ca463",
                "githubId": "1113146495",
                "githubRepoName": "Calc-Lab",
                "githubOwner": "Abe-Alefew",
                "workspaceName": "Trial",
                "githubFullName": "Abe-Alefew/Calc-Lab",
                "description": "",
                "ownerId": "69563538bd45b3713e795fdc",
                "url": "https://github.com/Abe-Alefew/Calc-Lab",
                "isPrivate": true,
                "language": "CSS",
                "members": [
                    {
                        "userId": "69563538bd45b3713e795fdc",
                        "role": "owner",
                        "_id": "695ac96fe48c3a10d52ca464",
                        "joinedAt": "2026-01-04T20:11:27.508Z"
                    }
                ],
                "channels": [
                    {
                        "channel_id": "695ac96fe48c3a10d52ca462",
                        "name": "general",
                        "_id": "695ac96fe48c3a10d52ca465",
                        "created_at": "2026-01-04T20:11:27.511Z"
                    }
                ],
                "tags": [
                    "test-tag"
                ],
                "tasks": [],
                "files": [],
                "webhookEvents": [],
                "createdAt": "2026-01-04T20:11:27.520Z",
                "updatedAt": "2026-01-04T21:02:59.035Z",
                "__v": 0
            },
            {
                "_id": "695c11cf3307c2f7ec97a6b9",
                "githubId": "1100088991",
                "githubRepoName": "Secure-Auth",
                "githubOwner": "Abe-Alefew",
                "workspaceName": "Secure-Auth",
                "githubFullName": "Abe-Alefew/Secure-Auth",
                "description": "a simple learning project to understand authentication ",
                "ownerId": "69563538bd45b3713e795fdc",
                "url": "https://github.com/Abe-Alefew/Secure-Auth",
                "isPrivate": false,
                "language": "JavaScript",
                "members": [
                    {
                        "userId": "69563538bd45b3713e795fdc",
                        "role": "owner",
                        "_id": "695c11cf3307c2f7ec97a6ba",
                        "joinedAt": "2026-01-05T19:32:31.809Z"
                    }
                ],
                "channels": [
                    {
                        "channel_id": "695c11cf3307c2f7ec97a6b8",
                        "name": "general",
                        "participants": [],
                        "_id": "695c11cf3307c2f7ec97a6bb",
                        "created_at": "2026-01-05T19:32:31.812Z"
                    }
                ],
                "tags": [],
                "webhookSettings": {
                    "webhookId": "590015838",
                    "secret": "bdef273e2d0df8a255a87b5f21d22a29d5ffbbc0"
                },
                "tasks": [],
                "files": [],
                "createdAt": "2026-01-05T19:32:31.828Z",
                "updatedAt": "2026-01-05T19:32:31.828Z",
                "__v": 0
            }
        ],
        "notifications": [
            "69563538bd45b3713e795fdd"
        ],
        "createdAt": "2026-01-01T08:50:00.756Z",
        "updatedAt": "2026-01-05T19:32:32.237Z"
    }
}
```

#### PATCH `/api/profile` Response
```json
{
    "status": "success",
    "message": "Profile updated successfully"
}
```

#### GET `/api/stats` Response
```json
{
    "status": "success",
    "data": {
        "activeWorkspacesCount": 4,
        "unreadNotifications": 6,
        "githubTotalCount": 27,
        "totalTasks": 0,
        "role": "user"
    }
}
```

---

### 📂 Repositories (`/api/repos`)
*Mounted at `/api/repos`*

#### Discovery & Operations
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/repos/discovery** | List authenticated user's GitHub repositories available for import. | ✅ Yes |
| `POST` | **/api/repos/import** | Import a repository into the workspace. | ✅ Yes |
| `POST` | **/api/repos/create-workspace** | Create a new workspace from an existing GitHub repo. | ✅ Yes |
| `POST` | **/api/repos/create-remote** | Create a new GitHub repo and auto-import it. | ✅ Yes |
| `GET` | **/api/repos/contents** | List files/folders in a repo or workspace. | ✅ Yes |

#### GET `/api/repos/discovery` Response
```json
{
    "status": "success",
    "totalInGithub": 27,
    "data": [
        {
            "githubId": "1100088991",
            "githubRepoName": "Secure-Auth",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/Secure-Auth",
            "description": "a simple learning project to understand authentication ",
            "url": "https://github.com/Abe-Alefew/Secure-Auth",
            "language": "JavaScript",
            "workspaceName": "Secure-Auth",
            "isImported": true
        },
        {
            "githubId": "1113146495",
            "githubRepoName": "Calc-Lab",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/Calc-Lab",
            "description": null,
            "url": "https://github.com/Abe-Alefew/Calc-Lab",
            "language": "CSS",
            "workspaceName": "Calc-Lab",
            "isImported": true
        },
        {
            "githubId": "1002903005",
            "githubRepoName": "MiniGitProject",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/MiniGitProject",
            "description": "A lightweight Git like version control system in C++",
            "url": "https://github.com/Abe-Alefew/MiniGitProject",
            "language": "C++",
            "workspaceName": "MiniGitProject",
            "isImported": true
        },
        {
            "githubId": "1119156195",
            "githubRepoName": "Dir-Backend",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/Dir-Backend",
            "description": null,
            "url": "https://github.com/Abe-Alefew/Dir-Backend",
            "language": "JavaScript",
            "workspaceName": "Dir-Backend",
            "isImported": false
        },
        {
            "githubId": "1075251834",
            "githubRepoName": "Task-Master",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/Task-Master",
            "description": "this was a simple flask learning project",
            "url": "https://github.com/Abe-Alefew/Task-Master",
            "language": "CSS",
            "workspaceName": "Task-Master",
            "isImported": true
        },
        {
            "githubId": "1126049037",
            "githubRepoName": "Dir-Collab",
            "githubOwner": "Dir-Collab-Platform",
            "githubFullName": "Dir-Collab-Platform/Dir-Collab",
            "description": null,
            "url": "https://github.com/Dir-Collab-Platform/Dir-Collab",
            "language": null,
            "workspaceName": "Dir-Collab",
            "isImported": false
        },
        {
            "githubId": "948429771",
            "githubRepoName": "LeetcodeProbs",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/LeetcodeProbs",
            "description": null,
            "url": "https://github.com/Abe-Alefew/LeetcodeProbs",
            "language": "C++",
            "workspaceName": "LeetcodeProbs",
            "isImported": false
        },
        {
            "githubId": "1114323022",
            "githubRepoName": "GitSphere",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/GitSphere",
            "description": "A full-stack GitHub Analytics Dashboard that fetches, stores, and visualizes repository activity—commits, pull requests, and contributions—using Node.js, Express, MongoDB, Redis, and React, with seamless GitHub OAuth authentication via Better Auth.",
            "url": "https://github.com/Abe-Alefew/GitSphere",
            "language": "CSS",
            "workspaceName": "GitSphere",
            "isImported": false
        },
        {
            "githubId": "1105205645",
            "githubRepoName": "Gebeta-Review",
            "githubOwner": "Kirubel567",
            "githubFullName": "Kirubel567/Gebeta-Review",
            "description": "A student-focused web application for discovering, reviewing, and comparing restaurants, food, and delivery options around campus.",
            "url": "https://github.com/Kirubel567/Gebeta-Review",
            "language": "HTML",
            "workspaceName": "Gebeta-Review",
            "isImported": false
        },
        {
            "githubId": "1090152613",
            "githubRepoName": "Dir-OAuth-GitHub",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/Dir-OAuth-GitHub",
            "description": "for learning purpose of GitHub REST API and OAuth Implementation",
            "url": "https://github.com/Abe-Alefew/Dir-OAuth-GitHub",
            "language": "JavaScript",
            "workspaceName": "Dir-OAuth-GitHub",
            "isImported": false
        },
        {
            "githubId": "1064517814",
            "githubRepoName": "e-commerce-project",
            "githubOwner": "MitK12",
            "githubFullName": "MitK12/e-commerce-project",
            "description": null,
            "url": "https://github.com/MitK12/e-commerce-project",
            "language": "JavaScript",
            "workspaceName": "e-commerce-project",
            "isImported": false
        },
        {
            "githubId": "1085287398",
            "githubRepoName": "Email-Spam-Detection",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/Email-Spam-Detection",
            "description": "iCog Training Task #1: an implementation of Perceptron and SVM models from scratch",
            "url": "https://github.com/Abe-Alefew/Email-Spam-Detection",
            "language": "Python",
            "workspaceName": "Email-Spam-Detection",
            "isImported": false
        },
        {
            "githubId": "1077526828",
            "githubRepoName": "hypothesis-generation_demo",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/hypothesis-generation_demo",
            "description": null,
            "url": "https://github.com/Abe-Alefew/hypothesis-generation_demo",
            "language": null,
            "workspaceName": "hypothesis-generation_demo",
            "isImported": false
        },
        {
            "githubId": "1064137197",
            "githubRepoName": "Expendia",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/Expendia",
            "description": "an expense tracker web app bulit by using react. It's a practice project to understand the concepts of hooks and state mangement",
            "url": "https://github.com/Abe-Alefew/Expendia",
            "language": "JavaScript",
            "workspaceName": "Expendia",
            "isImported": false
        },
        {
            "githubId": "1064813079",
            "githubRepoName": "ECommerce",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/ECommerce",
            "description": null,
            "url": "https://github.com/Abe-Alefew/ECommerce",
            "language": "TypeScript",
            "workspaceName": "ECommerce",
            "isImported": false
        },
        {
            "githubId": "1058108358",
            "githubRepoName": "Todo-react",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/Todo-react",
            "description": "a react web app for applying the concepts of react hooks and state management",
            "url": "https://github.com/Abe-Alefew/Todo-react",
            "language": "TypeScript",
            "workspaceName": "Todo-react",
            "isImported": false
        },
        {
            "githubId": "1040691530",
            "githubRepoName": "MyPortfolio",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/MyPortfolio",
            "description": null,
            "url": "https://github.com/Abe-Alefew/MyPortfolio",
            "language": "HTML",
            "workspaceName": "MyPortfolio",
            "isImported": false
        },
        {
            "githubId": "1018023651",
            "githubRepoName": "WebDevJourney",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/WebDevJourney",
            "description": null,
            "url": "https://github.com/Abe-Alefew/WebDevJourney",
            "language": "HTML",
            "workspaceName": "WebDevJourney",
            "isImported": false
        },
        {
            "githubId": "1014660301",
            "githubRepoName": "qgss-2025",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/qgss-2025",
            "description": "Qiskit Global Summer School: The Past, Present and Future of Quantum Computing",
            "url": "https://github.com/Abe-Alefew/qgss-2025",
            "language": null,
            "workspaceName": "qgss-2025",
            "isImported": false
        },
        {
            "githubId": "953033766",
            "githubRepoName": "DSALabSubmission",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/DSALabSubmission",
            "description": "Abraham Alemtesfa UGR/9689/16 Section 2",
            "url": "https://github.com/Abe-Alefew/DSALabSubmission",
            "language": "C++",
            "workspaceName": "DSALabSubmission",
            "isImported": false
        },
        {
            "githubId": "948931720",
            "githubRepoName": "SSLM",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/SSLM",
            "description": " EduNexus-AAiT (A connected academic ecosystem for students)",
            "url": "https://github.com/Abe-Alefew/SSLM",
            "language": "Java",
            "workspaceName": "SSLM",
            "isImported": false
        },
        {
            "githubId": "967591227",
            "githubRepoName": "databaseLab",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/databaseLab",
            "description": null,
            "url": "https://github.com/Abe-Alefew/databaseLab",
            "language": null,
            "workspaceName": "databaseLab",
            "isImported": false
        },
        {
            "githubId": "940804792",
            "githubRepoName": "Java-Learning-Path",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/Java-Learning-Path",
            "description": "It's just a journey of my java development.",
            "url": "https://github.com/Abe-Alefew/Java-Learning-Path",
            "language": "Java",
            "workspaceName": "Java-Learning-Path",
            "isImported": false
        },
        {
            "githubId": "948671538",
            "githubRepoName": "DSALab",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/DSALab",
            "description": "these are exercises and solutions for my Data Structures & Algorithms (DSA) C++ class and lab sessions. Just hands-on practices for lab assignments, problem-solving, and algorithm analysis.",
            "url": "https://github.com/Abe-Alefew/DSALab",
            "language": "C++",
            "workspaceName": "DSALab",
            "isImported": false
        },
        {
            "githubId": "944236581",
            "githubRepoName": "BloodNet",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/BloodNet",
            "description": "GDG hackathon 2025 willow project",
            "url": "https://github.com/Abe-Alefew/BloodNet",
            "language": null,
            "workspaceName": "BloodNet",
            "isImported": false
        },
        {
            "githubId": "948483145",
            "githubRepoName": "Cplusplustrials",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/Cplusplustrials",
            "description": "this is just my learning site of C++ and its data structures.",
            "url": "https://github.com/Abe-Alefew/Cplusplustrials",
            "language": "C++",
            "workspaceName": "Cplusplustrials",
            "isImported": false
        },
        {
            "githubId": "942556571",
            "githubRepoName": "LeetCodeDSA",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/LeetCodeDSA",
            "description": "A learning path for DSA with my solutions for leetcode problems.",
            "url": "https://github.com/Abe-Alefew/LeetCodeDSA",
            "language": null,
            "workspaceName": "LeetCodeDSA",
            "isImported": false
        },
        {
            "githubId": "943539111",
            "githubRepoName": "MyFirstFigmaDesign",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/MyFirstFigmaDesign",
            "description": null,
            "url": "https://github.com/Abe-Alefew/MyFirstFigmaDesign",
            "language": null,
            "workspaceName": "MyFirstFigmaDesign",
            "isImported": false
        },
        {
            "githubId": "943220765",
            "githubRepoName": "SlotMachineJS",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/SlotMachineJS",
            "description": "a refresher project for java-script ",
            "url": "https://github.com/Abe-Alefew/SlotMachineJS",
            "language": "JavaScript",
            "workspaceName": "SlotMachineJS",
            "isImported": false
        },
        {
            "githubId": "940052186",
            "githubRepoName": "LexiLink",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/LexiLink",
            "description": "The aim of this mini-project is to to analyze the text and phonemic similarities between the Afan Oromo and Somali languages by examining word frequency, overlap, and phonemic distribution.",
            "url": "https://github.com/Abe-Alefew/LexiLink",
            "language": "Python",
            "workspaceName": "LexiLink",
            "isImported": false
        }
    ]
}
```

#### POST `/api/repos/import` Request Body
```json
{
            "githubId": "1090152613",
            "githubRepoName": "Dir-OAuth-GitHub",
            "githubOwner": "Abe-Alefew",
            "githubFullName": "Abe-Alefew/Dir-OAuth-GitHub",
            "description": "for learning purpose of GitHub REST API and OAuth Implementation",
            "url": "https://github.com/Abe-Alefew/Dir-OAuth-GitHub",
            "language": "JavaScript",
            "workspaceName": "Dir-OAuth-GitHub",
            "isImported": false
}
```

#### POST `/api/repos/import` Response
```json
{
    "status": "success",
    "data": {
        "githubId": "1090152613",
        "githubRepoName": "Dir-OAuth-GitHub",
        "githubOwner": "Abe-Alefew",
        "workspaceName": "Dir-OAuth-GitHub",
        "githubFullName": "Abe-Alefew/Dir-OAuth-GitHub",
        "description": "for learning purpose of GitHub REST API and OAuth Implementation",
        "ownerId": "69563538bd45b3713e795fdc",
        "url": "https://github.com/Abe-Alefew/Dir-OAuth-GitHub",
        "isPrivate": false,
        "language": "JavaScript",
        "members": [
            {
                "userId": "69563538bd45b3713e795fdc",
                "role": "owner",
                "_id": "695c41b61eaeec6264dfd23f",
                "joinedAt": "2026-01-05T22:56:54.134Z"
            }
        ],
        "channels": [
            {
                "channel_id": "695c41b61eaeec6264dfd23d",
                "name": "general",
                "participants": [],
                "_id": "695c41b61eaeec6264dfd240",
                "created_at": "2026-01-05T22:56:54.137Z"
            }
        ],
        "tags": [],
        "webhookSettings": {
            "webhookId": "590040861",
            "secret": "ec8e2796f3c8df0d0836f4ff9b0befc550aa6236"
        },
        "_id": "695c41b61eaeec6264dfd23e",
        "tasks": [],
        "files": [],
        "createdAt": "2026-01-05T22:56:54.156Z",
        "updatedAt": "2026-01-05T22:56:54.156Z",
        "__v": 0
    }
}
```

#### POST `/api/repos/create-workspace` Request Body
```json
{
  "githubRepoName": "existing-repo",
  "workspaceName": "My New Workspace",
  "description": "Optional description"
}
```

#### POST `/api/repos/create-remote` Request Body
```json
{
  "name": "new-repo-name",
  "description": "My new project",
  "isPrivate": "private", // "private" or "public"
  "auto_init": "Yes",
  "gitignore_template": "Node"
}
```
#### POST `/api/repos/create-remote` Response Body
```json
{
    "status": "success",
    "message": "Repository created successfully",
    "data": {
        "githubId": "1128621934",
        "githubRepoName": "repo-from-dir",
        "githubOwner": "Abe-Alefew",
        "workspaceName": "repo-from-dir",
        "githubFullName": "Abe-Alefew/repo-from-dir",
        "description": "I created this repo from dir to github",
        "ownerId": "69563538bd45b3713e795fdc",
        "url": "https://github.com/Abe-Alefew/repo-from-dir",
        "isPrivate": false,
        "language": null,
        "members": [
            {
                "userId": "69563538bd45b3713e795fdc",
                "role": "owner",
                "_id": "695c44f31eaeec6264dfd262",
                "joinedAt": "2026-01-05T23:10:43.318Z"
            }
        ],
        "channels": [
            {
                "channel_id": "695c44f31eaeec6264dfd260",
                "name": "general",
                "participants": [],
                "_id": "695c44f31eaeec6264dfd263",
                "created_at": "2026-01-05T23:10:43.318Z"
            }
        ],
        "tags": [],
        "webhookSettings": {
            "webhookId": "590042448",
            "secret": "fcd670e100af6030b712ef1bae1a001932f7f49c"
        },
        "_id": "695c44f31eaeec6264dfd261",
        "tasks": [],
        "files": [],
        "createdAt": "2026-01-05T23:10:43.320Z",
        "updatedAt": "2026-01-05T23:10:43.320Z",
        "__v": 0
    }
}
```


#### GET `/api/repos/contents`
Query Parameters:
- `workspaceId`: (Optional) ID of the Dir workspace.
- `owner` & `repo`: (Optional) If workspaceId is not provided, specify GitHub owner and repo name.
- `path`: (Optional) Directory path to list (defaults to root).

Response (Directory):
```json
{
  "status": "success",
  "type": "dir",
  "files": [
    {
      "name": "src",
      "path": "src",
      "type": "dir",
      "sha": "...",
      "url": "..."
    },
    {
      "name": "README.md",
      "path": "README.md",
      "type": "file",
      "sha": "..."
    }
  ]
}
```

#### Management (CRUD)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/repos/** | Get all active workspaces/repositories for the user. | ✅ Yes |
| `GET` | **/api/repos/:id** | Get details of a specific repository. | ✅ Yes |
| `PATCH` | **/api/repos/:id** | Update repository details (workspaceName, description). | ✅ Yes |
| `DELETE` | **/api/repos/:id** | Delete a repository from Dir (not GitHub). | ✅ Yes |

#### GET `/api/repos/` Response
```json
{
  "status": "success",
  "results": 1,
  "data": [
    {
      "_id": "60d5fa...",
      "githubId": "12345678",
      "githubRepoName": "awesome-project",
      "workspaceName": "Project Alpha",
      "description": "My awesome project",
      "ownerId": "60d5f9...",
      "members": [ ... ],
      "channels": [...],
      "tags": [],
      "tasks": [],
      "files": [],
      "createdAt": "2026-01-04T20:02:20.294Z",
      "updatedAt": "2026-01-04T20:02:20.294Z",
      "__v": 0
    }
  ]
}
```

#### GET `/api/repos/:id` Response
```json
{
  "status": "success",
  "data": {
            "_id": "695ab849e8baa0a99c896eea",
            "githubId": "1002903005",
            "githubRepoName": "MiniGitProject",
            "githubOwner": "Abe-Alefew",
            "workspaceName": "Mini-Git Workspace",
            "githubFullName": "Abe-Alefew/MiniGitProject",
            "description": "A lightweight Git like version control system in C++",
            "ownerId": "69563538bd45b3713e795fdc",
            "url": "https://github.com/Abe-Alefew/MiniGitProject",
            "isPrivate": false,
            "language": "C++",
            "members": [ ... ],
            "channels": [
                {
                    "channel_id": "695ab849e8baa0a99c896ee9",
                    "name": "general",
                    "_id": "695ab849e8baa0a99c896eec",
                    "created_at": "2026-01-04T18:58:17.448Z",
                    "participants": [
                        "69563538bd45b3713e795fdc"
                    ]
                },
                {
                    "channel_id": "695bd3d3143f1801cfdb2b6e",
                    "name": "backend-team",
                    "participants": [],
                    "_id": "695bd3d3143f1801cfdb2b6f",
                    "created_at": "2026-01-05T15:08:03.049Z"
                },
                {
                    "channel_id": "695c21fe4ba105e8fd57547c",
                    "name": "UI/ UX team",
                    "participants": [],
                    "_id": "695c21fe4ba105e8fd57547d",
                    "created_at": "2026-01-05T20:41:34.911Z"
                }
            ],
            "tags": [
                "DSA"
            ],
            "tasks": [],
            "files": [],
            "createdAt": "2026-01-04T18:58:17.465Z",
            "updatedAt": "2026-01-05T21:44:36.329Z",
            "__v": 0
        }
}
```

#### PATCH `/api/repos/:id` Response
```json
{
  "status": "success",
  "message": "Updated locally and on GitHub",
  "data": {
    "_id": "60d5fa...",
    "workspaceName": "New Name",
    "description": "Updated description"
  }
}
```

#### DELETE `/api/repos/:id` Response
```json
{
  "status": "success",
  "message": "Removed from DIR"
}
```


#### Sync & Tags
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | **/api/repos/:id/sync** | Manually sync repository with GitHub. | ✅ Yes |
| `POST` | **/api/repos/:id/tags** | Add tags to a repository. | ✅ Yes |
| `GET` | **/api/repos/topics** | Get popular topics/tags. | ✅ Yes |
| `POST` | **/api/repos/topics** | Create a new tag. | ✅ Yes |
| `DELETE` | **/api/repos/topics/:id** | Delete a tag. | ✅ Yes |

#### POST `/api/repos/:id/sync` Response
```json
{
  "status": "success",
  "message": "Synced with GitHub"
}
```

#### POST `/api/repos/:id/tags` Request Body
```json
{
  "tag": "favorites"
}
```

#### POST `/api/repos/:id/tags` Response
```json
{
  "status": "success",
  "data": {
    "_id": "60d5fa...",
    "workspaceName": "Project Alpha",
    
    "tags": ["favorites", "react"],
    
  },
  "newTagCreated": true
}
```

#### Activity
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/repos/:id/activity** | Get activity logs for a specific repository. | ✅ Yes |

#### GET `/api/repos/:id/activity` Response
```json
{
  "status": "success",
  "data": [
    {
      "id": "65e...",
      "user": "octocat",
      "action": "synchronized",
      "targetName": "awesome-project",
      "targetType": "repository",
      "message": "Updated metadata and languages from GitHub",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "iconType": "repository"
    }
  ]
}
```

#### Explore & Topics
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/repos/explore** | Explore public repos by tag. Query params: `page`, `q`, `tag`. | ✅ Yes |
| `GET` | **/api/repos/topics** | Get popular/curated topics. | ✅ Yes |
| `POST` | **/api/repos/topics** | Create a custom tag. | ✅ Yes |
| `DELETE` | **/api/repos/topics/:id** | Delete a custom tag. | ✅ Yes |

#### GET `/api/repos/explore` Response
```json
{
  "status": "success",
  "data": {
    "total": 100,
    "repos": [
      {
        "githubId": "12345678",
        "name": "react",
        "owner": "facebook",
        "avatar": "https://avatars.githubusercontent.com/u/...",
        "description": "A declarative component-based library",
        "stars": 200000,
        "tags": ["javascript", "library"],
        "languages": [{ "label": "JavaScript", "value": 100, "color": "#f1e05a" }],
        "isImported": false
      }
    ],
    "hasNextPage": true
  }
}
```

#### GET `/api/repos/topics` Response
```json
{
  "status": "success",
  "data": [
    {
      "name": "javascript",
      "label": "JavaScript",
      "color": "#f1e05a"
    },
    {
      "name": "web-development",
      "label": "Web Development",
      "color": "#4b5563"
    }
  ]
}
```

#### POST `/api/repos/topics` Response
```json
{
  "status": "success",
  "data": {
    "_id": "60d5f9...",
    "name": "my-tag",
    "description": "Custom tag",
    "color": "#4f46e5",
    "createdBy": "60d5f9..."
  }
}
```

#### DELETE `/api/repos/topics/:id` Response
```json
{
  "status": "success",
  "message": "my-tag tag removed successfully and cache cleared"
}
```

#### File Operations
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | **/api/repos/:id/contents** | Create a new file in the repository. | ✅ Yes |
| `PUT` | **/api/repos/:id/contents** | Update file content and commit to GitHub. | ✅ Yes |
| `DELETE` | **/api/repos/:id/contents** | Delete a file from the repository. | ✅ Yes |
| `GET` | **/api/repos/languages** | Get languages/repo stats. Query: `workspaceId` OR (`owner` & `repo`). | ✅ Yes |

#### POST `/api/repos/:id/contents` Request Body (Create File)
```json
{
  "path": "src/newfile.js",
  "content": "console.log('Hello World');",
  "commitMessage": "Added new file"
}
```

#### PUT `/api/repos/:id/contents` Request Body (Update File)
```json
{
  "path": "src/existing.js",
  "content": "console.log('Updated');",
  "sha": "existing_file_sha",
  "commitMessage": "Updated file content"
}
```

#### DELETE `/api/repos/:id/contents` Request Body
```json
{
  "path": "src/todelete.js",
  "sha": "file_sha",
  "commitMessage": "Deleted file"
}
```

#### GET `/api/repos/languages` Response
```json
{
  "status": "success",
  "data": [
    {
      "label": "JavaScript",
      "value": 65.5,
      "color": "#f1e05a"
    },
    {
      "label": "HTML",
      "value": 34.5,
      "color": "#e34c26"
    }
  ]
}
```

#### POST `/api/repos/:id/contents` Response
```json
{
  "status": "success",
  "message": "File successfully created",
  "data": {
    "sha": "new_sha_123",
    "url": "https://github.com/octocat/repo/blob/..."
  }
}
```

#### PUT `/api/repos/:id/contents` Response
```json
{
  "status": "success",
  "message": "File successfully committed to Github",
  "data": {
    "sha": "updated_sha_456",
    "commit": "https://github.com/octocat/repo/commit/..."
  }
}
```

#### DELETE `/api/repos/:id/contents` Response
```json
{
  "status": "success",
  "message": "File successfully deleted from Github",
  "data": {
    "commit": "https://github.com/octocat/repo/commit/..."
  }
}
```

---


---

### 📊 Activity (`/api/activity`)
*Mounted at `/api/activity`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/activity/feed** | Get global activity feed for the user (across all repos). | ✅ Yes |
| `GET` | **/api/activity/heatmap** | Get contribution heatmap data (daily counts). | ✅ Yes |
| `DELETE` | **/api/activity/logs** | Clear all activity history for the user. | ✅ Yes |

#### GET `/api/activity/feed` Response
```json
{
  "status": "success",
  "data": [
    {
      "id": "65e...",
      "user": "octocat",
      "action": "imported repository",
      "targetName": "awesome-project",
      "targetType": "repository",
      "message": "Initialized workspace for awesome-project",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "iconType": "repository"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "hasNextPage": false,
    "totalPages": 1
  }
}
```

#### GET `/api/activity/heatmap` Response
```json
{
  "status": "success",
  "data": [
    {
      "_id": "2023-12-31",
      "count": 5
    },
    {
      "_id": "2024-01-01",
      "count": 12
    }
  ]
}
```

---

### 💬 Channels (`/api/repos/:repoId/channels`)
*Mounted at `/api/repos/:repoId/channels`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/repos/:repoId/channels** | List all channels in a workspace. | ✅ Yes |
| `POST` | **/api/repos/:repoId/channels** | Create a new channel. | ✅ Yes |
| `PATCH` | **/api/repos/:repoId/channels/:id** | Rename a channel. | ✅ Yes |
| `DELETE` | **/api/repos/:repoId/channels/:id** | Delete a channel and its messages. | ✅ Yes |
| `POST` | **/api/repos/:repoId/channels/:id/join** | Join a channel (subscribes to socket room). | ✅ Yes |
| `POST` | **/api/repos/:repoId/channels/:id/leave** | Leave a channel. | ✅ Yes |

#### GET `/api/repos/:repoId/channels` Response
```json
{
  "status": "success",
  "data": [
    {
       "channel_id": "65e...",
       "name": "general",
       "participants": ["..."]
    }
  ]
}
```

#### POST `/api/repos/:repoId/channels` Request
```json
{
  "name": "random"
}
```

#### POST `/api/repos/:repoId/channels` Response
```json
{
  "status": "success",
  "data": {
    "channel_id": "65e123...",
    "name": "random",
    "participants": []
  }
}
```

#### PATCH `/api/repos/:repoId/channels/:id` Response
```json
{
  "status": "success",
  "data": {
    "channel_id": "65e...",
    "name": "new-name"
  }
}
```

#### DELETE `/api/repos/:repoId/channels/:id` Response
```json
{
  "status": "success",
  "message": "Channel random and messages in random deleted"
}
```

#### POST `/api/repos/:repoId/channels/:id/join` Response
```json
{
    "status": "success",
    "message": "Successfully joined random (and general)"
}
```

---

### 📨 Messages (`/api/repos/:repoId/channels/:channelId/messages`)
*Mounted at `/api/repos/:repoId/channels/:channelId/messages`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **.../messages** | Get paginated messages for a channel. | ✅ Yes |
| `POST` | **.../messages** | Send a new message (supports mentions `@user`). | ✅ Yes |
| `DELETE` | **.../messages/:id** | Delete a message (Sender or Admin only). | ✅ Yes |
| `PUT` | **.../messages/:id/reactions** | Add or toggle a reaction on a message. | ✅ Yes |

#### GET `.../messages` Response
```json
{
  "status": "success",
  "results": 50,
  "data": [
    {
      "_id": "MSG_ID",
      "content": "Hello world",
      "senderId": { "username": "octocat", "avatarUrl": "..." },
      "reactions": [],
      "createdAt": "..."
    }
  ]
}
```

#### POST `.../messages` Request
```json
{
  "content": "Hello @octocat!",
  "attachments": [] 
}
```

#### POST `.../messages` Response
```json
{
  "status": "success",
  "data": {
    "_id": "MSG_ID",
    "content": "Hello @octocat!",
    "senderId": "USER_ID",
    "channelId": "CHANNEL_ID"
  }
}
```

#### PUT `.../messages/:id/reactions` Request
```json
{
  "emoji": "👍",
  "repoId": "65e..." 
}
```

#### PUT `.../messages/:id/reactions` Response
```json
{
  "status": "success",
  "data": {
    "_id": "MSG_ID",
    "reactions": [ { "emoji": "👍", "users": ["USER_ID"] } ]
  }
}
```

---

### 👥 Memberships (`/api/repos/:repoId/members`)
*Mounted at `/api/repos/:repoId/members`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/repos/:repoId/members** | List all members of a workspace. | ✅ Yes |
| `POST` | **/api/repos/:repoId/members** | Invite a GitHub user to the workspace. | ✅ Core+ |
| `PATCH` | **/api/repos/:repoId/members/:userId** | Update a member's role. | ✅ Core+ |
| `DELETE` | **/api/repos/:repoId/members/:userId** | Remove a member from the workspace. | ✅ Core+ |

#### GET `/api/repos/:repoId/members` Response
```json
{
  "status": "success",
  "data": [
    { "userId": { "githubUsername": "octocat" }, "role": "owner" }
  ]
}
```

#### POST `/api/repos/:repoId/members` Request
```json
{
  "githubUsername": "octocat",
  "role": "viewer"
}
```

#### POST `/api/repos/:repoId/members` Response
```json
{
  "status": "success",
  "message": "User octocat has been invited successfully",
  "data": [ ...updated member list... ]
}
```

#### PATCH `/api/repos/:repoId/members/:userId` Response
```json
{
  "status": "success",
  "data": [ ...updated member list... ]
}
```

#### DELETE `/api/repos/:repoId/members/:userId` Response
```json
{
  "status": "success",
  "message": "Member removed",
  "data": [ ...updated member list... ]
}
```

---

### 🔔 Notifications (`/api/notifications`)
*Mounted at `/api/notifications`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/notifications** | Get authenticated user's notifications. | ✅ Yes |
| `PUT` | **/api/notifications/preferences** | Update notification preferences. | ✅ Yes |
| `PATCH` | **/api/notifications/:id/read** | Mark a notification as read. | ✅ Yes |
| `DELETE` | **/api/notifications/:id** | Delete a notification. | ✅ Yes |

#### GET `/api/notifications` Response
```json
{
  "status": "success",
  "data": [
    {
      "_id": "NOTIF_ID",
      "message": "You were added to specific-channel",
      "isRead": false,
      "type": "message",
      "createdAt": "..."
    }
  ]
}
```

#### PUT `/api/notifications/preferences` Request
```json
{
  "notificationsEnabled": true,
  "emailNotifications": false,
  "theme": "dark"
}
```

#### PUT `/api/notifications/preferences` Response
```json
{
  "status": "success",
  "data": {
    "notificationsEnabled": true,
    "emailNotifications": false,
    "theme": "dark"
  }
}
```

---

### 🪝 Webhooks
*Endpoint exposed for GitHub events*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | **/api/webhooks/github** | Receives and processes GitHub events. |

#### POST `/api/webhooks/github` Response
```text
Webhook processed successfully.
```

---

