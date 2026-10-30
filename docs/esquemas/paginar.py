# Numera las páginas de un cuaderno de consulta (lo llama generar.mjs, sección «cuadernos»).
#   python3 docs/esquemas/paginar.py <cuaderno.pdf> <numeros.pdf> <salida.pdf> <páginas>
# <páginas>: las páginas (desde 1) con contenido, separadas por comas. Su contenido se reduce un
# poco, anclado arriba y centrado, para dejar abajo una franja libre donde va el número; luego se
# superpone la página del mismo orden de <numeros.pdf> (generada con Playwright). La portada y las
# páginas en blanco no se tocan. Necesita pypdf (herramienta del generador, como Playwright).
import sys
from pypdf import PdfReader, PdfWriter, Transformation

ESCALA = 0.955  # deja abajo ~13 mm libres: el pie de cada hoja no se toca

entrada, numeros, salida, paginas = sys.argv[1:5]
con_numero = {int(p) for p in paginas.split(',') if p}
doc, num = PdfReader(entrada), PdfReader(numeros)
w = PdfWriter()
for i, pag in enumerate(doc.pages, start=1):
    if i in con_numero:
        an, al = float(pag.mediabox.width), float(pag.mediabox.height)
        pag.add_transformation(Transformation().scale(ESCALA).translate(an * (1 - ESCALA) / 2, al * (1 - ESCALA)))
        pag.merge_page(num.pages[i - 1])
    w.add_page(pag)
with open(salida, 'wb') as f:
    w.write(f)
