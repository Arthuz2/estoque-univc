import os
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

PUBLIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public")

def create_app():
    app = Flask(__name__, static_folder=PUBLIC_DIR, static_url_path="")
    app.config.from_object("config.Config")

    db.init_app(app)
    migrate.init_app(app, db)

    from src.entity import Produto, Movimentacao, Entrada, Saida

    from src.controllers.ProdutoController import produto_bp
    from src.controllers.MovimentacaoController import movimentacao_bp
    app.register_blueprint(produto_bp, url_prefix="/api/produtos")
    app.register_blueprint(movimentacao_bp, url_prefix="/api/movimentacoes")

    @app.route("/", methods=["GET"])
    def index():
        return send_from_directory(app.static_folder, "index.html")

    return app
