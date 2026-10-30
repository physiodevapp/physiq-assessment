# Numera las páginas de un cuaderno de consulta y le añade la navegación (lo llama generar.mjs,
# sección «cuadernos»).
#   python3 docs/esquemas/paginar.py <cuaderno.pdf> <numeros.pdf> <salida.pdf> <config.json>
# config.json: { "numeradas": [páginas desde 1 con contenido],
#                "enlaces": [{ "pagina": n, "rect": [x0, y0, x1, y1] }]   (filas del índice de la
#                    portada, en puntos PDF con el origen abajo a la izquierda),
#                "marcadores": [{ "titulo", "pagina", "hijos": [{ "titulo", "pagina" }] }] }
# El contenido de cada página numerada se reduce un poco, anclado arriba y centrado, para dejar
# abajo una franja libre donde va el número; luego se superpone la página del mismo orden de
# <numeros.pdf> (generada con Playwright). La portada y las páginas en blanco no se tocan. Las filas
# del índice llevan a su página y el visor muestra los marcadores (sección → hoja); nada de eso se
# ve al imprimir. Necesita pypdf (herramienta del generador, como Playwright).
import json
import sys
from pypdf import PdfReader, PdfWriter, Transformation
from pypdf.generic import ArrayObject, DictionaryObject, FloatObject, NameObject, NumberObject

ESCALA = 0.955  # deja abajo ~13 mm libres: el pie de cada hoja no se toca

entrada, numeros, salida, ruta_config = sys.argv[1:5]
with open(ruta_config, encoding='utf-8') as f:
    config = json.load(f)
con_numero = set(config.get('numeradas', []))
doc, num = PdfReader(entrada), PdfReader(numeros)
w = PdfWriter()
for i, pag in enumerate(doc.pages, start=1):
    if i in con_numero:
        an, al = float(pag.mediabox.width), float(pag.mediabox.height)
        pag.add_transformation(Transformation().scale(ESCALA).translate(an * (1 - ESCALA) / 2, al * (1 - ESCALA)))
        pag.merge_page(num.pages[i - 1])
    w.add_page(pag)
# Índice de la portada: cada fila, un enlace (sin borde) a la primera página de su hoja
# (hecho a mano: el Link de pypdf deja el número de página en /Dest, y el destino de un enlace
# interno tiene que ser la referencia a la página, o algunos visores no saltan)
portada = w.pages[0]
anotaciones = ArrayObject()
for e in config.get('enlaces', []):
    enlace = DictionaryObject({
        NameObject('/Type'): NameObject('/Annot'),
        NameObject('/Subtype'): NameObject('/Link'),
        NameObject('/Rect'): ArrayObject([FloatObject(round(v, 2)) for v in e['rect']]),
        NameObject('/Border'): ArrayObject([NumberObject(0)] * 3),
        NameObject('/Dest'): ArrayObject([w.pages[e['pagina'] - 1].indirect_reference, NameObject('/Fit')]),
    })
    anotaciones.append(w._add_object(enlace))
if anotaciones:
    portada[NameObject('/Annots')] = anotaciones
# Marcadores: Portada, y cada sección con sus hojas
w.add_outline_item('Portada e índice', 0)
for m in config.get('marcadores', []):
    padre = w.add_outline_item(m['titulo'], m['pagina'] - 1, bold=True)
    for h in m.get('hijos', []):
        w.add_outline_item(h['titulo'], h['pagina'] - 1, parent=padre)
w.page_mode = '/UseOutlines'
with open(salida, 'wb') as f:
    w.write(f)
