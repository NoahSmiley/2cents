# 💰 2cents Budget Tracker

A simple, beautiful budget tracking application for Windows built with Electron, React, and TypeScript.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 💰 **Transaction Tracking** - Track all income and expenses with categories
- 🎯 **Savings Goals** - Set and monitor progress toward financial goals
- 📅 **Recurring Bills** - Never miss a payment with bill tracking and reminders
- 📊 **Budget Categories** - Customizable spending categories with limits
- 🔄 **Auto-Updates** - Get notified when new versions are available
- 🔒 **Per-User Data** - Each user gets their own private database
- 🎨 **Beautiful UI** - Professional and minimalist modes available
- 💾 **Local Storage** - All data stays on your computer (SQLite database)

## 📥 Installation

### For Users

1. Download the latest installer from [Releases](https://github.com/NoahSmiley/2cents/releases)
2. Run `2cents Budget Tracker Setup.exe`
3. Follow the installation wizard
4. Launch from desktop or start menu!

### For Developers

```bash
# Clone the repository
git clone https://github.com/NoahSmiley/2cents.git
cd 2cents

# Install dependencies
npm install

# Run in development mode
npm start
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Windows (for building Windows installers)

### Commands

```bash
# Development mode (hot reload)
npm start

# Build React app only
npm run build

# Build Windows installer
npm run build:win

# Build for other platforms
npm run build:mac    # macOS
npm run build:linux  # Linux
```

### Project Structure

```
2cents/
├── electron/          # Electron main process
│   ├── main.cjs      # Main entry point
│   ├── preload.ts    # Preload script
│   └── database.cjs  # SQLite database logic
├── src/              # React application
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── lib/          # Business logic
│   └── hooks/        # Custom React hooks
├── public/           # Static assets
└── release/          # Built installers (gitignored)
```

## 🗄️ Database

Data is stored locally using SQLite:
- **Location**: `C:\Users\[Username]\AppData\Roaming\2cents\twocents.db`
- **Per-User**: Each user account gets their own database
- **Tables**: transactions, goals, recurring_bills, settings, categories

## 🔄 Auto-Updates

The app automatically checks for updates on startup. When a new version is available:
1. User sees notification in Settings
2. User clicks "Download Update"
3. User clicks "Restart and Install"
4. App updates automatically!

Updates are distributed via GitHub Releases.

## 🚀 Releasing Updates

1. Update version in `package.json`
2. Build: `npm run build:win`
3. Commit and push changes
4. Create GitHub release with tag `v1.x.x`
5. Upload installer and `latest.yml`
6. Users get notified automatically!

See [RELEASE_WORKFLOW.md](RELEASE_WORKFLOW.md) for detailed instructions.

## 📚 Documentation

- [Build and Deploy Guide](BUILD_AND_DEPLOY.md) - Detailed build instructions
- [Release Workflow](RELEASE_WORKFLOW.md) - How to publish updates
- [Database Setup](DATABASE_SETUP.md) - Database architecture
- [Congratulations](CONGRATULATIONS.md) - Project completion summary

## 🛡️ Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/) - Desktop app framework
- **UI**: [React](https://react.dev/) - UI library
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type safety
- **Build**: [Vite](https://vitejs.dev/) - Fast build tool
- **Styling**: [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- **Database**: [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - SQLite for Node.js
- **Routing**: [React Router](https://reactrouter.com/) - Client-side routing
- **Updates**: [electron-updater](https://www.electron.build/auto-update) - Auto-update system

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🙏 Acknowledgments

Built with love for simple, effective budget tracking.

---

**Made with ❤️ by Noah Smiley**
