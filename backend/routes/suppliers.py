from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from backend.app import db
from backend.models import Supplier

suppliers_ns = Namespace('suppliers', description='Supplier management operations')

supplier_model = suppliers_ns.model('Supplier', {
    'name': fields.String(required=True, description='Supplier name'),
    'contact_info': fields.String(description='Contact information'),
    'phone': fields.String(description='Phone number'),
    'email': fields.String(description='Email address')
})

@suppliers_ns.route('/')
class SupplierList(Resource):
    @jwt_required()
    @suppliers_ns.doc('list_suppliers', security='Bearer')
    def get(self):
        """List all suppliers"""
        suppliers = Supplier.query.all()
        return [supplier.to_dict() for supplier in suppliers], 200
    
    @jwt_required()
    @suppliers_ns.expect(supplier_model)
    @suppliers_ns.doc('create_supplier', security='Bearer')
    def post(self):
        """Create a new supplier"""
        data = request.get_json()
        
        if Supplier.query.filter_by(name=data['name']).first():
            return {'message': 'Supplier already exists'}, 400
        
        supplier = Supplier(
            name=data['name'],
            contact_info=data.get('contact_info', ''),
            phone=data.get('phone', ''),
            email=data.get('email', '')
        )
        
        db.session.add(supplier)
        db.session.commit()
        
        return supplier.to_dict(), 201

@suppliers_ns.route('/<int:id>')
class SupplierDetail(Resource):
    @jwt_required()
    @suppliers_ns.doc('get_supplier', security='Bearer')
    def get(self, id):
        """Get supplier by ID"""
        supplier = Supplier.query.get(id)
        if not supplier:
            return {'message': 'Supplier not found'}, 404
        return supplier.to_dict(), 200
    
    @jwt_required()
    @suppliers_ns.expect(supplier_model)
    @suppliers_ns.doc('update_supplier', security='Bearer')
    def put(self, id):
        """Update a supplier"""
        supplier = Supplier.query.get(id)
        if not supplier:
            return {'message': 'Supplier not found'}, 404
        
        data = request.get_json()
        supplier.name = data.get('name', supplier.name)
        supplier.contact_info = data.get('contact_info', supplier.contact_info)
        supplier.phone = data.get('phone', supplier.phone)
        supplier.email = data.get('email', supplier.email)
        
        db.session.commit()
        return supplier.to_dict(), 200
    
    @jwt_required()
    @suppliers_ns.doc('delete_supplier', security='Bearer')
    def delete(self, id):
        """Delete a supplier"""
        supplier = Supplier.query.get(id)
        if not supplier:
            return {'message': 'Supplier not found'}, 404
        
        if supplier.products:
            return {'message': 'Cannot delete supplier with products'}, 400
        
        db.session.delete(supplier)
        db.session.commit()
        
        return {'message': 'Supplier deleted successfully'}, 200
