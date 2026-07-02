import {
  listarProdutos,
  criarProduto,
  editarProduto,
  excluirProdutoAPI,
} from "./produtos.js";
import {
  entradaEstoque,
  saidaEstoque,
  movimentacoesPorProduto,
} from "./movimentacao.js";

let produtos = [];
let tipoMov = "entrada";

$(document).ready(function () {
  carregarProdutos();
  window.abrirModalNovo = abrirModalNovo;
  window.filtrarProdutos = filtrarProdutos;
  window.salvarProduto = salvarProduto;
  window.fecharModalDireto = fecharModalDireto;
  window.fecharModal = fecharModal;
  window.abrirModalEdicao = abrirModalEdicao;
  window.excluirProduto = excluirProduto;
  window.abrirModalMov = abrirModalMov;
  window.setTipoMov = setTipoMov;
  window.registrarMov = registrarMov;
  window.fecharModalMov = fecharModalMov;
  window.fecharModalMovDireto = fecharModalMovDireto;
  window.abrirModalHist = abrirModalHist;
  window.fecharModalHist = fecharModalHist;
  window.fecharModalHistDireto = fecharModalHistDireto;
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
          <button class="btn-acao" onclick="abrirModalMov(${produto.id})"><i class="ti ti-arrows-exchange"></i>Movimentar</button>
          <button class="btn-acao" onclick="abrirModalHist(${produto.id})"><i class="ti ti-history"></i>Histórico</button>
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
  $("#modalQtd").val("")
  .attr("disabled", false)
  .attr("readonly", false)
  .removeClass("disabled");

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
  $("#modalQtd").val(produto.quantidade)
  .attr("disabled", true)
  .attr("readonly", true)
  .addClass("disabled");

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

function abrirModalMov(id) {
  const produto = produtos.find((p) => p.id === id);
  if (!produto) return;

  $("#movProdutoId").val(produto.id);
  $("#movProdutoNome").text(produto.nome);
  $("#movEstoqueAtual").text(produto.quantidade);
  $("#movQtd").val("");
  $("#movObs").val("");
  setTipoMov("entrada");

  $("#modalMovOverlay").addClass("aberto");
  $("#movQtd").focus();
}

function setTipoMov(tipo) {
  tipoMov = tipo;
  $("#tipoEntrada").toggleClass("ativo", tipo === "entrada");
  $("#tipoSaida").toggleClass("ativo", tipo === "saida");
}

function registrarMov() {
  const id = $("#movProdutoId").val();
  const quantidade = parseInt($("#movQtd").val(), 10);

  if (Number.isNaN(quantidade) || quantidade <= 0) {
    mostrarToast("Informe uma quantidade válida");
    return;
  }

  const dados = {
    produto_id: Number(id),
    quantidade: quantidade,
    observacao: $("#movObs").val().trim(),
  };

  const aoConcluir = function () {
    mostrarToast(tipoMov === "entrada" ? "Entrada registrada" : "Saída registrada");
    fecharModalMovDireto();
    carregarProdutos();
  };

  const aoFalhar = function (mensagem) {
    mostrarToast(mensagem || "Não foi possível registrar a movimentação");
  };

  if (tipoMov === "entrada") {
    entradaEstoque(dados, aoConcluir, aoFalhar);
  } else {
    saidaEstoque(dados, aoConcluir, aoFalhar);
  }
}

function fecharModalMovDireto() {
  $("#modalMovOverlay").removeClass("aberto");
}

function fecharModalMov(event) {
  if (event.target === event.currentTarget) {
    fecharModalMovDireto();
  }
}

function abrirModalHist(id) {
  const produto = produtos.find((p) => p.id === id);
  if (!produto) return;

  $("#histTitulo").text("Histórico — " + produto.nome);
  $("#histLista").empty();
  $("#histVazio").addClass("d-none");
  $("#modalHistOverlay").addClass("aberto");

  movimentacoesPorProduto(
    id,
    function (movimentacoes) {
      renderizarHistorico(Array.isArray(movimentacoes) ? movimentacoes : []);
    },
    function (mensagem) {
      mostrarToast(mensagem || "Não foi possível carregar o histórico");
    },
  );
}

function renderizarHistorico(movimentacoes) {
  const lista = $("#histLista");
  const vazio = $("#histVazio");
  lista.empty();

  if (movimentacoes.length === 0) {
    vazio.removeClass("d-none");
    return;
  }

  vazio.addClass("d-none");

  movimentacoes.forEach((mov) => {
    const ehEntrada = mov.tipo === "entrada";
    const icone = ehEntrada ? "ti-arrow-down-left" : "ti-arrow-up-right";
    const classe = ehEntrada ? "entrada" : "saida";
    const sinal = ehEntrada ? "+" : "−";
    const data = new Date(mov.criado_em).toLocaleString("pt-BR");
    const obs = mov.observacao
      ? `<div class="hist-obs">${mov.observacao}</div>`
      : "";

    const item = `
      <div class="hist-item">
        <div class="hist-icone ${classe}"><i class="ti ${icone}"></i></div>
        <div class="hist-corpo">
          <div class="hist-descricao">${mov.descricao}</div>
          ${obs}
          <div class="hist-data">${data}</div>
        </div>
        <div class="hist-qtd ${classe}">${sinal}${mov.quantidade}</div>
      </div>`;

    lista.append(item);
  });
}

function fecharModalHistDireto() {
  $("#modalHistOverlay").removeClass("aberto");
}

function fecharModalHist(event) {
  if (event.target === event.currentTarget) {
    fecharModalHistDireto();
  }
}

function mostrarToast(mensagem) {
  const toast = $("#toastMsg");
  toast.text(mensagem).addClass("visivel");

  setTimeout(function () {
    toast.removeClass("visivel");
  }, 2500);
}
