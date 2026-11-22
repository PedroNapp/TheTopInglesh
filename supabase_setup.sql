-- ============================================================
-- THE TOP ENGLISH
-- CONFIGURAÇÃO DO BANCO DE DADOS - SUPABASE
-- ============================================================
--
-- Este arquivo contém os comandos necessários para configurar
-- a tabela de conteúdo do site, segurança, permissões e
-- usuário administrador.
--
-- IMPORTANTE:
-- 1. Execute este arquivo no SQL Editor do Supabase.
-- 2. Substitua o e-mail do administrador antes de executar.
-- 3. Não coloque a senha do administrador neste arquivo.
-- ============================================================


-- ============================================================
-- 1. CRIAÇÃO DA TABELA
-- ============================================================

CREATE TABLE public.site_conteudo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    secao TEXT NOT NULL,

    elemento TEXT NOT NULL,

    conteudo TEXT NOT NULL DEFAULT '',

    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    atualizado_por UUID REFERENCES auth.users(id)
);


-- ============================================================
-- 2. RESTRIÇÃO DE UNICIDADE
-- ============================================================
--
-- Impede que exista mais de um registro para a mesma
-- combinação de seção + elemento.
--
-- Exemplo:
-- inicio + heroTitle → único
--
-- Isso também é necessário para o UPSERT utilizado
-- pela aplicação.
-- ============================================================

ALTER TABLE public.site_conteudo
ADD CONSTRAINT site_conteudo_secao_elemento_unique
UNIQUE (secao, elemento);


-- ============================================================
-- 3. ATIVAR ROW LEVEL SECURITY (RLS)
-- ============================================================
--
-- Ativa a segurança por linha da tabela.
-- As operações passam a ser controladas pelas políticas
-- definidas abaixo.
-- ============================================================

ALTER TABLE public.site_conteudo
ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 4. POLÍTICA DE LEITURA PÚBLICA
-- ============================================================
--
-- O site público precisa conseguir consultar os conteúdos.
--
-- anon         → visitante não autenticado
-- authenticated → usuário autenticado
-- ============================================================

CREATE POLICY "Publico pode visualizar conteudo"
ON public.site_conteudo
FOR SELECT
TO anon, authenticated
USING (true);


-- ============================================================
-- 5. POLÍTICA DE INSERÇÃO
-- ============================================================
--
-- Somente usuários autenticados que possuem:
--
-- app_metadata.role = "admin"
--
-- podem inserir registros.
-- ============================================================

CREATE POLICY "Admin pode inserir conteudo"
ON public.site_conteudo
FOR INSERT
TO authenticated
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


-- ============================================================
-- 6. POLÍTICA DE EDIÇÃO
-- ============================================================
--
-- Somente administradores podem alterar registros.
--
-- USING:
-- verifica se o registro pode ser alterado.
--
-- WITH CHECK:
-- verifica se o novo registro continua respeitando
-- a regra de administrador.
-- ============================================================

CREATE POLICY "Admin pode editar conteudo"
ON public.site_conteudo
FOR UPDATE
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


-- ============================================================
-- 7. POLÍTICA DE EXCLUSÃO
-- ============================================================
--
-- Somente administradores podem excluir registros.
-- ============================================================

CREATE POLICY "Admin pode excluir conteudo"
ON public.site_conteudo
FOR DELETE
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


-- ============================================================
-- 8. CONFIGURAR O USUÁRIO ADMINISTRADOR
-- ============================================================
--
-- IMPORTANTE:
-- Substitua "seu-email@exemplo.com" pelo e-mail real
-- utilizado na conta administrativa.
--
-- Não coloque a senha aqui.
-- A senha deve ser gerenciada pelo Supabase Auth.
-- ============================================================

UPDATE auth.users
SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb)
    || '{"role": "admin"}'::jsonb
WHERE email = 'seu-email@exemplo.com';


-- ============================================================
-- 9. REMOVER PERMISSÕES PADRÃO DA TABELA
-- ============================================================
--
-- Remove permissões anteriormente concedidas aos papéis
-- anon e authenticated.
--
-- Depois disso, serão concedidas somente as permissões
-- necessárias.
-- ============================================================

REVOKE ALL PRIVILEGES
ON TABLE public.site_conteudo
FROM anon;

REVOKE ALL PRIVILEGES
ON TABLE public.site_conteudo
FROM authenticated;


-- ============================================================
-- 10. PERMISSÃO DE LEITURA
-- ============================================================
--
-- Visitantes e usuários autenticados podem consultar
-- os conteúdos.
--
-- A permissão de leitura é combinada com a política RLS.
-- ============================================================

GRANT SELECT
ON TABLE public.site_conteudo
TO anon, authenticated;


-- ============================================================
-- 11. PERMISSÕES DE ESCRITA
-- ============================================================
--
-- Usuários autenticados recebem as permissões necessárias
-- para que o administrador possa inserir, alterar e excluir.
--
-- A RLS continua responsável por determinar quem realmente
-- pode executar essas operações.
-- ============================================================

GRANT INSERT, UPDATE, DELETE
ON TABLE public.site_conteudo
TO authenticated;

-- ============================================================
-- 12. CONTEÚDO INICIAL DO SITE
-- Atualização idempotente do conteúdo inicial, alinhada ao fallback em admin/js/dados.js.
INSERT INTO public.site_conteudo (secao, elemento, conteudo) VALUES
  ('inicio', 'heroTitle', 'Inglês com experiência.'),
  ('inicio', 'heroDescription', 'Há mais de duas décadas ensinando inglês, a The Top English oferece aulas para diferentes níveis, idades e objetivos, com acompanhamento próximo da teacher.'),
  ('inicio', 'heroButton', 'Quero estudar'),
  ('escola', 'schoolTitle', 'Uma escola construída ao longo de anos de experiência.'),
  ('escola', 'schoolText1', 'A The Top English é uma escola de inglês em Palmas que atua desde 1997. Ao longo dessa trajetória, o ensino foi construído com acompanhamento próximo dos alunos e atenção às necessidades de cada turma.'),
  ('escola', 'schoolText2', 'Aqui, o aluno pode conhecer as opções de cursos, informar seus objetivos e horários e conversar diretamente com a escola para encontrar a alternativa mais adequada.'),
  ('escola', 'schoolCardTitle', 'Inglês para diferentes objetivos'),
  ('escola', 'schoolCardText', 'Conheça as opções de aulas e converse com a escola para verificar a modalidade e a disponibilidade mais adequada.'),
  ('metodologia', 'methodTitle', 'Aprender inglês para se comunicar de verdade.'),
  ('metodologia', 'methodDescription', 'A The Top English utiliza a metodologia Cambridge Interchange, baseada em uma abordagem comunicativa que prioriza a prática do inglês em situações do mundo real.'),
  ('metodologia', 'method1Title', 'Abordagem comunicativa'),
  ('metodologia', 'method1Text', 'A prática do inglês é relacionada a situações do mundo real, aproximando o aprendizado do uso cotidiano do idioma.'),
  ('metodologia', 'method2Title', 'Fluência e exatidão'),
  ('metodologia', 'method2Text', 'O curso busca desenvolver a fluência e a precisão do aluno durante a comunicação em inglês.'),
  ('metodologia', 'method3Title', 'Habilidades do idioma'),
  ('metodologia', 'method3Text', 'A aprendizagem explora as habilidades necessárias para o desenvolvimento do aluno no domínio de um novo idioma.'),
  ('modalidades', 'mod1Title', 'Curso Regular'),
  ('modalidades', 'mod1Text', 'Aprenda inglês desde os primeiros passos até níveis avançados, desenvolvendo sua comunicação e confiança para utilizar o idioma no dia a dia.'),
  ('modalidades', 'mod2Title', 'Inglês Infantil'),
  ('modalidades', 'mod2Text', 'Um primeiro contato com o inglês, estimulando o aprendizado e a familiaridade com o idioma desde a infância.'),
  ('modalidades', 'mod3Title', 'Aulas Individuais'),
  ('modalidades', 'mod3Text', 'Aulas personalizadas de acordo com seus objetivos, nível de inglês e necessidades, com maior flexibilidade de horários.'),
  ('valores', 'price1Name', 'Infantil'),
  ('valores', 'price1Value', '6x de R$ 215,00'),
  ('valores', 'price2Name', 'Iniciante A'),
  ('valores', 'price2Value', '6x de R$ 215,00'),
  ('valores', 'price3Name', 'Iniciante B'),
  ('valores', 'price3Value', '6x de R$ 255,00'),
  ('valores', 'price4Name', 'Intermediário'),
  ('valores', 'price4Value', '6x de R$ 295,00'),
  ('valores', 'price5Name', 'Avançado'),
  ('valores', 'price5Value', '6x de R$ 335,00'),
  ('valores', 'price6Name', 'Passages 1'),
  ('valores', 'price6Value', '6x de R$ 365,00'),
  ('valores', 'price7Name', 'Passages 2'),
  ('valores', 'price7Value', '6x de R$ 395,00'),
  ('valores', 'price8Name', 'Individual'),
  ('valores', 'price8Value', '6x de R$ 500,00'),
  ('valores', 'price9Name', 'TOEFL'),
  ('valores', 'price9Value', '6x de R$ 600,00'),
  ('valores', 'price10Name', 'IELTS'),
  ('valores', 'price10Value', '6x de R$ 600,00'),
  ('valores', 'price11Name', 'Aula de reforço'),
  ('valores', 'price11Value', 'R$ 65,00'),
  ('valores', 'price12Name', 'Preparatório para Mestrado'),
  ('valores', 'price12Value', 'Valor negociável conforme as necessidades do aluno.'),
  ('valores', 'pricesNote', 'Os valores podem variar conforme o curso, formato da aula e disponibilidade de turma.'),
  ('contato', 'address', '406 Norte, Av. LO 14, Lote 10 — Palmas - TO'),
  ('contato', 'phone', '(63) 98136-9088'),
  ('contato', 'whatsapp', '(63) 98136-9088')
ON CONFLICT (secao, elemento) DO UPDATE SET
  conteudo = EXCLUDED.conteudo,
  atualizado_em = NOW();

-- FIM DA CONFIGURAÇÃO


-- ============================================================
-- 10. GERENCIAMENTO DE IMAGENS (SUPABASE STORAGE)
-- Execute este bloco uma única vez no SQL Editor do Supabase.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.site_imagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL DEFAULT '',
    caminho TEXT NOT NULL,
    alt TEXT NOT NULL DEFAULT '',
    ordem INTEGER NOT NULL DEFAULT 0,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_por UUID REFERENCES auth.users(id)
);

-- Garante compatibilidade com instalações anteriores da tabela.
ALTER TABLE public.site_imagens
    ADD COLUMN IF NOT EXISTS descricao TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS ordem INTEGER NOT NULL DEFAULT 0;

-- Descrição padrão da imagem local que inicia a galeria.
UPDATE public.site_imagens
SET descricao = 'Um espaço preparado para proporcionar uma experiência agradável de aprendizagem.',
    alt = COALESCE(NULLIF(alt, ''), 'Alunos e a teacher Maureen em volta da mesa na sala de aula da The Top English')
WHERE chave IN ('escola_galeria', 'galeria_sala-de-aula')
  AND (descricao IS NULL OR descricao = '');

ALTER TABLE public.site_imagens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Publico pode visualizar imagens cadastradas" ON public.site_imagens;
CREATE POLICY "Publico pode visualizar imagens cadastradas"
ON public.site_imagens FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admin pode inserir imagens cadastradas" ON public.site_imagens;
CREATE POLICY "Admin pode inserir imagens cadastradas"
ON public.site_imagens FOR INSERT TO authenticated
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admin pode editar imagens cadastradas" ON public.site_imagens;
CREATE POLICY "Admin pode editar imagens cadastradas"
ON public.site_imagens FOR UPDATE TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admin pode excluir imagens cadastradas" ON public.site_imagens;
CREATE POLICY "Admin pode excluir imagens cadastradas"
ON public.site_imagens FOR DELETE TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('imagens-site', 'imagens-site', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Publico pode visualizar imagens do site" ON storage.objects;
CREATE POLICY "Publico pode visualizar imagens do site"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'imagens-site');

DROP POLICY IF EXISTS "Admin pode enviar imagens do site" ON storage.objects;
CREATE POLICY "Admin pode enviar imagens do site"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'imagens-site'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

DROP POLICY IF EXISTS "Admin pode atualizar imagens do site" ON storage.objects;
CREATE POLICY "Admin pode atualizar imagens do site"
ON storage.objects FOR UPDATE TO authenticated
USING (
    bucket_id = 'imagens-site'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    bucket_id = 'imagens-site'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

DROP POLICY IF EXISTS "Admin pode excluir imagens do site" ON storage.objects;
CREATE POLICY "Admin pode excluir imagens do site"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'imagens-site'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
