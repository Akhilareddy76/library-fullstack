📚 Library Management Web Application

A full-stack library application built using React, Spring Boot, MySQL, Docker, Context API, and EmailJS OTP.
Users can browse books, search in real-time, manage wishlists, and reset passwords with OTP verification.


🚀 Features



🔐 Authentication

User Signup & Login

BCrypt password hashing

Session-based authentication using JSESSIONID

Auto logout after 30 minutes

Secure session-check API

Proper backend-protected routes (no userId exposed)


📩 Forgot Password (OTP via EmailJS)


User enters email

Frontend generates a 6-digit OTP

EmailJS sends OTP to user’s Gmail

OTP verified in frontend

User resets password

Backend updates hashed password


📖 Books Module


Home & Browse pages load books from a local JSON file for faster response

Search bar uses OpenLibrary API for real-time results

Book details page shows title, author, description, cover image

Add/Remove books to wishlist


❤️ Favourite Module (Secure)


Add, view, remove wishlist items

Fully session-protected (backend identifies user from session)

No userId passed from frontend

 Favourites stored in MySQL


🐳 Docker Deployment


Backend containerized using Docker

Easy deployment on Render

Ensures same environment everywhere


🌐 Deployment


Frontend deployed on Netlify

Backend deployed on Render (Docker image)

Cookies & credentials properly configured


🛠️ Tech Stack


-> Frontend

React.js

Context API

Axios

EmailJS

CSS / Tailwind

-> Backend

Java

Spring Boot

Spring MVC (REST Controllers)

Spring Data JPA

MySQL/PostgreSql

BCryptPasswordEncoder

Session Authentication


-> Deployment

Docker

Render

Netlify

Git/GitHub


🌐 System Architecture

Frontend (React + Context API)

     │
     │  Axios (withCredentials: true)
     ▼
     
Backend (Spring Boot)

     │  Session (JSESSIONID)
     ▼
     
MySQL Database



🔐 Authentication Flow (Session Based)


User logs in

Backend verifies credentials

Backend stores USER = userId in session

Browser receives JSESSIONID cookie

Every request automatically sends cookie

Backend identifies user using session

Wishlist & other APIs work securely

Session auto-expires in 30 minutes



📩 Forgot Password + OTP Flow (EmailJS)



User enters email

App generates OTP in frontend

EmailJS sends OTP to Gmail

User enters OTP

After verification, user resets password

Backend hashes & updates password in DB


📖 API Endpoints
Auth

Method	Endpoint	Description

POST	/api/signup	Register user

POST	/api/login	Login + create session

POST	/api/logout	Logout (invalidate session)

GET	/api/session-check	Check active session

POST	/api/reset-password	Update password

Wishlist

Method	Endpoint	Description

GET	/api/wishlist/my	Get logged-in user wishlist

POST	/api/wishlist/add	Add book to wishlist

DELETE	/api/wishlist/remove/{bookId}	Remove book


🐳 Docker Commands

Build Docker Image
docker build -t library-backend .

Run Container
docker run -p 8080:8080 library-backend



🧠 What I Learned

Full-stack development using React + Spring Boot

Building secure RESTful APIs with Spring MVC

Session-based authentication (enterprise-level concept)

OTP system using EmailJS

State management using Context API

Designing secure wishlist APIs

Database modeling with MySQL

Dockerizing backend for deployment

Deploying Frontend (Netlify) + Backend (Render)

Handling CORS & cookies in production

## 🌐 Live Demo

### Frontend (Netlify)
https://librarybyakhila.netlify.app/

### Backend (Render)
https://librarybackend-woev.onrender.com


👩‍💻 Author

Akhila
Java Full-Stack Developer
React | Spring Boot | MySQL | Docker | EmailJS | REST APIs
