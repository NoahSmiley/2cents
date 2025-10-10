# GitHub Auto-Update Release Guide

## How Auto-Updates Work

When you publish a new version:
1. Users click "Check for Updates" in the app
2. The app checks GitHub releases for a newer version
3. If found, it downloads the update files
4. User clicks "Install" and the app restarts with the new version

## Publishing a Release (Step-by-Step)

### 1. Update Version Number

Edit `package.json`:
```json
{
  "version": "1.0.3"  // Increment this (was 1.0.2)
}
```

### 2. Build the App

```bash
npm run build:win
```

This creates files in the `release` folder:
- `2cents Budget Tracker Setup 1.0.3.exe` - The installer
- `latest.yml` - Update metadata (CRITICAL for auto-updates!)

### 3. Create a Git Tag

```bash
git add .
git commit -m "Release v1.0.3"
git tag v1.0.3
git push origin main
git push origin v1.0.3
```

### 4. Create GitHub Release

1. Go to: https://github.com/NoahSmiley/2cents/releases/new
2. Click "Choose a tag" → Select `v1.0.3`
3. Title: `v1.0.3`
4. Description: List what's new
5. **Upload these files from `release/` folder:**
   - ✅ `2cents Budget Tracker Setup 1.0.3.exe`
   - ✅ `latest.yml` (REQUIRED for auto-updates!)
6. Click "Publish release"

### 5. Test Auto-Update

1. Install the OLD version (1.0.2) on another machine
2. Open the app → Go to Settings
3. Click "Check for Updates"
4. Should show "Update Available: v1.0.3"
5. Click "Download Update"
6. Click "Restart and Install"

## Important Files

### latest.yml
This file tells the app about the new version:
```yaml
version: 1.0.3
files:
  - url: 2cents Budget Tracker Setup 1.0.3.exe
    sha512: [hash]
    size: [bytes]
path: 2cents Budget Tracker Setup 1.0.3.exe
sha512: [hash]
releaseDate: '2024-01-09T19:20:00.000Z'
```

**Without this file, auto-updates will NOT work!**

## Troubleshooting

### "No updates available" when there should be
- Check that `latest.yml` is uploaded to the release
- Verify the version in `package.json` is higher than installed version
- Check GitHub release is published (not draft)

### "Download failed"
- Ensure the `.exe` file is uploaded
- Check the file name matches what's in `latest.yml`
- Verify the release is public, not private

### "Update available" but download does nothing
- The `.exe` file might be missing from the release
- Check browser console for errors
- Verify `latest.yml` has correct file URLs

## Quick Release Checklist

- [ ] Update version in `package.json`
- [ ] Run `npm run build:win`
- [ ] Create git tag matching version
- [ ] Push tag to GitHub
- [ ] Create GitHub release with tag
- [ ] Upload `2cents Budget Tracker Setup X.X.X.exe`
- [ ] Upload `latest.yml` (CRITICAL!)
- [ ] Publish release (not draft)
- [ ] Test on old version

## Current Setup

- **Repository**: https://github.com/NoahSmiley/2cents
- **Current Version**: 1.0.2
- **Next Version**: 1.0.3 (or whatever you choose)
- **Release Page**: https://github.com/NoahSmiley/2cents/releases

## Example Release Notes

```markdown
## What's New in v1.0.3

### 🎉 New Features
- Added Supabase cloud sync
- Multi-device support with user accounts
- Secure authentication

### 🐛 Bug Fixes
- Fixed scrolling issues
- Fixed window controls

### 📦 Installation
Download and run the installer below.
```
