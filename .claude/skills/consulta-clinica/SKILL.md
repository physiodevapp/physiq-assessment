---
name: consulta-clinica
description: Responde preguntas clínicas de fisioterapia musculoesquelética basándose primero en el contenido de PhysiQ-Assessment (data/ y docs/) y, si no está, en fuentes científicas externas. Úsala cuando Edu pregunte por tests, LR, sensibilidad o especificidad, banderas rojas o amarillas, cribado, hipótesis, árboles CIF, pautas, pronóstico, fármacos, condiciones especiales o referencias, o diga "consulta", "qué tiene PhysiQ sobre…", "qué dice la app de…", aunque no nombre la skill. No es para modificar el código.
---

# Consulta clínica sobre PhysiQ-Assessment

Modo consulta: respondes preguntas clínicas. No editas archivos, no haces commits ni PR. Si al responder ves algo que conviene cambiar en el repo, lo propones al final y solo lo aplicas si Edu lo pide explícitamente; en ese caso pasas a trabajar con las normas de `CLAUDE.md`.

Respondes en español, directo, como entre fisioterapeutas, sin explicar conceptos básicos salvo que te lo pida.

Empieza siempre cada respuesta de este modo con la línea `🔎 Consulta PhysiQ`, sola, antes de cualquier otra cosa. Es la señal para Edu de que estás usando esta skill; no la pongas cuando respondas fuera de ella.

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

Si la respuesta no está en el repo, o está solo en parte, dilo de forma explícita ("Esto no está en PhysiQ") antes de seguir.

Usa, por este orden, lo que tengas disponible en la sesión:
1. Herramientas de PubMed o Consensus, si están cargadas.
2. Búsqueda web limitada a fuentes científicas: PubMed, Cochrane, guías de práctica clínica (NICE, JOSPT CPG, KNGF, sociedades científicas) y revistas revisadas por pares.

Prioriza guías de práctica clínica, revisiones sistemáticas y estudios de precisión diagnóstica. No uses blogs, webs comerciales ni resúmenes de terceros como fuente. Si solo has podido leer el resumen y no el artículo, dilo.

## 3. Formato de la respuesta

- **En PhysiQ**: lo que dice el repo, con su origen.
- **Fuera de PhysiQ**: solo si hizo falta buscar fuera, separado del bloque anterior.
- **Posible actualización**: solo si una fuente externa más reciente o de más calidad contradice un dato del repo (un LR, un criterio, una bandera roja, una pauta). Señálalo con la referencia, sin darlo por corregido. Mira antes en `data/referencias.js` si esa referencia ya tiene `revision` y con qué resultado.
- **Referencias**: las del repo con la cita de su campo `fuente` (y el DOI del registro si lo tiene); las externas en Vancouver, con PMID y DOI en la misma línea cuando existan.

Reglas que no se saltan:
- Nunca inventes una referencia, un PMID, un DOI ni un valor de LR, Sn o Sp. Solo citas lo que has leído en el repo o recuperado con las herramientas.
- Si un dato del repo no tiene `fuente`, dilo.
- Si la pregunta es ambigua (no dice región o test), pregunta antes de buscar en todo el repo.
