import { request } from "./api.js";

export function entradaEstoque(dados, callback) {
  request("/movimentacoes/entrada", "POST", dados, callback);
}

export function saidaEstoque(dados, callback) {
  request("/movimentacoes/saida", "POST", dados, callback);
}

export function listarMovimentacoes(callback) {
  request("/movimentacoes/", "GET", null, callback);
}

export function movimentacoesPorProduto(id, callback) {
  request("/movimentacoes/produto/" + id, "GET", null, callback);
}