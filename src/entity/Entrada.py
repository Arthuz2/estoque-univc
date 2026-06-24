from src.entity.Movimentacao import Movimentacao

class Entrada(Movimentacao):
    __mapper_args__ = {"polymorphic_identity": "entrada"}

    def aplicar(self, produto) -> None:
        produto.quantidade += self.quantidade

    def descricao(self) -> str:
        return f"Entrada de {self.quantidade} unidade(s)"
