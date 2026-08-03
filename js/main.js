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

/* ================================================================
   EXPANSION: deep pillar content, proactive coach demo,
   multi-pillar assessment engine, and method content.
   All client-side. Nothing is stored or transmitted.
   ================================================================ */

/* ---------------------------------------------------- pillar detail ------- */

const PILLAR_DETAIL = [
  {
    id: "cardio", tag: "01", name: "Cardiorespiratory fitness", lead: "Your aerobic engine, and the single strongest dial you can turn.",
    what: "Cardiorespiratory fitness is how well your heart, lungs, and muscles use oxygen during sustained effort. It is often summarized as VO2max.",
    why: "Across large studies, higher fitness tracks with lower all-cause mortality, and the jump from low fit to moderately fit is the biggest win of all. You do not need to be an athlete to capture most of the benefit.",
    track: ["Easy sessions per week where you can still talk", "Resting heart rate trend over weeks", "How you feel on stairs or a brisk hill"],
    good: "A simple target many people aim for is about 150 minutes of easy to moderate movement a week, in whatever pieces fit your life. This is general education, not a prescription.",
    habits: [
      { move: "Build an easy aerobic base you can hold a conversation through", tier: "strong" },
      { move: "Add one short faster effort once a week as you progress", tier: "moderate" },
    ],
    start: "One 10 minute walk after a meal this week. That counts, and it is enough to begin.",
  },
  {
    id: "strength", tag: "02", name: "Muscle and strength", lead: "The retirement account for your body. Compounds best when you start early.",
    what: "Strength is your ability to produce force, and muscle is the tissue that lets you keep doing the things you love as you age.",
    why: "Muscle and strength protect independence, balance, and metabolic health for decades. It is cheapest to build when you are young and priceless later, which makes it one of the highest-return habits at any age.",
    track: ["Strength sessions per week", "Whether the main movements feel a little harder over time", "Everyday markers like carrying groceries or standing from the floor"],
    good: "Two to three short full-body sessions a week covers most of the benefit for most people. Consistency beats intensity here.",
    habits: [
      { move: "Two full-body strength sessions a week covering push, pull, and legs", tier: "strong" },
      { move: "Nudge the load or reps up gradually as movements get easier", tier: "strong" },
    ],
    start: "Two sets of sit-to-stand and two of wall or knee push-ups at home. Ten minutes, no equipment.",
  },
  {
    id: "sleep", tag: "03", name: "Sleep and circadian", lead: "The force multiplier. Nearly every other pillar improves when sleep does.",
    what: "Sleep is when your body and brain recover, consolidate, and reset. Circadian rhythm is the daily clock that governs when that works best.",
    why: "Consistent, sufficient sleep supports metabolic health, mood, focus, and recovery. Poor sleep quietly undermines training, appetite, and stress, which is why it is worth protecting first.",
    track: ["Average duration", "How consistent your wake time is, weekends included", "How rested you feel on waking"],
    good: "Most adults do best with roughly 7 to 9 hours, and a steady schedule often matters as much as the total. A cool, dark, quiet room helps.",
    habits: [
      { move: "Anchor a consistent wake time, even on weekends", tier: "moderate" },
      { move: "Keep the room cool and dark and protect the last hour before bed", tier: "moderate" },
    ],
    start: "Pick one wake time for the next seven days. That single anchor does a lot.",
    clinician: "If you snore loudly, gasp at night, or wake unrefreshed despite enough hours, ask a clinician about a sleep assessment.",
  },
  {
    id: "metabolic", tag: "04", name: "Metabolic health", lead: "Where hidden risk shows up first, often before the scale moves.",
    what: "Metabolic health is how well your body handles fuel: glucose, insulin, lipids, and blood pressure. Waist-to-height ratio is a simple window into it.",
    why: "Central fat around the middle is more informative than body weight alone. Waist-to-height ratio is a strong, simple signal that ordinary weight can hide, which makes it a useful thing to watch over time.",
    track: ["Waist measured at the navel, divided by your height", "Blood pressure if you have a cuff", "Fasting glucose and lipids from routine labs, when you are ready"],
    good: "A common educational guide is keeping your waist under half your height. This is a general reference, not a diagnosis.",
    habits: [
      { move: "Protect your waist trend with protein, fiber, and daily movement", tier: "strong" },
      { move: "Walk for 10 minutes after your largest meal", tier: "moderate" },
    ],
    start: "Add one fist of vegetables to a meal and a short walk afterward. Small and repeatable wins here.",
    clinician: "Ask your clinician about a baseline metabolic panel, including fasting glucose and lipids, when you feel ready. If labs make you anxious, it is okay to say so and pace it with them.",
  },
  {
    id: "nutrition", tag: "05", name: "Nutrition quality", lead: "Quality and protein first. Not calorie obsession.",
    what: "Nutrition quality is the makeup of what you eat: enough protein, plenty of fiber and whole foods, and fewer ultra-processed items.",
    why: "Enough protein supports muscle, and higher fiber tracks with better metabolic markers. Focusing on quality tends to take care of quantity without the stress of counting everything.",
    track: ["Whether most meals have a real protein source", "Servings of vegetables, fruit, and legumes", "How often meals come from a package versus whole ingredients"],
    good: "A simple frame is protein with most meals, plants at most meals, and ultra-processed foods as the exception rather than the base.",
    habits: [
      { move: "Anchor each meal with a palm or two of protein", tier: "moderate" },
      { move: "Add one extra serving of fiber-rich plants a day", tier: "moderate" },
    ],
    start: "Add one palm of protein to breakfast tomorrow. Build from there.",
  },
  {
    id: "stress", tag: "06", name: "Stress and mind", lead: "Recovery and a mind quiet enough to actually rest.",
    what: "This pillar covers how you recover from load and how settled your mind is, including the wind-down that lets you fall and stay asleep.",
    why: "Chronic, unmanaged stress erodes sleep, mood, and habits. A little deliberate recovery lifts nearly every other pillar, which is why it belongs in the core, not the extras.",
    track: ["How rested versus frazzled you feel most days", "Whether your mind races at bedtime", "Whether you get any genuine recovery in a week"],
    good: "There is no single number. A useful sign is being able to wind down at night and finding at least one real recovery block in your week.",
    habits: [
      { move: "Add a short daily wind-down to downshift the nervous system", tier: "moderate" },
      { move: "Protect one deliberate recovery block each week", tier: "moderate" },
    ],
    start: "Two minutes of slow breathing, or a short written brain-dump, before bed tonight.",
    clinician: "If worry or low mood is persistent or gets in the way of life, a licensed professional can help. Reaching out is a strong move, not a weak one.",
  },
  {
    id: "biomarkers", tag: "07", name: "Biomarkers and labs", lead: "Establish your trendline early. The value is in the trend.",
    what: "Biomarkers are measurable signals from routine labs, such as ApoB, HbA1c, lipids, fasting insulin, and vitamin D, that add detail to how you feel.",
    why: "A baseline established early gives every future result context. The point is not a single perfect panel, it is a trend you and your clinician can watch over years.",
    track: ["A baseline lipid panel including ApoB where available", "HbA1c or fasting glucose", "Vitamin D, and other markers your clinician suggests"],
    good: "What is optimal is individual and belongs in a conversation with your clinician. We help you show up prepared, not self-diagnose.",
    habits: [
      { move: "Get a baseline panel and keep the results somewhere you can see the trend", tier: "moderate" },
      { move: "Re-check on a cadence your clinician recommends", tier: "moderate" },
    ],
    start: "Write down the two or three markers you are most curious about to raise at your next visit.",
    clinician: "Ask which markers make sense for your age and history, and how often to re-check. If bloodwork makes you anxious, tell them, so they can pace it with you.",
  },
  {
    id: "preventive", tag: "08", name: "Preventive and screening", lead: "The quiet basics that catch small things early.",
    what: "Preventive care is the set of routine touchpoints most people mean to keep up with: vaccinations, dental, eye, skin checks, and age-appropriate screenings.",
    why: "Preventive care finds small issues when they are easiest to handle, and keeps a current baseline for the future. It is unglamorous and high value.",
    track: ["Whether dental and eye exams are current", "Skin checks if you are at risk", "Which age-appropriate screenings are due"],
    good: "Being current on the basics for your age and history is the goal. A clinician can tell you exactly what applies to you.",
    habits: [
      { move: "Catch up on the one preventive appointment you have been putting off", tier: "strong" },
      { move: "Keep a simple list of what is done and what is due", tier: "moderate" },
    ],
    start: "Book one appointment this month. Just one is real progress.",
    clinician: "Ask which screenings and vaccinations are due for your age and history.",
  },
  {
    id: "social", tag: "09", name: "Social and purpose", lead: "Strong predictors that most tracking apps ignore.",
    what: "This pillar covers your relationships, sense of connection, and sense of meaning or purpose in daily life.",
    why: "Social connection and purpose are consistently linked to better long-term health and well-being. They are hard to put on a dashboard, which is exactly why they get neglected.",
    track: ["Regular contact with people you care about", "Whether your week includes something meaningful to you", "Feeling supported versus isolated"],
    good: "There is no score to chase. A good sign is regular, genuine connection and at least one thing you do because it matters to you.",
    habits: [
      { move: "Protect one recurring connection with people who matter to you", tier: "moderate" },
      { move: "Keep one activity that gives you a sense of purpose", tier: "emerging" },
    ],
    start: "Reach out to one person this week, for no reason other than to connect.",
  },
];

function renderPillarDetail() {
  const host = document.getElementById("pillar-detail");
  if (!host) return;
  const toc = document.getElementById("pillar-toc");
  if (toc) {
    toc.innerHTML = "";
    PILLAR_DETAIL.forEach((p) => toc.appendChild(el(`<a href="#${p.id}">${p.tag} ${p.name}</a>`)));
  }
  host.innerHTML = "";
  PILLAR_DETAIL.forEach((p) => {
    const habits = p.habits.map((h) =>
      `<li><span class="tier tier--${h.tier}">${TIER_LABEL[h.tier]}</span> ${h.move}</li>`).join("");
    const track = p.track.map((t) => `<li>${t}</li>`).join("");
    const clin = p.clinician
      ? `<div class="pd__clin"><strong>Bring to your clinician:</strong> ${p.clinician}</div>` : "";
    host.appendChild(el(
      `<article class="pd" id="${p.id}">
         <div class="pd__head">
           <span class="pd__tag">Pillar ${p.tag}</span>
           <h2>${p.name}</h2>
           <p class="pd__lead">${p.lead}</p>
         </div>
         <div class="pd__grid">
           <div class="pd__col">
             <h3>What it is</h3><p>${p.what}</p>
             <h3>Why it matters</h3><p>${p.why}</p>
           </div>
           <div class="pd__col">
             <h3>What to track</h3><ul class="ticks">${track}</ul>
             <h3>What good looks like</h3><p>${p.good}</p>
           </div>
         </div>
         <div class="pd__actions">
           <h3>Highest-leverage habits</h3>
           <ul class="habits">${habits}</ul>
           <div class="pd__start"><strong>Start small:</strong> ${p.start}</div>
           ${clin}
         </div>
       </article>`
    ));
  });
}

/* ------------------------------------------------ proactive coach demo ---- */
/* The wedge: the product reaches out with the next best action.
   You do not have to ask. This is a scripted illustration, not real data. */

const COACH_STEPS = [
  { side: "system", stamp: "Tuesday, 7:40 AM", kind: "Nudge", text: "Good morning. You slept about 6 hours and your calendar is light at 4pm. Your single highest-leverage move today is a 20 minute easy walk. Want it on the calendar?", note: "Proactive. It reaches out first, so acting does not depend on you remembering to ask." },
  { side: "you", text: "Sure, add it." },
  { side: "coach", text: "Done. 4:00 to 4:20pm, easy walk. I will give you a heads up 5 minutes before.", note: "One move, not twenty. The plan is prioritized down to the thing that matters most today." },
  { side: "system", stamp: "Tuesday, 3:55 PM", kind: "Reminder", text: "Walk in 5. Easy pace, you should be able to hold a conversation the whole way.", note: "Low friction. The right cue at the right moment beats a dashboard you have to check." },
  { side: "you", text: "Done. Felt good." },
  { side: "coach", text: "Nice. That is three easy sessions this week, your best in a month. No need to do more today.", note: "Forgiving and non-addictive. It closes the loop and tells you when enough is enough." },
  { side: "system", stamp: "Sunday, 9:00 AM", kind: "Weekly review", text: "This week: cardio up, sleep steady. One focus for next week is a more consistent wake time. Small, I promise.", note: "Trend over guilt. A weekly view sets one gentle focus instead of piling on." },
];

let coachIdx = 0;

function renderCoach(upto) {
  const feed = document.getElementById("coach-feed");
  if (!feed) return;
  feed.innerHTML = "";
  COACH_STEPS.slice(0, upto).forEach((s) => {
    if (s.side === "system") {
      feed.appendChild(el(
        `<div class="cmsg cmsg--push">
           <div class="cmsg__app"><span class="cmsg__dot"></span>Longevity Maxxer <span class="cmsg__kind">${s.kind}</span><span class="cmsg__time">${s.stamp}</span></div>
           <div class="cmsg__body">${s.text}</div>
         </div>`));
    } else if (s.side === "coach") {
      feed.appendChild(el(`<div class="cmsg cmsg--coach"><div class="cmsg__body">${s.text}</div></div>`));
    } else {
      feed.appendChild(el(`<div class="cmsg cmsg--you"><div class="cmsg__body">${s.text}</div></div>`));
    }
  });
  feed.scrollTop = feed.scrollHeight;
  const last = COACH_STEPS[upto - 1];
  const cap = document.getElementById("coach-caption");
  if (cap) {
    const withNote = COACH_STEPS.slice(0, upto).reverse().find((s) => s.note);
    cap.textContent = withNote ? withNote.note : "";
  }
  const dots = document.getElementById("coach-dots");
  if (dots) {
    dots.innerHTML = "";
    COACH_STEPS.forEach((_, i) => dots.appendChild(el(`<span class="cdot ${i < upto ? "cdot--on" : ""}"></span>`)));
  }
  const next = document.getElementById("coach-next");
  if (next) next.textContent = upto >= COACH_STEPS.length ? "Replay" : "Play next";
}

function bindCoach() {
  const btn = document.getElementById("coach-next");
  if (!btn) return;
  coachIdx = 1;
  renderCoach(coachIdx);
  btn.addEventListener("click", () => {
    if (coachIdx >= COACH_STEPS.length) { coachIdx = 1; } else { coachIdx += 1; }
    renderCoach(coachIdx);
  });
}

/* --------------------------------------------------- assessment engine ---- */
/* Multi-pillar assessment. Builds a prioritized, evidence-graded action plan.
   Runs 100% in the browser. No inputs are stored or transmitted. */

const ASSESS = [
  { key: "cardio", name: "Cardio", weight: 0.20, questions: [
    { id: "cardioSessions", kind: "range", label: "Easy or harder cardio sessions per week (20 min or more)", min: 0, max: 6, step: 1, def: 2 },
    { id: "cardioZone2", kind: "seg", label: "Can you talk while doing your easy cardio?", opts: [["Rarely do cardio", 0], ["Sometimes", 1], ["Yes, regularly", 2]], def: 1 },
  ]},
  { key: "strength", name: "Strength", weight: 0.16, questions: [
    { id: "strengthSessions", kind: "range", label: "Strength sessions per week", min: 0, max: 5, step: 1, def: 1 },
  ]},
  { key: "sleep", name: "Sleep", weight: 0.18, questions: [
    { id: "sleepHours", kind: "range", label: "Average sleep per night", min: 4, max: 9, step: 0.5, def: 6.5, suffix: "h" },
    { id: "sleepConsistency", kind: "seg", label: "How consistent is your wake time?", opts: [["Varies a lot", 0], ["Somewhat", 1], ["Very consistent", 2]], def: 1 },
  ]},
  { key: "metabolic", name: "Metabolic", weight: 0.16, questions: [
    { id: "waistIn", kind: "range", label: "Waist at the navel", min: 24, max: 60, step: 1, def: 34, suffix: " in" },
    { id: "heightIn", kind: "range", label: "Height", min: 58, max: 82, step: 1, def: 70, suffix: " in" },
  ]},
  { key: "nutrition", name: "Nutrition", weight: 0.12, questions: [
    { id: "nutProtein", kind: "seg", label: "Do your meals include real protein?", opts: [["Rarely", 0], ["Some meals", 1], ["Most meals", 2]], def: 1 },
    { id: "nutWhole", kind: "seg", label: "Whole foods versus ultra-processed?", opts: [["Mostly processed", 0], ["Mixed", 1], ["Mostly whole", 2]], def: 1 },
  ]},
  { key: "stress", name: "Stress and mind", weight: 0.10, questions: [
    { id: "stressRecovery", kind: "seg", label: "Most days you feel...", opts: [["Frazzled", 0], ["Okay", 1], ["Rested", 2]], def: 1 },
    { id: "stressWind", kind: "seg", label: "At bedtime your mind is...", opts: [["Often racing", 0], ["Sometimes busy", 1], ["Usually calm", 2]], def: 1 },
  ]},
  { key: "preventive", name: "Preventive", weight: 0.08, questions: [
    { id: "prevStatus", kind: "seg", label: "Routine care (dental, eye, screenings) is...", opts: [["Behind", 0], ["Partly current", 1], ["Up to date", 2]], def: 1 },
  ]},
];

const ANSWERS = {};
ASSESS.forEach((p) => p.questions.forEach((q) => { ANSWERS[q.id] = q.def; }));

const clamp = (n) => Math.max(0, Math.min(100, n));

function pillarScore(key) {
  const a = ANSWERS;
  switch (key) {
    case "cardio": return Math.round(clamp(Math.min(75, (a.cardioSessions / 5) * 75) + a.cardioZone2 * 12.5));
    case "strength": return Math.round(clamp((a.strengthSessions / 3) * 100));
    case "sleep": {
      const dur = Math.max(0, 100 - Math.abs(8 - a.sleepHours) * 22);
      const adj = [0.7, 0.85, 1][a.sleepConsistency];
      return Math.round(clamp(dur * adj));
    }
    case "metabolic": {
      const whtr = a.waistIn / a.heightIn;
      return Math.round(clamp(100 - (Math.max(0, whtr - 0.45) / 0.20) * 80));
    }
    case "nutrition": return Math.round(clamp(a.nutProtein * 25 + a.nutWhole * 25));
    case "stress": return Math.round(clamp(a.stressRecovery * 25 + a.stressWind * 25));
    case "preventive": return Math.round(clamp(20 + a.prevStatus * 40));
    default: return 0;
  }
}

const ACTIONS = {
  cardio: {
    low: { move: "Add two easy sessions a week you can talk through", why: "Aerobic base is the strongest modifiable signal for long-term health, and easy effort builds it at low cost.", tier: "strong", start: "One 10 minute walk after a meal this week." },
    medium: { move: "Extend one session and add a short brisk finish", why: "You have a base. A little more volume and a touch of intensity raise capacity.", tier: "strong", start: "Add 10 minutes to one walk or ride." },
  },
  strength: {
    low: { move: "Start two short full-body strength sessions a week", why: "Muscle protects independence and metabolism for decades, and it is cheapest to build now.", tier: "strong", start: "Two sets of sit-to-stand and two of push-ups at home. Ten minutes." },
    medium: { move: "Add a third session or a little more load", why: "Progressive load keeps muscle responding over time.", tier: "strong", start: "Add one set to your main movement." },
  },
  sleep: {
    low: { move: "Anchor a consistent wake time and cool, dark the room", why: "Consistent timing and a cool dark room support metabolic health, mood, and recovery.", tier: "moderate", start: "Pick one wake time for the next seven days.", clinician: "If you snore loudly or wake unrefreshed, ask about a sleep assessment." },
    medium: { move: "Protect the last hour before bed and keep timing steady", why: "A calm wind-down and steady schedule deepen sleep quality.", tier: "moderate", start: "Set a wind-down alarm 45 minutes before bed." },
  },
  metabolic: {
    low: { move: "Focus on your waist trend with protein, fiber, and daily movement", why: "Waist-to-height is a strong, simple signal of hidden metabolic risk that weight alone can miss.", tier: "strong", start: "Add one fist of vegetables and a short walk after your largest meal.", clinician: "Ask about a baseline metabolic panel, including fasting glucose and lipids, when you are ready. If labs make you anxious, it is okay to pace them." },
    medium: { move: "Hold your waist trend and keep moving after meals", why: "Small steady habits keep metabolic markers in a good range.", tier: "moderate", start: "Walk 10 minutes after one meal a day." },
  },
  nutrition: {
    low: { move: "Build meals around protein and whole foods", why: "Enough protein and fiber, with fewer ultra-processed foods, supports muscle and metabolic health.", tier: "moderate", start: "Add one palm of protein to breakfast." },
    medium: { move: "Raise fiber with an extra serving of plants", why: "Higher fiber tracks with better metabolic markers.", tier: "moderate", start: "Add one vegetable to one meal today." },
  },
  stress: {
    low: { move: "Add a short daily wind-down to quiet a busy mind", why: "Recovery and a calmer mind improve sleep and mood, which lift every other pillar.", tier: "moderate", start: "Two minutes of slow breathing, or a written brain-dump, before bed.", clinician: "If worry or low mood is persistent, a licensed professional can help. That is a strong move." },
    medium: { move: "Protect one genuine recovery block each week", why: "Deliberate recovery sustains the pace you want to keep.", tier: "moderate", start: "Schedule one 20 minute block that is just for you." },
  },
  preventive: {
    low: { move: "Catch up on the basics: dental, eye, skin, and due screenings", why: "Preventive care finds small things early, when they are easiest to handle.", tier: "strong", start: "Book one appointment this month. Just one.", clinician: "Ask which screenings are due for your age and history. If bloodwork makes you anxious, say so, and pace it with your clinician." },
    medium: { move: "Close the one screening you keep putting off", why: "A complete baseline is peace of mind and a reference for the future.", tier: "moderate", start: "Put the one you avoid on the calendar.", clinician: "If a test makes you anxious, tell your clinician. They can pace it with you." },
  },
};

function computeAssessment() {
  const results = ASSESS.map((p) => ({ key: p.key, name: p.name, weight: p.weight, score: pillarScore(p.key) }));
  const overall = Math.round(results.reduce((s, r) => s + r.score * r.weight, 0) / ASSESS.reduce((s, p) => s + p.weight, 0));

  // priority = weighted gap; only surface real opportunities
  const plan = results
    .map((r) => ({ ...r, gap: (100 - r.score) * r.weight }))
    .filter((r) => r.score < 85)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 4)
    .map((r) => {
      const band = r.score < 55 ? "low" : "medium";
      return { ...r, band, action: ACTIONS[r.key][band] };
    });

  renderAssessResults(overall, results, plan);
}

function renderAssessResults(overall, results, plan) {
  const scoreEl = document.getElementById("assessScore");
  if (scoreEl) scoreEl.textContent = overall;

  const bars = document.getElementById("assessBars");
  if (bars) {
    bars.innerHTML = "";
    results.slice().sort((a, b) => a.score - b.score).forEach((r) => {
      bars.appendChild(el(
        `<div class="abar">
           <div class="abar__top"><span>${r.name}</span><span class="abar__num">${r.score}</span></div>
           <div class="abar__track"><span style="width:${r.score}%"></span></div>
         </div>`));
    });
  }

  const planHost = document.getElementById("assessPlan");
  if (planHost) {
    planHost.innerHTML = "";
    if (!plan.length) {
      planHost.appendChild(el(`<p class="lead">Your fundamentals look solid across the board. Keep the habits that got you here, and revisit this now and then. This is general education, not a medical judgment.</p>`));
    }
    plan.forEach((r, i) => {
      const a = r.action;
      planHost.appendChild(el(
        `<article class="plan">
           <div class="plan__rank">${i + 1}</div>
           <div class="plan__body">
             <div class="plan__meta"><span class="plan__pillar">${r.name}</span><span class="tier tier--${a.tier}">${TIER_LABEL[a.tier]}</span></div>
             <h3>${a.move}</h3>
             <p class="plan__why">${a.why}</p>
             <div class="plan__start"><strong>Start small:</strong> ${a.start}</div>
           </div>
         </article>`));
    });
  }

  const clinHost = document.getElementById("assessClinician");
  if (clinHost) {
    const qs = [];
    plan.forEach((r) => { if (r.action.clinician) qs.push(r.action.clinician); });
    const seen = new Set(); const uniq = qs.filter((q) => !seen.has(q) && seen.add(q));
    if (uniq.length) {
      clinHost.innerHTML = `<h3>Questions to bring to your clinician</h3><ul class="ticks">${uniq.map((q) => `<li>${q}</li>`).join("")}</ul>`;
      clinHost.hidden = false;
    } else {
      clinHost.innerHTML = ""; clinHost.hidden = true;
    }
  }
}

function renderAssessForm() {
  const host = document.getElementById("assessForm");
  if (!host) return;
  host.innerHTML = "";
  ASSESS.forEach((p) => {
    const group = el(`<fieldset class="agroup"><legend>${p.name}</legend></fieldset>`);
    p.questions.forEach((q) => {
      if (q.kind === "range") {
        const val = ANSWERS[q.id];
        const disp = q.suffix ? `${val}${q.suffix}` : val;
        const field = el(
          `<div class="field">
             <label for="a-${q.id}">${q.label} <output for="a-${q.id}">${disp}</output></label>
             <input type="range" id="a-${q.id}" min="${q.min}" max="${q.max}" step="${q.step}" value="${val}" />
           </div>`);
        const input = field.querySelector("input");
        const out = field.querySelector("output");
        input.addEventListener("input", () => {
          ANSWERS[q.id] = Number(input.value);
          out.textContent = q.suffix ? `${input.value}${q.suffix}` : input.value;
          computeAssessment();
        });
        group.appendChild(field);
      } else {
        const seg = el(
          `<div class="field">
             <label>${q.label}</label>
             <div class="seg" role="group" aria-label="${q.label}">
               ${q.opts.map(([lab, v]) => `<button type="button" data-val="${v}" aria-pressed="${v === q.def ? "true" : "false"}">${lab}</button>`).join("")}
             </div>
           </div>`);
        seg.querySelectorAll("button").forEach((b) => {
          b.addEventListener("click", () => {
            seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
            b.setAttribute("aria-pressed", "true");
            ANSWERS[q.id] = Number(b.dataset.val);
            computeAssessment();
          });
        });
        group.appendChild(seg);
      }
    });
    host.appendChild(group);
  });

  const reset = document.getElementById("assessReset");
  if (reset) {
    reset.addEventListener("click", () => {
      ASSESS.forEach((p) => p.questions.forEach((q) => { ANSWERS[q.id] = q.def; }));
      renderAssessForm();
      computeAssessment();
    });
  }
  computeAssessment();
}

/* ----------------------------------------------------------- method ------- */

const DIFFERENTIATORS = [
  { most: "Most apps track more.", we: "We prioritize the few things that move the needle, and we are happy to tell you to do less, better." },
  { most: "Most apps wait for you to open them.", we: "We reach out with the next best action, because tracking is not the same as acting." },
  { most: "Most apps chase completeness.", we: "We rank by leverage and evidence, so effort lands where it pays off." },
  { most: "Most apps collect your data.", we: "We keep interactive tools on your device and receive no health information at all." },
];

const METHOD_STEPS = [
  { k: "Leverage", d: "How much a pillar tends to move long-term health. Fundamentals like cardio, strength, and sleep rank highest." },
  { k: "Evidence", d: "How strong the science is behind a habit, shown as Strong, Moderate, or Emerging so nothing hides behind confident wording." },
  { k: "Your gap", d: "How far a pillar is from a healthy general range for you, based only on inputs you provide on your device." },
];

function renderMethod() {
  const diff = document.getElementById("method-diff");
  if (diff) {
    diff.innerHTML = "";
    DIFFERENTIATORS.forEach((d) => diff.appendChild(el(
      `<div class="diff">
         <div class="diff__most">${d.most}</div>
         <div class="diff__we">${d.we}</div>
       </div>`)));
  }
  const steps = document.getElementById("method-steps");
  if (steps) {
    steps.innerHTML = "";
    METHOD_STEPS.forEach((s) => steps.appendChild(el(
      `<div class="card"><h3>${s.k}</h3><p style="color:var(--muted);margin:0">${s.d}</p></div>`)));
  }
  const evi = document.getElementById("method-evidence");
  if (evi) {
    evi.innerHTML = "";
    EVIDENCE.forEach((e) => evi.appendChild(el(
      `<article class="card">
         <span class="tier tier--${e.tier}">${TIER_LABEL[e.tier]}</span>
         <p style="color:var(--ink);font-weight:600;margin:12px 0 6px">${e.claim}</p>
         <p style="color:var(--muted);font-size:0.92rem;margin:0">${e.note}</p>
       </article>`)));
  }
}

/* ------------------------------------------------------------- init2 ------- */

document.addEventListener("DOMContentLoaded", () => {
  renderPillarDetail();
  bindCoach();
  renderAssessForm();
  renderMethod();
});
