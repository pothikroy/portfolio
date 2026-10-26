(() => {
  'use strict';
  document.documentElement.classList.add('has-js');

  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  if (menu && navigation) {
    menu.hidden = false;
    const setMenu = open => {
      menu.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
      menu.querySelector('span').textContent = open ? 'Close' : 'Menu';
    };
    menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
    navigation.addEventListener('click', event => {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menu.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.header-inner')) setMenu(false);
    });
    window.matchMedia('(min-width: 601px)').addEventListener('change', event => {
      if (event.matches) setMenu(false);
    });
  }

  const filterControls = document.querySelector('[data-filter-controls]');
  const projects = [...document.querySelectorAll('[data-project]')];
  if (filterControls && projects.length) {
    filterControls.hidden = false;
    const filters = [...filterControls.querySelectorAll('[data-filter]')];
    const count = filterControls.querySelector('[data-filter-count]');
    filters.forEach(button => button.addEventListener('click', () => {
      const role = button.dataset.filter;
      filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      let visible = 0;
      projects.forEach(project => {
        project.hidden = role !== 'all' && !project.dataset.roles.split(' ').includes(role);
        if (!project.hidden) visible += 1;
      });
      count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
    }));
  }

  document.querySelectorAll('.copy-email').forEach(button => {
    if (!navigator.clipboard?.writeText) return;
    button.hidden = false;
    let reset;
    button.addEventListener('click', async () => {
      const status = button.parentElement.querySelector('.copy-status');
      window.clearTimeout(reset);
      try {
        await navigator.clipboard.writeText(button.dataset.email);
        button.textContent = 'Copied';
        status.textContent = 'Email copied to clipboard.';
      } catch {
        status.textContent = `Email: ${button.dataset.email}`;
      }
      reset = window.setTimeout(() => {
        button.textContent = 'Copy email';
        status.textContent = '';
      }, 4000);
    });
  });

  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });
})();
