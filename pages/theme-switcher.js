(function () {
  var themes = [
    { file: 'direction-1-terminal.html', num: '01', name: 'Terminal',  tag: 'Phosphor Green',  color: '#33ff5a' },
    { file: 'direction-2-literary.html', num: '02', name: 'Literary',  tag: 'Warm Editorial',  color: '#9b1d1d' },
    { file: 'direction-3-swiss.html',    num: '03', name: 'Swiss',     tag: 'Bauhaus Bold',    color: '#e8231a' },
    { file: 'direction-4-aurora.html',   num: '04', name: 'Aurora',    tag: 'Glass & Gradient', color: '#8b5cf6' },
    { file: 'direction-5-original.html', num: '05', name: 'Original',  tag: 'Dark Editorial',  color: '#4f8cff' },
  ];

  var current = location.pathname.split('/').pop();

  /* ── STYLES ── */
  var style = document.createElement('style');
  style.textContent = [
    '#ts-root{position:fixed;bottom:24px;right:24px;z-index:99999;font-family:"JetBrains Mono","Courier New",monospace;font-size:12px;}',
    '#ts-toggle{display:flex;align-items:center;gap:8px;padding:10px 16px;background:rgba(10,10,10,0.82);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.14);border-radius:100px;cursor:pointer;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);letter-spacing:0.08em;transition:all 0.2s;user-select:none;}',
    '#ts-toggle:hover{color:#fff;border-color:rgba(255,255,255,0.3);background:rgba(10,10,10,0.92);}',
    '#ts-dot{width:7px;height:7px;border-radius:50%;background:var(--ts-c,#fff);box-shadow:0 0 6px var(--ts-c,#fff);}',
    '#ts-panel{position:absolute;bottom:calc(100% + 10px);right:0;background:rgba(8,8,8,0.94);border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);min-width:210px;opacity:0;transform:translateY(8px) scale(0.97);transform-origin:bottom right;transition:opacity 0.18s ease,transform 0.18s ease;pointer-events:none;}',
    '#ts-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}',
    '#ts-panel a{display:flex;align-items:center;gap:12px;padding:11px 16px;color:rgba(255,255,255,0.55);text-decoration:none;letter-spacing:0.06em;transition:background 0.15s,color 0.15s;border-bottom:1px solid rgba(255,255,255,0.05);}',
    '#ts-panel a:last-child{border-bottom:none;}',
    '#ts-panel a:hover{background:rgba(255,255,255,0.05);color:#fff;}',
    '#ts-panel a.active{color:#fff;background:rgba(255,255,255,0.06);}',
    '.ts-swatch{width:8px;height:8px;border-radius:50%;flex-shrink:0;}',
    '.ts-info{display:flex;flex-direction:column;gap:2px;}',
    '.ts-name{font-size:12px;line-height:1;}',
    '.ts-tag{font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:0.1em;}',
    '.ts-num{margin-left:auto;font-size:10px;color:rgba(255,255,255,0.2);letter-spacing:0.1em;}',
    '#ts-panel a.active .ts-tag{color:rgba(255,255,255,0.5);}',
    '#ts-panel a.active .ts-num{color:rgba(255,255,255,0.4);}',
    '@keyframes ts-fade-out{to{opacity:0;}}',
    'body.ts-leaving{animation:ts-fade-out 0.28s ease both;pointer-events:none;}',
  ].join('');
  document.head.appendChild(style);

  /* ── DOM ── */
  var root = document.createElement('div');
  root.id = 'ts-root';

  var toggle = document.createElement('button');
  toggle.id = 'ts-toggle';

  var dot = document.createElement('span');
  dot.id = 'ts-dot';

  var cur = themes.find(function (t) { return t.file === current; });
  toggle.style.setProperty('--ts-c', cur ? cur.color : '#fff');
  dot.style.background = cur ? cur.color : 'rgba(255,255,255,0.4)';
  dot.style.boxShadow   = cur ? ('0 0 6px ' + cur.color) : 'none';

  var label = document.createElement('span');
  label.textContent = 'Themes';

  var arrow = document.createElement('span');
  arrow.textContent = '⌃';
  arrow.style.cssText = 'font-size:10px;opacity:0.4;transition:transform 0.18s;';

  toggle.appendChild(dot);
  toggle.appendChild(label);
  toggle.appendChild(arrow);

  var panel = document.createElement('div');
  panel.id = 'ts-panel';

  themes.forEach(function (t) {
    var a = document.createElement('a');
    a.href = t.file;
    if (t.file === current) a.classList.add('active');

    var swatch = document.createElement('span');
    swatch.className = 'ts-swatch';
    swatch.style.background = t.color;
    swatch.style.boxShadow = '0 0 5px ' + t.color;

    var info = document.createElement('span');
    info.className = 'ts-info';
    info.innerHTML = '<span class="ts-name">' + t.name + '</span><span class="ts-tag">' + t.tag + '</span>';

    var num = document.createElement('span');
    num.className = 'ts-num';
    num.textContent = t.num;

    a.appendChild(swatch);
    a.appendChild(info);
    a.appendChild(num);

    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (t.file === current) { close(); return; }
      document.body.classList.add('ts-leaving');
      setTimeout(function () { window.location.href = t.file; }, 290);
    });

    panel.appendChild(a);
  });

  root.appendChild(panel);
  root.appendChild(toggle);
  document.body.appendChild(root);

  /* ── TOGGLE LOGIC ── */
  var open = false;

  function openPanel()  { open = true;  panel.classList.add('open');    arrow.style.transform = 'rotate(180deg)'; }
  function close()      { open = false; panel.classList.remove('open'); arrow.style.transform = ''; }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    open ? close() : openPanel();
  });

  document.addEventListener('click', function (e) {
    if (!root.contains(e.target)) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
