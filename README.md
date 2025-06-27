# Agendify Plus

## 📋 Description

**Agendify Plus** is a full-stack web application designed for professionals who need an organized and efficient way to manage client appointments. The platform enables users to create, view, edit, and delete appointments, while offering secure access, client selection, and date/time validations.

<img width="1453" alt="image" src="https://github.com/user-attachments/assets/75e831b5-ef78-403d-996b-b7d7bbe04bdc" />

<img width="1461" alt="image" src="https://github.com/user-attachments/assets/f5f4657e-d0e2-4fd1-bcfd-843c7f4cc872" />

<img width="1465" alt="image" src="https://github.com/user-attachments/assets/d066c24c-0448-4bde-8f12-67b365aae28c" />

## Table of Contents
- [Description](#-description)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [Questions](#-questions)

## ⚙️ Tech Stack & Architecture

This slide summarizes the updated tech stack and configuration for the project, divided into three key areas: **Frontend**, **Backend**, and **Development Tools & Configuration**.

### 🔹 Frontend
- **React** with Hooks and **TypeScript**
- Built with **Vite** for fast and optimized development
- **React Router** for client-side routing
- **Apollo Client** to consume the GraphQL API
- **Bootstrap** for consistent styling and responsive layout
- **JWT Authentication** stored in `localStorage` to protect routes and manage sessions

### 🔹 Backend
- **Node.js** with **Express.js** as the server framework
- **Apollo Server** for defining and serving the GraphQL API
- **MongoDB** with **Mongoose** for database modeling and management
- **JWT** used to secure private resolvers

> 📦 Both the frontend and backend are deployed on [Render](https://render.com), allowing unified and scalable deployment.

### 🔹 Development Tools & Configuration
- `vite.config.ts` proxies `/graphql` requests to the backend
- `@vitejs/plugin-react` enables React support in Vite
- `vite-env.d.ts` provides better TypeScript compatibility
- `.env` files manage environment-specific variables for local and production use

---

##  Installation 

```md
// Clone the code
git clone 
```
```bash
npm install
```

## Usage

* Open your TERMINAL to start running the app:

```bash
npm run start:dev
```

 ##  Contributing
We welcome contributions! You can leave feedback or suggestions by commenting directly on specific lines of code in the repository.

 ##  Questions
For any questions, please contact us using the information below:
- GitHub: [Agendify](https://github.com/agendify](https://github.com/WillduaD98/Agendify)
 

## 👥 Collaborators

This project was developed by a dedicated team of collaborators:

- **Ervey**
- **Gaby**
- **Michelle**
- **William**

We appreciate everyone's contribution to the success of Agendify Plus!
