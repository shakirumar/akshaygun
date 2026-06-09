# 🐙 GitHub Repository Setup Guide

Follow these simple steps to push your local **Akshaygun** project to a new or existing repository on **GitHub**.

---

## 🛠️ Step 1: Initialize Git in the Project
If you haven't initialized a Git repository in the project root folder yet, open your terminal (PowerShell, Command Prompt, or Git Bash) in `c:\Users\HP\OneDrive\Desktop\akshaygun` and run:

```bash
# Initialize a new Git repository
git init
```

---

## 📝 Step 2: Add Files & Create the Initial Commit
Next, stage all your project files and create a commit.

```bash
# Stage all files (respecting .gitignore rules)
git add .

# Create the initial commit
git commit -m "Initial commit - Akshaygun E-Commerce and Pharma Platform"
```

---

## 🌐 Step 3: Link to GitHub and Push
1. Go to your web browser and navigate to [GitHub](https://github.com).
2. Log in and click **New** to create a new repository.
3. Give your repository a name (e.g. `akshaygun`) and click **Create repository** (do NOT initialize it with README, .gitignore, or license, since they already exist in your folder).
4. Copy the repository URL (it will look like `https://github.com/your-username/akshaygun.git`).
5. Run the following commands in your terminal to link and push your project:

```bash
# Set your branch name to main
git branch -M main

# Link your local project to your GitHub repository (replace with your URL)
git remote add origin https://github.com/your-username/akshaygun.git

# Push the code to the main branch on GitHub
git push -u origin main
```

---

## 🔄 Updating Your Code on GitHub
Whenever you make future changes to your project, you can easily update the code on GitHub using these three commands:

```bash
# 1. Stage the modifications
git add .

# 2. Commit the changes
git commit -m "Updated product image sizing and admin login layouts"

# 3. Push to GitHub
git push
```
