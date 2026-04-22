# PlacementEcosystem: Smart Campus Recruitment Platform

A comprehensive, full-stack placement management system built with the **MERN Stack** (MongoDB, Express, React, Node.js). This platform streamlines the recruitment lifecycle for both students and the Career Development Cell (CDC) through data-driven insights and real-time automation.

---

## Key Features

### For Students
- **ATS Checker **: Upload your resume (PDF/DOCX) and get an instant AI-powered compatibility score based on target roles.
- **Mock Test Arena **: Practice with 180+ technical and aptitude questions across 6 domains with real-time performance analytics.
- **Skill Gap Analysis **: Compare your current skill set against industry standard templates (SDE, Data Science) to identify missing competencies.
- **Unified Profile **: Manage your academic records, skills, and application history in a premium "Glassmorphism" UI.

### 🏢 For CDC / Admins
- **Centralized Dashboard **: Monitor placement trends, average CTC, and branch-wise performance using interactive charts.
- **Student Database **: Advanced filtering for students based on CGPA, backlogs, branch, and eligibility status.
- **Job Management **: Create, edit, and track job listings with automated eligibility checking for students.
- **Real-Time Notifications **: Instantly notify students of application status updates via WebSockets.

---

##  Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Recharts, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose (ODM) |
| **Security** | JSON Web Tokens (JWT), BcryptJS |
| **Real-time** | Socket.io |
| **File Parsing**| Multer, PDF-Parse, Mammoth |

---

##  Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local instance or Atlas Cloud URI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GM-10/WebTechProject.git
   cd PLacementprojectwebtech
   ```

2. **Backend Setup:**
   ```bash
   cd backend-node
   npm install
   # Create a .env file based on .env.example
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **One-Click Launch (Windows):**
   Run the `start-dev.bat` or `start-dev.ps1` in the root directory to launch both services simultaneously.

---

##  Project Structure

```text
├── backend-node/
│   ├── middleware/      # Auth & Permission verification
│   ├── models/          # Mongoose DB Schemas
│   ├── routes/          # API Endpoints (Auth, Jobs, Profile)
│   ├── utils/           # Eligibility & Logic Engines
│   └── server.js        # Entry Point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI elements (Layout, Navbar)
│   │   ├── hooks/       # Custom hooks (useTheme)
│   │   ├── pages/       # Page components (Profile, MockTests)
│   │   └── utils/       # API config & shared logic
│   └── index.html       # UI Entry Point
└── README.md            # You are here!
```

---

##  Security & Optimization
- **JWT Authentication**: Secure stateless authentication for all private routes.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `student`, `cdc`, and `admin` roles.
- **Virtual DOM**: Optimized UI updates using React's efficiency.
- **Glassmorphism UI**: Modern, premium aesthetics using CSS Backdrop Filters.

---

##  Contribution
This project was developed for the Web Technology course. 
Developed by: Grishma Makwana, Divija Kavishvar, Dhruv Rajpurohit and Krushang Makwana
