/* Cotizador rápido GreyCell (módulo compartido).
   - Web catálogo (www.greycellstore.com/cotizador.html): usa window.COT_DATA (solo precios al cliente).
   - Panel GSM (gsm.greycell.es): window.vistaCatalogoTaller(cont) lee api/catalogo_taller.php,
     que además trae "costo" por ítem; entonces muestra costos y ganancia (solo admin).
   Sin JS inline ni eval: compatible con CSP script-src 'self'. */
(function () {
  'use strict';
  var fmt = function (n) { return 'S/ ' + Math.round(n).toLocaleString('en-US'); };
  var el = function (tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  };
  var abajo99 = function (n) { return Math.floor((n + 1) / 100) * 100 - 1; };

  function montar(cont, data) {
    cont.textContent = '';
    var admin = data.categorias.some(function (c) { return c.items.some(function (i) { return typeof i.costo === 'number'; }); });
    var sel = {};
    var raiz = el('div', 'ct');
    var cab = el('div', 'ct-cab');
    cab.appendChild(el('h2', 'ct-tit', 'Cotizador rápido de PC'));
    cab.appendChild(el('p', 'ct-sub', 'Estándar: Ryzen 5 5500 · precios al ' + (data.actualizado || '')
      + (admin ? ' · vista admin con costos de proveedor' : '')));
    raiz.appendChild(cab);

    // combos estándar
    var combos = el('div', 'ct-combos');
    (data.combos || []).forEach(function (cb) {
      var b = el('button', 'ct-combo');
      b.type = 'button';
      b.appendChild(el('strong', null, cb.nombre));
      b.appendChild(el('span', null, cb.tag || ''));
      b.addEventListener('click', function () {
        Object.keys(cb.sel).forEach(function (k) { sel[k] = cb.sel[k]; });
        nombreCombo = cb.nombre;
        combos.querySelectorAll('.ct-combo').forEach(function (x) { x.classList.toggle('ct-on', x === b); });
        pintarSelects(); calcular();
      });
      combos.appendChild(b);
    });
    raiz.appendChild(combos);

    var grid = el('div', 'ct-grid');
    var lista = el('div', 'ct-lista');
    var lado = el('div', 'ct-lado');
    grid.appendChild(lista); grid.appendChild(lado); raiz.appendChild(grid);

    var selects = {};
    data.categorias.forEach(function (c) {
      var fila = el('label', 'ct-fila');
      fila.appendChild(el('span', 'ct-cat', c.nombre));
      var s = el('select', 'ct-sel');
      c.items.forEach(function (it) {
        var o = el('option', null, it.nombre + ' — ' + fmt(it.precio) + (admin && typeof it.costo === 'number' ? ' (costo ' + fmt(it.costo) + ')' : ''));
        o.value = it.id; s.appendChild(o);
      });
      var std = c.items.filter(function (i) { return i.estandar; })[0] || c.items[0];
      sel[c.id] = std.id;
      s.addEventListener('change', function () { sel[c.id] = s.value; nombreCombo = 'PC GAMER A MEDIDA'; calcular(); });
      selects[c.id] = s;
      fila.appendChild(s);
      lista.appendChild(fila);
    });
    var nombreCombo = (data.combos && data.combos[0]) ? data.combos[0].nombre : 'PC GAMER';
    if (data.combos && data.combos[0]) { Object.assign(sel, data.combos[0].sel); combos.firstChild.classList.add('ct-on'); }

    function pintarSelects() { Object.keys(selects).forEach(function (k) { selects[k].value = sel[k]; }); }

    // lado: cliente, totales, acciones
    var cli = el('input', 'ct-in'); cli.placeholder = 'Nombre o referencia del cliente (opcional)';
    var tel = el('input', 'ct-in'); tel.placeholder = 'WhatsApp del cliente, ej. 51932473197'; tel.inputMode = 'tel';
    var refLbl = el('label', 'ct-chk');
    var ref = el('input'); ref.type = 'checkbox';
    refLbl.appendChild(ref); refLbl.appendChild(document.createTextNode(' Precio especial por referido (−' + fmt(data.descuentoReferido || 0) + ')'));
    var aviso = el('p', 'ct-aviso');
    var tot = el('div', 'ct-tot');
    var acc = el('div', 'ct-acc');
    var bWa = el('button', 'ct-btn ct-pri', 'Enviar por WhatsApp'); bWa.type = 'button';
    var bCp = el('button', 'ct-btn', 'Copiar texto'); bCp.type = 'button';
    var bImg = el('button', 'ct-btn', 'Descargar imagen'); bImg.type = 'button';
    acc.appendChild(bWa); acc.appendChild(bCp); acc.appendChild(bImg);
    [cli, tel, refLbl, aviso, tot, acc].forEach(function (x) { lado.appendChild(x); });
    ref.addEventListener('change', calcular);
    cont.appendChild(raiz);

    var estado = {};
    function item(cid) {
      var c = data.categorias.filter(function (x) { return x.id === cid; })[0];
      return c.items.filter(function (i) { return i.id === sel[cid]; })[0];
    }
    function calcular() {
      var partes = 0, costo = 0, lineas = [];
      data.categorias.forEach(function (c) {
        var it = item(c.id);
        partes += it.precio; costo += (it.costo || 0);
        if (it.precio > 0) lineas.push([c.nombre, it.nombre]);
      });
      var normal = abajo99(partes + (data.armado || 0));
      var final = ref.checked ? normal - (data.descuentoReferido || 0) : normal;
      var cpu = item('cpu'), gpu = item('gpu');
      aviso.textContent = (cpu && cpu.id === 'r5-5500' && gpu && gpu.precio === 0)
        ? '⚠ El Ryzen 5 5500 no tiene gráficos integrados: agrega una tarjeta de video.' : '';
      tot.textContent = '';
      var t1 = el('div', 'ct-l'); t1.appendChild(el('span', null, 'Precio normal')); t1.appendChild(el('b', ref.checked ? 'ct-tach' : null, fmt(normal)));
      tot.appendChild(t1);
      if (ref.checked) { var t2 = el('div', 'ct-l ct-esp'); t2.appendChild(el('span', null, 'Precio especial')); t2.appendChild(el('b', null, fmt(final))); tot.appendChild(t2); }
      if (admin) {
        var g = final - costo - (data.costoArmado || 0);
        var t3 = el('div', 'ct-l ct-adm'); t3.appendChild(el('span', null, 'Costo proveedor')); t3.appendChild(el('b', null, fmt(costo))); tot.appendChild(t3);
        var t4 = el('div', 'ct-l ct-adm'); t4.appendChild(el('span', null, 'Tu ganancia')); t4.appendChild(el('b', g < 100 ? 'ct-mal' : null, fmt(g) + ' (' + (final ? Math.round(g / final * 100) : 0) + '%)')); tot.appendChild(t4);
      }
      estado = { lineas: lineas, normal: normal, final: final, ref: ref.checked };
    }
    function texto() {
      var t = '*Cotización GreyCell Store — ' + nombreCombo + '*\n';
      if (cli.value.trim()) t += 'Para: ' + cli.value.trim() + '\n';
      t += '\n' + estado.lineas.map(function (l) { return '• ' + l[0] + ': ' + l[1]; }).join('\n');
      t += '\n\n' + (estado.ref ? 'Precio normal: ~' + fmt(estado.normal) + '~\n*Precio especial: ' + fmt(estado.final) + '*' : '*Precio: ' + fmt(estado.final) + '*');
      t += '\nEntrega en 4 días · Armado y pruebas incluidas\nwww.greycellstore.com';
      return t;
    }
    bWa.addEventListener('click', function () {
      var n = (tel.value || '').replace(/\D/g, '');
      window.open('https://wa.me/' + n + '?text=' + encodeURIComponent(texto()), '_blank', 'noopener');
    });
    bCp.addEventListener('click', function () {
      var t = texto();
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(
        function () { bCp.textContent = '¡Copiado!'; setTimeout(function () { bCp.textContent = 'Copiar texto'; }, 1500); },
        function () { window.prompt('Copia el texto:', t); });
    });
    bImg.addEventListener('click', function () { imagen(estado, nombreCombo, cli.value.trim()); });
    calcular();
  }

  function imagen(st, nombre, cliente) {
    var W = 1080, H = 1350, c = document.createElement('canvas');
    c.width = W; c.height = H;
    var x = c.getContext('2d');
    var MINT = '#00E58B', BG = '#090C0E', MUT = '#8C98A0';
    x.fillStyle = BG; x.fillRect(0, 0, W, H);
    var gr = x.createRadialGradient(W * 0.8, 0, 50, W * 0.8, 0, 900); gr.addColorStop(0, 'rgba(0,229,139,.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gr; x.fillRect(0, 0, W, H);
    x.font = '800 44px Inter, Arial, sans-serif'; x.fillStyle = '#F0F4F6'; x.fillText('GREYCELL', 56, 96);
    var w = x.measureText('GREYCELL ').width; x.fillStyle = MINT; x.fillText('STORE', 56 + w, 96);
    x.font = '600 24px Inter, Arial, sans-serif'; x.fillStyle = MUT;
    x.fillText('COTIZACIÓN · ' + new Date().toLocaleDateString('es-PE') + (cliente ? ' · ' + cliente : ''), 56, 140);
    x.font = '800 64px Inter, Arial, sans-serif'; x.fillStyle = '#F0F4F6'; x.fillText(nombre, 56, 250);
    var y = 320;
    st.lineas.forEach(function (l) {
      x.fillStyle = '#11161A'; x.fillRect(40, y - 36, W - 80, 64);
      x.font = '700 22px Inter, Arial, sans-serif'; x.fillStyle = MINT; x.fillText(l[0].toUpperCase(), 64, y + 4);
      x.font = '600 25px Inter, Arial, sans-serif'; x.fillStyle = '#F0F4F6';
      var t = l[1]; while (x.measureText(t).width > 680 && t.length > 4) t = t.slice(0, -2);
      if (t !== l[1]) t += '…';
      x.fillText(t, 330, y + 4); y += 72;
    });
    y += 20;
    x.strokeStyle = MINT; x.lineWidth = 3; x.fillStyle = '#002E1E';
    x.beginPath(); if (x.roundRect) x.roundRect(40, y, W - 80, 190, 26); else x.rect(40, y, W - 80, 190); x.fill(); x.stroke();
    x.font = '800 26px Inter, Arial, sans-serif'; x.fillStyle = MINT; x.fillText(st.ref ? 'PRECIO ESPECIAL' : 'PRECIO', 72, y + 56);
    if (st.ref) {
      x.font = '600 26px Inter, Arial, sans-serif'; x.fillStyle = MUT; var tx = 'Antes ' + fmt(st.normal); x.fillText(tx, 72, y + 110);
      var tw = x.measureText(tx).width; x.strokeStyle = '#E65050'; x.beginPath(); x.moveTo(72, y + 101); x.lineTo(72 + tw, y + 101); x.stroke();
    }
    x.font = '800 96px Inter, Arial, sans-serif'; x.fillStyle = '#F0F4F6'; x.textAlign = 'right'; x.fillText(fmt(st.final), W - 72, y + 130);
    x.textAlign = 'left'; x.font = '600 22px Inter, Arial, sans-serif'; x.fillStyle = MUT;
    x.fillText('Entrega en 4 días · Armado y pruebas incluidas', 56, H - 90);
    x.font = '700 26px Inter, Arial, sans-serif'; x.fillStyle = '#F0F4F6'; x.fillText('WhatsApp 992 039 149', 56, H - 48);
    x.fillStyle = MINT; x.textAlign = 'right'; x.fillText('www.greycellstore.com', W - 56, H - 48);
    var a = document.createElement('a'); a.download = 'Cotizacion_' + nombre.replace(/\s+/g, '_') + '.png'; a.href = c.toDataURL('image/png'); a.click();
  }

  // Panel GSM: carga desde la API privada (con costos). Requiere sesión admin.
  window.vistaCatalogoTaller = function (cont) {
    cont.textContent = 'Cargando catálogo…';
    fetch('api/catalogo_taller.php', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) { montar(cont, d.data || d); })
      .catch(function (e) { cont.textContent = 'No se pudo cargar el catálogo (' + e.message + ').'; });
  };
  // Web pública: monta con los datos incluidos.
  window.montarCotizador = montar;
  document.addEventListener('DOMContentLoaded', function () {
    var c = document.getElementById('cotizador');
    if (c && window.COT_DATA) montar(c, window.COT_DATA);
  });
})();
