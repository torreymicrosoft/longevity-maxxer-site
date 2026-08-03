/* Longevity Maxxer - real client-side analysis.
   Loaded only on app.html. Everything here runs in the browser.
   Your file is read with the local FileReader API, parsed in memory, and never
   uploaded, stored, or transmitted. Reload the page and it is gone.

   This file is intentionally self contained (no dependency on main.js) so the
   pure logic can be unit tested in Node. The only runtime dependency is JSZip
   (vendored locally) and only when the dropped file is a .zip. */

;(function (root) {
  "use strict";

  /* ------------------------------------------------------------ helpers ---- */

  function toNum(x) {
    if (x === null || x === undefined) return NaN;
    const n = parseFloat(String(x).replace(/[^0-9eE.+-]/g, ""));
    return isNaN(n) ? NaN : n;
  }

  function parseDate(s) {
    if (!s) return null;
    s = String(s).trim();
    if (!s) return null;
    // Withings uses "2026-07-27 22:40:34" (space) or ISO with offset.
    const iso = s.indexOf("T") >= 0 ? s : s.replace(" ", "T");
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

  function mean(arr) {
    const v = arr.filter((n) => typeof n === "number" && !isNaN(n));
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN;
  }

  function stdev(arr) {
    const v = arr.filter((n) => typeof n === "number" && !isNaN(n));
    if (v.length < 2) return NaN;
    const m = mean(v);
    return Math.sqrt(mean(v.map((n) => (n - m) * (n - m))));
  }

  function median(arr) {
    const v = arr.filter((n) => typeof n === "number" && !isNaN(n)).sort((a, b) => a - b);
    if (!v.length) return NaN;
    const mid = Math.floor(v.length / 2);
    return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
  }

  const clampScore = (n) => Math.max(0, Math.min(100, n));

  // piecewise linear interpolation over sorted [x, y] breakpoints
  function linterp(breaks, x) {
    if (x <= breaks[0][0]) return breaks[0][1];
    const last = breaks[breaks.length - 1];
    if (x >= last[0]) return last[1];
    for (let i = 0; i < breaks.length - 1; i++) {
      const [x0, y0] = breaks[i];
      const [x1, y1] = breaks[i + 1];
      if (x >= x0 && x <= x1) {
        const t = (x - x0) / (x1 - x0);
        return y0 + t * (y1 - y0);
      }
    }
    return last[1];
  }

  const KG_TO_LB = 2.2046226218;

  /* --------------------------------------------------------- CSV parser ---- */
  /* RFC 4180 style: handles quoted fields, doubled quotes, commas and newlines
     inside quotes. Returns an array of objects keyed by the header row. */

  function parseCSV(text) {
    if (text == null) return [];
    text = String(text);
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
    const rows = [];
    let row = [];
    let field = "";
    let inQ = false;
    let i = 0;
    const n = text.length;
    while (i < n) {
      const c = text[i];
      if (inQ) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQ = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if (c === '"') { inQ = true; i++; continue; }
      if (c === ",") { row.push(field); field = ""; i++; continue; }
      if (c === "\r") { i++; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += c; i++;
    }
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    if (!rows.length) return [];
    const header = rows[0].map((h) => String(h).trim());
    const out = [];
    for (let r = 1; r < rows.length; r++) {
      const cells = rows[r];
      if (cells.length === 1 && cells[0] === "") continue;
      const o = {};
      for (let k = 0; k < header.length; k++) o[header[k]] = cells[k] !== undefined ? cells[k] : "";
      out.push(o);
    }
    return out;
  }

  function keyMatching(obj, re) {
    return Object.keys(obj || {}).find((k) => re.test(k)) || null;
  }

  /* --------------------------------------------------- Withings adapters --- */

  function parseWeight(text) {
    const rows = parseCSV(text);
    if (!rows.length) return [];
    const wKey = keyMatching(rows[0], /^weight/i);
    const fKey = keyMatching(rows[0], /^fat mass/i);
    const mKey = keyMatching(rows[0], /^muscle mass/i);
    const metric = /\(kg\)/i.test(wKey || "");
    const conv = (v) => (metric ? v * KG_TO_LB : v);
    return rows
      .map((r) => ({
        date: parseDate(r.Date || r.date),
        weight: conv(toNum(r[wKey])),
        fat: fKey ? conv(toNum(r[fKey])) : NaN,
        muscle: mKey ? conv(toNum(r[mKey])) : NaN,
      }))
      .filter((r) => r.date && r.weight > 0)
      .sort((a, b) => a.date - b.date);
  }

  function heightToInches(raw, isMeters) {
    if (raw == null) return NaN;
    raw = String(raw).trim();
    const fi = raw.match(/(\d+)\s*'\s*([\d.]+)/); // 6' 1.6''
    if (fi) return Number(fi[1]) * 12 + Number(fi[2]);
    const num = parseFloat(raw);
    if (isNaN(num)) return NaN;
    return isMeters ? num * 39.3700787 : num;
  }

  function parseHeightInches(text) {
    const rows = parseCSV(text);
    if (!rows.length) return NaN;
    const hKey = keyMatching(rows[0], /^height/i);
    const isMeters = /\(m\)/i.test(hKey || "");
    const sorted = rows
      .map((r) => ({ date: parseDate(r.Date || r.date), raw: r[hKey] }))
      .filter((r) => r.date)
      .sort((a, b) => b.date - a.date);
    const raw = sorted.length ? sorted[0].raw : rows[0][hKey];
    return heightToInches(raw, isMeters);
  }

  function parseAggregate(text) {
    const rows = parseCSV(text);
    if (!rows.length) return [];
    return rows
      .map((r) => ({ date: parseDate(r.date || r.Date), value: toNum(r.value !== undefined ? r.value : r.Value) }))
      .filter((r) => r.date && !isNaN(r.value))
      .sort((a, b) => a.date - b.date);
  }

  function parseSleep(text) {
    const rows = parseCSV(text);
    if (!rows.length) return [];
    return rows
      .map((r) => {
        const from = parseDate(r.from);
        const to = parseDate(r.to);
        const light = toNum(r["light (s)"]);
        const deep = toNum(r["deep (s)"]);
        const rem = toNum(r["rem (s)"]);
        const awake = toNum(r["awake (s)"]);
        const asleep = (isNaN(light) ? 0 : light) + (isNaN(deep) ? 0 : deep) + (isNaN(rem) ? 0 : rem);
        const inBed = from && to ? (to - from) / 1000 : asleep + (isNaN(awake) ? 0 : awake);
        const hrMin = toNum(r["Heart rate (min)"]);
        const hrAvg = toNum(r["Average heart rate"]);
        return {
          from: from,
          to: to,
          asleepH: asleep / 3600,
          inBedH: inBed / 3600,
          eff: inBed > 0 ? asleep / inBed : NaN,
          deepH: (isNaN(deep) ? 0 : deep) / 3600,
          remH: (isNaN(rem) ? 0 : rem) / 3600,
          latencyMin: toNum(r["Duration to sleep (s)"]) / 60,
          hrMin: hrMin > 0 ? hrMin : NaN,
          hrAvg: hrAvg > 0 ? hrAvg : NaN,
        };
      })
      .filter((r) => r.from && r.asleepH >= 3) // real nights, not naps
      .sort((a, b) => a.from - b.from);
  }

  function parsePwv(text) {
    return parseAggregate(text); // date,value (m/s)
  }

  function parseBp(text) {
    const rows = parseCSV(text);
    if (!rows.length) return [];
    return rows
      .map((r) => ({
        date: parseDate(r.Date || r.date),
        hr: toNum(r["Heart rate"] !== undefined ? r["Heart rate"] : r["Heart Rate"]),
        sys: toNum(r.Systolic),
        dia: toNum(r.Diastolic),
      }))
      .filter((r) => r.date)
      .sort((a, b) => a.date - b.date);
  }

  function parseActivities(text) {
    const rows = parseCSV(text);
    if (!rows.length) return [];
    return rows
      .map((r) => {
        let d = {};
        try { d = JSON.parse(r.Data || "{}"); } catch (e) { d = {}; }
        return {
          from: parseDate(r.from),
          to: parseDate(r.to),
          type: String(r["Activity type"] || "").trim(),
          intensity: Number(d.intensity) || 0,
          calories: Number(d.calories || d.manual_calories) || 0,
        };
      })
      .filter((r) => r.from)
      .sort((a, b) => a.from - b.from);
  }

  /* ---------------------------------------------------------- analysis ----- */

  const DAY = 86400000;

  function windowFrom(list, asOf, days, dateKey) {
    const cutoff = asOf - days * DAY;
    return list.filter((r) => {
      const d = dateKey ? r[dateKey] : r.date;
      return d && d >= cutoff && d <= asOf;
    });
  }

  function trend(series, valueKey) {
    // returns latest minus value ~ start of window, or NaN
    if (series.length < 2) return NaN;
    const first = series[0];
    const last = series[series.length - 1];
    const a = valueKey ? first[valueKey] : first.value;
    const b = valueKey ? last[valueKey] : last.value;
    if (isNaN(a) || isNaN(b)) return NaN;
    return b - a;
  }

  function analyzeFiles(map) {
    // map: basename(lower) -> csv text
    const get = (name) => map[name] || null;

    const weight = get("weight.csv") ? parseWeight(get("weight.csv")) : [];
    const heightIn = get("height.csv") ? parseHeightInches(get("height.csv")) : NaN;
    const steps = get("aggregates_steps.csv") ? parseAggregate(get("aggregates_steps.csv")) : [];
    const distance = get("aggregates_distance.csv") ? parseAggregate(get("aggregates_distance.csv")) : [];
    const sleep = get("sleep.csv") ? parseSleep(get("sleep.csv")) : [];
    const pwv = get("pwv.csv") ? parsePwv(get("pwv.csv")) : [];
    const bp = get("bp.csv") ? parseBp(get("bp.csv")) : [];
    const activities = get("activities.csv") ? parseActivities(get("activities.csv")) : [];

    // as-of date = most recent signal we have
    const dateCandidates = [];
    if (weight.length) dateCandidates.push(weight[weight.length - 1].date);
    if (steps.length) dateCandidates.push(steps[steps.length - 1].date);
    if (sleep.length) dateCandidates.push(sleep[sleep.length - 1].from);
    if (pwv.length) dateCandidates.push(pwv[pwv.length - 1].date);
    const asOf = dateCandidates.length ? new Date(Math.max.apply(null, dateCandidates.map((d) => d.getTime()))) : new Date();
    const asOfMs = asOf.getTime();

    const m = { asOf: asOf, has: {}, provenance: [] };

    // body composition
    if (weight.length) {
      const latest = weight[weight.length - 1];
      const withFat = weight.filter((w) => !isNaN(w.fat) && w.fat > 0);
      const latestFat = withFat.length ? withFat[withFat.length - 1] : null;
      // robust trend over a recent window (older history should not distort it)
      let trendLb = NaN, trendDays = 0;
      const recent = windowFrom(weight, asOfMs, 60);
      if (recent.length >= 4) {
        trendDays = Math.round((recent[recent.length - 1].date - recent[0].date) / DAY);
        if (trendDays >= 10) trendLb = mean(recent.slice(-3).map((w) => w.weight)) - mean(recent.slice(0, 3).map((w) => w.weight));
      }
      m.has.weight = true;
      m.weight = {
        latestLb: latest.weight,
        muscleLb: !isNaN(latest.muscle) ? latest.muscle : NaN,
        bodyFatPct: latestFat ? (latestFat.fat / latestFat.weight) * 100 : NaN,
        trendLb: trendLb,
        trendDays: trendDays,
        series: weight.slice(-30).map((w) => w.weight),
        muscleSeries: weight.slice(-30).map((w) => w.muscle).filter((v) => !isNaN(v)),
        count: weight.length,
      };
      m.provenance.push({ file: "weight.csv", records: weight.length, note: "body composition" });
    }
    if (!isNaN(heightIn)) { m.heightIn = heightIn; m.provenance.push({ file: "height.csv", records: 1, note: "height " + heightIn.toFixed(1) + " in" }); }
    if (m.weight && !isNaN(heightIn) && heightIn > 0) {
      m.weight.bmi = (703 * m.weight.latestLb) / (heightIn * heightIn);
    }

    // activity (steps)
    if (steps.length) {
      const w7 = windowFrom(steps, asOfMs, 7);
      const w14 = windowFrom(steps, asOfMs, 14);
      const w30 = windowFrom(steps, asOfMs, 30);
      m.has.steps = true;
      m.steps = {
        avg7: mean(w7.map((r) => r.value)),
        avg14: mean((w14.length ? w14 : w30).map((r) => r.value)),
        avg30: mean(w30.map((r) => r.value)),
        latest: steps[steps.length - 1].value,
        activeDays14: (w14.length ? w14 : w30).filter((r) => r.value >= 7500).length,
        series: steps.slice(-30).map((r) => r.value),
        count: steps.length,
      };
      m.provenance.push({ file: "aggregates_steps.csv", records: steps.length, note: "daily steps" });
    }
    if (distance.length) m.provenance.push({ file: "aggregates_distance.csv", records: distance.length, note: "daily distance" });

    // sleep
    if (sleep.length) {
      const w14 = windowFrom(sleep, asOfMs, 21, "from");
      const nights = w14.length ? w14 : sleep.slice(-14);
      const onsets = nights.map((s) => s.from.getHours() + s.from.getMinutes() / 60).map((h) => (h < 12 ? h + 24 : h)); // wrap past-midnight
      const hrMins = sleep.slice(-30).map((s) => s.hrMin).filter((v) => !isNaN(v));
      m.has.sleep = true;
      m.sleep = {
        avgH: mean(nights.map((s) => s.asleepH)),
        avgEff: mean(nights.map((s) => s.eff).filter((v) => !isNaN(v))),
        avgDeepRemPct: mean(nights.map((s) => (s.asleepH > 0 ? ((s.deepH + s.remH) / s.asleepH) * 100 : NaN)).filter((v) => !isNaN(v))),
        onsetStdH: stdev(onsets),
        restingHR: hrMins.length >= 3 ? median(hrMins) : NaN,
        series: sleep.slice(-21).map((s) => s.asleepH),
        nights: nights.length,
        count: sleep.length,
      };
      m.provenance.push({ file: "sleep.csv", records: sleep.length, note: "sleep sessions" });
    }

    // vascular (PWV)
    if (pwv.length) {
      const w = windowFrom(pwv, asOfMs, 30);
      m.has.pwv = true;
      m.pwv = {
        latest: pwv[pwv.length - 1].value,
        avg30: mean((w.length ? w : pwv.slice(-10)).map((r) => r.value)),
        series: pwv.slice(-20).map((r) => r.value),
        count: pwv.length,
      };
      m.provenance.push({ file: "pwv.csv", records: pwv.length, note: "arterial stiffness" });
    }

    // blood pressure (often HR only on a scale, cuff needed for sys/dia)
    if (bp.length) {
      const withSys = bp.filter((r) => !isNaN(r.sys) && r.sys > 0);
      const hrs = bp.map((r) => r.hr).filter((v) => !isNaN(v) && v > 0);
      m.bp = {
        hasCuff: withSys.length > 0,
        latestSys: withSys.length ? withSys[withSys.length - 1].sys : NaN,
        latestDia: withSys.length ? withSys[withSys.length - 1].dia : NaN,
        restingHRproxy: hrs.length ? Math.min.apply(null, hrs) : NaN,
      };
      m.provenance.push({ file: "bp.csv", records: bp.length, note: withSys.length ? "blood pressure" : "heart rate only (no cuff readings)" });
    }

    // resting HR: prefer sleep min, then bp min
    m.restingHR = m.sleep && !isNaN(m.sleep.restingHR) ? m.sleep.restingHR : (m.bp && !isNaN(m.bp.restingHRproxy) ? m.bp.restingHRproxy : NaN);

    // strength / cardio sessions from logged activities (last 28 days)
    if (activities.length) {
      const w28 = windowFrom(activities, asOfMs, 28, "from");
      const isStrength = (t) => /weight|strength|resist/i.test(t);
      const isCardio = (t) => /walk|run|cycl|bik|swim|row|elliptic|cardio|hiit|hik/i.test(t);
      m.activities = {
        strengthPerWk: w28.filter((a) => isStrength(a.type)).length / 4,
        cardioPerWk: w28.filter((a) => isCardio(a.type)).length / 4,
        loggedRecent: w28.length,
        totalLogged: activities.length,
      };
      m.provenance.push({ file: "activities.csv", records: activities.length, note: "logged workouts" });
    }

    return m;
  }

  /* ----------------------------------------------------- pillar scoring ---- */
  /* Each scorer returns a status:
       scored  - we can measure this from your data (counts in the overall)
       partial - we see a proxy only (counts, but softened, with a caveat)
       blind   - not in wearable data (never faked, shown as "add this")
     All bands are educational, general wellness ranges, not medical thresholds. */

  const TIERS = { strong: "Strong evidence", moderate: "Moderate evidence", emerging: "Emerging evidence" };

  function band(score) { return score < 58 ? "low" : (score < 80 ? "medium" : "good"); }

  function scoreActivity(m) {
    if (!m.steps || isNaN(m.steps.avg14)) return { key: "cardio", name: "Activity and cardio", weight: 0.26, status: "blind",
      note: "No daily step data found. Connect a wearable or phone to see this." };
    const s = m.steps.avg14;
    const score = clampScore(linterp([[2000, 30], [5000, 55], [7500, 72], [10000, 85], [12500, 93], [16000, 98]], s));
    return {
      key: "cardio", name: "Activity and cardio", weight: 0.26, status: "scored", score: Math.round(score),
      metric: Math.round(s).toLocaleString() + " steps/day",
      sub: "14 day average, a proxy for activity volume (not VO2max)",
      series: m.steps.series,
      action: score < 72
        ? { move: "Add easy aerobic volume you can talk through", why: "Your recent activity averages " + Math.round(s).toLocaleString() + " steps a day. Aerobic base is the strongest modifiable signal for long term health, and easy effort builds it cheaply.", start: "One 10 to 15 minute walk after a meal, most days.", tier: "strong" }
        : { move: "Protect your aerobic base and add one brisk finish", why: "You already move well (" + Math.round(s).toLocaleString() + " steps a day). A little intensity raises the ceiling.", start: "Once this week, walk the last 3 minutes fast enough that talking gets harder.", tier: "strong" },
    };
  }

  function scoreSleep(m) {
    if (!m.sleep || isNaN(m.sleep.avgH)) return { key: "sleep", name: "Sleep", weight: 0.24, status: "blind",
      note: "No sleep sessions found. Wear the device overnight to unlock this." };
    const h = m.sleep.avgH;
    const durScore = clampScore(100 - Math.abs(7.75 - h) * 20);
    const effScore = !isNaN(m.sleep.avgEff) ? clampScore(m.sleep.avgEff * 100) : 80;
    let score = 0.78 * durScore + 0.22 * effScore;
    const consistent = !isNaN(m.sleep.onsetStdH) ? m.sleep.onsetStdH : 1;
    const consFactor = consistent > 1.5 ? 0.9 : consistent > 1.0 ? 0.96 : 1.0;
    score = clampScore(score * consFactor);
    const hLabel = Math.floor(h) + "h " + Math.round((h - Math.floor(h)) * 60) + "m";
    const needMore = h < 7 || score < 72; // duration is the actionable lever
    return {
      key: "sleep", name: "Sleep", weight: 0.24, status: "scored", score: Math.round(score),
      metric: hLabel + " asleep",
      sub: "avg over last " + m.sleep.nights + " nights" + (!isNaN(m.sleep.avgEff) ? ", " + Math.round(m.sleep.avgEff * 100) + "% efficiency" : ""),
      series: m.sleep.series,
      action: needMore
        ? { move: "Add sleep opportunity and anchor your timing", why: "You are averaging " + hLabel + " asleep. Most adults do best nearer 7 to 9 hours, and steady timing supports metabolism, mood, and recovery.", start: "Start winding down 30 minutes earlier tonight. Dim lights, cool room.", tier: "moderate", clinician: "If you snore loudly or wake unrefreshed despite enough time in bed, ask about a sleep assessment." }
        : { move: "Hold your sleep timing steady, including weekends", why: "Your duration is solid (" + hLabel + "). Consistency is the next gain.", start: "Pick one wake time and keep it for seven days.", tier: "moderate" },
    };
  }

  function scoreBodyComp(m) {
    if (!m.weight || isNaN(m.weight.bodyFatPct)) return { key: "metabolic", name: "Body composition", weight: 0.22, status: "blind",
      note: "No body fat reading found. A body composition scale unlocks this." };
    const bf = m.weight.bodyFatPct;
    // general wellness bands for adult men; higher body fat -> lower score
    const score = clampScore(linterp([[10, 94], [15, 86], [18, 78], [22, 67], [26, 54], [30, 42], [36, 30]], bf));
    const trendTxt = !isNaN(m.weight.trendLb) && m.weight.trendDays >= 14
      ? (Math.abs(m.weight.trendLb) < 0.6 ? "weight stable over " + m.weight.trendDays + " days"
          : "weight " + (m.weight.trendLb < 0 ? "down " : "up ") + Math.abs(m.weight.trendLb).toFixed(1) + " lb over " + m.weight.trendDays + " days")
      : "weight baseline still building";
    return {
      key: "metabolic", name: "Body composition", weight: 0.22, status: "scored", score: Math.round(score),
      metric: bf.toFixed(1) + "% body fat",
      sub: "from your scale" + (m.weight.bmi ? ", BMI " + m.weight.bmi.toFixed(1) : "") + ", " + trendTxt,
      series: m.weight.series,
      action: score < 67
        ? { move: "Nudge body composition with protein, fiber, and post meal walks", why: "Body fat percent is a better signal than weight alone. Yours reads " + bf.toFixed(1) + "%. Small, steady habits move it without a crash diet.", start: "Add one palm of protein and one fist of vegetables to your largest meal, then walk 10 minutes.", tier: "strong", clinician: "A waist measurement and a basic metabolic panel (fasting glucose, lipids) would sharpen this. If labs make you anxious, it is okay to pace them." }
        : { move: "Hold your body composition and keep muscle on", why: "Your body fat reads " + bf.toFixed(1) + "%, a healthy range. Protecting muscle keeps it there.", start: "Keep protein high and add a short walk after your largest meal.", tier: "moderate" },
    };
  }

  function scoreVascular(m) {
    if (!m.pwv || isNaN(m.pwv.latest)) return { key: "vascular", name: "Vascular (arterial stiffness)", weight: 0.16, status: "blind",
      note: "No pulse wave velocity found. A Body Scan or similar device measures this." };
    const p = m.pwv.latest;
    const score = clampScore(linterp([[5.5, 94], [6.5, 88], [7.5, 78], [8.5, 66], [9.5, 54], [11, 38], [13, 26]], p));
    return {
      key: "vascular", name: "Vascular (arterial stiffness)", weight: 0.16, status: "scored", score: Math.round(score),
      metric: p.toFixed(1) + " m/s PWV",
      sub: "pulse wave velocity, lower is generally better for arteries",
      series: m.pwv.series,
      action: score < 70
        ? { move: "Protect your arteries with aerobic work and steady sleep", why: "Pulse wave velocity reflects arterial stiffness. Yours reads " + p.toFixed(1) + " m/s. Regular easy cardio and good sleep are the levers most in your control.", start: "Bank three easy aerobic sessions this week and keep salt in check.", tier: "moderate", clinician: "Share your PWV trend with a clinician, especially alongside blood pressure, so it is read in context." }
        : { move: "Keep the habits protecting your arteries", why: "Your PWV of " + p.toFixed(1) + " m/s is in a healthy range. Aerobic fitness and sleep are what keep it there.", start: "Keep your easy cardio and steady sleep going.", tier: "moderate" },
    };
  }

  function scoreStrength(m) {
    const logged = m.activities ? m.activities.strengthPerWk : 0;
    const muscleTrend = m.weight && m.weight.muscleSeries && m.weight.muscleSeries.length >= 2
      ? m.weight.muscleSeries[m.weight.muscleSeries.length - 1] - m.weight.muscleSeries[0] : NaN;
    let score;
    if (logged > 0) score = clampScore(linterp([[0, 45], [1, 62], [2, 80], [3, 92], [4, 97]], logged));
    else score = 55; // unknown: we may simply not see the gym
    const muscleTxt = m.weight && !isNaN(m.weight.muscleLb) ? m.weight.muscleLb.toFixed(0) + " lb muscle mass" : "muscle mass not read";
    return {
      key: "strength", name: "Strength", weight: 0.07, status: "partial",
      score: Math.round(score),
      metric: logged > 0 ? logged.toFixed(1) + " strength sessions/wk" : muscleTxt,
      sub: logged > 0 ? "from logged workouts" : "we cannot see gym work unless you log it",
      series: m.weight && m.weight.muscleSeries && m.weight.muscleSeries.length > 1 ? m.weight.muscleSeries : null,
      note: logged > 0 ? null : "Log strength workouts (or connect an app) so we can score this properly.",
      action: {
        move: "Do two short full body strength sessions a week",
        why: "Muscle protects independence and metabolism for decades and is cheapest to build now" + (isNaN(muscleTrend) ? "." : ", and your muscle mass is " + (muscleTrend >= 0 ? "holding" : "slipping") + " lately."),
        start: "Two sets of sit to stand and two of push ups at home. Ten minutes.",
        tier: "strong",
      },
    };
  }

  function scoreStress(m) {
    const rhr = m.restingHR;
    if (isNaN(rhr) && (!m.sleep || isNaN(m.sleep.avgH))) return { key: "stress", name: "Stress and recovery", weight: 0.05, status: "blind",
      note: "Recovery needs overnight heart rate or sleep data to estimate." };
    let score;
    if (!isNaN(rhr)) score = clampScore(linterp([[48, 88], [55, 80], [60, 72], [66, 62], [72, 52], [80, 40]], rhr));
    else score = m.sleep ? clampScore(60) : 55;
    return {
      key: "stress", name: "Stress and recovery", weight: 0.05, status: "partial",
      score: Math.round(score),
      metric: !isNaN(rhr) ? Math.round(rhr) + " bpm resting HR" : "sleep based estimate",
      sub: "a proxy for recovery, not a measure of mood",
      series: null,
      action: {
        move: "Add a short daily wind down to help recovery",
        why: "Resting heart rate and sleep hint at how recovered you are. A calmer evening lifts sleep, which lifts everything else.",
        start: "Two minutes of slow breathing, or a written brain dump, before bed.",
        tier: "moderate",
        clinician: "If worry or low mood is persistent, talking to a licensed professional is a strong move.",
      },
    };
  }

  function scoreNutrition(m) {
    return { key: "nutrition", name: "Nutrition", weight: 0, status: "blind",
      note: "Food is not in your wearable data. Connect a food log to score protein, fiber, and whole foods." };
  }

  function scorePreventive(m) {
    const noCuff = m.bp && !m.bp.hasCuff;
    return { key: "preventive", name: "Preventive and labs", weight: 0, status: "blind",
      note: (noCuff ? "Your device logged heart rate but no cuff blood pressure. A cuff plus routine care and baseline labs live outside wearables. " : "Routine care and baseline labs live outside wearables. ") + "Track dental, eye, skin, and age appropriate screenings here." };
  }

  function scoreAll(m) {
    const scorers = [scoreActivity, scoreSleep, scoreBodyComp, scoreVascular, scoreStrength, scoreStress, scoreNutrition, scorePreventive];
    const pillars = scorers.map((fn) => fn(m));
    const counted = pillars.filter((p) => p.status === "scored" || p.status === "partial");
    const wsum = counted.reduce((s, p) => s + p.weight, 0) || 1;
    const overall = Math.round(counted.reduce((s, p) => s + p.score * p.weight, 0) / wsum);

    const plan = counted
      .filter((p) => p.score < 80 && p.action)
      .map((p) => ({ pillar: p, gap: (100 - p.score) * p.weight }))
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 4)
      .map((x, i) => ({ rank: i + 1, name: x.pillar.name, key: x.pillar.key, score: x.pillar.score, action: x.pillar.action }));

    const coach = buildCoach(m, plan, overall);
    return { overall: overall, pillars: pillars, plan: plan, coach: coach, asOf: m.asOf, provenance: m.provenance };
  }

  /* ------------------------------------------------------------- coach ----- */

  function fmtDate(d) {
    try { return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }); }
    catch (e) { return String(d).slice(0, 15); }
  }

  function buildCoach(m, plan, overall) {
    const top = plan[0];
    const strong = overall >= 80;
    let headline, body, why, start;
    if (!top) {
      headline = "You are on track.";
      body = "Your visible fundamentals look solid. No single move is urgent today, so keep the habits that got you here.";
      why = "The coach stays quiet when nothing needs your attention. Trend over guilt.";
      start = "Revisit this after your next few readings.";
    } else {
      start = top.action.start;
      why = strong
        ? "You are strong overall, so this is a gentle focus, not a fix. Of what we can see, it is your next best gain."
        : "Prioritized. Of everything we can see, this is your single biggest lever right now.";
      if (top.key === "sleep" && m.sleep) {
        const hLabel = Math.floor(m.sleep.avgH) + "h " + Math.round((m.sleep.avgH - Math.floor(m.sleep.avgH)) * 60) + "m";
        headline = "Protect tonight's sleep.";
        body = "Your last " + m.sleep.nights + " nights average about " + hLabel + " asleep. Starting your wind down 30 minutes earlier tonight is the one move that moves your number most.";
      } else if (top.key === "cardio" && m.steps) {
        headline = "One easy walk today.";
        body = "You are averaging about " + Math.round(m.steps.avg14).toLocaleString() + " steps a day. A 15 minute easy walk you can talk through is today's highest leverage move.";
      } else if (top.key === "metabolic" && m.weight && !isNaN(m.weight.bodyFatPct)) {
        headline = strong ? "Keep your body composition." : "Nudge your body composition.";
        body = "Your body fat reads " + m.weight.bodyFatPct.toFixed(1) + "%. Protein at your next meal plus a short walk after it is the gentle move that keeps it trending right.";
      } else if (top.key === "vascular" && m.pwv) {
        headline = "Protect your arteries.";
        body = "Your pulse wave velocity reads " + m.pwv.latest.toFixed(1) + " m/s. An easy aerobic session and steady sleep are the levers most in your control.";
      } else if (top.key === "strength") {
        headline = "Add one strength session.";
        body = "Two short full body sessions a week protect muscle and metabolism for decades. Ten minutes at home counts.";
      } else if (top.key === "stress") {
        headline = "Give yourself a wind down.";
        body = "A two minute wind down tonight supports recovery, which lifts sleep and everything downstream.";
      } else {
        headline = top.action.move + ".";
        body = top.action.why;
      }
    }
    return {
      appName: "Longevity Maxxer",
      stamp: fmtDate(m.asOf) + ", 7:40 AM",
      kind: "Nudge",
      headline: headline,
      body: body,
      why: why,
      start: start,
      overall: overall,
    };
  }

  /* ----------------------------------------------------- sample dataset ---- */
  /* Clearly fictional. Lets anyone try the tool with zero real data. */

  function sampleFiles() {
    const days = [];
    const base = new Date("2026-06-30T09:00:00");
    function d(offset) { const x = new Date(base.getTime() - offset * DAY); return x.toISOString().slice(0, 10); }
    let steps = "date,value\n";
    const stepVals = [5200, 6100, 4800, 7200, 5600, 6900, 5100, 8300, 4200, 6600, 7000, 5400, 6200, 5900];
    stepVals.forEach((v, i) => { steps += d(i) + "," + v + "\n"; });
    let weight = 'Date,"Weight (lb)","Fat mass (lb)","Bone mass (lb)","Muscle mass (lb)","Hydration (lb)",Comments\n';
    const wSeq = [[178, 39.6], [177.6, 39.2], [178.2, 39.5], [177.1, 38.7]];
    wSeq.forEach((p, i) => { weight += '"2026-06-' + (10 + i * 6) + ' 08:15:00",' + p[0] + "," + p[1] + ",7.2,116.4,84.3,\n"; });
    let height = 'Date,"Height (in)",Comments\n"2026-06-01 08:00:00","5\' 10.0\'\'",\n';
    let sleep = 'from,to,"light (s)","deep (s)","rem (s)","awake (s)","wake up","Duration to sleep (s)","Duration to wake up (s)","Snoring (s)","Snoring episodes","Average heart rate","Heart rate (min)","Heart rate (max)","Night events",Notes\n';
    for (let i = 0; i < 14; i++) {
      const on = new Date(base.getTime() - i * DAY);
      on.setHours(23, 40 + ((i % 3) * 12), 0, 0);
      const off = new Date(on.getTime() + (6.1 + (i % 4) * 0.15) * 3600 * 1000);
      const light = 12600 + (i % 3) * 300, deep = 4200, rem = 4800, awake = 2400;
      sleep += on.toISOString() + "," + off.toISOString() + "," + light + "," + deep + "," + rem + "," + awake + ",18,900,240,0,0,0,54,0,,\n";
    }
    let pwv = "date,value\n";
    [7.4, 7.3, 7.2, 7.3, 7.1].forEach((v, i) => { pwv += '"2026-06-' + (12 + i * 4) + ' 08:15:00",' + v + "\n"; });
    let bp = 'Date,"Heart rate",Systolic,Diastolic,Comments\n"2026-06-20 08:15:00",58,,,\n"2026-06-14 08:15:00",61,,,\n';
    return {
      "aggregates_steps.csv": steps,
      "weight.csv": weight,
      "height.csv": height,
      "sleep.csv": sleep,
      "pwv.csv": pwv,
      "bp.csv": bp,
    };
  }

  /* ------------------------------------------------------------- expose ---- */

  const API = {
    parseCSV: parseCSV,
    parseWeight: parseWeight,
    parseSleep: parseSleep,
    parseAggregate: parseAggregate,
    parseHeightInches: parseHeightInches,
    analyzeFiles: analyzeFiles,
    scoreAll: scoreAll,
    buildCoach: buildCoach,
    sampleFiles: sampleFiles,
    linterp: linterp,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (root) root.LMApp = API;

  /* --------------------------------------------------------- UI wiring ----- */
  if (typeof document === "undefined") return; // Node: pure logic only

  function node(html) {
    const t = document.createElement("template");
    t.innerHTML = String(html).trim();
    return t.content.firstElementChild;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  function spark(series) {
    if (!series) return "";
    const vals = series.filter((v) => typeof v === "number" && !isNaN(v));
    if (vals.length < 2) return "";
    const w = 120, h = 26;
    const min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), rng = (max - min) || 1;
    const pts = vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * (w - 2) + 1;
      const y = h - 2 - ((v - min) / rng) * (h - 4);
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");
    return '<svg class="spark" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" preserveAspectRatio="none" aria-hidden="true"><polyline points="' + pts + '" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></svg>';
  }

  const STATUS_LABEL = { scored: "Measured", partial: "Proxy", blind: "Not in your data" };

  function scoreClass(score) { return score >= 80 ? "good" : score >= 58 ? "mid" : "low"; }

  function render(result) {
    const empty = document.getElementById("appEmpty");
    const results = document.getElementById("appResults");
    if (empty) empty.hidden = true;
    if (results) results.hidden = false;

    const asOfEl = document.getElementById("appAsOf");
    if (asOfEl) asOfEl.textContent = "Based on your most recent data, as of " + fmtDate(result.asOf) + ".";

    // coach
    const c = result.coach;
    const coachHost = document.getElementById("coachReal");
    if (coachHost) {
      coachHost.innerHTML = "";
      coachHost.appendChild(node(
        '<div class="rcoach">' +
          '<div class="rcoach__phone"><div class="phone__notch"></div>' +
            '<div class="cmsg cmsg--push">' +
              '<div class="cmsg__app"><span class="cmsg__dot"></span>' + esc(c.appName) + ' <span class="cmsg__kind">' + esc(c.kind) + '</span><span class="cmsg__time">' + esc(c.stamp) + "</span></div>" +
              '<div class="cmsg__body"><strong>' + esc(c.headline) + "</strong><br>" + esc(c.body) + "</div>" +
            "</div>" +
          "</div>" +
          '<div class="rcoach__side">' +
            "<h3>" + esc(c.headline) + "</h3>" +
            '<p class="rcoach__why">' + esc(c.why) + "</p>" +
            '<div class="rcoach__start"><strong>Start small:</strong> ' + esc(c.start) + "</div>" +
            '<p class="fineprint">Generated from the file you loaded, in this browser. Not medical advice.</p>' +
          "</div>" +
        "</div>"));
    }

    // overall score
    const scoreEl = document.getElementById("appScore");
    if (scoreEl) scoreEl.textContent = result.overall;
    const scoreBand = document.getElementById("appScoreBand");
    if (scoreBand) {
      const o = result.overall;
      scoreBand.textContent = o >= 80 ? "Strong across what we can see" : o >= 62 ? "A solid base with clear next moves" : "A few high leverage opportunities";
    }

    // pillars (measured + proxy)
    const pillarsHost = document.getElementById("appPillars");
    if (pillarsHost) {
      pillarsHost.innerHTML = "";
      result.pillars.filter((p) => p.status !== "blind").forEach((p) => {
        pillarsHost.appendChild(node(
          '<article class="mcard mcard--' + scoreClass(p.score) + '">' +
            '<div class="mcard__top"><span class="mcard__name">' + esc(p.name) + '</span><span class="mcard__status">' + STATUS_LABEL[p.status] + "</span></div>" +
            '<div class="mcard__score"><span class="mcard__num">' + p.score + '</span><span class="mcard__metric">' + esc(p.metric || "") + "</span></div>" +
            '<div class="mcard__bar"><span style="width:' + p.score + '%"></span></div>' +
            (spark(p.series) ? '<div class="mcard__spark">' + spark(p.series) + "</div>" : "") +
            '<p class="mcard__sub">' + esc(p.sub || "") + "</p>" +
            (p.note ? '<p class="mcard__note">' + esc(p.note) + "</p>" : "") +
          "</article>"));
      });
    }

    // prioritized plan
    const planHost = document.getElementById("appPlan");
    if (planHost) {
      planHost.innerHTML = "";
      if (!result.plan.length) {
        planHost.appendChild(node('<p class="lead">Nothing urgent in view. Keep your habits and check back after more readings. This is general education, not a medical judgment.</p>'));
      }
      result.plan.forEach((r) => {
        const a = r.action;
        planHost.appendChild(node(
          '<article class="plan">' +
            '<div class="plan__rank">' + r.rank + "</div>" +
            '<div class="plan__body">' +
              '<div class="plan__meta"><span class="plan__pillar">' + esc(r.name) + '</span><span class="tier tier--' + a.tier + '">' + TIERS[a.tier] + "</span></div>" +
              "<h3>" + esc(a.move) + "</h3>" +
              '<p class="plan__why">' + esc(a.why) + "</p>" +
              '<div class="plan__start"><strong>Start small:</strong> ' + esc(a.start) + "</div>" +
            "</div>" +
          "</article>"));
      });
    }

    // clinician questions
    const clinHost = document.getElementById("appClinician");
    if (clinHost) {
      const qs = [];
      result.plan.forEach((r) => { if (r.action.clinician) qs.push(r.action.clinician); });
      const seen = {}; const uniq = qs.filter((q) => (seen[q] ? false : (seen[q] = true)));
      if (uniq.length) {
        clinHost.hidden = false;
        clinHost.innerHTML = "<h3>Questions to bring to your clinician</h3><ul class=\"ticks\">" + uniq.map((q) => "<li>" + esc(q) + "</li>").join("") + "</ul>";
      } else { clinHost.hidden = true; clinHost.innerHTML = ""; }
    }

    // blind pillars (honest gaps)
    const blindHost = document.getElementById("appBlind");
    if (blindHost) {
      const blind = result.pillars.filter((p) => p.status === "blind");
      if (blind.length) {
        blindHost.hidden = false;
        blindHost.innerHTML = "<h3>Not visible in this data</h3><p class=\"muted\">We will not fake a score for these. Here is how to light them up.</p><div class=\"blindgrid\">" +
          blind.map((p) => '<div class="blindcard"><strong>' + esc(p.name) + "</strong><p>" + esc(p.note || "") + "</p></div>").join("") + "</div>";
      } else { blindHost.hidden = true; blindHost.innerHTML = ""; }
    }

    // provenance
    const provHost = document.getElementById("appProvenance");
    if (provHost) {
      provHost.innerHTML = "<h3>What was read</h3><ul class=\"prov\">" +
        result.provenance.map((p) => "<li><code>" + esc(p.file) + "</code> " + p.records + " records <span class=\"muted\">" + esc(p.note) + "</span></li>").join("") +
        "</ul><p class=\"fineprint\">Files were parsed in this browser tab. Nothing was uploaded. Identity files (user.csv, account.csv) are ignored on purpose.</p>";
    }

    const results2 = document.getElementById("appResults");
    if (results2 && results2.scrollIntoView) { try { results2.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {} }
  }

  function showError(msg) {
    const errHost = document.getElementById("appError");
    if (errHost) { errHost.hidden = false; errHost.textContent = msg; }
  }
  function clearError() { const e = document.getElementById("appError"); if (e) { e.hidden = true; e.textContent = ""; } }

  function baseName(name) { return String(name).split("/").pop().split("\\").pop().toLowerCase(); }

  async function readFileList(fileList) {
    const files = Array.prototype.slice.call(fileList || []);
    const map = {};
    for (const f of files) {
      const lower = f.name.toLowerCase();
      if (lower.endsWith(".zip")) {
        if (typeof JSZip === "undefined") throw new Error("Zip support did not load. Please unzip the export and drop the .csv files instead.");
        const buf = await f.arrayBuffer();
        const zip = await JSZip.loadAsync(buf);
        const names = Object.keys(zip.files);
        for (const nm of names) {
          const entry = zip.files[nm];
          if (!entry.dir && nm.toLowerCase().endsWith(".csv")) map[baseName(nm)] = await entry.async("string");
        }
      } else if (lower.endsWith(".csv")) {
        map[baseName(f.name)] = await f.text();
      }
    }
    return map;
  }

  async function handleFiles(fileList) {
    clearError();
    try {
      const map = await readFileList(fileList);
      if (!Object.keys(map).length) { showError("No CSV files found. Drop your Withings export .zip, or the .csv files inside it."); return; }
      const analysis = analyzeFiles(map);
      const counted = ["weight", "steps", "sleep", "pwv"].some((k) => analysis.has[k]);
      if (!counted) { showError("Loaded " + Object.keys(map).length + " file(s), but none matched Withings weight, steps, sleep, or PWV. Is this a Withings Health Mate export?"); return; }
      render(scoreAll(analysis));
    } catch (e) {
      showError("Could not read that file: " + (e && e.message ? e.message : e));
    }
  }

  function initApp() {
    const drop = document.getElementById("dropzone");
    const input = document.getElementById("fileInput");
    const sampleBtn = document.getElementById("sampleBtn");
    const resetBtn = document.getElementById("appReset");

    if (input) input.addEventListener("change", () => { if (input.files && input.files.length) handleFiles(input.files); });
    if (drop) {
      ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("dropzone--over"); }));
      ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("dropzone--over"); }));
      drop.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length) handleFiles(dt.files);
      });
      drop.addEventListener("click", () => { if (input) input.click(); });
      drop.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && input) { e.preventDefault(); input.click(); } });
    }
    if (sampleBtn) sampleBtn.addEventListener("click", () => { clearError(); render(scoreAll(analyzeFiles(sampleFiles()))); });
    if (resetBtn) resetBtn.addEventListener("click", () => {
      const empty = document.getElementById("appEmpty");
      const results = document.getElementById("appResults");
      if (results) results.hidden = true;
      if (empty) empty.hidden = false;
      if (input) input.value = "";
      clearError();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initApp);
  else initApp();
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
