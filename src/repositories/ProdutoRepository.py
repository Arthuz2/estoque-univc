from src import db
from src.entity.Produto import Produto

class ProdutoRepository:
    def find_all(self) -> list[Produto]:
        return Produto.query.all()

    def find_by_id(self, id: int) -> Produto | None:
        return db.session.get(Produto, id)

    def save(self, produto: Produto) -> Produto:
        db.session.add(produto)
        db.session.commit()
        return produto

    def delete(self, produto: Produto) -> None:
        db.session.delete(produto)
        db.session.commit()
