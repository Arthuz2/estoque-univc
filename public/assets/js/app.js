let produtos = [];

// =====================
// INICIALIZA
// =====================
$(document).ready(function () {
  carregarProdutos();
});

// =====================
// CARREGAR TABELA
// =====================
function carregarProdutos() {

  listarProdutos(function(res) {
    produtos = res;
    renderizarTabela(produtos);
  });

}

// =====================
// SALVAR (CRIAR / EDITAR)
// =====================
function salvarProduto() {

  const id = $("#modalId").val();

  const produto = {
    nome: $("#modalNome").val(),
    categoria: $("#modalCategoria").val(),
    quantidade: parseInt($("#modalQtd").val()),
    valor: parseFloat($("#modalValor").val())
  };

  if (!produto.nome || !produto.categoria) {
    mostrarToast("Preencha todos os campos");
    return;
  }

  // EDITAR
  if (id) {

    editarProduto(id, produto, function () {
      mostrarToast("Produto atualizado");
      fecharModalDireto();
      carregarProdutos();
    });

  }
  // CRIAR
  else {

    criarProduto(produto, function () {
      mostrarToast("Produto criado");
      fecharModalDireto();
      carregarProdutos();
    });

  }

}

// =====================
// EXCLUIR
// =====================
function excluirProduto(id) {

  if (!confirm("Tem certeza?")) return;

  excluirProdutoAPI(id, function () {
    mostrarToast("Produto removido");
    carregarProdutos();
  });

}

// =====================
// FILTRO
// =====================
function filtrarProdutos() {

  const termo = $("#campoBusca").val().toLowerCase();

  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(termo) ||
    p.categoria.toLowerCase().includes(termo)
  );

  renderizarTabela(filtrados);

}

// =====================
// MODAL NOVO
// =====================
function abrirModalNovo() {

  $("#modalTitulo").text("Novo Produto");

  $("#modalId").val("");
  $("#modalNome").val("");
  $("#modalCategoria").val("");
  $("#modalQtd").val("");
  $("#modalValor").val("");

  abrirModal();

}

// =====================
// MODAL EDITAR
// =====================
function abrirModalEdicao(id) {

  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  $("#modalTitulo").text("Editar Produto");

  $("#modalId").val(produto.id);
  $("#modalNome").val(produto.nome);
  $("#modalCategoria").val(produto.categoria);
  $("#modalQtd").val(produto.quantidade);
  $("#modalValor").val(produto.valor);

  abrirModal();

}