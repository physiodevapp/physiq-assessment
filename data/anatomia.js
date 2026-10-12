// ============================================================
// PhysiQ-Assessment · DATA/ANATOMIA.JS
// Estructuras anatómicas que los tests de la fase 4b enlazan a Kenhub
// («Anatomía: Supraespinoso ↗» bajo la fuente del test). Diseño y
// procedimiento por región: docs/anatomia-kenhub.md (Fase K de
// MIGRATION_PLAN.md).
//
// Una entrada por estructura, con la clave que usan los tests en
// `anatomia: ['<clave>']`:
//   nombre — lo que se lee en el enlace (español).
//   kenhub — slug del artículo en inglés: la URL es
//            KENHUB_BASE + kenhub. Cada slug se ha abierto y da 200 con el
//            título de la estructura (2026-10); la versión en español de
//            Kenhub tiene otros slugs y no todos los artículos.
//   nota?  — cuando la estructura no tiene artículo propio y se enlaza
//            el que la trata (se ve en el `title` del enlace).
//
// Varias estructuras pueden compartir artículo (labrum → articulación
// glenohumeral), pero no dentro del mismo test (test unitario).
// ============================================================

export const KENHUB_BASE = 'https://www.kenhub.com/en/library/anatomy/';

export const ESTRUCTURAS = {
  // Hombro
  manguito_rotador:     { nombre: 'Manguito rotador', kenhub: 'the-rotator-cuff' },
  supraespinoso:        { nombre: 'Supraespinoso', kenhub: 'supraspinatus-muscle' },
  infraespinoso:        { nombre: 'Infraespinoso', kenhub: 'infraspinatus-muscle' },
  redondo_menor:        { nombre: 'Redondo menor', kenhub: 'teres-minor-muscle' },
  subescapular:         { nombre: 'Subescapular', kenhub: 'subscapularis-muscle' },
  bursa_subacromial:    { nombre: 'Bursa subacromial', kenhub: 'subacromial-bursa' },
  ligamento_coracoacromial: { nombre: 'Ligamento coracoacromial', kenhub: 'coracoacromial-ligament' },
  ligamento_coracohumeral:  { nombre: 'Ligamento coracohumeral', kenhub: 'coracohumeral-ligament' },
  art_glenohumeral:     { nombre: 'Articulación glenohumeral', kenhub: 'the-shoulder-joint' },
  labrum_glenoideo:     { nombre: 'Labrum glenoideo', kenhub: 'the-shoulder-joint', nota: 'Sin artículo propio: se trata en «Articulación glenohumeral»' },
  biceps_braquial:      { nombre: 'Bíceps braquial', kenhub: 'biceps-brachii-muscle' },
  art_acromioclavicular: { nombre: 'Articulación acromioclavicular', kenhub: 'acromioclavicular-ac-joint' },
  escapula:             { nombre: 'Escápula', kenhub: 'scapula' },
  serrato_anterior:     { nombre: 'Serrato anterior', kenhub: 'serratus-anterior-muscle' },
  trapecio:             { nombre: 'Trapecio', kenhub: 'trapezius-muscle' },
  humero:               { nombre: 'Húmero', kenhub: 'the-humerus' },
  costillas:            { nombre: 'Costillas (1.ª costilla)', kenhub: 'the-ribs' },
  escalenos:            { nombre: 'Escalenos', kenhub: 'scalene-muscles' },
  columna_cervical:     { nombre: 'Columna cervical', kenhub: 'cervical-spine' },
};
