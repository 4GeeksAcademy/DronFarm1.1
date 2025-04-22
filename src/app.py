import os
import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api import mail
from api.utils import APIException, generate_sitemap
from api.models.models import db
from api.routes.user_routes import user as user_blueprint
from api.routes.plot_routes import fields as fields_blueprint
from api.routes.quote_routes import quote
from api.routes.report_routes import report_routes
from api.admin import setup_admin
from api.commands import setup_commands

# === CONFIG FLASK ===
app = Flask(__name__)
ENV = os.getenv("FLASK_DEBUG", "0")
app.config['ENV'] = "development" if ENV == "1" else "production"

# === CONFIG CORS CORREGIDO === ✅
CORS(app, resources={r"/*": {
    "origins": [
        "https://special-space-halibut-r4pxpqgvpw75fpjx7-3000.app.github.dev", 
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "*"  # Durante desarrollo, acepta cualquier origen
    ],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin', '')
    response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# === CONFIG FLASK-MAIL ===
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'dronfarm.mail@gmail.com'
app.config['MAIL_PASSWORD'] = 'bxgbafplmfduumdh'
app.config['MAIL_DEFAULT_SENDER'] = 'DronFarm'
mail.init_app(app)

# === CONFIG DB ===
db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# === JWT CONFIG ===
app.config["JWT_SECRET_KEY"] = "yenesey-programando"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=1)
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"
jwt = JWTManager(app)

# === BLUEPRINTS ===
app.register_blueprint(user_blueprint, url_prefix="/user")
app.register_blueprint(fields_blueprint, url_prefix="/fields")
app.register_blueprint(quote, url_prefix="/quote")
app.register_blueprint(report_routes, url_prefix="/report_routes")

# === ADMIN Y COMANDOS ===
setup_admin(app)
setup_commands(app)

# === RUTAS DE ARCHIVOS ESTÁTICOS ===
STATIC_DIR = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/')

@app.route('/')
def root():
    if app.config['ENV'] == "development":
        return generate_sitemap(app)
    return send_from_directory(STATIC_DIR, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_file(path):
    if not os.path.isfile(os.path.join(STATIC_DIR, path)):
        path = 'index.html'
    response = send_from_directory(STATIC_DIR, path)
    response.cache_control.max_age = 0
    return response

@app.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    upload_folder = os.path.join(app.root_path, 'uploads')
    return send_from_directory(upload_folder, filename)

@app.route('/download/<path:filename>')
def download_file(filename):
    upload_folder = os.path.join(app.root_path, 'uploads')
    return send_from_directory(upload_folder, filename, as_attachment=True)

# === ERROR HANDLER ===
@app.errorhandler(APIException)
def handle_api_error(error):
    return jsonify(error.to_dict()), error.status_code

# === MOSTRAR RUTAS AL INICIAR ===
with app.app_context():
    print("\n🔎 RUTAS REGISTRADAS EN FLASK:")
    for rule in app.url_map.iter_rules():
        print(f"{rule} → métodos: {','.join(rule.methods)}")
    print("🔚 FIN DE RUTAS\n")

# === MAIN ===
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)