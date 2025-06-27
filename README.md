# Real-Time Chat Application

A full-stack real-time chat application built with **React.js**, **Node.js**, and **TypeScript**. It supports user registration, login, chat creation, and real-time messaging using WebSockets.

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Create Environment Files](#2-create-environment-files)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Run the Application](#4-run-the-application)
- [Features](#features)

## Project Structure

- **client/** – Frontend in React.js for user registration, login, and chatting interface.
- **server/** – Backend in Node.js/TypeScript handling REST operations like chat creation, message handling, data fetching, and user authentication.
- **socket/** – WebSocket server enabling real-time chat functionality.

## Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-chat-project.git
cd your-chat-project
```

### 2. Create Environment Files

For each directory (`client/`, `server/`, and `socket/`), create a `.env` file based on the provided `.env-example` template.

```bash
cp client/.env-example client/.env
cp server/.env-example server/.env
cp socket/.env-example socket/.env
```

Update the variables in each `.env` file as needed.

### 3. Install Dependencies

Run the following command in each directory to install dependencies:

```bash
npm install
```

### 4. Run the Application

To start all services in development mode, run the following in each directory:

```bash
npm run dev
```

Make sure all services are running simultaneously for full functionality.

## Features

- User registration and login
- Create and join chats
- Send and receive messages in real-time
- RESTful APIs for chat and message management
- WebSocket communication for real-time interaction

---

Feel free to contribute or raise issues if you encounter any problems!
