/* =========================================================
   Celestia Music — main.js
   Vanilla JS, no dependencies. Runs after the DOM is parsed
   (script is at the end of <body>).
   ========================================================= */
(function () {
  "use strict";

  /* -------------------------------------------------------
     1. Mobile navigation
     ------------------------------------------------------- */
  var nav = document.querySelector("[data-nav]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    // Close the menu after choosing a link
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a") && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* -------------------------------------------------------
     2. Solid nav background once scrolled
     ------------------------------------------------------- */
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------------------------------------------------------
     3. Reveal-on-scroll
     ------------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* -------------------------------------------------------
     4. LISTEN — audio players
     ---------------------------------------------------------
     To add a real recording:
       • drop the file into /assets/audio/  (mp3 recommended)
       • set its "src" below and "placeholder: false"
     To add/remove tracks, just edit this array.
     ------------------------------------------------------- */
  var TRACKS = [
    { title: "Sample 1", hint: "Suggested: a lively / “funky” arrangement", src: "assets/audio/track-1.mp3", placeholder: true },
    { title: "Sample 2", hint: "Suggested: the shortened Amen arrangement", src: "assets/audio/track-2.mp3", placeholder: true },
    { title: "Sample 3", hint: "Suggested: Stranger on the Shore", src: "assets/audio/track-3.mp3", placeholder: true },
    { title: "Sample 4", hint: "A standout choral piece", src: "assets/audio/track-4.mp3", placeholder: true },
    { title: "Sample 5", hint: "A standout choral piece", src: "assets/audio/track-5.mp3", placeholder: true },
    { title: "Sample 6", hint: "A standout choral piece", src: "assets/audio/track-6.mp3", placeholder: true }
  ];

  var PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
  var PAUSE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"/></svg>';

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  var tracklist = document.getElementById("tracklist");
  var players = [];

  if (tracklist) {
    TRACKS.forEach(function (track, i) {
      var el = document.createElement("div");
      el.className = "track" + (track.placeholder ? " track--placeholder" : "");

      if (track.placeholder) {
        el.innerHTML =
          '<button class="track__play" type="button" aria-label="Recording coming soon" disabled>' + PLAY_ICON + '</button>' +
          '<div class="track__meta">' +
            '<p class="track__title">' + track.title + '<span class="track__badge">Coming soon</span></p>' +
            '<p class="track__hint">' + track.hint + '</p>' +
          '</div>' +
          '<span class="track__time">—:—</span>';
        tracklist.appendChild(el);
        return;
      }

      // Real, playable track
      var audio = new Audio();
      audio.preload = "none";
      audio.src = track.src;

      el.innerHTML =
        '<button class="track__play" type="button" aria-label="Play ' + track.title + '">' + PLAY_ICON + '</button>' +
        '<div class="track__meta">' +
          '<p class="track__title">' + track.title + '</p>' +
          (track.hint ? '<p class="track__hint">' + track.hint + '</p>' : '') +
        '</div>' +
        '<span class="track__time">0:00</span>' +
        '<div class="track__progress" role="slider" aria-label="Seek" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span class="track__bar"></span></div>';

      tracklist.appendChild(el);

      var btn = el.querySelector(".track__play");
      var bar = el.querySelector(".track__bar");
      var time = el.querySelector(".track__time");
      var progress = el.querySelector(".track__progress");

      var api = { audio: audio, btn: btn, el: el };
      players.push(api);

      function setPlayingUI(playing) {
        btn.innerHTML = playing ? PAUSE_ICON : PLAY_ICON;
        btn.setAttribute("aria-label", (playing ? "Pause " : "Play ") + track.title);
        el.classList.toggle("is-playing", playing);
      }

      btn.addEventListener("click", function () {
        if (audio.paused) {
          // pause every other track first (single-play)
          players.forEach(function (p) { if (p.audio !== audio) p.audio.pause(); });
          audio.play();
        } else {
          audio.pause();
        }
      });

      audio.addEventListener("play", function () { setPlayingUI(true); });
      audio.addEventListener("pause", function () { setPlayingUI(false); });
      audio.addEventListener("ended", function () {
        setPlayingUI(false);
        bar.style.right = "100%";
        progress.setAttribute("aria-valuenow", "0");
      });

      audio.addEventListener("timeupdate", function () {
        var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        bar.style.right = (100 - pct) + "%";
        time.textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration);
        progress.setAttribute("aria-valuenow", String(Math.round(pct)));
      });

      audio.addEventListener("loadedmetadata", function () {
        time.textContent = "0:00 / " + fmt(audio.duration);
      });

      // seek by clicking the progress bar
      function seekFromEvent(e) {
        var rect = progress.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        x = Math.min(1, Math.max(0, x));
        if (audio.duration) audio.currentTime = x * audio.duration;
      }
      progress.addEventListener("click", seekFromEvent);
      progress.addEventListener("keydown", function (e) {
        if (!audio.duration) return;
        if (e.key === "ArrowRight") { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); e.preventDefault(); }
        if (e.key === "ArrowLeft")  { audio.currentTime = Math.max(0, audio.currentTime - 5); e.preventDefault(); }
      });
    });
  }

  /* -------------------------------------------------------
     5. INSTAGRAM grid
     ---------------------------------------------------------
     Lightweight & fast — no third-party embed script.
     To show real posts: drop square images into /assets/img/ig/
     and fill IG_POSTS with { img: "assets/img/ig/xxx.jpg",
     link: "https://www.instagram.com/p/…/", alt: "…" }.
     Leave IG_POSTS empty to show placeholder tiles linking to
     the profile.
     ------------------------------------------------------- */
  var IG_PROFILE = "https://www.instagram.com/celestia__music/";
  var IG_POSTS = [
    // { img: "assets/img/ig/post-1.jpg", link: "https://www.instagram.com/p/xxxx/", alt: "Choir at a church" },
  ];
  var IG_TILE_COUNT = 6;

  var IG_GLYPH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';

  var igGrid = document.getElementById("ig-grid");
  if (igGrid) {
    for (var i = 0; i < IG_TILE_COUNT; i++) {
      var post = IG_POSTS[i];
      var a = document.createElement("a");
      a.className = "ig-tile";
      a.target = "_blank";
      a.rel = "noopener";

      if (post && post.img) {
        a.href = post.link || IG_PROFILE;
        a.innerHTML =
          '<img src="' + post.img + '" alt="' + (post.alt || "Celestia Music on Instagram") + '" loading="lazy" />' +
          '<span class="ig-tile__overlay">' + IG_GLYPH + '</span>';
      } else {
        a.href = IG_PROFILE;
        a.setAttribute("aria-label", "Celestia Music on Instagram (placeholder)");
        a.innerHTML =
          '<span class="ig-tile__ph">' + IG_GLYPH + '<span>@celestia__music</span></span>';
      }
      igGrid.appendChild(a);
    }
  }

  /* -------------------------------------------------------
     6. Footer year
     ------------------------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

})();
