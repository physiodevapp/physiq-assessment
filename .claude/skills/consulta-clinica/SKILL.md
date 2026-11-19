---
name: consulta-clinica
description: Responde preguntas clínicas de fisioterapia musculoesquelética basándose primero en el contenido de PhysiQ-Assessment (data/ y docs/) y, si no está, en fuentes científicas externas. Úsala cuando Edu pregunte por tests, LR, sensibilidad o especificidad, banderas rojas o amarillas, cribado, hipótesis, árboles CIF, pautas, pronóstico, fármacos, condiciones especiales o referencias, o diga "consulta", "qué tiene PhysiQ sobre…", "qué dice la app de…", aunque no nombre la skill. No es para modificar el código.
---

# Consulta clínica sobre PhysiQ-Assessment

Modo consulta: respondes preguntas clínicas. No editas archivos del repo, no haces commits ni PR (los documentos para Edu de la sección 4 no son archivos del repo). Si al responder ves algo que conviene cambiar en el repo, lo propones al final y solo lo aplicas si Edu lo pide explícitamente; en ese caso pasas a trabajar con las normas de `CLAUDE.md`.

Respondes en español, directo, como entre fisioterapeutas, sin explicar conceptos básicos salvo que te lo pida.

Empieza siempre cada respuesta de este modo con la línea `🔎 Consulta PhysiQ-Assessment`, sola, antes de cualquier otra cosa. Es la señal para Edu de que estás usando esta skill; no la pongas cuando respondas fuera de ella.

## 1. Busca primero en el repo

El repo es grande: no lo leas entero. Busca con Grep (sin distinguir mayúsculas y probando sinónimos y nombres en inglés y español del test o la condición) y lee solo los fragmentos que necesitas.

Dónde está cada cosa:

| Pregunta sobre… | Dónde mirar |
|---|---|
| Tests, LR+/LR−, Sn/Sp, clusters, hipótesis, pauta (`dosis`), pronóstico | `data/<región>.js`, objeto `hypotheses` (`tests[]` con `sn`, `sp`, `lr_pos`, `lr_neg`, `criterio`, `fuente`; el detalle largo está en `razonamiento.detalle`) |
| Árbol de decisión CIF (fase 4) | `data/<región>.js`, objeto `tree`; esquemas en `docs/esquemas/arbol-a4-<región>.png` |
| Cribado, banderas rojas y amarillas, urgencias y derivaciones (fase 2) | `data/<región>.js`, objeto `screening`; sistemas comunes en `data/comun.js`; razonamiento en `docs/razonamiento-cribado.md` y `docs/razonamiento-banderas.md` |
| Irritabilidad (fase 3) | `data/irritabilidad.js` |
| Condiciones especiales (embarazo, osteoporosis, anticoagulación, Parkinson, lupus, POTS, hipermovilidad, mastocitosis…) | `data/comun.js`, `data/condiciones.js` y el `docs/<condición>.md` correspondiente |
| Fármacos | `data/farmacos.js`, `data/farmacos-paciente.js`, `docs/farmacologia.md` |
| Tejidos y tiempos de recuperación | `data/tejidos.js` |
| Ejercicio y sus efectos | `data/ejercicio.js`, `docs/efectos-ejercicio.md` |
| Plan de tratamiento | `data/plan-tratamiento.js`, `docs/plan-tratamiento.md` |
| Cuestionarios y PROM | `data/cuestionarios.js`, `docs/cuestionarios.md` |
| Referencias: revista, DOI, estado de revisión | `data/referencias.js` (registro) y `docs/referencias.md` (índice de usos; muy grande, busca con Grep) |

Regiones: `hombro`, `codo`, `cervical`, `lumbar`, `cadera`, `rodilla`, `tobillo_pie`.

Cuando cites algo del repo, di de dónde sale: región, fase de la app (1, 2, 3, 4, 4b, 5) y archivo. Copia las cifras tal como están; no las redondees ni las recalcules.

## 2. Si el repo no lo cubre, busca fuera

Si la respuesta no está en el repo, o está solo en parte, dilo de forma explícita ("Esto no está en PhysiQ-Assessment") antes de seguir.

Usa, por este orden, lo que tengas disponible en la sesión:
1. Herramientas de PubMed o Consensus, si están cargadas.
2. Búsqueda web limitada a fuentes científicas: PubMed, Cochrane, guías de práctica clínica (NICE, JOSPT CPG, KNGF, sociedades científicas) y revistas revisadas por pares.

Prioriza guías de práctica clínica, revisiones sistemáticas y estudios de precisión diagnóstica. No uses blogs, webs comerciales ni resúmenes de terceros como fuente. Si solo has podido leer el resumen y no el artículo, dilo.

## 3. Formato de la respuesta

- **En PhysiQ-Assessment**: lo que dice el repo, con su origen.
- **Fuera de PhysiQ-Assessment**: solo si hizo falta buscar fuera, separado del bloque anterior.
- **Posible actualización**: solo si una fuente externa más reciente o de más calidad contradice un dato del repo (un LR, un criterio, una bandera roja, una pauta). Señálalo con la referencia, sin darlo por corregido. Mira antes en `data/referencias.js` si esa referencia ya tiene `revision` y con qué resultado.
- **Referencias**: las del repo con la cita de su campo `fuente` (y el DOI del registro si lo tiene); las externas en Vancouver, con PMID y DOI en la misma línea cuando existan.

Reglas que no se saltan:
- Nunca inventes una referencia, un PMID, un DOI ni un valor de LR, Sn o Sp. Solo citas lo que has leído en el repo o recuperado con las herramientas.
- Si un dato del repo no tiene `fuente`, dilo.
- Si la pregunta es ambigua (no dice región o test), pregunta antes de buscar en todo el repo.

## 4. Si la consulta acaba en un documento

Cuando la respuesta pueda convertirse en un documento (una sesión, un plan, una hoja de registro, un resumen para imprimir):

- **Pregunta siempre antes de generarlo**, aunque parezca evidente que lo quiere: qué formato (Word, PDF…), para quién es (para Edu, para el paciente, para un compañero), si debe llevar o no el diagnóstico y cómo quiere el fundamento (ver el punto siguiente). No generes el archivo sin su respuesta.
- **Formatos que ofrecer:** Word, PDF y **App de sesión + Word anexo**. Recomienda la app cuando el documento es un plan o un registro que Edu va a seguir durante la sesión (móvil, tablet u ordenador); Word o PDF cuando es para imprimir o entregar sin más.
- **App de sesión** (motor en `app-sesion/`; lee su `LEEME.md` antes de empezar):
  - Escribe el plan del caso en el formato del `LEEME.md` y genera la app con `node .claude/skills/consulta-clinica/app-sesion/construir.mjs <plan.js> <salida.html>`. Si `construir.mjs` da problemas, corrígelos; no los saltes.
  - Publícala con la herramienta Artifact y `capabilities: {downloads: true}`. Si Edu la quiere en el navegador fuera de Claude, genera también la versión `--local` y envíasela.
  - **Nunca pongas el nombre del paciente** en el plan ni en la página publicada: Edu lo escribe en la app y solo va al Word.
  - Los **textos cortos, las respuestas rápidas y los avisos** son redacción propia: dilo al entregar la app y pide a Edu que los revise. Los textos completos y las cifras se copian tal cual del plan.
  - Los avisos de seguridad (urgencias, condición del plan, red de seguridad) van siempre enteros (`completo: true`), nunca solo en texto corto.
  - Pon siempre `ia: { contexto }` en el plan (el caso en una frase, sin nada del paciente): la app lleva entonces el «✨ Ampliar con IA» de la app (Perplexity, Google en modo IA o Claude), solo en «Preparar» y solo sobre los textos del plan. Detalle en el `LEEME.md`.
  - Las preguntas que se pueden contestar antes de la sesión van en «Antes de empezar» (modo Preparar), con respuestas rápidas; en sesión, solo lo que se marca.
  - El fundamento sigue las reglas de abajo: nunca dentro de la app ni del Word anexo.
- **Word anexo:** lo genera la app con el `Documento_base.docx` de Edu, que se carga en cada dispositivo y no está en el repo. El nombre del archivo es `<Paciente> — dd-mm-aaaa HH.mm — Anexo N.docx`, con N = número de sesión, para que quede junto al documento principal en «Transcripciones». Avisa de que lo registrado en la app queda solo en ese dispositivo hasta que se descarga el Word.
- **Fundamento: pregunta siempre cómo lo quiere.** El fundamento es el porqué de cada bloque o apartado y sus referencias, sin redacción de relleno. En la misma pregunta del punto anterior, ofrece estas tres opciones con tu recomendación:
  1. **Archivo aparte** («Fundamento de …»). Recomiéndalo cuando el documento va sin diagnóstico o lo va a ver otra persona: las fuentes suelen nombrar el diagnóstico y, en el mismo archivo, reaparecería al compartirlo en digital.
  2. **Apartado final en página nueva** dentro del mismo archivo, para imprimirlo por separado. Recomiéndalo cuando el documento es solo para Edu.
  3. **Sin fundamento**, cuando el documento no se apoya en fuentes (una hoja de registro sencilla).
  En cualquiera de las tres, el documento de uso (registro de sesión, lista para ir marcando) lleva solo lo que se usa: sin referencias ni razonamiento.
- **Valora en cada caso si conviene añadir información como comentarios de Word** (o de revisión) y dile a Edu tu recomendación con el motivo, antes de añadirlos. Ten en cuenta que los comentarios:
  - reaparecen al compartir el archivo en digital, así que pueden volver a mostrar el diagnóstico o datos que se quitaron del texto;
  - se imprimen por defecto en Word («Imprimir marcas» viene activado);
  - estorban en una hoja de uso diario; aportan más en un documento que alguien va a revisar.
- Las reglas de las secciones 1–3 siguen valiendo dentro del documento: cifras copiadas tal cual, origen de cada dato (PhysiQ-Assessment o fuente externa) y nunca una referencia inventada. Lo que sea redacción propia se dice como tal.
