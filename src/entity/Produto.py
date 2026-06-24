from datetime import datetime, timezone
from src import db


class Produto(db.Model):
    __tablename__ = "produtos"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.String(255), default="")
    preco = db.Column(db.Float, nullable=False)
    quantidade = db.Column(db.Integer, default=0)
    criado_em = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    atualizado_em = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def __init__(self, nome: str, preco: float, descricao: str = "", quantidade: int = 0):
        self.nome = nome
        self.preco = preco
        self.descricao = descricao
        self.quantidade = quantidade

    def esta_disponivel(self) -> bool:
        return self.quantidade > 0

    def aplicar_desconto(self, percentual: float) -> float:
        return round(self.preco * (1 - percentual / 100), 2)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao,
            "preco": self.preco,
            "quantidade": self.quantidade,
            "disponivel": self.esta_disponivel(),
            "criado_em": self.criado_em.isoformat(),
            "atualizado_em": self.atualizado_em.isoformat(),
        }
