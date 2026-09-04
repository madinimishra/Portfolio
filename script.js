
(function(){
  document.getElementById('footYear').textContent = new Date().getFullYear();

  // ---------- scroll progress ----------
  var progressEl = document.getElementById('scrollProgress');
  function updateProgress(){
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? scrolled / max : 0;
    progressEl.style.transform = 'scaleX(' + pct + ')';
  }
  window.addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  // ---------- cursor glow + dot + ring ----------
  var glow = document.getElementById('cursorGlow');
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(isFine && !reduceMotion){
    var raf = null;
    window.addEventListener('mousemove', function(e){
      dot.style.opacity = '1'; ring.style.opacity = '0.5';
      glow.style.setProperty('--x', e.clientX + 'px');
      glow.style.setProperty('--y', e.clientY + 'px');
      if(raf) return;
      raf = requestAnimationFrame(function(){
        dot.style.transform = 'translate(' + (e.clientX-4) + 'px,' + (e.clientY-4) + 'px)';
        ring.style.transform = 'translate(' + (e.clientX-16) + 'px,' + (e.clientY-16) + 'px)';
        raf = null;
      });
    });
    window.addEventListener('mouseover', function(e){
      var interactive = e.target.closest('a, button, input, textarea, [role="button"]');
      if(interactive){
        ring.style.width='56px'; ring.style.height='56px'; ring.style.opacity='0.9'; ring.style.background='rgba(97,86,226,0.12)';
        ring.style.transform = ring.style.transform.replace(/translate\(([-\d.]+)px,([-\d.]+)px\)/, function(m,x,y){
          return 'translate(' + (parseFloat(x)-12) + 'px,' + (parseFloat(y)-12) + 'px)';
        });
      } else {
        ring.style.width='32px'; ring.style.height='32px'; ring.style.opacity='0.5'; ring.style.background='transparent';
      }
    });
    window.addEventListener('mousedown', function(){ dot.style.width='6px'; dot.style.height='6px'; });
    window.addEventListener('mouseup', function(){ dot.style.width='8px'; dot.style.height='8px'; });
  }

  // ---------- header scroll + scroll-spy ----------
  var header = document.getElementById('siteHeader');
  function onScroll(){ header.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive:true }); onScroll();

  var sectionIds = ['about','experience','projects','skills','rd','education','certifications'];
  var navLinks = document.querySelectorAll('nav a[data-id]');
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        navLinks.forEach(function(a){ a.classList.toggle('active', a.dataset.id === entry.target.id); });
      }
    });
  }, { rootMargin:'-45% 0px -50% 0px', threshold:0 });
  sectionIds.forEach(function(id){ var el = document.getElementById(id); if(el) observer.observe(el); });

  // ---------- mobile menu ----------
  var mobileBtn = document.getElementById('mobileMenuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileIcon = document.getElementById('mobileMenuIcon');
  mobileBtn.addEventListener('click', function(){
    var open = mobileMenu.classList.toggle('open');
    mobileIcon.textContent = open ? 'close' : 'menu';
  });
  mobileMenu.querySelectorAll('a[data-id]').forEach(function(a){
    a.addEventListener('click', function(){ mobileMenu.classList.remove('open'); mobileIcon.textContent = 'menu'; });
  });

  // ---------- brand -> home ----------
  document.getElementById('brandHome').addEventListener('click', function(){
    window.scrollTo({ top:0, behavior:'smooth' });
  });
  document.getElementById('backToTop').addEventListener('click', function(){
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  // ---------- reveal on scroll ----------
  var revealEls = document.querySelectorAll('.reveal, .reveal-x, .reveal-scale');
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('in'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold:0.12, rootMargin:'0px 0px -80px 0px' });
  revealEls.forEach(function(el){ revealObserver.observe(el); });
  var tlFill = document.getElementById('tlFill');
  if(tlFill){
    var tlObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){ if(entry.isIntersecting){ tlFill.classList.add('in'); tlObserver.disconnect(); } });
    }, { threshold:0.1 });
    tlObserver.observe(tlFill);
  }

  // ---------- tech marquee ----------
  var stack = ['Python','FastAPI','React','LangChain','FalkorDB','PostgreSQL','Docker','OpenCV','TypeScript','MongoDB','Reinforcement Learning','Git'];
  var items = stack.concat(stack);
  var track = document.getElementById('marqueeTrack');
  track.innerHTML = items.map(function(t){ return '<div class="marquee-item"><span>'+t+'</span><span class="mdot"></span></div>'; }).join('');

  // ---------- scramble text ----------
  var SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_/[]{}=+*^?#';
  function scramble(el, finalText, revealDelay, holdFrames){
    var frame = 0;
    var queue = finalText.split('').map(function(char, i){ return { char:char, start:i*revealDelay, end:i*revealDelay+holdFrames }; });
    var totalFrames = Math.max.apply(null, queue.map(function(q){ return q.end; })) + 1;
    function tick(){
      var output = '', settled = 0;
      queue.forEach(function(q){
        if(q.char === ' '){ output += q.char; settled++; }
        else if(frame >= q.end){ output += q.char; settled++; }
        else if(frame >= q.start){ output += SCRAMBLE_CHARS[Math.floor(Math.random()*SCRAMBLE_CHARS.length)]; }
      });
      el.textContent = output;
      if(settled < queue.length && frame < totalFrames){ frame++; requestAnimationFrame(tick); }
      else { el.textContent = finalText; }
    }
    tick();
  }
  setTimeout(function(){
    var nameEl = document.getElementById('scrambleName');
    if(!reduceMotion) scramble(nameEl, 'Madini', 3, 10);
  }, 300);

  // ---------- magnetic buttons ----------
  if(isFine && !reduceMotion){
    document.querySelectorAll('.btn-primary, .social-icon').forEach(function(el){
      el.style.transition = 'transform .15s ease, background .15s ease, box-shadow .15s ease';
      el.addEventListener('mousemove', function(e){
        var rect = el.getBoundingClientRect();
        var relX = e.clientX - (rect.left + rect.width/2);
        var relY = e.clientY - (rect.top + rect.height/2);
        el.style.transform = 'translate(' + (relX*0.25) + 'px,' + (relY*0.25) + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
  }

  // ---------- contact modal ----------
  var modal = document.getElementById('contactModal');
  function openModal(){ modal.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeModal(){ modal.classList.remove('open'); document.body.style.overflow=''; }
  document.getElementById('openContactDesktop').addEventListener('click', openModal);
  document.getElementById('openContactMobile').addEventListener('click', function(){ mobileMenu.classList.remove('open'); mobileIcon.textContent='menu'; openModal(); });
  var hireBtnAbout = document.getElementById('hireMeBtnAbout');
  var hireBtnCta = document.getElementById('hireMeBtnCta');
  if(hireBtnAbout) hireBtnAbout.addEventListener('click', function(e){ e.preventDefault(); openModal(); });
  if(hireBtnCta) hireBtnCta.addEventListener('click', function(e){ e.preventDefault(); openModal(); });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cName').value.trim();
    var email = document.getElementById('cEmail').value.trim();
    var phone = document.getElementById('cPhone').value.trim();
    var message = document.getElementById('cMessage').value.trim();
    var lines = ['Hi Madini, I am ' + name + '.'];
    if(email) lines.push('Email: ' + email);
    if(phone) lines.push('Phone: ' + phone);
    lines.push(''); lines.push(message);
    var subject = encodeURIComponent('Portfolio enquiry from ' + name);
    var body = encodeURIComponent(lines.join('\n'));
    var gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=madinimishra0507@gmail.com&su=' + subject + '&body=' + body;
    var a = document.createElement('a'); a.href = gmailUrl; a.target = '_top'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    closeModal();
    this.reset();
  });

  // ---------- resume: view + download ----------
  var RESUME_PDF_PATH = "assets/resume.pdf";
  function downloadResume(){
    if(window.claude && typeof window.claude.use === 'function'){
      window.claude.use('downloads').then(function(downloads){
        if(downloads){
          fetch(RESUME_PDF_PATH).then(function(r){ return r.blob(); }).then(function(blob){
            downloads.save({ filename:'Madini_Mishra_Resume.pdf', data: blob }).catch(function(){ triggerDirectDownload(); });
          }).catch(function(){ triggerDirectDownload(); });
        } else { triggerDirectDownload(); }
      }).catch(function(){ triggerDirectDownload(); });
    } else {
      triggerDirectDownload();
    }
  }
  function triggerDirectDownload(){
    var a = document.createElement('a'); a.href = RESUME_PDF_PATH;
    a.download = 'Madini_Mishra_Resume.pdf'; document.body.appendChild(a); a.click(); a.remove();
  }
  document.getElementById('downloadResumeBtn').addEventListener('click', function(e){ e.preventDefault(); downloadResume(); });
  document.getElementById('resumeDlBtn').addEventListener('click', function(e){ e.preventDefault(); downloadResume(); });

  var resumeModal = document.getElementById('resumeModal');
  var resumeScroll = document.getElementById('resumeScroll');
  var resumeLoaded = false;
  function openResumeModal(){
    if(!resumeLoaded){
      var embed = document.createElement('embed');
      embed.src = RESUME_PDF_PATH; embed.type = 'application/pdf';
      embed.style.width = '100%'; embed.style.height = '100%'; embed.style.minHeight = '70vh'; embed.style.border = 'none';
      resumeScroll.appendChild(embed);
      resumeLoaded = true;
    }
    resumeModal.classList.add('open'); document.body.style.overflow='hidden';
  }
  function closeResumeModal(){ resumeModal.classList.remove('open'); document.body.style.overflow=''; }
  document.getElementById('viewResumeBtn').addEventListener('click', function(e){ e.preventDefault(); openResumeModal(); });
  document.getElementById('resumeModalClose').addEventListener('click', closeResumeModal);
  resumeModal.addEventListener('click', function(e){ if(e.target === resumeModal) closeResumeModal(); });

  // ---------- certificate viewer ----------
  var CERTS = {
    sih: { title:'Smart India Hackathon (SIH) 2025', img:"assets/certificates/sih.png" },
    genai: { title:'GenAI Powered Data Analytics — Job Simulation', img:"assets/certificates/genai.png" },
    ibm: { title:'Artificial Intelligence Fundamentals', img:"assets/certificates/ibm.png" },
    nlp: { title:'Intro to NLP Concepts', img:"assets/certificates/nlp.png" },
    cyber: { title:'Introduction to Cybersecurity', img:"assets/certificates/cyber.png" }
  };
  var certModal = document.getElementById('certModal');
  var certScroll = document.getElementById('certScroll');
  var certModalTitle = document.getElementById('certModalTitle');
  function openCertModal(key){
    var cert = CERTS[key];
    if(!cert) return;
    certModalTitle.textContent = cert.title;
    certScroll.innerHTML = '';
    var img = document.createElement('img');
    img.src = cert.img;
    img.alt = cert.title;
    certScroll.appendChild(img);
    certModal.classList.add('open'); document.body.style.overflow='hidden';
  }
  function closeCertModal(){ certModal.classList.remove('open'); document.body.style.overflow=''; }
  document.querySelectorAll('.cert-view-btn').forEach(function(btn){
    btn.addEventListener('click', function(e){ e.preventDefault(); openCertModal(btn.getAttribute('data-cert')); });
  });
  document.getElementById('certModalClose').addEventListener('click', closeCertModal);
  certModal.addEventListener('click', function(e){ if(e.target === certModal) closeCertModal(); });

  // ---------- AI assistant ----------
  var orb = document.getElementById('aiOrb');
  var panel = document.getElementById('aiPanel');
  var closeBtn = document.getElementById('aiClose');
  var body = document.getElementById('aiBody');
  var input = document.getElementById('aiInput');
  var sendBtn = document.getElementById('aiSend');
  var micBtn = document.getElementById('aiMic');
  var voiceToggle = document.getElementById('aiVoiceToggle');
  var voiceStatus = document.getElementById('aiVoiceStatus');
  function openPanel(){ panel.classList.add('open'); input.focus(); }
  function closePanel(){ panel.classList.remove('open'); }
  orb.addEventListener('click', function(){ panel.classList.contains('open') ? closePanel() : openPanel(); });
  closeBtn.addEventListener('click', closePanel);

  var SECTION_LABELS = { about:'About Me', experience:'Experience', projects:'Projects', skills:'Skill Set', rd:'R&D', education:'Education', certifications:'Certification' };
  var NAV_COMMANDS = [
    { id:'about', keys:['go to about','show about','open about'] },
    { id:'experience', keys:['show experience','go to experience','open experience'] },
    { id:'projects', keys:['show projects','go to projects','open projects','see projects','view projects'] },
    { id:'skills', keys:['go to skills','show skills','skill set section'] },
    { id:'rd', keys:['go to r&d','show r&d','go to research'] },
    { id:'education', keys:['go to education','show education'] },
    { id:'certifications', keys:['go to certification','show certification'] },
    { id:null, keys:['go to contact','open contact','contact page'], action:'contact' },
    { id:null, keys:['go to home','go home','beginning'], action:'home' }
  ];
  var FAQ = [
    { keys:['hi','hello','hey','hola'], a:"Hi there! I'm Madini AI. Ask me anything about her projects, skills, experience, or education — or say things like 'go to projects' and I'll scroll you there." },
    { keys:['thank','thanks','thx'], a:"You're welcome! Anything else you'd like to know about Madini?" },
    { keys:['who are you','what are you','what can you do'], a:"I'm Madini AI, a voice-enabled assistant built into this portfolio. I can answer questions about her projects, skills, experience, and education, and navigate the page for you." },
    { keys:['best project','favorite','favourite','graphrag','medgraph'], a:"Her strongest AI project is MedGraph AI — an enterprise hospital knowledge system that fuses PostgreSQL with a FalkorDB Knowledge Graph and Graph RAG for semantic, intelligent querying." },
    { keys:['skill','tech stack','stack','technologies'], a:"Her skill set spans AI/ML & GenAI (RAG, LLMs, Computer Vision, Reinforcement Learning), languages (Python, Java, C, C#, TypeScript), backend (FastAPI, Flask, LangChain), databases (PostgreSQL, MongoDB, FalkorDB), and tools like Docker, Git, and FAISS." },
    { keys:['experience','intern','work','job'], a:"She interned as an AIML Intern at Daffodil Software (Jun–Jul 2025), and currently serves as Social Media Head for the Quantum Computing Club at NCU." },
    { keys:['resume','cv','download'], a:"You can download her resume from the button in the hero section, or view it inline from the About section." },
    { keys:['contact','email','reach','hire'], a:"Best way to reach her: madinimishra0507@gmail.com, or use the Contact button to send a message directly." },
    { keys:['education','degree','university','college','cgpa'], a:"She's pursuing a B.Tech in Computer Science (AI/ML) at The NorthCap University, Gurugram, graduating 2027, with a CGPA of 8.05/10.00." },
    { keys:['certificat','sih','hackathon'], a:"She's a Smart India Hackathon (SIH) 2025 university-level participant, and holds certifications in Python, GenAI Data Analytics, AI Fundamentals (IBM), and NLP Concepts (Microsoft)." },
    { keys:['traffic','trafficiq'], a:"TrafficIQ is her reinforcement-learning project, in two versions: Traffic-ai-lite and traffic-control-advanced, both linked on the Projects section." },
    { keys:['quick bite','quickbite','food'], a:"Quick Bite is a production-ready food & grocery ordering platform she built in React and TypeScript." },
    { keys:['github'], a:"Her GitHub is github.com/madinimishra." },
    { keys:['linkedin'], a:"Her LinkedIn is linked in the hero section and footer." }
  ];
  function respond(text){
    var q = text.toLowerCase();
    var navHit = NAV_COMMANDS.find(function(n){ return n.keys.some(function(k){ return q.indexOf(k) !== -1; }); });
    if(navHit){
      var answer;
      if(navHit.action === 'contact'){ openModal(); answer = "Opening the contact form for you."; }
      else if(navHit.action === 'home'){ window.scrollTo({top:0,behavior:'smooth'}); answer = "Sure — heading to the top."; }
      else {
        var el = document.getElementById(navHit.id);
        if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
        answer = "Sure — taking you to " + SECTION_LABELS[navHit.id] + ".";
      }
      addMsg(answer, 'bot'); speak(answer); return;
    }
    var hit = FAQ.find(function(f){ return f.keys.some(function(k){ return q.indexOf(k) !== -1; }); });
    var answer = hit ? hit.a : "I don't have a specific answer for that, but you can ask about her projects, skills, experience, education, or say 'go to projects' and I'll navigate there for you.";
    addMsg(answer, 'bot'); speak(answer);
  }
  function addMsg(text, who){
    var d = document.createElement('div'); d.className = 'msg ' + who; d.textContent = text;
    body.appendChild(d); body.scrollTop = body.scrollHeight;
  }
  function sendCurrent(){
    var val = input.value.trim(); if(!val) return;
    addMsg(val, 'user'); input.value = '';
    setTimeout(function(){ respond(val); }, 260);
  }
  sendBtn.addEventListener('click', sendCurrent);
  input.addEventListener('keydown', function(e){ if(e.key === 'Enter') sendCurrent(); });
  document.querySelectorAll('.suggest-chip').forEach(function(btn){
    btn.addEventListener('click', function(){ addMsg(btn.textContent, 'user'); setTimeout(function(){ respond(btn.dataset.q); }, 260); });
  });

  var voiceOn = false;
  try{ voiceOn = localStorage.getItem('madini-voice') === 'on'; }catch(e){}
  voiceToggle.setAttribute('aria-pressed', voiceOn ? 'true' : 'false');
  voiceToggle.addEventListener('click', function(){
    voiceOn = !voiceOn;
    try{ localStorage.setItem('madini-voice', voiceOn ? 'on' : 'off'); }catch(e){}
    voiceToggle.setAttribute('aria-pressed', voiceOn ? 'true' : 'false');
    if(!voiceOn && 'speechSynthesis' in window){ window.speechSynthesis.cancel(); }
    if(voiceOn){ speak("Spoken replies are on."); }
  });
  function speak(text){
    if(!voiceOn || !('speechSynthesis' in window)) return;
    try{ window.speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(text); u.rate=1; u.pitch=1; window.speechSynthesis.speak(u); }catch(e){}
  }

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognizing = false, recognizer = null;
  if(SR){
    recognizer = new SR(); recognizer.continuous = false; recognizer.interimResults = false; recognizer.lang = 'en-US';
    recognizer.addEventListener('start', function(){ recognizing = true; micBtn.classList.add('listening'); voiceStatus.hidden = false; voiceStatus.textContent = '🎙 Listening…'; });
    recognizer.addEventListener('result', function(e){ var t = e.results[0][0].transcript; input.value = t; voiceStatus.textContent = '🎙 Heard: "' + t + '"'; setTimeout(sendCurrent, 300); });
    recognizer.addEventListener('error', function(e){ voiceStatus.textContent = e.error === 'not-allowed' ? '🎙 Microphone access blocked.' : '🎙 Did not catch that — try again.'; setTimeout(function(){ voiceStatus.hidden = true; }, 3000); });
    recognizer.addEventListener('end', function(){ recognizing = false; micBtn.classList.remove('listening'); setTimeout(function(){ voiceStatus.hidden = true; }, 1500); });
    micBtn.addEventListener('click', function(){ if(recognizing){ recognizer.stop(); return; } openPanel(); try{ recognizer.start(); }catch(e){ voiceStatus.hidden=false; voiceStatus.textContent='🎙 Voice input unavailable right now.'; } });
  } else {
    micBtn.addEventListener('click', function(){ openPanel(); voiceStatus.hidden=false; voiceStatus.textContent="🎙 Voice input isn't supported in this browser."; setTimeout(function(){ voiceStatus.hidden = true; }, 3500); });
  }
})();
