from flask import Blueprint, jsonify, request
from src.exceptions import NaoEncontradoError, ValidacaoError
from src.services.MovimentacaoService import MovimentacaoService

movimentacao_bp = Blueprint("movimentacao", __name__)
_service = MovimentacaoService()


@movimentacao_bp.route("/", methods=["GET"])
def listar():
    return jsonify([m.to_dict() for m in _service.listar()]), 200


@movimentacao_bp.route("/produto/<int:produto_id>", methods=["GET"])
def listar_por_produto(produto_id):
    try:
        return jsonify([m.to_dict() for m in _service.listar_por_produto(produto_id)]), 200
    except NaoEncontradoError:
        return jsonify({"erro": "Produto não encontrado"}), 404


@movimentacao_bp.route("/entrada", methods=["POST"])
def entrada():
    dados = request.get_json(silent=True)
    if not dados:
        return jsonify({"erro": "Corpo da requisição inválido ou ausente"}), 400
    try:
        return jsonify(_service.registrar("entrada", dados).to_dict()), 201
    except NaoEncontradoError:
        return jsonify({"erro": "Produto não encontrado"}), 404
    except ValidacaoError as e:
        return jsonify({"erro": str(e)}), 400


@movimentacao_bp.route("/saida", methods=["POST"])
def saida():
    dados = request.get_json(silent=True)
    if not dados:
        return jsonify({"erro": "Corpo da requisição inválido ou ausente"}), 400
    try:
        return jsonify(_service.registrar("saida", dados).to_dict()), 201
    except NaoEncontradoError:
        return jsonify({"erro": "Produto não encontrado"}), 404
    except ValidacaoError as e:
        return jsonify({"erro": str(e)}), 400
