DevHub — Social Dev App (Practice)

A hands-on project built with React + Firebase (Authentication + Firestore/DB) + Tailwind CSS.
Goal: Practice building a production-ready app structure with real-world features.
⚠️ Status: Work in Progress — not yet finished.

✨ What is DevHub?
  
    DevHub is a small-scale social hub for developers, created to practice and demonstrate:
    
    Authentication system (login, signup, logout)
    
    Storing user profiles in Firebase Firestore (or Realtime Database)
    
    Responsive UI with React + Tailwind
    
    Clean project architecture with clear separation of concerns
    
    This project focuses on mastering fundamentals while keeping the codebase structured in a way that can scale.
    
  🧩 Core Features (Current + Planned)

🔐 Authentication

    Email/Password signup & login
    
    Persistent authentication (survives refresh)
    
    Protected routes with PrivateRoute
    
    (Planned) Google/GitHub OAuth

👤 User Profile

    Store user data in Firestore under users/{uid}
    
    Fields: displayName, photoURL, bio, role, createdAt
    
    (Planned) Profile editing

🧱 App Shell + UX

    Layout + Navbar + Sidebar (responsive)
    
    Toast notifications (success/error states)
    
    Loading states for async actions

🧰 Architecture

    React Context for authentication state
    
    Firebase services separated into services/
    
    Custom hooks (useAuth, useUserProfile, useLoading)
    
    Scalable folder structure

🗂 Folder Structure (so far)
    devhub/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── feedComponents/
    │   │   │   ├── CommunityFeed.jsx
    │   │   │   ├── PostDetailModal.jsx
    │   │   │   └── PostModalOutside.jsx
    │   │   ├── PhotoUploaderModal.jsx
    │   │   ├── PostDetailModal.jsx
    │   │   ├── Toast.jsx
    │   ├── layout/
    │   │   ├── DashboardLayout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── DarkModeToggle.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useLoading.js
    │   │   ├── useUserProfile.js
    │   │   └── usePostsByUserId.js
    │   ├── lib/
    │   │   └── firebase.js
    │   ├── supabase/
    │   │   └── supabase.js
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── Settings.jsx
    │   ├── services/
    │   │   ├── authService.js
    │   │   ├── commentService.js
    │   │   ├── profileService.js
    │   │   ├── searchService.js
    │   │   └── userRecentActivitiesService.js
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .eslintrc.js
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── package.json
    └── vite.config.js

🚧 Work in Progress

    This project is not finished yet.
    Planned next steps:
    
    Add Google/GitHub OAuth login
    
    Implement profile editing & avatar upload
    
    Build basic feed (posts + comments)
    
    Dark/Light mode support

🎯 Purpose

    This repository is not meant to be a full production app (yet).
    It’s mainly for:
    
    Practicing React + Firebase authentication & database
    
    Mastering Tailwind CSS for responsive UI
    
    Learning project structuring and clean architecture
