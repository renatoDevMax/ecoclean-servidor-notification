document.addEventListener('DOMContentLoaded', function () {
  // Referências aos elementos
  const buscarIdBtn = document.querySelector('.nav-button:nth-child(4)');
  const buscarIdPanel = document.getElementById('buscar-id-panel');

  // Estado do painel
  let isPanelVisible = false;

  // Função para buscar cliente por ID
  async function buscarClientePorId(event) {
    event.preventDefault();

    const idInput = document.getElementById('id-input');
    const resultadoBusca = document.getElementById('resultado-busca');
    const clienteInfo = document.getElementById('cliente-info');
    const carregandoBusca = document.getElementById('carregando-busca');
    const erroBusca = document.getElementById('erro-busca');

    // Validação básica
    if (!idInput.value) {
      alert('Por favor, digite um ID válido.');
      return;
    }

    // Resetando estados
    resultadoBusca.style.display = 'none';
    erroBusca.style.display = 'none';
    carregandoBusca.style.display = 'flex';

    try {
      // Chamada para a API
      const response = await fetch(`/api/cliente/${idInput.value}`);

      if (!response.ok) {
        throw new Error('Cliente não encontrado');
      }

      const data = await response.json();
      const cliente = data.cliente;
      const compras = data.compras;

      // Ocultando o carregamento
      carregandoBusca.style.display = 'none';

      // Limpar conteúdo existente
      clienteInfo.innerHTML = '';

      // Seção de informações do cliente
      const clienteSection = document.createElement('div');
      clienteSection.className = 'cliente-section';

      const clienteTitle = document.createElement('h3');
      clienteTitle.className = 'section-title';
      clienteTitle.textContent = 'Informações do Cliente';
      clienteSection.appendChild(clienteTitle);

      // Transformando o objeto cliente em elementos HTML
      for (const [chave, valor] of Object.entries(cliente)) {
        // Não ignorar mais campos do tipo objeto/array, apenas valores nulos/indefinidos
        if (valor === null || valor === undefined) {
          continue;
        }

        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';

        const infoLabel = document.createElement('div');
        infoLabel.className = 'info-label';
        infoLabel.textContent = formatarChave(chave);

        const infoValue = document.createElement('div');
        infoValue.className = 'info-value';

        // Tratamento especial para arrays e objetos
        if (Array.isArray(valor)) {
          // Para arrays, criamos uma lista de itens
          const listaUl = document.createElement('ul');
          listaUl.className = 'lista-array';

          valor.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            listaUl.appendChild(li);
          });

          infoValue.appendChild(listaUl);
        } else if (typeof valor === 'object' && valor instanceof Date) {
          // Formatar datas
          infoValue.textContent = new Date(valor).toLocaleDateString('pt-BR');
        } else if (typeof valor === 'object') {
          // Para outros objetos, exibir como JSON formatado
          infoValue.textContent = JSON.stringify(valor, null, 2);
          infoValue.classList.add('json-value');
        } else {
          // Valores simples
          infoValue.textContent = valor;
        }

        infoItem.appendChild(infoLabel);
        infoItem.appendChild(infoValue);
        clienteSection.appendChild(infoItem);
      }

      clienteInfo.appendChild(clienteSection);

      // Seção de compras do cliente
      const comprasSection = document.createElement('div');
      comprasSection.className = 'compras-section';

      const comprasTitle = document.createElement('h3');
      comprasTitle.className = 'section-title';
      comprasTitle.textContent = 'Compras do Cliente';
      comprasSection.appendChild(comprasTitle);

      if (compras && compras.length > 0) {
        // Criação da tabela de compras
        const comprasTable = document.createElement('table');
        comprasTable.className = 'compras-table';

        // Criação do cabeçalho da tabela
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Determinar todas as chaves presentes nas compras
        const todasChaves = new Set();
        compras.forEach((compra) => {
          Object.keys(compra).forEach((chave) => {
            if (chave !== '_id' && chave !== '__v') {
              todasChaves.add(chave);
            }
          });
        });

        // Criar as células do cabeçalho
        Array.from(todasChaves).forEach((chave) => {
          const th = document.createElement('th');
          th.textContent = formatarChave(chave.toString());
          headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        comprasTable.appendChild(thead);

        // Corpo da tabela
        const tbody = document.createElement('tbody');

        compras.forEach((compra) => {
          const row = document.createElement('tr');

          Array.from(todasChaves).forEach((chave) => {
            const td = document.createElement('td');
            const valor = compra[chave];

            if (valor !== undefined && valor !== null) {
              if (Array.isArray(valor)) {
                // Exibir arrays como lista separada por vírgulas
                td.textContent = valor.join(', ');
              } else if (typeof valor === 'object' && valor instanceof Date) {
                // Formatar datas
                td.textContent = new Date(valor).toLocaleDateString('pt-BR');
              } else if (typeof valor === 'object') {
                // Outros objetos como JSON
                td.textContent = JSON.stringify(valor);
              } else {
                td.textContent = valor.toString();
              }
            } else {
              td.textContent = '-';
            }

            row.appendChild(td);
          });

          tbody.appendChild(row);
        });

        comprasTable.appendChild(tbody);
        comprasSection.appendChild(comprasTable);
      } else {
        const nenhumaCompra = document.createElement('p');
        nenhumaCompra.className = 'nenhuma-compra';
        nenhumaCompra.textContent =
          'Nenhuma compra encontrada para este cliente.';
        comprasSection.appendChild(nenhumaCompra);
      }

      clienteInfo.appendChild(comprasSection);

      // Exibindo o container de resultado
      resultadoBusca.style.display = 'block';
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      carregandoBusca.style.display = 'none';
      erroBusca.style.display = 'flex';
    }
  }

  // Função para formatar as chaves do objeto
  function formatarChave(chave) {
    // Converter de camelCase para formato mais legível
    const formatado = chave
      .replace(/([A-Z])/g, ' $1') // Insere espaço antes de letras maiúsculas
      .replace(/^./, (str) => str.toUpperCase()); // Primeira letra maiúscula

    // Casos específicos
    switch (chave) {
      case 'nome':
        return 'Nome';
      case 'email':
        return 'E-mail';
      case 'cpf':
        return 'CPF';
      case 'cpfcnpj':
        return 'CPF/CNPJ';
      case 'cnpj':
        return 'CNPJ';
      case 'telefone':
        return 'Telefone';
      case 'contato':
        return 'Contato';
      case 'endereco':
        return 'Endereço';
      case 'pontos':
        return 'Pontos';
      case '_id':
        return 'ID do Cliente';
      case 'dataCadastro':
        return 'Data de Cadastro';
      case 'tipoCliente':
        return 'Tipo do Cliente';
      case 'matriz':
        return 'Matriz Associada';
      case 'beneficios':
        return 'Benefícios';
      case 'beneficioMatriz':
        return 'Benefícios da Matriz';
      case 'valor':
        return 'Valor (R$)';
      case 'data':
        return 'Data';
      case 'descricao':
        return 'Descrição';
      case 'produto':
        return 'Produto';
      case 'quantidade':
        return 'Quantidade';
      default:
        return formatado;
    }
  }

  // Adiciona o evento de clique ao botão do menu
  buscarIdBtn.addEventListener('click', function () {
    const mainContent = document.querySelector('.main-content');

    if (!isPanelVisible) {
      // Limpar o conteúdo principal e mostrar o painel
      Array.from(mainContent.children).forEach((child) => {
        if (child !== buscarIdPanel) {
          child.style.display = 'none';
        }
      });

      // Se o painel não foi adicionado ainda, adicione-o
      if (!buscarIdPanel.parentNode) {
        mainContent.appendChild(buscarIdPanel);
      }

      buscarIdPanel.style.display = 'block';
      isPanelVisible = true;
    } else {
      // Ocultar o painel
      buscarIdPanel.style.display = 'none';
      isPanelVisible = false;
    }
  });

  // Adiciona evento de submit ao formulário
  const buscarIdForm = document.getElementById('buscar-id-form');
  if (buscarIdForm) {
    buscarIdForm.addEventListener('submit', buscarClientePorId);
  }
});
