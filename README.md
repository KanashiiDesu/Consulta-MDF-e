# Consulta MDF-e

## 📖 Sobre o Projeto

**Consulta MDF-e** é uma ferramenta web desenvolvida para simplificar e agilizar a consulta de Manifestos Eletrônicos de Documentos Fiscais (MDF-e). A aplicação permite que o usuário consulte um MDF-e de duas maneiras: inserindo manualmente a chave de 44 dígitos ou escaneando o QR Code/código de barras diretamente com a câmera do dispositivo.

O projeto foi criado para ser uma solução rápida e acessível, abrindo diretamente o portal oficial de consulta do governo após a validação da chave, sem a necessidade de digitação em outros sistemas.

O site do projeto pode ser acessado em: [https://kanashiidesu.github.io/Consulta-MDF-e/](https://kanashiidesu.github.io/Consulta-MDF-e/)

## ✨ Funcionalidades

* **Consulta Manual**: Insira a chave de 44 dígitos do MDF-e para uma consulta direta.
* **Scanner de QR Code e Código de Barras**: Utilize a câmera do seu celular ou webcam para ler o código do documento fiscal de forma automática.
* **Validação de Documento**: O sistema verifica se a chave inserida ou lida corresponde a um MDF-e (modelo 58), informando o usuário caso seja um documento diferente (como NF-e ou CT-e).
* **Acesso Rápido ao Portal**: Após a identificação de um MDF-e válido, a aplicação oferece um link direto para a página de consulta oficial do SVRS (SEFAZ Virtual do Rio Grande do Sul), que atende diversos estados.
* **Interface Responsiva**: O design se adapta a diferentes tamanhos de tela, funcionando bem tanto em desktops quanto em dispositivos móveis.
* **Feedback ao Usuário**: Modais interativos informam sobre a necessidade de permissão de câmera, sucesso na leitura, ou erros de validação, garantindo uma experiência de uso clara e intuitiva.

## 🛠️ Tecnologias Utilizadas

* **HTML5**: Estrutura principal da aplicação.
* **CSS3**: Estilização e design responsivo.
* **JavaScript (Vanilla)**: Lógica do cliente, manipulação de eventos e interatividade.
* **ZXing Library**: Biblioteca de código aberto para leitura e decodificação de QR Codes e códigos de barras a partir da câmera.
* **Font Awesome**: Ícones utilizados na interface para melhorar a experiência visual.

## 🚀 Como Usar

1.  **Acesse o site**: Abra o link [https://kanashiidesu.github.io/Consulta-MDF-e/](https://kanashiidesu.github.io/Consulta-MDF-e/).
2.  **Para consulta manual**:
    * Digite ou cole os 44 números da chave do MDF-e no campo indicado.
    * Clique no botão **"Consultar MDF-e"**.
3.  **Para escanear o código**:
    * Clique no botão **"Escanear QR Code ou Barcode"**.
    * Permita o acesso à câmera quando o navegador solicitar.
    * Aponte a câmera para o QR Code ou código de barras do documento.
4.  Após a validação, se o MDF-e for identificado corretamente, um aviso aparecerá com os detalhes (série e número) e um botão para abrir o portal de consulta oficial.

## 👤 Autor

* **Thalis Gomes**
    * [GitHub](https://github.com/kanashiidesu)
    * [LinkedIn](https://linkedin.com/in/thalisgomes)
