from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app import db
from backend.models import Transaction, Product

transactions_ns = Namespace('transactions', description='Transaction management operations')

transaction_model = transactions_ns.model('Transaction', {
    'product_id': fields.Integer(required=True, description='Product ID'),
    'action_type': fields.String(required=True, description='Action type (add, remove, update)'),
    'quantity': fields.Integer(required=True, description='Quantity'),
    'notes': fields.String(description='Transaction notes')
})

@transactions_ns.route('/')
class TransactionList(Resource):
    @jwt_required()
    @transactions_ns.doc('list_transactions', security='Bearer')
    def get(self):
        """List all transactions"""
        transactions = Transaction.query.order_by(Transaction.timestamp.desc()).all()
        return [transaction.to_dict() for transaction in transactions], 200
    
    @jwt_required()
    @transactions_ns.expect(transaction_model)
    @transactions_ns.doc('create_transaction', security='Bearer')
    def post(self):
        """Create a new transaction"""
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        product = Product.query.get(data['product_id'])
        if not product:
            return {'message': 'Product not found'}, 404
        
        action_type = data['action_type']
        quantity = data['quantity']
        
        # Update product quantity based on action type
        if action_type == 'add':
            product.quantity += quantity
        elif action_type == 'remove':
            if product.quantity < quantity:
                return {'message': 'Insufficient stock'}, 400
            product.quantity -= quantity
        
        transaction = Transaction(
            product_id=data['product_id'],
            user_id=current_user_id,
            action_type=action_type,
            quantity=quantity,
            notes=data.get('notes', '')
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return transaction.to_dict(), 201

@transactions_ns.route('/<int:id>')
class TransactionDetail(Resource):
    @jwt_required()
    @transactions_ns.doc('get_transaction', security='Bearer')
    def get(self, id):
        """Get transaction by ID"""
        transaction = Transaction.query.get(id)
        if not transaction:
            return {'message': 'Transaction not found'}, 404
        return transaction.to_dict(), 200

@transactions_ns.route('/product/<int:product_id>')
class ProductTransactions(Resource):
    @jwt_required()
    @transactions_ns.doc('get_product_transactions', security='Bearer')
    def get(self, product_id):
        """Get all transactions for a specific product"""
        transactions = Transaction.query.filter_by(product_id=product_id).order_by(Transaction.timestamp.desc()).all()
        return [transaction.to_dict() for transaction in transactions], 200
