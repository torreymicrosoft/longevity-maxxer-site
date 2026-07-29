/* Longevity Maxxer - content + interactions
   All content lives in these arrays so the site is iterated by editing data and
   pushing a commit. No frameworks, no build, no tracking. */

/* ---------------------------------------------------------------- data ----- */

const PILLARS = [
  { tag: "01", name: "Cardiorespiratory fitness", body: "VO2max is the single strongest modifiable predictor of long-term health. The number one dial." },
  { tag: "02", name: "Muscle and strength", body: "The retirement account for your body. Cheapest to build when you are young, priceless later." },
  { tag: "03", name: "Sleep and circadian", body: "The force multiplier for every other pillar. Duration, consistency, and a cool, dark room." },
  { tag: "04", name: "Metabolic health", body: "Glucose, lipids, blood pressure, and waist-to-height. Where hidden risk shows up first." },
  { tag: "05", name: "Nutrition quality", body: "Enough protein, whole foods, high fiber, low ultra-processed. Not calorie obsession." },
  { tag: "06", name: "Stress and mind", body: "Recovery, mood, and a quiet enough mind to actually fall asleep. An underrated lever." },
  { tag: "07", name: "Biomarkers and labs", body: "Establish your trendline early. ApoB, HbA1c, lipids, fasting insulin, vitamin D." },
  { tag: "08", name: "Preventive and screening", body: "Vaccinations, dental, eye, skin, and the baseline screenings people quietly skip." },
  { tag: "09", name: "Social and purpose", body: "Relationships and meaning are strong longevity predictors that most tracking apps ignore." },
];

const HOW = [
  { title: "Connect what you already have", body: "Bring a wearable, a smart scale, or nothing at all. Import years of history at once or start fresh. Your data is normalized into one clear picture." },
  { title: "See the few things that matter", body: "A plain-language healthspan view with per-pillar sub-scores, each answering why you are seeing it. No vanity metrics, no noise." },
  { title: "Get the next best action, first", body: "The engine reaches out with your single highest-leverage move for today. You do not have to ask. That is the whole point." },
  { title: "Compound small wins", body: "Gentle, non-addictive nudges, streak forgiveness for busy weeks, and a weekly review that shows the trend, not the guilt." },
];

const PERSONAS = [
  {
    initials: "AX", color: "#0ea5a4", name: "Alex, 27", role: "Product manager, married",
    type: "The Data-Rich Optimizer",
    origin: true,
    points: [
      "Wears a smartwatch 24/7, checks health apps daily, reviews the trends.",
      "A normal-looking weight hides central fat that a waist measurement exposes.",
      "Wants to act, but only follows through when something pings first.",
    ],
    signal: "Needs proactive, prioritized guidance, not another dashboard.",
  },
  {
    initials: "MA", color: "#4f46e5", name: "Maya, 31", role: "Elementary teacher",
    type: "The Overwhelmed Beginner",
    points: [
      "No wearable, no data, feels years behind everyone online.",
      "Drowning in conflicting advice and a little ashamed to start.",
      "Wants one clear thing to do, not a menu of twenty.",
    ],
    signal: "Needs radical simplicity and a shame-free on-ramp.",
  },
  {
    initials: "RE", color: "#0891b2", name: "Ren, 34", role: "Software engineer",
    type: "The Quantified Extremist",
    points: [
      "CGM, two wearables, a big supplement stack, cold plunge, quarterly panels.",
      "Over-invests in the last five percent while quietly under-sleeping.",
      "Optimizes the wrong things and feels the spend creep.",
    ],
    signal: "Needs evidence tiers and leverage ranking that say do less, better.",
  },
  {
    initials: "DI", color: "#b45309", name: "Diane, 42", role: "Director, two kids",
    type: "The Time-Poor Professional-Parent",
    points: [
      "Chronic sleep debt, high stress, and near-zero free time.",
      "One missed day tips into an all-or-nothing collapse.",
      "Only has room for the highest-return moves.",
    ],
    signal: "Needs micro-habits, streak forgiveness, and a minimum effective dose.",
  },
  {
    initials: "MR", color: "#b91c1c", name: "Marcus, 49", role: "Regional sales lead",
    type: "The Post-Diagnosis Comeback",
    points: [
      "A recent checkup flagged borderline markers and a change-now talk.",
      "Motivated but anxious, and unsure where to start after a scare.",
      "Wants to complement his physician, not replace them.",
    ],
    signal: "The guardrail persona: educational only, always route to care, never diagnose.",
  },
  {
    initials: "SA", color: "#15803d", name: "Sam, 30", role: "Pulled in by a partner",
    type: "The Reluctant Partner",
    points: [
      "Low intrinsic motivation and does not want another nagging app.",
      "Will not track much, and that has to be okay.",
      "Wants to be met where they are, not optimized.",
    ],
    signal: "Needs household-as-unit design that handles asymmetric motivation with grace.",
  },
];

const EVIDENCE = [
  { tier: "strong", claim: "Higher cardiorespiratory fitness tracks with lower all-cause mortality.", note: "Consistent across large cohort studies." },
  { tier: "strong", claim: "Resistance training preserves muscle and function with age.", note: "Broad clinical consensus." },
  { tier: "moderate", claim: "Consistent sleep timing supports metabolic and mood outcomes.", note: "Good observational and mechanistic support." },
  { tier: "moderate", claim: "Higher dietary fiber is associated with better metabolic markers.", note: "Strong association, dose still debated." },
  { tier: "emerging", claim: "Time-restricted eating may aid some metabolic markers.", note: "Promising but mixed, individual response varies." },
  { tier: "emerging", claim: "Cold exposure for recovery and mood is an active research area.", note: "Early evidence, easy to over-invest in." },
];

const SAFETY_SOLUTIONS = [
  { title: "Zero-PHI by architecture", body: "The site is fully static with no backend, no accounts, and no health-data forms. There is nothing to breach because we never receive your health information in the first place. This is immunity by design, not a promise on paper." },
  { title: "Your data stays on your device", body: "Interactive tools run entirely in your browser. Inputs are computed locally and are never transmitted or stored on a server. Close the tab and it is gone." },
  { title: "Evidence tiers on every claim", body: "Health statements carry a Strong, Moderate, or Emerging label so you can see the strength of the science, not just a confident sentence." },
  { title: "Coach, not clinician", body: "We suggest habits. We never diagnose, prescribe, dose, or treat. Language and features are built to inform and to route you to a licensed professional." },
  { title: "General wellness positioning", body: "Content promotes healthy lifestyle for general well-being. It does not claim to diagnose, cure, mitigate, treat, or prevent any disease." },
  { title: "Clear escalation and scope", body: "Concerning patterns point you to a clinician, never to an in-app verdict. A visible scope statement and an emergency note keep the boundary obvious." },
];

const FAQS = [
  { q: "Is Longevity Maxxer medical advice?", a: "No. It is an educational wellness tool. It does not diagnose, treat, or prescribe, and it is not a substitute for care from a licensed professional. Always talk to your clinician about your specific situation." },
  { q: "Do you store my health data?", a: "The public site collects no health information at all. The interactive self-check runs entirely in your browser and stores nothing on any server. There is no account and no health-data form." },
  { q: "How do you decide what to recommend?", a: "We prioritize the highest-leverage fundamentals first and grade claims with an evidence tier. We would rather tell you to do a few proven things well than sell you the exotic last five percent." },
  { q: "What do you do with concerning results?", a: "We route you to a licensed clinician. We do not render a diagnosis or an in-app medical judgment. If something is urgent, we point you to emergency services." },
  { q: "Can I use this instead of seeing a doctor?", a: "No. It is designed to complement professional care, help you show up prepared, and support good daily habits between visits." },
];

/* ------------------------------------------------------------- helpers ----- */

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function mount(id, nodes) {
  const host = document.getElementById(id);
  if (!host) return;
  host.innerHTML = "";
  nodes.forEach((n) => host.appendChild(n));
}

const TIER_LABEL = { strong: "Strong evidence", moderate: "Moderate evidence", emerging: "Emerging evidence" };

/* --------------------------------------------------------- rendering ------- */

function renderPillars() {
  mount("pillars-grid", PILLARS.map((p) =>
    el(`<article class="card card--hover">
          <span class="pillar__tag">Pillar ${p.tag}</span>
          <h3>${p.name}</h3>
          <p>${p.body}</p>
        </article>`)
  ));
}

function renderHow() {
  mount("how-grid", HOW.map((h) =>
    el(`<div class="step card">
          <h3>${h.title}</h3>
          <p style="color:var(--muted);margin:0">${h.body}</p>
        </div>`)
  ));
}

function renderPersonas(hostId, full) {
  const host = document.getElementById(hostId);
  if (!host) return;
  mount(hostId, PERSONAS.map((p) =>
    el(`<article class="card persona">
          <div class="persona__head">
            <div class="persona__avatar" style="background:${p.color}">${p.initials}</div>
            <div>
              <div class="persona__name">${p.name}</div>
              <div class="persona__role">${p.role}</div>
            </div>
          </div>
          <div class="persona__type">${p.type}${p.origin ? ' <span class="tier tier--emerging" style="vertical-align:middle">Customer 0 archetype</span>' : ""}</div>
          <ul class="persona__list">${p.points.map((pt) => `<li>${pt}</li>`).join("")}</ul>
          <div class="persona__signal"><strong>What they need:</strong> ${p.signal}</div>
        </article>`)
  ));
}

function renderEvidence() {
  mount("evidence-grid", EVIDENCE.map((e) =>
    el(`<article class="card">
          <span class="tier tier--${e.tier}">${TIER_LABEL[e.tier]}</span>
          <p style="color:var(--ink);font-weight:600;margin:12px 0 6px">${e.claim}</p>
          <p style="color:var(--muted);font-size:0.92rem;margin:0">${e.note}</p>
        </article>`)
  ));
}

function renderSafetySolutions() {
  mount("solutions", SAFETY_SOLUTIONS.map((s, i) =>
    el(`<article class="card solution">
          <div class="solution__num">${i + 1}</div>
          <div>
            <h3 style="margin-bottom:6px">${s.title}</h3>
            <p style="color:var(--muted);margin:0">${s.body}</p>
          </div>
        </article>`)
  ));
}

function renderFaqs() {
  mount("faqs", FAQS.map((f) =>
    el(`<details class="qa">
          <summary>${f.q}</summary>
          <div class="qa__body">${f.a}</div>
        </details>`)
  ));
}

/* --------------------------------------------------- hero score ring ------- */

function drawRing() {
  const ring = document.querySelector(".ring");
  if (!ring) return;
  const val = Number(ring.dataset.val || 78);
  const r = 56, c = 2 * Math.PI * r;
  ring.innerHTML =
    `<svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true">
       <circle cx="64" cy="64" r="${r}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="12"/>
       <circle cx="64" cy="64" r="${r}" fill="none" stroke="url(#g)" stroke-width="12"
         stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}"/>
       <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0" stop-color="#0ea5a4"/><stop offset="1" stop-color="#5eead4"/>
       </linearGradient></defs>
     </svg><div class="ring__num">0</div>`;
  const arc = ring.querySelectorAll("circle")[1];
  const num = ring.querySelector(".ring__num");
  requestAnimationFrame(() => { arc.style.transition = "stroke-dashoffset 1.1s ease"; arc.style.strokeDashoffset = c * (1 - val / 100); });
  let n = 0;
  const step = () => { n += 2; if (n >= val) n = val; num.textContent = n; if (n < val) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ------------------------------------------------ client-side self-check --- */
/* Runs 100% in the browser. Nothing is transmitted or stored on a server. */

const CHECK = {
  cardio: 3, strength: 2, sleep: 6.5, nutrition: 1, stress: 1,
};
const WEIGHTS = { cardio: 0.28, sleep: 0.24, strength: 0.2, nutrition: 0.16, stress: 0.12 };
const FOCUS_COPY = {
  cardio: "Aerobic base. A couple of easy Zone 2 sessions a week is the highest-leverage place to start.",
  sleep: "Sleep consistency and duration. Aim for a steady schedule and a cool, dark room.",
  strength: "Resistance training. Two to three sessions a week protects muscle for decades.",
  nutrition: "Whole-food quality and fiber. Add vegetables and protein you did not have to unwrap.",
  stress: "Recovery and a wind-down. A short brain-dump before bed can quiet a racing mind.",
};

function sub(key) {
  const v = CHECK[key];
  if (key === "cardio") return Math.min(100, (v / 5) * 100);
  if (key === "strength") return Math.min(100, (v / 3) * 100);
  if (key === "sleep") { const d = Math.abs(8 - v); return Math.max(0, 100 - d * 22); }
  if (key === "nutrition") return v * 50;   // 0 low, 1 medium, 2 high
  if (key === "stress") return v * 50;      // 0 high stress, 1 medium, 2 low
  return 0;
}

function computeCheck() {
  let score = 0;
  Object.keys(WEIGHTS).forEach((k) => { score += sub(k) * WEIGHTS[k]; });
  score = Math.round(score);
  // focus = pillar with the largest weighted opportunity (gap to 100)
  let focus = "cardio", maxGap = -1;
  Object.keys(WEIGHTS).forEach((k) => {
    const gap = (100 - sub(k)) * WEIGHTS[k];
    if (gap > maxGap) { maxGap = gap; focus = k; }
  });
  const numEl = document.getElementById("checkScore");
  const focusEl = document.getElementById("checkFocus");
  if (numEl) numEl.textContent = score;
  if (focusEl) focusEl.textContent = FOCUS_COPY[focus];
}

function bindCheck() {
  const form = document.getElementById("selfcheckForm");
  if (!form) return;
  form.querySelectorAll("input[type=range]").forEach((inp) => {
    const out = form.querySelector(`output[for="${inp.id}"]`);
    const sync = () => {
      CHECK[inp.dataset.key] = Number(inp.value);
      if (out) out.textContent = inp.dataset.suffix ? `${inp.value}${inp.dataset.suffix}` : inp.value;
      computeCheck();
    };
    inp.addEventListener("input", sync); sync();
  });
  form.querySelectorAll(".seg").forEach((seg) => {
    seg.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        CHECK[seg.dataset.key] = Number(b.dataset.val);
        computeCheck();
      });
    });
  });
  computeCheck();
}

/* ------------------------------------------------------------- chrome ------ */

function bindNav() {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("hide"));
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      if (window.innerWidth <= 900) links.classList.add("hide");
    }));
    if (window.innerWidth <= 900) links.classList.add("hide");
  }
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  renderPillars();
  renderHow();
  renderPersonas("personas-grid");
  renderPersonas("personas-full");
  renderEvidence();
  renderSafetySolutions();
  renderFaqs();
  drawRing();
  bindCheck();
  bindNav();
});
