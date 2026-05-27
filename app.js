/* ═══════════════════════════════════════
   HomeMatch — Application Logic
   ═══════════════════════════════════════ */

// ─── Mock Data ─────────────────────────
const DEVELOPMENTS = {
  "The Sail @ Marina Bay": {
    units: 1111,
    topYear: 2008,
    lat: 1.2782,
    lng: 103.8544,
    estateType: "condo",
    configs: {
      "1-1": { area: 506 },
      "2-1": { area: 753 },
      "2-2": { area: 904 },
      "3-2": { area: 1206 },
      "4-3": { area: 1862 },
    },
    nearestMRT: { name: "Marina Bay", dist: 180 },
    schoolsWithin1km: 2,
    schoolsWithin2km: 5,
    listingsNearby: 8,
    uraTransactions12m: 24,
  },
  "Parc Riviera": {
    units: 752,
    topYear: 2019,
    lat: 1.2730,
    lng: 103.7610,
    estateType: "condo",
    configs: {
      "1-1": { area: 441 },
      "2-1": { area: 624 },
      "2-2": { area: 732 },
      "3-2": { area: 947 },
      "4-3": { area: 1302 },
    },
    nearestMRT: { name: "West Coast (TEL)", dist: 520 },
    schoolsWithin1km: 1,
    schoolsWithin2km: 3,
    listingsNearby: 18,
    uraTransactions12m: 15,
  },
  "Tampines Court": {
    units: 560,
    topYear: 1985,
    lat: 1.3533,
    lng: 103.9430,
    estateType: "condo",
    configs: {
      "2-1": { area: 1012 },
      "3-2": { area: 1432 },
      "4-3": { area: 1830 },
    },
    nearestMRT: { name: "Tampines", dist: 1200 },
    schoolsWithin1km: 3,
    schoolsWithin2km: 6,
    listingsNearby: 5,
    uraTransactions12m: 3,
  },
  "Clavon": {
    units: 640,
    topYear: 2023,
    lat: 1.3150,
    lng: 103.7642,
    estateType: "condo",
    configs: {
      "1-1": { area: 474 },
      "2-2": { area: 689 },
      "3-2": { area: 958 },
      "4-3": { area: 1281 },
    },
    nearestMRT: { name: "Clementi", dist: 280 },
    schoolsWithin1km: 2,
    schoolsWithin2km: 4,
    listingsNearby: 22,
    uraTransactions12m: 18,
  },
  "The Interlace": {
    units: 1040,
    topYear: 2013,
    lat: 1.2837,
    lng: 103.8023,
    estateType: "condo",
    configs: {
      "1-1": { area: 560 },
      "2-2": { area: 807 },
      "3-2": { area: 1152 },
      "4-3": { area: 1690 },
      "5-4": { area: 2250 },
    },
    nearestMRT: { name: "Labrador Park", dist: 650 },
    schoolsWithin1km: 1,
    schoolsWithin2km: 2,
    listingsNearby: 12,
    uraTransactions12m: 9,
  },
  "Treasure at Tampines": {
    units: 2203,
    topYear: 2023,
    lat: 1.3460,
    lng: 103.9565,
    estateType: "condo",
    configs: {
      "1-1": { area: 463 },
      "2-1": { area: 592 },
      "2-2": { area: 678 },
      "3-2": { area: 915 },
      "4-3": { area: 1184 },
      "5-3": { area: 1518 },
    },
    nearestMRT: { name: "Simei", dist: 350 },
    schoolsWithin1km: 4,
    schoolsWithin2km: 7,
    listingsNearby: 45,
    uraTransactions12m: 32,
  },
  "Rivercove Residences (EC)": {
    units: 628,
    topYear: 2021,
    lat: 1.3946,
    lng: 103.9032,
    estateType: "EC",
    configs: {
      "3-2": { area: 872 },
      "3-3": { area: 980 },
      "4-3": { area: 1173 },
    },
    nearestMRT: { name: "Tongkang (NEL)", dist: 900 },
    schoolsWithin1km: 2,
    schoolsWithin2km: 5,
    listingsNearby: 15,
    uraTransactions12m: 11,
  },
  "Commonwealth Towers": {
    units: 845,
    topYear: 2017,
    lat: 1.3025,
    lng: 103.7983,
    estateType: "condo",
    configs: {
      "1-1": { area: 452 },
      "2-1": { area: 635 },
      "2-2": { area: 721 },
      "3-2": { area: 1001 },
    },
    nearestMRT: { name: "Commonwealth", dist: 90 },
    schoolsWithin1km: 3,
    schoolsWithin2km: 5,
    listingsNearby: 14,
    uraTransactions12m: 19,
  },
};

// ─── Scoring Engine ────────────────────

function scoreLandSize(units) {
  if (units == null) return { score: 5, imputed: true, detail: "Data unavailable — default applied" };
  let score;
  if (units >= 1000) score = 10;
  else if (units >= 300) score = 7;
  else if (units >= 100) score = 5;
  else score = 2;
  return { score, imputed: false, detail: `${units} total units` };
}

function scoreSupplyOffline(similarDevs) {
  if (similarDevs == null) return { score: 5, imputed: true, similarDevs: null };
  let score;
  if (similarDevs === 0) score = 10;
  else if (similarDevs <= 2) score = 7;
  else if (similarDevs <= 5) score = 4;
  else score = 1;
  return { score, imputed: false, similarDevs };
}

function scoreLiquidityOffline(transactions, transactionsAll) {
  if (transactions == null) return { score: 5, imputed: true, transactions: null, transactionsAll: null };
  let score;
  if (transactions > 20) score = 10;
  else if (transactions > 10) score = 7;
  else if (transactions >= 5) score = 4;
  else score = 1;
  return { score, imputed: false, transactions, transactionsAll: transactionsAll ?? transactions };
}

function scoreMRT(dist) {
  if (dist == null) return { score: 4, imputed: true, detail: "Distance unavailable" };
  let score;
  if (dist < 300) score = 10;
  else if (dist < 600) score = 7;
  else if (dist <= 1000) score = 4;
  else score = 1;
  return { score, imputed: false, dist };
}

function scoreSchools(n1, n2) {
  if (n1 == null && n2 == null) return { score: 4, imputed: true, detail: "School data unavailable" };
  const s1 = n1 ?? 0;
  const s2 = n2 ?? 0;
  let score;
  if (s1 >= 1 && s2 >= 1) score = 10;
  else if (s1 === 1) score = 7;
  else if (s1 === 0 && s2 >= 1) score = 5;
  else score = 1;
  return { score, imputed: false, n1: s1, n2: s2 };
}

function evaluateDevelopment(name, bed, bath) {
  const dev = DEVELOPMENTS[name];
  if (!dev) return null;

  const configKey = `${bed}-${bath}`;
  const config = dev.configs[configKey];

  const landSize = scoreLandSize(dev.units);
  const supply = scoreSupplyOffline(dev.similarDevs ?? dev.listingsNearby);
  const liquidity = scoreLiquidityOffline(dev.uraTransactions12m);
  const mrt = scoreMRT(dev.nearestMRT?.dist);
  const schools = scoreSchools(dev.schoolsWithin1km, dev.schoolsWithin2km);

  const totalScore = landSize.score + supply.score + liquidity.score + mrt.score + schools.score;

  let tier, tierKey, tierDesc;
  if (totalScore >= 40) {
    tier = "Excellent"; tierKey = "excellent";
    tierDesc = "Strong fundamentals across all dimensions.";
  } else if (totalScore >= 30) {
    tier = "Good"; tierKey = "good";
    tierDesc = "Solid on most criteria with minor gaps. Worth serious consideration.";
  } else if (totalScore >= 20) {
    tier = "Fair"; tierKey = "fair";
    tierDesc = "Mixed profile — some strengths offset by notable weaknesses.";
  } else {
    tier = "Not Recommended"; tierKey = "not-recommended";
    tierDesc = "Significant concerns across multiple criteria. Proceed with caution.";
  }

  const currentYear = new Date().getFullYear();
  const age = currentYear - dev.topYear;

  return {
    name,
    units: dev.units,
    age: age <= 0 ? "New" : `${age} years`,
    topYear: dev.topYear,
    bed,
    bath,
    area: config?.area ?? "—",
    estateType: dev.estateType,
    nearestMRT: dev.nearestMRT,
    criteria: [
      { key: "landSize", label: "Land Size (Unit Count)", ...landSize },
      { key: "supply", label: "Similar Developments", ...supply },
      { key: "liquidity", label: "Unit Transactions", ...liquidity },
      { key: "mrt", label: "MRT Proximity", ...mrt },
      { key: "schools", label: "Primary School Proximity", ...schools },
    ],
    totalScore,
    tier,
    tierKey,
    tierDesc,
  };
}

// ─── Color Helpers ─────────────────────

function scoreColor(score) {
  if (score >= 9) return "#4a6b5a";
  if (score >= 7) return "#6b8f6b";
  if (score >= 5) return "#b0a58a";
  if (score >= 3) return "#c4a07a";
  return "#bf8a7a";
}

function tierColor(key) {
  const map = {
    excellent: "#4a6b5a",
    good: "#6b8f6b",
    fair: "#b0a58a",
    "not-recommended": "#bf8a7a",
  };
  return map[key] ?? "#7a766e";
}

// ─── Drill-Down Detail Builders ────────

function drillRowType(label) {
  if (/subscore/i.test(label)) return "subscore";
  if (/formula/i.test(label)) return "formula";
  if (/threshold/i.test(label)) return "threshold";
  if (/note/i.test(label)) return "note";
  return "";
}

function buildDrillHTML(c) {
  const rows = [];

  if (c.key === "landSize") {
    rows.push(["Total Units", c.detail ?? `${c.score >= 10 ? "≥1000" : "—"}`]);
    rows.push(["Threshold", "≥1000→10 | 300–999→7 | 100–299→5 | <100→2"]);
  }

  if (c.key === "supply") {
    rows.push(["Similar Developments", c.similarDevs != null ? c.similarDevs : "—"]);
    rows.push(["Note", "Similar developments: within 2 km, ±200 total units, same estimated bedroom type, matching tenure (±5 yr if leasehold). " +
      "0 → 10/10, 1–2 → 7/10, 3–5 → 4/10, 6+ → 1/10."]);
  }

  if (c.key === "liquidity") {
    const txLabel = c.transactionsAll != null && c.transactionsAll !== c.transactions
      ? `${c.transactions} (${c.transactionsAll} all types)`
      : (c.transactions != null ? c.transactions : "—");
    rows.push(["URA Transactions – similar unit (12m)", txLabel]);
    rows.push(["Note", "URA transactions include sub-sale (type 2) and resale (type 3) within the last 12 months. " +
      "Bedroom count is estimated from floor area: ≤55 sqm → 1BR, ≤80 sqm → 2BR, ≤120 sqm → 3BR, ≤160 sqm → 4BR, >160 sqm → 5+BR. " +
      ">20 → 10/10, 11–20 → 7/10, 5–10 → 4/10, <5 → 1/10."]);
  }

  if (c.key === "mrt") {
    rows.push(["Nearest MRT", c.mrtName ?? "—"]);
    rows.push(["Distance", c.dist != null ? `${c.dist}m` : "—"]);
    rows.push(["Threshold", "<300m→10 | 300–599m→7 | 600–1000m→4 | >1000m→1"]);
    if (c.mrtsWithin1km?.length) {
      const stationList = c.mrtsWithin1km.map((s) => {
        const lineNames = s.lines
          ? s.lines.map((l) => l.lineName).filter((v, i, a) => a.indexOf(v) === i).join(", ")
          : s.line ?? "";
        return `<span class="mrt-nearby-item">${s.name} — ${s.dist}m <span class="mrt-line-tag">${lineNames}</span></span>`;
      }).join("");
      rows.push(["MRT/LRT within 1 km", `<div class="mrt-nearby-list">${stationList}</div>`]);
    }
  }

  if (c.key === "schools") {
    rows.push(["Schools within 1km", c.n1 != null ? c.n1 : "—"]);
    rows.push(["Schools within 2km", c.n2 != null ? c.n2 : "—"]);
    rows.push(["Threshold", "≥1 in both→10 | 1 in 1km→7 | 0 in 1km but ≥1 in 2km→5 | else→1"]);
  }

  if (c.imputed) {
    rows.push(["Note", "⚠ Some data was unavailable and has been estimated or set to a default value. Score may not be fully accurate."]);
  }

  const trs = rows.filter(([k]) => {
    const type = drillRowType(k);
    return type !== "formula" && type !== "threshold" && type !== "note";
  }).map(([k, v]) => {
    const type = drillRowType(k);
    const cls = type ? ` class="drill-row--${type}"` : "";
    return `<tr${cls}><th>${k}</th><td>${v}</td></tr>`;
  }).join("");
  return `<table class="drill-table">${trs}</table>`;
}

// ─── Tab Switching ────────────────────

let pendingChartRender = null;
let pendingTrendRender = null;

function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  document.getElementById("panelOverview").hidden = tab !== "overview";
  document.getElementById("panelCompare").hidden = tab !== "compare";
  document.getElementById("panelScores").hidden = tab !== "scores";
  document.getElementById("panelFloorplan").hidden = tab !== "floorplan";

  if (tab === "overview" && pendingTrendRender) {
    requestAnimationFrame(() => {
      pendingTrendRender();
      pendingTrendRender = null;
    });
  }

  if (tab === "compare" && pendingChartRender) {
    requestAnimationFrame(() => {
      pendingChartRender();
      pendingChartRender = null;
    });
  }
}

document.getElementById("tabNav").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn");
  if (btn) switchTab(btn.dataset.tab);
});

// ─── Render Functions ──────────────────

function renderResults(result) {
  document.getElementById("outDevName").textContent = result.name;
  document.getElementById("outUnits").textContent = result.units.toLocaleString();
  const ageParts = [result.age];
  if (result.tenure && result.tenure !== "—") ageParts.push(result.tenure);
  document.getElementById("outAge").textContent = ageParts.join(" · ");

  const hintAge = document.getElementById("hintAge");
  if (result.ageEstimated) {
    hintAge.textContent = "Estimated from lease / earliest resale";
    hintAge.hidden = false;
  } else {
    hintAge.hidden = true;
  }

  document.getElementById("outConfig").textContent = `${result.bed}BR / ${result.bath}BA${result.area !== "—" ? ` · ${result.area} sqft` : ""}`;

  const hintConfig = document.getElementById("hintConfig");
  hintConfig.textContent = "Bedroom count is user-provided; bathroom is estimated";
  hintConfig.hidden = false;

  const barsContainer = document.getElementById("scoreBars");
  barsContainer.innerHTML = "";

  result.criteria.forEach((c) => {
    const pct = (c.score / 10) * 100;
    const color = scoreColor(c.score);
    const impTag = c.imputed ? `<span class="score-imputed">*</span>` : "";

    const row = document.createElement("div");
    row.className = "score-row";
    row.innerHTML = `
      <div class="score-row-header">
        <span class="score-criterion">${c.label}</span>
        <span class="score-value" style="color:${color}">${c.score}/10${impTag}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="background:${color};" data-width="${pct}%"></div>
      </div>
    `;
    barsContainer.appendChild(row);
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      barsContainer.querySelectorAll(".bar-fill").forEach((bar) => {
        bar.style.width = bar.dataset.width;
      });
    });
  });

  renderRing(result.totalScore, result.tierKey);

  const badge = document.getElementById("tierBadge");
  badge.textContent = result.tier;
  badge.dataset.tier = result.tierKey;

  document.getElementById("tierDesc").textContent = result.tierDesc;

  renderAccordion(result);

  document.getElementById("tabNav").hidden = false;
  switchTab("overview");

  renderPrices(result);

  document.getElementById("refreshTimestamp").textContent = new Date().toLocaleString("en-SG", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const section = document.getElementById("resultsSection");
  section.hidden = false;
  section.style.animation = "none";
  void section.offsetHeight;
  section.style.animation = "";
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Price Section ────────────────────

const CLR_PRICE_MIN = "#4a6b5a";
const CLR_PRICE_AVG = "#7a766e";
const CLR_PRICE_MAX = "#bf8a7a";

function fmtQuantum(v, color) {
  const txt = v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : `$${(v / 1_000).toFixed(0)}k`;
  return color ? `<span style="color:${color};font-weight:600">${txt}</span>` : txt;
}

function fmtPsf(v, color) {
  const txt = `$${v.toLocaleString()} psf`;
  return color ? `<span style="color:${color};font-weight:600">${txt}</span>` : txt;
}

function priceTableHead() {
  return `<thead><tr><th></th><th style="color:${CLR_PRICE_MIN}">Min</th><th style="color:${CLR_PRICE_AVG}">Avg</th><th style="color:${CLR_PRICE_MAX}">Max</th></tr></thead>`;
}

function buildPriceTable(label, stats) {
  if (!stats) return `<div class="price-card"><h4 class="price-card-title">${label}</h4><p class="price-empty">No transactions found</p></div>`;

  return `
    <div class="price-card">
      <h4 class="price-card-title">${label}<span class="price-count">${stats.count} transactions</span></h4>
      <table class="price-table">
        ${priceTableHead()}
        <tbody>
          <tr><td class="price-row-label">Quantum</td><td>${fmtQuantum(stats.min, CLR_PRICE_MIN)}</td><td>${fmtQuantum(stats.avg, CLR_PRICE_AVG)}</td><td>${fmtQuantum(stats.max, CLR_PRICE_MAX)}</td></tr>
          <tr><td class="price-row-label">PSF</td><td>${fmtPsf(stats.minPsf, CLR_PRICE_MIN)}</td><td>${fmtPsf(stats.avgPsf, CLR_PRICE_AVG)}</td><td>${fmtPsf(stats.maxPsf, CLR_PRICE_MAX)}</td></tr>
        </tbody>
      </table>
    </div>`;
}

function buildSingleMetricCard(label, count, rows) {
  if (!rows) return `<div class="price-card"><h4 class="price-card-title">${label}</h4><p class="price-empty">No data</p></div>`;
  return `
    <div class="price-card">
      <h4 class="price-card-title">${label}<span class="price-count">${count} transactions</span></h4>
      <table class="price-table">
        ${priceTableHead()}
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

const chartInstances = {};

function buildComparisonChart(canvasId, entries, { avgKey, minKey, maxKey, xLabel, fmtTick, fmtTooltip }) {
  const canvas = document.getElementById(canvasId);
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
    chartInstances[canvasId] = null;
  }

  const accentColor = "#1a1a1a";
  const compColor = "#c4bdb2";

  const labels = entries.map((e) => e.name);
  const avgData = entries.map((e) => e[avgKey]);
  const minData = entries.map((e) => e[minKey]);
  const maxData = entries.map((e) => e[maxKey]);
  const bgColors = entries.map((e) => e.isTarget ? accentColor : compColor);
  const borderColors = entries.map((e) => e.isTarget ? "#000" : "#a8a199");

  const barHeight = 28;
  const chartHeight = Math.min(entries.length * barHeight + 40, 320);
  canvas.style.height = `${chartHeight}px`;

  chartInstances[canvasId] = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Avg",
          data: avgData,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: 3,
          barPercentage: 0.55,
          categoryPercentage: 0.8,
        },
        {
          label: "Min",
          data: minData,
          type: "line",
          pointStyle: "dash",
          pointRadius: 4,
          pointBorderWidth: 1.5,
          pointBackgroundColor: "transparent",
          pointBorderColor: borderColors,
          showLine: false,
          borderWidth: 0,
        },
        {
          label: "Max",
          data: maxData,
          type: "line",
          pointStyle: "dash",
          pointRadius: 4,
          pointBorderWidth: 1.5,
          pointBackgroundColor: "transparent",
          pointBorderColor: borderColors,
          showLine: false,
          borderWidth: 0,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 2, bottom: 2, left: 0, right: 12 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: { size: 11 },
          bodyFont: { size: 11 },
          callbacks: {
            label(ctx) {
              const e = entries[ctx.dataIndex];
              const val = ctx.raw;
              const prefix = ["Avg", "Min", "Max"][ctx.datasetIndex];
              return `${prefix}: ${fmtTooltip(val)}`;
            },
            title(items) {
              const e = entries[items[0].dataIndex];
              return e.isTarget ? `${e.name} (this development)` : e.name;
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: xLabel, font: { size: 10 } },
          grid: { color: "#ddd9d1" },
          ticks: {
            callback: fmtTick,
            font: { size: 10 },
            maxTicksLimit: 6,
          },
        },
        y: {
          ticks: {
            font(ctx) {
              const e = entries[ctx.index];
              return { size: 10, weight: e?.isTarget ? "bold" : "normal" };
            },
            color(ctx) {
              const e = entries[ctx.index];
              return e?.isTarget ? accentColor : "#7a766e";
            },
          },
          grid: { display: false },
          afterFit(axis) { axis.width = 160; },
        },
      },
    },
  });
}

function renderComparisonCharts(result) {
  const row = document.getElementById("chartRow");
  const comp = result.comparables;
  const bedKey = result.bed;
  const targetBedStats = result.priceStats?.byBed?.[bedKey];

  if (!targetBedStats || !comp?.developments?.length) {
    row.hidden = true;
    return;
  }

  const psfEntries = [
    { name: result.name, avgPsf: targetBedStats.avgPsf, minPsf: targetBedStats.minPsf, maxPsf: targetBedStats.maxPsf, isTarget: true },
    ...comp.developments.filter((d) => d.avgPsf != null).map((d) => ({ ...d, isTarget: false })),
  ].sort((a, b) => b.avgPsf - a.avgPsf);

  const quantumEntries = [
    { name: result.name, avgQuantum: targetBedStats.avg, minQuantum: targetBedStats.min, maxQuantum: targetBedStats.max, isTarget: true },
    ...comp.developments.filter((d) => d.avgQuantum != null).map((d) => ({ ...d, isTarget: false })),
  ].sort((a, b) => b.avgQuantum - a.avgQuantum);

  buildComparisonChart("psfChart", psfEntries, {
    avgKey: "avgPsf", minKey: "minPsf", maxKey: "maxPsf",
    xLabel: "$ per sq ft",
    fmtTick: (v) => `$${v.toLocaleString()}`,
    fmtTooltip: (v) => `$${v.toLocaleString()} psf`,
  });

  buildComparisonChart("quantumChart", quantumEntries, {
    avgKey: "avgQuantum", minKey: "minQuantum", maxKey: "maxQuantum",
    xLabel: "Price ($)",
    fmtTick: (v) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}k`,
    fmtTooltip: (v) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : `$${(v / 1_000).toFixed(0)}k`,
  });

  row.hidden = false;
}

function renderPrices(result) {
  const section = document.getElementById("priceSection");
  const grid = document.getElementById("priceGrid");

  if (!result.priceStats?.all) {
    section.hidden = true;
    document.getElementById("comparableSection").hidden = true;
    return;
  }

  const bedLabel = result.bed === "5" ? "5+ BR" : `${result.bed} BR`;
  const bedStats = result.priceStats.byBed?.[result.bed] ?? null;

  grid.innerHTML =
    buildPriceTable("All Unit Types", result.priceStats.all) +
    buildPriceTable(`${bedLabel} (estimated)`, bedStats);

  section.hidden = false;

  const overviewPanel = document.getElementById("panelOverview");
  const doRenderTrend = () => renderTrendCharts(result.priceStats, result.bed, bedLabel, result.name);
  if (!overviewPanel.hidden) {
    setTimeout(doRenderTrend, 50);
  } else {
    pendingTrendRender = doRenderTrend;
  }

  renderComparables(result.comparables, result);
}

function trendChangeSummary(dataPoints) {
  const valid = dataPoints.filter((v) => v != null);
  if (valid.length < 2) return null;
  const first = valid[0];
  const last = valid[valid.length - 1];
  const pctChange = ((last - first) / first) * 100;
  const abs = Math.abs(pctChange);
  const rounded = abs < 1 ? abs.toFixed(1) : Math.round(abs);
  if (pctChange > 1) return { dir: "up", pct: rounded, cls: "trend-up", verb: "increased" };
  if (pctChange < -1) return { dir: "down", pct: rounded, cls: "trend-down", verb: "decreased" };
  return { dir: "flat", pct: 0, cls: "trend-flat", verb: "remained stable" };
}

function last12Months(monthKeys) {
  const now = new Date();
  const cutoff = `${now.getFullYear() - 1}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return monthKeys.filter((m) => m >= cutoff);
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function fmtMonthLabel(m) {
  const [y, mo] = m.split("-");
  return `${MONTH_NAMES[parseInt(mo, 10) - 1]} ${y.slice(2)}`;
}

function renderTrendCharts(priceStats, bed, bedLabel, devName) {
  const container = document.getElementById("trendCharts");
  const emptyMsg = document.getElementById("trendEmptyMsg");
  const summaryEl = document.getElementById("trendSummary");
  const trendAll = priceStats.trendAll ?? [];
  const trendBed = priceStats.trendByBed?.[bed] ?? [];

  if (!trendAll.length && !trendBed.length) {
    emptyMsg.textContent = "No transaction data available to display price trends.";
    emptyMsg.hidden = false;
    summaryEl.hidden = true;
    document.querySelectorAll(".chart-wrap-trend").forEach((el) => (el.hidden = true));
    container.hidden = false;
    return;
  }

  emptyMsg.hidden = true;
  document.querySelectorAll(".chart-wrap-trend").forEach((el) => (el.hidden = false));

  const allMonths = [...new Set([...trendAll.map((d) => d.month), ...trendBed.map((d) => d.month)])].sort();
  const allMap = Object.fromEntries(trendAll.map((d) => [d.month, d]));
  const bedMap = Object.fromEntries(trendBed.map((d) => [d.month, d]));

  const labels = allMonths.map(fmtMonthLabel);

  const allPsf = allMonths.map((m) => allMap[m]?.avgPsf ?? null);
  const bedPsf = allMonths.map((m) => bedMap[m]?.avgPsf ?? null);
  const allQ = allMonths.map((m) => allMap[m]?.avgQuantum ?? null);
  const bedQ = allMonths.map((m) => bedMap[m]?.avgQuantum ?? null);

  // Summary uses last 12 months only
  const recent = last12Months(allMonths);
  const recentAllPsf = recent.map((m) => allMap[m]?.avgPsf ?? null);
  const recentBedPsf = recent.map((m) => bedMap[m]?.avgPsf ?? null);
  const recentAllQ = recent.map((m) => allMap[m]?.avgQuantum ?? null);
  const recentBedQ = recent.map((m) => bedMap[m]?.avgQuantum ?? null);

  const psfAll = trendChangeSummary(recentAllPsf);
  const psfBed = trendChangeSummary(recentBedPsf);
  const qAll = trendChangeSummary(recentAllQ);
  const qBed = trendChangeSummary(recentBedQ);

  const rows = [];
  if (psfAll) rows.push(`<tr><td>PSF</td><td>All units</td><td class="${psfAll.cls}">${psfAll.verb}${psfAll.pct ? ` ${psfAll.pct}%` : ""}</td></tr>`);
  if (psfBed) rows.push(`<tr><td>PSF</td><td>${bedLabel}</td><td class="${psfBed.cls}">${psfBed.verb}${psfBed.pct ? ` ${psfBed.pct}%` : ""}</td></tr>`);
  if (qAll) rows.push(`<tr><td>Quantum</td><td>All units</td><td class="${qAll.cls}">${qAll.verb}${qAll.pct ? ` ${qAll.pct}%` : ""}</td></tr>`);
  if (qBed) rows.push(`<tr><td>Quantum</td><td>${bedLabel}</td><td class="${qBed.cls}">${qBed.verb}${qBed.pct ? ` ${qBed.pct}%` : ""}</td></tr>`);

  if (rows.length) {
    const periodStart = recent.length ? fmtMonthLabel(recent[0]) : labels[0];
    const periodEnd = recent.length ? fmtMonthLabel(recent[recent.length - 1]) : labels[labels.length - 1];
    summaryEl.innerHTML =
      `<h4 class="price-card-title">Summary of Price Trends</h4>` +
      `<p class="trend-summary-period">${devName} — past 12 months (${periodStart} – ${periodEnd})</p>` +
      `<table class="trend-summary-table">${rows.join("")}</table>`;
    summaryEl.hidden = false;
  } else {
    summaryEl.hidden = true;
  }

  buildTrendLine("trendPsfCanvas", labels, allPsf, bedPsf, bedLabel, "PSF ($)", (v) => `$${v.toLocaleString()}`);
  buildTrendLine("trendQuantumCanvas", labels, allQ, bedQ, bedLabel, "Quantum ($)", (v) => `$${(v / 1000).toFixed(0)}k`);

  container.hidden = false;
}

function buildTrendLine(canvasId, labels, allData, bedData, bedLabel, yLabel, fmtTick) {
  const canvas = document.getElementById(canvasId);
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
    chartInstances[canvasId] = null;
  }

  const accentColor = "#1a1a1a";
  const bedColor = "#9a8e7a";

  const datasets = [];

  const hasAll = allData.some((v) => v != null);
  const hasBed = bedData.some((v) => v != null);

  if (hasAll) {
    datasets.push({
      label: "All Unit Types",
      data: allData,
      borderColor: accentColor,
      backgroundColor: "rgba(26,26,26,0.08)",
      pointBackgroundColor: accentColor,
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      tension: 0.3,
      spanGaps: true,
      fill: false,
    });
  }

  if (hasBed) {
    datasets.push({
      label: bedLabel,
      data: bedData,
      borderColor: bedColor,
      backgroundColor: "rgba(154,142,122,0.08)",
      pointBackgroundColor: bedColor,
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      tension: 0.3,
      spanGaps: true,
      fill: false,
      borderDash: [5, 3],
    });
  }

  chartInstances[canvasId] = new Chart(canvas, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 4, bottom: 4, left: 0, right: 8 } },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: { boxWidth: 14, font: { size: 10, family: "Inter" }, padding: 10 },
        },
        tooltip: {
          titleFont: { size: 11 },
          bodyFont: { size: 11 },
          callbacks: {
            label(ctx) {
              return ctx.raw != null ? `${ctx.dataset.label}: ${fmtTick(ctx.raw)}` : "";
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { font: { size: 9 }, maxRotation: 45, autoSkipPadding: 8 },
          grid: { display: false },
        },
        y: {
          title: { display: true, text: yLabel, font: { size: 10 } },
          ticks: {
            font: { size: 9 },
            callback(v) { return fmtTick(v); },
          },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
      },
    },
  });
}

function fmtDelta(pct) {
  const abs = Math.abs(pct);
  const rounded = abs < 1 ? abs.toFixed(1) : Math.round(abs);
  if (pct > 1) return { text: `${rounded}% higher`, cls: "comp-delta--higher" };
  if (pct < -1) return { text: `${rounded}% lower`, cls: "comp-delta--lower" };
  return { text: "on par", cls: "comp-delta--par" };
}

function renderCompSummary(result, compStats, bedLabel, isFallback, criteriaDesc) {
  const el = document.getElementById("compSummary");
  const targetStats = result.priceStats?.byBed?.[result.bed];

  if (!targetStats || !compStats) {
    el.hidden = true;
    return;
  }

  const psfDelta = ((targetStats.avgPsf - compStats.avgPsf) / compStats.avgPsf) * 100;
  const qDelta = ((targetStats.avg - compStats.avg) / compStats.avg) * 100;
  const psfD = fmtDelta(psfDelta);
  const qD = fmtDelta(qDelta);

  const disclaimerHTML = isFallback
    ? `<p class="comp-disclaimer">Note: no developments matched the default criteria (${criteriaDesc.toLowerCase()}) The comparisons below use the nearest available developments and may differ significantly in size, tenure, or distance. Use these figures as a rough reference only.</p>`
    : "";

  el.innerHTML = `
    <p class="comp-summary-label">How ${result.name} compares (${bedLabel})</p>
    ${disclaimerHTML}
    <div class="comp-summary-row">
      <span>Average PSF is <span class="comp-delta ${psfD.cls}">${psfD.text}</span> than nearby comparables</span>
    </div>
    <div class="comp-summary-row">
      <span>Average quantum is <span class="comp-delta ${qD.cls}">${qD.text}</span> than nearby comparables</span>
    </div>
  `;
  el.hidden = false;
}

function renderComparables(comp, result) {
  const compSection = document.getElementById("comparableSection");
  const compGrid = document.getElementById("comparableGrid");
  const chartRow = document.getElementById("chartRow");
  const bedLabel = result.bed === "5" ? "5+ BR" : `${result.bed} BR`;

  if (!comp?.developments?.length) {
    compSection.hidden = true;
    document.getElementById("compSummary").hidden = true;
    return;
  }

  const hasPrices = comp.stats != null;
  const criteriaDesc = `Within 2 km, ±200 total units, ${bedLabel} unit type, matching tenure` +
    (result.tenure !== "Freehold" ? ` (±5 yr leasehold)` : "") + `.`;

  const dataNote = " Prices based on all URA sub-sale and resale transactions available (~3 years). Bedroom count is estimated from unit floor area.";
  if (!comp.fallback) {
    document.getElementById("comparableSubtext").textContent =
      `${criteriaDesc} Top 5 closest shown.` + dataNote;
  } else {
    document.getElementById("comparableSubtext").textContent =
      `Showing the 5 closest developments with ${bedLabel} transaction data.` + dataNote;
  }

  const devList = comp.developments.map((d) => {
    const parts = [d.name];
    if (d.dist != null) parts.push(`${d.dist}m`);
    if (d.units != null) parts.push(`${d.units} units`);
    if (d.tenure) parts.push(d.tenure);
    if (d.txCount != null) parts.push(`${d.txCount} txn${d.txCount !== 1 ? "s" : ""}`);
    return parts.join(" · ");
  });
  document.getElementById("comparableDevs").innerHTML =
    `<strong>Developments included:</strong><br>` + devList.join("<br>");

  if (hasPrices) {
    const s = comp.stats;
    compGrid.innerHTML =
      buildSingleMetricCard(`PSF — ${bedLabel} Comparables`, s.count,
        `<tr><td class="price-row-label">PSF</td><td>${fmtPsf(s.minPsf, CLR_PRICE_MIN)}</td><td>${fmtPsf(s.avgPsf, CLR_PRICE_AVG)}</td><td>${fmtPsf(s.maxPsf, CLR_PRICE_MAX)}</td></tr>`) +
      buildSingleMetricCard(`Quantum — ${bedLabel} Comparables`, s.count,
        `<tr><td class="price-row-label">Quantum</td><td>${fmtQuantum(s.min, CLR_PRICE_MIN)}</td><td>${fmtQuantum(s.avg, CLR_PRICE_AVG)}</td><td>${fmtQuantum(s.max, CLR_PRICE_MAX)}</td></tr>`);

    renderCompSummary(result, s, bedLabel, comp.fallback, criteriaDesc);

    const chartResult = { ...result, comparables: comp };
    const comparePanel = document.getElementById("panelCompare");
    if (!comparePanel.hidden) {
      requestAnimationFrame(() => renderComparisonCharts(chartResult));
    } else {
      pendingChartRender = () => renderComparisonCharts(chartResult);
    }
    chartRow.hidden = false;
  } else {
    compGrid.innerHTML = "";
    chartRow.hidden = true;
    document.getElementById("compSummary").hidden = true;
  }

  compSection.hidden = false;
}

function renderRing(total, tierKey) {
  const circumference = 2 * Math.PI * 52;
  const pct = total / 50;
  const offset = circumference * (1 - pct);
  const fill = document.getElementById("ringFill");
  fill.style.transition = "none";
  fill.style.strokeDashoffset = circumference;
  void fill.offsetHeight;
  fill.style.transition = "";
  fill.style.stroke = tierColor(tierKey);
  requestAnimationFrame(() => {
    fill.style.strokeDashoffset = offset;
  });
  const scoreNum = document.getElementById("totalScoreNum");
  scoreNum.textContent = "0";
  scoreNum.style.color = tierColor(tierKey);
  animateNumber("totalScoreNum", total, 800);
}

function animateNumber(id, target, duration) {
  const el = document.getElementById(id);
  const start = parseInt(el.textContent) || 0;
  const range = target - start;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + range * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function renderAccordion(result) {
  const container = document.getElementById("accordion");
  container.innerHTML = "";

  result.criteria.forEach((c, i) => {
    if (c.key === "mrt") {
      if (result.nearestMRT?.name) c.mrtName = result.nearestMRT.name;
      if (result.mrtsWithin1km) c.mrtsWithin1km = result.mrtsWithin1km;
    }

    const color = scoreColor(c.score);
    const item = document.createElement("div");
    item.className = "accordion-item";
    item.innerHTML = `
      <button class="accordion-trigger" aria-expanded="false">
        <span>${c.label}</span>
        <span class="trigger-score" style="background:${color}">${c.score}</span>
        <span class="chevron"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></span>
      </button>
      <div class="accordion-body">
        ${buildDrillHTML(c)}
      </div>
    `;
    container.appendChild(item);

    item.querySelector(".accordion-trigger").addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      container.querySelectorAll(".accordion-item.open").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        item.querySelector(".accordion-trigger").setAttribute("aria-expanded", "true");
      }
    });
  });
}

// ─── Autocomplete ──────────────────────

let searchTimeout = null;
let knownNames = new Set();

function updateButtonState() {
  const input = document.getElementById("devName");
  const btn = document.getElementById("btnEvaluate");
  const val = input.value.trim().toLowerCase();
  btn.disabled = !(val.length > 0 && knownNames.has(val));
}

function populateSuggestions() {
  const dl = document.getElementById("devSuggestions");
  Object.keys(DEVELOPMENTS).forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    dl.appendChild(opt);
    knownNames.add(name.toLowerCase());
  });

  const input = document.getElementById("devName");
  input.addEventListener("input", () => {
    updateButtonState();
    clearTimeout(searchTimeout);
    const q = input.value.trim();
    if (q.length < 3) return;

    searchTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) return;
        const results = await res.json();
        if (!results.length) return;

        dl.innerHTML = "";
        Object.keys(DEVELOPMENTS).forEach((name) => {
          if (name.toLowerCase().includes(q.toLowerCase())) {
            const opt = document.createElement("option");
            opt.value = name;
            dl.appendChild(opt);
          }
        });
        results.forEach((r) => {
          const label = r.name || r.address;
          const opt = document.createElement("option");
          opt.value = label;
          dl.appendChild(opt);
          knownNames.add(label.toLowerCase());
        });
        updateButtonState();
      } catch {
        // Backend not available — keep mock suggestions
      }
    }, 300);
  });

  input.addEventListener("change", updateButtonState);
}

// ─── Live API Integration ──────────────

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:3001"
  : "https://sg-condo-eval-server.onrender.com";

async function evaluateViaAPI(devName, bed, bath) {
  const res = await fetch(`${API_BASE}/api/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ devName, bed, bath }),
  });
  if (!res.ok) return null;
  return res.json();
}

async function runEvaluation(devName, bed, bath) {
  // Try the live backend first; fall back to local mock data
  try {
    const liveResult = await evaluateViaAPI(devName, bed, bath);
    if (liveResult) {
      liveResult._source = "live";
      return liveResult;
    }
  } catch {
    // Backend not running — fall through to mock
  }
  const mockResult = evaluateDevelopment(devName, bed, bath);
  if (mockResult) mockResult._source = "mock";
  return mockResult;
}

// ─── Floor Plan Upload & Analysis ────

let selectedFloorPlanFile = null;

function setupFloorPlanUpload() {
  const zone = document.getElementById("uploadZone");
  const input = document.getElementById("floorPlanInput");
  const placeholder = document.getElementById("uploadPlaceholder");
  const preview = document.getElementById("uploadPreview");
  const previewImg = document.getElementById("previewImg");
  const removeBtn = document.getElementById("uploadRemove");

  function showPreview(file) {
    selectedFloorPlanFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      placeholder.hidden = true;
      preview.hidden = false;
    };
    reader.readAsDataURL(file);
  }

  function clearPreview() {
    selectedFloorPlanFile = null;
    input.value = "";
    previewImg.src = "";
    placeholder.hidden = false;
    preview.hidden = true;
  }

  zone.addEventListener("click", (e) => {
    if (e.target.closest(".upload-remove")) return;
    input.click();
  });

  input.addEventListener("change", () => {
    if (input.files[0]) showPreview(input.files[0]);
  });

  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearPreview();
  });

  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("drag-over");
  });

  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) showPreview(file);
  });
}

async function analyzeFloorPlan(file) {
  const formData = new FormData();
  formData.append("floorplan", file);

  const res = await fetch(`${API_BASE}/api/analyze-floorplan`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Analysis failed" }));
    throw new Error(err.error || "Floor plan analysis failed");
  }

  return res.json();
}

function renderFloorPlanResults(analysis) {
  const tabBtn = document.getElementById("tabFloorplan");
  tabBtn.hidden = false;

  const fpAnalysis = document.getElementById("fpAnalysis");
  const fpLoading = document.getElementById("fpLoading");
  const fpError = document.getElementById("fpError");

  fpLoading.classList.remove("visible");
  fpError.hidden = true;
  fpAnalysis.hidden = false;

  document.getElementById("fpImage").src = document.getElementById("previewImg").src;

  const circScore = analysis.circulationScore ?? 0;
  const zoneScore = analysis.zoningScore ?? 0;
  const utilScore = analysis.utilizationScore ?? 0;

  document.getElementById("fpCircScore").textContent = circScore;
  document.getElementById("fpZoneScore").textContent = zoneScore;
  document.getElementById("fpUtilScore").textContent = utilScore;

  const circumference = 2 * Math.PI * 34;

  function setRing(id, score) {
    const ring = document.getElementById(id);
    ring.style.strokeDasharray = `${circumference}`;
    ring.style.strokeDashoffset = `${circumference * (1 - score / 10)}`;
    ring.style.stroke = scoreColor(score);
  }

  setRing("fpCircRingFill", circScore);
  setRing("fpZoneRingFill", zoneScore);
  setRing("fpUtilRingFill", utilScore);

  document.getElementById("fpCircDetail").textContent = analysis.circulationDetail || "";
  document.getElementById("fpZoneDetail").textContent = analysis.zoningDetail || "";
  document.getElementById("fpUtilDetail").textContent = analysis.utilizationDetail || "";

  const sugSection = document.getElementById("fpSuggestionsSection");
  const sugList = document.getElementById("fpSuggestions");
  if (analysis.suggestions && analysis.suggestions.length > 0) {
    sugList.innerHTML = analysis.suggestions.map((s) => `<li>${s}</li>`).join("");
    sugSection.hidden = false;
  } else {
    sugSection.hidden = true;
  }
}

// ─── Init ──────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  populateSuggestions();
  setupFloorPlanUpload();

  const form = document.getElementById("evalForm");
  const btn = document.getElementById("btnEvaluate");
  const btnText = form.querySelector(".btn-text");
  const btnLoader = form.querySelector(".btn-loader");
  btn.disabled = true;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const devName = document.getElementById("devName").value.trim();
    const bed = document.getElementById("bedrooms").value;
    const bath = document.getElementById("bathrooms").value;

    if (!devName || !bed || !bath) return;

    btnText.hidden = true;
    btnLoader.hidden = false;

    const hasFloorPlan = !!selectedFloorPlanFile;

    document.getElementById("tabFloorplan").hidden = !hasFloorPlan;
    if (hasFloorPlan) {
      document.getElementById("fpAnalysis").hidden = true;
      document.getElementById("fpError").hidden = true;
      document.getElementById("fpLoading").classList.add("visible");
    }

    let fpResult = null;

    const [result] = await Promise.all([
      runEvaluation(devName, bed, bath),
      hasFloorPlan
        ? analyzeFloorPlan(selectedFloorPlanFile)
            .then((analysis) => { fpResult = analysis; })
            .catch((err) => {
              document.getElementById("fpLoading").classList.remove("visible");
              const fpError = document.getElementById("fpError");
              fpError.textContent = err.message || "Floor plan analysis failed. Please try again.";
              fpError.hidden = false;
            })
        : Promise.resolve(),
    ]);

    btnText.hidden = false;
    btnLoader.hidden = true;

    if (!result) {
      alert(`"${devName}" not found. If the backend is running, any Singapore condo can be searched. Otherwise, try one of the suggestions from the dropdown.`);
      return;
    }

    renderResults(result);

    if (fpResult) {
      renderFloorPlanResults(fpResult);
    }
  });
});
