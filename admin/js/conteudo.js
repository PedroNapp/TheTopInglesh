import { supabase } from "../../js/supabase.js";
import { DEFAULT_DATA } from "./dados.js";

export async function carregarConteudo() {
  const { data, error } = await supabase
    .from("site_conteudo")
    .select("secao, elemento, conteudo");

  if (error) {
    console.error("Erro ao carregar conteúdo:", error);
    return { ...DEFAULT_DATA };
  }

  const resultado = { ...DEFAULT_DATA };

  data.forEach((item) => {
    if (item.elemento in resultado) {
      resultado[item.elemento] = item.conteudo;
    }
  });

  return resultado;
}

export async function salvarConteudo(data, secao, user) {
  const elementosDaSecao = Object.keys(data).filter(
    (elemento) => descobrirSecao(elemento) === secao,
  );

  const registros = elementosDaSecao.map((elemento) => ({
    secao,
    elemento,
    conteudo: data[elemento],
    atualizado_em: new Date().toISOString(),
    atualizado_por: user.id,
  }));

  return await supabase.from("site_conteudo").upsert(registros, {
    onConflict: "secao,elemento",
  });
}

export async function restaurarConteudo(user) {
  const registros = Object.keys(DEFAULT_DATA).map((elemento) => ({
    secao: descobrirSecao(elemento),
    elemento,
    conteudo: DEFAULT_DATA[elemento],
    atualizado_em: new Date().toISOString(),
    atualizado_por: user.id,
  }));

  return await supabase.from("site_conteudo").upsert(registros, {
    onConflict: "secao,elemento",
  });
}

export function descobrirSecao(elemento) {
  if (elemento.startsWith("hero")) {
    return "inicio";
  }

  if (elemento.startsWith("school")) {
    return "escola";
  }

  if (elemento.startsWith("method")) {
    return "metodologia";
  }

  if (elemento.startsWith("mod")) {
    return "modalidades";
  }

  if (["address", "phone", "whatsapp"].includes(elemento)) {
    return "contato";
  }

  return "geral";
}
