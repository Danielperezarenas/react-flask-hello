"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    # Lógica para consultar si el ususuario existe en la DB.
    user = User.query.filter_by(email=email).first()
    if not email or not password:
        return jsonify({"msg": "Bad username or password"}), 401
    data_serialize = user.serialize()
    response_body['results'] = {"user": user.serialize()}
    response_body['access_token'] = create_access_token(identity=[email])
    return response_body, 200


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@api.route("/private", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    if current_user[2]:
        print("El valor es True")
    response_body = {}
    response_body['results'] = current_user
    response_body['message'] = "Mostramos el perfil del usuario"
    return response_body, 200


@api.route('/singup', methods=['POST'])
def signup():
    response_body = {}
    data = request.json
    user = User(email = data.get('email'),
                password = data.get('password'),
                is_active = True)
    existing_user = db.session.execute(db.select(User).where(User.email == user.email)).scalar()
    if existing_user:
        return jsonify({"message": "Usuario existente"}), 401
    new_user = User(email = data['email'],
                    password = data['password'],
                    is_active = data['is_active'])
    db.session.add(new_user)
    db.session.commit()
    new_user_id = new_user.id
    response_body['results'] = {"user": new_user.serialize()}
    response_body['message'] = "Usuario creado"
    access_token = create_access_token(identity=[new_user.serialize()])
    response_body['access_token'] = access_token
    return response_body, 200


# @api.route("/logout", methods=["POST"])
# @jwt_required()
# def handle_logout():
#     # Access the identity of the current user with get_jwt_identity
#     current_user = get_jwt_identity()
#     response_body = {}
#     response_body['results'] = current_user
#     response_body['message'] = "Mostramos el perfil del usuario"
#     return response_body, 200