from src.exceptions import NaoEncontradoError, ValidacaoError
from src.entity.Produto import Produto
from src.repositories.ProdutoRepository import ProdutoRepository

class ProdutoService:
    def __init__(self):
        self.repository = ProdutoRepository()

    def listar(self) -> list[Produto]:
        return self.repository.find_all()

    def buscar(self, id: int) -> Produto:
        produto = self.repository.find_by_id(id)
        if not produto:
            raise NaoEncontradoError(f"Produto {id} não encontrado")
        return produto

    def criar(self, dados: dict) -> Produto:
        self._validar(dados, obrigatorios=["nome", "preco"])
        produto = Produto(
            nome=dados["nome"],
            preco=dados["preco"],
            descricao=dados.get("descricao", ""),
            quantidade=dados.get("quantidade", 0),
        )
        return self.repository.save(produto)

    def atualizar(self, id: int, dados: dict) -> Produto:
        produto = self.buscar(id)
        for campo in ("nome", "descricao", "preco", "quantidade"):
            if campo in dados:
                setattr(produto, campo, dados[campo])
        return self.repository.save(produto)

    def deletar(self, id: int) -> None:
        produto = self.buscar(id)
        self.repository.delete(produto)

    def _validar(self, dados: dict, obrigatorios: list[str]) -> None:
        faltando = [c for c in obrigatorios if dados.get(c) is None]
        if faltando:
            raise ValidacaoError(f"Campos obrigatórios ausentes: {', '.join(faltando)}")
