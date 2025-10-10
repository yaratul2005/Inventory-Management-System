"""
Seed script to populate the database with initial data
Run this script to create sample data for testing
"""
from backend.app import create_app, db
from backend.models import User, Category, Supplier, Product, Transaction

def seed_database():
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        print("Creating users...")
        # Create users
        admin = User(username='admin', email='admin@inventory.com', role='admin')
        admin.set_password('admin123')
        
        staff = User(username='staff', email='staff@inventory.com', role='staff')
        staff.set_password('staff123')
        
        viewer = User(username='viewer', email='viewer@inventory.com', role='viewer')
        viewer.set_password('viewer123')
        
        db.session.add_all([admin, staff, viewer])
        db.session.commit()
        
        print("Creating categories...")
        # Create categories
        electronics = Category(name='Electronics', description='Electronic devices and accessories')
        furniture = Category(name='Furniture', description='Office and home furniture')
        stationery = Category(name='Stationery', description='Office supplies and stationery')
        
        db.session.add_all([electronics, furniture, stationery])
        db.session.commit()
        
        print("Creating suppliers...")
        # Create suppliers
        supplier1 = Supplier(
            name='Tech Supplies Inc',
            contact_info='123 Tech Street, Silicon Valley',
            phone='+1-555-0101',
            email='contact@techsupplies.com'
        )
        
        supplier2 = Supplier(
            name='Furniture World',
            contact_info='456 Furniture Ave, New York',
            phone='+1-555-0202',
            email='sales@furnitureworld.com'
        )
        
        supplier3 = Supplier(
            name='Office Essentials',
            contact_info='789 Office Blvd, Chicago',
            phone='+1-555-0303',
            email='info@officeessentials.com'
        )
        
        db.session.add_all([supplier1, supplier2, supplier3])
        db.session.commit()
        
        print("Creating products...")
        # Create products
        products = [
            Product(name='Laptop', sku='ELEC-001', quantity=50, price=999.99, 
                   low_stock_threshold=10, category_id=electronics.id, supplier_id=supplier1.id),
            Product(name='Wireless Mouse', sku='ELEC-002', quantity=150, price=29.99, 
                   low_stock_threshold=20, category_id=electronics.id, supplier_id=supplier1.id),
            Product(name='USB-C Cable', sku='ELEC-003', quantity=8, price=15.99, 
                   low_stock_threshold=15, category_id=electronics.id, supplier_id=supplier1.id),
            Product(name='Office Desk', sku='FURN-001', quantity=25, price=299.99, 
                   low_stock_threshold=5, category_id=furniture.id, supplier_id=supplier2.id),
            Product(name='Ergonomic Chair', sku='FURN-002', quantity=30, price=199.99, 
                   low_stock_threshold=8, category_id=furniture.id, supplier_id=supplier2.id),
            Product(name='Notebook', sku='STAT-001', quantity=200, price=4.99, 
                   low_stock_threshold=50, category_id=stationery.id, supplier_id=supplier3.id),
            Product(name='Pen Set', sku='STAT-002', quantity=5, price=12.99, 
                   low_stock_threshold=30, category_id=stationery.id, supplier_id=supplier3.id),
        ]
        
        db.session.add_all(products)
        db.session.commit()
        
        print("Creating transactions...")
        # Create sample transactions
        transactions = [
            Transaction(product_id=products[0].id, user_id=admin.id, 
                       action_type='add', quantity=50, notes='Initial stock'),
            Transaction(product_id=products[1].id, user_id=staff.id, 
                       action_type='add', quantity=150, notes='Initial stock'),
            Transaction(product_id=products[2].id, user_id=admin.id, 
                       action_type='remove', quantity=5, notes='Sold to customer'),
        ]
        
        db.session.add_all(transactions)
        db.session.commit()
        
        print("Database seeded successfully!")
        print("\nTest Accounts:")
        print("Admin - username: admin, password: admin123")
        print("Staff - username: staff, password: staff123")
        print("Viewer - username: viewer, password: viewer123")

if __name__ == '__main__':
    seed_database()
