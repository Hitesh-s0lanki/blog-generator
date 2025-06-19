# Agentic AI Blog Generator

> **WIP**: Work in Progress

A Next.js application that uses Shadcn UI and Tailwind CSS to let users generate, browse, and view AI-generated blogs via an “agentic” workflow graph.

---

## Features

- **Global Layout**

  - Responsive navbar with “Login” link and “Get Started” button
  - Custom loading spinner component for page transitions and API calls

- **Home Page (`/`)**

  - Full-width textarea for users to describe the blog they want
  - Agentic workflow graph visualization powered by **React Flow**
  - “Generate” button to trigger blog creation (shows loading spinner)

- **Blogs Index (`/blogs`)**

  - Responsive grid of cards displaying previously generated blogs
  - Each card shows: featured image, title, date generated, short description
  - Built with Shadcn UI **Card** components

- **Blog Detail (`/blog/[id]`)**

  - Full blog view: title, featured image, publish date, and formatted content
  - “Back to Blogs” and “Generate New” Shadcn UI **Button** components

- **Loading Component**
  - Centered spinner that appears during data fetches and page changes

---

## Tech Stack

- **Next.js** — React framework for server-rendered and static websites
- **Shadcn UI** — Tailwind-based component library
- **Tailwind CSS** — Utility-first CSS framework
- **React Flow** — Interactive graph visualization for agentic workflow
- **TypeScript** — Static typing for safety and DX

---
