# Sabari Vijayan | Professional Portfolio

A minimal, architectural, and highly automated portfolio showcasing my journey as a Computer Science student at RIT Kottayam. This project focuses on precision, clean code, and a seamless user experience.

## 🚀 Key Features

### 🤖 Portfolio Intelligence (AI Orchestrator)
The home page features a custom AI assistant that acts as a professional representative.
- **Dynamic Context**: It retrieves real-time data from GitHub to answer questions about specific repositories, tech stacks, and project status.
- **Natural Conversation**: Designed to provide insightful, conversational responses rather than simple redirects.
- **Architecture**: Powered by a dual-LLM (Router-Generator) pattern hosted on Vercel.

### 📄 Intelligent Document Hub
A dedicated space for academic and professional credentials.
- **Filtered Search**: Easily locate resumes, certificates (like AI Fluency), and papers using a real-time search interface.
- **Categorized Storage**: Organized for quick access to high-signal professional documents.

### 🔄 Fully Automated Content Synchronization
This portfolio is "alive"—it updates itself without manual intervention.
- **GitHub Projects**: Automatically fetches your latest repositories, filters them by topic, and sorts them by star count.
- **Medium Blogs**: Syncs latest articles, including featured images and clean text snippets, directly from your Medium RSS feed.
- **Workflows**: Powered by GitHub Actions to ensure the data is always fresh.

## 🏗️ Architecture & Philosophy

This website is built as a **Hybrid Jamstack (Living Static Site)**. It exists in the sweet spot between a traditional static site and a fully dynamic web application.

- **Static Shell, Dynamic Heart**: The layout and portfolio are served as pre-built, high-performance static files (via GitHub Pages/Vercel). However, it uses **GitHub Actions** as a "headless CMS" to automatically pull fresh data from Medium and GitHub, "baking" it into the site during build time.
- **Real-Time Edge Layer**: The AI agent (`api/chat.ts`) provides a fully dynamic layer. Running as a **Vercel Edge Function**, it fetches real-time repository metadata (stars, forks, last-updated) on-the-fly, ensuring the conversation is always grounded in live data.
- **The "Automated Jamstack"**: By combining Static Site Generation (SSG) with an automated data pipeline, the site achieves maximum security and speed without the maintenance overhead of a database or the staleness of a manual portfolio.

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router (HashRouter for GitHub Pages compatibility)
- **Styling**: Modern CSS with a focus on WCAG 2.0 AAA accessibility standards.
- **Backend/API**: Vercel Serverless Functions (Node.js)
- **AI**: Google Gemini Pro & Flash models

## 📖 Learn More & Automate Your Own
I have documented the automation strategy used in this project so others can implement similar systems.
- [GitHub Actions Automation Guide](./AUTOMATION_GUIDE.md) - Learn how to automate your own project updates.
- [AI Orchestrator Architecture](./ORCHESTRATOR_ARCH.md) - Deep dive into how the AI assistant works.

---
Built with 💙 by Sabari Vijayan.
