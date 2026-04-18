# Habit Tracker 

A full-stack web application designed to help users build and maintain consistent routines. Built with the MERN stack, it allows users to define custom habits, track daily and weekly progress, and maintain completion streaks through an intuitive, responsive interface.

## 🚀 Features
* **User Authentication:** Secure sign-up and login functionality.
* **Comprehensive Dashboard:** View, add, edit, and delete daily routines.
* **Smart Calendar Views:** Toggle between Daily and Weekly tracking modes to visualize progress.
* **Streak Tracking:** Automated streak counters that update immediately upon habit completion to encourage consistency.
* **Customization:** Color-coded habit categories and an integrated Dark/Light mode toggle.

## 🛠️ Tech Stack
* **Frontend:** React.js, CSS (Flexbox/Grid for responsive design)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose

## ⚙️ Local Setup & Installation

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker
\`\`\`

**2. Install Dependencies**
You will need to install modules for both the server and the client.
\`\`\`bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
\`\`\`

**3. Environment Variables**
Create a `.env` file in the `backend` directory and add your MongoDB connection string and port:
\`\`\`env
MONGO_URI=your_mongodb_connection_string
PORT=3000
\`\`\`

**4. Run the Application**
Open two terminal windows:

*Terminal 1 (Backend):*
\`\`\`bash
cd backend
node server.js
\`\`\`

*Terminal 2 (Frontend):*
\`\`\`bash
cd frontend
npm start
\`\`\`
