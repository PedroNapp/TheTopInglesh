-- ============================================================
-- 10. GERENCIAMENTO DE IMAGENS (SUPABASE STORAGE)
-- Execute este bloco uma única vez no SQL Editor do Supabase.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.site_imagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    caminho TEXT NOT NULL,
    alt TEXT NOT NULL DEFAULT '',
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_por UUID REFERENCES auth.users(id),
    descricao TEXT NOT NULL DEFAULT '',
    ordem INTEGER NOT NULL DEFAULT 0
);

-- Atualiza instalações que já tinham a tabela criada anteriormente.
ALTER TABLE public.site_imagens
    ADD COLUMN IF NOT EXISTS descricao TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS ordem INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_site_imagens_ordem
    ON public.site_imagens (ordem, nome);

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
