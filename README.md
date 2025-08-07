# 🎓 Uniform - Integrated System for University Applicants

UniForm is a centralized web application designed to simplify the university admission process in Bangladesh. Built as part of a Web Engineering Lab course, the system enables students to apply to multiple university admission units with a single academic profile. It also empowers universities to manage unit-based admission criteria, ensuring transparency and efficiency in the process.

---

## 🚀 Features

- 🔐 Secure authentication system (JWT-based) for Students and Admins
- 📝 One-time academic form submission reused across applications
- 🏛️ University unit management (A, B, C, D or custom labels)
- 🎯 Stream and GPA-based eligibility validation
- 📦 RESTful API with Express & Prisma ORM
- 🐳 Dockerized backend for scalable deployment
- ⚙️ CI/CD integration with GitHub Actions
- 🌐 Frontend deployable on Vercel

---

## 🧱 Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Frontend       | React + Vite (Vercel)           |
| Backend        | Node.js + Express               |
| ORM/Database   | Prisma + PostgreSQL             |
| Authentication | JSON Web Tokens (JWT)           |
| DevOps         | Docker + GitHub Actions         |
| Hosting        | Vercel (Frontend), Docker (API) |

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/taqiismail10/Uniform.git
cd Uniform/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

This project uses environment variables for configuration. The actual `.env` file is not included in the repository for security reasons.

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Fill in the required values in your new `.env` file.

> **Note:** Refer to `.env.example` for all required variables. If you are unsure about any value, contact the development team.

### 4. Run the development server

```bash
npm run server
```

The server should now be running at `http://localhost:5000` (or the port you set in `.env`).

**UniForm** is a proprietary software product developed by  
**Taqi Ismail**, **Aong Cho Thing Marma**, and **Md. Sadman Sami Khan**.

All rights are reserved. The source code, design, and intellectual property of UniForm are the exclusive property of the authors and may not be copied, modified, distributed, or used in whole or in part without prior written permission.

Unauthorized use, reproduction, or redistribution of this software or any of its components is strictly prohibited and may result in legal action.

If you are interested in using or licensing UniForm for commercial or institutional purposes, please contact the development team at:

> 📧 taqiismail10@gmail.com
> 🌐 https://uniform-bd.com (coming soon)

© 2025 UniForm Platform. All rights reserved.
