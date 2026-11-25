/*
  The Top English: configurações do site.
  É o único arquivo que precisa mudar para trocar o número do WhatsApp
  ou ligar a planilha de interessados. Passo a passo no README.md.
*/
window.SITE_CONFIG = {
  // Número de contingência do WhatsApp da escola: 55 + DDD + número.
  // Depois que o conteúdo do Supabase carregar, o painel de Contato substitui este valor
  // e atualiza todos os botões, links e formulários do WhatsApp do site.
  whatsapp: '5563981369088',

  // Mensagem do botão flutuante "WhatsApp". O "Vim pelo site" mostra à escola de onde veio o contato.
  mensagemPadrao: 'Olá, Teacher Maureen! Vim pelo site e gostaria de informações sobre as aulas.',

  // Endereço do Web App do Google Apps Script (apps-script/Code.gs), terminado em /exec.
  // Vazio: o formulário funciona só com o WhatsApp, sem registrar na planilha.
  planilhaUrl: 'https://script.google.com/macros/s/AKfycbxXeQ9hT-si9ZscwlkItTn9dt1FB4AwanL4OtMGmGB7XnXPAqKl4B83hXcQ-2D7q3ngXA/exec',

  // Data da versão atual de privacidade.html. Vai para a planilha junto com cada consulta,
  // como registro de qual aviso a pessoa aceitou (LGPD, art. 8º). Atualize ao mudar o aviso.
  versaoAviso: '2026-10-29'
};
