# The Top English — Protótipo Inicial

Protótipo institucional em HTML + CSS + JavaScript, baseado na identidade visual observada na planilha fornecida pela equipe.

## Estrutura
- `index.html` — página principal
- `style.css` — identidade visual e responsividade
- `script.js` — menu mobile e botão voltar ao topo
- `js/formulario.js` — formulário "Quero estudar" (validação, mensagem do WhatsApp, planilha)
- `js/config.js` — número e mensagem do WhatsApp, endereço da planilha, versão do aviso
- `js/extras.js` — botão flutuante de WhatsApp e modo revisão (`?revisar`)
- `privacidade.html` — aviso de privacidade (LGPD) ligado ao formulário
- `apps-script/Code.gs` — script da Planilha Google que recebe as consultas
- `js/admin-integracao.js`, `js/supabase.js`, `admin/` — painel de edição de conteúdo (Supabase)
- `assets/identidade-top-english.png` — recorte da identidade visual da planilha

## Como entrar no site
Veja nossa publicação no GithubPages
- pedronapp.github.io/TheTopInglesh

## O formulário "Quero estudar"
O formulário foi integrado a partir do projeto `thetopenglish`. Ele pede nome, WhatsApp (com máscara),
para quem são as aulas (e a idade, se for criança), curso, nível, dias, períodos, como conheceu a escola
e a autorização de uso dos dados. Ao enviar:

1. valida os campos e mostra os erros junto de cada um;
2. abre o WhatsApp da escola com a mensagem pronta;
3. se a planilha estiver configurada, registra a consulta (Nome, WhatsApp, curso, dias, etc.);
4. ignora robôs (campo-armadilha escondido).

**Parâmetros no endereço:** `?origem=instagram` (ou `google`, `indicacao`, `fachada`, `qrcode`, `outro`)
pré-preenche "Como conheceu"; `?servico=ielts` (ou `regular`, `infantil`, `passages`, `individual`,
`reforco`, `toefl`, `nao-sei`) pré-seleciona o curso.

### Número de WhatsApp
O formulário usa o número de `js/config.js` (`whatsapp`). O card de WhatsApp da seção **Contato** continua vindo
do painel admin (Supabase). Mantenha os dois iguais ao trocar de número; o aviso de privacidade também cita o número.

### Planilha de interessados (opcional)
Sem `planilhaUrl`, o formulário funciona só com o WhatsApp.

1. Na conta Google da escola, crie uma Planilha Google.
2. **Extensões > Apps Script**: apague o conteúdo e cole `apps-script/Code.gs`.
3. **Implantar > Nova implantação > App da Web**: executar como *Eu*, acesso *Qualquer pessoa*.
4. Copie a URL terminada em `/exec` para `planilhaUrl`, em `js/config.js`.
5. No editor do Apps Script, execute uma vez a função `ativarLimpezaAutomatica` (apaga consultas com mais de 6 meses, como diz o aviso de privacidade).
6. Teste enviando o formulário: a aba **Interessados** aparece, com a coluna **Status** (Novo / Contatado / Aula experimental / Matriculado / Sem horário).

## Seções e extras (portados do thetopenglish)
- **Como funciona**, **A professora** e **Dúvidas frequentes**: textos direto no `index.html`. Ficam fora do painel admin.
- **Barra de aviso** no topo ("Poucas vagas…"): edite o texto em `index.html`, bloco `notice`. Para esconder, adicione o atributo `hidden`.
- **Botão flutuante de WhatsApp:** abre a conversa com a mensagem de `mensagemPadrao` (`js/config.js`). Some no início e no formulário.
- **Foto da teacher Maureen:** troque o conteúdo do `<figure class="teacher-photo">` por uma `<img>` (há um comentário no código). Só com autorização.
- **Modo revisão:** abra `index.html?revisar` para destacar (tracejado laranja) tudo o que ainda precisa de confirmação da escola.

### Antes de publicar
- Abrir o site com `?revisar` e confirmar cada item destacado com a escola (aviso de "poucas vagas", aula experimental, aulas online, "desde 1997", foto).
- Preencher em `privacidade.html` os trechos com fundo amarelo (CNPJ e e-mail para pedidos de privacidade).
- Revisar o aviso de privacidade com a escola. O site carrega fontes do Google Fonts e scripts/dados de jsDelivr e Supabase; isso está descrito no aviso.
- Ao mudar o aviso, atualizar a data nele e `versaoAviso` em `js/config.js`.
