/**
 * Google Analytics 4 — carregamento e eventos de conversão
 * Depende de analytics-config.js (ANALYTICS_CONFIG)
 */

function isGa4Enabled() {
  const id = typeof ANALYTICS_CONFIG !== 'undefined' && ANALYTICS_CONFIG.ga4MeasurementId;
  return Boolean(id && /^G-[A-Z0-9]+$/i.test(String(id).trim()));
}

function getGa4Id() {
  return ANALYTICS_CONFIG.ga4MeasurementId.trim();
}

function initGoogleAnalytics() {
  if (!isGa4Enabled()) return;

  const id = getGa4Id();
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, {
    anonymize_ip: true,
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

/** Dispara evento no GA4 (silencioso se não configurado) */
window.trackEvent = function trackEvent(eventName, params) {
  if (typeof window.gtag === 'function' && isGa4Enabled()) {
    window.gtag('event', eventName, params || {});
  }
};

function initConversionTracking() {
  document.addEventListener('click', (e) => {
    const whatsappLink = e.target.closest(
      '#contatoWhatsapp, #whatsappMenuBtn, .btn--whatsapp, .whatsapp-menu__btn'
    );
    if (whatsappLink) {
      trackEvent('whatsapp_click', {
        event_category: 'contato',
        event_label: whatsappLink.id || whatsappLink.textContent.trim().slice(0, 40),
        page_path: window.location.pathname,
      });
    }

    const ctaPrimary = e.target.closest('a.btn--primary[href*="#contato"], a.btn--primary[href*="contato"]');
    if (ctaPrimary && !whatsappLink) {
      trackEvent('cta_contato_click', {
        event_category: 'contato',
        event_label: ctaPrimary.textContent.trim().slice(0, 40),
        page_path: window.location.pathname,
      });
    }

    const articleLink = e.target.closest('.post-card__more, .para-quem__link, .article-cta a');
    if (articleLink) {
      trackEvent('article_cta_click', {
        event_category: 'engajamento',
        event_label: articleLink.getAttribute('href') || '',
        page_path: window.location.pathname,
      });
    }
  });

  const form = document.getElementById('contatoForm');
  if (form) {
    form.addEventListener('submit', () => {
      trackEvent('formulario_contato_enviado', {
        event_category: 'contato',
        event_label: 'formulario_whatsapp',
        page_path: window.location.pathname,
      });
    });
  }
}

function initScrollDepthTracking() {
  if (!isGa4Enabled()) return;

  const thresholds = [25, 50, 75, 90];
  const fired = new Set();

  function onScroll() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    if (height <= 0) return;

    const percent = Math.round((scrollTop / height) * 100);
    thresholds.forEach((t) => {
      if (percent >= t && !fired.has(t)) {
        fired.add(t);
        trackEvent('scroll_depth', {
          event_category: 'engajamento',
          percent_scrolled: t,
          page_path: window.location.pathname,
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

initGoogleAnalytics();

document.addEventListener('DOMContentLoaded', () => {
  initConversionTracking();
  initScrollDepthTracking();
});
