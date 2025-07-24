# 📰 Newspaper App

A full-stack web application designed for publishing and managing news articles and trending events. Built with **Node.js**, **Express**, **MongoDB**, and **EJS**, the platform allows authenticated users to post, edit, and delete news listings, while visitors can browse and read articles.

---

## 📌 Features

- 🔐 **User Authentication**
  - Sign in/out functionality for publishers
  - Access control using custom middleware

- 📝 **News Management**
  - Create, edit, delete news posts
  - Upload and display images using `multer`

- 🧑‍💼 **Publisher System**
  - Each post is linked to a specific user (publisher)
  - Admin-style editing permissions per post

- 🌐 **Public-Facing Interface**
  - Home and category-based news browsing
  - Trending/featured stories

- 🗂️ **Comments (Optional)**
  - Readers can comment on articles *(if enabled)*

---

## ⚙️ Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** EJS Templates, Bootstrap 5
- **Database:** MongoDB with Mongoose ODM
- **File Uploads:** Multer
- **Authentication:** Express-session, Custom Middleware
- **Templating Engine:** EJS

---

## 📁 Folder Structure

