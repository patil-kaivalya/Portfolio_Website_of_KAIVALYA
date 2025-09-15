
'use strict';

/* =========================
   EmailJS (guarded init)
========================= */
if (window.emailjs) {
  // Use your public key here
  emailjs.init('bioFDYpNacAYKZ9En');
}

/* =========================
   Small helpers
========================= */
const norm = (s) => (s || '').trim().toLowerCase();
const toggleActive = (el) => el && el.classList.toggle('active');

/* =========================
   Sidebar (mobile)
========================= */
(() => {
  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');
  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener('click', () => toggleActive(sidebar));
  }
})();

/* =========================
   Testimonials Modal
========================= */
(() => {
  const items = document.querySelectorAll('[data-testimonials-item]');
  const modalContainer = document.querySelector('[data-modal-container]');
  const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
  const overlay = document.querySelector('[data-overlay]');
  const modalImg = document.querySelector('[data-modal-img]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalText = document.querySelector('[data-modal-text]');

  if (!modalContainer || !overlay) return;

  const toggleModal = () => {
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const avatar = item.querySelector('[data-testimonials-avatar]');
      const title = item.querySelector('[data-testimonials-title]');
      const text = item.querySelector('[data-testimonials-text]');
      if (modalImg && avatar) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt || '';
      }
      if (modalTitle && title) modalTitle.innerHTML = title.innerHTML;
      if (modalText && text) modalText.innerHTML = text.innerHTML;
      toggleModal();
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', toggleModal);
  overlay.addEventListener('click', toggleModal);
})();

/* =========================================================
   Scoped Filter Engine (works for each .projects section)
   — powers BOTH Projects and Certificates independently
========================================================= */
(() => {
  function wireProjectsBlock(block) {
    if (!block) return;

    const listButtons = block.querySelectorAll('.filter-list [data-filter-btn]');
    const selectToggle = block.querySelector('.filter-select');            // opener
    const selectList   = block.querySelector('.select-list');              // dropdown UL
    const selectItems  = block.querySelectorAll('.select-list [data-select-item]');
    const selectValueEl =
      block.querySelector('.select-value') || block.querySelector('[data-select-value]');
    const cards = block.querySelectorAll('.project-list .project-item');

    let current = 'all';

    function applyFilter(label) {
      current = norm(label);

      // Update active state on top row buttons
      listButtons.forEach((btn) => {
        btn.classList.toggle('active', norm(btn.textContent) === current);
      });

      // Update dropdown label
      if (selectValueEl) selectValueEl.textContent = label;

      // Show/hide cards
      cards.forEach((card) => {
        const cat = norm(card.dataset.category);
        const show = current === 'all' || cat === current;
        card.classList.toggle('active', show);
      });
    }

    // Initial state
    const initiallyActive = Array.from(listButtons).find((b) => b.classList.contains('active'));
    applyFilter(initiallyActive ? initiallyActive.textContent : 'All');

    // Top filter buttons
    listButtons.forEach((btn) => {
      // Ensure these are not treated as submit buttons
      if (!btn.hasAttribute('type')) btn.setAttribute('type', 'button');

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        applyFilter(btn.textContent);
      });
    });

    // Dropdown open/close
    if (selectToggle && selectList) {
      selectToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectList.classList.toggle('open');
      });

      // Close dropdown when clicking outside THIS block
      document.addEventListener('click', (e) => {
        if (!block.contains(e.target)) {
          selectList.classList.remove('open');
        }
      });
    }

    // Dropdown items
    selectItems.forEach((item) => {
      // Ensure not submit
      if (!item.hasAttribute('type')) item.setAttribute('type', 'button');

      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        applyFilter(item.textContent);
        if (selectList) selectList.classList.remove('open');
      });
    });
  }

  // Wire every .projects block on the page (Projects + Certificates)
  document.querySelectorAll('.projects').forEach(wireProjectsBlock);
})();

/* =========================================
   Contact Form: validation + EmailJS send
========================================= */
(() => {
  const form   = document.querySelector('[data-form]');
  if (!form) return;

  const inputs = form.querySelectorAll('[data-form-input]');
  const btn    = form.querySelector('[data-form-btn]');
  const btnText = document.getElementById('btn-text');

  // Inline alert (message area)
  const formAlert = document.createElement('div');
  formAlert.id = 'form-alert';
  formAlert.style.display = 'none';
  formAlert.style.marginTop = '10px';
  formAlert.style.fontWeight = 'bold';
  form.appendChild(formAlert);

  // Enable/disable button based on validity
  function updateBtn() {
    const ok = form.checkValidity();
    if (btn) btn.disabled = !ok;
  }
  inputs.forEach((i) => i.addEventListener('input', updateBtn));
  updateBtn();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!window.emailjs) {
      formAlert.style.display = 'block';
      formAlert.style.color = 'red';
      formAlert.textContent = '❌ Email service not available.';
      return;
    }

    const serviceID  = 'service_2xtoi1o';   // your EmailJS service ID
    const templateID = 'template_vrpncgn';  // your EmailJS template ID

    if (btnText) btnText.textContent = 'Sending...';
    if (btn) btn.disabled = true;
    formAlert.style.display = 'none';

    emailjs.sendForm(serviceID, templateID, form)
      .then(() => {
        if (btnText) btnText.textContent = 'Send Message';
        formAlert.style.display = 'block';
        formAlert.style.color = 'green';
        formAlert.textContent = '📩 Message sent successfully!';
      })
      .catch((err) => {
        console.error('EmailJS Error:', err);
        if (btnText) btnText.textContent = 'Send Message';
        formAlert.style.display = 'block';
        formAlert.style.color = 'red';
        formAlert.textContent = '❌ Failed to send message. Please try again later.';
      })
      .finally(() => {
        form.reset();
        updateBtn();
      });
  });
})();

/* =========================
   Page Navigation Tabs
========================= */
(() => {
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const pages    = document.querySelectorAll('[data-page]');
  if (!navLinks.length || !pages.length) return;

  navLinks.forEach((link) => {
    // Ensure not submit
    if (!link.hasAttribute('type')) link.setAttribute('type', 'button');

    link.addEventListener('click', (e) => {
      e.preventDefault();

      pages.forEach((page) => {
        if (link.textContent.trim().toLowerCase() === page.dataset.page) {
          page.classList.add('active');
        } else {
          page.classList.remove('active');
        }
      });

      navLinks.forEach((n) => n.classList.remove('active'));
      link.classList.add('active');

      // Scroll to top of content after changing tab
      window.scrollTo(0, 0);
    });
  });
})();

/* =========================
   Disable Right Click
========================= */
(() => {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
})();
