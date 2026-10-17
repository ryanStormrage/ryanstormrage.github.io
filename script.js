// ---- config: change these if you rename anything ----
const GITHUB_USER = "ryanstormrage";

const FEATURED = [
  {
    repo: "clt-flight-deals",
    title: "CLT Flight Deal Tracker",
    tag: "In progress",
    live: true,
    tone: "#f99e1a",
    blurb: "Watches one-way fares out of Charlotte Douglas (CLT) to a list of destinations, keeps a price history in SQLite, and flags a deal when a fare drops well below its recent average.",
    stack: ["Python", "SQLite", "Fares API", "HTML report"],
  },
  {
    repo: "ow-meta-tracker",
    title: "Overwatch Meta Tracker",
    tag: "Data pipeline",
    tone: "#4fd1c5",
    blurb: "Pulls hero pick, win and ban rates from the open-source OverFast API, snapshots them daily, and renders a dashboard of the strongest heroes and the biggest movers.",
    stack: ["Python", "OverFast API", "SQLite", "HTML/CSS"],
  },
  {
    repo: "ow-esports-tracker",
    title: "Overwatch Esports Tracker",
    tag: "C# / .NET",
    tone: "#a78bfa",
    blurb: "A .NET console app that reads Overwatch Champions Series match data from Liquipedia, builds team standings and recent results, and exports them to JSON and a static web page.",
    stack: ["C#", ".NET 8", "Liquipedia API", "HTML"],
  },
  {
    repo: "dallas-dart-transit",
    title: "How often does the bus come?",
    tag: "Data analysis",
    tone: "#3987e5",
    blurb: "Analyzes every Dallas DART bus route from the official GTFS schedule feed: how often the bus comes, how long it runs each day, scheduled speeds and the busiest stops. Includes a frequency map and ten SQL questions.",
    stack: ["Python", "SQL", "GTFS", "Leaflet map"],
  },
  {
    repo: "clt-flight-delays-sql",
    title: "CLT Flight Delays in SQL",
    tag: "SQL analysis",
    tone: "#60a5fa",
    blurb: "Loads U.S. DOT on-time performance records for Charlotte into a SQLite database and answers questions in SQL: worst airlines, worst hours, causes of delay, cancellation rates.",
    stack: ["SQL", "SQLite", "Python", "BTS open data"],
  },
  {
    repo: "mood-playlist-generator",
    title: "Mood Playlist Generator",
    tag: "Web app",
    tone: "#e2483d",
    blurb: "Type how you feel and pick a genre (\"happy, genre rap\") to get a playlist from 114k songs, matched on Spotify audio features like positivity, energy and tempo. Includes Shuffle, shareable links and CSV export.",
    stack: ["JavaScript", "HTML/CSS", "Python", "Open data"],
  },
];

const LANG_COLORS = {
  Python: "#3572A5", "C#": "#178600", JavaScript: "#f1e05a", HTML: "#e34c26",
  CSS: "#563d7c", TypeScript: "#3178c6", Java: "#b07219", "Jupyter Notebook": "#DA5B0B",
  TSQL: "#e38c00", Kotlin: "#A97BFF", Other: "#8b93a1",
};

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function renderFeatured() {
  $("#featured-grid").innerHTML = FEATURED.map((p) => `
    <article class="feature" style="--tone:${p.tone}">
      <span class="tag ${p.live ? "live" : ""} mono">${esc(p.tag)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.blurb)}</p>
      <div class="chips">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
      <a class="more mono" href="https://github.com/${GITHUB_USER}/${p.repo}" target="_blank" rel="noopener">view code →</a>
    </article>`).join("");
}

let allRepos = [];
let activeLang = "All";

function renderFilters() {
  const langs = ["All", ...new Set(allRepos.map((r) => r.language || "Other"))];
  $("#filters").innerHTML = langs.map((l) =>
    `<button type="button" data-lang="${esc(l)}" aria-pressed="${l === activeLang}">${esc(l)}</button>`).join("");
  $("#filters").querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => { activeLang = b.dataset.lang; renderFilters(); renderRepos(); }));
}

function renderRepos() {
  const list = allRepos.filter((r) => activeLang === "All" || (r.language || "Other") === activeLang);
  if (!list.length) { $("#repo-grid").innerHTML = `<p class="muted">No repositories here yet.</p>`; return; }
  $("#repo-grid").innerHTML = list.map((r) => {
    const lang = r.language || "Other";
    return `
      <a class="repo" href="${esc(r.html_url)}" target="_blank" rel="noopener">
        <h3>${esc(r.name)}</h3>
        <p>${esc(r.description || "No description yet.")}</p>
        <div class="meta mono">
          <span><i class="dot" style="background:${LANG_COLORS[lang] || LANG_COLORS.Other}"></i>${esc(lang)}</span>
          ${r.stargazers_count ? `<span>★ ${r.stargazers_count}</span>` : ""}
          <span>${timeAgo(r.pushed_at)}</span>
        </div>
      </a>`;
  }).join("");
}

async function loadRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`);
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    allRepos = (await res.json()).filter((r) => !r.fork);
    const langs = new Set(allRepos.map((r) => r.language).filter(Boolean));
    $("#stat-repos").textContent = allRepos.length;
    $("#stat-langs").textContent = langs.size;
    $("#stat-updated").textContent = allRepos[0] ? timeAgo(allRepos[0].pushed_at) : "—";
    renderFilters();
    renderRepos();
  } catch (err) {
    $("#repo-grid").innerHTML = `<p class="muted">Couldn't reach GitHub right now (${esc(err.message)}).
      <a href="https://github.com/${GITHUB_USER}?tab=repositories">See the repos on GitHub →</a></p>`;
  }
}

$("#year").textContent = new Date().getFullYear();
renderFeatured();
loadRepos();
