# Como atualizar o site

Guia rápido para as mudanças do dia a dia. Não é preciso saber programar: basta editar texto com cuidado.

## Como editar um arquivo

Com o site no GitHub:

1. Abra o repositório e clique no arquivo, por exemplo `index.html`.
2. Clique no lápis (**Edit this file**).
3. Use **Ctrl+F** (ou **Cmd+F** no Mac) para achar o trecho.
4. Troque só o texto entre as marcações. Não apague os `<` `>` nem as aspas.
5. Clique em **Commit changes**. Em cerca de um minuto o site é atualizado.

Na dúvida, mude uma coisa por vez e confira o site depois.

## Trocar o número do WhatsApp

O número atual é (63) 98136-9088. Se mudar, troque nestes lugares:

1. `js/config.js`, linha `whatsapp`. Use só números, com 55 + DDD + número. É este que faz os botões e o formulário funcionarem:

```js
whatsapp: '5563981369088',
```

2. `index.html`, seção `Onde estamos`: o número escrito e o link `https://wa.me/55…`.
3. `index.html`, linha `"telephone"` nos dados para o Google (perto do topo do arquivo).
4. `privacidade.html`, seção “Seus direitos”.

## Atualizar o aviso do topo

O aviso fica no início do `index.html`, dentro do elemento com a classe `notice`.
Atualmente, o texto informa sobre novas turmas e horários.

Para alterar a mensagem, edite o texto e o link dentro de:

```html
<div class="notice">
  <p class="container notice-inner">
    <strong>Novas turmas e horários:</strong>
    consulte a disponibilidade para este semestre.
    <a href="#interesse">Ver opções de horário →</a>
  </p>
</div>
```

Para ocultar temporariamente o aviso, acrescente o atributo `hidden` ao elemento
`div.notice`. Para exibi-lo novamente, remova esse atributo.

## Mudar a descrição de um curso

Arquivo `index.html`. Procure pelo nome do curso (por exemplo, `Preparatório IELTS`) e troque o texto do parágrafo logo abaixo.

## Trocar o logo ou o ícone do site

O logo utilizado no cabeçalho está em `assets/brand/logo-top-english.png`.
Para substituí-lo:

1. Salve a nova imagem na pasta `assets/brand/`, mantendo um nome de arquivo claro.
2. No `index.html`, localize a imagem dentro do link com a classe `brand`.
3. Atualize o valor de `src` para o caminho da nova imagem e revise o texto alternativo (`alt`).
4. Confira também o logo na página `privacidade.html`, caso ele seja utilizado nela.
5. Abra o site em desktop e celular para conferir tamanho, proporção e legibilidade.

O ícone da aba do navegador é definido no `index.html` por `assets/brand/globo.png`.
Se ele for substituído, atualize o caminho do `href` na tag `link rel="icon"`.

## Trocar a foto da teacher

A foto exibida na seção da professora está em `assets/fotos/maureen.jpeg`.

Para substituí-la:

1. Salve a nova fotografia em `assets/fotos/`.
2. No `index.html`, localize a seção `id="professora"` e o elemento `figure` com a classe `teacher-photo`.
3. Atualize o caminho do atributo `src` da imagem e revise o texto alternativo (`alt`).
4. Mantenha as dimensões e o atributo `loading="lazy"` ou ajuste-os de acordo com a nova imagem.
5. Publique somente fotografias autorizadas pela pessoa retratada e confira a apresentação em celular e computador.

## Atualizar a galeria da seção “A escola”

A galeria é configurada em `js/galeriaSobre.js`, no array `galleryImages`.

Cada fotografia deve ter os campos `src`, `alt`, `title` e `description`. Exemplo:

```js
{
  src: "assets/fotos/nova-foto.jpg",
  alt: "Descrição objetiva do que aparece na fotografia",
  title: "Título da imagem",
  description: "Breve descrição da fotografia.",
},
```

Antes de adicionar uma imagem, coloque o arquivo na pasta `assets/fotos/` e confira se o caminho informado em `src` corresponde ao nome e à extensão do arquivo. Use apenas imagens autorizadas pela escola e evite incluir fotografias de alunos sem autorização adequada.

## Depoimentos

A versão atual do `index.html` não possui uma seção de depoimentos ativa. Não adicione
avaliações ou falas fictícias. Caso a escola queira incluir depoimentos futuramente,
solicite textos reais e autorização de publicação dos alunos ou responsáveis antes
de desenvolver e publicar essa seção.

## Endereço e horário de atendimento

No `index.html`, seção `Onde estamos`. Troque também o link do botão **Como chegar** pelo link do endereço no Google Maps. No Maps, busque a escola e use **Compartilhar → Copiar link**.

## Acompanhar as consultas na planilha

Cada consulta enviada pelo site vira uma linha na aba **Interessados**. Atualize a coluna **Status** conforme o atendimento avança: Contatado, Aula experimental, Matriculado ou Sem horário. É ela que mostra quantas consultas viraram matrícula.

As consultas com mais de 6 meses são apagadas sozinhas, como diz o aviso de privacidade.

## Conferir o que falta

Abra o site com `?revisar` no fim do endereço, por exemplo `https://thetopenglish.com.br/?revisar`. Tudo que ainda precisa ser confirmado aparece tracejado.
