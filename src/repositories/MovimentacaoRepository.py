from src import db
from src.entity.Movimentacao import Movimentacao

class MovimentacaoRepository:
    def find_all(self) -> list[Movimentacao]:
        return Movimentacao.query.order_by(Movimentacao.criado_em.desc()).all()

    def find_by_produto(self, produto_id: int) -> list[Movimentacao]:
        return Movimentacao.query.filter_by(produto_id=produto_id).all()

    def save(self, movimentacao: Movimentacao, produto) -> Movimentacao:
        db.session.add(movimentacao)
        db.session.add(produto)
        db.session.commit()
        return movimentacao
