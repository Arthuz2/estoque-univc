from src.entity.Movimentacao import Movimentacao
from src.exceptions import ValidacaoError

class Saida(Movimentacao):
    __mapper_args__ = {"polymorphic_identity": "saida"}

    def aplicar(self, produto) -> None:
        if produto.quantidade < self.quantidade:
            raise ValidacaoError(
                f"Estoque insuficiente: disponível {produto.quantidade}, solicitado {self.quantidade}"
            )
        produto.quantidade -= self.quantidade

    def descricao(self) -> str:
        return f"Saída de {self.quantidade} unidade(s)"
