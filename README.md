# 🎓 Uniform - Integrated System for University Applicants

UniForm is a centralized web application designed to simplify the university admission process in Bangladesh. Built as part of a Web Engineering Lab course, the system enables students to apply to multiple university admission units with a single academic profile. It also empowers universities to manage unit-based admission criteria, ensuring transparency and efficiency in the process.

---

## 🚀 Features

-   🔐 Secure authentication system (JWT-based) for Students and Admins
-   📝 One-time academic form submission reused across applications
-   🏛️ University unit management (A, B, C, D or custom labels)
-   🎯 Stream and GPA-based eligibility validation
-   📦 RESTful API with Express & Prisma ORM
-   🐳 Dockerized backend for scalable deployment
-   ⚙️ CI/CD integration with GitHub Actions
-   🌐 Frontend deployable on Vercel

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

---

## License

**UniForm** is a proprietary software product developed by  
**Taqi Ismail**, **Aong Cho Thing Marma**, and **Md. Sadman Sami Khan**.

All rights are reserved. The source code, design, and intellectual property of UniForm are the exclusive property of the authors and may not be copied, modified, distributed, or used in whole or in part without prior written permission.

Unauthorized use, reproduction, or redistribution of this software or any of its components is strictly prohibited and may result in legal action.

If you are interested in using or licensing UniForm for commercial or institutional purposes, please contact the development team at:

> 📧 taqiismail10@gmail.com
> 🌐 https://uniform-bd.com (coming soon)

© 2025 UniForm Platform. All rights reserved.

# First time setup

-   `git clone https://github.com/your-username/your-repository-name.git`
-   `cd your-repository-name`
-   `git checkout -b <your-name>-dev` # Create and switch to your dedicated branch
-   `git push -u origin <your-name>-dev` # Push your empty branch to GitHub

# Daily workflow

-   `git checkout main`
-   `git pull origin main` # Get latest changes from the main branch
-   `git checkout <your-name>-dev`
-   `git merge main` # Merge main into your branch to stay updated

# Make your code changes

-   `git add .`
-   `git commit -m "My meaningful commit message"`
-   `git push origin <your-name>-dev` # Push your changes to your dedicated branch

# When your work is done for a feature/part

# Ensure your branch is up-to-date with main and all conflicts are resolved

-   `git checkout <your-name>-dev`
-   `git merge main` # (again, just to be sure)
-   `git push origin <your-name>-dev`

# Go to GitHub and create a Pull Request from <your-name>-dev to main
