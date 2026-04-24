/* Evergreen Epoxy — minimal motion layer */
(function(){
  // LOADER DISMISS
  function dismiss(){
    var l = document.querySelector('.eef-loader');
    if(!l) return;
    l.classList.add('gone');
    setTimeout(function(){ if(l && l.parentNode) l.parentNode.removeChild(l); }, 1100);
  }
  if (document.readyState === 'complete') setTimeout(dismiss, 300);
  else window.addEventListener('load', function(){ setTimeout(dismiss, 300); });
  setTimeout(dismiss, 3200); // safety

  // Loader reappears on nav click (before browser navigates away)
  document.addEventListener('click', function(ev){
    var a = ev.target.closest && ev.target.closest('a');
    if(!a) return;
    var href = a.getAttribute('href');
    if(!href || href.charAt(0)==='#' || /^(mailto:|tel:|javascript:)/i.test(href)) return;
    if(a.target === '_blank' || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
    // Internal navigation — re-show loader briefly so transition feels smooth
    var l = document.querySelector('.eef-loader');
    if(l){ l.classList.remove('gone'); }
  });

  // SCROLL REVEAL — auto-tag common content elements + attach observer
  function autoTag(){
    var sels = ['section', 'article', 'header', '.hero', '.card', 'h1', 'h2', 'h3', '.service', '.testimonial', '.project', '.team', '.faq', 'figure', 'blockquote', '.service-card', '.testimonial-card', '.project-card', 'img'];
    sels.forEach(function(s){
      try{
        document.querySelectorAll(s).forEach(function(el){
          if(!el.hasAttribute('data-eef-reveal') && !el.closest('.eef-loader') && !el.closest('header') && !el.closest('nav')){
            el.setAttribute('data-eef-reveal','');
          }
        });
      }catch(e){}
    });
  }
  autoTag();

  // RAF first pass — reveal anything above-the-fold immediately
  function firstReveal(){
    document.querySelectorAll('[data-eef-reveal]').forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.top < window.innerHeight * 0.95) el.classList.add('eef-visible');
    });
  }
  requestAnimationFrame(function(){ requestAnimationFrame(firstReveal); });

  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('eef-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin:'-6% 0px -4% 0px', threshold: 0.01 });
    document.querySelectorAll('[data-eef-reveal]').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('[data-eef-reveal]').forEach(function(el){ el.classList.add('eef-visible'); });
  }

  // CLICK RIPPLE on buttons + links + form submits
  document.addEventListener('click', function(ev){
    var el = ev.target.closest && ev.target.closest('a, button, .btn, [role="button"], input[type="submit"]');
    if(!el) return;
    var r = el.getBoundingClientRect();
    if(r.width < 10 || r.height < 10) return;
    var rip = document.createElement('span');
    rip.className = 'eef-ripple';
    var size = Math.max(r.width, r.height) * 2;
    rip.style.cssText = 'position:absolute;left:'+((ev.clientX-r.left)-size/2)+'px;top:'+((ev.clientY-r.top)-size/2)+'px;width:'+size+'px;height:'+size+'px';
    var cs = getComputedStyle(el);
    if(cs.position === 'static') el.style.position = 'relative';
    var prev = el.style.overflow;
    el.style.overflow = 'hidden';
    el.appendChild(rip);
    setTimeout(function(){ if(rip.parentNode) rip.parentNode.removeChild(rip); el.style.overflow = prev; }, 620);
  }, true);
})();

/* ==============================================================
   21st.dev-inspired interactions
   ============================================================== */
(function(){
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    // 1. Scroll progress bar
    if (!document.querySelector('.eef-scroll-progress')) {
      var sp = document.createElement('div');
      sp.className = 'eef-scroll-progress';
      sp.innerHTML = '<div class="eef-bar"></div>';
      document.body.appendChild(sp);
      var bar = sp.querySelector('.eef-bar');
      window.addEventListener('scroll', function(){
        var h = document.documentElement;
        var p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        bar.style.setProperty('--eefp', p + '%');
      }, { passive: true });
    }

    // 2. Cursor glow (desktop only)
    if (window.matchMedia('(hover:hover)').matches && !document.querySelector('.eef-cursor-glow')) {
      var cg = document.createElement('div');
      cg.className = 'eef-cursor-glow';
      document.body.appendChild(cg);
      var cx=0, cy=0, tx=0, ty=0;
      window.addEventListener('mousemove', function(e){ tx=e.clientX; ty=e.clientY; cg.classList.add('eef-active'); });
      window.addEventListener('mouseout', function(e){ if (!e.relatedTarget) cg.classList.remove('eef-active'); });
      (function raf(){ cx += (tx-cx)*0.16; cy += (ty-cy)*0.16; cg.style.transform = 'translate('+cx+'px,'+cy+'px) translate(-50%,-50%)'; requestAnimationFrame(raf); })();
    }

    // 3. Magnetic buttons (CTA + primary btns + submit)
    var magnetSel = 'a.btn, button.btn, a[class*="cta"], a[class*="quote"], button[type="submit"]';
    document.querySelectorAll(magnetSel).forEach(function(b){
      b.addEventListener('mousemove', function(ev){
        var r = b.getBoundingClientRect();
        var dx = (ev.clientX - (r.left + r.width/2)) * 0.15;
        var dy = (ev.clientY - (r.top + r.height/2)) * 0.15;
        b.style.transform = 'translate('+dx+'px,'+dy+'px)';
      });
      b.addEventListener('mouseleave', function(){ b.style.transform = ''; });
    });

    // 4. Auto-stagger any ul/ol with > 3 children and any grid/flex container with data-eef-stagger
    // Apply stagger reveal to lists of items on the page
    document.querySelectorAll('ul, ol').forEach(function(list){
      if (list.children.length >= 3 && !list.hasAttribute('data-eef-stagger') && !list.closest('nav') && !list.closest('footer')) {
        list.setAttribute('data-eef-stagger', '');
      }
    });

    // Observe stagger elements
    if ('IntersectionObserver' in window) {
      var sio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('eef-visible'); sio.unobserve(e.target); } });
      }, { rootMargin:'-4% 0px -2% 0px', threshold: 0.05 });
      document.querySelectorAll('[data-eef-stagger]').forEach(function(el){ sio.observe(el); });
    } else {
      document.querySelectorAll('[data-eef-stagger]').forEach(function(el){ el.classList.add('eef-visible'); });
    }

    // 5. Auto-aurora: add data-eef-aurora to every <section> or <main>-child that doesn't have it yet
    document.querySelectorAll('section, main > div, .hero, [class*="hero"]').forEach(function(el){
      if (!el.hasAttribute('data-eef-aurora') && el.getBoundingClientRect().height > 200) {
        el.setAttribute('data-eef-aurora', '');
      }
    });
  });
})();
