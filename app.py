from flask import Flask
from config import Config
from models import db
from routes import routes

def create_app():
    app = Flask(__name__,static_folder=r'C:\\Users\\Affaan Jaweed\\Desktop\\expenset\\static',template_folder=r"C:\\Users\\Affaan Jaweed\\Desktop\\expenset\\templates")
    
   
    app.config.from_object(Config)
    
    
    db.init_app(app)

    app.register_blueprint(routes)
    
    return app