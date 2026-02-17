(() => {
  const body = document.body;
  const lang = document.querySelector('.lang');
  const langToggle = document.querySelector('.lang-toggle');
  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerPanel = document.querySelector('.drawer-panel');
  const drawerClose = document.querySelector('.close-drawer');
  const privacyOpeners = document.querySelectorAll('[data-open-privacy]');
  const modal = document.querySelector('#privacy-modal');
  const modalClose = document.querySelectorAll('[data-close-modal]');
  const faqButtons = document.querySelectorAll('.faq-q');

  const focusables = (root) => root ? root.querySelectorAll('a,button,input,[tabindex]:not([tabindex="-1"])') : [];

  if (langToggle && lang) {
    langToggle.addEventListener('click', () => lang.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!lang.contains(e.target)) lang.classList.remove('open');
    });
  }

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('open');
    body.classList.remove('nav-open');
    burger?.focus();
  };

  if (burger && drawer) {
    burger.addEventListener('click', () => {
      drawer.classList.add('open');
      body.classList.add('nav-open');
      focusables(drawerPanel)[0]?.focus();
    });
    drawerClose?.addEventListener('click', closeDrawer);
    drawer.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });
  }

  let lastFocus = null;
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    body.classList.remove('modal-open');
    lastFocus?.focus();
  };

  privacyOpeners.forEach((opener) => {
    opener.addEventListener('click', (e) => {
      e.preventDefault();
      lastFocus = opener;
      modal?.classList.add('open');
      body.classList.add('modal-open');
      focusables(modal)[0]?.focus();
    });
  });

  modalClose.forEach((btn) => btn.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  const trapFocus = (container, e) => {
    if (e.key !== 'Tab' || !container) return;
    const nodes = [...focusables(container)];
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (drawer?.classList.contains('open')) closeDrawer();
      if (modal?.classList.contains('open')) closeModal();
    }
    if (drawer?.classList.contains('open')) trapFocus(drawerPanel, e);
    if (modal?.classList.contains('open')) trapFocus(modal, e);
  });

  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        if (openItem !== item) openItem.classList.remove('open');
      });
      item?.classList.toggle('open');
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
