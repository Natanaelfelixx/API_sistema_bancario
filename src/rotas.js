const express = require('express');
const rotasContas = require("./controladores/contasController.js");
const rotasTransferencias = require("./controladores/transferenciasController.js")
// const { validadorContaBody, validadorSenhaBanco, validadorSenhaUsuario, validadorContaParams, validaOrigemDestino, validadorCriarConta } = require("./intermediarios/intermediarios.js");
const app = express();


app.get('/contas', rotasContas.listarContas);
app.post('/contas', rotasContas.criarConta);
app.put('/contas/:numeroConta/usuario', rotasContas.atualizarUsuario);
app.delete('/contas/:numeroConta', rotasContas.deletarConta);
app.post('/transacoes/depositar', rotasTransferencias.depositar)
app.post('/transacoes/sacar', rotasTransferencias.sacar),
  app.post('/transacoes/transferir', rotasTransferencias.transferir)
app.get('/contas/extrato', rotasContas.tirarExtrato);


module.exports = app