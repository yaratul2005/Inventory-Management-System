from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app import db
from backend.models import Product, Transaction, User

products_ns = Namespace('products', description='Product management operations')

# Models for Swagger documentation
product_model = products_ns.model('Product', {
    'name': fields.String(required=True, description='Product name'),
    'sku': fields.String(required=True, description='Stock Keeping Unit'),
    'quantity': fields.Integer(required=True, description='Quantity in stock'),
    'price': fields.Float(required=True, description='Product price'),
    'low_stock_threshold': fields.Integer(description='Low stock alert threshold', default=10),
    'category_id': fields.Integer(required=True, description='Category ID'),
    'supplier_id': fields.Integer(required=True, description='Supplier ID')
})

@products_ns.route('/')
class ProductList(Resource):
    @jwt_required()
    @products_ns.doc('list_products', security='Bearer')
    def get(self):
        """List all products"""
        products = Product.query.all()
        return [product.to_dict() for product in products], 200
    
    @jwt_required()
    @products_ns.expect(product_model)
    @products_ns.doc('create_product', security='Bearer')
    def post(self):
        """Create a new product"""
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        if Product.query.filter_by(sku=data['sku']).first():
            return {'message': 'SKU already exists'}, 400
        
        product = Product(
            name=data['name'],
            sku=data['sku'],
            quantity=data['quantity'],
            price=data['price'],
            low_stock_threshold=data.get('low_stock_threshold', 10),
            category_id=data['category_id'],
            supplier_id=data['supplier_id']
        )
        
        db.session.add(product)
        db.session.commit()
        
        # Log transaction
        transaction = Transaction(
            product_id=product.id,
            user_id=current_user_id,
            action_type='add',
            quantity=data['quantity'],
            notes='Initial product creation'
        )
        db.session.add(transaction)
        db.session.commit()
        
        return product.to_dict(), 201

@products_ns.route('/<int:id>')
class ProductDetail(Resource):
    @jwt_required()
    @products_ns.doc('get_product', security='Bearer')
    def get(self, id):
        """Get product by ID"""
        product = Product.query.get(id)
        if not product:
            return {'message': 'Product not found'}, 404
        return product.to_dict(), 200
    
    @jwt_required()
    @products_ns.expect(product_model)
    @products_ns.doc('update_product', security='Bearer')
    def put(self, id):
        """Update a product"""
        product = Product.query.get(id)
        if not product:
            return {'message': 'Product not found'}, 404
        
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        old_quantity = product.quantity
        
        product.name = data.get('name', product.name)
        product.sku = data.get('sku', product.sku)
        product.quantity = data.get('quantity', product.quantity)
        product.price = data.get('price', product.price)
        product.low_stock_threshold = data.get('low_stock_threshold', product.low_stock_threshold)
        product.category_id = data.get('category_id', product.category_id)
        product.supplier_id = data.get('supplier_id', product.supplier_id)
        
        db.session.commit()
        
        # Log transaction if quantity changed
        if old_quantity != product.quantity:
            transaction = Transaction(
                product_id=product.id,
                user_id=current_user_id,
                action_type='update',
                quantity=product.quantity - old_quantity,
                notes='Product quantity updated'
            )
            db.session.add(transaction)
            db.session.commit()
        
        return product.to_dict(), 200
    
    @jwt_required()
    @products_ns.doc('delete_product', security='Bearer')
    def delete(self, id):
        """Delete a product"""
        product = Product.query.get(id)
        if not product:
            return {'message': 'Product not found'}, 404
        
        db.session.delete(product)
        db.session.commit()
        
        return {'message': 'Product deleted successfully'}, 200

@products_ns.route('/low-stock')
class LowStockProducts(Resource):
    @jwt_required()
    @products_ns.doc('get_low_stock_products', security='Bearer')
    def get(self):
        """Get products with low stock"""
        products = Product.query.all()
        low_stock_products = [p.to_dict() for p in products if p.is_low_stock]
        return low_stock_products, 200
