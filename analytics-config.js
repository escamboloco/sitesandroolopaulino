/**
 * ═══════════════════════════════════════════════════════════════
 *  CONFIGURAÇÃO GOOGLE — edite apenas este arquivo
 * ═══════════════════════════════════════════════════════════════
 *
 *  GOOGLE ANALYTICS (GA4)
 *  ─────────────────────
 *  1. Acesse https://analytics.google.com
 *  2. Admin → Criar propriedade → Fluxo de dados "Web"
 *  3. Copie o ID de métrica (formato G-XXXXXXXXXX)
 *  4. Cole abaixo em ga4MeasurementId
 *
 *  GOOGLE SEARCH CONSOLE
 *  ─────────────────────
 *  1. Acesse https://search.google.com/search-console
 *  2. Adicionar propriedade → Prefixo do URL:
 *     https://sitesandroolopaulino.onrender.com
 *  3. Verificação → "Tag HTML" → copie o código do content=""
 *  4. Cole o MESMO código em:
 *     - googleSiteVerification (abaixo)
 *     - index.html → meta name="google-site-verification" content=""
 *  5. Após verificar, vá em Sitemaps e envie:
 *     https://sitesandroolopaulino.onrender.com/sitemap.xml
 *
 */
const ANALYTICS_CONFIG = {
  /** ID do Google Analytics 4 — ex: 'G-ABC123XYZ' */
  ga4MeasurementId: '',

  /** Código de verificação do Search Console (apenas referência; o meta em index.html é obrigatório) */
  googleSiteVerification: '',
};
