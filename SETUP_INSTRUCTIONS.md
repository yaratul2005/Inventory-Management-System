# Quick Setup Guide

## Prerequisites

- Python 3.8+ installed
- Node.js 18+ installed
- pip and npm/yarn installed

## Backend Setup (Flask API)

1. **Navigate to backend directory:**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Create virtual environment:**
   \`\`\`bash
   python -m venv venv
   
   # Activate on Windows:
   venv\Scripts\activate
   
   # Activate on Mac/Linux:
   source venv/bin/activate
   \`\`\`

3. **Install dependencies:**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Set up environment variables:**
   \`\`\`bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and set your values (or use defaults for development)
   \`\`\`

5. **Initialize database and seed data:**
   \`\`\`bash
   # Run the seed script to create test users and sample data
   python seed_data.py
   \`\`\`

6. **Start the Flask server:**
   \`\`\`bash
   python app.py
   \`\`\`

   The API will be available at `http://localhost:5000`
   Swagger docs at `http://localhost:5000/api/docs`

## Frontend Setup (Next.js)

1. **Install dependencies:**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   # Copy the example file
   cp .env.local.example .env.local
   \`\`\`

3. **Configure API URL in .env.local:**
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   \`\`\`

4. **Start the development server:**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

   The app will be available at `http://localhost:3000`

## Test Accounts

After running the seed script, you can login with:

- **Admin:** username: `admin`, password: `admin123`
- **Staff:** username: `staff`, password: `staff123`
- **Viewer:** username: `viewer`, password: `viewer123`

## Troubleshooting

### Login Failed Error

If you see "Cannot connect to backend server":
1. Make sure the Flask backend is running on port 5000
2. Check that NEXT_PUBLIC_API_URL is set correctly in .env.local
3. Verify the backend is accessible at http://localhost:5000/api/docs

### CORS Errors

The Flask backend is configured to allow all origins in development. If you still see CORS errors:
1. Check that Flask-CORS is installed: `pip install flask-cors`
2. Restart the Flask server

### Database Errors

If you see database errors:
1. Delete the `inventory.db` file
2. Run `python seed_data.py` again to recreate the database

## Docker Setup (Optional)

To run both frontend and backend with Docker:

\`\`\`bash
docker-compose up --build
\`\`\`

This will start:
- Flask backend on port 5000
- Next.js frontend on port 3000
- PostgreSQL database on port 5432
