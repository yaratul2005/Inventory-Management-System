from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from backend.app import db
from backend.models import Category

categories_ns = Namespace('categories', description='Category management operations')

category_model = categories_ns.model('Category', {
    'name': fields.String(required=True, description='Category name'),
    'description': fields.String(description='Category description')
})

@categories_ns.route('/')
class CategoryList(Resource):
    @jwt_required()
    @categories_ns.doc('list_categories', security='Bearer')
    def get(self):
        """List all categories"""
        categories = Category.query.all()
        return [category.to_dict() for category in categories], 200
    
    @jwt_required()
    @categories_ns.expect(category_model)
    @categories_ns.doc('create_category', security='Bearer')
    def post(self):
        """Create a new category"""
        data = request.get_json()
        
        if Category.query.filter_by(name=data['name']).first():
            return {'message': 'Category already exists'}, 400
        
        category = Category(
            name=data['name'],
            description=data.get('description', '')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return category.to_dict(), 201

@categories_ns.route('/<int:id>')
class CategoryDetail(Resource):
    @jwt_required()
    @categories_ns.doc('get_category', security='Bearer')
    def get(self, id):
        """Get category by ID"""
        category = Category.query.get(id)
        if not category:
            return {'message': 'Category not found'}, 404
        return category.to_dict(), 200
    
    @jwt_required()
    @categories_ns.expect(category_model)
    @categories_ns.doc('update_category', security='Bearer')
    def put(self, id):
        """Update a category"""
        category = Category.query.get(id)
        if not category:
            return {'message': 'Category not found'}, 404
        
        data = request.get_json()
        category.name = data.get('name', category.name)
        category.description = data.get('description', category.description)
        
        db.session.commit()
        return category.to_dict(), 200
    
    @jwt_required()
    @categories_ns.doc('delete_category', security='Bearer')
    def delete(self, id):
        """Delete a category"""
        category = Category.query.get(id)
        if not category:
            return {'message': 'Category not found'}, 404
        
        if category.products:
            return {'message': 'Cannot delete category with products'}, 400
        
        db.session.delete(category)
        db.session.commit()
        
        return {'message': 'Category deleted successfully'}, 200
