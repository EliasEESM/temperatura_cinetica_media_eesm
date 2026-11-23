/* ==========================================================================
   TCM ANIMATIONS · Escenas Animadas e Interactivas (SVG / Canvas HiDPI)
   Módulo 01: Temperatura Cinética Media
   ========================================================================== */

(function () {
  'use strict';

  const activeTimers = new Set();

  function clearAllTimers() {
    activeTimers.forEach((id) => {
      clearInterval(id);
      cancelAnimationFrame(id);
    });
    activeTimers.clear();
  }

  /* ------------------------------------------------------------------------
     1. Simulador Interactivo: Promedio Aritmético vs. TCM (Ficha 1)
     ------------------------------------------------------------------------ */
  function mountComparisonSim(root) {
    const slider = root.querySelector('#spikeSlider');
    const spikeVal = root.querySelector('#spikeValueLabel');
    const meanOut = root.querySelector('#simMeanOut');
    const mktOut = root.querySelector('#simMktOut');
    const diffOut = root.querySelector('#simDiffOut');
    const svg = root.querySelector('#simSvgChart');
    if (!slider || !svg) return;

    const baseReadings = [20, 20.5, 21, 21, 21.5, 21.5, 21, 20.5, 20];

    function fmt(n) {
      return n.toFixed(2).replace('.', ',');
    }

    function update() {
      const spike = Number(slider.value);
      spikeVal.textContent = `${fmt(spike)} °C`;
      const data = [...baseReadings.slice(0, 5), spike, ...baseReadings.slice(5)];
      const mean = data.reduce((a, b) => a + b, 0) / data.length;
      const avgExp = data.reduce((a, t) => a + Math.exp(-10000 / (t + 273.15)), 0) / data.length;
      const mkt = 10000 / (-Math.log(avgExp)) - 273.15;

      meanOut.textContent = `${fmt(mean)} °C`;
      mktOut.textContent = `${fmt(mkt)} °C`;
      diffOut.textContent = `+${fmt(mkt - mean)} °C`;

      const w = 560, h = 200, padL = 42, padR = 20, padT = 18, padB = 28;
      const minT = 15, maxT = 55;
      const mapX = (i) => padL + (i / (data.length - 1)) * (w - padL - padR);
      const mapY = (t) => padT + ((maxT - t) / (maxT - minT)) * (h - padT - padB);

      const pts = data.map((t, i) => `${mapX(i).toFixed(1)},${mapY(t).toFixed(1)}`).join(' ');
      const yMean = mapY(mean).toFixed(1);
      const yMkt = mapY(mkt).toFixed(1);

      svg.innerHTML = `
        <rect x="0" y="0" width="${w}" height="${h}" fill="#ffffff" rx="10" />
        <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${h - padB}" stroke="#cbd5e1" />
        <line x1="${padL}" y1="${h - padB}" x2="${w - padR}" y2="${h - padB}" stroke="#cbd5e1" />
        <text x="8" y="${mapY(50) + 4}" font-size="11" fill="#64748b">50°C</text>
        <text x="8" y="${mapY(35) + 4}" font-size="11" fill="#64748b">35°C</text>
        <text x="8" y="${mapY(20) + 4}" font-size="11" fill="#64748b">20°C</text>

        <line x1="${padL}" y1="${yMean}" x2="${w - padR}" y2="${yMean}" stroke="#64748b" stroke-width="2" stroke-dasharray="6,4" />
        <text x="${w - 142}" y="${Number(yMean) + 14}" font-size="11" font-weight="600" fill="#475569">Promedio: ${fmt(mean)} °C</text>

        <line x1="${padL}" y1="${yMkt}" x2="${w - padR}" y2="${yMkt}" stroke="#007e75" stroke-width="2.5" />
        <text x="${w - 122}" y="${Number(yMkt) - 6}" font-size="11" font-weight="700" fill="#007e75">TCM: ${fmt(mkt)} °C</text>

        <polyline fill="none" stroke="#3aa391" stroke-width="2.5" points="${pts}" />
        ${data.map((t, i) => `<circle cx="${mapX(i)}" cy="${mapY(t)}" r="${i === 5 ? 6 : 3.5}" fill="${i === 5 ? '#005c55' : '#007e75'}" />`).join('')}
      `;
    }

    slider.addEventListener('input', update);
    update();
  }

  /* ------------------------------------------------------------------------
     2. Video Animado Interactivo: Energía de Activación ΔH (Ficha 2)
     ------------------------------------------------------------------------ */
  function mountDeltaHAnimation(root) {
    const canvas = root.querySelector('#deltaHCanvas');
    const playBtn = root.querySelector('#dhPlayBtn');
    const prevBtn = root.querySelector('#dhPrevBtn');
    const nextBtn = root.querySelector('#dhNextBtn');
    const captionEl = root.querySelector('#dhSceneCaption');
    const progressEl = root.querySelector('#dhProgressBar');
    if (!canvas) return;

    const logicalW = 580;
    const logicalH = 220;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = logicalW * dpr;
    canvas.height = logicalH * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const scenes = [
      {
        title: 'Escena 1/4 · Estado inicial del material',
        text: 'Las moléculas de un principio activo o material permanecen estables mientras su energía térmica está por debajo de la barrera de activación (ΔH).',
        barrierHeight: 115,
        speed: 1.2,
        crossingRate: 0.08
      },
      {
        title: 'Escena 2/4 · ¿Qué representa ΔH?',
        text: 'ΔH (energía de activación) es la energía mínima por mol requerida para superar la barrera y desencadenar la reacción de degradación térmica.',
        barrierHeight: 115,
        speed: 1.8,
        crossingRate: 0.22
      },
      {
        title: 'Escena 3/4 · Incremento exponencial con la temperatura',
        text: 'Al elevar la temperatura (T), la fracción de moléculas capaces de cruzar la barrera ΔH crece de forma exponencial según Arrhenius: exp(-ΔH / RT).',
        barrierHeight: 115,
        speed: 3.1,
        crossingRate: 0.65
      },
      {
        title: 'Escena 4/4 · Criterio normativo estándar (83,144 kJ/mol)',
        text: 'Al caracterizar equipos o áreas sin un producto único, se adopta ΔH = 83,144 kJ/mol (ΔH/R = 10 000 K). Si el producto tiene un ΔH específico mayor, su sensibilidad a picos térmicos aumenta.',
        barrierHeight: 135,
        speed: 2.3,
        crossingRate: 0.38
      }
    ];

    let sceneIdx = 0;
    let isPlaying = true;
    let frameId = null;
    let autoTimer = null;

    const particles = Array.from({ length: 24 }, (_, i) => ({
      phase: i * 0.45
    }));

    function updateSceneUI() {
      const s = scenes[sceneIdx];
      captionEl.innerHTML = `<strong>${s.title}:</strong> ${s.text}`;
      progressEl.style.width = `${((sceneIdx + 1) / scenes.length) * 100}%`;
    }

    function draw(time) {
      const s = scenes[sceneIdx];
      const w = logicalW;
      const h = logicalH;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      const peakY = h - 42 - s.barrierHeight;
      ctx.beginPath();
      ctx.moveTo(24, h - 48);
      ctx.bezierCurveTo(160, h - 48, 210, peakY, 290, peakY);
      ctx.bezierCurveTo(370, peakY, 410, h - 28, w - 24, h - 28);
      ctx.strokeStyle = '#007e75';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(290, h - 48);
      ctx.lineTo(290, peakY);
      ctx.strokeStyle = '#005c55';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#005c55';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText('Barrera ΔH', 300, peakY + 26);

      ctx.fillStyle = '#475569';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Estado estable', 42, h - 14);
      ctx.fillText('Reacción / Degradación', w - 165, h - 10);

      const t = time * 0.001 * s.speed;
      particles.forEach((p, idx) => {
        const canCross = (idx / particles.length) < s.crossingRate;
        const cycle = (t + p.phase) % 4;
        let px, py;

        if (canCross && cycle > 1.8) {
          const prog = (cycle - 1.8) / 2.2;
          px = 120 + prog * (w - 170);
          py = (h - 58) - Math.sin(prog * Math.PI) * (s.barrierHeight + 8);
          ctx.fillStyle = '#007e75';
        } else {
          px = 55 + ((idx * 23) % 130) + Math.sin(t * 2 + p.phase) * 14;
          py = (h - 70) - Math.abs(Math.sin(t * 2.5 + p.phase)) * (canCross ? 45 : 22);
          ctx.fillStyle = '#64748b';
        }

        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      if (isPlaying) {
        frameId = requestAnimationFrame(draw);
        activeTimers.add(frameId);
      }
    }

    function startAutoAdvance() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (!isPlaying) return;
        sceneIdx = (sceneIdx + 1) % scenes.length;
        updateSceneUI();
      }, 6500);
      activeTimers.add(autoTimer);
    }

    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.textContent = isPlaying ? '⏸ Pausar animación' : '▶ Reproducir';
      if (isPlaying) {
        frameId = requestAnimationFrame(draw);
        activeTimers.add(frameId);
      }
    });

    prevBtn.addEventListener('click', () => {
      sceneIdx = (sceneIdx - 1 + scenes.length) % scenes.length;
      updateSceneUI();
      if (!isPlaying) draw(performance.now());
    });

    nextBtn.addEventListener('click', () => {
      sceneIdx = (sceneIdx + 1) % scenes.length;
      updateSceneUI();
      if (!isPlaying) draw(performance.now());
    });

    updateSceneUI();
    frameId = requestAnimationFrame(draw);
    activeTimers.add(frameId);
    startAutoAdvance();
  }

  /* ------------------------------------------------------------------------
     3. Inspector Interactivo de la Fórmula Completa (Ficha 4)
     ------------------------------------------------------------------------ */
  function mountFormulaInspector(root) {
    const chips = root.querySelectorAll('.formula-chip');
    const titleEl = root.querySelector('#inspTitle');
    const unitEl = root.querySelector('#inspUnit');
    const descEl = root.querySelector('#inspDesc');
    if (!chips.length) return;

    const details = {
      dhr: {
        title: 'Numerador ΔH / R (Constante térmica energética)',
        unit: 'Unidad resultante: K (kelvin)',
        desc: 'Divide la energía de activación (ΔH) entre la constante universal de los gases (R). En caracterización general de equipos equivale a 83,144 / 0,0083144 = 10 000 K.'
      },
      kelvin: {
        title: 'Conversión a temperatura absoluta (Tᵢ + 273,15)',
        unit: 'Unidad resultante: K (kelvin)',
        desc: 'La ecuación de Arrhenius exige temperatura termodinámica absoluta (cero real en -273,15 °C). Usar °C directamente produciría divisiones entre cero o signos negativos inválidos físicamente.'
      },
      exp: {
        title: 'Factor exponencial exp( - (ΔH/R) / Tᵢ )',
        unit: 'Unidad resultante: Adimensional (1)',
        desc: 'Transforma cada lectura de temperatura en un peso proporcional a la velocidad de reacción química según Arrhenius. Las temperaturas altas reciben un peso exponencialmente mayor.'
      },
      avg: {
        title: 'Promedio cinético (1/n) · Σ exp(...)',
        unit: 'Unidad resultante: Adimensional (1)',
        desc: 'Promedia las velocidades relativas de reacción de todas las lecturas (asumiendo intervalos de muestreo constantes Δt). Es el paso donde se integra el efecto acumulado.'
      },
      ln: {
        title: 'Logaritmo natural negativo -ln(...)',
        unit: 'Unidad resultante: Adimensional (1)',
        desc: 'El logaritmo natural (ln) es la función inversa exacta de exp(). Se aplica para despejar la temperatura equivalente desde el promedio de los términos exponenciales; el signo negativo cancela el signo del exponente.'
      },
      celsius: {
        title: 'Desplazamiento final a Celsius (- 273,15)',
        unit: 'Unidad resultante: °C (escala Celsius)',
        desc: 'Una vez obtenida la TCM en kelvin al dividir (ΔH/R) entre -ln(...), se restan 273,15 para expresar el resultado en grados Celsius operativos.'
      }
    };

    function selectKey(key) {
      chips.forEach((c) => c.classList.toggle('active', c.dataset.part === key));
      const d = details[key];
      if (!d) return;
      titleEl.textContent = d.title;
      unitEl.textContent = d.unit;
      descEl.textContent = d.desc;
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => selectKey(chip.dataset.part));
    });
    selectKey('dhr');
  }

  window.TCMAnimations = {
    mountComparisonSim,
    mountDeltaHAnimation,
    mountFormulaInspector,
    cleanup: clearAllTimers
  };
})();
