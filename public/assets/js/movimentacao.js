import { request } from "./api.js";

export function entradaEstoque(dados, callback, errorCallback) {
  request("/movimentacoes/entrada", "POST", dados, callback, errorCallback);
}

export function saidaEstoque(dados, callback, errorCallback) {
  request("/movimentacoes/saida", "POST", dados, callback, errorCallback);
}

export function listarMovimentacoes(callback, errorCallback) {
  request("/movimentacoes/", "GET", null, callback, errorCallback);
}

export function movimentacoesPorProduto(id, callback, errorCallback) {
  request("/movimentacoes/produto/" + id, "GET", null, callback, errorCallback);
