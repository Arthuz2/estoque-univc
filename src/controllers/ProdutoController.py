from flask import Blueprint, jsonify, request
from src.exceptions import NaoEncontradoError, ValidacaoError
from src.services.ProdutoService import ProdutoService

produto_bp = Blueprint("produto", __name__)
_service = ProdutoService()

@produto_bp.route("/", methods=["GET"])
def listar():
    return jsonify([p.to_dict() for p in _service.listar()]), 200

@produto_bp.route("/<int:id>", methods=["GET"])
def buscar(id):
    try:
        return jsonify(_service.buscar(id).to_dict()), 200
    except NaoEncontradoError:
        return jsonify({"erro": "Produto não encontrado"}), 404

@produto_bp.route("/", methods=["POST"])
def criar():
    dados = request.get_json(silent=True)
    if not dados:
        return jsonify({"erro": "Corpo da requisição inválido ou ausente"}), 400
    try:
        return jsonify(_service.criar(dados).to_dict()), 201
    except ValidacaoError as e:
        return jsonify({"erro": str(e)}), 400

@produto_bp.route("/<int:id>", methods=["PUT"])
def atualizar(id):
    dados = request.get_json(silent=True)
    if not dados:
        return jsonify({"erro": "Corpo da requisição inválido ou ausente"}), 400
    try:
        return jsonify(_service.atualizar(id, dados).to_dict()), 200
    except NaoEncontradoError:
        return jsonify({"erro": "Produto não encontrado"}), 404
    except ValidacaoError as e:
        return jsonify({"erro": str(e)}), 400

@produto_bp.route("/<int:id>", methods=["DELETE"])
def deletar(id):
    try:
        _service.deletar(id)
        return jsonify({"mensagem": "Produto removido com sucesso"}), 200
    except NaoEncontradoError:
        return jsonify({"erro": "Produto não encontrado"}), 404
