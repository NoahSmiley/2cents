# 🚀 Release Workflow - Your First GitHub Release

## ✅ What's Ready

Your app is fully built and working! Here's what you have:
- `release/2cents Budget Tracker Setup 1.0.0.exe` - The installer
- `release/latest.yml` - Update metadata
- Clean, production-ready code

## 📝 Step-by-Step: First Release (v1.0.0)

### 1. Initialize Git (if not done)

```bash
git init
git add .
git commit -m "Initial release - v1.0.0"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `2cents`
3. Description: "Simple budget tracking app for Windows"
4. **Public** (required for free auto-updates)
5. **Don't** initialize with README (you already have files)
6. Click "Create repository"

### 3. Push Your Code

```bash
git remote add origin https://github.com/NoahSmiley/2cents.git
git branch -M main
git push -u origin main
```

### 4. Create GitHub Release

1. Go to https://github.com/NoahSmiley/2cents/releases
2. Click **"Create a new release"**
3. Fill in:

**Tag version**: `v1.0.0`
- ⚠️ Must start with `v` and match package.json version

**Release title**: `v1.0.0 - Initial Release`

**Description**:
```markdown
## 2cents Budget Tracker - Initial Release 🎉

A simple, beautiful budget tracking app for Windows.

### ✨ Features
- 💰 Track income and expenses
- 🎯 Set savings goals and track debt payoff
- 📅 Manage recurring bills with due date tracking
- 📊 Customizable budget categories with limits
- 🔄 Automatic updates (you'll get notified of new versions!)
- 🔒 Per-user data isolation (each user gets their own database)
- 🎨 Beautiful, modern UI with professional and minimalist modes

### 📥 Installation
1. Download `2cents Budget Tracker Setup 1.0.0.exe` below
2. Run the installer
3. Follow the prompts
4. Launch the app from your desktop or start menu!

### 💾 Data Storage
Your data is stored locally at:
`C:\Users\[YourName]\AppData\Roaming\2cents\twocents.db`

Each user on the computer gets their own separate database.

### 🐛 Known Issues
None! This is the stable initial release.

### 📝 Notes
- No internet connection required
- All data stays on your computer
- Automatic updates will notify you when new versions are available
```

4. **Upload files**:
   - Drag and drop `2cents Budget Tracker Setup 1.0.0.exe`
   - Drag and drop `latest.yml`

5. Click **"Publish release"**

### 5. Test Auto-Updates Work

1. Install the app from the GitHub release
2. Go to Settings in the app
3. Click "Check for Updates"
4. Should say "No updates available" (you're on the latest!)

---

## 🔄 Future Updates Workflow

When you want to release v1.1.0:

### 1. Make Your Changes

Edit code, fix bugs, add features...

### 2. Update Version Number

Edit `package.json`:
```json
{
  "version": "1.1.0"  // Change from 1.0.0
}
```

### 3. Build

```bash
npm run build:win
```

### 4. Commit and Push

```bash
git add .
git commit -m "v1.1.0 - Added [feature name]"
git push
```

### 5. Create New Release

1. Go to https://github.com/NoahSmiley/2cents/releases
2. Click "Create a new release"
3. Tag: `v1.1.0`
4. Title: `v1.1.0 - What's New`
5. Description:
```markdown
## What's New in v1.1.0

### ✨ New Features
- Added [feature description]

### 🐛 Bug Fixes
- Fixed [bug description]

### 🔧 Improvements
- Improved [improvement description]
```

6. Upload:
   - `2cents Budget Tracker Setup 1.1.0.exe`
   - `latest.yml`

7. Publish!

### 6. Users Get Notified!

- Existing users will see "Update Available" in Settings
- They click "Download Update"
- They click "Restart and Install"
- App updates automatically!

---

## 📊 Version Numbering Guide

Use semantic versioning: `MAJOR.MINOR.PATCH`

- **Patch** (1.0.0 → 1.0.1): Bug fixes only
- **Minor** (1.0.0 → 1.1.0): New features, backwards compatible
- **Major** (1.0.0 → 2.0.0): Breaking changes

Examples:
- Fixed a crash → `1.0.1`
- Added export feature → `1.1.0`
- Complete UI redesign → `2.0.0`

---

## 🎯 Quick Reference

### Build Commands
```bash
npm start              # Development mode
npm run build:win      # Build installer
```

### Git Commands
```bash
git add .
git commit -m "Description"
git push
```

### Release Checklist
- [ ] Update version in package.json
- [ ] Build: `npm run build:win`
- [ ] Commit and push code
- [ ] Create GitHub release with tag `v1.x.x`
- [ ] Upload installer + latest.yml
- [ ] Publish release
- [ ] Test that users can update

---

## 💡 Pro Tips

1. **Always test the installer** before publishing
2. **Write clear release notes** - users appreciate knowing what changed
3. **Don't skip versions** - go 1.0.0 → 1.0.1 → 1.0.2, not 1.0.0 → 1.0.3
4. **Keep old releases** - don't delete them (users might need older versions)
5. **Monitor downloads** - GitHub shows download stats for each release

---

## 🎉 You're Ready!

Your app now has:
- ✅ Professional auto-update system
- ✅ GitHub releases for distribution
- ✅ Easy update workflow
- ✅ Version control with Git

**Go create that first release and share your app!** 🚀
