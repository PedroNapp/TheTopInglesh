import { supabase } from "./supabase.js";

const FALLBACK_WHATSAPP = "5563981369088";
const DEFAULT_MESSAGE = "Olá! Vim pelo site e gostaria de informações sobre as aulas.";

function normalizarNumero(valor) {
  const digits = String(valor || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function formatarNumeroVisivel(valor) {
  let digits = String(valor || "").replace(/\D/g, "");
  if (digits.startsWith("55")) digits = digits.slice(2);
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return valor;
}

async function atualizarLinksWhatsApp() {
  let valor = FALLBACK_WHATSAPP;
  try {
    const { data, error } = await supabase
      .from("site_conteudo")
      .select("conteudo")
      .eq("secao", "contato")
      .eq("elemento", "whatsapp")
      .maybeSingle();
    if (error) throw error;
    if (data?.conteudo) valor = data.conteudo;
  } catch (error) {
    console.warn("Usando o WhatsApp de contingência:", error);
  }

  const numero = normalizarNumero(valor);
  if (!numero) return;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    if (link.hasAttribute("data-whatsapp-display")) {
      link.textContent = formatarNumeroVisivel(valor);
    }
  });
}

atualizarLinksWhatsApp();
