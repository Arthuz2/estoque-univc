from datetime import datetime, timezone
from src import db

class Movimentacao(db.Model):
    __tablename__ = "movimentacoes"
    __mapper_args__ = {"polymorphic_on": "tipo", "polymorphic_identity": "movimentacao"}

    id = db.Column(db.Integer, primary_key=True)
    produto_id = db.Column(db.Integer, db.ForeignKey("produtos.id"), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    tipo = db.Column(db.String(20), nullable=False)
    observacao = db.Column(db.String(255), default="")
    criado_em = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    produto = db.relationship("Produto", backref="movimentacoes")

    def __init__(self, produto_id: int, quantidade: int, observacao: str = ""):
        self.produto_id = produto_id
        self.quantidade = quantidade
        self.observacao = observacao

    def aplicar(self, produto) -> None:
        raise NotImplementedError

    def descricao(self) -> str:
        raise NotImplementedError

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "tipo": self.tipo,
            "produto_id": self.produto_id,
            "quantidade": self.quantidade,
            "descricao": self.descricao(),
            "observacao": self.observacao,
            "criado_em": self.criado_em.isoformat(),
        }
