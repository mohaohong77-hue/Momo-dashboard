# Momo Dashboard ✨

A truly transparent, borderless, and lightweight desktop dashboard built for personal productivity. Designed to blend seamlessly into your desktop wallpaper.

Built with **Tauri** (Rust), **React**, and **Tailwind CSS**.

## Features 🚀

- **Extreme Transparency**: No window borders, titles, or backgrounds. Feels like native desktop widgets.
- **Draggable Cards**: Freely drag the widgets anywhere on your screen.
- **Always on Top**: Keeps your tasks and subscriptions visible at a glance.
- **Modular Design**:
  - **Subscriptions (Top Left)**: Track monthly/yearly software subscriptions and calculate budgets.
  - **Urgent DDL (Bottom Left)**: Auto-sorting tasks by deadline to keep you focused.
  - **Plan Board (Center)**: Minimalist notepad for "Today" and "Tomorrow".
  - **Dev Board (Right)**: Dedicated feature/bugfix checklist for developers.

## Automated Cloud Build ☁️ (Recommended)

You don't need a local development environment to get the `.exe`! This repository is equipped with a **GitHub Actions** workflow. 

1. Go to your GitHub repository page.
2. Click the **Actions** tab.
3. Select the **Release** workflow on the left.
4. Click **Run workflow**. 
5. Wait a few minutes, and GitHub will automatically compile the `.exe` for you and attach it to the **Releases** page on the right sidebar!

## Local Development 💻

If you want to modify the code and preview it locally, you will need:
- [Node.js](https://nodejs.org/) (v16+)
- [Rust](https://rustup.rs/)

**Setup:**
```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run tauri dev

# 3. Build the local .exe
npm run tauri build
```

## Troubleshooting 🛠️

- **The background is black instead of transparent!**
  Go to Windows Settings > Personalization > Colors, and ensure **Transparency effects** is toggled ON.
- **I can't type in the inputs!**
  The dragging region has been properly decoupled. Ensure your mouse cursor is exactly over the input box before clicking.

## License
MIT License
