/* =========================================================================
   CASA KARINA E TIAGO
   Orquestração da página e dos dois visualizadores IFC
   ========================================================================= */

import { createViewer } from "./viewer.js";

const WORKER_URL = new URL("./fragments-worker.mjs", import.meta.url).href;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse = window.matchMedia("(pointer: coarse)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* -------------------------------------------------------------------------
   Trilho de cotas: níveis reais do projeto como estações da narrativa
   ------------------------------------------------------------------------- */

const LEVELS = [
  { label: "+0,00", id: "sonho" },
  { label: "+3,00", id: "plantas" },
  { label: "+3,50", id: "arquitetura" },
  { label: "+6,70", id: "ponte" },
  { label: "+6,75", id: "estrutura" },
  { label: "TOPO",  id: "equipe" },
];

function buildRail() {
  const holder = $("#railTicks");
  if (!holder) return [];
  const nodes = LEVELS.map((lv, i) => {
    const el = document.createElement("div");
    el.className = "rail__tick";
    el.style.top = `${(i / (LEVELS.length - 1)) * 100}%`;
    el.innerHTML = `<span>${lv.label}</span><i></i>`;
    holder.appendChild(el);
    return el;
  });
  return nodes;
}

const railTicks = buildRail();
const railCursor = $("#railCursor");
const rail = $("#rail");

function setRail(index) {
  railTicks.forEach((n, i) => n.classList.toggle("is-on", i === index));
  if (railCursor && railTicks[index]) railCursor.style.top = railTicks[index].style.top;
}
setRail(0);

/* -------------------------------------------------------------------------
   Cabeçalho, menu e navegação
   ------------------------------------------------------------------------- */

const head = $("#head");
const menu = $("#menu");
const burger = $("#burger");

function closeMenu() {
  menu.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  document.body.classList.remove("is-locked");
}

burger?.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("is-locked", open);
});
$("#menuClose")?.addEventListener("click", closeMenu);
$$("#menu a").forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* Cabeçalho claro sobre seções claras, escuro sobre seções escuras */
const lightZones = ["#sonho", "#plantas", "#equipe"].map((s) => $(s)).filter(Boolean);

function syncChrome() {
  const y = window.scrollY;
  head.classList.toggle("is-stuck", y > 40);

  /* Mede em coordenadas de viewport para não errar quando o layout muda de altura */
  const hb = head.getBoundingClientRect();
  const probe = hb.top + hb.height * 0.62;
  const onLight = lightZones.some((el) => {
    const r = el.getBoundingClientRect();
    return probe >= r.top && probe < r.bottom;
  });
  head.classList.toggle("is-light", onLight);
  rail?.classList.toggle("is-dark", !onLight);

  const doc = document.documentElement;
  const p = y / Math.max(doc.scrollHeight - window.innerHeight, 1);
  const bar = $("#progress");
  if (bar) bar.style.transform = `scaleX(${Math.min(p, 1)})`;
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { syncChrome(); ticking = false; });
}, { passive: true });
syncChrome();

/* Seção ativa no menu e no trilho */
const sections = $$("section[data-rail]");
const navLinks = $$("#nav a");

const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const idx = Number(en.target.dataset.rail);
    setRail(idx);
    const id = en.target.id;
    navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
  });
}, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

sections.forEach((s) => spy.observe(s));

/* -------------------------------------------------------------------------
   Animações
   ------------------------------------------------------------------------- */

function animate() {
  const gsap = window.gsap;
  if (!gsap || reduce) {
    $$(".reveal, .reveal-fast").forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
    $$(".hero__title .row > span").forEach((el) => { el.style.transform = "none"; });
    return;
  }

  /* Entrada */
  const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
  intro
    .from(".hero__media img", { scale: 1.12, duration: 2.1, ease: "power2.out" }, 0)
    .from(".hero__top > *", { yPercent: 60, opacity: 0, duration: 1, stagger: .08 }, .25)
    .from(".hero__title .row > span", { yPercent: 108, duration: 1.35, stagger: .1 }, .35)
    .from(".hero__foot", { opacity: 0, y: 22, duration: 1.1 }, .95)
    .from(".site-head", { opacity: 0, y: -18, duration: .9 }, .1);

  /* Parallax do hero */
  gsap.to("#heroImg", {
    yPercent: 14, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  gsap.to("#closeImg", {
    yPercent: 10, ease: "none",
    scrollTrigger: { trigger: ".closing", start: "top bottom", end: "bottom top", scrub: true },
  });

  /* Revelações */
  $$(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.05, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
  });

  /* Títulos de seção */
  $$(".section .eyebrow, .bridge .eyebrow").forEach((el) => {
    gsap.from(el, {
      opacity: 0, x: -14, duration: .8, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  });

  $$("h2").forEach((el) => {
    gsap.from(el, {
      opacity: 0, y: 26, duration: 1.1, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  /* Códigos estruturais entrando em cascata */
  gsap.from(".bridge__codes span", {
    opacity: 0, y: 14, duration: .7, stagger: .035, ease: "power3.out",
    scrollTrigger: { trigger: ".bridge__codes", start: "top 88%" },
  });

  gsap.from(".bridge__grid", {
    opacity: 0, scale: 1.12, duration: 1.6, ease: "power2.out",
    scrollTrigger: { trigger: ".bridge", start: "top 75%" },
  });

  /* Metadados e itens de planta */
  gsap.from(".meta-item", {
    opacity: 0, y: 18, duration: .8, stagger: .07, ease: "power3.out",
    scrollTrigger: { trigger: ".dream__meta", start: "top 90%" },
  });

  $$(".plan__list").forEach((el) => {
    gsap.from(el.children, {
      opacity: 0, y: 10, duration: .55, stagger: .04, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 92%" },
    });
  });

  /* Cada grupo de filtros anima com o próprio gatilho.
     Um gatilho único deixaria os chips do arquitetônico invisíveis
     até a pessoa chegar na seção estrutural */
  $$(".filters").forEach((group) => {
    gsap.from(group.querySelectorAll(".filter"), {
      opacity: 0, y: 14, duration: .7, stagger: .06, ease: "power3.out",
      scrollTrigger: { trigger: group, start: "top 94%" },
    });
  });
}

/* Rede de segurança: um salto instantâneo, como abrir o site já com âncora
   na URL, pode passar por cima de um gatilho e deixar o bloco invisível.
   Aqui qualquer coisa que já esteja na tela e ainda esteja apagada acende */
function acenderOQueFicouParaTras() {
  const ST = window.ScrollTrigger;
  if (ST) ST.refresh();
  $$(".reveal, .reveal-fast, .filter").forEach((el) => {
    if (parseFloat(getComputedStyle(el).opacity) > 0.02) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 1.1) {
      el.style.opacity = 1;
      el.style.transform = "none";
    }
  });
}

function iniciar() {
  animate();
  setTimeout(acenderOQueFicouParaTras, 900);
}

if (document.readyState === "complete") iniciar();
else window.addEventListener("load", iniciar);

window.addEventListener("hashchange", () => setTimeout(acenderOQueFicouParaTras, 700));

/* -------------------------------------------------------------------------
   Visualizadores
   ------------------------------------------------------------------------- */

const viewers = {};

function wireStage(key, stageId, canvasId, loaderId, pctId, barId, gateId) {
  const stage = $(stageId);
  const canvas = $(canvasId);
  const loader = $(loaderId);
  const pct = $(pctId);
  const bar = $(barId);
  const gate = $(gateId);
  if (!stage) return null;

  let engaged = false;
  let chipTimer = 0;

  /* No celular, avisa uma vez que a rolagem volta ao tocar fora do modelo */
  function flashChip() {
    if (!coarse) return;
    let chip = stage.querySelector(".escape");
    if (!chip) {
      chip = document.createElement("span");
      chip.className = "escape";
      chip.textContent = "Toque fora para rolar a página";
      stage.appendChild(chip);
    }
    chip.classList.add("is-on");
    clearTimeout(chipTimer);
    chipTimer = setTimeout(() => chip.classList.remove("is-on"), 3200);
  }

  function engage() {
    if (engaged) return;
    engaged = true;
    stage.classList.add("is-engaged");
    viewers[key]?.setZoomEnabled(true);
    flashChip();
  }

  function release() {
    if (!engaged) return;
    engaged = false;
    /* No desktop o modelo continua girando com arrasto, só a roda volta para a página */
    if (coarse) stage.classList.remove("is-engaged");
    viewers[key]?.setZoomEnabled(false);
  }

  gate?.addEventListener("click", engage);
  stage.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse") engage();
  });
  stage.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse" && !stage.classList.contains("is-full")) release();
  });
  document.addEventListener("pointerdown", (e) => {
    if (!stage.contains(e.target) && !stage.classList.contains("is-full")) release();
  });

  const setProgress = (v) => {
    const n = Math.round(v * 100);
    if (pct) pct.textContent = `${n}%`;
    if (bar) bar.style.transform = `scaleX(${v})`;
  };

  return {
    stage, canvas, loader, gate,
    setProgress,
    ready() {
      setProgress(1);
      loader?.classList.add("is-done");
      stage.classList.add("is-ready");
      if (!coarse) stage.classList.add("is-engaged");
    },
    fail(err) {
      if (!loader) return;
      loader.classList.remove("is-done");
      loader.innerHTML = `
        <span class="loader__label">Não foi possível carregar</span>
        <p class="loader__hint">Recarregue a página para tentar de novo. Se o problema continuar, o arquivo do modelo pode não ter sido publicado junto com o site</p>`;
      console.error(err);
    },
  };
}

const uiArq = wireStage("arq", "#stageArq", "#canvasArq", "#loaderArq", "#pctArq", "#barArq", "#gateArq");
const uiEst = wireStage("est", "#stageEst", "#canvasEst", "#loaderEst", "#pctEst", "#barEst", "#gateEst");

async function boot(key, ui, opts) {
  if (!ui) return;
  try {
    viewers[key] = await createViewer({
      container: ui.canvas,
      workerUrl: WORKER_URL,
      onProgress: ui.setProgress,
      onError: ui.fail,
      ...opts,
    });
    ui.ready();
    if (opts.after) opts.after(viewers[key]);
  } catch (err) {
    ui.fail(err);
  }
}

/* Carregamento sob demanda: o modelo só baixa quando a seção se aproxima */
const lazy = new IntersectionObserver((entries, obs) => {
  entries.forEach(async (en) => {
    if (!en.isIntersecting) return;
    obs.unobserve(en.target);
    const stage = en.target;
    if (stage.id === "stageArq") {
      await boot("arq", uiArq, {
        modelUrl: stage.dataset.model,
        modelId: stage.dataset.id,
        background: 0x1c1915,
        ambient: 0xfff4e2,
        frameTightness: 1.04,
        after: (v) => countInto(v, COUNT_ARQ),
      });
    } else {
      await boot("est", uiEst, {
        modelUrl: stage.dataset.model,
        modelId: stage.dataset.id,
        background: 0x1c1915,
        ambient: 0xeaf2f8,
        after: refreshCounts,
      });
    }
  });
}, { rootMargin: "700px 0px" });

[$("#stageArq"), $("#stageEst")].forEach((s) => s && lazy.observe(s));

/* -------------------------------------------------------------------------
   Controles
   ------------------------------------------------------------------------- */

$$("[data-act]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const key = btn.dataset.target;
    const v = viewers[key];
    const stage = key === "arq" ? $("#stageArq") : $("#stageEst");
    const act = btn.dataset.act;

    if (act === "full") { toggleFull(stage, key); return; }
    if (!v) return;

    if (act === "in") v.zoom(0.62);
    if (act === "out") v.zoom(1.6);
    if (act === "orbit") v.orbitTo(90);
    if (act === "top") v.topView();
    if (act === "reset") v.reset();
  });
});

function toggleFull(stage, key) {
  const goingFull = !stage.classList.contains("is-full");
  const label = stage.querySelector('[data-act="full"]');

  if (goingFull) {
    stage.classList.add("is-full", "is-engaged");
    document.body.classList.add("is-locked");
    viewers[key]?.setZoomEnabled(true);
    if (label) label.lastChild.textContent = " Sair";
    if (stage.requestFullscreen) stage.requestFullscreen().catch(() => {});
  } else {
    stage.classList.remove("is-full");
    document.body.classList.remove("is-locked");
    if (!coarse) stage.classList.add("is-engaged");
    else { stage.classList.remove("is-engaged"); viewers[key]?.setZoomEnabled(false); }
    if (label) label.lastChild.textContent = " Tela cheia";
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }
  requestAnimationFrame(() => viewers[key]?.resize());
  setTimeout(() => viewers[key]?.resize(), 260);
}

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) return;
  $$(".stage.is-full").forEach((stage) => {
    const key = stage.id === "stageArq" ? "arq" : "est";
    stage.classList.remove("is-full");
    document.body.classList.remove("is-locked");
    const label = stage.querySelector('[data-act="full"]');
    if (label) label.lastChild.textContent = " Tela cheia";
    requestAnimationFrame(() => viewers[key]?.resize());
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  $$(".stage.is-full").forEach((stage) => toggleFull(stage, stage.id === "stageArq" ? "arq" : "est"));
});

/* -------------------------------------------------------------------------
   Filtros de categoria do modelo estrutural
   ------------------------------------------------------------------------- */

const COUNT_EST = {
  pilares: "#cPilares",
  vigas: "#cVigas",
  lajes: "#cLajes",
  escadas: "#cEscadas",
  fundacoes: "#cFundacoes",
};

const COUNT_ARQ = {
  cobertura: "#aCobertura",
  paredes: "#aParedes",
  esquadrias: "#aEsquadrias",
  pisos: "#aPisos",
  escada: "#aEscada",
  mobiliario: "#aMobiliario",
};

/* Lê do próprio modelo quantos elementos existem em cada categoria */
async function countInto(v, map) {
  for (const [cat, sel] of Object.entries(map)) {
    try {
      const n = await v.categoryCount(cat);
      const node = $(sel);
      if (node && n) node.textContent = String(n);
      else if (node && !n) node.closest(".filter")?.remove();
    } catch { /* mantém o valor do modelo */ }
  }
}

/* Paleta de concreto: o modelo do Eberick sai com cores de software,
   aqui ele vira uma maquete física em tons de concreto e aço */
const CONCRETE = {
  lajes:     "#f0ece4",
  pilares:   "#ddd6c9",
  vigas:     "#b0a89a",
  escadas:   "#c9a66b",
  fundacoes: "#7e96a6",
};

async function refreshCounts(v) {
  try { await v.paint(CONCRETE); } catch (e) { console.warn("paleta", e); }
  await countInto(v, COUNT_EST);
}

$$(".filter").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const v = viewers[btn.dataset.target || "est"];
    if (!v) return;
    const cat = btn.dataset.cat;
    const on = !btn.classList.contains("is-on");
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", String(on));
    btn.disabled = true;
    try { await v.setCategory(cat, on); } finally { btn.disabled = false; }
  });
});

/* -------------------------------------------------------------------------
   Rolagem suave com compensação do cabeçalho
   ------------------------------------------------------------------------- */

$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id === "#" || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (id === "#inicio" ? 0 : 24);
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  });
});
