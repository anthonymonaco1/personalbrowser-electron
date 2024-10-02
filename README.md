# Personal Browser/Task Manager App Template

A customizable desktop application built with **Electron.js**, **React**, **TypeScript**, and **Tailwind CSS**, serving as a personal browser and task manager. This template integrates various web applications into a single, cohesive interface.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [License](#license)

## Overview

This application provides a unified platform for managing various tasks and web applications. It features a dashboard and a top navigation bar that allows you to switch between different views, each hosting a specific web application or custom component.

## Features

- **Dashboard**: The home screen displaying widgets like news feeds, social media embeds, weather information, and a Spotify playlist.
- **Notes**: Integrates with Figma whiteboard for quick access to notes and brainstorming sessions.
- **Email**: Access your Gmail inbox directly within the application.
- **Calendar**: View and manage your Google Calendar, with support for dark mode.
- **GitHub**: Quick access to your GitHub profile and repositories.
- **ChefBot**: Integrates with a custom ChefBot application hosted on Vercel.
- **FPL Optimizer**: A custom Fantasy Premier League optimizer tool built into the application.
- **Customizable Navigation**: Easily add or remove navigation items and their corresponding views.

## Technologies Used

- **Electron.js**: For creating the desktop application.
- **React**: For building the user interface.
- **TypeScript**: For static type checking.
- **Tailwind CSS**: For styling the UI components.
- **IPC Communication**: Uses Electron's IPC for communication between the main and renderer processes.

## Getting Started

### Prerequisites

- **Node.js** (v14 or later)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   ```

2. **Navigate to the project directory**

    ```bash
    cd your-repo-name
    ```

3. **Install dependencies**

    ```bash
    npm install
    ```

## Usage

### Running the Application

To start the application in development mode:

```plaintext
npm run start
```

This will start both the Electron main process and the React development server.

## Project Structure

```plaintext
.
├── assets                  # Images and other assets
├── main
│   ├── main.ts             # Electron main process code
│   ├── menu.ts             # Application menu definitions
│   └── preload.ts          # Preload scripts
├── renderer
│   ├── App.tsx             # Main React component
│   ├── components          # React components
│   │   ├── CustomIframe.tsx    # Custom iframe component
│   │   ├── WeatherWidget.tsx   # Weather widget component
│   │   └── ...                 # Other components
│   └── fploptimizer        # FPL Optimizer components
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## License

This project is open-source and available under the MIT License.
