const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;

  if (valor <= 0) {
    return res.status(400).json({ mensagem: 'O valor do depósito deve ser maior que zero' });
  }

  const contaIndex = contas.findIndex((conta) => conta.numero === numero_conta);
  if (contaIndex === -1) {
    return res.status(404).json({ mensagem: 'Conta não encontrada' });
  }

  contas[contaIndex].saldo += valor;

  const data = new Date().toISOString();
  transacoes.push({
    data,
    numero_conta,
    valor
  });

  return res.status(200).json({ mensagem: 'Depósito realizado com sucesso' });
}

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  if (valor <= 0) {
    return res.status(400).json({ mensagem: 'O valor do saque deve ser maior que zero' });
  }

  const contaIndex = contas.findIndex((conta) => conta.numero === numero_conta);
  if (contaIndex === -1) {
    return res.status(404).json({ mensagem: 'Conta não encontrada' });
  }

  const conta = contas[contaIndex];

  if (senha !== conta.usuario.senha) {
    return res.status(400).json({ mensagem: 'Senha incorreta' });
  }

  if (valor > conta.saldo) {
    return res.status(400).json({ mensagem: 'Saldo insuficiente' });
  }

  conta.saldo -= valor;

  const data = new Date().toISOString();
  transacoes.push({
    data,
    numero_conta,
    valor: -valor
  });

  return res.status(200).json({ mensagem: 'Saque realizado com sucesso' });
}

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  if (valor <= 0) {
    return res.status(400).json({ mensagem: 'O valor da transferência deve ser maior que zero' });
  }

  if (numero_conta_origem === numero_conta_destino) {
    return res.status(400).json({ mensagem: 'As contas de origem e destino não podem ser as mesmas' });
  }

  const contaOrigemIndex = contas.findIndex((conta) => conta.numero === numero_conta_origem);
  const contaDestinoIndex = contas.findIndex((conta) => conta.numero === numero_conta_destino);

  if (contaOrigemIndex === -1 || contaDestinoIndex === -1) {
    return res.status(404).json({ mensagem: 'Conta de origem ou destino não encontrada' });
  }

  const contaOrigem = contas[contaOrigemIndex];
  const contaDestino = contas[contaDestinoIndex];

  if (senha !== contaOrigem.usuario.senha) {
    return res.status(400).json({ mensagem: 'Senha incorreta' });
  }

  if (valor > contaOrigem.saldo) {
    return res.status(400).json({ mensagem: 'Saldo insuficiente' });
  }

  contaOrigem.saldo -= valor;
  contaDestino.saldo += valor;

  const data = new Date().toISOString();
  transacoes.push({
    data,
    numero_conta_origem,
    numero_conta_destino,
    valor
  });

  return res.status(200).json({ mensagem: 'Transferência realizada com sucesso' });
}

module.exports = {
  depositar,
  sacar,
  transferir
}