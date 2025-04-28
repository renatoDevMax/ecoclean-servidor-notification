document.addEventListener('DOMContentLoaded', function () {
  // Referências aos elementos
  const contatosWhatsappBtn = document.querySelector(
    '.nav-button:nth-child(3)',
  );
  const contatosWhatsappPanel = document.getElementById(
    'contatos-whatsapp-panel',
  );

  // Estado do painel
  let isPanelVisible = false;
  let contatosData = []; // Armazenar os contatos para pesquisa

  // Função para carregar contatos
  async function carregarContatos() {
    const contatosListaContainer = document.getElementById(
      'contatos-lista-container',
    );
    const contatosLista = document.getElementById('contatos-lista');
    const carregandoStatus = document.getElementById('carregando-contatos');
    const erroStatus = document.getElementById('erro-contatos');

    // Mostrar status de carregamento
    carregandoStatus.style.display = 'flex';
    contatosListaContainer.style.display = 'none';
    erroStatus.style.display = 'none';

    try {
      const response = await fetch('/whatsapp/contatos');
      const data = await response.json();

      // Armazenar os contatos para uso na pesquisa
      contatosData = data.contatos || [];

      // Limpar a lista atual
      contatosLista.innerHTML = '';

      // Renderiza a tabela inicial
      renderizarTabela(contatosData);

      // Mostrar a lista de contatos
      carregandoStatus.style.display = 'none';
      contatosListaContainer.style.display = 'block';
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      carregandoStatus.style.display = 'none';
      erroStatus.style.display = 'block';
    }
  }

  // Função para renderizar a tabela de contatos
  function renderizarTabela(contatos) {
    const contatosLista = document.getElementById('contatos-lista');
    contatosLista.innerHTML = '';

    if (contatos && contatos.length > 0) {
      // Criar a tabela
      const table = document.createElement('table');
      table.className = 'contatos-table';

      // Cabeçalho da tabela
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');

      const thNome = document.createElement('th');
      thNome.textContent = 'Nome';

      const thNumero = document.createElement('th');
      thNumero.textContent = 'Número';

      headerRow.appendChild(thNome);
      headerRow.appendChild(thNumero);
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Corpo da tabela
      const tbody = document.createElement('tbody');

      contatos.forEach((contato) => {
        const row = document.createElement('tr');

        const tdNome = document.createElement('td');
        tdNome.textContent = contato.nome || 'Nome não disponível';

        const tdNumero = document.createElement('td');
        tdNumero.textContent = contato.numero || contato.id.user || contato.id;

        row.appendChild(tdNome);
        row.appendChild(tdNumero);
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      contatosLista.appendChild(table);
    } else {
      // Nenhum contato encontrado
      const mensagem = document.createElement('p');
      mensagem.className = 'mensagem-sem-contatos';
      mensagem.textContent = 'Nenhum contato disponível.';
      contatosLista.appendChild(mensagem);
    }
  }

  // Função para filtrar contatos
  function filtrarContatos(termo) {
    if (!termo.trim()) {
      renderizarTabela(contatosData);
      return;
    }

    const termoBusca = termo.toLowerCase();
    const contatosFiltrados = contatosData.filter(
      (contato) =>
        (contato.nome && contato.nome.toLowerCase().includes(termoBusca)) ||
        (contato.numero && contato.numero.includes(termoBusca)),
    );

    renderizarTabela(contatosFiltrados);
  }

  // Adiciona o evento de clique ao botão do menu
  contatosWhatsappBtn.addEventListener('click', function () {
    const mainContent = document.querySelector('.main-content');

    if (!isPanelVisible) {
      // Limpar o conteúdo principal e mostrar o painel
      Array.from(mainContent.children).forEach((child) => {
        if (child !== contatosWhatsappPanel) {
          child.style.display = 'none';
        }
      });

      // Se o painel não foi adicionado ainda, adicione-o
      if (!contatosWhatsappPanel.parentNode) {
        mainContent.appendChild(contatosWhatsappPanel);
      }

      contatosWhatsappPanel.style.display = 'block';

      // Carregar os contatos
      carregarContatos();

      isPanelVisible = true;
    } else {
      // Ocultar o painel
      contatosWhatsappPanel.style.display = 'none';
      isPanelVisible = false;
    }
  });

  // Adicionar evento de pesquisa quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', function () {
    const inputPesquisa = document.getElementById('pesquisa-contatos');
    if (inputPesquisa) {
      inputPesquisa.addEventListener('input', function () {
        filtrarContatos(this.value);
      });
    }
  });

  // Adicionar o evento de pesquisa após o carregamento dos contatos também
  const inputPesquisa = document.getElementById('pesquisa-contatos');
  if (inputPesquisa) {
    inputPesquisa.addEventListener('input', function () {
      filtrarContatos(this.value);
    });
  }
});
