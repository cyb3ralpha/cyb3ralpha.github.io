/* pantak-like terminal for CyberAlpha */
(() => {
  const screen = document.getElementById("screen");
  const input = document.getElementById("cmd");
  const ps1 = document.getElementById("ps1");

  // ---- Config: your data ----
  const USER = "CyberAlpha";
  const HOST = "portfolio";
  const HOME = "~";
  const links = {
    about: "about.html",
    contact: "contact.html",
    blog: "blog.html",
    projects: "projects.html",
    speaking: "speaking.html",
    community: "community.html",
    github: "https://github.com/CyberAlpha",
    linkedin: "#",
    twitter: "#"
  };

  const projects = [
    { name: "Guardian-Shield", url: "https://github.com/CyberAlpha/guardian-shield", note: "OSINT & recon suite" },
    { name: "JARVIS-Assistant", url: "https://github.com/CyberAlpha/jarvis-assistant", note: "Linux AI assistant" },
    { name: "Vuln-Lab", url: "https://github.com/CyberAlpha/vuln-lab", note: "Web vulns learning lab" },
    { name: "OSINT-Scan", url: "https://github.com/CyberAlpha/osint-scan", note: "Email/phone/domain enum" }
  ];

  // ---- State ----
  const history = [];
  let hIndex = -1;
  let cwd = HOME;

  // ---- Helpers ----
  const prompt = () => `${USER}@${HOST}:${cwd}$`;
  const out = (text = "") => {
    const div = document.createElement("div");
    div.className = "line";
    div.innerHTML = text;
    screen.appendChild(div);
    screen.scrollTop = screen.scrollHeight;
  };
  const printCmd = (cmd) => out(`${prompt()} ${escapeHtml(cmd)}`);

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // ---- Commands ----
  const commands = {
    help() {
      return [
        "Available commands:",
        "  help            Show this help",
        "  ls              List sections",
        "  cat README      About this site",
        "  cd <dir>        fake change dir (/, ~/projects, ~/links)",
        "  projects        List projects",
        "  links           Social / pages",
        "  open <name>     Open project by name",
        "  clear           Clear screen"
      ].join("\n");
    },

    ls() {
      return [
        "drwxr-xr-x   3 cyberalpha  staff   sections",
        "  ├── Info",
        "  ├── Projects",
        "  └── Links",
        "",
        "Tip: try `projects` or `links`"
      ].join("\n");
    },

    "cat readme"() {
      return [
        "CyberAlpha Terminal Portfolio",
        "Ethical hacker • AI & Cybersecurity enthusiast.",
        "I build offensive security tools, speak at events, and share knowledge.",
        "",
        "Try: help | ls | projects | links | cat README"
      ].join("\n");
    },

    projects() {
      const lines = ["Projects:"];
      projects.forEach(p => {
        lines.push(`  /${p.name} -> <a href="${p.url}" target="_blank" rel="noreferrer">${p.url}</a>  # ${p.note}`);
      });
      return lines.join("\n");
    },

    links() {
      return [
        "Links:",
        `  /About        -> <a href="${links.about}">${links.about}</a>`,
        `  /Projects     -> <a href="${links.projects}">${links.projects}</a>`,
        `  /Blog         -> <a href="${links.blog}">${links.blog}</a>`,
        `  /Speaking     -> <a href="${links.speaking}">${links.speaking}</a>`,
        `  /Contact      -> <a href="${links.contact}">${links.contact}</a>`,
        `  /GitHub       -> <a href="${links.github}" target="_blank" rel="noreferrer">${links.github}</a>`,
        `  /LinkedIn     -> <a href="${links.linkedin}" target="_blank" rel="noreferrer">${links.linkedin}</a>`,
        `  /Twitter      -> <a href="${links.twitter}" target="_blank" rel="noreferrer">${links.twitter}</a>`
      ].join("\n");
    },

    clear() {
      screen.innerHTML = "";
      return "";
    },

    cd(arg) {
      if (!arg) return cwd;
      if (arg === "/" || arg === "~") { cwd = HOME; return cwd; }
      if (arg === "~/projects") { cwd = "~/projects"; return cwd; }
      if (arg === "~/links") { cwd = "~/links"; return cwd; }
      return `cd: no such file or directory: ${escapeHtml(arg)}`;
    },

    open(arg) {
      if (!arg) return "open: provide a project name, e.g., open Guardian-Shield";
      const p = projects.find(pr => pr.name.toLowerCase() === arg.toLowerCase());
      if (!p) return `open: project not found: ${escapeHtml(arg)}`;
      window.open(p.url, "_blank", "noopener,noreferrer");
      return `opening ${p.name} ...`;
    }
  };

  // alias map (case-insensitive keys)
  const aliases = {
    "cat readme.md": "cat readme",
    "cat readme": "cat readme",
    "readme": "cat readme"
  };

  function runCommand(raw) {
    const cmdline = raw.trim();
    if (!cmdline) return;

    history.unshift(cmdline);
    hIndex = -1;

    // parse
    const parts = cmdline.split(/\s+/);
    const base = (parts[0] || "").toLowerCase();
    const arg1 = parts.slice(1).join(" ");

    // join for alias checks like "cat readme"
    const full = parts.slice(0,2).join(" ").toLowerCase();

    // direct match
    let fn = commands[base];
    // alias (two-word)
    if (!fn && aliases[full]) fn = commands[aliases[full]];
    // alias (single)
    if (!fn && aliases[base]) fn = commands[aliases[base]];

    if (base === "cd") {
      out(commands.cd(arg1));
      ps1.textContent = `${USER}@${HOST}:${cwd}$`;
      return;
    }

    if (fn) {
      const result = (base === "clear") ? commands.clear() : fn(arg1);
      if (result) out(result);
    } else {
      out(`${base}: command not found. Try 'help'.`);
    }
  }

  // ---- Boot sequence (typewriter) ----
  const bootLines = [
    `${prompt()} ls -la`,
    "",
    "  * → Info:",
    "  /About        -> about.html",
    "  /Contact      -> contact.html",
    "",
    "  * → Projects:",
    ...projects.map(p => `  /${p.name} -> ${p.url}`),
    "",
    "Type 'help' to get started."
  ];

  async function typeLine(text, speed=12){
    // print as if typed
    const line = document.createElement("div");
    screen.appendChild(line);
    for (let i=0;i<text.length;i++){
      line.textContent += text[i];
      screen.scrollTop = screen.scrollHeight;
      await wait(1000/speed);
    }
    screen.appendChild(document.createElement("div"));
  }
  function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }

  (async function boot(){
    for (const l of bootLines){
      if (l === "") { out(""); continue; }
      await typeLine(l, 24);
    }
    screen.appendChild(document.createElement("div"));
  })();

  // ---- Input handling ----
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = input.value;
      printCmd(val);
      input.value = "";
      runCommand(val);
      // keep cursor at end visually
      setTimeout(()=> input.focus(), 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length && hIndex < history.length - 1) {
        hIndex++;
        input.value = history[hIndex];
        moveCaretToEnd(input);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIndex > 0) {
        hIndex--;
        input.value = history[hIndex];
      } else {
        hIndex = -1;
        input.value = "";
      }
      moveCaretToEnd(input);
    } else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
      // ^C
      printCmd("^C");
      input.value = "";
    }
  });

  // keep fake cursor visually synced at the end of input text
  const cursor = document.querySelector(".cursor");
  function syncCursor(){
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "pre";
    span.textContent = input.value;
    document.body.appendChild(span);
    const rect = span.getBoundingClientRect();
    const left = rect.width;
    span.remove();
    cursor.style.transform = `translateX(${left}px)`;
  }
  input.addEventListener("input", syncCursor);
  input.addEventListener("focus", syncCursor);
  window.addEventListener("resize", syncCursor);

  function moveCaretToEnd(el){
    const len = el.value.length;
    el.setSelectionRange(len, len);
    syncCursor();
  }

  // initial prompt text
  ps1.textContent = `${USER}@${HOST}:${cwd}$`;
})();
