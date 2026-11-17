// Genera el Word del anexo a partir de la plantilla de la clínica (Documento_base.docx).
// Pura: recibe JSZip, los bytes de la plantilla, el plan y el registro; devuelve los bytes del .docx.
(function () {
  const PARTES_FUERA = /^(customXml\/|word\/glossary\/|word\/webextensions\/|docProps\/custom\.xml$)/;

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---- piezas OOXML ----
  function run(texto, o) {
    o = o || {};
    let rpr = '';
    if (o.font) rpr += '<w:rFonts w:ascii="' + o.font + '" w:hAnsi="' + o.font + '" w:eastAsia="' + o.font + '" w:cs="' + o.font + '"/>';
    if (o.b) rpr += '<w:b/><w:bCs/>';
    if (o.i) rpr += '<w:i/><w:iCs/>';
    if (o.color) rpr += '<w:color w:val="' + o.color + '"/>';
    if (o.sz) rpr += '<w:sz w:val="' + o.sz + '"/><w:szCs w:val="' + o.sz + '"/>';
    const partes = String(texto).split('\n');
    return partes.map(function (t, k) {
      return '<w:r>' + (rpr ? '<w:rPr>' + rpr + '</w:rPr>' : '') + (k ? '<w:br/>' : '') + '<w:t xml:space="preserve">' + esc(t) + '</w:t></w:r>';
    }).join('');
  }
  function p(runs, o) {
    o = o || {};
    let ppr = '';
    if (o.style) ppr += '<w:pStyle w:val="' + o.style + '"/>';
    if (o.keepNext) ppr += '<w:keepNext/>';
    ppr += '<w:spacing w:before="' + (o.before || 0) + '" w:after="' + (o.after == null ? 80 : o.after) + '"/>';
    if (o.ind) ppr += '<w:ind w:left="' + o.ind + '" w:hanging="' + (o.hanging || 0) + '"/>';
    if (o.shd) ppr += '<w:shd w:val="clear" w:color="auto" w:fill="' + o.shd + '"/>';
    return '<w:p><w:pPr>' + ppr + '</w:pPr>' + (Array.isArray(runs) ? runs.join('') : runs) + '</w:p>';
  }
  function h(texto, nivel) {
    return p(run(texto), { style: nivel === 2 ? 'Ttulo3' : 'Ttulo2', keepNext: true, before: 240, after: 80 });
  }
  const SIMBOLO = 'Segoe UI Symbol';
  const CAJA = 'MS Gothic';
  const MARCA = { si: '\u2611', no: '\u2610', na: '\u2298\uFE0E' };
  let idCaja = 7100;
  // Casilla de Word (control de contenido): se marca y desmarca con un clic en Word.
  // «na» (no aplicado) no es casilla: va como símbolo fijo.
  function caja(marca, sz) {
    if (marca === 'na') return run(MARCA.na + '  ', { font: SIMBOLO, sz: sz, color: '808080' });
    const f = '<w:rFonts w:ascii="' + CAJA + '" w:eastAsia="' + CAJA + '" w:hAnsi="' + CAJA + '" w:hint="eastAsia"/>';
    const tam = sz ? '<w:sz w:val="' + sz + '"/><w:szCs w:val="' + sz + '"/>' : '';
    const on = marca === 'si';
    return '<w:sdt><w:sdtPr><w:rPr>' + f + tam + '</w:rPr><w:id w:val="' + (idCaja++) + '"/>' +
      '<w14:checkbox><w14:checked w14:val="' + (on ? 1 : 0) + '"/>' +
      '<w14:checkedState w14:val="2611" w14:font="' + CAJA + '"/><w14:uncheckedState w14:val="2610" w14:font="' + CAJA + '"/></w14:checkbox>' +
      '</w:sdtPr><w:sdtContent><w:r><w:rPr>' + f + tam + '</w:rPr><w:t>' + (on ? MARCA.si : MARCA.no) + '</w:t></w:r></w:sdtContent></w:sdt>' +
      run('  ', { sz: sz });
  }
  function itemP(marca, texto, extra, ind) {
    const runs = [caja(marca), run(texto, marca === 'na' ? { color: '808080' } : {})];
    if (extra) runs.push(run('  ' + extra, { i: true, color: '7F1D1D', sz: 18 }));
    return p(runs, { ind: ind || 360, hanging: 360, after: 60 });
  }
  function notaP(texto, ind) {
    if (!texto || !String(texto).trim()) return '';
    return p([run('Notas: ', { b: true, sz: 20 }), run(texto.trim(), { i: true, sz: 20 })], { ind: ind || 360, after: 100 });
  }
  function celda(contenido, o) {
    o = o || {};
    const w = o.w ? '<w:tcW w:w="' + o.w + '" w:type="dxa"/>' : '';
    const shd = o.shd ? '<w:shd w:val="clear" w:color="auto" w:fill="' + o.shd + '"/>' : '';
    const cuerpo = contenido && contenido.indexOf('<w:p>') === 0 ? contenido : p(run(contenido || '', o.run), { after: 40 });
    return '<w:tc><w:tcPr>' + w + shd + '</w:tcPr>' + cuerpo + '</w:tc>';
  }
  function tabla(anchos, filas, cabecera) {
    const grid = '<w:tblGrid>' + anchos.map(function (a) { return '<w:gridCol w:w="' + a + '"/>'; }).join('') + '</w:tblGrid>';
    const bordes = '<w:tblBorders>' + ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(function (b) {
      return '<w:' + b + ' w:val="single" w:sz="4" w:space="0" w:color="BFC7D1"/>';
    }).join('') + '</w:tblBorders>';
    const pr = '<w:tblPr><w:tblStyle w:val="Tablaconcuadrcula"/><w:tblW w:w="5000" w:type="pct"/>' + bordes +
      '<w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr>';
    let xml = '<w:tbl>' + pr + grid;
    if (cabecera) {
      xml += '<w:tr><w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>' + cabecera.map(function (c, k) {
        return celda(c, { w: anchos[k], shd: 'DCE6F0', run: { b: true, sz: 20 } });
      }).join('') + '</w:tr>';
    }
    filas.forEach(function (f) {
      xml += '<w:tr><w:trPr><w:cantSplit/></w:trPr>' + f.celdas.map(function (c, k) {
        return celda(c, { w: anchos[k], shd: f.shd, run: Object.assign({ sz: 20 }, f.run || {}) });
      }).join('') + '</w:tr>';
    });
    return xml + '</w:tbl>' + p('', { after: 60 });
  }
  function bloqueCelda(paras) { return paras.join('') || p('', {}); }

  function textoRespuesta(v) {
    if (Array.isArray(v)) return v.join(', ');
    return v == null ? '' : String(v);
  }

  // ---- fecha y nombres ----
  function partesFecha(fecha, hora) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha || '');
    const hm = /^(\d{1,2}):(\d{2})/.exec(hora || '');
    return {
      barra: m ? m[3] + '/' + m[2] + '/' + m[1] : '',
      guion: m ? m[3] + '-' + m[2] + '-' + m[1] : '',
      hora: hm ? hm[1].padStart(2, '0') + ':' + hm[2] : '',
      horaPunto: hm ? hm[1].padStart(2, '0') + '.' + hm[2] : ''
    };
  }
  function nombreArchivo(s) {
    const f = partesFecha(s.fecha, s.hora);
    const paciente = String(s.paciente || '').replace(/[\\/:*?"<>|#%]/g, ' ').replace(/\s+/g, ' ').trim().replace(/\.$/, '');
    const trozos = [];
    if (paciente) trozos.push(paciente);
    trozos.push((f.guion + (f.horaPunto ? ' ' + f.horaPunto : '')).trim() || 'sin fecha');
    trozos.push('Anexo ' + (s.n || '?'));
    return trozos.join(' — ') + '.docx';
  }

  // ---- contenido del anexo ----
  function cuerpo(plan, r) {
    const hecho = r.hecho || {}, notas = r.notas || {}, med = r.medidas || {}, comp = r.comparar || {}, resp = r.respuestas || {};
    const s = r.sesion || {};
    const f = partesFecha(s.fecha, s.hora);
    const cond = plan.condicion || {};
    const suspendido = !!plan.condicion && r.condicion === 'no';
    const marca = function (item) {
      if (suspendido && item.soloSiCondicion) return 'na';
      return hecho[item.id] ? 'si' : 'no';
    };
    const extra = function (item) {
      return suspendido && item.soloSiCondicion ? '(' + (cond.noAplicado || 'no aplicado') + ')' : '';
    };
    let x = '';

    // Datos de la sesión
    const linea = ['Sesión ' + (s.n || '?'), [f.barra, f.hora].filter(Boolean).join(' · ')].filter(Boolean).join(' · ');
    x += p([run(linea, { b: true })], { after: 40 });
    if (s.paciente) x += p([run('Paciente: ', { b: true }), run(s.paciente)], { after: 40 });
    x += p(run(plan.resumen, { sz: 20 }), { after: 40 });
    x += p(run(plan.tipo, { sz: 20, color: '595959' }), { after: 160 });

    // Condición
    const estado = r.condicion === 'si' ? (cond.anexoSi || 'Sí.')
      : r.condicion === 'no' ? (cond.anexoNo || 'No.')
      : 'Sin registrar.';
    if (plan.condicion) x += p([run(cond.pregunta + ': ', { b: true }), run(estado, { b: true, color: r.condicion === 'no' ? 'B91C1C' : '1F2937' })], { shd: 'FDF2E9', after: 0, before: 0 });
    if (plan.condicion) {
      x += p(run(plan.condicion.titulo + ' ' + plan.condicion.siNo, { sz: 20 }), { shd: 'FDF2E9', after: 0 });
      x += p(run(plan.condicion.urgencias, { sz: 20, b: true, color: 'B91C1C' }), { shd: 'FDF2E9', after: 200 });
    }

    // Antes de empezar
    x += h(plan.antes.titulo + ' (' + plan.antes.min + ' min, ' + plan.antes.sub + ')');
    plan.antes.items.forEach(function (it) {
      const elegida = textoRespuesta(resp[it.id]);
      const nota = (notas[it.id] || '').trim();
      x += itemP(elegida || hecho[it.id] ? 'si' : 'no', it.texto);
      const partes = [elegida, nota].filter(Boolean).join(' · ');
      if (partes) x += p([run('→ ', { b: true, sz: 20 }), run(partes, { i: true, sz: 20 })], { ind: 720, after: 80 });
    });

    // Sesión
    const totalMin = plan.bloques.reduce(function (a, b) { return a + b.min; }, 0);
    x += h('Sesión (' + totalMin + ' min)');
    const filas = plan.bloques.map(function (b) {
      const paras = [];
      b.grupos.forEach(function (g) {
        if (g.titulo) paras.push(p(run(g.titulo, { b: true, sz: 20 }), { before: paras.length ? 80 : 0, after: 40, keepNext: true }));
        g.items.forEach(function (it) {
          const runs = [caja(marca(it), 20), run(it.texto, Object.assign({ sz: 20 }, marca(it) === 'na' ? { color: '808080' } : {}))];
          if (extra(it)) runs.push(run('  ' + extra(it), { i: true, sz: 18, color: '7F1D1D' }));
          paras.push(p(runs, { ind: 280, hanging: 280, after: 40 }));
        });
      });
      if (notas[b.id] && notas[b.id].trim()) paras.push(p([run('Notas: ', { b: true, sz: 20 }), run(notas[b.id].trim(), { i: true, sz: 20 })], { before: 60, after: 40 }));
      return { celdas: [p(run(b.nombre, { b: true, sz: 20 }), { after: 0 }), p(run(String(b.min), { sz: 20 }), { after: 0 }), bloqueCelda(paras)] };
    });
    x += tabla([1700, 600, 6754], filas, ['Bloque', 'Min', 'Contenido']);

    // Medidas de la sesión
    const filasMed = plan.medidas.map(function (m) {
      const v = med[m.id];
      let txt = v == null || v === '' || (Array.isArray(v) && !v.length) ? '—' : (m.tipo === 'evn' ? v + '/10' : textoRespuesta(v));
      const nota = (notas[m.id] || '').trim();
      if (nota) txt += (txt === '—' ? '' : ' · ') + nota;
      return { celdas: [m.etiqueta, txt] };
    });
    x += h('Medidas de la sesión');
    x += tabla([5000, 4054], filasMed, ['Medida', 'Resultado']);

    // Programa para casa
    x += h(plan.casa.titulo + ' (' + plan.casa.sub + ')');
    const filasCasa = plan.casa.ejercicios.map(function (e) {
      const m = marca(e);
      const estadoTxt = m === 'na' ? p([caja('na', 20), run('No (' + (cond.noAplicado || 'no aplicado') + ')', { sz: 20, color: '808080' })], { after: 0 })
        : p([caja(m, 20), run('Enseñado', { sz: 20 })], { after: 0 });
      const como = [p(run(e.como, { sz: 20 }), { after: 0 })];
      if (notas[e.id] && notas[e.id].trim()) como.push(p([run('Notas: ', { b: true, sz: 18 }), run(notas[e.id].trim(), { i: true, sz: 18 })], { before: 40, after: 0 }));
      return { celdas: [p(run(e.nombre, { b: true, sz: 20 }), { after: 0 }), e.dosis, bloqueCelda(como), estadoTxt] };
    });
    x += tabla([2100, 2000, 3354, 1600], filasCasa, ['Ejercicio', 'Dosis', 'Cómo', 'Enseñado']);
    x += p(run(plan.casa.nota, { sz: 20, i: true }), { after: 120 });

    // Progresión
    x += h('Progresión del mes');
    x += p(run(plan.progresion.regla, { sz: 20 }), { after: 100 });
    const nAct = Number(s.n) || 0;
    const filasProg = plan.progresion.filas.map(function (fl) {
      const actual = fl.n === nAct;
      return {
        celdas: [actual ? p([run(fl.etiqueta, { b: true, sz: 20 }), run('\nesta sesión', { sz: 18, i: true, color: '7A5200' })], { after: 0 }) : fl.etiqueta].concat(fl.celdas),
        shd: actual ? 'FFF4CC' : undefined,
        run: actual ? { b: true } : {}
      };
    });
    x += tabla([1700, 2300, 2800, 2254], filasProg, ['Sesión'].concat(plan.progresion.columnas));

    x += h('Seguir o cambiar', 2);
    plan.seguir.forEach(function (t) { x += p([run('•  '), run(t, { sz: 20 })], { ind: 360, hanging: 360, after: 40 }); });

    if (plan.comparar) {
    x += h('Medidas para comparar en la sesión ' + plan.comparar.sesion, 2);
    x += tabla([3600, 2900, 2554], plan.comparar.filas.map(function (k) {
      const v = comp[k.id];
      return { celdas: [k.medida, k.inicial, v && String(v).trim() ? String(v).trim() : ''] };
    }), ['Medida', 'Valoración inicial', 'Sesión ' + plan.comparar.sesion]);
    }

    x += h('Durante todo el mes', 2);
    plan.durante.forEach(function (t) { x += p([run('•  '), run(t, { sz: 20 })], { ind: 360, hanging: 360, after: 40 }); });

    if (r.notasGenerales && r.notasGenerales.trim()) {
      x += h('Notas de la sesión');
      r.notasGenerales.trim().split(/\n+/).forEach(function (l) { x += p(run(l), { after: 80 }); });
    }
    return x;
  }

  // Sustituye un control de contenido (sdt en línea) por texto plano con su formato.
  function sdtATexto(xml, alias, texto) {
    const re = new RegExp('<w:sdt>(?:(?!<w:sdt>)[\\s\\S])*?<w:alias w:val="' + alias + '"\\/>[\\s\\S]*?<\\/w:sdt>');
    return xml.replace(re, function (sdt) {
      let rpr = '';
      const pr = /<w:sdtPr>([\s\S]*?)<\/w:sdtPr>/.exec(sdt);
      const rp = pr && /<w:rPr>[\s\S]*?<\/w:rPr>/.exec(pr[1]);
      if (rp) rpr = rp[0];
      else {
        const c = /<w:sdtContent>[\s\S]*?(<w:rPr>[\s\S]*?<\/w:rPr>)/.exec(sdt);
        if (c) rpr = c[1].replace(/<w:rStyle w:val="Textodelmarcadordeposicin"\/>/, '');
      }
      return '<w:r>' + rpr + '<w:t xml:space="preserve">' + esc(texto) + '</w:t></w:r>';
    });
  }

  async function comprobarPlantilla(JSZip, bytes) {
    let zip;
    try { zip = await JSZip.loadAsync(bytes); } catch (e) { return 'No es un archivo de Word (.docx) válido.'; }
    const doc = zip.file('word/document.xml');
    if (!doc) return 'No es un documento de Word (.docx).';
    const d = await doc.async('string');
    if (d.indexOf('<w:alias w:val="Correo"/>') < 0) return 'No encuentro el campo [Correo] del cuerpo: ¿es el Documento_base de la unidad?';
    const cab = Object.keys(zip.files).filter(function (n) { return /^word\/header\d*\.xml$/.test(n); });
    let hayCab = false;
    for (const n of cab) {
      const t = await zip.file(n).async('string');
      if (t.indexOf('w:val="Profesional"') >= 0 && t.indexOf('w:val="Fecha"') >= 0) hayCab = true;
    }
    if (!hayCab) return 'No encuentro los campos [Profesional] y [Fecha] de la cabecera.';
    return '';
  }

  async function construirAnexo(JSZip, bytes, plan, r) {
    const zip = await JSZip.loadAsync(bytes);
    const s = r.sesion || {};
    const f = partesFecha(s.fecha, s.hora);

    // Fuera las partes de SharePoint, las partes rápidas y el complemento.
    const fuera = Object.keys(zip.files).filter(function (n) { return PARTES_FUERA.test(n); });
    fuera.forEach(function (n) { zip.remove(n); });
    const ct = await zip.file('[Content_Types].xml').async('string');
    zip.file('[Content_Types].xml', ct.replace(/<Override PartName="\/(customXml\/[^"]*|word\/glossary\/[^"]*|word\/webextensions\/[^"]*|docProps\/custom\.xml)"[^>]*\/>/g, ''));
    const quitarRels = function (xml) {
      return xml.replace(/<Relationship [^>]*Target="(\.\.\/customXml\/[^"]*|glossary\/[^"]*|word\/webextensions\/[^"]*|docProps\/custom\.xml)"[^>]*\/>/g, '');
    };
    for (const n of ['_rels/.rels', 'word/_rels/document.xml.rels']) {
      const t = await zip.file(n).async('string');
      zip.file(n, quitarRels(t));
    }

    // Cabecera: profesional y fecha como texto.
    const cabeceras = Object.keys(zip.files).filter(function (n) { return /^word\/header\d*\.xml$/.test(n); });
    for (const n of cabeceras) {
      let t = await zip.file(n).async('string');
      t = sdtATexto(t, 'Profesional', s.profesional || '');
      t = sdtATexto(t, 'Fecha', f.barra);
      zip.file(n, t);
    }

    // Cuerpo: título y contenido; el texto legal queda en la última página.
    let d = await zip.file('word/document.xml').async('string');
    d = d.replace('<w:t>Informe</w:t>', '<w:t xml:space="preserve">Anexo ' + esc(s.n || '?') + ' · Plan de sesión</w:t>');
    d = d.replace(/<w:p [^>]*>(?:(?!<w:p[ >])[\s\S])*?<w:alias w:val="Correo"\/>[\s\S]*?<\/w:p>/, function () {
      return cuerpo(plan, r) + '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
    });
    zip.file('word/document.xml', d);

    return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  }

  globalThis.ANEXO = { construirAnexo: construirAnexo, comprobarPlantilla: comprobarPlantilla, nombreArchivo: nombreArchivo, partesFecha: partesFecha };
})();
