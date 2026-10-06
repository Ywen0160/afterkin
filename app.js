(() => {
  'use strict';
  const {
    openModal,
    closeModal
  } = AFTERKIN_UI;

  const {
    items,
    companions
  } = AFTERKIN;
  const app = document.querySelector('#app');
  let film = null;
  let owned = AFTERKIN_STORAGE.load();
  let pendingIntroductions = AFTERKIN_STORAGE.loadIntroductions().filter(id => owned.includes(id));

  const $ = s => document.querySelector(s),
    escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    } [c])),
    imageIcon =
    '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="6" width="32" height="28" rx="1"/><circle cx="27" cy="14" r="3"/><path d="M5 29l9-10 9 10 5-5 7 8"/></svg>';

  function updateArchiveCount() {
    $('#count').textContent = owned.length;
  }

  function saveArchive() {
    const saved = AFTERKIN_STORAGE.save(owned);
    updateArchiveCount();
    if (!saved) toast('Saved for this visit. Browser storage is unavailable.');
  }
  let toastTimer;

  function toast(message) {
    clearTimeout(toastTimer);
    const notice = $('#toast');
    notice.textContent = message;
    notice.classList.add('show');
    toastTimer = setTimeout(() => notice.classList.remove('show'), 3000);
  }

  function blank(label = 'Product photography to follow') {
    return `<div class="photo-blank">${imageIcon}<span>${escapeHTML(label)}</span>
</div>`
  }

  function productCard(item) {
    return `<a class="item-card" href="#item/${item.id}">${owned.includes(item.id)?'<span class="archive-status">COLLECTED</span>':''}<div class="paper-card"><img class="wordmark" src="logo.svg" alt="AFTERKIN">${item.photos[0]?`<img class="card-product-image" src="${escapeHTML(item.photos[0])}" alt="${escapeHTML(item.name)}">`:blank()}<span class="card-foot">A FIND WORTH KEEPING</span>
</div>
<div class="item-meta">
<p>ARCHIVE No.${item.number}</p>
<h3>${escapeHTML(item.name)}</h3>
<p>${escapeHTML(item.productType)} · ${escapeHTML(companions[item.companion].style)}</p>
</div></a>`
  }

  function renderHome() {
    const families = Object.entries(companions).map(([n, c], i) => [String(i + 1).padStart(2, '0'), n +
      ' / ' + c.style, c.styleDescription, c.examples
    ]);
    const personalities = [
      ['MOSS', 'The quiet keeper',
        'Quiet and a little shy, MOSS takes time to feel at home. Small details and close friendships mean the most.'
      ],
      ['RUST', 'The cheeky explorer',
        'Mischievous and full of curiosity, RUST rarely leaves a mystery alone. A wrong turn is often the best part of the day.'
      ],
      ['INK', 'The curious collector',
        'Lively and quick on those little paws, INK is easily distracted. Every small discovery is an invitation to play.'
      ],
      ['PIP', 'The gentle mender',
        'Gentle and attentive, PIP notices when a friend needs a little warmth. Small, thoughtful gestures are how PIP shows affection.'
      ]
    ];
    app.innerHTML = `<div class="wrap home-page">
<section class="hero">
<div>
<p class="eyebrow">AFTERKIN / Vintage & companionship</p>
<h1>A little past.<br>A new beginning.</h1>
<p>Vintage clothing, four companions and stories to collect.</p>
<div class="home-actions"><a class="btn" href="#collection">Find your next piece <span>↗</span></a><a class="text-link" href="#memories">Explore the memory cards ↗</a>
</div>
</div>
<div class="hero-art" aria-label="The four AFTERKIN companions"><img class="family-portrait" src="AFTERKIN-close-family.png" alt="MOSS, RUST, INK and PIP leaning close together">
</div>
</section>
<section class="brand-intro home-section" aria-labelledby="brand-title">
<div>
<p class="eyebrow">01 / Our story</p>
<h2 id="brand-title">Old finds.<br>New connections.</h2>
</div>
<div class="brand-copy">
<p class="brand-lead">Choose a vintage piece. Unlock its companion’s story for the season.</p>
<p>Softened denim, worn leather, a careful repair. We choose pieces for the details that make them worth wearing again.</p>
<p>“After” is a second life. “Kin” is the company we keep.</p>
<p class="brand-signoff">Wear the piece. Keep the story.</p>
</div>
</section>
<section class="home-section" aria-labelledby="families-title">
<div class="section-top">
<div>
<p class="eyebrow">02 / Find your style</p>
<h2 id="families-title">Find what feels<br>like you.</h2>
</div>
<p>Four ways to look at a piece, across clothing, bags and accessories.</p>
</div>
<div class="style-families">${families.map(([n,title,body,examples],i)=>`<article class="style-family family-${i}"><span class="family-number">${n}</span>
<h3>${title}</h3>
<p>${body}</p><span class="family-examples">${examples}</span>
</article>`).join('')}</div>
<div class="style-explainer">
<h3>A guide to your taste.</h3>
<p>Each piece is paired with the companion that best reflects its style. Classic denim may suit MOSS; a pocket-heavy design may suit RUST.</p>
<p>Mix them freely. These describe the clothes, not your personality or gender.</p>
</div>
</section>
<section class="home-section" aria-labelledby="journey-title">
<div class="section-top">
<div>
<p class="eyebrow">03 / From a find to a friendship</p>
<h2 id="journey-title">How it works.</h2>
</div>
<p>A piece to wear. A story to keep.</p>
</div>
<ol class="brand-journey">
<li><span class="eyebrow">01 / Purchase</span>
<h3>Find your piece.</h3>
<p>Explore the details, then purchase the piece you love.</p>
</li>
<li><span class="eyebrow">02 / Meet</span>
<h3>A little hello.</h3>
<p>Your companion makes an entrance. Confirm when you’re ready for the story.</p>
</li>
<li><span class="eyebrow">03 / Unlock</span>
<h3>Watch your story.</h3>
<p>Settle into your companion’s story for the season.</p>
</li>
<li><span class="eyebrow">04 / Keep</span>
<h3>Keep it close.</h3>
<p>Your Memory card is saved automatically. Return to your collection whenever you like.</p>
</li>
</ol>
</section>
<section class="home-section card-intro">
<div class="intro-card-art"><img src="MOSS-locked.svg?v=story-covers-v12" alt="MOSS — The button and the photograph, a dedicated story cover" loading="lazy" width="630" height="880">
</div>
<div>
<p class="eyebrow">A collectible connection</p>
<h2>A story for<br>this season.</h2>
<p>Each Memory card has its own cover and a wordless film, unlocked when you buy a matching piece.</p>
<p>New seasons will bring new chapters. The stories you collect stay in your archive.</p>
<p>This prototype includes the opening collection. Later seasons and interactive chapters are in development.</p><a class="text-link" href="#memories">Explore the memory cards ↗</a>
</div>
</section>
<section class="companions-intro home-section" aria-labelledby="companions-title">
<div class="section-top">
<div>
<p class="eyebrow">04 / The AFTERKIN companions</p>
<h2 id="companions-title">Meet your<br>companions.</h2>
</div>
<p>Quiet, mischievous, playful and kind. Meet the AFTERKIN family.</p>
</div>
<div class="personality-grid">${personalities.map(([n,title,body])=>`<article><a class="character-portrait" href="#studio/${n}" aria-label="Meet ${n}"><img src="${n}.svg" alt="${n} — ${title}" loading="lazy" width="320" height="360"></a><span class="companion-name" style="--companion-tone:${companions[n].color}">${n}</span>
<h3>${title}</h3>
<p class="character-personality">${body}</p>
</article>`).join('')}</div>
</section>
<section class="collection">
<div class="section-top">
<div>
<p class="eyebrow">The starting collection</p>
<h2>Four finds to start with.</h2>
</div>
<p>Explore the views. Find your favourite detail.</p>
</div>
<div class="grid">${items.map(productCard).join('')}</div>
</section>
</div>
<section class="principle home-closing">
<p class="eyebrow">The AFTERKIN way</p>
<h2>Some things deserve<br>another chapter.</h2>
<p>Find something you’ll wear. Give it a place in your everyday life.</p><a class="btn secondary" href="#collection">Explore the collection <span>↗</span></a>
</section>`;
  }

  function renderCollection() {
    const types = ['All', ...new Set(items.map(i => i.productType))];
    app.innerHTML = `<div class="wrap bottom-space">
<div class="archive-head">
<p class="eyebrow">The collection</p>
<h1>The collection.</h1>
<p>Browse by product type. Find your style in the details.</p>
</div>
<div class="type-filters" aria-label="Filter by product type">${types.map(t=>`<button class="chip ${t==='All'?'active':''}" data-type="${t}" aria-pressed="${t==='All'}">${t}</button>`).join('')}</div>
<div class="grid" id="collection-grid">${items.map(productCard).join('')}</div>
</div>`;
    document.querySelectorAll('[data-type]').forEach(button => button.onclick = () => {
      document.querySelectorAll('[data-type]').forEach(b => {
        b.classList.toggle('active', b === button);
        b.setAttribute('aria-pressed', String(b === button))
      });
      $('#collection-grid').innerHTML = items.filter(i => button.dataset.type === 'All' || i
        .productType === button.dataset.type).map(productCard).join('')
    })
  }

  function renderProduct(item) {
    const c = companions[item.companion],
      has = owned.includes(item.id),
      views = item.views,
      byKey = Object.fromEntries(views.map(v => [v.key, v]));
    let current = 'front';
    const fields = [
      ['Brand / visible marking', item.brand],
      ['Era / Year', item.era],
      ['Material / appearance', item.material],
      ['Condition', item.condition],
      ['Measurements', item.measurements],
      ['Provenance', item.provenance]
    ];
    const verticalHint = item.companion === 'INK' ? 'Drag up for the base · down for the interior' : item
      .companion === 'MOSS' ? 'Drag up for the clasp · down to return to the front' :
      'Drag up for lower details · down for upper details';
    app.innerHTML = `<div class="wrap">
<div class="breadcrumb"><a href="#collection">The collection</a> / Archive No.${item.number}</div>
<section class="product">
<div class="product-gallery">
<div class="viewer-photo product-angle-viewer" id="photos" tabindex="0" role="group" aria-label="Product angles. Drag horizontally or vertically, or use arrow keys." aria-describedby="angle-help"><span class="eyebrow view-count" id="angle-count"></span>
<div id="photo-slot">
</div><span class="view-label" id="view-label" aria-live="polite"></span>
<button class="zoom-open" id="zoom-view" aria-label="Zoom current product image">＋ Zoom</button>
</div>
<div class="angle-directions">
<button id="look-left" aria-label="View left side">← Left side</button>
<button id="look-up">↑ ${escapeHTML(byKey[item.up].label)}</button>
<button id="look-down">↓ ${escapeHTML(byKey[item.down].label)}</button>
<button id="look-right" aria-label="View right side">Right side →</button>
</div>
<p class="hint" id="angle-help">Drag right to see the left side · drag left to see the right side<br>${verticalHint}</p>
<div class="angle-thumbnails" aria-label="Available product views">${views.map(v=>`<button data-view="${v.key}" aria-pressed="false"><img src="${v.src}" alt="" loading="lazy"><span>${escapeHTML(v.label)}${v.detail?' <b>Zoom</b>':''}</span>
</button>`).join('')}</div>
<p class="image-note">${escapeHTML(item.wear)}</p>
</div>
<div class="product-details">
<p class="eyebrow">Archive No.${item.number}</p>
<h1>${escapeHTML(item.name)}</h1>
<p class="sub">${escapeHTML(item.category)}</p>
<p class="product-description">${escapeHTML(item.description)}</p>
<ul class="product-features">${item.features.map(f=>`<li>${escapeHTML(f)}</li>`).join('')}</ul>
<div class="identity-pill"><span class="identity-mark">${item.companion[0]}</span>
<div><strong>${item.companion} — ${c.role.toUpperCase()}</strong>
<p>${escapeHTML(c.style)} · ${escapeHTML(c.keywords)}</p>
</div>
</div>
<section class="style-reason">
<h3>Why this piece belongs with ${item.companion}</h3>
<p>${escapeHTML(item.styleReason)}</p>
<div class="style-tags">${item.styleTags.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div>
<p><strong>Wear it your way.</strong> ${escapeHTML(item.stylingTip)}</p>
</section>
<div class="data-table">${fields.map(([k,v])=>`<div><span>${k}</span>${escapeHTML(v)}</div>`).join('')}</div>
<div class="product-memory-teaser"><img src="${item.companion}-${has?'unlocked':'locked'}.svg?v=story-covers-v12" alt="${item.companion} first Memory card — ${has?'unlocked':'locked'}" width="630" height="880">
<div>
<p class="eyebrow">${has?'Memory unlocked':'A memory to discover'}</p>
<h3>${has?'Your opening chapter is here.':'Your seasonal Memory card.'}</h3>
<p>${has?'Your card is saved. Open it to watch your companion’s arrival and story.':'This piece unlocks the companion’s opening story and arrival film.'}</p>${has?`<a class="text-link" href="#fragment/${item.id}">Open memory card ↗</a>`:''}</div>
</div>${has?`<a class="btn purchase" href="#fragment/${item.id}">Your unlocked card <span>↗</span></a>`:`<button class="btn purchase" id="purchase">Collect this piece <span>↗</span>
</button>
<p class="disclaimer">Prototype purchase · no payment will be taken.</p>`}<div class="panel">
<h3>About this piece</h3>
<p>The story is fictional. This piece’s previous-owner history has not been supplied.</p><a class="text-link" href="#memories">Explore the memory collection ↗</a>
</div>
</div>
</section>
</div>`;
    views.forEach(v => {
      const im = new Image();
      im.src = v.src
    });

    function show(key) {
      if (!byKey[key]) return;
      current = key;
      const v = byKey[key];
      $('#photo-slot').innerHTML =
        `<img draggable="false" src="${v.src}" alt="${escapeHTML(item.name+' — '+v.label)}">`;
      $('#view-label').textContent = v.label;
      $('#angle-count').textContent =
        `${String(views.indexOf(v)+1).padStart(2,'0')} / ${String(views.length).padStart(2,'0')} · ${v.detail?'DETAIL':'VIEW'}`;
      $('#zoom-view').textContent = v.detail ? '＋ Zoom detail' : '＋ Zoom';
      document.querySelectorAll('[data-view]').forEach(b => {
        const active = b.dataset.view === key;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active))
      });
    }

    function horizontal(delta) {
      const ring = item.horizontal;
      let i = ring.indexOf(current);
      if (i < 0) i = ring.indexOf('front');
      const target = i + delta;
      show(ring.length === 4 ? ring[(target + ring.length) % ring.length] : ring[Math.max(0, Math.min(ring
        .length - 1, target))]);
    }
    document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => show(b.dataset.view));
    $('#look-left').onclick = () => show('left');
    $('#look-right').onclick = () => show('right');
    $('#look-up').onclick = () => show(item.up);
    $('#look-down').onclick = () => show(item.down);
    const viewer = $('#photos');
    let drag = null;
    viewer.onpointerdown = e => {
      if (e.button !== 0 || e.target.closest('button')) return;
      drag = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY
      };
      viewer.setPointerCapture(e.pointerId);
      viewer.classList.add('dragging');
      viewer.focus({
        preventScroll: true
      })
    };
    viewer.onpointermove = e => {
      if (!drag || drag.id !== e.pointerId) return;
      const dx = e.clientX - drag.x,
        dy = e.clientY - drag.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 65) return;
      if (Math.abs(dx) > Math.abs(dy)) horizontal(dx > 0 ? 1 : -1);
      else show(dy < 0 ? item.up : item.down);
      drag.x = e.clientX;
      drag.y = e.clientY;
    };

    function end(e) {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      viewer.classList.remove('dragging');
      if (viewer.hasPointerCapture(e.pointerId)) viewer.releasePointerCapture(e.pointerId)
    }
    viewer.onpointerup = end;
    viewer.onpointercancel = end;
    viewer.onlostpointercapture = () => {
      drag = null;
      viewer.classList.remove('dragging')
    };
    viewer.ondragstart = e => e.preventDefault();
    viewer.onkeydown = e => {
      if (e.target !== viewer) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') show(item.up);
        else if (e.key === 'ArrowDown') show(item.down);
        else horizontal(e.key === 'ArrowRight' ? 1 : -1)
      }
    };
    $('#zoom-view').onclick = () => {
      const view = byKey[current];
      openModal(`<section class="zoom-dialog" role="dialog" aria-modal="true" aria-labelledby="zoom-title">
  <div class="zoom-toolbar">
<h2 id="zoom-title">${escapeHTML(view.label)}</h2>
   <label>Zoom <input id="zoom-level" type="range" min="100" max="300" value="100" step="25"></label>
   <output id="zoom-percent">100%</output>
<button class="close" aria-label="Close zoom">×</button>
  </div>
  <div class="zoom-canvas" tabindex="0" aria-label="Enlarged image. Scroll to explore at higher zoom.">
   <img id="zoom-image" src="${view.src}" alt="${escapeHTML(item.name + ' — ' + view.label)}">
  </div>
<p>Adjust the zoom, then scroll to see the details.</p>
 </section>`);
      $('#zoom-level').oninput = event => {
        const percent = event.target.value + '%';
        $('#zoom-image').style.width = percent;
        $('#zoom-percent').textContent = percent;
      };
    };
    show('front');
    if (!has) $('#purchase').onclick = () => { location.hash = 'checkout/' + item.id; };
  }

  function renderCheckout(item) {
    const has = owned.includes(item.id);
    app.innerHTML = `<section class="wrap checkout-page">
<a class="text-link" href="#item/${item.id}">← Back to your piece</a>
<div class="checkout-layout">
<div class="checkout-image"><img src="${escapeHTML(item.photos[0])}" alt="${escapeHTML(item.name)}"></div>
<div class="checkout-summary">
<p class="eyebrow">01 / Purchase</p>
<h1>${has ? 'Already yours.' : 'Make it yours.'}</h1>
<h2>${escapeHTML(item.name)}</h2>
<div class="row"><span>Archive number</span><span>No.${item.number}</span></div>
<div class="row"><span>Your companion</span><span>${item.companion}</span></div>
<div class="row"><span>Demo order</span><span>No charge</span></div>
<p>${has ? 'This piece and its Memory card are already in your archive.' : 'After purchase, your companion will greet you. Confirm to open the seasonal story.'}</p>
${has ? `<a class="btn" href="#${pendingIntroductions.includes(item.id) ? 'reveal' : 'fragment'}/${item.id}">Continue to your companion <span>↗</span></a>` : '<button class="btn" id="confirm-purchase">Complete demo purchase <span>↗</span></button>'}
<p class="disclaimer">Portfolio prototype · no payment is taken.</p>
</div></div></section>`;
    if (has) return;
    $('#confirm-purchase').onclick = () => {
      $('#confirm-purchase').disabled = true;
      if (!owned.includes(item.id)) owned.push(item.id);
      if (!pendingIntroductions.includes(item.id)) pendingIntroductions.push(item.id);
      AFTERKIN_STORAGE.saveIntroductions(pendingIntroductions);
      saveArchive();
      location.hash = 'reveal/' + item.id;
    };
  }

  function playerMarkup(n, kind) {
    if (!items.some(i => i.companion === n && owned.includes(i.id))) return '';
    return `<div class="motion-player ${kind==='entrance'?'motion-square':''}"><video class="companion-video" id="companion-film" controls playsinline muted preload="metadata" poster="${n}-${kind}${kind==='story'?'-v9':'-smooth-v10'}.jpg" aria-label="${escapeHTML(n)} ${kind==='entrance'?'arrival performance':'animated story'}"><source src="${n}-${kind}${kind==='story'?'-v9':'-smooth-v10'}.mp4?v=motion-v10-20261003" type="video/mp4"></video>
<div class="motion-fallback" hidden><img src="${n==='AFTERKIN'?'logo':n}.svg" alt="${n}">
<p>The film could not load. Please try again.</p>
</div>
</div>
<div class="motion-controls">
<button class="btn small secondary" id="motion-play">Play ${kind==='entrance'?'arrival':'story'} ▷</button>
<button class="text-link" id="motion-replay">Replay ↻</button><span id="motion-status" role="status">${kind==='entrance'?'A little hello.':'A story to keep.'}</span>
</div>`;
  }

  function mountPlayer(autoplay = false) {
    const video = $('#companion-film'),
      play = $('#motion-play'),
      replay = $('#motion-replay'),
      status = $('#motion-status');
    if (!video) return;
    const controller = new AbortController(),
      options = {
        signal: controller.signal
      };
    let disposed = false;
    const initial = play.textContent;

    function start(reset = false) {
      if (disposed) return;
      if (reset) video.currentTime = 0;
      const p = video.play();
      if (p) p.catch(() => {
        if (!disposed) {
          play.textContent = initial;
          status.textContent = 'Press play to begin.'
        }
      })
    }
    play.onclick = () => video.paused ? start() : video.pause();
    replay.onclick = () => start(true);
    video.addEventListener('play', () => {
      play.textContent = 'Pause Ⅱ';
      status.textContent = 'Playing';
    }, {
      ...options
    });
    video.addEventListener('pause', () => {
      play.textContent = video.ended ? 'Play again ▷' : initial;
      if (!video.ended) status.textContent = 'Paused';
    }, options);
    video.addEventListener('ended', () => {
      play.textContent = 'Play again ▷';
      status.textContent = 'A moment worth keeping.'
    }, options);
    video.addEventListener('waiting', () => status.textContent = 'Loading the film…', options);
    video.addEventListener('playing', () => status.textContent = 'Playing', options);

    function fail() {
      video.hidden = true;
      $('.motion-fallback').hidden = false;
      play.hidden = true;
      replay.hidden = true;
      status.textContent = 'Film unavailable';
    }
    video.addEventListener('error', fail, options);
    video.querySelector('source')?.addEventListener('error', fail, options);
    film = {
      destroy() {
        disposed = true;
        controller.abort();
        video.pause();
        video.removeAttribute('src');
        video.querySelectorAll('source').forEach(s => s.removeAttribute('src'));
        video.load();
      }
    };
    if (autoplay && !matchMedia('(prefers-reduced-motion: reduce)').matches) start();
  }

  function renderArrival(item) {
    if (!owned.includes(item.id)) {
      renderMemoryCard(item);
      return
    }
    const c = companions[item.companion];
    const firstMeeting = pendingIntroductions.includes(item.id);
    app.innerHTML = `<section class="reveal" aria-labelledby="arrival-title">
<p class="eyebrow">02 / Meet your companion</p>
<h1 id="arrival-title">${firstMeeting ? 'Congratulations!' : 'A little hello.'}</h1>
<p class="arrival-message">${firstMeeting ? `You’ve unlocked ${item.companion}’s seasonal story.` : `${item.companion} is happy to see you again.`}</p>
<div class="arrival-film">${playerMarkup(item.companion,'entrance')}</div>
<p class="role">${item.companion} / ${c.role}</p>
<div class="actions"><button class="btn" id="confirm-companion">Confirm & watch the story <span>↗</span></button>
</div>
<p class="arrival-hint">The story begins when you’re ready.</p>
</section>`;
    mountPlayer(true);
    $('#confirm-companion').onclick = () => {
      pendingIntroductions = pendingIntroductions.filter(id => id !== item.id);
      AFTERKIN_STORAGE.saveIntroductions(pendingIntroductions);
      location.hash = 'memory/' + item.id;
    };
  }

  function renderArchive(showCards = false) {
    const kept = items.filter(x => owned.includes(x.id));
    if (showCards) {
      app.innerHTML = `<section class="wrap memory-collection saved-card-collection">
<div class="archive-head">
<p class="eyebrow">04 / Your card collection</p>
<h1>Stories to keep.</h1>
<p>Your Memory cards are saved here automatically. Open a card to revisit its story.</p>
<a class="text-link" href="#archive">View my collected pieces ↗</a>
</div>
${kept.length ? `<div class="memory-card-grid">${kept.map(memoryCard).join('')}</div>` : '<div class="empty"><p>Your first chapter is waiting.</p><a class="btn" href="#collection">Find your first piece <span>↗</span></a></div>'}
</section>`;
      return;
    }
    let counts = Object.keys(companions).map(n => [n, kept.filter(i => i.companion === n).length]);
    let max = Math.max(0, ...counts.map(x => x[1])),
      leaders = counts.filter(x => x[1] === max).map(x => x[0]);
    app.innerHTML = `<div class="wrap bottom-space">
<div class="archive-head">
<p class="eyebrow">My archive / ${kept.length} ${kept.length===1?'piece':'pieces'}</p>
<h1>A collection of you.</h1>
<p>Pieces you chose. Stories you keep.</p>
</div>${kept.length?`<div class="grid">${kept.map(productCard).join('')}</div>
<section class="archive-memories">
<div class="section-top">
<div>
<p class="eyebrow">Unlocked memories</p>
<h2>Little chapters to keep.</h2>
</div><a class="text-link" href="#memories">All memory cards ↗</a>
</div>
<div class="memory-card-grid">${kept.map(memoryCard).join('')}</div>
</section>
<section class="profile">
<div>
<p class="eyebrow">Your collection mix</p>
<h2>${kept.length===1?'Your first style clue.':leaders.length===1?companions[leaders[0]].style+' leads the way.':'A mix of your own.'}</h2>
<p>${kept.length===1?'One piece is a beginning, not a complete picture of your style.':leaders.length===1?'Your collected pieces lean towards '+escapeHTML(companions[leaders[0]].style.toLowerCase())+' styling. Keep exploring the other directions too.':'Your archive brings several style directions together. You do not need to choose just one.'}</p>
<p class="disclaimer">Based on the pieces in this archive and their main companions.</p>
</div>
<div>${counts.map(([n,v])=>`<div class="bar"><span>${n} / ${companions[n].style}</span><i><b style="width:${v/kept.length*100}%;background:${companions[n].color}"></b></i><span>${Math.round(v/kept.length*100)}%</span>
</div>`).join('')}</div>
</section>`:`<div class="empty">
<p>Your first chapter is waiting.</p><a class="btn" href="#collection">Find your first piece <span>↗</span></a>
</div>`}</div>`;
  }

  function renderStory(item) {
    if (!owned.includes(item.id)) {
      renderMemoryCard(item);
      return
    }
    const n = item.companion,
      c = companions[n];
    app.innerHTML = `<section class="wrap story-page">
<div class="story-top">
<div>
<p class="eyebrow">03 / Your seasonal story · ${n}</p>
<h1>${c.title}</h1>
</div></div>${playerMarkup(n,'story')}
<div class="story-collection-link">
<p>Your Memory card is saved automatically, ready to revisit.</p>
<a class="btn" href="#archive/cards">View my card collection <span>↗</span></a>
</div>
<div class="story-beats">${c.beats.map(([title,body],i)=>`<section>
<p class="eyebrow">0${i+1}</p>
<h3>${title}</h3>
<p>${body}</p>
</section>`).join('')}</div><a class="text-link" href="#memories">Browse memory cards ↗</a>
<div class="memory-note">
<p class="serif">“${c.quote}”</p><small>A companion tale about style and care. The actual item's history is kept separately.</small>
</div>
</section>`;
    mountPlayer(true);
  }

  function renderCompanion(n = 'MOSS') {
    if (!companions[n]) n = 'MOSS';
    const c = companions[n],
      item = items.find(i => i.companion === n);
    app.innerHTML = `<section class="wrap studio">
<p class="eyebrow">Meet the companions</p>
<h1>The companions.</h1>
<p class="section-description">Meet the family. Collect a matching piece to open their films.</p>
<div class="char-options" aria-label="Choose a companion">${Object.keys(companions).map(k=>`<a class="chip ${k===n?'active':''}" href="#studio/${k}" ${k===n?'aria-current="page"':''}>${k}</a>`).join('')}</div>
<div class="studio-main public-character">
<div class="studio-portrait"><img src="${n}.svg" alt="${n}, ${c.role}" width="500" height="620">
</div>
<aside>
<p class="eyebrow">${c.style}</p>
<h2>${n}</h2>
<p>${c.role} — ${c.traits}</p>
<h3>Your style companion</h3>
<p>${c.keywords}</p>
<p>${c.styleDescription}</p>
<p>${c.examples}</p><a class="btn secondary" href="#item/${item.id}">Discover the matching piece <span>↗</span></a>
</aside>
</div>
<section class="chapter-section">
<div class="section-top">
<div>
<p class="eyebrow">${n} / Memory cards</p>
<h2>Your story collection.</h2>
</div>
<p>A matching purchase opens this season’s story. More chapters and interactions are in development.</p>
</div>
<div class="memory-card-grid three">${memoryCard(item)}${futureCard('growth')}${futureCard('interaction')}</div>
</section>
</section>`;
  }

  function memoryCard(item) {
    const n = item.companion,
      c = companions[n],
      has = owned.includes(item.id);
    return `<article class="memory-card ${has?'is-unlocked':'is-locked'}"><a class="memory-art" href="#fragment/${item.id}" aria-label="${has?'Open':'View locked'} ${n} Memory card"><img src="${n}-${has?'unlocked':'locked'}.svg?v=story-covers-v12" alt="${n} — ${escapeHTML(c.title)} / ${has?'Unlocked':'Locked'}" loading="lazy" width="630" height="880"></a>
<div class="memory-card-copy">
<p class="eyebrow">${n} / ${has?'Unlocked':'Locked'}</p>
<h3>${c.title}</h3>
<p>${has?'Saved in your archive.':'Included with the matching piece.'}</p><a class="text-link" href="#fragment/${item.id}">${has?'Open card':'View card'} ↗</a>
</div>
</article>`;
  }

  function futureCard(kind) {
    const title = kind === 'growth' ? 'Growing together' : 'Little interactions';
    return `<article class="memory-card is-future" aria-label="${title} — in development">
<div class="memory-art"><img src="future-${kind}.svg?v=story-covers-v12" alt="${title} / In development" loading="lazy" width="630" height="880">
</div>
<div class="memory-card-copy">
<p class="eyebrow">In development</p>
<h3>${title}</h3>
<p>${kind==='growth'?'New fragments as your connection grows.':'Moments to respond to, share and play together.'}</p><span class="development-label">Concept only · not yet available</span>
</div>
</article>`;
  }

  function renderMemoryCard(item) {
    const n = item.companion,
      c = companions[n],
      has = owned.includes(item.id);
    app.innerHTML = `<section class="wrap fragment-page"><a class="text-link" href="#memories">← Memory collection</a>
<div class="fragment-layout">
<div class="fragment-art"><img src="${n}-${has?'unlocked':'locked'}.svg?v=story-covers-v12" alt="${n} first Memory card — ${has?'unlocked':'locked'}" width="630" height="880">
</div>
<div class="fragment-copy">
<p class="eyebrow">${n} / First memory / ${has?'Unlocked':'Locked'}</p>
<h1>${has?'Saved to<br>your archive.':'Meet them<br>in the story.'}</h1>
<p class="serif">${c.title}</p>
<p>${has?'Your Memory card is unlocked. Watch the story or meet your companion below.':'Collect the matching piece to unlock this story and the companion’s arrival.'}</p>${has?`<div class="fragment-actions"><a class="btn" href="#memory/${item.id}">Watch your memory <span>▷</span></a><a class="btn secondary" href="#reveal/${item.id}">Meet ${n} <span>▷</span></a><a class="text-link" href="#archive">Saved in my archive ↗</a>
</div>`:`<a class="btn" href="#item/${item.id}">Discover the matching piece <span>↗</span></a>`}<p class="fragment-item">${has ? 'Collected with' : 'Unlock with'} <a class="text-link" href="#item/${item.id}">${escapeHTML(item.name)}</a>
</p>
</div>
</div>
<div class="future-note">
<p class="eyebrow">A possible next chapter</p>
<h2>Still to come.</h2>
<p>Later chapters and interactive moments are in development. They are not included in this demo.</p>
<div class="future-inline"><span>Upgraded fragments — in development</span><span>Character interactions — in development</span>
</div>
</div>
</section>`;
  }

  function renderMemoryCollection() {
    const count = items.filter(i => owned.includes(i.id)).length;
    app.innerHTML = `<section class="wrap memory-collection">
<div class="archive-head">
<p class="eyebrow">The memory collection / ${count} of ${items.length} unlocked</p>
<h1>The opening<br>collection.</h1>
<p>Four companions, four stories. A matching purchase unlocks the card and its film.</p>
<p>New seasons will bring new chapters. Collected memories stay in your archive.</p>
</div>
<div class="memory-card-grid">${items.map(memoryCard).join('')}</div>
<section class="chapter-section future-collection">
<div>
<p class="eyebrow">Still being imagined</p>
<h2>More chapters<br>to come.</h2>
<p>Later seasons, upgraded cards and interactive moments are in development.</p>
</div>
<div class="memory-card-grid two">${futureCard('growth')}${futureCard('interaction')}</div>
</section>
</section>`;
  }

  function route() {
    film?.destroy();
    film = null;
    closeModal(false);
    let routeName = '';
    try {
      routeName = decodeURIComponent(location.hash.slice(1));
    } catch {
      /* An incomplete URL should still open the shop. */ }
    const [page, id] = routeName.split('/');
    const item = items.find(item => item.id === id);
    // A new purchase meets its companion before the story, including after a refresh.
    const storyItem = page === 'film' ? items.find(item => item.companion === id) : item;
    if ((page === 'memory' || page === 'film') && storyItem && pendingIntroductions.includes(storyItem.id)) {
      location.replace('#reveal/' + storyItem.id);
      return;
    }
    if (page === 'item' && item) renderProduct(item);
    else if (page === 'checkout' && item) renderCheckout(item);
    else if (page === 'reveal' && item) renderArrival(item);
    else if (page === 'fragment' && item) renderMemoryCard(item);
    else if (page === 'memory' && item) renderStory(item);
    else if (page === 'film' && companions[id]) renderStory(items.find(item => item.companion === id));
    else if (page === 'memories') renderMemoryCollection();
    else if (page === 'archive') renderArchive(id === 'cards');
    else if (page === 'collection' || page === 'scan') renderCollection();
    else if (page === 'studio') renderCompanion(id);
    else renderHome();
    updateArchiveCount();
    const titles = {
      collection: 'The collection',
      archive: 'My archive',
      memories: 'Memory cards',
      studio: 'The companions'
    };
    document.title = 'AFTERKIN — ' + (item ? item.name : titles[page] || 'Vintage & companionship');
    document.querySelectorAll('nav a').forEach(link => {
      if (link.hash === '#' + page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    app.focus({
      preventScroll: true
    });
  }
  $('#reset').onclick = () => {
    openModal(`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="reset-title">
  <button class="close" aria-label="Close">×</button>
<h2 id="reset-title">Clear the demo archive?</h2>
  <p>This removes simulated purchases from this browser. You can collect each piece again.</p>
  <button class="btn" id="reset-confirm">Reset demo archive</button>
 </section>`);
    $('#reset-confirm').onclick = () => {
      owned = [];
      pendingIntroductions = [];
      AFTERKIN_STORAGE.saveIntroductions([]);
      saveArchive();
      closeModal(false);
      if (location.hash === '#archive') route();
      else location.hash = 'archive';
      toast('Demo archive cleared.');
    };
  };
  document.querySelector('.skip-link').onclick = event => {
    event.preventDefault();
    app.focus();
    app.scrollIntoView();
  };
  window.addEventListener('hashchange', route);
  route();
})();
