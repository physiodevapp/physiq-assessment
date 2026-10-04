# Esquema del árbol de decisión CIF lumbar (fase 4) — A3 apaisado.
# Textos y posiciones escritos a mano: se comprobaron contra CIF_TREES.lumbar
# (data/lumbar.js) y su navegación real (tests/fixtures/cif-tree-navigation.json).
# Si cambia el árbol, actualizar aquí y regenerar (ver README.md).
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
from xml.sax.saxutils import escape as E
W,H=1587,1123
C=dict(text='#1f2937',muted='#6b7280',qf='#eaf1ff',qs='#3567d6',nf='#f1e9ff',ns='#7c4ddb',mf='#e3f6ee',ms='#0f9a6e',sf='#fff1dc',ss='#d17f00',rf='#fde8e8',rs='#d0342c',pf='#f8fafc',ps='#94a3b8',bf='#f1f5f9')
o=[]
def rect(x,y,w,h,f,s,rx=12,sw=2,dash=None):
    o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{f}" stroke="{s}" stroke-width="{sw}"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')
def text(x,y,lines,size=15,weight='normal',fill=None,anchor='start',lh=None,italic=False):
    lh=lh or size*1.28; fill=fill or C['text']
    for i,l in enumerate(lines):
        o.append(f'<text x="{x}" y="{y+i*lh:.1f}" font-family="Helvetica, Arial, sans-serif" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"'+(' font-style="italic"' if italic else '')+f'>{E(l)}</text>')
def badge(cx,cy,label,f,r=15,size=14):
    o.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{f}"/>')
    text(cx,cy+size*0.36,[label],size,'bold','#ffffff','middle')
def path(d,color='#475569',sw=2.5,head=True):
    o.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linejoin="round"'+(' marker-end="url(#ah)"' if head else '')+'/>')
def label(x,y,t,color=None,size=13):
    text(x,y,[t],size,'bold',color or C['muted'],'middle')

# Título
text(40,58,['Árbol de decisión CIF · Región lumbar'],30,'bold')
text(40,86,['PhysiQ-Assessment · fase 4. Cada respuesta puede sumar una hipótesis; todas se confirman con tests en la fase 4b.'],15,fill=C['muted'])
rect(40,104,1507,44,C['rf'],C['rs'],10)
text(60,132,['REQUISITO PREVIO · Banderas rojas (fase 1) y cribado sistémico (fase 2). Si hay una urgencia, derivar: este árbol no se aplica.'],16,'bold',C['rs'])

# Pasos principales
cols=[40,400,790,1180]; Y=390; BH=125
steps=[('1',['¿El dolor baja por la pierna','(unilateral) y es peor que','el dolor de espalda?'],'SLR < 60°, Slump + o déficit dermatómico',290),
       ('2',['¿Paciente mayor al que le','alivia sentarse o inclinarse','hacia delante?'],'Signo del carrito de la compra',300),
       ('3',['¿Cuál es el patrón de dolor','lumbar predominante?'],'',300),
       ('4',['¿Qué patrón estructural','encaja mejor?'],'Revisar siempre cadera y factores contribuyentes',300)]
for (n,q,sub,w),x in zip(steps,cols):
    rect(x,Y,w,BH,C['qf'],C['qs'],14,2.5)
    badge(x+26,Y+28,n,C['qs'],17,16)
    text(x+52,Y+34,q,17,'bold')
    if sub: text(x+18,Y+BH-14,[sub],12.5,fill=C['muted'],italic=True)

# Desvío 1b / 1c
text(190,170,['Desvío si el dolor de pierna predomina (respuesta SÍ en el paso 1)'],13,'bold',C['muted'],italic=True)
for n,x,q,opts in [('1b',190,['¿El dolor CENTRALIZA con','movimientos repetidos (MDT)?'],'SÍ: mejor pronóstico · NO: no centraliza'),
                   ('1c',580,['¿Déficit de fuerza, sensibilidad','o reflejos frente al lado sano?'],'Miotoma, reflejo o dermatoma alterado')]:
    rect(x,180,300,100,C['qf'],C['qs'],14,2.5)
    badge(x+26,208,n,C['qs'],17,14)
    text(x+52,212,q,16,'bold')
    text(x+18,266,[opts],12.5,fill=C['muted'],italic=True)
# etiquetas de hipótesis del desvío
rect(190,292,300,44,C['nf'],C['ns'],10); badge(214,314,'3',C['ns'],13,13); text(236,319,['Dolor radicular (con SÍ o con NO)'],14,'bold')
rect(580,292,300,44,C['nf'],C['ns'],10); badge(604,314,'5',C['ns'],13,13); text(626,319,['SÍ → Radiculopatía · NO → nada'],14,'bold')

# Flechas del recorrido
path('M110 390 L110 230 L186 230'); label(92,300,'SÍ')
path('M490 230 L576 230')
path('M880 230 L930 230 L930 362 L550 362 L550 386')
path('M330 452 L396 452'); label(363,442,'NO')
path('M700 452 L786 452'); label(743,442,'todas')
path('M1090 452 L1176 452'); label(1133,442,'todas')

# Opciones -> hipótesis
def opt(x,y,t1,t2,card,kind):
    rect(x,y,165,50,C['pf'],C['ps'],10,1.5)
    text(x+12,y+21,[t1],14,'bold'); text(x+12,y+40,[t2],12,fill=C['muted'])
    path(f'M{x+165} {y+25} L{x+181} {y+25}',sw=2)
    cx=x+185
    if kind=='none':
        rect(cx,y,182,50,'#ffffff',C['ps'],10,1.5,'5 4'); text(cx+91,y+31,['sin hipótesis'],13,fill=C['muted'],anchor='middle')
    else:
        f,s=dict(n=(C['nf'],C['ns']),m=(C['mf'],C['ms']),s=(C['sf'],C['ss']),r=(C['rf'],C['rs']))[kind]
        rect(cx,y,182,50,f,s,10,2)
        num,lines=card
        if num: badge(cx+22,y+25,num,s,13,13); tx=cx+42
        else: tx=cx+12
        text(tx,y+21 if len(lines)>1 else y+30,lines,13.5,'bold',lh=17)
Y0=545; dy=60
for i,a in enumerate([('SÍ','alivio al sentarse',('4',['Estenosis /','claud. neurogénica']),'n'),
                      ('NO','sin este patrón',None,'none'),
                      ('VASCULAR','cede con solo pararse',('',['Derivación médica','(claud. vascular)']),'r')]):
    opt(400,Y0+i*dy,a[0],a[1],a[2],a[3])
for i,a in enumerate([('AGUDO / RIGIDEZ','< 16 días, hipomóvil',('1',['Disfunción segm.','(déf. movilidad)']),'m'),
                      ('PERSISTENTE','sensación de «fallo»',('2',['Inestabilidad','(déf. coordinación)']),'m'),
                      ('NINGUNO','dolor inespecífico',None,'none')]):
    opt(790,Y0+i*dy,a[0],a[1],a[2],a[3])
for i,a in enumerate([('DISCOGÉNICO','línea media, centraliza',('6',['Discogénico']),'s'),
                      ('FACETARIO','extensión + rotación',('7',['Facetario']),'s'),
                      ('SACROILÍACA','zona de Fortin',('8',['Articulación','sacroilíaca']),'s'),
                      ('MIOFASCIAL','banda tensa reconocida',('9',['Miofascial']),'s'),
                      ('NINGUNO','sin patrón predominante',None,'none')]):
    opt(1180,Y0+i*dy,a[0],a[1],a[2],a[3])
for x in (400,790,1180): text(x,Y0-12,['Respuestas'],12.5,'bold',C['muted'])

# Nota de la salida vascular
text(400,736,['VASCULAR: el recorrido sigue al paso 3, pero la derivación es prioritaria.','La app la muestra en rojo en la fase 4, la fase 5, las notas y el informe.'],12.5,'bold',C['rs'],lh=17)
# Final sin hipótesis
rect(400,790,760,120,C['bf'],C['ps'],12,2,'6 4')
text(420,818,['Al terminar sin ninguna hipótesis activa'],16,'bold')
text(420,844,['La app propone trabajar con «dolor lumbar inespecífico», revisar los factores psicosociales','(fase 1 y SINSS) y reconsiderar las respuestas. Si el cuadro es crónico y el riesgo psicosocial','es alto, sugiere considerar también sensibilización central.'],13.5,fill=C['text'],lh=19)
path('M1180 850 L1166 850',sw=2)
text(1186,878,['¿ninguna hipótesis?'],12.5,'bold',C['muted'])

# Fin del árbol -> 4b
path('M1363 845 L1363 946'); label(1400,900,'fin',size=12.5)

# Leyenda (columna 1)
text(40,Y0+8,['Leyenda'],16,'bold')
items=[(C['qf'],C['qs'],'Pregunta del árbol'),(C['nf'],C['ns'],'Hipótesis neural (3, 4, 5)'),(C['mf'],C['ms'],'Movilidad y control (1, 2)'),(C['sf'],C['ss'],'Estructural (6, 7, 8, 9)'),(C['rf'],C['rs'],'Seguridad: derivar')]
for i,(f,s,t) in enumerate(items):
    y=Y0+28+i*40; rect(40,y,34,26,f,s,6,2); text(86,y+18,[t],14)
text(40,Y0+250,['Las hipótesis se acumulan: un','paciente puede activar varias.','El recorrido no se corta en','ninguna respuesta.'],13.5,fill=C['muted'],lh=19)

# Banda 4b
rect(40,950,1507,135,C['bf'],'#64748b',14,2)
text(62,980,['Fase 4b · confirmar cada hipótesis activa con sus tests'],18,'bold')
tests=[('1','m','Regla de Flynn (4/5) · PAIVM'),('2','m','Inestabilidad en prono · flexión ≥ 53°'),('3','n','SLR · Slump · criterios RAPIDH'),
       ('4','n','Clúster de estenosis (bilateral, alivio al sentarse…)'),('5','n','Miotomas · reflejos · sensibilidad'),('6','s','Centralización · preferencia direccional'),
       ('7','s','Dolor en extensión/rotación · PA unilateral'),('8','s','Clúster de Laslett (3 de 5)'),('9','s','Banda tensa · punto hipersensible')]
for i,(n,k,t) in enumerate(tests):
    cx=62+(i%3)*500; cy=1010+(i//3)*28
    badge(cx+11,cy-5,n,dict(n=C['ns'],m=C['ms'],s=C['ss'])[k],11,12); text(cx+30,cy,[t],14)

svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#475569"/></marker></defs>
<rect width="{W}" height="{H}" fill="#ffffff"/>
{chr(10).join(o)}
</svg>'''
open('arbol-lumbar.svg','w').write(svg)
open('arbol-lumbar.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><title>Árbol lumbar</title><style>@page{{size:420mm 297mm;margin:0}}html,body{{margin:0;padding:0}}svg{{display:block;width:420mm;height:297mm}}</style></head><body>{svg}</body></html>')
print('svg y html generados')
