# 🌍 Cloud Deployment Guide

This guide explains how to take the **AI Job Recommendation System** out of localhost and deploy it as a production-level Startup application using highly scalable and popular cloud platforms.

## Overview
Our Application consists of:
1. **Frontend**: A React.js static bundle (Vercel is perfect)
2. **Backend**: Python FastAPI with Machine Learning Libraries (Render or AWS App Runner is ideal)
3. **Database**: MongoDB (MongoDB Atlas is the perfect Free-Tier Cloud DB)

---

## 1. Deploy the Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free tier cluster.
2. In 'Network Access', allow IP `0.0.0.0/0` (access from anywhere) so our cloud backend can speak to it seamlessly.
3. In 'Database Access', create a new user with a secure password.
4. Go to **Connect > Connect your application** and copy the resulting `mongodb+srv://...` URI.

---

## 2. Deploy the Backend (Render)
Render makes deploying Python apps with heavy dependencies (like `spaCy` and `sentence-transformers`) exceptionally easy.

1. Go to [Render.com](https://render.com) and connect your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select your push of this repository.
4. **Configuration Settings:**
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt && pip install -r ai_requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables:**
   - `MONGODB_URL`: *<Your MongoDB Atlas Cluster URI>*
   - `SECRET_KEY`: *<A secure random string for JWT Tokens>*
6. **Click Deploy**. Render will automatically provision a URL (e.g., `https://ai-jobs-api.onrender.com`).

> **Scale Note on AWS**: If you move out of the prototype phase, deploying the `backend/` utilizing Docker onto **AWS ECS / Fargate** or **AWS App Runner** is recommended due to the heavy memory requirements of the `sentence-transformers` Machine Learning embeddings.

---

## 3. Deploy the Frontend (Vercel)
Vercel is natively built for React and Vite, meaning we can push our beautiful Tailwind UX live in 60 seconds.

1. Go to [Vercel.com](https://vercel.com) and connect your GitHub.
2. Click **Add New Project** and select this repository.
3. **Configuration Settings:**
   - **Root Directory:** Edit this to explicitly be `frontend/`
   - **Framework Preset:** `Vite`
   - Vercel automatically detects `npm run build` as the Build Command.
4. **Environment Variables:**
   - `VITE_API_URL`: *<The Render.com URL generated in Step 2>* `(e.g., https://ai-jobs-api.onrender.com/api/v1)`
5. **Click Deploy.** 

## 🎉 You're Live!
Your users can now visit your Vercel URL, upload their resumes effortlessly via our Glassmorphism Dashboard, and get AI-curated Job matches instantly computed by your secure Python cloud layer and MongoDB Atlas cluster.
