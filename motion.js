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
  setTimeout(dismiss, 3200);

  // Re-show loader on internal navigation
  document.addEventListener('click', function(ev){
    var a = ev.target.closest && ev.target.closest('a');
    if(!a) return;
    var href = a.getAttribute('href');
    if(!href || href.charAt(0)==='#' || /^(mailto:|tel:|javascript:)/i.test(href)) return;
    if(a.target === '_blank' || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
    var l = document.querySelector('.eef-loader');
    if(l){ l.classList.remove('gone'); }
  });

  // SCROLL REVEAL — tag ONLY mid-level content (never parent sections/hero/article)
  // This avoids cascading invisibility that caused hero overlap
  function autoTag(){
    var sels = ['h2', 'h3', '.card', '.service-card', '.testimonial-card', '.project-card', '.service', '.testimonial', '.project', '.team', 'figure', 'blockquote'];
    sels.forEach(function(s){
      try{
        document.querySelectorAll(s).forEach(function(el){
          // Skip: already tagged; inside loader; inside header/nav; or IS a section/hero/article
          if (el.hasAttribute('data-eef-reveal')) return;
          if (el.closest('.eef-loader')) return;
          if (el.closest('header')) return;
          if (el.closest('nav')) return;
          if (el.closest('.hero')) return;           // skip anything inside hero
          if (el.tagName === 'SECTION') return;
          if (el.tagName === 'ARTICLE') return;
          el.setAttribute('data-eef-reveal','');
        });
      }catch(e){}
    });
  }
  autoTag();

  // Above-the-fold first pass
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

  // CLICK RIPPLE
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
