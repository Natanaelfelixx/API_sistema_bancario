const { banco, contas } = require('../bancodedados');

const listarContas = (req, res) => {
  const senhaBanco = req.query.senha_banco;

  if (!senhaBanco) {
    return res.status(400).json({ mensagem: 'Parâmetro senha_banco não informado' });
  }
  if (senhaBanco !== banco.senha) {
    return res.status(401).json({ mensagem: 'Senha do banco incorreta' });
  }
  return res.status(200).json(contas);
}

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }

  const contaExistente = contas.find((conta) => conta.usuario.cpf === cpf || conta.usuario.email === email);
  if (contaExistente) {
    return res.status(400).json({ mensagem: 'CPF ou E-mail já cadastrados' });
  }

  const novoNumeroConta = (contas.length + 1).toString();

  const novaConta = {
    numero: novoNumeroConta,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha
    }
  };

  contas.push(novaConta);

  return res.status(201).json(novaConta);
};

const atualizarUsuario = (req, res) => {
  const numeroConta = req.params.numeroConta;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  const conta = contas.find((conta) => conta.numero === numeroConta);
  if (!conta) {
    return res.status(404).json({ mensagem: 'Conta não encontrada' });
  }

  if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
    return res.status(400).json({ mensagem: 'Pelo menos um campo deve ser informado para atualização' });
  }

  const contaExistente = contas.find((conta) => (cpf && conta.usuario.cpf === cpf) || (email && conta.usuario.email === email));
  if (contaExistente && contaExistente.numero !== numeroConta) {
    return res.status(400).json({ mensagem: 'CPF ou E-mail já cadastrados em outra conta' });
  }

  if (nome) conta.usuario.nome = nome;
  if (cpf) conta.usuario.cpf = cpf;
  if (data_nascimento) conta.usuario.data_nascimento = data_nascimento;
  if (telefone) conta.usuario.telefone = telefone;
  if (email) conta.usuario.email = email;
  if (senha) conta.usuario.senha = senha;

  return res.status(200).json({ mensagem: 'Conta atualizada com sucesso' });
}

const deletarConta = (req, res) => {
  const numeroConta = req.params.numeroConta;

  const contaIndex = contas.findIndex((conta) => conta.numero === numeroConta);
  if (contaIndex === -1) {
    return res.status(404).json({ mensagem: 'Conta não encontrada' });
  }

  if (contas[contaIndex].saldo !== 0) {
    return res.status(400).json({ mensagem: 'Não é possível excluir uma conta com saldo positivo' });
  }

  contas.splice(contaIndex, 1);

  return res.status(200).json({ mensagem: 'Conta excluída com sucesso' });
}

const checarSaldo = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta || !senha) {
    return res.status(400).json({ mensagem: 'Número da conta e senha são obrigatórios' });
  }

  const contaIndex = contas.findIndex((conta) => conta.numero === numero_conta);

  if (contaIndex === -1) {
    return res.status(404).json({ mensagem: 'Conta não encontrada' });
  }

  const conta = contas[contaIndex];

  if (senha !== conta.usuario.senha) {
    return res.status(400).json({ mensagem: 'Senha incorreta' });
  }

  return res.status(200).json({ saldo: conta.saldo });
}

const tirarExtrato = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta || !senha) {
    return res.status(400).json({ mensagem: 'Número da conta e senha são obrigatórios' });
  }

  const contaIndex = contas.findIndex((conta) => conta.numero === numero_conta);

  if (contaIndex === -1) {
    return res.status(404).json({ mensagem: 'Conta não encontrada' });
  }

  const conta = contas[contaIndex];

  if (senha !== conta.usuario.senha) {
    return res.status(400).json({ mensagem: 'Senha incorreta' });
  }

  const transacoesDepositos = depositos.filter((deposito) => deposito.numero_conta === numero_conta);
  const transacoesSaques = saques.filter((saque) => saque.numero_conta === numero_conta);
  const transacoesTransferenciasEnviadas = transferencias.filter((transferencia) => transferencia.numero_conta_origem === numero_conta);
  const transacoesTransferenciasRecebidas = transferencias.filter((transferencia) => transferencia.numero_conta_destino === numero_conta);

  const extrato = {
    depositos: transacoesDepositos,
    saques: transacoesSaques,
    transferenciasEnviadas: transacoesTransferenciasEnviadas,
    transferenciasRecebidas: transacoesTransferenciasRecebidas,
  };

  return res.status(200).json(extrato);
}

module.exports = {
  listarContas,
  criarConta,
  atualizarUsuario,
  deletarConta,
  checarSaldo,
  tirarExtrato
}