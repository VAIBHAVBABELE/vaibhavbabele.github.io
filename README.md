# 🚀 Nitra Mitra

> **Nitra Mitra** is an **open-source student initiative** from NITRA Technical Campus, Ghaziabad aimed at **simplifying academic and non-academic life** for students.  
From **syllabus tracking** to **AI-powered study tools**, and from **event management** to **career guidance**, everything resides under one open, collaborative platform.

---

## 📚 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Contribution Guidelines](#-contribution-guidelines)
- [Contributors](#-contributors)
- [License](#-license)

---

## 👨🏫 About

**Nitra Mitra** empowers students with:
- **Academic utilities** like syllabus tracking, attendance logs, and subject wikis  
- **AI-powered tools** for study assistance and summarization  
- **Community features** for college events, clubs, announcements, and a student marketplace  
- **Career growth resources** like job boards, skill trackers, and mock test modules  

It is **built by students, for students**, and welcomes open-source contributions from beginners to pros.

---

## 🌟 Features

### 📘 Academic Support
- 🧾 **Syllabus Tracker** – Upload & view syllabus (PHP, MySQL)
- 📈 **Attendance Monitor** – Manual & automated tracking (PHP, JS, MySQL)
- 📘 **Subject Wiki** – Community-curated subject pages (Markdown + PHP + MySQL)
- 🧪 **Lab Report Templates** – Submit & download lab formats (PDF, PHP, MySQL)

### 🏠 Non-Academic / PG Support
- 📌 **Notice Board** – College/PG announcements (PHP, MySQL, JS)
- 🛒 **Marketplace** – Buy/sell books & accessories (PHP, MySQL, Bootstrap)
- 🧹 **Service Rating** – Tiffin/laundry ratings (PHP, MySQL)
- 📦 **Lost & Found Portal** – Report and claim lost items (PHP, Bootstrap)

### 🧠 Technical & Project Help
- 🔍 **Open Source Opportunities** – GitHub API integration (PHP)
- 💻 **IDE Recommendation** – Suggest tools by project type (PHP, JS)
- 🧾 **Documentation Templates** – Quick README/LICENSE generator
- 🔐 **Version Control Tips** – Git tutorials & cheatsheets

### 🎉 Community & Events
- 📸 **Photo Gallery** – Event photo uploads (Cloudinary, PHP, JS)
- 🗣️ **Club Portal** – Manage/join clubs (PHP, MySQL, Bootstrap)
- 🏆 **Leaderboard** – Competition rankings (PHP, JS, MySQL)
- 📺 **Live Sessions** – Embedded YouTube/Zoom recordings

### 🤖 AI-Powered Features
- 🧠 **AI Study Assistant** – Q&A chat (Python, Flask, AI APIs)
- 📄 **AI Summary Tool** – Intelligent summarization
- 🔤 **Text Summarization** – Extract insights from notes
- 📁 **File Processing** – Read & summarize PDFs, TXT, MD
- ❓ **Question Generation** – Auto-generate practice questions
- ✨ **Notes Enhancement** – Smarter, extended note prep

### 🎓 Career & Growth
- 🧑💼 **Job Board** – Off-campus job postings
- 🎯 **Skill Tracker** – Track skill progress (PHP, Chart.js)
- 📈 **Mock Test Section** – MCQs with scoring
- 🗂️ **Career Resource Library** – Preparation docs & guides

### 🛠️ Utility & Enhancements
- 🌙 **Dark Mode** – Better nighttime UX
- 🌐 **Multi-language Support** – Localized UI
- 🧑🎓 **Student Dashboard** – Centralized hub
- 🔔 **Push Notifications** – OneSignal or JS polling

---

## 🖼 Screenshots

### 🏠 Home Page
![Home Page](images/home%20page.png)

### 📌 Our Services
![Our Services](https://github.com/user-attachments/assets/d9fe8710-2dc1-40ce-88f2-77d7a35c81d7)

### 📚 Resources
![Resources](https://github.com/user-attachments/assets/2768bbe4-9426-40f5-9ee5-22ad7de46828)

### 📝 Notes
![Notes](https://github.com/user-attachments/assets/9fcff10b-c90d-43c7-84c4-468030ce51ca)

### 🖼 Gallery
![Gallery](images/Gallery.png)

### 📢 Announcement
![Announcement](images/Student%20Announcement.png)

### 💬 User Experience
![User Experience](images/User%20Experience.png)

### 👥 Creator Page
![Creator](images/About.png)

### 🏆 PR Contributions
![PR Introduction](images/PR%20Introduction.png)  
![Top Contributors](images/Top%20Contributors.png)  
![Merged PRs](images/Merged%20PRs.png)  
![Certificate](images/Certificate%20exp.png)

### 📜 Footer
![Footer](https://github.com/user-attachments/assets/cce591a4-a95a-40af-bfa7-4d182d263db1)

---

## 🖥 Tech Stack

| **Frontend** | **Backend** | **Database** | **AI / ML** | **APIs** |
|--------------|-------------|--------------|-------------|----------|
| HTML, CSS, JS | PHP (Laravel), Python Flask | MySQL | Python, Flask, AI APIs | GitHub API, OpenAI API, OneSignal |

---

## 🛠 Getting Started

1. Fork the repository
2. Clone your fork
``` git clone https://github.com/<your-username>/nitra-mitra.git ```

3. Enter project folder
``` cd nitra-mitra ```

4. For PHP local setup (XAMPP/WAMP)
Move project to htdocs or www and visit:
http://localhost/nitra-mitra/

5. Add upstream for updates
```
git remote add upstream https://github.com/<original-owner>/nitra-mitra.git
git fetch upstream
git rebase upstream/main
```
---

## 📁 Project Structure 

```
├── .github/                      # GitHub workflows and automation
│   └── update-leaderboard.yml
├── backend/                      # Backend logic and integrations
├── docs/                         # Auto-generated contribution logs
├── favicon/                      # Favicon assets
├── games/                        # Game-related HTML/CSS/JS files
├── images/                       # Static images (e.g., logos, UI assets)
├── js/                           # JavaScript enhancements and features
├── node_modules/                 # Node dependencies
│
├── pages/                        # Main standalone HTML pages
│   ├── assistant.*               # AI Assistant UI (HTML/CSS/JS/ Setup instructions/Assistant usage guide)
│   ├── certificate.*             # Certificate  (HTML/CSS/JS)
│   ├── summary.*                 # summary  (HTML/CSS/JS)
│   ├── pr-contribution           # pr-contribution (HTML/CSS/JS)
│   ├── 404.html
│   ├── announcement-table.html
│   ├── cgpa-calculator.html
│   ├── contact.html
│   ├── cursor.css                   # Snake trail cursor 
│   ├── cursor.js                    # Snake trail cursor animation
│   ├── floating-button.*            # Floating button styles and logic
│   ├── floating-button.*            # Floating button styles and logic
│   ├── footer.css                   # Footer styling
│   ├── gateway.html
│   ├── infrastructure.html
│   ├── quantum.html
│   ├── resorces.html
│   ├── subject.html
│   ├── gallery.html
│   ├── paper.html
│   ├── paper.css
│   ├── privacy.html
│   ├── privacy.css
│   ├── terms.html
│   ├── team.css
│   ├── test.html
│   └── user-experience-table.html
│
├── .gitignore                    # Git ignore rules
├── .htaccess / .htaccess.backup # Server configuration files
├── CNAME                        # Custom domain setup
├── eslint.config.js             # ESLint configuration
├── index.html                     # Landing page 
├── index.css                      # Landing page 
├── index.js                       # Landing page 
├── LICENSE                      # Project license
├── README.md                    # Project overview and instructions
├── CONTRIBUTION.md              # Contribution guidelines
├── CODE_OF_CONDUCT.md           # Contributor behavior rules
├── DEPLOYMENT.md                # Deployment instructions
├── CONTACT_FORM_SETUP.md        # Contact form integration guide
├── SECURITY_IMPROVEMENTS.md     # Security enhancement documentation
├── PR_DESCRIPTION_FINAL.md      # Final PR description template
├── MERGED_PRS.md                # Auto-updated list of merged PRs
├── LEADERBOARD.md               # Auto-updated contributor leaderboard
├── package.json                 # Project metadata and scripts
└── package-lock.json            # Dependency lock file


```
---

## 🤝 Contribution Guidelines
We welcome **frontend, backend, AI, and design** contributions.  
See [CONTRIBUTION.md](CONTRIBUTION.md) for details.

---

## 📜 License
Licensed under the [MIT License](LICENSE).

---
## ⭐ Support

If you find this project helpful, please give it a star! ⭐

---

<div align="center" >
  " Made with ❤️ by NITra MITra "
</div>
