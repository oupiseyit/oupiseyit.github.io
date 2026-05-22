(function () {
  var themes = [
    { file: 'direction-1-terminal.html', num: '01', name: 'Terminal',  tag: 'Phosphor Green',   color: '#33ff5a' },
    { file: 'direction-2-literary.html', num: '02', name: 'Literary',  tag: 'Warm Editorial',   color: '#9b1d1d' },
    { file: 'direction-3-swiss.html',    num: '03', name: 'Swiss',     tag: 'Bauhaus Bold',     color: '#e8231a' },
    { file: 'direction-4-aurora.html',   num: '04', name: 'Aurora',    tag: 'Glass & Gradient', color: '#8b5cf6' },
    { file: 'direction-5-original.html', num: '05', name: 'Original',  tag: 'Dark Editorial',   color: '#4f8cff' },
  ];

  var current = location.pathname.split('/').pop();
  var cur = themes.find(function (t) { return t.file === current; });

  /* ── INJECT STYLES into <head> ── */
  var style = document.createElement('style');
  style.textContent = '\
#ts-root{all:initial;position:fixed;bottom:24px;right:24px;z-index:2147483647;font-family:"JetBrains Mono","Courier New",monospace;font-size:12px;display:block;pointer-events:all;}\
#ts-toggle{\
  display:flex;align-items:center;gap:8px;padding:10px 18px;\
  background:rgba(12,12,12,0.92);color:rgba(255,255,255,0.75);\
  border:1px solid rgba(255,255,255,0.22);\
  border-radius:100px;cursor:pointer;\
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);\
  letter-spacing:0.08em;transition:all 0.2s;\
  box-shadow:0 2px 20px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.06);\
  font-family:inherit;font-size:12px;\
  user-select:none;white-space:nowrap;\
}\
#ts-toggle:hover{color:#fff;border-color:rgba(255,255,255,0.4);background:rgba(20,20,20,0.96);}\
#ts-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}\
#ts-panel{\
  position:absolute;bottom:calc(100% + 10px);right:0;\
  background:rgba(10,10,10,0.96);\
  border:1px solid rgba(255,255,255,0.14);\
  border-radius:14px;overflow:hidden;\
  backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);\
  min-width:220px;\
  opacity:0;transform:translateY(10px) scale(0.96);\
  transform-origin:bottom right;\
  transition:opacity 0.18s ease,transform 0.18s ease;\
  pointer-events:none;\
  box-shadow:0 8px 40px rgba(0,0,0,0.8),0 0 0 1px rgba(255,255,255,0.06);\
}\
#ts-panel.ts-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}\
#ts-panel a{\
  display:flex;align-items:center;gap:10px;padding:12px 16px;\
  color:rgba(255,255,255,0.5);text-decoration:none;\
  letter-spacing:0.05em;transition:background 0.15s,color 0.15s;\
  border-bottom:1px solid rgba(255,255,255,0.06);\
  font-family:inherit;font-size:12px;\
}\
#ts-panel a:last-child{border-bottom:none;}\
#ts-panel a:hover{background:rgba(255,255,255,0.07);color:#fff;}\
#ts-panel a.ts-active{color:#fff;background:rgba(255,255,255,0.05);}\
.ts-swatch{width:8px;height:8px;border-radius:50%;flex-shrink:0;}\
.ts-info{display:flex;flex-direction:column;gap:2px;flex:1;}\
.ts-name{font-size:12px;line-height:1;}\
.ts-tag{font-size:10px;color:rgba(255,255,255,0.28);letter-spacing:0.1em;}\
.ts-num{font-size:10px;color:rgba(255,255,255,0.2);letter-spacing:0.1em;}\
#ts-panel a.ts-active .ts-tag{color:rgba(255,255,255,0.45);}\
#ts-arrow{font-size:11px;opacity:0.45;transition:transform 0.18s;margin-left:2px;}\
@keyframes ts-fade-out{to{opacity:0;}}\
body.ts-leaving{animation:ts-fade-out 0.28s ease both!important;pointer-events:none!important;}';
  document.head.appendChild(style);

  /* ── BUILD DOM ── */
  var root = document.createElement('div');
  root.id = 'ts-root';

  /* panel */
  var panel = document.createElement('div');
  panel.id = 'ts-panel';

  themes.forEach(function (t) {
    var a = document.createElement('a');
    a.href = t.file;
    if (t.file === current) a.classList.add('ts-active');

    var swatch = document.createElement('span');
    swatch.className = 'ts-swatch';
    swatch.style.cssText = 'background:' + t.color + ';box-shadow:0 0 6px ' + t.color + ';';

    var info = document.createElement('span');
    info.className = 'ts-info';
    info.innerHTML =
      '<span class="ts-name">' + t.name + '</span>' +
      '<span class="ts-tag">' + t.tag + '</span>';

    var num = document.createElement('span');
    num.className = 'ts-num';
    num.textContent = t.num;

    a.appendChild(swatch);
    a.appendChild(info);
    a.appendChild(num);

    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (t.file === current) { closePanel(); return; }
      document.body.classList.add('ts-leaving');
      setTimeout(function () { window.location.href = t.file; }, 290);
    });

    panel.appendChild(a);
  });

  /* toggle button */
  var toggle = document.createElement('button');
  toggle.id = 'ts-toggle';
  toggle.setAttribute('aria-label', 'Switch theme');

  var dot = document.createElement('span');
  dot.id = 'ts-dot';
  dot.style.cssText = 'background:' + (cur ? cur.color : '#fff') + ';' +
                      'box-shadow:0 0 6px ' + (cur ? cur.color : '#fff') + ';';

  var lbl = document.createElement('span');
  lbl.textContent = 'Themes';

  var arrow = document.createElement('span');
  arrow.id = 'ts-arrow';
  arrow.textContent = '⌃';

  toggle.appendChild(dot);
  toggle.appendChild(lbl);
  toggle.appendChild(arrow);

  root.appendChild(panel);
  root.appendChild(toggle);

  /* ── APPEND TO <html> to escape body stacking contexts ── */
  document.documentElement.appendChild(root);

  /* ── TOGGLE LOGIC ── */
  var isOpen = false;

  function openPanel()  {
    isOpen = true;
    panel.classList.add('ts-open');
    arrow.style.transform = 'rotate(180deg)';
  }
  function closePanel() {
    isOpen = false;
    panel.classList.remove('ts-open');
    arrow.style.transform = '';
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    isOpen ? closePanel() : openPanel();
  });

  document.addEventListener('click', function (e) {
    if (!root.contains(e.target)) closePanel();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
  });
})();
