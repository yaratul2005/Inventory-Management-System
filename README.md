<div align="center">

# 📦 Inventory Management System

### *A Modern Full-Stack Solution for Business Inventory Control*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)**

---

</div>

## 🌟 Overview

A comprehensive, production-ready **Inventory Management System** designed for businesses to efficiently track products, manage stock levels, monitor transactions, and control user access. Built with modern technologies and best practices, this system provides a seamless experience for inventory operations.

### ✨ Key Highlights

- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 📊 **Real-time Analytics** - Interactive dashboards with charts and insights
- 🎯 **Smart Alerts** - Automatic low-stock notifications
- 📱 **Responsive Design** - Beautiful dark-themed UI that works everywhere
- 🚀 **RESTful API** - Well-documented API with Swagger/OpenAPI
- 🔄 **Transaction Logging** - Complete audit trail of all stock movements
- 👥 **Multi-user Support** - Admin, Staff, and Viewer roles

---

## 🎯 Features

<table>
<tr>
<td width="50%">

### 🎨 Frontend Features
- ✅ Modern Next.js 15 with App Router
- ✅ Server & Client Components
- ✅ TypeScript for type safety
- ✅ Tailwind CSS v4 styling
- ✅ shadcn/ui component library
- ✅ Recharts data visualization
- ✅ Responsive mobile-first design
- ✅ Dark theme interface
- ✅ Real-time data updates

</td>
<td width="50%">

### ⚙️ Backend Features
- ✅ Flask REST API with Flask-RESTX
- ✅ SQLAlchemy ORM
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Swagger/OpenAPI documentation
- ✅ Transaction logging
- ✅ Stock validation
- ✅ Database seeding scripts
- ✅ CORS enabled

</td>
</tr>
</table>

### 📋 Core Modules

| Module | Description | Access Level |
|--------|-------------|--------------|
| **Dashboard** | Overview analytics, charts, and low-stock alerts | All Users |
| **Products** | Complete CRUD operations with SKU tracking | Staff, Admin |
| **Categories** | Organize products into categories | Staff, Admin |
| **Suppliers** | Manage supplier information and contacts | Staff, Admin |
| **Transactions** | Track all stock movements (add/remove/update) | Staff, Admin |
| **Users** | User management and role assignment | Admin Only |

---

## 🚀 Demo

### 📸 Screenshots

<div align="center">

| Dashboard | Products Management |
|-----------|---------------------|
| *Real-time analytics and insights* | *Complete product CRUD operations* |

| Transaction Logs | User Management |
|------------------|-----------------|
| *Detailed stock movement history* | *Role-based user control* |

</div>

### 🔑 Test Accounts

After running the seed script, use these credentials:

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| 👑 **Admin** | `admin` | `admin123` | Full system access |
| 👨‍💼 **Staff** | `staff` | `staff123` | Manage inventory |
| 👁️ **Viewer** | `viewer` | `viewer123` | Read-only access |

---

## 🛠️ Tech Stack

<div align="center">

### Frontend Technologies

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend Technologies

![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

### DevOps & Tools

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **Python** 3.11+
- **pip** (Python package manager)
- **Git**

### 🔧 Backend Setup

\`\`\`bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 6. Initialize database with seed data
python seed_data.py

# 7. Run Flask server
python app.py
\`\`\`

✅ Backend running at: `http://localhost:5000`  
📚 API Documentation: `http://localhost:5000/api/docs`

### 🎨 Frontend Setup

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API URL

# 3. Run development server
npm run dev
\`\`\`

✅ Frontend running at: `http://localhost:3000`

### 🐳 Docker Deployment (Recommended)

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
\`\`\`

---

## 📁 Project Structure

\`\`\`
inventory-management-system/
│
├── 🎨 Frontend (Next.js)
│   ├── app/
│   │   ├── dashboard/          # Main dashboard
│   │   ├── products/           # Product management
│   │   ├── categories/         # Category management
│   │   ├── suppliers/          # Supplier management
│   │   ├── transactions/       # Transaction logs
│   │   ├── users/             # User management
│   │   ├── login/             # Authentication
│   │   └── register/          # User registration
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── dashboard-layout.tsx
│   │   ├── protected-route.tsx
│   │   └── ...
│   │
│   └── lib/
│       ├── api.ts             # API client
│       ├── auth-context.tsx   # Auth provider
│       └── utils.ts
│
├── ⚙️ Backend (Flask)
│   ├── app.py                 # Flask application
│   ├── models.py              # Database models
│   ├── routes/
│   │   ├── auth.py           # Authentication
│   │   ├── products.py       # Product endpoints
│   │   ├── categories.py     # Category endpoints
│   │   ├── suppliers.py      # Supplier endpoints
│   │   ├── transactions.py   # Transaction endpoints
│   │   └── users.py          # User endpoints
│   │
│   ├── seed_data.py          # Database seeding
│   └── requirements.txt
│
├── 🐳 Docker
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
└── 📚 Documentation
    ├── README.md
    └── SETUP_INSTRUCTIONS.md
\`\`\`

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/refresh` | Refresh JWT token | ✅ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Product Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/products` | List all products | All |
| POST | `/api/products` | Create product | Staff, Admin |
| GET | `/api/products/<id>` | Get product details | All |
| PUT | `/api/products/<id>` | Update product | Staff, Admin |
| DELETE | `/api/products/<id>` | Delete product | Admin |
| GET | `/api/products/low-stock` | Low stock alerts | All |

### Category Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/categories` | List categories | All |
| POST | `/api/categories` | Create category | Staff, Admin |
| PUT | `/api/categories/<id>` | Update category | Staff, Admin |
| DELETE | `/api/categories/<id>` | Delete category | Admin |

### Supplier Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/suppliers` | List suppliers | All |
| POST | `/api/suppliers` | Create supplier | Staff, Admin |
| PUT | `/api/suppliers/<id>` | Update supplier | Staff, Admin |
| DELETE | `/api/suppliers/<id>` | Delete supplier | Admin |

### Transaction Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/transactions` | List transactions | All |
| POST | `/api/transactions` | Create transaction | Staff, Admin |
| GET | `/api/transactions/<id>` | Get transaction | All |
| GET | `/api/transactions/product/<id>` | Product history | All |

### User Endpoints (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/<id>` | Get user details |
| PUT | `/api/users/<id>` | Update user |
| DELETE | `/api/users/<id>` | Delete user |

📖 **Full API Documentation**: Available at `http://localhost:5000/api/docs` (Swagger UI)

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

\`\`\`env
# Flask Configuration
SECRET_KEY=your-super-secret-key-change-this
JWT_SECRET_KEY=your-jwt-secret-key-change-this
FLASK_ENV=development

# Database
DATABASE_URL=sqlite:///inventory.db

# CORS (for development)
CORS_ORIGINS=http://localhost:3000
\`\`\`

### Frontend Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

---

## 🧪 Testing

### Backend Tests

\`\`\`bash
cd backend
pytest tests/ -v
\`\`\`

### Frontend Tests

\`\`\`bash
npm run test
\`\`\`

---

## 🚢 Deployment

### Deploy Frontend to Vercel

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### Deploy Backend

**Option 1: Railway**
1. Push code to GitHub
2. Connect repository to Railway
3. Set environment variables
4. Deploy automatically

**Option 2: Render**
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn app:app`

**Option 3: Heroku**
\`\`\`bash
heroku create your-app-name
git push heroku main
\`\`\`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Creator & Credits

<div align="center">

### **YA RATUL**

**Computer Science & Engineering Student**

🎓 **University**: National University Bangladesh  
🏛️ **College**: Institute of Science and Technology, Dhanmondi  
💼 **Field**: Computer Science & Engineering (CSE)

---

### Connect & Support

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yaratul)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yaratul)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:yaratul@example.com)

---

### 🌟 If you found this project helpful, please give it a star!

[![Star this repo](https://img.shields.io/github/stars/yaratul/inventory-management-system?style=social)](https://github.com/yaratul/inventory-management-system)

</div>

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Flask Community** - For the lightweight Python web framework
- **shadcn/ui** - For the beautiful component library
- **Vercel** - For hosting and deployment platform
- **Open Source Community** - For inspiration and support

---

## 📞 Support

If you encounter any issues or have questions:

- 📧 **Email**: ratul41g@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yaratul/inventory-management-system/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yaratul/inventory-management-system/discussions)

---

<div align="center">

**Made with ❤️ by YA RATUL**

*Building the future, one line of code at a time*

⭐ **Star this repository if you find it useful!** ⭐

</div>
