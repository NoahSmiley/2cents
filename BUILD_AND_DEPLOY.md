# 🚀 Building and Deploying Your App

## ✅ What's Set Up

Your app now has:
- ✅ **Auto-update functionality** - Users get notified of new versions
- ✅ **GitHub releases integration** - Updates are distributed via GitHub
- ✅ **Update checker UI** - In Settings page
- ✅ **Electron-builder configuration** - Ready to build installers

## 📦 Building the App

### 1. Build for Windows

```bash
npm run build:win
```

This creates:
- `release/2cents Budget Tracker Setup 1.0.0.exe` - Installer
- `release/2cents Budget Tracker-1.0.0-win.zip` - Portable version

### 2. Build for Mac (if on Mac)

```bash
npm run build:mac
```

### 3. Build for Linux (if on Linux)

```bash
npm run build:linux
```

## 🔄 How Auto-Updates Work

### For Users:
1. User installs your app (v1.0.0)
2. You release a new version (v1.1.0) on GitHub
3. App automatically checks for updates on startup
4. User sees "Update Available" notification in Settings
5. User clicks "Download Update"
6. User clicks "Restart and Install"
7. App updates automatically!

### For You (Developer):
1. Make changes to your code
2. Update version in `package.json`
3. Build the app
4. Create a GitHub release
5. Upload the installer files
6. Users get notified automatically!

## 📝 Step-by-Step: Publishing an Update

### Step 1: Update Version Number

Edit `package.json`:
```json
{
  "version": "1.1.0"  // Change from 1.0.0 to 1.1.0
}
```

### Step 2: Build the App

```bash
npm run build:win
```

### Step 3: Create GitHub Release

1. Go to your GitHub repo: https://github.com/NoahSmiley/2cents
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.1.0` (must match package.json version with 'v' prefix)
4. Release title: `v1.1.0 - What's New`
5. Description: List your changes
   ```markdown
   ## What's New
   - Added auto-update functionality
   - Fixed bug with recurring bills
   - Improved performance
   ```

### Step 4: Upload Files

Upload these files from the `release/` folder:
- `2cents Budget Tracker Setup 1.1.0.exe`
- `latest.yml` (auto-generated, contains update info)

### Step 5: Publish Release

Click "Publish release"

### Step 6: Users Get Updated!

- Existing users will see "Update Available" in Settings
- They can download and install with one click

## 🎯 First-Time Setup

### 1. Push Your Code to GitHub

If you haven't already:
```bash
git init
git add .
git commit -m "Initial commit with auto-updates"
git branch -M main
git remote add origin https://github.com/NoahSmiley/2cents.git
git push -u origin main
```

### 2. Build Your First Release

```bash
npm run build:win
```

### 3. Create v1.0.0 Release on GitHub

1. Go to https://github.com/NoahSmiley/2cents/releases
2. Click "Create a new release"
3. Tag: `v1.0.0`
4. Title: `v1.0.0 - Initial Release`
5. Upload:
   - `2cents Budget Tracker Setup 1.0.0.exe`
   - `latest.yml`
6. Publish!

### 4. Share with Users

Send them the installer link:
```
https://github.com/NoahSmiley/2cents/releases/latest/download/2cents%20Budget%20Tracker%20Setup%201.0.0.exe
```

## 🔧 Configuration Details

### package.json - Build Settings

```json
"build": {
  "publish": {
    "provider": "github",
    "owner": "NoahSmiley",
    "repo": "2cents",
    "private": false
  }
}
```

This tells electron-updater where to check for updates.

### Auto-Update Behavior

- **Check on startup**: App checks for updates 3 seconds after launch
- **Manual check**: Users can click "Check for Updates" in Settings
- **Download**: User must approve download
- **Install**: User must click "Restart and Install"
- **Dev mode**: Updates are disabled in development (npm start)

## 📋 Version Numbering

Use semantic versioning:
- `1.0.0` → `1.0.1` - Bug fixes
- `1.0.0` → `1.1.0` - New features
- `1.0.0` → `2.0.0` - Major changes

## 🎨 Customization

### Change App Icon

Replace `public/icon.png` with your own icon (256x256px recommended)

### Change App Name

Edit `package.json`:
```json
"build": {
  "productName": "Your App Name"
}
```

### Change Publisher

Edit `package.json`:
```json
"build": {
  "win": {
    "publisherName": "Your Name"
  }
}
```

## 🐛 Troubleshooting

### "Update check failed"

- Make sure you've created a GitHub release
- Check that the repo is public or you have a GitHub token
- Verify the owner/repo in package.json is correct

### "No updates available"

- Make sure the GitHub release version is higher than installed version
- Check that `latest.yml` was uploaded to the release
- Wait a few minutes for GitHub to process the release

### Build fails

- Run `npm run build` first to ensure React app builds
- Check that `electron-rebuild` completed successfully
- Make sure all dependencies are installed

## 📱 Testing Updates

### Test Locally

1. Build version 1.0.0
2. Install it
3. Change version to 1.0.1 in package.json
4. Build again
5. Create GitHub release with v1.0.1
6. Open installed app
7. Go to Settings → Check for Updates
8. Should see update available!

## 🎉 You're Ready!

Your app now has professional auto-update functionality! Users will always have the latest version with minimal effort.

### Quick Reference

```bash
# Make changes to code
# Update version in package.json
npm run build:win
# Create GitHub release
# Upload installer + latest.yml
# Done!
```

## 💡 Pro Tips

1. **Test before releasing**: Always test the installer before publishing
2. **Write good release notes**: Users appreciate knowing what changed
3. **Version consistently**: Don't skip versions
4. **Keep releases**: Don't delete old releases (users might need them)
5. **Monitor downloads**: GitHub shows download stats for each release

## 🔐 Code Signing (Optional)

For production apps, consider code signing:
- Windows: Get a code signing certificate
- Mac: Join Apple Developer Program
- Prevents security warnings during installation

This requires additional setup but makes your app look more professional.
