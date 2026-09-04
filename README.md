# 📝 To-Do List App

A full-stack To-Do list application with a React Native (Android) frontend and a Node.js/Express/MongoDB backend. Users can register, log in, and manage tasks with a title, description, date-time, deadline, and priority.

## Features

- 🔐 User registration and login (JWT-based authentication)
- ✅ Create, view, complete, and delete tasks
- 📅 Set a date-time and deadline for each task
- 🚦 Priority levels (Low / Medium / High)
- 📱 Native Android app built with React Native CLI + TypeScript

## Tech Stack

**Frontend**
- React Native CLI (TypeScript)
- React Navigation (native stack)
- React Context API for state management
- Axios for API requests
- AsyncStorage for persisting the logged-in session

**Backend**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT authentication with bcrypt password hashing

## Project Structure

```
.
├── backend/                 # Node.js/Express/MongoDB API
│   └── src/
│       ├── config/          # Database connection
│       ├── models/          # Mongoose schemas (User, Task)
│       ├── controllers/     # Route handlers
│       ├── routes/          # Express routes
│       ├── middleware/      # JWT auth middleware
│       └── server.ts        # App entry point
│
└── frontend/                 # React Native app
    ├── App.tsx
    └── src/
        ├── api/               # Axios instance + API calls
        ├── context/            # AuthContext, TaskContext (global state)
        ├── navigation/          # Auth/App stack navigators
        ├── screens/              # Login, Register, TaskList, AddTask
        ├── components/            # Reusable UI (TaskItem)
        └── types/                  # Shared TypeScript types
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS)
- [JDK 17](https://adoptium.net)
- [Android Studio](https://developer.android.com/studio) with an Android SDK + emulator set up
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (or a local MongoDB instance)

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in your own values:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/todoapp?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret
```

Run the server:

```bash
npm run dev
```

You should see `MongoDB connected successfully` and `Server running on http://0.0.0.0:5000`.

### 2. Frontend setup

The `frontend/` folder here contains the app's source files. To run it, generate a React Native project and copy these files in:

```bash
npx @react-native-community/cli init TodoApp
cd TodoApp
```

Copy `frontend/App.tsx` and `frontend/src/` into your new `TodoApp/` project (overwriting the default `App.tsx`).

Install the required packages:

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install axios
npm install @react-native-community/datetimepicker
```

Update `src/api/api.ts` with the correct backend URL for your setup:

- Android Emulator + backend on the same machine → `http://10.0.2.2:5000/api`
- Physical device on the same Wi-Fi → `http://<your-computer-LAN-IP>:5000/api`
- Deployed backend → its real `https://` URL

Run it:

```bash
npx react-native start
```

In a separate terminal:

```bash
npx react-native run-android
```

## API Reference

| Method | Endpoint             | Body                                                          | Auth required |
|--------|-----------------------|-----------------------------------------------------------------|----------------|
| POST   | `/api/auth/register`   | `{ email, password }`                                            | No             |
| POST   | `/api/auth/login`      | `{ email, password }`                                            | No             |
| GET    | `/api/tasks`             | —                                                                | Yes            |
| POST   | `/api/tasks`             | `{ title, description, dateTime, deadline, priority }`             | Yes            |
| PATCH  | `/api/tasks/:id`           | any subset of task fields, e.g. `{ completed: true }`                | Yes            |
| DELETE | `/api/tasks/:id`           | —                                                                | Yes            |

Authenticated requests need header: `Authorization: Bearer <token>`.

## Building an APK

**Debug APK** (quick, for testing):
```bash
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

**Release APK** (signed, for distribution) requires generating a signing key first — see [Android's official guide](https://developer.android.com/studio/publish/app-signing) for the full signing setup.

## License

This project is open source and available for personal and educational use.