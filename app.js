(function () {
  // ---- Pantallas reales ----
  var shots = [
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
  var tabs = document.getElementById('tabs'), img = document.getElementById('shot-img'), cap = document.getElementById('shot-cap'), path = document.getElementById('shot-path'), tbtn = [];
  function pickShot(i, focus) {
    var s = shots[i]; img.src = s.src; img.alt = s.alt; cap.textContent = s.cap; path.textContent = 'app.stedrix.com / ' + s.path;
    tbtn.forEach(function (b, j) { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); b.tabIndex = j === i ? 0 : -1; });
    if (focus) tbtn[i].focus();
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
  pickShot(0);

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
