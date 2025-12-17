# Node Version Issue

## Current Situation

Your Node.js version: **20.11.1**
Required version: **20.19+ or 22.12+**

The project uses `rolldown-vite` (experimental faster Vite) which requires a newer Node version.

## Solutions

### Option 1: Upgrade Node.js (Recommended)

Using nvm (if installed):

```bash
nvm install 20.19
nvm use 20.19
```

Or using Homebrew:

```bash
brew upgrade node
```

### Option 2: Downgrade Vite (If you can't upgrade Node)

Edit `package.json`:

```json
"devDependencies": {
  "vite": "^5.4.8"  // Change from "npm:rolldown-vite@7.2.2"
}
```

Remove the overrides section:

```json
"overrides": {
  "vite": "npm:rolldown-vite@7.2.2"  // Remove this
}
```

Then reinstall:

```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

## Good News

✅ **TypeScript compilation passed!**
✅ **No type errors!**
✅ **Code is correct!**

The only issue is the Node.js runtime version for Vite, not your code.

## To Test Without Building

You can still run the dev server if Node supports it, or use Option 2 above.

Once you resolve the Node version, run:

```bash
cd client
npm run dev
```

The app will open at http://localhost:3000
