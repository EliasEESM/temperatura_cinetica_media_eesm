/* ==========================================================================
   TCM DATA · Contenido Pedagógico, Fórmulas en Excel y Taller Práctico
   Módulo 01: Temperatura Cinética Media (Separador decimal: coma)
   ========================================================================== */

window.TCM_MODULE_DATA = {
  logoPath: '../../assets/logo.png',
  programTitle: 'Formación Técnica · Mediciones Especiales',
  moduleBadge: 'Módulo: Temperatura Cinética Media',
  titleEs: 'Temperatura Cinética Media',
  titleEn: 'Mean Kinetic Temperature (MKT)',
  introText: 'Definición, explicación y desarrollo en Excel',

  navItems: [
    { label: '← Portal', href: '../../index.html' },
    { label: 'Fundamentos', href: '#fundamentos' },
    { label: 'Explicación de la Fórmula y sus Unidades', href: '#anatomia' },
    { label: 'Fórmula de Excel para tu archivo', href: '#excel' },
    { label: 'Taller Práctico', href: '#evaluacion' }
  ],

  heroKpis: [
    { label: 'ΔH Estándar (USP <1079>)', value: '83,144 kJ/mol' },
    { label: 'Constante R', value: '0,0083144 kJ/mol·K' },
    { label: 'Cociente ΔH / R', value: '10 000 K' },
    { label: 'Escala de cálculo', value: 'K → °C' }
  ],

  sections: [
    {
      id: 'fundamentos',
      kicker: 'Bloque 01 · Fundamentos Físicos',
      title: 'Concepto, Energía de Activación y Constante de los Gases',
      cards: [
        {
          code: 'FICHA 01',
          tag: 'Concepto + Simulador',
          span: 'span-7',
          featured: true,
          title: '¿Qué es la Temperatura Cinética Media (TCM)?',
          excerpt: 'Definición técnica y diferencia entre la TCM y el promedio aritmético.',
          onMount: (root) => window.TCMAnimations && window.TCMAnimations.mountComparisonSim(root),
          onUnmount: () => window.TCMAnimations && window.TCMAnimations.cleanup(),
          contentHtml: `
            <div class="concept-lead">
              La <strong>Temperatura Cinética Media (TCM)</strong> es la temperatura constante equivalente que produciría el mismo efecto cinético acumulado sobre un material o producto que una serie de temperaturas variables registradas durante un periodo determinado.
            </div>
            <div class="content-block">
              <h4>Por qué no basta un promedio aritmético</h4>
              <p>Un promedio aritmético asigna el mismo peso a cada lectura sin importar su magnitud. Sin embargo, los procesos de degradación química o térmica responden de forma <strong>exponencial</strong> al aumento de temperatura (ecuación de Arrhenius). Por ello, un incremento puntual elevado aporta mucho más efecto acumulado que varias horas en temperaturas bajas, haciendo que la TCM sea siempre mayor o igual que el promedio aritmético.</p>
            </div>
            <div class="stage-card">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
                <strong>Simulador interactivo: Impacto de una excursión térmica</strong>
                <label style="font-size:0.88rem; color:var(--gray-700);">
                  Pico de temperatura: <strong id="spikeValueLabel" style="color:var(--brand-primary);">35,00 °C</strong>
                </label>
              </div>
              <input id="spikeSlider" type="range" min="21" max="50" step="0.5" value="35" style="width:100%; accent-color:#007e75; margin-bottom:12px;">
              <svg id="simSvgChart" viewBox="0 0 560 200" style="width:100%; height:auto; display:block; border:1px solid var(--gray-200); border-radius:10px;"></svg>
              <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:12px;">
                <div class="hero-kpi"><div class="hero-kpi-label">Promedio aritmético</div><div id="simMeanOut" class="hero-kpi-value">--</div></div>
                <div class="hero-kpi"><div class="hero-kpi-label">TCM (ΔH/R = 10 000 K)</div><div id="simMktOut" class="hero-kpi-value">--</div></div>
                <div class="hero-kpi"><div class="hero-kpi-label">Diferencia (TCM - Prom.)</div><div id="simDiffOut" class="hero-kpi-value">--</div></div>
              </div>
            </div>
          `
        },
        {
          code: 'FICHA 02',
          tag: 'Animación Explicativa',
          span: 'span-5',
          title: 'Energía de Activación (ΔH) y criterios de selección',
          excerpt: 'Animación paso a paso de la barrera energética ΔH y cómo elegir su valor según caracterización de equipo o producto específico.',
          onMount: (root) => window.TCMAnimations && window.TCMAnimations.mountDeltaHAnimation(root),
          onUnmount: () => window.TCMAnimations && window.TCMAnimations.cleanup(),
          contentHtml: `
            <div class="concept-lead">
              <strong>ΔH (o E<sub>a</sub>)</strong> es la energía mínima por mol necesaria para que las moléculas superen la barrera energética e inicien una reacción de degradación térmica.
            </div>
            <div class="stage-card">
              <canvas id="deltaHCanvas" width="580" height="220" style="width:100%; height:auto; border-radius:10px; border:1px solid var(--gray-200); display:block;"></canvas>
              <div class="player-bar"><div id="dhProgressBar" class="player-progress"></div></div>
              <p id="dhSceneCaption" style="font-size:0.9rem; color:var(--gray-700); margin-top:10px;"></p>
              <div class="stage-controls">
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <button type="button" id="dhPrevBtn" class="btn btn-secondary" style="padding:7px 12px; font-size:0.82rem;">← Escena</button>
                  <button type="button" id="dhPlayBtn" class="btn btn-primary" style="padding:7px 14px; font-size:0.82rem;">⏸ Pausar animación</button>
                  <button type="button" id="dhNextBtn" class="btn btn-secondary" style="padding:7px 12px; font-size:0.82rem;">Escena →</button>
                </div>
              </div>
            </div>
            <div class="content-block">
              <h4>¿De qué depende el valor asignado a ΔH?</h4>
              <ul class="content-list">
                <li><strong>Caracterización de equipos, cámaras o almacenes (estándar genérico):</strong> Se utiliza <strong>ΔH = 83,144 kJ/mol</strong> (19,872 kcal/mol), valor adoptado por USP &lt;1079&gt; y el Consejo Internacional para la Armonización de Requisitos Técnicos para Productos Farmacéuticos de Uso Humano (ICH), que produce exactamente <strong>ΔH/R = 10 000 K</strong>.</li>
                <li><strong>Evaluación de un producto específico:</strong> Se utiliza la energía de activación experimental del fármaco o insumo obtenida de estudios de estabilidad acelerada (típicamente entre 42 y 125 kJ/mol, o 10 a 30 kcal/mol).</li>
              </ul>
            </div>
          `
        },
        {
          code: 'FICHA 03',
          tag: 'Relación Equipo-Producto',
          span: 'span-12',
          title: 'Constante Universal de los Gases (R)',
          excerpt: 'Por qué aparece la constante R en una caracterización térmica y cómo conecta el perfil del equipo con la cinética del producto.',
          contentHtml: `
            <div class="concept-lead">
              La constante universal de los gases <strong>R</strong> (0,0083144 kJ/(mol·K) o 0,0019872 kcal/(mol·K)) vincula la escala de energía química molar (ΔH) con la escala de temperatura termodinámica absoluta (K).
            </div>
            <div class="content-block">
              <h4>¿Qué relación tiene R con la caracterización de un equipo?</h4>
              <p>Un equipo isotérmico, almacén o transporte no tiene una constante de gases propia; sin embargo, el propósito de calificarlo es asegurar que el ambiente interno generado <strong>preserve la estabilidad de los productos</strong> almacenados en él. En la ecuación de Arrhenius, la tasa de degradación depende de la razón entre la barrera de activación del producto (<strong>ΔH</strong>) y la energía térmica disponible por mol a la temperatura del equipo (<strong>R · T</strong>).</p>
            </div>
            <div class="tech-table-wrap">
              <table class="tech-table">
                <thead>
                  <tr><th>Elemento</th><th>Qué aporta al cálculo de TCM</th><th>Ejemplo numérico estándar</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Perfil del equipo (Tᵢ)</strong></td><td>Lecturas reales capturadas por termopares o registradores calibrados.</td><td>Temperatura en °C convertida a K (+ 273,15)</td></tr>
                  <tr><td><strong>Sensibilidad del producto (ΔH)</strong></td><td>Energía de activación de degradación térmica del material evaluado.</td><td>83,144 kJ/mol (genérico) o E<sub>a</sub> experimental</td></tr>
                  <tr><td><strong>Factor de acoplamiento (R)</strong></td><td>Traduce la energía molar a kelvin para poder compararla directamente contra Tᵢ.</td><td>0,0083144 kJ/(mol·K) → ΔH/R = 10 000 K</td></tr>
                </tbody>
              </table>
            </div>
          `
        }
      ]
    },
    {
      id: 'anatomia',
      kicker: 'Bloque 02 · Matemáticas',
      title: 'Ecuación y Análisis Dimensional',
      cards: [
        {
          code: 'FICHA 04',
          tag: 'Diagrama Interactivo',
          span: 'span-7',
          title: 'Fórmula de TCM',
          excerpt: 'Haz clic en cada bloque de la ecuación para entender cada concepto que integra la fórmula.',
          onMount: (root) => window.TCMAnimations && window.TCMAnimations.mountFormulaInspector(root),
          contentHtml: `
            <p>Selecciona cualquier segmento de la ecuación para inspeccionar su función matemática y física:</p>
            <div class="formula-interactive" role="group" aria-label="Inspector de fórmula TCM">
              <button type="button" class="formula-chip active" data-part="dhr">(ΔH / R)</button>
              <span style="color:#94a3b8;">÷</span>
              <button type="button" class="formula-chip" data-part="ln">-ln( ... )</button>
              <button type="button" class="formula-chip" data-part="avg">(1/n) · Σ</button>
              <button type="button" class="formula-chip" data-part="exp">exp( -(ΔH/R) / Tᵢ )</button>
              <button type="button" class="formula-chip" data-part="kelvin">Tᵢ = °C + 273,15</button>
              <button type="button" class="formula-chip" data-part="celsius">- 273,15</button>
            </div>
            <div class="formula-inspector">
              <div id="inspTitle" style="font-weight:800; color:var(--gray-900); font-size:1.02rem;"></div>
              <div id="inspUnit" style="font-family:var(--font-mono); font-size:0.84rem; color:var(--brand-primary); font-weight:700; margin:4px 0 8px;"></div>
              <p id="inspDesc" style="margin:0; color:var(--gray-700);"></p>
            </div>
            <div class="content-block" style="margin-top:20px;">
              <h4>¿Para qué convertir a Kelvin si al final deberé reportar en °C?</h4>
              <ul class="content-list">
                Porque en la relación de Arrhenius el denominador <span class="code-inline">Tᵢ</span> debe partir del cero absoluto termodinámico (0 K). Si se usaran °C directamente, una lectura de 0 °C generaría una división entre cero y temperaturas bajo cero invertirían el signo exponencial. Al terminar, se restan <span class="code-inline">273,15</span> únicamente para reportar el resultado en °C.</li>
              </ul>
            </div>
          `
        },
        {
          code: 'FICHA 05',
          tag: 'Análisis Dimensional',
          span: 'span-5',
          title: 'Análisis dimensional paso a paso',
          excerpt: 'Comprobación exacta de cómo se cancelan las unidades de energía y mol hasta entregar una temperatura válida en °C.',
          contentHtml: `
            <div class="concept-lead">
              Toda función trascendente (<span class="code-inline">EXP</span> y <span class="code-inline">LN</span>) exige argumentos estrictamente <strong>adimensionales</strong>. El cociente ΔH/R en kelvin garantiza esta consistencia.
            </div>
            <div class="tech-table-wrap">
              <table class="tech-table">
                <thead>
                  <tr><th>Segmento</th><th>Dimensión</th><th>Interpretación física</th></tr>
                </thead>
                <tbody>
                  <tr><td><span class="code-inline">ΔH / R</span></td><td><strong>[K]</strong></td><td>[kJ/mol] ÷ [kJ/(mol·K)] = K</td></tr>
                  <tr><td><span class="code-inline">Tᵢ + 273,15</span></td><td><strong>[K]</strong></td><td>Temperatura termodinámica absoluta</td></tr>
                  <tr><td><span class="code-inline">-(ΔH/R) / Tᵢ</span></td><td><strong>[1]</strong></td><td>Relación térmica adimensional</td></tr>
                  <tr><td><span class="code-inline">EXP(...)</span> y <span class="code-inline">PROMEDIO</span></td><td><strong>[1]</strong></td><td>Efecto cinético relativo promedio</td></tr>
                  <tr><td><span class="code-inline">-LN(...)</span></td><td><strong>[1]</strong></td><td>Inverso logarítmico adimensional</td></tr>
                  <tr><td><span class="code-inline">(ΔH/R) / (-LN)</span></td><td><strong>[K]</strong></td><td>TCM expresada en kelvin</td></tr>
                  <tr><td><span class="code-inline">- 273,15</span></td><td><strong>[°C]</strong></td><td>Desplazamiento de escala a Celsius</td></tr>
                </tbody>
              </table>
            </div>
          `
        }
      ]
    },
    {
      id: 'excel',
      kicker: 'Bloque 03 · TCM en CVC de Occidente ',
      title: 'Cálculo de TCM en Excel en Una Sola Celda',
      cards: [
        {
          code: 'FICHA 06',
          tag: 'Fórmula en 1 Celda',
          span: 'span-12',
          featured: true,
          title: 'Cómo sustituir hojas auxiliares extensas por una única fórmula limpia en Excel',
          excerpt: 'Fórmula lista para copiar en tu archivo, desglose de cada función de Excel y buenas prácticas de delimitación de rangos.',
          contentHtml: `
            <div class="concept-lead">
              En lugar de crear 8 columnas auxiliares para miles de filas, Excel permite calcular la TCM en <strong>una sola celda</strong> delimitando directamente el rango de temperaturas de tu tabla.
            </div>

            <div class="formula-box">
              <div class="formula-box-header">
                <span>Opción 1 · Estándar genérico (ΔH / R = 10 000 K · Coma decimal)</span>
                <button type="button" class="copy-btn" data-copy-target="excelFormulaStd">Copiar fórmula</button>
              </div>
              <code id="excelFormulaStd">=10000/(-LN(PROMEDIO(EXP(-10000/(C2:C100+273,15))))) - 273,15</code>
            </div>

            <div class="formula-box">
              <div class="formula-box-header">
                <span>Opción 2 · Parametrizada referenciando celda de ΔH/R (ej. $F$3)</span>
                <button type="button" class="copy-btn" data-copy-target="excelFormulaParam">Copiar fórmula</button>
              </div>
              <code id="excelFormulaParam">=$F$3/(-LN(PROMEDIO(EXP(-$F$3/(C2:C100+273,15))))) - 273,15</code>
            </div>

            <div class="content-block">
              <h4>Desglose de cada componente en Excel</h4>
              <div class="tech-table-wrap">
                <table class="tech-table">
                  <thead><tr><th>Bloque en Excel</th><th>Qué ejecuta internamente</th></tr></thead>
                  <tbody>
                    <tr><td><span class="code-inline">C2:C100+273,15</span></td><td>Suma 273,15 a cada celda del rango para generar un vector temporal en kelvin.</td></tr>
                    <tr><td><span class="code-inline">EXP(-10000/(...))</span></td><td>Calcula el factor exponencial de Arrhenius para cada lectura simultáneamente.</td></tr>
                    <tr><td><span class="code-inline">PROMEDIO(...)</span></td><td>Suma todos los factores exponenciales y divide entre el número de lecturas <em>n</em>.</td></tr>
                    <tr><td><span class="code-inline">-LN(...)</span></td><td>Obtiene el logaritmo natural del promedio exponencial e invierte su signo.</td></tr>
                    <tr><td><span class="code-inline">10000/(...) - 273,15</span></td><td>Calcula la TCM en kelvin y realiza el desplazamiento final a grados Celsius.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="content-block">
              <h4>Reglas para no cometer errores en las hojas de cálculo</h4>
              <ul class="content-list">
                <li><strong>Delimitar el rango exacto:</strong> No incluyas filas vacías debajo de tus datos; en operaciones matriciales, una celda vacía se evalúa como <span class="code-inline">0 °C</span> (273,15 K) y altera el resultado.</li>
                <li><strong>Intervalo de muestreo constante (Δt):</strong> La función <span class="code-inline">PROMEDIO</span> asume que todas las lecturas fueron registradas a la misma frecuencia temporal.</li>
              </ul>
            </div>
          `
        }
      ]
    }
  ],

  quizMeta: {
    kicker: 'Bloque 04 · Evaluación Práctica',
    title: 'Taller con Calculadora Científica',
    description: 'Calcula la TCM de cada estudio de 10 lecturas utilizando una calculadora científica, selecciona tu respuesta y verifica tu procedimiento paso a paso.'
  },

  exercises: [
    {
      shortLabel: 'Cadena de Frío',
      scenarioTitle: 'Caso 1: Cámara de refrigeración (2 °C a 8 °C con excursiones de 0 °C a 15 °C)',
      parametersText: 'Parámetros: ΔH = 83,144 kJ/mol | R = 0,0083144 kJ/(mol·K) → ΔH/R = 10 000 K | n = 10 lecturas.',
      readings: ['4,2', '4,5', '5,0', '5,4', '6,1', '7,8', '10,5', '8,2', '5,6', '4,7'],
      question: '¿Cuál es el valor de la TCM resultante para este registro?',
      options: [
        { label: '6,20 °C', correct: false, feedback: '6,20 °C corresponde al promedio aritmético simple. Recuerda que la TCM pondera exponencialmente el pico de 10,5 °C y siempre resulta mayor.' },
        { label: '6,44 °C', correct: true, feedback: '¡Excelente! La TCM (6,44 °C) refleja correctamente el peso cinético del pico de 10,5 °C, quedando 0,24 °C por encima del promedio simple (6,20 °C).' },
        { label: '6,85 °C', correct: false, feedback: 'Verifica el signo negativo dentro de la exponencial y la conversión exacta sumando 273,15 a cada lectura.' },
        { label: '279,59 °C', correct: false, feedback: '279,59 es el resultado correcto en kelvin (K); faltó restar 273,15 al final para expresarlo en °C.' }
      ],
      stepsHtml: `
        <ul class="content-list">
          <li><strong>Promedio aritmético (referencia):</strong> 6,20 °C</li>
          <li><strong>Suma exponencial Σ exp(-10 000 / Tᵢ):</strong> 2,928182 × 10⁻¹⁵</li>
          <li><strong>Promedio exponencial (÷ 10):</strong> 2,928182 × 10⁻¹⁶</li>
          <li><strong>-ln(Promedio):</strong> 35,766980</li>
          <li><strong>TCM en kelvin:</strong> 10 000 / 35,766980 = 279,5875 K</li>
          <li><strong>TCM en °C:</strong> 279,5875 - 273,15 = <strong>6,44 °C</strong></li>
        </ul>
      `
    },
    {
      shortLabel: 'Almacén con Excursión',
      scenarioTitle: 'Caso 2: Almacén controlado (15 °C a 25 °C) con excursión térmica',
      parametersText: 'Parámetros: ΔH/R = 10 000 K | n = 10 lecturas equidistantes.',
      readings: ['20,5', '21,0', '21,4', '22,0', '24,5', '29,8', '31,2', '26,4', '22,8', '21,4'],
      question: 'Determina la TCM del periodo con excursión:',
      options: [
        { label: '24,10 °C', correct: false, feedback: '24,10 °C es el promedio aritmético. Los picos de 29,8 °C y 31,2 °C elevan significativamente la TCM por encima del promedio.' },
        { label: '24,52 °C', correct: false, feedback: 'Valor ligeramente bajo; verifica no haber truncado demasiados decimales al ingresar la notación científica (× 10⁻¹⁵).' },
        { label: '24,86 °C', correct: true, feedback: '¡Correcto! La TCM alcanza 24,86 °C (+0,76 °C respecto al promedio de 24,10 °C), mostrando el impacto real de la excursión.' },
        { label: '25,40 °C', correct: false, feedback: 'Revisa el valor de -ln(Promedio): debe aproximarse a 33,555655.' }
      ],
      stepsHtml: `
        <ul class="content-list">
          <li><strong>Promedio aritmético (referencia):</strong> 24,10 °C</li>
          <li><strong>Suma exponencial Σ exp(-10 000 / Tᵢ):</strong> 2,672786 × 10⁻¹⁴</li>
          <li><strong>Promedio exponencial (÷ 10):</strong> 2,672786 × 10⁻¹⁵</li>
          <li><strong>-ln(Promedio):</strong> 33,555655</li>
          <li><strong>TCM en kelvin:</strong> 10 000 / 33,555655 = 298,0124 K</li>
          <li><strong>TCM en °C:</strong> 298,0124 - 273,15 = <strong>24,86 °C</strong></li>
        </ul>
      `
    },
    {
      shortLabel: 'Producto con ΔH Específico',
      scenarioTitle: 'Caso 3: Producto sensible con energía de activación conocida',
      parametersText: 'Parámetros del producto: ΔH = 104,60 kJ/mol (~25 kcal/mol) | R = 0,0083144 kJ/(mol·K) → ΔH/R = 12 580,5831 K | n = 10 lecturas.',
      readings: ['22,0', '22,5', '23,0', '24,0', '25,5', '28,0', '32,5', '34,0', '27,0', '23,5'],
      question: 'Calcula la TCM empleando el cociente ΔH/R específico del producto:',
      options: [
        { label: '26,20 °C', correct: false, feedback: '26,20 °C es el promedio aritmético simple, no considera la cinética de Arrhenius.' },
        { label: '27,11 °C', correct: false, feedback: '27,11 °C es lo que se obtiene si usas el estándar genérico de 10 000 K. En este caso el producto exige ΔH/R = 12 580,5831 K.' },
        { label: '27,38 °C', correct: true, feedback: '¡Exacto! Al tener una energía de activación mayor (104,60 kJ/mol), el producto es más sensible a los picos de 32,5 °C y 34,0 °C, subiendo la TCM a 27,38 °C.' },
        { label: '28,05 °C', correct: false, feedback: 'Verifica que hayas usado 12 580,5831 tanto en el numerador como dentro de la función exponencial.' }
      ],
      stepsHtml: `
        <ul class="content-list">
          <li><strong>Cociente ΔH/R:</strong> 104,60 / 0,0083144 = 12 580,5831 K</li>
          <li><strong>Promedio aritmético (referencia):</strong> 26,20 °C</li>
          <li><strong>Suma exponencial Σ exp(-12 580,5831 / Tᵢ):</strong> 6,600407 × 10⁻¹⁸</li>
          <li><strong>Promedio exponencial (÷ 10):</strong> 6,600407 × 10⁻¹⁹</li>
          <li><strong>-ln(Promedio):</strong> 41,861985</li>
          <li><strong>TCM en kelvin:</strong> 12 580,5831 / 41,861985 = 300,5252 K</li>
          <li><strong>TCM en °C:</strong> 300,5252 - 273,15 = <strong>27,38 °C</strong></li>
        </ul>
      `
    },
    {
      shortLabel: 'Estabilidad Acelerada',
      scenarioTitle: 'Caso 4: Cámara de estabilidad acelerada (objetivo 40 °C)',
      parametersText: 'Parámetros: ΔH/R = 10 000 K | n = 10 lecturas equidistantes.',
      readings: ['38,0', '39,2', '40,0', '40,5', '42,0', '46,5', '48,0', '44,2', '41,0', '39,6'],
      question: '¿Cuál es la TCM de esta corrida en cámara de estabilidad?',
      options: [
        { label: '41,90 °C', correct: false, feedback: '41,90 °C es el promedio aritmético simple de las 10 lecturas.' },
        { label: '42,39 °C', correct: true, feedback: '¡Correcto! Con 315,54 K - 273,15 obtienes exactamente 42,39 °C.' },
        { label: '43,12 °C', correct: false, feedback: 'Revisa el exponente de notación científica al dividir entre 10 (debe quedar del orden de 10⁻¹⁴).' },
        { label: '315,54 °C', correct: false, feedback: '315,54 corresponde a la TCM en kelvin (K); recuerda restar 273,15 para obtener °C.' }
      ],
      stepsHtml: `
        <ul class="content-list">
          <li><strong>Promedio aritmético (referencia):</strong> 41,90 °C</li>
          <li><strong>Suma exponencial Σ exp(-10 000 / Tᵢ):</strong> 1,723617 × 10⁻¹³</li>
          <li><strong>Promedio exponencial (÷ 10):</strong> 1,723617 × 10⁻¹⁴</li>
          <li><strong>-ln(Promedio):</strong> 31,691766</li>
          <li><strong>TCM en kelvin:</strong> 10 000 / 31,691766 = 315,5394 K</li>
          <li><strong>TCM en °C:</strong> 315,5394 - 273,15 = <strong>42,39 °C</strong></li>
        </ul>
      `
    }
  ]
};
