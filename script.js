// Funções de manipulação de input
function somenteNumeros(event) {
  const input = event.target;
  input.value = input.value.replace(/\D/g, '');
}

function handlePaste(event) {
  event.preventDefault();
  const clipboardData = event.clipboardData || window.clipboardData;
  let pastedData = clipboardData.getData('text').replace(/\D/g, '');
  const input = event.target;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const newValue = input.value.slice(0, start) + pastedData + input.value.slice(end);
  input.value = newValue.slice(0, 44);
  const newCursorPos = Math.min(start + pastedData.length, 44);
  input.setSelectionRange(newCursorPos, newCursorPos);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

const campoChaveMdfe = document.getElementById('chave-mdfe');
if (campoChaveMdfe) {
    campoChaveMdfe.addEventListener('input', somenteNumeros);
    campoChaveMdfe.addEventListener('paste', handlePaste);
}

// Elementos do Scanner e Modais existentes
const btnScanCode = document.getElementById('scan-code');
const qrReaderDiv = document.getElementById('qr-reader');
const qrVideo = document.getElementById('qr-video');

let codeReader = null;
let zxingScanControls = null;

const cameraPermissionModal = document.getElementById('cameraPermissionModal');
const confirmCameraAccessBtn = document.getElementById('confirmCameraAccess');
const cancelCameraAccessBtn = document.getElementById('cancelCameraAccess');

const errorModal = document.getElementById('errorModal');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const closeErrorModalBtn = document.getElementById('closeErrorModal'); // Renomeado para consistência
const errorModalButtonsContainer = document.getElementById('errorModalButtonsContainer');

let storedErrorModalOkAction = null; // Para armazenar ação customizada do botão OK/Voltar do errorModal

// Função showModal atualizada
function showModal(modalElement, title, message, showTryAgainButton = false, isErrorStyle = true, onOkAction = null) {
    const modalTitleElement = modalElement.querySelector('h2');
    const modalMessageElement = modalElement.querySelector('p');

    if (modalTitleElement) {
        if (title) modalTitleElement.textContent = title;
        if (isErrorStyle) {
            modalTitleElement.style.color = '#dc3545';
        } else {
            modalTitleElement.style.color = '#004d38';
        }
    }
    if (modalMessageElement && message) modalMessageElement.innerHTML = message.replace(/\n/g, '<br>');

    if (modalElement === errorModal) {
        if (tryAgainBtn) tryAgainBtn.style.display = showTryAgainButton ? 'flex' : 'none';
        if (closeErrorModalBtn) {
            closeErrorModalBtn.textContent = showTryAgainButton ? 'Voltar' : 'OK';
            // A classe .cancel-btn (cinza) é aplicada por padrão no HTML para closeErrorModalBtn,
            // o que já atende ao desejo de um "OK" cinza quando "Tentar Novamente" está oculto.
        }
        if (errorModalButtonsContainer) {
             errorModalButtonsContainer.style.justifyContent = showTryAgainButton ? 'space-around' : 'center';
        }
        storedErrorModalOkAction = showTryAgainButton ? null : onOkAction; // Armazena ação só se for um "OK" customizado

    } else if (modalElement === cameraPermissionModal) {
        const cameraModalButtonsDiv = cameraPermissionModal.querySelector('.modal-buttons');
        if(cameraModalButtonsDiv) cameraModalButtonsDiv.style.justifyContent = 'space-around';
    }
    modalElement.style.display = 'flex';
}

function hideModal(modalElement) {
    modalElement.style.display = 'none';
    const modalTitleElement = modalElement.querySelector('h2');
    if (modalTitleElement) {
        modalTitleElement.style.color = '#004d38';
    }
    if (modalElement === errorModal) {
        if (tryAgainBtn) tryAgainBtn.style.display = 'flex';
        if (closeErrorModalBtn) closeErrorModalBtn.textContent = 'Voltar';
        if (errorModalButtonsContainer) errorModalButtonsContainer.style.justifyContent = 'space-around';
        storedErrorModalOkAction = null; // Limpa a ação customizada ao fechar
    }
}

// Consulta manual MDF-e
const btnConsultarMdfe = document.getElementById('consultar-mdfe');
if (btnConsultarMdfe) {
  btnConsultarMdfe.addEventListener('click', () => {
    const input = document.getElementById('chave-mdfe');
    const chave = input.value.trim();
    if (chave.length === 44) {
      const modeloDocumento = chave.substring(20, 22);
      if (modeloDocumento === '58') {
        const url = `https://dfe-portal.svrs.rs.gov.br/mdfe/qrCode?chMDFe=${chave}&tpAmb=1`;
        window.open(url, '_blank');
        input.value = '';
      } else {
        showModal(errorModal,
                  'Chave de MDF-e Inválida',
                  `A chave inserida (modelo ${modeloDocumento}) não é de um MDF-e (modelo 58).<br>Verifique a chave.`,
                  false, // Esconde "Tentar Novamente"
                  true); // Título em vermelho, onOkAction padrão (fechar e resetar)
        input.value = '';
      }
    } else {
      showModal(errorModal,
                'Chave de MDF-e Inválida',
                'Por favor, insira uma chave de acesso válida com 44 números.',
                false,
                true);
      input.value = '';
    }
  });
}

// Lógica do Social Modal
const socialModal = document.getElementById('socialModal');
const openSocialModalLink = document.getElementById('openSocialModalLink');
const closeSocialModalBtn = document.getElementById('closeSocialModalBtn');

function showSocialModal() {
    if (socialModal) {
        const titleElement = socialModal.querySelector('h2');
        if(titleElement) titleElement.style.color = '#004d38';
        socialModal.style.display = 'flex';
    }
}
function hideSocialModal() {
    if (socialModal) socialModal.style.display = 'none';
}

if (openSocialModalLink) {
    openSocialModalLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSocialModal();
    });
}
if (closeSocialModalBtn) {
    closeSocialModalBtn.addEventListener('click', hideSocialModal);
}

window.addEventListener('click', (event) => {
    if (event.target == cameraPermissionModal) { hideModal(cameraPermissionModal); }
    if (event.target == errorModal) { // Se clicar fora do errorModal, executa a ação padrão de fechar/resetar
        const actionToExecute = storedErrorModalOkAction;
        hideModal(errorModal);
        if (typeof actionToExecute !== 'function') { // Se não havia ação customizada, ou era só pra fechar
            resetToInitialState(); // Só reseta se não houve ação específica que já faria isso
        } else if (actionToExecute) { // Se havia ação customizada e ela não foi a de resetar
             // A ação customizada deve chamar resetToInitialState() se necessário.
             // Aqui, apenas garantimos que o modal seja fechado.
        }
    }
    if (event.target == socialModal) { hideSocialModal(); }
});

function resetToInitialState() {
    stopCamera();
    const docSection = campoChaveMdfe.closest('.document-section');
    if (docSection) docSection.style.display = 'block';

    qrReaderDiv.style.display = 'none';
    hideModal(cameraPermissionModal);
    hideModal(errorModal);
    if(campoChaveMdfe) campoChaveMdfe.value = '';
}

async function startCameraScan() {
    const docSection = campoChaveMdfe.closest('.document-section');
    if (docSection) docSection.style.display = 'none';

    qrReaderDiv.style.display = 'flex';
    qrVideo.style.display = 'block';

    if (typeof ZXing === 'undefined') {
        console.error("ZXing library is not loaded!");
        showModal(errorModal, "Erro Crítico", "A biblioteca de escaneamento (ZXing) não foi carregada.<br>Verifique a conexão e recarregue.", false, true, () => resetToInitialState());
        return;
    }

    if (!codeReader) {
        try {
            codeReader = new ZXing.BrowserMultiFormatReader();
        } catch (e) {
            console.error("Falha ao instanciar ZXing.BrowserMultiFormatReader():", e);
            showModal(errorModal, "Erro Crítico", "Falha ao iniciar o leitor de código: " + e.message, false, true, () => resetToInitialState());
            return;
        }
    }
    zxingScanControls = null;

    try {
        console.log('Iniciando escaneamento com ZXing...');
        codeReader.decodeFromVideoDevice(undefined, qrVideo.id, (result, error, controls) => {
            if (controls && !zxingScanControls) {
                zxingScanControls = controls;
            }

            if (result) {
                console.log("Código encontrado:", result.text, "Formato:", result.format.toString());
                // A câmera é parada dentro de handleScannedValue ou pelo resetToInitialState
                handleScannedValue(result.text.trim());
            } else if (error) {
                if (error instanceof ZXing.NotFoundException) {
                    // Normal
                } else { // Outros erros de scan
                    console.error('Erro no escaneamento ZXing:', error.name, error.message, error);
                    stopCamera(); // Para a câmera em caso de erro de scan
                    let errorTitle = 'Erro de Leitura!';
                    let errorMessage = 'Ocorreu um erro ao tentar ler o código.<br>Por favor, tente novamente.';
                    // ... (mensagens de erro específicas)
                    if (error.name === 'NotAllowedError') { /* ... */ }
                    // ...
                    showModal(errorModal, errorTitle, errorMessage, true, true, null);
                }
            }
        });
    } catch (initialError) { // Erro no setup do decodeFromVideoDevice
        console.error('Erro ao iniciar o scanner ZXing (setup):', initialError);
        stopCamera();
        showModal(errorModal, 'Erro Crítico no Scanner', 'Falha ao configurar o scanner: ' + initialError.message, true, true, null);
        // resetToInitialState é chamado pelo botão "Voltar" do modal de erro
    }
}

if (btnScanCode) {
    btnScanCode.addEventListener('click', async () => {
        if (typeof ZXing === 'undefined') {
             console.error("ZXing library is not loaded before scan button click!");
             showModal(errorModal, "Erro Crítico", "A biblioteca de escaneamento (ZXing) não foi carregada.<br>Verifique a conexão e recarregue.", false, true, () => resetToInitialState());
             return;
        }
        try {
            const cameraPermTitleEl = document.getElementById('cameraPermTitle');
            if(cameraPermTitleEl) cameraPermTitleEl.style.color = '#004d38';

            if (navigator.permissions && navigator.permissions.query) {
                const permissionStatus = await navigator.permissions.query({ name: 'camera' });
                if (permissionStatus.state === 'granted') {
                    startCameraScan();
                } else {
                     showModal(cameraPermissionModal, 'Permissão da Câmera Necessária', 'Para escanear o código, precisamos acessar sua câmera.<br>Por favor, clique em "Permitir" na solicitação do navegador.', false, false);
                }
            } else {
                console.warn("navigator.permissions.query não suportado. Tentando acesso direto após modal.");
                showModal(cameraPermissionModal, 'Permissão da Câmera Necessária', 'Para escanear o código, precisamos acessar sua câmera.<br>Por favor, clique em "Permitir".', false, false);
            }
        } catch (e) {
            console.warn("Erro ao verificar permissões da câmera, mostrando modal:", e);
            showModal(cameraPermissionModal, 'Permissão da Câmera Necessária', 'Para escanear o código, precisamos acessar sua câmera.', false, false);
        }
    });
}

confirmCameraAccessBtn.addEventListener('click', () => {
    hideModal(cameraPermissionModal);
    startCameraScan();
});

cancelCameraAccessBtn.addEventListener('click', () => {
    hideModal(cameraPermissionModal);
    resetToInitialState();
});

tryAgainBtn.addEventListener('click', () => { // Botão "Tentar Novamente" do errorModal
    hideModal(errorModal);
    startCameraScan();
});

closeErrorModalBtn.addEventListener('click', () => { // Botão "Voltar/OK" do errorModal
    const actionToExecute = storedErrorModalOkAction;
    hideModal(errorModal);

    if (typeof actionToExecute === 'function') {
        actionToExecute(); // Executa a ação customizada (ex: abrir URL e resetar)
    } else {
        resetToInitialState(); // Ação padrão se não houver customizada
    }
});

function handleScannedValue(value) {
    let chaveFiscal = '';
    const cleanedValue = value.replace(/\s+/g, '');
    stopCamera(); // Para a câmera assim que um código é processado

    if (/^\d{44}$/.test(cleanedValue)) {
        chaveFiscal = cleanedValue;
    } else if (cleanedValue.includes('chMDFe=') || cleanedValue.includes('chCTe=') || cleanedValue.includes('chNFe=')) {
        try {
            const paramsStr = cleanedValue.includes('?') ? cleanedValue.split('?')[1] : cleanedValue;
            const urlParams = new URLSearchParams(paramsStr);
            if (urlParams.has('chMDFe')) {
                chaveFiscal = urlParams.get('chMDFe');
            } else if (urlParams.has('chCTe')) {
                chaveFiscal = urlParams.get('chCTe');
            } else if (urlParams.has('chNFe')) {
                chaveFiscal = urlParams.get('chNFe');
            }
            if (chaveFiscal) chaveFiscal = chaveFiscal.replace(/\s+/g, '');
        } catch (e) {
            console.error("Erro ao parsear parâmetros da URL do código:", e, "Valor:", cleanedValue);
            chaveFiscal = null;
        }
    }

    if (chaveFiscal && /^\d{44}$/.test(chaveFiscal)) {
        const modeloDocumento = chaveFiscal.substring(20, 22);

        if (modeloDocumento === '58') { // Modelo 58 é MDF-e
            const serie = chaveFiscal.substring(22, 25);
            const numero = chaveFiscal.substring(25, 34);
            const url = `https://dfe-portal.svrs.rs.gov.br/mdfe/qrCode?chMDFe=${chaveFiscal}&tpAmb=1`;
            const message = `Série: ${serie}<br>Número: ${numero}<br><br>Clique no botão "OK" para abrir o portal.`;

            showModal(errorModal,
                      "MDF-e Identificado",
                      message,
                      false, // Esconde "Tentar Novamente"
                      false, // Título normal (não vermelho)
                      () => { // Ação para o botão "OK"
                          window.open(url, '_blank');
                          resetToInitialState(); // Já chama hideModal implicitamente
                      }
                     );
        } else {
            let nomeDocumento = `Documento (modelo ${modeloDocumento})`;
            if(modeloDocumento === '57') nomeDocumento = 'CT-e (Conhecimento de Transporte)';
            else if(modeloDocumento === '55') nomeDocumento = 'NF-e (Nota Fiscal)';
            showModal(errorModal,
                      'Documento Não Suportado',
                      `Este é um código de ${nomeDocumento}.<br>Este consultor é específico para MDF-e (modelo 58).`,
                      true,
                      true,
                      null); // Nenhuma ação customizada no OK (além de fechar e resetar)
        }
    } else {
        showModal(errorModal,
                  'Código Inválido',
                  'O código lido não parece ser uma chave de acesso válida (44 dígitos) ou URL reconhecida.<br>Verifique o código e tente novamente.',
                  true,
                  true,
                  null);
    }
}

function stopCamera() {
  if (zxingScanControls) {
    zxingScanControls.stop();
    zxingScanControls = null;
    console.log("Escaneamento ZXing interrompido via controles.");
  }
  if (codeReader) {
    try {
        codeReader.reset();
        console.log("Leitor ZXing resetado.");
    } catch (e) {
        console.error("Erro ao resetar o leitor ZXing:", e);
    }
  }
  if (qrVideo) {
    qrVideo.pause();
    if (qrVideo.srcObject) {
        qrVideo.srcObject.getTracks().forEach(track => track.stop());
    }
    qrVideo.srcObject = null;
  }
   console.log("Câmera explicitamente parada.");
}

window.addEventListener('beforeunload', stopCamera);