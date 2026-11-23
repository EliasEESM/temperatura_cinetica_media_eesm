/* ==========================================================================
   CORE ENGINE v1.2 · Motor Reutilizable Optimizado de Capacitación Técnica
   Delegación de eventos, caché DOM, ciclo de vida de animaciones y A11y
   ========================================================================== */

(function () {
  'use strict';

  const dom = {};
  const state = {
    moduleData: null,
    flatCards: [],
    currentCardIndex: -1,
    lastTriggerEl: null,
    activeQuizIndex: 0,
    quizResults: {}
  };

  function cacheDom() {
    const ids = [
      'brandLogo', 'brandLogoFallback', 'brandProgram', 'brandModule',
      'navMenu', 'navToggle', 'heroBadgeText', 'heroTitle', 'heroSubtitleEn',
      'heroIntro', 'heroKpiGrid', 'btnStartGuided', 'modulesContainer',
      'quizContainer', 'cardModalBackdrop', 'modalKicker', 'modalTitle',
      'modalBody', 'modalCounter', 'modalCloseBtn', 'modalPrevBtn', 'modalNextBtn'
    ];
    ids.forEach((id) => { dom[id] = document.getElementById(id); });
  }

  function initTrainingApp(moduleData) {
    if (!moduleData) return;
    cacheDom();
    state.moduleData = moduleData;
    state.flatCards = [];

    moduleData.sections.forEach((sec) => {
      sec.cards.forEach((card) => {
        state.flatCards.push({ ...card, sectionTitle: sec.title });
      });
    });

    renderHeader(moduleData);
    renderHero(moduleData);
    renderSections(moduleData);
    renderQuizSection(moduleData);
    bindDelegatedEvents();
  }

  function renderHeader(data) {
    if (dom.brandLogo && data.logoPath) {
      dom.brandLogo.src = data.logoPath;
      dom.brandLogo.onerror = () => {
        dom.brandLogo.style.display = 'none';
        if (dom.brandLogoFallback) dom.brandLogoFallback.style.display = 'block';
      };
    }
    if (dom.brandProgram) dom.brandProgram.textContent = data.programTitle;
    if (dom.brandModule) dom.brandModule.textContent = data.moduleBadge;

    if (dom.navMenu && Array.isArray(data.navItems)) {
      dom.navMenu.innerHTML = data.navItems
        .map((item) => `<a href="${item.href}" class="nav-link">${item.label}</a>`)
        .join('');
    }
  }

  function renderHero(data) {
    if (dom.heroBadgeText) dom.heroBadgeText.textContent = data.moduleBadge;
    if (dom.heroTitle) dom.heroTitle.textContent = data.titleEs;
    if (dom.heroSubtitleEn) dom.heroSubtitleEn.textContent = data.titleEn;
    if (dom.heroIntro) dom.heroIntro.textContent = data.introText;

    if (dom.heroKpiGrid && Array.isArray(data.heroKpis)) {
      dom.heroKpiGrid.innerHTML = data.heroKpis
        .map(
          (kpi) => `
          <div class="hero-kpi">
            <div class="hero-kpi-label">${kpi.label}</div>
            <div class="hero-kpi-value">${kpi.value}</div>
          </div>`
        )
        .join('');
    }
  }

  function renderSections(data) {
    if (!dom.modulesContainer) return;
    let globalIdx = 0;

    dom.modulesContainer.innerHTML = data.sections
      .map((sec) => {
        const cardsHtml = sec.cards
          .map((card) => {
            const idx = globalIdx++;
            return `
              <button type="button" class="bento-card ${card.span || 'span-6'} ${card.featured ? 'featured' : ''}" data-card-index="${idx}">
                <div>
                  <div class="card-top">
                    <span class="card-number">${card.code}</span>
                    <span class="card-tag">${card.tag}</span>
                  </div>
                  <h3 class="card-title">${card.title}</h3>
                  <p class="card-excerpt">${card.excerpt}</p>
                </div>
                <div class="card-footer">
                  <span>Abrir ficha de estudio</span>
                  <span class="card-arrow" aria-hidden="true">→</span>
                </div>
              </button>`;
          })
          .join('');

        return `
          <section id="${sec.id}" class="module-section">
            <div class="section-header">
              <div>
                <div class="section-kicker">${sec.kicker}</div>
                <h2 class="section-title">${sec.title}</h2>
              </div>
            </div>
            <div class="bento-grid">${cardsHtml}</div>
          </section>`;
      })
      .join('');
  }

  function unmountActiveCard() {
    const prevCard = state.flatCards[state.currentCardIndex];
    if (prevCard && typeof prevCard.onUnmount === 'function') {
      prevCard.onUnmount();
    }
  }

  function openCardModal(index, triggerEl) {
    if (index < 0 || index >= state.flatCards.length) return;
    unmountActiveCard();
    if (triggerEl) state.lastTriggerEl = triggerEl;

    state.currentCardIndex = index;
    const card = state.flatCards[index];

    dom.modalKicker.textContent = `${card.code} · ${card.sectionTitle}`;
    dom.modalTitle.textContent = card.title;
    dom.modalBody.innerHTML = card.contentHtml;
    dom.modalBody.scrollTop = 0;

    dom.modalCounter.textContent = `Ficha ${index + 1} de ${state.flatCards.length}`;
    dom.modalPrevBtn.disabled = index === 0;
    dom.modalNextBtn.disabled = index === state.flatCards.length - 1;

    dom.cardModalBackdrop.classList.add('is-open');
    dom.cardModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    if (typeof card.onMount === 'function') {
      requestAnimationFrame(() => card.onMount(dom.modalBody));
    }
  }

  function closeCardModal() {
    unmountActiveCard();
    dom.cardModalBackdrop.classList.remove('is-open');
    dom.cardModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (state.lastTriggerEl) {
      state.lastTriggerEl.focus({ preventScroll: true });
      state.lastTriggerEl = null;
    }
  }

  function renderQuizSection(data) {
    if (!dom.quizContainer || !Array.isArray(data.exercises)) return;

    const tabsHtml = data.exercises
      .map(
        (ex, idx) => `
        <button type="button" class="quiz-tab ${idx === 0 ? 'active' : ''}" data-quiz-idx="${idx}">
          Caso ${idx + 1}: ${ex.shortLabel}
        </button>`
      )
      .join('');

    dom.quizContainer.innerHTML = `
      <div class="section-kicker">${data.quizMeta.kicker}</div>
      <h2 class="section-title">${data.quizMeta.title}</h2>
      <p style="color: var(--gray-600); margin-top: 6px;">${data.quizMeta.description}</p>
      <div class="quiz-tabs" id="quizTabs">${tabsHtml}</div>
      <div id="quizWorkspace"></div>
    `;

    renderActiveExercise(0);
  }

  function renderActiveExercise(idx) {
    const ex = state.moduleData.exercises[idx];
    const workspace = document.getElementById('quizWorkspace');
    if (!ex || !workspace) return;

    const savedAnswer = state.quizResults[idx];

    const readingsHtml = ex.readings
      .map(
        (val, i) => `
        <div class="reading-pill">
          <span>t<sub>${i + 1}</sub></span>
          <strong>${val} °C</strong>
        </div>`
      )
      .join('');

    const optionsHtml = ex.options
      .map((opt, optIdx) => {
        let cls = '';
        if (savedAnswer !== undefined) {
          if (opt.correct) cls = 'is-correct';
          else if (savedAnswer === optIdx) cls = 'is-wrong';
        }
        return `
          <button type="button" class="option-btn ${cls}" data-opt-idx="${optIdx}">
            <span><strong>${String.fromCharCode(65 + optIdx)})</strong> ${opt.label}</span>
            <span>${savedAnswer !== undefined && opt.correct ? '✓' : ''}</span>
          </button>`;
      })
      .join('');

    let feedbackHtml = '';
    if (savedAnswer !== undefined) {
      const chosen = ex.options[savedAnswer];
      feedbackHtml = `
        <div class="feedback-panel show ${chosen.correct ? 'ok' : 'err'}">
          <strong>${chosen.correct ? 'Resultado correcto:' : 'Revisa el procedimiento:'}</strong>
          <p style="margin-top: 4px;">${chosen.feedback}</p>
        </div>`;
    }

    workspace.innerHTML = `
      <div class="quiz-workspace">
        <div class="readings-box">
          <div style="font-weight: 700; color: var(--gray-900);">${ex.scenarioTitle}</div>
          <p style="font-size: 0.88rem; color: var(--gray-600); margin-top: 4px;">${ex.parametersText}</p>
          <div class="readings-grid">${readingsHtml}</div>
        </div>
        <div>
          <div style="font-weight: 700; color: var(--gray-900); font-size: 1.02rem;">${ex.question}</div>
          <div class="options-list">${optionsHtml}</div>
          ${feedbackHtml}
          <details class="steps-disclosure">
            <summary style="cursor: pointer; font-weight: 700; color: var(--brand-primary);">
              Ver memoria de cálculo paso a paso (validación con calculadora)
            </summary>
            <div style="margin-top: 10px;">${ex.stepsHtml}</div>
          </details>
        </div>
      </div>
    `;
  }

  function bindDelegatedEvents() {
    if (dom.navToggle && dom.navMenu) {
      dom.navToggle.addEventListener('click', () => {
        const open = dom.navMenu.classList.toggle('is-open');
        dom.navToggle.setAttribute('aria-expanded', String(open));
      });
      dom.navMenu.addEventListener('click', (e) => {
        if (e.target.closest('.nav-link')) {
          dom.navMenu.classList.remove('is-open');
          dom.navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    if (dom.btnStartGuided) {
      dom.btnStartGuided.addEventListener('click', (e) => openCardModal(0, e.currentTarget));
    }

    if (dom.modulesContainer) {
      dom.modulesContainer.addEventListener('click', (e) => {
        const cardBtn = e.target.closest('.bento-card');
        if (!cardBtn) return;
        openCardModal(Number(cardBtn.dataset.cardIndex), cardBtn);
      });
    }

    if (dom.modalBody) {
      dom.modalBody.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('[data-copy-target]');
        if (!copyBtn) return;
        const target = document.getElementById(copyBtn.dataset.copyTarget);
        if (!target) return;
        navigator.clipboard.writeText(target.textContent.trim()).then(() => {
          const prev = copyBtn.textContent;
          copyBtn.textContent = '¡Copiado!';
          setTimeout(() => { copyBtn.textContent = prev; }, 1500);
        });
      });
    }

    if (dom.cardModalBackdrop) {
      dom.modalCloseBtn.addEventListener('click', closeCardModal);
      dom.cardModalBackdrop.addEventListener('click', (e) => {
        if (e.target === dom.cardModalBackdrop) closeCardModal();
      });
      dom.modalPrevBtn.addEventListener('click', () => {
        if (state.currentCardIndex > 0) openCardModal(state.currentCardIndex - 1);
      });
      dom.modalNextBtn.addEventListener('click', () => {
        if (state.currentCardIndex < state.flatCards.length - 1) {
          openCardModal(state.currentCardIndex + 1);
        }
      });
    }

    if (dom.quizContainer) {
      dom.quizContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.quiz-tab');
        if (tab) {
          const idx = Number(tab.dataset.quizIdx);
          state.activeQuizIndex = idx;
          dom.quizContainer.querySelectorAll('.quiz-tab').forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          renderActiveExercise(idx);
          return;
        }

        const optBtn = e.target.closest('.option-btn');
        if (optBtn) {
          const optIdx = Number(optBtn.dataset.optIdx);
          const idx = state.activeQuizIndex;
          state.quizResults[idx] = optIdx;
          renderActiveExercise(idx);
          const activeTab = dom.quizContainer.querySelector(`.quiz-tab[data-quiz-idx="${idx}"]`);
          if (activeTab && state.moduleData.exercises[idx].options[optIdx].correct) {
            activeTab.classList.add('solved-ok');
          }
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!dom.cardModalBackdrop || !dom.cardModalBackdrop.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeCardModal();
      if (e.key === 'ArrowLeft' && state.currentCardIndex > 0) openCardModal(state.currentCardIndex - 1);
      if (e.key === 'ArrowRight' && state.currentCardIndex < state.flatCards.length - 1) {
        openCardModal(state.currentCardIndex + 1);
      }
    });
  }

  window.TrainingEngine = { init: initTrainingApp };
})();
