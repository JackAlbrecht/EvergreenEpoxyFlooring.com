/* Evergreen Epoxy — motion layer (non-invasive) */
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

  // Re-show loader on internal nav clicks for smooth transition
  document.addEventListener('click', function(ev){
    var a = ev.target.closest && ev.target.closest('a');
    if(!a) return;
    var href = a.getAttribute('href');
    if(!href || href.charAt(0)==='#' || /^(mailto:|tel:|javascript:)/i.test(href)) return;
    if(a.target === '_blank' || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
    var l = document.querySelector('.eef-loader');
    if(l){ l.classList.remove('gone'); }
  });

  // SCROLL PROGRESS BAR
  if (!document.querySelector('.eef-scroll-progress')) {
    var sp = document.createElement('div');
    sp.className = 'eef-scroll-progress';
    sp.innerHTML = '<div class="eef-bar"></div>';
    document.addEventListener('DOMContentLoaded', function(){
      document.body.appendChild(sp);
      var bar = sp.querySelector('.eef-bar');
      window.addEventListener('scroll', function(){
        var h = document.documentElement;
        var p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        bar.style.setProperty('--eefp', p + '%');
      }, { passive: true });
    });
  }

  // CURSOR GLOW (desktop only)
  if (window.matchMedia && window.matchMedia('(hover:hover)').matches) {
    document.addEventListener('DOMContentLoaded', function(){
      if (document.querySelector('.eef-cursor-glow')) return;
      var cg = document.createElement('div');
      cg.className = 'eef-cursor-glow';
      document.body.appendChild(cg);
      var cx=0, cy=0, tx=0, ty=0;
      window.addEventListener('mousemove', function(e){ tx=e.clientX; ty=e.clientY; cg.classList.add('eef-active'); });
      (function raf(){ cx += (tx-cx)*0.16; cy += (ty-cy)*0.16; cg.style.transform = 'translate('+cx+'px,'+cy+'px) translate(-50%,-50%)'; requestAnimationFrame(raf); })();
    });
  }

  // CLICK RIPPLE on buttons/links/submits
  document.addEventListener('click', function(ev){
    var el = ev.target.closest && ev.target.closest('a, button, [class*="btn"], [class*="cta"], input[type="submit"]');
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
