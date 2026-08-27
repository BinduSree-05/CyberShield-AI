from flask import Flask
from flask_cors import CORS

from config import Config
from models import db

from routes.analyzer import analyzer_bp
from routes.history import history_bp

app = Flask(__name__)

app.config.from_object(Config)

db.init_app(app)

CORS(app)

app.register_blueprint(analyzer_bp, url_prefix="/api")
app.register_blueprint(history_bp, url_prefix="/api")

@app.route("/")
def home():
    return {
        "project": "CyberShield AI",
        "status": "Backend Running"
    }

@app.route("/api/health")
def health():
    return {
        "success": True,
        "message": "Backend Connected Successfully!"
    }

with app.app_context():
    from models.scan import Scan
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)