from flask import Flask
from flask_restx import Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
import os

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///inventory.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize API with Swagger documentation
    api = Api(
        app,
        version='1.0',
        title='Inventory Management API',
        description='A comprehensive REST API for managing inventory, products, categories, suppliers, and transactions',
        doc='/api/docs',
        prefix='/api'
    )
    
    # Register namespaces
    from backend.routes.auth import auth_ns
    from backend.routes.products import products_ns
    from backend.routes.categories import categories_ns
    from backend.routes.suppliers import suppliers_ns
    from backend.routes.transactions import transactions_ns
    from backend.routes.users import users_ns
    
    api.add_namespace(auth_ns, path='/auth')
    api.add_namespace(products_ns, path='/products')
    api.add_namespace(categories_ns, path='/categories')
    api.add_namespace(suppliers_ns, path='/suppliers')
    api.add_namespace(transactions_ns, path='/transactions')
    api.add_namespace(users_ns, path='/users')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
