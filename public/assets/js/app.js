import {
  listarProdutos,
  criarProduto,
  editarProduto,
  excluirProdutoAPI,
} from "./produtos.js";

let produtos = [];

$(document).ready(function () {
  carregarProdutos();
  window.abrirModalNovo = abrirModalNovo;
  window.filtrarProdutos = filtrarProdutos;
  window.salvarProduto = salvarProduto;
  window.fecharModalDireto = fecharModalDireto;
  window.fecharModal = fecharModal;
  window.abrirModalEdicao = abrirModalEdicao;
  window.excluirProduto = excluirProduto;
});

function carregarProdutos() {
  listarProdutos(function (res) {
    produtos = Array.isArray(res) ? res : [];
    renderizarTabela(produtos);
  });
}

function renderizarTabela(lista) {
  const corpo = $("#corpoTabela");
  const semResultados = $("#semResultados");

  corpo.empty();

  if (!lista || lista.length === 0) {
    semResultados.removeClass("d-none");
    return;
  }

  semResultados.addClass("d-none");

  lista.forEach((produto, index) => {
    const quantidade = Number(produto.quantidade) || 0;
    const valor = Number(produto.preco) || 0;
    const statusClass =
      quantidade <= 5
        ? "badge-low"
        : quantidade < 20
          ? "badge-med"
          : "badge-ok";
    const statusTexto =
      quantidade <= 5
        ? "Estoque crítico"
        : quantidade < 20
          ? "Estoque médio"
          : "Em estoque";
    const valorFormatado = valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const linha = `
      <tr>
        <td>${index + 1}</td>
        <td><div class="nome-produto">${produto.nome}</div></td>
        <td>${produto.descricao}</td>
        <td>${quantidade}</td>
        <td>${valorFormatado}</td>
        <td><span class="badge-status ${statusClass}">${statusTexto}</span></td>
        <td>
          <button class="btn-acao" onclick="abrirModalEdicao(${produto.id})"><i class="ti ti-pencil"></i>Editar</button>
          <button class="btn-acao excluir" onclick="excluirProduto(${produto.id})"><i class="ti ti-trash"></i>Excluir</button>
        </td>
      </tr>`;

    corpo.append(linha);
  });
}

function salvarProduto() {
  const id = $("#modalId").val();
  const produto = {
    nome: $("#modalNome").val().trim(),
    descricao: $("#modalCategoria").val().trim(),
    quantidade: parseInt($("#modalQtd").val(), 10),
    preco: parseFloat($("#modalValor").val()),
  };

  if (
    !produto.nome ||
    !produto.descricao ||
    Number.isNaN(produto.quantidade) ||
    Number.isNaN(produto.preco)
  ) {
    mostrarToast("Preencha todos os campos");
    return;
  }

  if (id) {
    editarProduto(
      id,
      produto,
      function () {
        mostrarToast("Produto atualizado");
        fecharModalDireto();
        carregarProdutos();
      },
      function (mensagem) {
        mostrarToast(mensagem || "Não foi possível atualizar o produto");
      },
    );
  } else {
    criarProduto(
      produto,
      function () {
        mostrarToast("Produto criado");
        fecharModalDireto();
        carregarProdutos();
      },
      function (mensagem) {
        mostrarToast(mensagem || "Não foi possível criar o produto");
      },
    );
  }
}

function excluirProduto(id) {
  if (!confirm("Tem certeza?")) return;

  excluirProdutoAPI(id, function () {
    mostrarToast("Produto removido");
    carregarProdutos();
  });
}

function filtrarProdutos() {
  const termo = $("#campoBusca").val().toLowerCase();

  const filtrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(termo) ||
      p.descricao.toLowerCase().includes(termo),
  );

  renderizarTabela(filtrados);
}

function abrirModalNovo() {
  $("#modalTitulo").text("Novo Produto");

  $("#modalId").val("");
  $("#modalNome").val("");
  $("#modalCategoria").val("");
  $("#modalQtd").val("");
  $("#modalValor").val("");

  abrirModal();
}

function abrirModalEdicao(id) {
  const produto = produtos.find((p) => p.id === id);
  if (!produto) return;

  $("#modalTitulo").text("Editar Produto");

  $("#modalId").val(produto.id);
  $("#modalNome").val(produto.nome);
  $("#modalCategoria").val(produto.descricao);
  $("#modalQtd").val(produto.quantidade);
  $("#modalValor").val(produto.preco);

  abrirModal();
}

function abrirModal() {
  $("#modalOverlay").addClass("aberto");
  $("#modalNome").focus();
}

function fecharModalDireto() {
  $("#modalOverlay").removeClass("aberto");
}

function fecharModal(event) {
  if (event.target === event.currentTarget) {
    fecharModalDireto();
  }
}

function mostrarToast(mensagem) {
  const toast = $("#toastMsg");
  toast.text(mensagem).addClass("visivel");

  setTimeout(function () {
    toast.removeClass("visivel");
  }, 2500);
}
