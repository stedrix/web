(function () {
  // ---- Pantallas reales ----
  var shots = [
    { tab: 'Mantenimiento · tablero', path: 'mantenimiento', src: 'img/mant-tablero.webp', alt: 'Tablero de Mantenimiento', cap: 'Lo que ve el jefe de mantenimiento al abrir el día: órdenes abiertas y atrasadas, equipos parados con su reloj corriendo y el costo del mes.' },
    { tab: 'Mantenimiento · equipos', path: 'mantenimiento/equipos/EM-02', src: 'img/mant-equipo.webp', alt: 'Ficha de un equipo en Mantenimiento', cap: 'Cada máquina con su ubicación, disponibilidad, tiempo entre fallas y tiempo de reparación, planes preventivos, repuestos e historial.' },
    { tab: 'Calidad · lotes por decidir', path: 'calidad/lotes', src: 'img/calidad-lotes.webp', alt: 'Lotes por decidir en Calidad', cap: 'Cada lote que entra, se produce o se despacha pasa por Calidad antes de usarse: por origen, con lo que vence hoy, lo atrasado y lo que espera al laboratorio externo.' },
    { tab: 'Calidad · orden de inspección', path: 'calidad/orden/CR-000002', src: 'img/calidad-orden.webp', alt: 'Orden de calidad con resultados por muestra', cap: 'Resultados por muestra y por grupo de pruebas; la decisión del lote, con segunda firma cuando se libera con desviación.' },
    { tab: 'Calidad · puntos críticos', path: 'calidad/proceso', src: 'img/calidad-proceso.webp', alt: 'Controles de proceso y puntos críticos HACCP', cap: 'Controles de proceso y puntos críticos durante la producción: un punto crítico fuera de límite retiene el lote al instante.' },
    { tab: 'Calidad · trazabilidad', path: 'calidad/trazabilidad', src: 'img/trazabilidad.webp', alt: 'Trazabilidad de un lote hacia atrás y hacia adelante', cap: 'De dónde vino un lote y a qué clientes fue, con su balance de masa, en segundos. Listo para un simulacro de retiro.' },
    { tab: 'Producción · orden', path: 'produccion/ordenes/OP-000016', src: 'img/produccion.webp', alt: 'Orden de producción con materiales y costo', cap: 'La orden de producción con sus materiales, consumos, horas y el costo real contra el planificado.' },
    { tab: 'Contabilidad · estados', path: 'contabilidad/estados', src: 'img/contabilidad.webp', alt: 'Estados financieros en Contabilidad', cap: 'Estados financieros NIIF para PYMES con comparativo, notas e indicadores, en PDF o Excel.' },
    { tab: 'Facturación · caja', path: 'facturacion/caja', src: 'img/facturacion-pos.webp', alt: 'Punto de venta con una venta en curso', cap: 'Caja rápida con teclado, promociones, ITBIS y e-CF; la balanza y la impresora térmica se conectan con el agente local.' },
    { tab: 'RRHH · inicio', path: 'inicio', src: 'img/rrhh.webp', alt: 'Inicio con indicadores de recursos humanos', cap: 'Plantilla, rotación, ausentismo, tardanzas y horas extra del mes, por departamento.' }
  ];
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function buildSlides(box, list, eager) {
    return list.map(function (s, i) {
      var im = document.createElement('img'); im.src = s.src; im.alt = s.alt; im.width = 1600; im.height = 1000;
      if (!eager || i > 0) im.loading = 'lazy'; else im.fetchPriority = 'high';
      box.insertBefore(im, box.firstChild && box.firstChild.className === 'flyer' ? box.firstChild : null);
      return im;
    });
  }

  // ---- Portada: presentación tipo flyer ----
  var hero = [
    { src: 'img/mant-tablero.webp', path: 'mantenimiento', k: 'MANTENIMIENTO', t: 'Cada paro, con su reloj corriendo.', alt: 'Tablero de Mantenimiento con equipos parados, preventivos y costo del mes' },
    { src: 'img/calidad-lotes.webp', path: 'calidad/lotes', k: 'CALIDAD', t: 'Ningún lote sale sin pasar por Calidad.', alt: 'Lotes por decidir en Calidad' },
    { src: 'img/facturacion-pos.webp', path: 'facturacion/caja', k: 'FACTURACIÓN · e-CF', t: 'Vende rápido y factura electrónico.', alt: 'Caja con una venta en curso y comprobante electrónico' },
    { src: 'img/trazabilidad.webp', path: 'calidad/trazabilidad', k: 'TRAZABILIDAD', t: 'Del suplidor al cliente, en segundos.', alt: 'Trazabilidad de un lote hacia atrás y hacia adelante' },
    { src: 'img/produccion.webp', path: 'produccion/ordenes', k: 'PRODUCCIÓN', t: 'El costo real de cada orden.', alt: 'Orden de producción con materiales y costo' },
    { src: 'img/contabilidad.webp', path: 'contabilidad/estados', k: 'CONTABILIDAD', t: 'Tus estados financieros, sin cuadrar a mano.', alt: 'Estados financieros' },
    { src: 'img/rrhh.webp', path: 'inicio', k: 'RECURSOS HUMANOS', t: 'Tu gente en números, al día.', alt: 'Indicadores de recursos humanos' }
  ];
  var hbox = document.getElementById('hero-slides'), himgs = buildSlides(hbox, hero, true), hi = 0, htimer = null, hpaused = still;
  var hdots = document.getElementById('hero-dots'), fly = hbox.querySelector('.flyer'), hp = document.getElementById('hero-pause');
  var dbtn = hero.map(function (s, i) {
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', s.k.toLowerCase());
    b.addEventListener('click', function () { showHero(i); restartHero(); }); hdots.appendChild(b); return b;
  });
  function showHero(i) {
    hi = i; var s = hero[i];
    himgs.forEach(function (im, j) { im.classList.toggle('on', j === i); });
    dbtn.forEach(function (b, j) { b.setAttribute('aria-current', j === i ? 'true' : 'false'); });
    document.getElementById('hero-url').textContent = 'app.stedrix.com / ' + s.path;
    document.getElementById('hero-k').textContent = s.k; document.getElementById('hero-t').textContent = s.t;
    fly.classList.remove('swap'); void fly.offsetWidth; fly.classList.add('swap');
  }
  function restartHero() { clearInterval(htimer); if (!hpaused) htimer = setInterval(function () { showHero((hi + 1) % hero.length); }, 5000); }
  function setHeroPause(v) { hpaused = v; hp.textContent = v ? '▶' : '❚❚'; hp.setAttribute('aria-label', v ? 'Reanudar la presentación' : 'Pausar la presentación'); restartHero(); }
  hp.addEventListener('click', function () { setHeroPause(!hpaused); });
  var hframe = hbox.closest('.frame');
  hframe.addEventListener('mouseenter', function () { clearInterval(htimer); });
  hframe.addEventListener('mouseleave', restartHero);
  showHero(0); setHeroPause(hpaused);

  // ---- Pantallas reales: pestañas que avanzan solas ----
  var tabs = document.getElementById('tabs'), gbox = document.getElementById('gal-slides'), gimgs = buildSlides(gbox, shots, false);
  var cap = document.getElementById('shot-cap'), path = document.getElementById('shot-path'), prog = document.getElementById('gal-prog'), tbtn = [], gi = 0, gtimer = null, gstart = 0, ghold = false, GMS = 6000;
  function pickShot(i, focus) {
    gi = i; var s = shots[i]; cap.textContent = s.cap; path.textContent = 'app.stedrix.com / ' + s.path;
    gimgs.forEach(function (im, j) { im.classList.toggle('on', j === i); if (j === i) im.loading = 'eager'; });
    tbtn.forEach(function (b, j) { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); b.tabIndex = j === i ? 0 : -1; });
    if (focus) tbtn[i].focus();
    gstart = performance.now();
  }
  function tick(now) {
    if (!still && !ghold) {
      var f = Math.min(1, (now - gstart) / GMS); prog.style.width = (f * 100) + '%';
      if (f >= 1) pickShot((gi + 1) % shots.length);
    } else if (ghold) { gstart = now - (parseFloat(prog.style.width) || 0) / 100 * GMS; }
    requestAnimationFrame(tick);
  }
  shots.forEach(function (s, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab'); b.textContent = s.tab;
    b.addEventListener('click', function () { pickShot(i); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); pickShot((i + 1) % shots.length, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); pickShot((i - 1 + shots.length) % shots.length, true); }
    });
    tabs.appendChild(b); tbtn.push(b);
  });
  var gsec = document.getElementById('por-dentro');
  gsec.addEventListener('mouseenter', function () { ghold = true; });
  gsec.addEventListener('mouseleave', function () { ghold = false; });
  gsec.addEventListener('focusin', function () { ghold = true; });
  gsec.addEventListener('focusout', function () { ghold = false; });
  pickShot(0);
  if (!still) requestAnimationFrame(tick); else prog.parentNode.hidden = true;

  // ---- Módulos + simulador ----
  var mods = [
    { id: 'conta', cat: 'finanzas', name: 'Contabilidad', desc: 'Asientos automáticos, cierres, centros de costo, presupuesto y estados financieros.' },
    { id: 'bancos', cat: 'finanzas', name: 'Bancos y caja', desc: 'Conciliación, cheques, transferencias y flujo de efectivo.' },
    { id: 'cxc', cat: 'finanzas', name: 'Cuentas por cobrar y pagar', desc: 'Antigüedad de saldos, cobros, pagos y reportes 606 y 607.' },
    { id: 'rrhh', cat: 'finanzas', name: 'Recursos humanos', desc: 'Expedientes, asistencia, vacaciones, evaluaciones y capacitación.' },
    { id: 'nomina', cat: 'finanzas', name: 'Nómina', desc: 'TSS, ISR, regalía y archivos para el banco.' },
    { id: 'inv', cat: 'operaciones', name: 'Inventario', desc: 'Lotes, vencimientos, almacenes, conteos y transferencias.' },
    { id: 'compras', cat: 'operaciones', name: 'Compras e importaciones', desc: 'Órdenes, recepciones, expedientes y costo de llegada.' },
    { id: 'prod', cat: 'operaciones', name: 'Producción', desc: 'Recetas, órdenes, MRP y registro en planta desde tableta.' },
    { id: 'calidad', cat: 'operaciones', name: 'Calidad', desc: 'Especificaciones, muestreo, liberación de lotes y trazabilidad.' },
    { id: 'mant', cat: 'operaciones', name: 'Mantenimiento', desc: 'Equipos, preventivos, órdenes de trabajo e indicadores de paros.' },
    { id: 'fact', cat: 'comercial', name: 'Facturación e-CF', desc: 'Cotización, pedido, factura y comprobantes electrónicos DGII.' },
    { id: 'pos', cat: 'comercial', name: 'Punto de venta', desc: 'Caja rápida con balanza, impresora térmica y gaveta.' },
    { id: 'rest', cat: 'comercial', name: 'Restaurante', desc: 'Mesas, comandas por estación y cuentas divididas.' },
    { id: 'grupo', cat: 'comercial', name: 'Varias empresas', desc: 'Cada RNC con su contabilidad y usuarios, en un solo acceso.' }
  ];
  var state = { sel: {}, users: 10, plan: null, pago: 'mensual' };
  var grid = document.getElementById('mod-grid'), mbtn = {};
  mods.forEach(function (m) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'mod'; b.setAttribute('aria-pressed', 'false'); b.dataset.cat = m.cat;
    b.innerHTML = '<span class="chk" aria-hidden="true"></span><span class="cat">' + m.cat + '</span><b>' + m.name + '</b><p>' + m.desc + '</p>';
    b.addEventListener('click', function () {
      if (state.sel[m.id]) delete state.sel[m.id]; else state.sel[m.id] = m.name;
      state.plan = null; render();
    });
    grid.appendChild(b); mbtn[m.id] = b;
  });
  document.querySelectorAll('#filtros .chip').forEach(function (c) {
    c.addEventListener('click', function () {
      document.querySelectorAll('#filtros .chip').forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
      var cat = c.dataset.cat;
      mods.forEach(function (m) { mbtn[m.id].hidden = !(cat === 'todos' || m.cat === cat); });
    });
  });
  var users = document.getElementById('sim-users');
  users.addEventListener('input', function () { state.users = +users.value; state.plan = null; render(); });

  function suggested() {
    var n = Object.keys(state.sel).length;
    if (state.sel.grupo || n > 7 || state.users > 40) return 'Corporativo';
    if (n > 3 || state.users > 10 || state.sel.prod || state.sel.calidad || state.sel.mant) return 'Profesional Crecimiento';
    return 'Esencial PyME';
  }
  function planName() { return state.plan || suggested(); }

  // ---- Planes ----
  document.querySelectorAll('#pago button').forEach(function (b) {
    b.addEventListener('click', function () {
      state.pago = b.dataset.pago;
      document.querySelectorAll('#pago button').forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
      render();
    });
  });
  document.querySelectorAll('.plan').forEach(function (p) {
    p.querySelector('[data-elegir]').addEventListener('click', function () {
      state.plan = p.dataset.plan; render();
      document.getElementById('contacto').scrollIntoView();
      document.getElementById('t-nombre').focus({ preventScroll: true });
    });
  });

  function render() {
    var names = Object.keys(state.sel).map(function (k) { return state.sel[k]; });
    mods.forEach(function (m) { mbtn[m.id].setAttribute('aria-pressed', state.sel[m.id] ? 'true' : 'false'); mbtn[m.id].querySelector('.chk').textContent = state.sel[m.id] ? '✓' : ''; });
    var list = document.getElementById('sim-list');
    list.innerHTML = names.length ? names.map(function (n) { return '<li>' + n + '</li>'; }).join('') : '<li class="muted">Toca un módulo para agregarlo.</li>';
    document.getElementById('sim-count').textContent = names.length + (names.length === 1 ? ' módulo' : ' módulos');
    document.getElementById('sim-users-v').textContent = state.users === 100 ? '100+' : state.users;
    document.getElementById('sim-plan').textContent = planName();
    document.querySelectorAll('[data-per]').forEach(function (s) { s.textContent = state.pago === 'anual' ? 'pago anual · 20% de descuento sobre la renta' : 'renta mensual · sin contrato largo'; });
    document.querySelectorAll('.plan').forEach(function (p) { p.classList.toggle('chosen', p.dataset.plan === state.plan); });
    var chips = document.getElementById('sel-chips'), h = '';
    if (state.plan) h += '<span class="s p">Plan ' + state.plan + '</span>';
    h += '<span class="s p">Pago ' + state.pago + (state.pago === 'anual' ? ' (-20%)' : '') + '</span>';
    names.forEach(function (n) { h += '<span class="s">' + n + '</span>'; });
    if (names.length || state.plan) h += '<span class="s">' + (state.users === 100 ? '100+' : state.users) + ' usuarios</span>';
    chips.innerHTML = (names.length || state.plan) ? h : '<span class="muted">Aún no eliges módulos ni plan.</span>';
  }
  render();

  // ---- Formulario ----
  var form = document.getElementById('form'), ok = document.getElementById('ok');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var names = Object.keys(state.sel).map(function (k) { return state.sel[k]; });
    var body = 'Nombre: ' + form.nombre.value + '\nEmpresa: ' + form.empresa.value + '\nCorreo: ' + form.correo.value + '\nTeléfono: ' + form.telefono.value +
      '\n\nPlan: ' + planName() + (state.plan ? '' : ' (sugerido)') + '\nPago: ' + state.pago + '\nUsuarios: ' + (state.users === 100 ? '100+' : state.users) +
      '\nMódulos: ' + (names.length ? names.join(', ') : 'por definir') + '\n\n' + form.mensaje.value;
    location.href = 'mailto:info@stedrix.com?subject=' + encodeURIComponent('Solicitud de demostración · ' + form.empresa.value) + '&body=' + encodeURIComponent(body);
    form.hidden = true; ok.hidden = false; ok.focus();
  });
  document.getElementById('ok-back').addEventListener('click', function () { ok.hidden = true; form.hidden = false; form.nombre.focus(); });
})();
