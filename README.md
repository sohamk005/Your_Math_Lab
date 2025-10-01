Your Math Lab 🧪 
An interactive, web-based mathematics laboratory for solving equations, visualizing curves, performing calculus, matrix operations, and more. This repository is a monorepo containing both the React frontend and the Python/Flask backend.

[➡️ Live Demo Coming Soon! ⬅️]

(---)

📚 Introduction
"Your Math Lab" is a comprehensive single-page application designed to make mathematics more accessible and interactive. It provides a suite of powerful tools for students, educators, and enthusiasts to explore mathematical concepts visually.

This project is structured as a monorepo, with the frontend and backend codebases living in the same repository but decoupled for independent operation and deployment.

✨ Features
Equation Solvers: Quadratic, Cubic, and a powerful General Polynomial Solver.

Calculus Toolkit: Symbolic differentiation and integration with visualizations.

Curve Plotters: General, Rose Curve, and Parametric plotters for creating beautiful mathematical art.

Linear Algebra: A full Matrix Calculator for addition, subtraction, and multiplication.

Interactive Visualizations: All graphs feature dynamic zooming, panning, and an "infinite canvas" feel.

Usability: Download graphs as PNGs, enjoy a fully responsive design, and navigate seamlessly with react-router-dom.

🛠️ Tech Stack
Frontend (/frontend):

Framework: React 18 with Vite

Styling: Tailwind CSS

Routing: react-router-dom

Visualizations: Chart.js & chartjs-plugin-zoom

Backend (/backend):

Framework: Python with Flask

Numerical & Symbolic Math: NumPy, SymPy

Production Server: Gunicorn

🚀 Getting Started Locally
To run this project, you must start both the backend and frontend servers in two separate terminals from the root directory.

Backend Setup
# 1. Navigate into the backend directory
cd backend

# 2. (Recommended) Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install the required packages
pip install -r requirements.txt

# 4. Run the Flask server
python app.py
# The backend will now be running at [http://12.0.0.1:5000](http://12.0.0.1:5000)

Frontend Setup
# 1. In a new terminal, navigate into the frontend directory
cd frontend

# 2. Install the required npm packages
npm install

# 3. Run the React development server
npm run dev
# The frontend will now be running at http://localhost:5173

☁️ Deployment
This project is deployed as two separate services from this single monorepo:

The Backend is deployed on Render.

Root Directory: backend

Build Command: pip install -r requirements.txt

Start Command: gunicorn app:app

The Frontend is deployed on Netlify.

Base directory: frontend

Build command: npm run build

Publish directory: frontend/dist

Credit
This project was created and developed by Soham.