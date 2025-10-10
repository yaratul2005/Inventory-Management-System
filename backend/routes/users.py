from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app import db
from backend.models import User

users_ns = Namespace('users', description='User management operations')

user_model = users_ns.model('User', {
    'username': fields.String(required=True, description='Username'),
    'email': fields.String(required=True, description='Email address'),
    'role': fields.String(required=True, description='User role (admin, staff, viewer)')
})

def admin_required():
    """Decorator to check if user is admin"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return user and user.role == 'admin'

@users_ns.route('/')
class UserList(Resource):
    @jwt_required()
    @users_ns.doc('list_users', security='Bearer')
    def get(self):
        """List all users (Admin only)"""
        if not admin_required():
            return {'message': 'Admin access required'}, 403
        
        users = User.query.all()
        return [user.to_dict() for user in users], 200

@users_ns.route('/<int:id>')
class UserDetail(Resource):
    @jwt_required()
    @users_ns.doc('get_user', security='Bearer')
    def get(self, id):
        """Get user by ID"""
        user = User.query.get(id)
        if not user:
            return {'message': 'User not found'}, 404
        return user.to_dict(), 200
    
    @jwt_required()
    @users_ns.expect(user_model)
    @users_ns.doc('update_user', security='Bearer')
    def put(self, id):
        """Update user (Admin only)"""
        if not admin_required():
            return {'message': 'Admin access required'}, 403
        
        user = User.query.get(id)
        if not user:
            return {'message': 'User not found'}, 404
        
        data = request.get_json()
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.role = data.get('role', user.role)
        
        db.session.commit()
        return user.to_dict(), 200
    
    @jwt_required()
    @users_ns.doc('delete_user', security='Bearer')
    def delete(self, id):
        """Delete user (Admin only)"""
        if not admin_required():
            return {'message': 'Admin access required'}, 403
        
        user = User.query.get(id)
        if not user:
            return {'message': 'User not found'}, 404
        
        db.session.delete(user)
        db.session.commit()
        
        return {'message': 'User deleted successfully'}, 200
