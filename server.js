const messages = [
      "My beautifull miss Andre 🌸",
      "My diamond, not from this world ✨",
      "You are so kind, gentle and pure 🌸",
      "Your laugh  have many forms but all are my favorite music 🎶",
      "the diffrence between reality and a dream became blurry for me 💖",
      "Cuase being with you feels like a dream ✨",
      "will you be my valentine miss Andre? "
    ];

    const messagesEl = document.getElementById('messages');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const reveal = document.getElementById('reveal');
    const finalLine = document.getElementById('finalLine');

    let idx = 0;
    let created = [];

    function createLine(text, delay = 0){
      const el = document.createElement('div');
      el.className = 'line';
      el.innerHTML = `<span class="emoji">${text.match(/[\p{Emoji}]/u)?.[0] || ''}</span> <span class="txt">${escapeHtml(text)}</span>`;
      messagesEl.appendChild(el);
      // show with slight delay for nice rhythm
      setTimeout(()=> el.classList.add('show'), 60 + delay);
      created.push(el);
      // scroll into view smoothly
      el.scrollIntoView({behavior:'smooth', block:'center'});
    }

    function escapeHtml(s){
      return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    // initialize with first message
    createLine(messages[0]);
    idx = 1;
    updateControls();

    nextBtn.addEventListener('click', () => {
      if (idx < messages.length) {
        createLine(messages[idx]);
        idx++;
        updateControls();
        // if last message reached, change next to Yes
        if (idx === messages.length) {
          nextBtn.textContent = "Yes";
        }
      } else {
        // user clicked final "Ask" -> Show reveal + start hearts
        showReveal();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (created.length > 1){
        const last = created.pop();
        last.classList.remove('show');
        setTimeout(()=> last.remove(), 300);
        idx = Math.max(1, idx - 1);
        updateControls();
      }
    });

    function updateControls(){
      prevBtn.style.visibility = created.length > 1 ? 'visible' : 'hidden';
      // if we are already at final line, change text
      if (idx >= messages.length) {
        nextBtn.textContent = 'will you be my valentine';
      } else {
        nextBtn.textContent = 'yes ➝';
      }
    }

    // REVEAL and hearts rain
    function showReveal(){
      // show reveal panel
      reveal.classList.add('show');
      reveal.setAttribute('aria-hidden','false');

      // change final line text exactly as you asked (kept punctuation sweeter)
      finalLine.textContent = "Thank you for being my valentine";

      // spawn heart rain for a while
      startHeartRain();
      // small extra: subtle pulse to reveal card
      document.querySelector('.reveal-card').animate([
        { transform: 'scale(.98)', opacity: 0.8 },
        { transform: 'scale(1)', opacity: 1 }
      ], { duration: 420, easing: 'cubic-bezier(.2,.9,.25,1)'});
    }

    // HEART RAIN implementation
    let heartInterval = null;
    function startHeartRain(){
      // create hearts frequently for ~9 seconds, then slow
      let totalDuration = 12000; // 12s heavy
      let start = Date.now();
      heartInterval = setInterval(()=>{
        spawnHeart();
        // faster initial, then slower later
        if (Date.now() - start > totalDuration){
          clearInterval(heartInterval);
          // keep some gentle occasional hearts forever
          setInterval(spawnHeart, 900);
        }
      }, 160); // spawn every 160ms initially
    }

    function spawnHeart(){
      const heart = document.createElement('div');
      heart.className = 'heart';
      // random starting x across width
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const startX = Math.random() * vw;
      const size = 18 + Math.random() * 42; // 18 to 60 px
      const rotate = Math.random() * 360;
      const hue = 320 + Math.random()*60; // pinkish
      // set style
      heart.style.left = (startX - size/2) + 'px';
      heart.style.top = '-120px';
      heart.style.width = size + 'px';
      heart.style.height = size + 'px';
      heart.style.opacity = 0.95;

      // SVG heart (keeps it crisp)
      heart.innerHTML = `
      <svg viewBox="0 0 32 29" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M23.6 0c-2.9 0-4.9 1.6-6 3.1C16.3 1.6 14.3 0 11.4 0 5.1 0 0 5.4 0 11.9c0 7.6 9.6 13.1 14.5 17.1 1.9 1.3 3.7 2.4 4.9 3.2.5.3 1.2.3 1.7 0 1.2-.8 3-1.9 4.9-3.2C22.4 25 32 19.5 32 11.9 32 5.4 26.9 0 23.6 0z" fill="hsl(${hue}deg 100% 72%)"/>
      </svg>
      `;

      document.body.appendChild(heart);

      // random horizontal drift and fall duration
      const drift = (Math.random() - 0.5) * 220; // -110 .. 110
      const duration = 3800 + Math.random()*3000; // 3.8s - 6.8s
      const spin = (Math.random() - 0.5) * 720; // -360 to 360 degrees

      // animate with JS for better control
      const startTime = performance.now();
      function animate(now){
        const t = (now - startTime) / duration;
        if (t >= 1){
          heart.remove();
          return;
        }
        // vertical movement
        const eased = easeOutCubic(t);
        heart.style.transform = `translate(${drift * eased}px, ${ (window.innerHeight + 200) * eased }px) rotate(${spin * eased}deg) scale(${1 - 0.15*eased})`;
        heart.style.opacity = String(1 - eased*0.95);
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);

      // cleanup safety
      setTimeout(()=> heart.remove(), duration + 8000);
    }

    function easeOutCubic(x){ return 1 - Math.pow(1 - x, 3); }

    // allow keyboard "Enter" to do Next
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') nextBtn.click();
      if (e.key === 'ArrowLeft') prevBtn.click();
    });

    // small nice welcome sparkle inside card
    setTimeout(()=> {
      const c = document.createElement('div');
      c.className = 'spark';
      c.style.left = '50%';
      c.style.top = '20%';
      document.querySelector('.card').appendChild(c);
      setTimeout(()=> c.remove(), 4200);
    }, 800);
