document.addEventListener('DOMContentLoaded', function () {
  // Referências aos elementos
  const mensagemWhatsappBtn = document.querySelector(
    '.nav-button:nth-child(2)',
  );
  const mensagemWhatsappPanel = document.getElementById(
    'mensagem-whatsapp-panel',
  );

  // Estado do painel
  let isPanelVisible = false;

  // Função para enviar mensagem de teste
  async function enviarMensagemTeste(event) {
    event.preventDefault();

    const contatoInput = document.getElementById('contato-input');
    const mensagemTextarea = document.getElementById('mensagem-textarea');
    const statusMensagem = document.getElementById('status-mensagem');

    // Validação básica
    if (!contatoInput.value || !mensagemTextarea.value) {
      statusMensagem.textContent = 'Por favor, preencha todos os campos.';
      statusMensagem.className = 'status-erro';
      return;
    }

    try {
      statusMensagem.textContent = 'Enviando mensagem...';
      statusMensagem.className = 'status-enviando';

      const response = await fetch('/mensagem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contato: contatoInput.value,
          mensagem: mensagemTextarea.value,
        }),
      });

      const resultado = await response.json();

      if (resultado.mensagemEnviada) {
        statusMensagem.textContent = 'Mensagem enviada com sucesso!';
        statusMensagem.className = 'status-sucesso';
      } else {
        statusMensagem.textContent =
          'Falha ao enviar mensagem. Verifique se o WhatsApp está autenticado.';
        statusMensagem.className = 'status-erro';
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      statusMensagem.textContent = 'Erro ao enviar mensagem. Tente novamente.';
      statusMensagem.className = 'status-erro';
    }
  }

  // Adiciona o evento de clique ao botão do menu
  mensagemWhatsappBtn.addEventListener('click', function () {
    const mainContent = document.querySelector('.main-content');

    if (!isPanelVisible) {
      // Limpar o conteúdo principal e mostrar o painel
      Array.from(mainContent.children).forEach((child) => {
        if (child !== mensagemWhatsappPanel) {
          child.style.display = 'none';
        }
      });

      // Se o painel não foi adicionado ainda, adicione-o
      if (!mensagemWhatsappPanel.parentNode) {
        mainContent.appendChild(mensagemWhatsappPanel);
      }

      mensagemWhatsappPanel.style.display = 'block';

      isPanelVisible = true;
    } else {
      // Ocultar o painel
      mensagemWhatsappPanel.style.display = 'none';
      isPanelVisible = false;
    }
  });

  // Adiciona evento de submit ao formulário
  const mensagemForm = document.getElementById('mensagem-form');
  if (mensagemForm) {
    mensagemForm.addEventListener('submit', enviarMensagemTeste);
  }
});
