# TwoCents Budget App - Setup Instructions

## 📦 For Windows PC Setup

### Prerequisites
1. **Install Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Choose "LTS" version
   - Run installer and follow prompts
   - Verify installation:
     ```cmd
     node --version
     npm --version
     ```

2. **Install Git** (if not already installed)
   - Download from: https://git-scm.com/download/win
   - Run installer with default settings

### Clone and Setup

1. **Open Command Prompt or PowerShell**
   - Press `Win + R`, type `cmd`, press Enter

2. **Navigate to where you want the project**
   ```cmd
   cd C:\Users\YourUsername\Documents
   ```

3. **Clone the repository**
   ```cmd
   git clone https://github.com/YOUR_USERNAME/twocents-budget.git
   cd twocents-budget
   ```

4. **Install dependencies**
   ```cmd
   npm install
   ```
   This will take a few minutes to download all packages.

5. **Run the app in development mode**
   ```cmd
   npm run dev
   ```
   The app will open automatically in Electron!

### Build for Production (Optional)

To create a standalone executable:
```cmd
npm run build
```

The built app will be in the `dist` folder.

## 🎨 Features

### UI Modes
- **Professional Mode** - Rich visuals, animations, charts
- **Minimalist Mode** - Clean, simple, distraction-free

Toggle in: **Settings → UI Mode**

### Pages
1. **Dashboard** - Overview with charts and widgets
2. **Transactions** - Track all income and expenses
3. **Recurring Bills** - Manage monthly subscriptions
4. **Goals** - Save for specific targets
5. **Settings** - Configure currency and categories

### Right-Click Features
- **Calculator** - Draggable calculator anywhere
- **Copy** - Copy selected text
- **Reload** - Refresh the page

## 🔧 Development Commands

```cmd
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Check code quality
```

## 💾 Data Storage

All data is stored locally in your browser's localStorage:
- `twocents.ledger.v1` - Transactions
- `twocents.settings.v1` - Settings and categories
- `twocents.recurring.v1` - Recurring bills
- `twocents-goals` - Goals and savings
- `twocents-notes` - Notes (if using notepad)

## 🆘 Troubleshooting

### "npm is not recognized"
- Restart your terminal after installing Node.js
- Or add Node.js to your PATH manually

### Port already in use
- Close other apps using port 5173
- Or change port in `vite.config.ts`

### Build fails
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

## 📝 Notes

- First time setup takes 5-10 minutes
- App runs entirely offline after setup
- No internet connection required to use
- Data syncs across devices if using same browser profile
