/**
 * Sandro Olo Paulino — Portfolio Landing Page
 * Configuração principal
 */
const CONFIG = {
  // Altere para o número real do WhatsApp (código do país + DDD + número, sem espaços ou símbolos)
  whatsappNumber: '5511993843863',
  whatsappMessage: 'Olá Sandro! Vi seu site e gostaria de agendar uma conversa.',
};

const pageLocks = new Set();

function setPageLock(reason, shouldLock) {
  if (shouldLock) {
    pageLocks.add(reason);
  } else {
    pageLocks.delete(reason);
  }
  document.body.classList.toggle('is-locked', pageLocks.size > 0);
}

/* ---- WhatsApp Links ---- */
function getWhatsAppUrl(message) {
  const encoded = encodeURIComponent(message || CONFIG.whatsappMessage);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
}

function initWhatsApp() {
  const links = [
    document.getElementById('contatoWhatsapp'),
    document.getElementById('whatsappMenuBtn'),
  ];

  links.forEach((link) => {
    if (link) link.href = getWhatsAppUrl();
  });

  const fab = document.getElementById('whatsappFab');
  const menu = document.getElementById('whatsappMenu');
  if (!fab || !menu) return;

  function closeMenu() {
    menu.classList.remove('open');
    fab.classList.remove('active');
    fab.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  fab.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    fab.classList.toggle('active', isOpen);
    fab.setAttribute('aria-expanded', isOpen);
    menu.setAttribute('aria-hidden', !isOpen);
  });

  document.addEventListener('click', (e) => {
    const widget = document.getElementById('whatsappWidget');
    if (widget && !widget.contains(e.target) && menu?.classList.contains('open')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
}

/* ---- Contact Form → WhatsApp ---- */
function initContactForm() {
  const form = document.getElementById('contatoForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nomeField = document.getElementById('nome');
    const telefoneField = document.getElementById('telefone');
    const mensagemField = document.getElementById('mensagem');
    const status = document.getElementById('formStatus');

    const nome = nomeField.value.trim();
    const telefone = telefoneField.value.trim();
    const mensagem = mensagemField.value.trim();
    const phoneDigits = telefone.replace(/\D/g, '');

    [nomeField, telefoneField, mensagemField].forEach((field) => {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
    });
    status.className = 'form-status';
    status.textContent = '';

    const invalidFields = [];
    if (nome.length < 2) invalidFields.push(nomeField);
    if (phoneDigits.length < 10) invalidFields.push(telefoneField);
    if (mensagem.length < 8) invalidFields.push(mensagemField);

    if (invalidFields.length) {
      invalidFields.forEach((field) => {
        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');
      });
      status.classList.add('error');
      status.textContent = 'Confira os campos destacados antes de enviar.';
      invalidFields[0].focus();
      return;
    }

    const text = `Olá Sandro! Meu nome é ${nome}.\nTelefone: ${telefone}\n\n${mensagem}`;
    status.classList.add('success');
    status.textContent = 'Abrindo WhatsApp para revisar sua mensagem...';
    window.open(getWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  });
}

/* ---- Mobile Menu ---- */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const links = nav?.querySelectorAll('.nav__link');
  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    setPageLock('menu', false);
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    setPageLock('menu', isOpen);
  });

  links?.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
  });
}

/* ---- Header Scroll ---- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- Active Nav Link ---- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---- Scroll Reveal ---- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const heroReveals = document.querySelectorAll('.hero .reveal');

  heroReveals.forEach((el, index) => {
    el.style.transitionDelay = `${index * 80}ms`;
    requestAnimationFrame(() => el.classList.add('visible'));
  });

  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('visible'));
    return;
  }

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: isMobile ? 0.05 : 0.15,
      rootMargin: isMobile ? '0px' : '0px 0px -40px 0px',
    }
  );

  reveals.forEach((el) => {
    if (!el.closest('.hero')) observer.observe(el);
  });
}

/* ---- Testimonials Slider ---- */
function initTestimonials() {
  const slider = document.getElementById('depoimentosSlider');
  const dotsContainer = document.getElementById('depoimentosDots');
  if (!slider || !dotsContainer) return;

  const items = slider.querySelectorAll('.depoimento');
  let current = 0;
  let interval;

  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
    if (i === 0) {
      dot.classList.add('active');
      dot.setAttribute('aria-current', 'true');
    }
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('button');

  function goTo(index) {
    items[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].removeAttribute('aria-current');
    current = index;
    items[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-current', 'true');
    resetInterval();
  }

  function next() {
    goTo((current + 1) % items.length);
  }

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(next, 6000);
  }

  resetInterval();
  slider.addEventListener('mouseenter', () => clearInterval(interval));
  slider.addEventListener('mouseleave', resetInterval);
  slider.addEventListener('focusin', () => clearInterval(interval));
  slider.addEventListener('focusout', resetInterval);
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  initWhatsApp();
  initContactForm();
  initMobileMenu();
  initHeaderScroll();
  initActiveNav();
  initScrollReveal();
  initTestimonials();
});
