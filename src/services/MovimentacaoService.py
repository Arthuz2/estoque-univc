from src.exceptions import NaoEncontradoError, ValidacaoError
from src.entity.Movimentacao import Movimentacao
from src.repositories.MovimentacaoRepository import MovimentacaoRepository
from src.repositories.ProdutoRepository import ProdutoRepository
from src.entity import Entrada, Saida

_TIPOS = {"entrada": Entrada, "saida": Saida}

class MovimentacaoService:
    def __init__(self):
        self.repository = MovimentacaoRepository()
        self.produto_repository = ProdutoRepository()

    def registrar(self, tipo: str, dados: dict) -> Movimentacao:
        self._validar(dados)

        cls = _TIPOS.get(tipo)
        if not cls:
            raise ValidacaoError(f"Tipo inválido: '{tipo}'. Use 'entrada' ou 'saida'")

        produto = self.produto_repository.find_by_id(dados["produto_id"])
        if not produto:
            raise NaoEncontradoError(f"Produto {dados['produto_id']} não encontrado")

        mov = cls(
            produto_id=produto.id,
            quantidade=dados["quantidade"],
            observacao=dados.get("observacao", ""),
        )
        mov.aplicar(produto)
        return self.repository.save(mov, produto)

    def listar(self) -> list[Movimentacao]:
        return self.repository.find_all()

    def listar_por_produto(self, produto_id: int) -> list[Movimentacao]:
        if not self.produto_repository.find_by_id(produto_id):
            raise NaoEncontradoError(f"Produto {produto_id} não encontrado")
        return self.repository.find_by_produto(produto_id)

    def _validar(self, dados: dict) -> None:
        faltando = [c for c in ("produto_id", "quantidade") if dados.get(c) is None]
        if faltando:
            raise ValidacaoError(f"Campos obrigatórios ausentes: {', '.join(faltando)}")
