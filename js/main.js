/* ─────────────────────────────────────────────────────────────
   Erion Sistemas — Landing
   Page interactions. Loaded with `defer`, so DOM is ready.
   Each block is self-contained and exits early if its target
   isn't in the page.
   ───────────────────────────────────────────────────────────── */

/* ─── Logo assembly animation ─── */
(function () {
  const cx = 272.5,
    cy = 272.5;
  const pieces = [
    { angle: -180, tx: 40, ty: 80, delay: 0 },
    { angle: 135, tx: -80, ty: -40, delay: 120 },
    { angle: -135, tx: 80, ty: -40, delay: 240 },
    { angle: 270, tx: 0, ty: 0, delay: 360 },
    { angle: 180, tx: -40, ty: -80, delay: 480 },
  ];
  function play(mark) {
    const paths = mark.querySelectorAll('.lp');
    paths.forEach((el, idx) => {
      const p = pieces[idx] || pieces[0];
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transformOrigin = cx + 'px ' + cy + 'px';
      el.style.transformBox = 'view-box';
      el.style.transform = `translate(${p.tx}px, ${p.ty}px) rotate(${p.angle}deg)`;
      el.getBoundingClientRect();
      setTimeout(() => {
        el.style.transition =
          'transform 0.7s cubic-bezier(0.34,1.3,0.64,1), opacity 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translate(0,0) rotate(0deg)';
      }, p.delay + 40);
    });
  }
  document.querySelectorAll('.brand-mark[data-logo-anim]').forEach(play);
})();

/* ─── Hero typing animation ─── */
(function () {
  const el = document.getElementById('typeText');
  if (!el) return;
  const phrases = [
    'com facilidade.',
    'com confiança.',
    'sem preocupações.',
    'com agilidade.',
    'sem complicação.',
  ];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    el.textContent = phrases[0];
    return;
  }
  let pi = 0,
    ci = 0,
    deleting = false;
  function tick() {
    const word = phrases[pi];
    if (!deleting) {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) {
        deleting = true;
        return setTimeout(tick, 1900);
      }
      setTimeout(tick, 62 + Math.random() * 55);
    } else {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        return setTimeout(tick, 380);
      }
      setTimeout(tick, 34);
    }
  }
  tick();
})();

/* ─── Hero floating notification — cycle messages ─── */
(function () {
  const ping = document.getElementById('heroPing');
  if (!ping) return;
  const textEl = ping.querySelector('.hs-ping-text');
  if (!textEl) return;
  const messages = [
    'NFC-e #28471 autorizada · R$ 426,26',
    'PIX recebido · R$ 89,90',
    'Venda #4582 finalizada · Caixa 02',
    'Estoque atualizado · 14 itens',
    'NF-e #00921 autorizada · SEFAZ',
  ];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  let i = 0;
  setInterval(() => {
    ping.classList.add('is-swapping');
    setTimeout(() => {
      i = (i + 1) % messages.length;
      textEl.textContent = messages[i];
      ping.classList.remove('is-swapping');
    }, 280);
  }, 3500);
})();

/* ─── Close <details>/dropdowns when clicking outside ─── */
document.addEventListener('click', (e) => {
  document.querySelectorAll('details.dropdown[open]').forEach((d) => {
    if (!d.contains(e.target)) d.removeAttribute('open');
  });
});

/* ─── Screens slideshow (auto-cycle, dot navigation) ─── */
(function () {
  const wrap = document.querySelector('[data-screens]');
  if (!wrap) return;
  const cards = wrap.querySelectorAll('.screen-card');
  const dots = wrap.querySelectorAll('.screen-dot');
  let i = 0,
    timer = null;
  function go(n) {
    i = (n + cards.length) % cards.length;
    cards.forEach((c, idx) => c.classList.toggle('is-active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
  }
  function tick() {
    go(i + 1);
  }
  function start() {
    stop();
    timer = setInterval(tick, 4200);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  dots.forEach((d) =>
    d.addEventListener('click', () => {
      go(parseInt(d.dataset.go, 10));
      start();
    }),
  );
  wrap.addEventListener('mouseenter', stop);
  wrap.addEventListener('mouseleave', start);
  start();
})();

/* ─── Mobile nav toggle ─── */
(function () {
  const nav = document.querySelector('.nav');
  const btn = nav && nav.querySelector('.nav-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  nav.querySelectorAll('.nav-link').forEach((a) => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ─── FAQ accordion ─── */
document.querySelectorAll('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document
      .querySelectorAll('.faq-item')
      .forEach((i) => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ─── NF-e flow demo loop ─── */
(function () {
  const steps = Array.from(
    document.querySelectorAll('#nfeFlow .nfe-flow-step'),
  );
  if (!steps.length) return;
  let i = 0;
  function tick() {
    steps.forEach((s, idx) => {
      s.classList.remove('active', 'done');
      const check = s.querySelector('.check');
      if (check) check.remove();
      if (idx < i) {
        s.classList.add('done');
        const timeEl = s.querySelector('.time');
        if (timeEl) {
          const c = document.createElement('span');
          c.className = 'check';
          c.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        }
      } else if (idx === i) {
        s.classList.add('active');
      }
    });
    i = (i + 1) % (steps.length + 1);
  }
  tick();
  setInterval(tick, 1100);
})();

/* ─── Feature modal (sistema deep-dive) ─── */
(function () {
  const modal = document.getElementById('featureModal');
  if (!modal || !modal.showModal) return;
  const triggers = document.querySelectorAll('.feature[data-feature]');
  if (!triggers.length) return;

  const closeBtn = modal.querySelector('.feature-modal-close');
  const visual = document.getElementById('featureModalVisual');
  const eyebrow = document.getElementById('featureModalEyebrow');
  const titleEl = document.getElementById('featureModalTitle');
  const descEl = document.getElementById('featureModalDesc');
  const listEl = document.getElementById('featureModalList');

  const DATA = {
    nfe: {
      eyebrow: 'Módulo · Fiscal',
      title: 'NF-e / NFC-e / NFS-e — emissão sem dor de cabeça',
      desc: 'Tudo certificado pela SEFAZ. Emite, transmite, contingencia e envia o XML automaticamente pro contador.',
      bullets: [
        'Modo contingência offline — vende mesmo sem internet',
        'Cancelamento, inutilização e carta de correção em 2 cliques',
        'DANFE em PDF e impressão',
        'Envio mensal de XMLs por e-mail pro contador',
      ],
      image: 'assets/cards/1.webp',
      imageAlt: 'Emissão de nota fiscal e cupom fiscal',
      mock: `...`,
    },
    pdv: {
      eyebrow: 'Módulo · Vendas',
      title: 'PDV — feche venda em 8 segundos',
      desc: 'Frente de caixa otimizada pra teclado, leitor de código de barras e múltiplos meios de pagamento.',
      bullets: [
        'Atalhos no teclado pra endereço de entrega, importar kits, consultar preços, finalizar',
        'PIX, débito, crédito, dinheiro, crediário e múltiplo',
        'Sangria, suprimento e fechamento de caixa por operador',
        'Maquininha avulsa',
      ],
      image: 'assets/cards/2.webp',
      imageAlt: 'Vendas otimizadas',
      mock: `...`,
    },
    mdfe: {
      eyebrow: 'Módulo · Transporte',
      title: 'MDF-e e CT-e — quem expede precisa.',
      desc: 'Manifesto eletrônico de documentos fiscais e conhecimento de transporte para frotas próprias ou contratadas.',
      bullets: [
        'Vincula automaticamente as NF-e que estão sendo transportadas',
        'Encerramento de MDF-e na entrega',
        'CT-e para transportadores parceiros',
        'Geração de DACTE e DAMDFE em PDF',
      ],
      image: 'assets/cards/3.webp',
      imageAlt: 'Emissão de conhecimento e manifesto',
      mock: `...`,
    },
    estoque: {
      eyebrow: 'Módulo · Operação',
      title: 'Estoque em tempo real',
      desc: 'Sabe exatamente o que tem na prateleira. Manifestação de notas, curva ABC e estoque mínimo.',
      bullets: [
        'Manifestação eletrônica de notas de fornecedor (entrada automática)',
        'Relatório de Entradas e Saídas de NF-e',
        'Curva ABC pra decidir o que comprar primeiro',
        'Kit de Produtos e lista de preços',
      ],
      image: 'assets/cards/4.webp',
      imageAlt: 'Controle de estoque',
      mock: `...`,
    },
    sngpc: {
      eyebrow: 'Módulo · Farmácia',
      title: 'SNGPC — conformidade ANVISA automática',
      desc: 'Sistema Nacional de Gerenciamento de Produtos Controlados. Pra farmácias que vendem psicotrópicos e antibióticos.',
      bullets: [
        'Cadastro de receituário com validação de CRM e CID',
        'Controle de saldo por princípio ativo',
        'Histórico de movimentação por lote',
      ],
      image: 'assets/cards/5.webp',
      imageAlt: 'SNGPC',
      mock: `...`,
    },
    caixa: {
      eyebrow: 'Módulo · Financeiro',
      title: 'Caixa & Financeiro — fechamento sem planilha',
      desc: 'Contas a pagar, a receber, fluxo de caixa e DRE prontos pra apresentar ao contador.',
      bullets: [
        'Conciliação automática de PIX, cartão e dinheiro',
        'Relatório de DRE comparativo mês a mês',
        'Diversos relatórios',
        'Exportação direta para PDF',
      ],
      image: 'assets/cards/6.webp',
      imageAlt: 'Financeiro e caixa',
      mock: `...`,
    },
  };

  let lastTrigger = null;
  let savedScrollY = 0;

  // trava o scroll da página de fundo enquanto o modal está aberto (compatível com iOS)
  function lockScroll() {
    savedScrollY = window.scrollY;
    document.body.style.top = `-${savedScrollY}px`;
    document.body.classList.add('modal-open');
  }
  function unlockScroll() {
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
  }

  // placeholder até cada módulo ter a sua própria imagem (assets/cards/2.webp, 3.jpg, …)
  const PLACEHOLDER_IMG = 'assets/cards/1.webp';

  // o painel da esquerda é sempre uma imagem full-bleed: usa d.image se houver, senão o placeholder
  function visualFor(d) {
    const src = d.image || PLACEHOLDER_IMG;
    return `<img class="fm-mock-img" src="${src}" alt="${d.imageAlt || d.title}" />`;
  }

  function open(key) {
    const d = DATA[key];
    if (!d) return;
    visual.innerHTML = visualFor(d);
    eyebrow.textContent = d.eyebrow;
    titleEl.textContent = d.title;
    descEl.textContent = d.desc;
    listEl.innerHTML = d.bullets.map((b) => `<li>${b}</li>`).join('');
    modal.showModal();
    lockScroll();
  }
  function close() {
    if (modal.open) modal.close();
    lastTrigger?.focus({ preventScroll: true });
    unlockScroll();
  }

  triggers.forEach((t) => {
    t.addEventListener('click', () => {
      lastTrigger = t;
      open(t.dataset.feature);
    });
  });
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    // click outside inner card → close
    const inner = modal.querySelector('.feature-modal-inner');
    if (inner && !inner.contains(e.target)) close();
  });
  modal.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  // qualquer caminho de fechamento dispara 'close' → restaura o scroll da página
  modal.addEventListener('close', unlockScroll);
})();

/* ─── Active step indicator (highlight the step closest to viewport center) ─── */
(function () {
  const steps = Array.from(document.querySelectorAll('#como-funciona .step'));
  if (!steps.length) return;
  let ticking = false;
  function update() {
    const mid = window.innerHeight / 2;
    let closest = null;
    let best = Infinity;
    steps.forEach((s) => {
      const r = s.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const dist = Math.abs(center - mid);
      if (dist < best && r.bottom > 0 && r.top < window.innerHeight) {
        best = dist;
        closest = s;
      }
    });
    steps.forEach((s) => s.classList.toggle('is-active', s === closest));
    ticking = false;
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  window.addEventListener('resize', update);
  update();
})();

/* ─── Sticky CTA bar (slides in after scrolling past 60% of viewport) ─── */
(function () {
  const bar = document.getElementById('stickyCta');
  if (!bar) return;
  const closeBtn = document.getElementById('stickyCtaClose');
  const STORAGE_KEY = 'erion_sticky_cta_dismissed';
  if (sessionStorage.getItem(STORAGE_KEY) === '1') {
    bar.classList.add('is-dismissed');
    return;
  }

  /* online/offline based on Pará business hours: seg-sex 08-18, sáb 08-12 */
  function getTeamStatus() {
    try {
      const fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Belem',
        weekday: 'short',
        hour: 'numeric',
        hour12: false,
      });
      const parts = fmt.formatToParts(new Date());
      const weekday = parts.find((p) => p.type === 'weekday')?.value; // "Mon", "Tue", ...
      const hour = parseInt(parts.find((p) => p.type === 'hour')?.value, 10);
      if (weekday === 'Sun') return { online: false };
      if (weekday === 'Sat') return { online: hour >= 8 && hour < 12 };
      return { online: hour >= 8 && hour < 18 };
    } catch (_) {
      return { online: true }; // safe default
    }
  }
  function applyStatus() {
    const { online } = getTeamStatus();
    bar.classList.toggle('is-offline', !online);
    const longEl = bar.querySelector('.sticky-cta-text .long');
    const shortEl = bar.querySelector('.sticky-cta-text .short');
    if (online) {
      if (longEl) longEl.textContent = 'Equipe online agora — fale com a gente';
      if (shortEl) shortEl.textContent = 'Equipe online';
    } else {
      if (longEl)
        longEl.textContent = 'Fora do horário — seg-sex 08-18h · sáb 08-12h';
      if (shortEl) shortEl.textContent = 'Fora do horário';
    }
  }
  applyStatus();
  /* re-check every 5 min so a long session doesn't stay stale */
  setInterval(applyStatus, 5 * 60 * 1000);

  let ticking = false;
  function update() {
    const trigger = window.innerHeight * 0.6;
    const past = window.scrollY > trigger;
    const footerRect = document
      .querySelector('.footer')
      ?.getBoundingClientRect();
    const footerVisible =
      footerRect && footerRect.top < window.innerHeight - 40;
    bar.classList.toggle('is-visible', past && !footerVisible);
    ticking = false;
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  closeBtn?.addEventListener('click', () => {
    bar.classList.remove('is-visible');
    sessionStorage.setItem(STORAGE_KEY, '1');
    setTimeout(() => bar.classList.add('is-dismissed'), 500);
  });
  update();
})();

/* ─── Scroll-reveal (fade-up on enter) ─── */
(function () {
  const targets = document.querySelectorAll(
    '[data-reveal], [data-reveal-stagger]',
  );
  if (!targets.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );
  targets.forEach((el) => obs.observe(el));
})();

/* ─── Stats counter on scroll ─── */
(function () {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        if (!target) return;
        const fmt = el.textContent.trim();
        const isDecimal = fmt.includes(',') && target < 100;
        const isCompact = fmt.includes('M') || fmt.includes('K');
        let cur = 0;
        const dur = 1400;
        const start = performance.now();
        function step(now) {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          cur = target * eased;
          if (isCompact) {
            el.textContent = (cur / 1000000).toFixed(2).replace('.', ',') + 'M';
          } else if (isDecimal) {
            el.textContent = cur.toFixed(1).replace('.', ',') + 's';
          } else {
            el.textContent = Math.floor(cur).toLocaleString('pt-BR');
          }
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );
  document.querySelectorAll('[data-count]').forEach((el) => obs.observe(el));
})();
