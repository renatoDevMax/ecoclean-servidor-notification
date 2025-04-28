document.addEventListener('DOMContentLoaded', function () {
  // Referências aos elementos
  const verificarWhatsappBtn = document.querySelector(
    '.nav-button:nth-child(1)',
  );
  const verificarWhatsappPanel = document.getElementById(
    'verificar-whatsapp-panel',
  );

  // Estado do painel
  let isPanelVisible = false;

  // Função para verificar o status do WhatsApp
  async function checkWhatsAppStatus() {
    document.getElementById('loading-status').style.display = 'flex';
    document.getElementById('authenticated-status').style.display = 'none';
    document.getElementById('unauthenticated-status').style.display = 'none';
    document.getElementById('error-status').style.display = 'none';

    try {
      const response = await fetch('/whatsapp/status');
      const data = await response.json();

      if (data.isAuthenticated) {
        document.getElementById('loading-status').style.display = 'none';
        document.getElementById('authenticated-status').style.display = 'flex';
      } else if (data.qrCode) {
        document.getElementById('loading-status').style.display = 'none';
        document.getElementById('unauthenticated-status').style.display =
          'flex';
        document.getElementById('qrcode-image').src = data.qrCode;
      } else {
        document.getElementById('loading-status').style.display = 'none';
        document.getElementById('unauthenticated-status').style.display =
          'flex';
        // Aguardar o QR code ser gerado e atualizar periodicamente
        pollForQRCode();
      }
    } catch (error) {
      document.getElementById('loading-status').style.display = 'none';
      document.getElementById('error-status').style.display = 'flex';
      console.error('Erro ao verificar status do WhatsApp:', error);
    }
  }

  // Função para atualizar o QR code periodicamente
  function pollForQRCode() {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/whatsapp/status');
        const data = await response.json();

        if (data.qrCode) {
          document.getElementById('qrcode-image').src = data.qrCode;
        }

        if (data.isAuthenticated) {
          clearInterval(interval);
          document.getElementById('unauthenticated-status').style.display =
            'none';
          document.getElementById('authenticated-status').style.display =
            'flex';
        }
      } catch (error) {
        console.error('Erro ao atualizar QR code:', error);
      }
    }, 20000); // Verificar a cada 20 segundos (aumentado de 2 para 20 segundos)
  }

  // Adiciona o evento de clique ao botão
  verificarWhatsappBtn.addEventListener('click', function () {
    const mainContent = document.querySelector('.main-content');

    if (!isPanelVisible) {
      // Limpar o conteúdo principal e mostrar o painel
      Array.from(mainContent.children).forEach((child) => {
        if (child !== verificarWhatsappPanel) {
          child.style.display = 'none';
        }
      });

      // Se o painel não foi adicionado ainda, adicione-o
      if (!verificarWhatsappPanel.parentNode) {
        mainContent.appendChild(verificarWhatsappPanel);
      }

      verificarWhatsappPanel.style.display = 'block';

      // Verificar o status do WhatsApp
      checkWhatsAppStatus();

      isPanelVisible = true;
    } else {
      // Ocultar o painel
      verificarWhatsappPanel.style.display = 'none';
      isPanelVisible = false;
    }
  });
});
