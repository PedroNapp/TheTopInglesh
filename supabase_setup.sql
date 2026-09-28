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
-- ============================================================

INSERT INTO public.site_conteudo
    (secao, elemento, conteudo)
VALUES
    ('inicio', 'heroTitle', 'Seu inglês pode ir mais longe.'),
    ('inicio', 'heroDescription', 'Conheça a The Top English, sua escola de inglês em Palmas, e encontre uma forma de estudo que combine com sua rotina.'),
    ('inicio', 'heroButton', 'Quero estudar'),

    ('escola', 'schoolTitle', 'Conheça a The Top English'),
    ('escola', 'schoolText1', 'A The Top English é uma escola de idiomas voltada ao ensino de inglês. Aqui, o visitante encontra informações sobre a escola, sua metodologia, modalidades de aula e formas de contato.'),
    ('escola', 'schoolText2', 'O site foi pensado para facilitar o primeiro contato de pessoas interessadas em estudar e deixar as principais informações disponíveis em um único lugar.'),
    ('escola', 'schoolCardTitle', 'Inglês para diferentes objetivos'),
    ('escola', 'schoolCardText', 'Conheça as opções de aulas e converse com a escola para verificar a modalidade e a disponibilidade mais adequada.'),

    ('metodologia', 'methodTitle', 'Aprender inglês de forma organizada'),
    ('metodologia', 'methodDescription', 'Consulte as informações da escola e entre em contato para conhecer melhor a proposta das aulas.'),
    ('metodologia', 'method1Title', 'Metodologia'),
    ('metodologia', 'method1Text', 'Informações sobre a proposta de ensino e o funcionamento das aulas.'),
    ('metodologia', 'method2Title', 'Aulas individuais'),
    ('metodologia', 'method2Text', 'Uma opção para quem busca um atendimento mais individualizado.'),
    ('metodologia', 'method3Title', 'Aulas em grupo'),
    ('metodologia', 'method3Text', 'Turmas organizadas conforme disponibilidade e formação dos grupos.'),

    ('modalidades', 'mod1Title', 'Individual'),
    ('modalidades', 'mod1Text', 'Atendimento individual, com horário definido conforme disponibilidade.'),
    ('modalidades', 'mod2Title', 'Em grupo'),
    ('modalidades', 'mod2Text', 'Turmas com organização de horários e disponibilidade de vagas.'),
    ('modalidades', 'mod3Title', 'Consulte a escola'),
    ('modalidades', 'mod3Text', 'Envie seus dados e informe seus horários para verificar as opções disponíveis.'),

    ('contato', 'address', '406 Norte, Av. LO 14, Lote 10 — Palmas - TO'),
    ('contato', 'phone', '(63) 3215-1652'),
    ('contato', 'whatsapp', '(63) 3215-1652');

-- ============================================================
-- FIM DA CONFIGURAÇÃO
-- ============================================================