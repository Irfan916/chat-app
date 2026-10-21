# 💬 Real-Time Chat Application

A modern, full-stack, real-time chat application built with **React**, **Firebase**, and **Tailwind CSS**. Features secure authentication, multiple chat rooms, live typing indicators, and instant message updates.

🔗 **Live Demo:** 
<p>
<img src="./public/screenshot.png
" alt="Alt text" width="50%" height="50px" /></p>
Live server : https://chat-app-ry3f.vercel.app

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

---

## ✨ Features

- 🔐 **Secure Authentication:** Sign up and log in using Email/Password or Google OAuth.
- ⚡ **Real-Time Messaging:** Messages appear instantly for all users using Firebase `onSnapshot`.
- 🚪 **Multiple Chat Rooms:** Switch between different channels (`#general`, `#gaming`, `#random`).
- ⌨️ **Typing Indicators:** See when other users are typing with a debounced Firebase update.
- 🗑️ **Delete Messages:** Users can hover over their own messages to delete them.
- 👤 **Dynamic Avatars:** Displays Google profile pictures or auto-generated initial-based avatars.
- 🌙 **Modern Dark UI:** A sleek, Discord-inspired dark theme built with Tailwind CSS.
- 🛡️ **Protected Routes:** Unauthenticated users are automatically redirected to the login page.

---

## 🛠️ Tech Stack

| Tool | Purpose |
| ------ | --------- |
| **React 19** | UI Library & State Management |
| **React Router 7** | Client-side routing (Login, Signup, Chat) |
| **Firebase Auth** | Secure user authentication (Google & Email) |
| **Firestore** | Real-time NoSQL database |
| **Tailwind CSS 4** | Utility-first styling & Dark Mode |
| **Vite** | Build tool & Development Server |
| **Vercel** | Deployment & Hosting |

---

## 🧠 How It Works (Architecture)

**1. Global Auth State (Context API)**
The `AuthContext` wraps the entire application. It uses Firebase's `onAuthStateChanged` to listen for login/logout events globally. Any component can access the user's data using the custom `useAuth()` hook.

**2. Real-Time Listeners**
Instead of traditional `fetch` requests, the chat uses Firebase's `onSnapshot`. This opens a persistent WebSocket connection to the database. When a new message is written to Firestore, the database immediately pushes it to the frontend, updating the `messages` state array without refreshing the page.

**3. The Typing Indicator (Debounce)**
When a user types, a `setDoc` updates their `isTyping` status in Firestore. A `setTimeout` clears this status after 1.5 seconds of inactivity, preventing the database from being spammed with write requests on every keystroke.

**4. Auto-Scroll with `useRef`**
An invisible `div` is placed at the bottom of the chat list. The `useRef` hook points to this div, and `useEffect` calls `scrollIntoView()` whenever a new message arrives, ensuring the user always sees the latest text.

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- A Firebase account

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/YOUR_USERNAME/chat-app.git
   cd chat-app
2. Install dependencies:
    npm install
3. Create a .env file in the root directory and add your Firebase config:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

4. Run the development server:

npm run dev
