# The Top English — Website institucional

Website institucional da The Top English, escola presencial de inglês em Palmas.
O site apresenta a escola, sua metodologia, cursos, valores, dúvidas frequentes e
canais de contato, além de oferecer um formulário para captação de interessados.

## Acesso

- **Site oficial:** https://thetopenglish.com.br/
- **Repositório:** https://github.com/PedroNapp/TheTopInglesh
- **Perfil da Empresa no Google:** https://share.google/6XTl6AaxCCsPPXEVZ

## Funcionalidades

- Apresentação institucional, metodologia e cursos.
- Consulta de valores e perguntas frequentes.
- Formulário de interesse com validação, máscara de telefone e campos condicionais.
- Preparação de mensagem para contato pelo WhatsApp.
- Registro dos interessados no Google Sheets por meio do Google Apps Script.
- Galeria de imagens e layout adaptável a diferentes tamanhos de tela.
- Página de privacidade e página de erro 404.
- Modo de revisão de conteúdo, acessível acrescentando `?revisar` ao endereço.
- Estrutura de painel administrativo em `admin/`, com integração ao Supabase.

## Estrutura principal

| Caminho | Finalidade |
|---|---|
| `index.html` | Página institucional principal. |
| `style.css` | Estilos e regras de responsividade do website. |
| `script.js` | Comportamentos gerais, como menu e navegação. |
| `js/formulario.js` | Validação e processamento do formulário de interessados. |
| `js/config.js` | Configurações usadas pelo formulário e pelos recursos de contato. |
| `js/extras.js` | Recursos complementares, incluindo o botão flutuante e modo de revisão. |
| `js/galeriaSobre.js` | Conteúdo e navegação da galeria da seção “A escola”. |
| `js/supabase.js` e `js/admin-integracao.js` | Integração do website com a estrutura administrativa. |
| `admin/` | Interface e scripts do painel administrativo. |
| `apps-script/Code.gs` | Código do Google Apps Script que recebe os dados do formulário. |
| `supabase_setup.sql` | Estrutura SQL usada na configuração do Supabase. |
| `privacidade.html` | Aviso de privacidade. |
| `404.html` | Página apresentada para endereços não encontrados. |
| `assets/` | Logos, imagens, fontes e demais recursos visuais. |
| `COMO-ATUALIZAR.md` | Orientações para manutenção de conteúdos e configurações. |

## Formulário e planilha

O formulário coleta informações de pessoas interessadas nos cursos. Após a validação,
prepara uma mensagem para o WhatsApp e envia os dados para o endpoint do Google Apps
Script configurado em `js/config.js`.

Para configurar ou conferir a integração:

1. Acesse a conta Google responsável pela planilha.
2. Confira a implantação do Apps Script como aplicativo da web.
3. Verifique se a URL de implantação terminada em `/exec` está configurada em `planilhaUrl`,
   no arquivo `js/config.js`.
4. Confira se o script publicado corresponde ao arquivo `apps-script/Code.gs`.
5. Faça um envio de teste e confirme o registro na aba de interessados.

A rotina de limpeza automática prevista no Apps Script deve ser conferida na própria conta
Google. A existência da função no código, isoladamente, não confirma que o acionador foi
ativado.

## Painel administrativo

O projeto contém uma interface administrativa em `admin/` e arquivos de integração com
Supabase. A utilização desse painel depende da configuração do projeto Supabase, das
credenciais e das permissões correspondentes. Antes de disponibilizá-lo para uso, é
necessário testar o fluxo de autenticação e as operações administrativas.

## Desenvolvimento e publicação

O código é versionado no GitHub. A publicação do website utiliza o domínio oficial
`thetopenglish.com.br`. Alterações devem ser testadas localmente e conferidas após a
publicação, principalmente nos tamanhos de tela mobile e desktop.

## Documentação complementar

Consulte [`COMO-ATUALIZAR.md`](COMO-ATUALIZAR.md) para orientações de atualização de
textos, cursos, contatos, imagens e acompanhamento dos interessados.
