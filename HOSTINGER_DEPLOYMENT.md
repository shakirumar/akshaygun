# 🌐 Hostinger Deployment Guide - Akshaygun E-Commerce & Pharma Platform

This guide outlines how to deploy the full-stack **Akshaygun** e-commerce and pharmaceutical platform (Vite React frontend, Node/Express backend, MongoDB database) to **Hostinger**.

Since Hostinger offers two main types of hosting, choose the option that matches your subscription:
- **Option A (Recommended): Hostinger VPS** (provides root access, full custom Node.js execution, and local MongoDB installation).
- **Option B: Hostinger Cloud/Shared Hosting** (managed hosting with Hostinger Node.js Application Selector + cloud-hosted database like MongoDB Atlas).

---

## ⚙️ Prerequisites for Deployment

Regardless of the hosting option, make sure you configure your environment keys:
1. **JWT Secret**: A secure random string for signing admin tokens.
2. **Owner Email & SMTP Settings**: Gmail, Hostinger Webmail, or Ethereal credentials for sending order confirmations.
3. **Razorpay Credentials** (Optional, if processing live UPI/Card payments): Razorpay Key ID and Secret Key.

---

## 💻 Option A: Deploying on Hostinger VPS (Virtual Private Server)

This is the standard hosting choice for full-stack Node.js + MongoDB apps.

### Step 1: Connect to your VPS via SSH
Open your terminal/command prompt and run:
```bash
ssh root@your_vps_ip_address
```
*(Enter your VPS password when prompted).*

### Step 2: Install Node.js, PM2, and MongoDB
Run the following commands on your Ubuntu VPS to set up the environment:
```bash
# Update package lists
sudo apt update && sudo apt upgrade -y

# Install Node.js (Version 18 or 20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager to run Node.js in the background)
sudo npm install -y -g pm2

# Install MongoDB Community Edition
sudo apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt-get install -y mongodb-org

# Start and enable MongoDB services
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 3: Clone the Code and Install Dependencies
On the VPS, navigate to the folder where you want to place the project (e.g., `/var/www/akshaygun`):
```bash
mkdir -p /var/www/akshaygun
cd /var/www/akshaygun

# Clone your repository or upload project files here.
# Inside /var/www/akshaygun, you should see both "frontend" and "backend" directories.

# Install Backend Dependencies
cd backend
npm install --production

# Install Frontend Dependencies and Build the Production Assets
cd ../frontend
npm install
# Note: Set your backend API URL for the build
VITE_API_BASE_URL="https://yourdomain.com/api" npm run build
```

### Step 4: Configure Backend Environment Variables
Create a `.env` file inside the `backend` folder:
```bash
nano /var/www/akshaygun/backend/.env
```
Paste the following configurations (update with your actual production credentials):
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/akshaygun
JWT_SECRET=your_super_secret_jwt_key_here

# Email SMTP Setup (Gmail or Hostinger Webmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-from-google
OWNER_EMAIL=usdglobalweb@gmail.com

# Razorpay Credentials (if using online payments)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```
*(Press `Ctrl + O` then `Enter` to save, and `Ctrl + X` to exit).*

### Step 5: Start the Backend using PM2
Start the backend server in the background and configure it to auto-restart on system boots:
```bash
cd /var/www/akshaygun/backend
pm2 start server.js --name "akshaygun-backend"
pm2 save
pm2 startup
```

### Step 6: Configure Nginx Reverse Proxy & SSL (HTTPS)
Install and configure Nginx to route traffic to the React frontend (built files) and backend API:
```bash
sudo apt install -y nginx

# Edit Nginx default configuration
sudo nano /etc/nginx/sites-available/default
```
Replace the content of the file with:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend React Static Files
    location / {
        root /var/www/akshaygun/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend Express API Proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Validate Nginx syntax and reload the server:
```bash
sudo nginx -t
sudo systemctl restart nginx
```
Secure your domain with an SSL Certificate (HTTPS) using Let's Encrypt / Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ☁️ Option B: Deploying on Hostinger Shared / Cloud Hosting (cPanel)

Shared hosting plans don't let you install MongoDB locally or run terminal processes in the background forever. To run full-stack here, you must use **MongoDB Atlas** (cloud-hosted database) and Hostinger's built-in **Node.js Selector** app manager.

### Step 1: Create a Free Database on MongoDB Atlas
1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Free Cluster (M0 tier) located in your preferred region.
3. In **Network Access**, add IP Address `0.0.0.0/0` (allows connections from Hostinger's dynamic shared servers).
4. Under **Database Access**, create a user with read/write permissions.
5. Copy your connection string (looks like `mongodb+srv://username:password@cluster.mongodb.net/akshaygun?retryWrites=true&w=majority`).

### Step 2: Build the Frontend Locally
Hostinger shared servers cannot compile React assets (Vite build) due to memory limits. Build the site on your local computer first:
1. Open your frontend `.env` configuration or build variables and set:
   `VITE_API_BASE_URL="https://yourdomain.com/api"`
2. Inside the `/frontend` directory on your computer, run:
   ```bash
   npm run build
   ```
3. This creates a `/frontend/dist` folder. Zip this folder or keep it ready for uploading.

### Step 3: Create the Node.js Application in Hostinger panel
1. Log in to your Hostinger hPanel.
2. Search for the **Node.js** icon or go to **Websites** > **Manage** > **Advanced** > **Node.js**.
3. Click **Create Application** and fill out the details:
   - **App Directory**: `backend` (or similar subdirectory).
   - **Domain**: Choose your domain.
   - **Node.js Version**: Select 18 or 20.
   - **Application Startup File**: `server.js`
4. Click **Save/Create**.

### Step 4: Upload Backend Files via File Manager
1. Go to Hostinger **File Manager**.
2. Open the directory corresponding to your Node.js application (e.g. `/domains/yourdomain.com/backend` or `/backend`).
3. Upload all files from the `backend` folder (except the `node_modules` folder).
4. Create a `.env` file in that folder and paste your configurations:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/akshaygun?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   OWNER_EMAIL=usdglobalweb@gmail.com
   ```

### Step 5: Upload Built Frontend to `public_html`
1. Navigate to the `/public_html` directory in Hostinger File Manager.
2. Upload all files from your locally built `frontend/dist` folder directly into `public_html`.
3. To support React Router page reloads, create a file named `.htaccess` in the `public_html` folder and paste this configuration:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteCond %{REQUEST_FILENAME} !-l
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Step 6: Install Backend Dependencies and Run
1. Go back to Hostinger's Node.js application panel.
2. Look for the **Run npm install** button or command line window.
3. Click **Run npm install** to download all dependencies.
4. Click **Start App** or **Restart App**.
5. Your application is now live! Go to your domain to verify.

---

## 🛠️ Troubleshooting & Server Management

### Viewing Server Logs (VPS)
If something goes wrong with the backend, check PM2 logs:
```bash
pm2 logs akshaygun-backend
```

### Seeding Products Manually (VPS)
If you need to re-seed the products catalog:
```bash
cd /var/www/akshaygun/backend
npm run seed
```

### CORS Issues
If frontend requests fail with a CORS warning, verify that `CORS_ORIGIN` in the backend `.env` matches your exact site domain:
```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```
