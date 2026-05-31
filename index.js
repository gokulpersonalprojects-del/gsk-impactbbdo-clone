/**
 * IMPACT BBDO (GSK CLONE) - CORE INTERACTION ENGINE
 * Stage 2 & 3: Interactive Header, Fullscreen Menu & Masked Hero Layout
 */

const initInteractionEngine = () => {
  // Prevent browser from keeping historical scroll position on page reload
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // ==========================================================================
  // 0. LENIS PREMIUM SMOOTH SCROLL INITIALIZATION
  // ==========================================================================
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 0.9, // Snappier scroll duration (was 1.2)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium deceleration curve
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1.15, // Snappier wheel multiplier for more satisfying scrolls!
    });
    
    window.lenis = lenis;
    lenis.scrollTo(0, { immediate: true });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // --- DOM SELECTORS ---
  const preloader = document.getElementById('preloader');
  const menuDrawer = document.getElementById('menu-drawer');
  const openNavBtn = document.getElementById('open-nav-btn');
  const closeNavBtn = document.getElementById('close-nav-btn');
  const transitionWipe = document.getElementById('transition-wipe');
  
  // Navigation drawer list items and sub-page sections
  const menuItems = document.querySelectorAll('.menu-item');
  const sections = document.querySelectorAll('section');
  const sectionTriggers = document.querySelectorAll('[data-section]');

  // --- BULLETPROOF SVG MASK REPAINT FOR MOBILE SAFARI ---
  const forceSvgRepaint = () => {
    const svgs = document.querySelectorAll('.mask-svg, .mask-svg-mobile');
    svgs.forEach(svg => {
      const parent = svg.parentNode;
      if (parent) {
        const nextSibling = svg.nextSibling;
        parent.removeChild(svg);
        parent.insertBefore(svg, nextSibling);
      }
    });
  };
  forceSvgRepaint();
  window.addEventListener('load', forceSvgRepaint);
  if (document.fonts) {
    document.fonts.ready.then(forceSvgRepaint);
  }

  // --- HERO VIDEO CASCADING FAIL-SAFE ---
  const heroVideo = document.querySelector('.video-banner');
  if (heroVideo) {
    const localUrl = "https://drive.google.com/uc?export=download&id=1oIANK-efq_hxiQvC6yQ99pvkZdmzB9Tn";
    const primaryUrl = "hero_video.mp4";
    const fallbackUrl = "https://impactbbdo.com/wp-content/uploads/2025/06/Intro-Video_1440x734_CLEAN_NO-LOGO.mp4";
    
    let currentSourceIndex = 0; // 0: localUrl, 1: primaryUrl, 2: fallbackUrl
    const sourcesList = [localUrl, primaryUrl, fallbackUrl];

    const loadNextSource = () => {
      currentSourceIndex++;
      if (currentSourceIndex < sourcesList.length) {
        const nextUrl = sourcesList[currentSourceIndex];
        console.log(`Hero video source failed. Falling back to: ${nextUrl}`);
        
        heroVideo.removeAttribute('src');
        const sources = heroVideo.querySelectorAll('source');
        sources.forEach(source => source.parentNode.removeChild(source));
        
        heroVideo.setAttribute('src', nextUrl);
        heroVideo.load();
        heroVideo.play().catch(() => {});
        resetTimer();
      }
    };

    // Listen for error loading local/network files
    heroVideo.addEventListener('error', (e) => {
      if (currentSourceIndex < sourcesList.length - 1) {
        loadNextSource();
      }
    }, true);

    // Bulletproof backup timer: if video metadata doesn't load in 4 seconds, try next source
    let fallbackTimeout = null;
    const resetTimer = () => {
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      fallbackTimeout = setTimeout(() => {
        if (heroVideo.readyState < 1 && currentSourceIndex < sourcesList.length - 1) { // HAVE_NOTHING
          loadNextSource();
        }
      }, 4000);
    };

    heroVideo.addEventListener('loadedmetadata', () => {
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    });

    // Start initial backup timer
    resetTimer();
  }


  // --- PILL VIDEOS FAIL-SAFE ---
  const pillPills = document.querySelectorAll('.video-badge-pill');
  const pillFallbacks = {
    'pill_video_1.mp4': 'https://impactbbdo.com/wp-content/uploads/2025/06/Intro-Video_1440x734_CLEAN_NO-LOGO.mp4',
    'pill_video_2.mp4': 'https://impactbbdo.com/wp-content/uploads/2025/06/We-Are-BBDO_Etihad_1280x720.mp4',
    'pill_video_3.mp4': 'https://impactbbdo.com/wp-content/uploads/2025/05/We-Are-BBDO_GMO-UAE-Flying-Taxi_1280x720-2.mp4'
  };

  pillPills.forEach(pill => {
    const video = pill.querySelector('video');
    const localSrc = pill.getAttribute('data-video');
    if (video && localSrc && pillFallbacks[localSrc]) {
      const fallbackUrl = pillFallbacks[localSrc];
      
      const triggerPillFallback = () => {
        const currentSrc = video.currentSrc || video.getAttribute('src') || '';
        if (!currentSrc.includes('http') && currentSrc !== fallbackUrl) {
          video.removeAttribute('src');
          const sources = video.querySelectorAll('source');
          sources.forEach(source => source.parentNode.removeChild(source));
          
          video.setAttribute('src', fallbackUrl);
          video.load();
          video.play().catch(() => {});
          
          // Also update data-video attribute for the modal popup player
          pill.setAttribute('data-video', fallbackUrl);
        }
      };

      // Listen for error loading local file
      video.addEventListener('error', triggerPillFallback, true);
      
      // Immediate fallback if error is already triggered
      if (video.error || video.networkState === 4) {
        triggerPillFallback();
      }

      // Bulletproof 2-second timeout: if local file is missing, load online fallback
      const timer = setTimeout(() => {
        if (video.readyState < 1) { // HAVE_NOTHING
          triggerPillFallback();
        }
      }, 2000);

      video.addEventListener('loadedmetadata', () => {
        clearTimeout(timer);
      });
    }
  });



  // ==========================================================================
  // 1. PRELOADER LIFECYCLE MANAGEMENT & HOME FOLD STATE RESET
  // ==========================================================================
  const handlePageLoad = () => {
    // 1. Instantly force top scroll coordinate snapping
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    // 2. Ensure only the home section is active on reload
    sections.forEach(section => {
      if (section.id === 'section-home') {
        section.classList.add('active-section');
        const video = section.querySelector('video');
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      } else {
        section.classList.remove('active-section');
      }
    });

    // 3. Coordinate navigation link active indicators
    menuItems.forEach(item => {
      const link = item.querySelector('a');
      if (link && link.getAttribute('data-section') === 'home') {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 4. Force state scroll visual engine update
    if (typeof handleScrollEffects === 'function') {
      handleScrollEffects();
    }

    // We enforce a minimum duration (2.2s) to let the custom GSK letter stagger 
    // 3D rotation reveal finish gracefully.
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('fade-out');
      }
      document.body.classList.add('preloader-complete'); // Triggers entrance animations!

      // Refresh GSAP ScrollTrigger calculations after DOM settling
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }

      // Initialize fade-up animations ONLY after preloader settles to prevent early load-time triggers due to layout shifting!
      if (typeof initFadeUpObserver === 'function') {
        initFadeUpObserver();
      }

      // Cleanup preloader node once transition ends (1.2s CSS transition time)
      setTimeout(() => {
        if (preloader && preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 1200);
    }, 2200);
  };

  // Prevent load race condition by executing immediately if page is already loaded
  if (document.readyState === 'complete') {
    handlePageLoad();
  } else {
    window.addEventListener('load', handlePageLoad);
  }

  // ==========================================================================
  // 2. NAV DRAWER CONTROLLER
  // ==========================================================================
  const openMenu = () => {
    if (menuDrawer) {
      menuDrawer.classList.add('open');
      // Prevent body scrolling when overlay is active
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    }
  };

  const closeMenu = () => {
    if (menuDrawer) {
      menuDrawer.classList.remove('open');
      // Re-enable body scroll if not viewing an overlay modal
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }
  };

  if (openNavBtn) openNavBtn.addEventListener('click', openMenu);
  if (closeNavBtn) closeNavBtn.addEventListener('click', closeMenu);

  // Close drawer if clicking outside the nav block (on the blank backdrop area)
  if (menuDrawer) {
    menuDrawer.addEventListener('click', (e) => {
      if (e.target === menuDrawer) {
        closeMenu();
      }
    });
  }

  // Close menu drawer on ESC keypress
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // ==========================================================================
  // 3. SPA ROUTER WITH PREMIUM FULL-SCREEN SCREEN WIPE
  // ==========================================================================
  const navigateToSection = (targetSectionId) => {
    if (!transitionWipe) return;

    // 1. Trigger the red transition sweep screen to slide in
    transitionWipe.classList.remove('slide-out');
    transitionWipe.classList.add('animating');

    // Close the navigation drawer menu during transition
    closeMenu();

    // 2. Midway through transition (500ms), toggle section visibility
    setTimeout(() => {
      // Toggle active states on sections
      sections.forEach(section => {
        if (section.id === `section-${targetSectionId}`) {
          section.classList.add('active-section');
          // If returning to Home page, ensure video plays and scroll states are aligned
          if (targetSectionId === 'home') {
            const video = section.querySelector('video');
            if (video) video.play().catch(() => {});
            if (typeof handleScrollEffects === 'function') {
              handleScrollEffects();
            }
          }
        } else {
          section.classList.remove('active-section');
        }
      });

      // Toggle active state classes on the menu items list
      menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('data-section') === targetSectionId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Scroll window to top instantly, bypassing smooth scrolling during page wipe
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }

      // Trigger GSAP stagger reveals if navigating to About page!
      if (targetSectionId === 'about' && typeof gsap !== 'undefined') {
        // Reset properties first to prevent layout jumping
        gsap.set(".about-hero-title h2, .about-hero-title h3, .about-back-btn", { opacity: 0, y: 30 });
        gsap.set(".about-portrait-wrapper", { opacity: 0, scale: 0.95 });
        gsap.set(".about-narrative-wrapper > *", { opacity: 0, y: 20 });

        // Trigger staggered page cascade reveals
        gsap.fromTo(".about-hero-title h2, .about-hero-title h3, .about-back-btn", 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.0, stagger: 0.12, ease: "power3.out", delay: 0.1 }
        );
        
        gsap.fromTo(".about-portrait-wrapper", 
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
        );
        
        gsap.fromTo(".about-narrative-wrapper > *", 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.4 }
        );
      }

      // Trigger GSAP stagger reveals if navigating to a Case Study page!
      if (targetSectionId.startsWith('case-') && typeof gsap !== 'undefined') {
        const sect = `#section-${targetSectionId}`;
        // Reset properties first to prevent layout jumping
        gsap.set(`${sect} .about-back-btn, ${sect} .about-hero-title h2, ${sect} .about-hero-title h3`, { opacity: 0, y: 30 });
        gsap.set(`${sect} .case-metadata-grid .meta-item`, { opacity: 0, y: 20 });
        gsap.set(`${sect} .case-banner-wrapper`, { opacity: 0, scale: 0.98 });
        gsap.set(`${sect} .case-section-row`, { opacity: 0, y: 30 });

        // Trigger staggered page cascade reveals
        gsap.to(`${sect} .about-back-btn, ${sect} .about-hero-title h2, ${sect} .about-hero-title h3`, { opacity: 1, y: 0, duration: 1.0, stagger: 0.1, ease: "power3.out", delay: 0.1 });
        gsap.to(`${sect} .case-metadata-grid .meta-item`, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.2 });
        gsap.to(`${sect} .case-banner-wrapper`, { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.4 });
        gsap.to(`${sect} .case-section-row`, { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: "power3.out", delay: 0.5 });
      }

      // 3. Complete the sweep transition, sliding the red wipe away
      transitionWipe.classList.remove('animating');
      transitionWipe.classList.add('slide-out');
      
      // Reset transition state after slide-out finishes
      setTimeout(() => {
        transitionWipe.classList.remove('slide-out');
      }, 500);

    }, 550); // Matches halfway point of standard transition duration
  };

  // Bind click event handlers to all elements on the page with a data-section attribute
  sectionTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSectionId = trigger.getAttribute('data-section');
      
      // Only transition if target is different from the currently active section
      const targetSection = document.getElementById(`section-${targetSectionId}`);
      if (targetSection && !targetSection.classList.contains('active-section')) {
        navigateToSection(targetSectionId);
      } else {
        closeMenu(); // Just close if clicking current active section
      }
    });
  });

  // ==========================================================================
  // 4. INTERACTIVE VIDEO PLAYER OVERLAY MODAL (STAGE 4)
  // ==========================================================================
  const videoModal = document.getElementById('video-modal');
  const modalCloseOverlay = document.getElementById('modal-close-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalVideoPlayer = document.getElementById('modal-video-player');
  const videoBadgePills = document.querySelectorAll('.video-badge-pill');

  const openVideoModal = (videoUrl) => {
    if (videoModal && modalVideoPlayer) {
      // Set the video source and load it
      modalVideoPlayer.src = videoUrl;
      modalVideoPlayer.load();
      
      // Open the modal container
      videoModal.classList.add('open');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
      if (lenis) lenis.stop();
      
      // Auto play the video
      modalVideoPlayer.play().catch(() => {});
    }
  };

  const closeVideoModal = () => {
    if (videoModal && modalVideoPlayer) {
      // Pause player and wipe source to stop sound instantly
      modalVideoPlayer.pause();
      modalVideoPlayer.src = '';
      
      // Close the container
      videoModal.classList.remove('open');
      document.body.style.overflow = ''; // Re-enable background scrolling
      if (lenis) lenis.start();
    }
  };

  // Bind click handlers to inline video pill tags, portfolio card hover overlays, and trailer edit cards
  const interactiveVideoTriggers = document.querySelectorAll('.video-badge-pill, .card-video-hover, .video-work-card, .open-modal');
  
  interactiveVideoTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const videoUrl = trigger.getAttribute('data-video');
      if (videoUrl) {
        openVideoModal(videoUrl);
      }
    });
  });

  if (modalCloseOverlay) modalCloseOverlay.addEventListener('click', closeVideoModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeVideoModal);

  // Close video modal on ESC keypress
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVideoModal();
    }
  });

  // ==========================================================================
  // 5. HIGH-PERFORMANCE INTERSECTION OBSERVER FOR FADE-UP SCROLL ANIMATIONS
  // ==========================================================================
  // HIGH-PERFORMANCE INTERSECTION OBSERVER FOR FADE-UP SCROLL ANIMATIONS (TRIGGERS IN-VIEW ON SCROLL)
  const initFadeUpObserver = () => {
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    const fadeUpObserverOptions = {
      threshold: 0.1, // More sensitive for snappier dynamic reveals
      rootMargin: '0px 0px -80px 0px' // Sleek trigger bounds
    };
    
    const fadeUpObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Unobserve once animated to prevent infinite layout loops at viewport edges!
        }
      });
    }, fadeUpObserverOptions);
    
    fadeUpElements.forEach(element => {
      fadeUpObserver.observe(element);
    });
  };

  // ==========================================================================
  // 6. SCROLL-DRIVEN OVERLAY & SLIDE-IN ENGINE
  // ==========================================================================
  const weAreContainer = document.querySelector('.we-are-container');
  const videoWrapper = document.querySelector('.video-wrapper');

  const handleScrollEffects = () => {
    const homeSection = document.getElementById('section-home');
    if (!homeSection || !homeSection.classList.contains('active-section')) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // 1. Horizontal slide-in of We Are content container
    // Starts at scrollY = 0 (100% translated right, offscreen)
    // Finishes completely at scrollY = windowHeight / 2 (0% translated, top reaches middle of screen)
    const limit = windowHeight / 2;
    const progress = Math.min(scrollY / limit, 1);
    const translateX = (1 - progress) * 100;

    if (weAreContainer) {
      weAreContainer.style.transform = `translate3d(${translateX}%, 0, 0)`;
    }

    // 2. GPU Optimization: Toggle visibility of the fixed hero video wrapper
    // Only keep it visible/rendering when it is within the active fold
    if (videoWrapper) {
      if (scrollY >= windowHeight) {
        videoWrapper.style.visibility = 'hidden';
      } else {
        videoWrapper.style.visibility = 'visible';
      }
    }

    // 3. Double-Horizontal Scroll Parallax for Bottom Banner (CREATE / ART DIFFFERENT)
    const workSection = document.querySelector('.work-section');
    const solidTitle = document.getElementById('parallax-solid');
    const outlineTitle = document.getElementById('parallax-outline');
    
    if (workSection && (solidTitle || outlineTitle)) {
      const rect = workSection.getBoundingClientRect();
      
      // Check if work section is in viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        const totalDist = rect.height + windowHeight;
        const progressDist = (windowHeight - rect.top) / totalDist;
        
        // Premium horizontal translation: solid slides left, outlined slides right
        const maxOffset = 180; // beautiful translation range in pixels
        const transXSolid = (0.5 - progressDist) * maxOffset;
        const transXOutline = (progressDist - 0.5) * maxOffset;
        
        if (solidTitle) {
          solidTitle.style.transform = `translate3d(${transXSolid}px, 0, 0)`;
        }
        if (outlineTitle) {
          outlineTitle.style.transform = `translate3d(${transXOutline}px, 0, 0)`;
        }
      }
    }


  };

  // Assign to global closure so transition router can invoke it
  window.handleScrollEffects = handleScrollEffects;

  // ==========================================================================
  // 7. GSAP SCROLLTRIGGER HORIZONTAL PINNED SHOWCASE ENGINE (STAGE 16 UPGRADE)
  // ==========================================================================
  const videoSection = document.getElementById('section-video-editing');
  const horizontalTrack = videoSection ? videoSection.querySelector('.horizontal-track') : null;
  const cards = videoSection ? videoSection.querySelectorAll('.video-work-card') : [];

  // Active card proximity scaling & opacity modifiers
  const updateCardProximityStates = () => {
    const viewportCenter = window.innerWidth / 2;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(viewportCenter - cardCenter);
      const threshold = window.innerWidth * 0.4; // Proximity detection bounds

      // Check if mouse is hovering card
      const isHovered = card.matches(':hover');

      if (distance < threshold) {
        const progress = 1 - (distance / threshold); // 0 to 1 mapping
        
        // Active states: scale from 1.0 to 1.05, opacity from 0.6 to 1.0
        const scaleValue = 1 + (progress * 0.05);
        const opacityValue = 0.6 + (progress * 0.4);

        card.style.opacity = opacityValue;
        
        if (isHovered) {
          card.style.transform = `scale(1.08)`;
        } else {
          card.style.transform = `scale(${scaleValue})`;
        }
        card.classList.add('active-card');
      } else {
        card.style.opacity = '0.6';
        if (isHovered) {
          card.style.transform = `scale(1.04)`;
        } else {
          card.style.transform = 'scale(1)';
        }
        card.classList.remove('active-card');
      }
    });
  };

  // Subtle 3D card parallax translates for videos inside container
  const handleCardParallax = () => {
    const windowWidth = window.innerWidth;

    cards.forEach(card => {
      const video = card.querySelector('.video-preview');
      if (video) {
        const rect = card.getBoundingClientRect();
        const cardLeft = rect.left;
        
        // Horizontal progress: -1 (fully offscreen left) to 1 (fully offscreen right)
        const progress = (cardLeft / windowWidth) * 2 - 1;
        
        // Subtle translate opposite to horizontal track travel direction
        const maxParallaxX = 35; // 35px translation limit
        const parallaxX = progress * maxParallaxX;

        video.style.transform = `scale(1.12) translate3d(${parallaxX}px, 0, 0)`;
      }
    });
  };

  // Register ScrollTrigger to sync with Lenis
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      
      gsap.ticker.lagSmoothing(0);
    }

    // Setup horizontal pinning using GSAP matchMedia context
    if (videoSection && horizontalTrack && cards.length > 0) {
      let mm = gsap.matchMedia();

      // Desktop & Tablet Viewports: Horizontal Pinned scroll timeline
      mm.add("(min-width: 768px)", () => {
        // Reset vertical stacking overrides
        gsap.set(horizontalTrack, { clearProps: "all" });
        gsap.set(cards, { clearProps: "all" });
        cards.forEach(card => {
          const video = card.querySelector('.video-preview');
          if (video) gsap.set(video, { clearProps: "all" });
        });

        const getScrollAmount = () => {
          const trackWidth = horizontalTrack.scrollWidth;
          const windowWidth = window.innerWidth;
          return -(trackWidth - windowWidth);
        };

        // Standard ScrollTrigger Horizontal Pinned Scroll
        gsap.to(horizontalTrack, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: videoSection,
            pin: true,
            scrub: 1.2, // Cinematic inertial scrubbing deceleration
            start: "top top",
            end: () => `+=${horizontalTrack.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true, // Perfect resize calculations
            snap: {
              snapTo: 1 / (cards.length - 1),
              duration: { min: 0.2, max: 0.5 },
              delay: 0.15,
              ease: "power2.out"
            },
            onUpdate: (self) => {
              // 1. Update luxury progress bar indicator
              gsap.set(".video-scroll-progress-bar", { width: `${self.progress * 100}%` });
              
              // 2. Active centered scale & opacity triggers
              updateCardProximityStates();
              
              // 3. Dynamic subtle depth parallax
              handleCardParallax();
            }
          }
        });

        // Add smooth section entrance reveal
        gsap.fromTo(horizontalTrack,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: videoSection,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );

        // Bind immediate hover proximity listeners to cards
        cards.forEach(card => {
          card.addEventListener('mouseenter', updateCardProximityStates);
          card.addEventListener('mouseleave', updateCardProximityStates);
        });

        // Trigger initial calculations
        updateCardProximityStates();
        handleCardParallax();
      });

      // Mobile Viewports: fallback cleanly to stacked vertical cards
      mm.add("(max-width: 767px)", () => {
        gsap.set(horizontalTrack, { clearProps: "all" });
        gsap.set(cards, { clearProps: "all" });
        cards.forEach(card => {
          const video = card.querySelector('.video-preview');
          if (video) gsap.set(video, { clearProps: "all" });
          
          card.removeEventListener('mouseenter', updateCardProximityStates);
          card.removeEventListener('mouseleave', updateCardProximityStates);
        });
      });
    }
  }

  // Run on scroll: sync directly with Lenis for absolute frame precision if active, fallback to native window scroll
  if (lenis) {
    lenis.on('scroll', () => {
      handleScrollEffects();
    });
  } else {
    window.addEventListener('scroll', () => {
      requestAnimationFrame(handleScrollEffects);
    });
  }


  // ==========================================================================
  // 8. INTERACTIVE NETFLIX CASE STUDY EXPLORER SYSTEM
  // ==========================================================================
  const initNetflixCaseStudy = () => {
    // A. Dual-Mode Switcher Logic
    const modeButtons = document.querySelectorAll('.case-mode-btn');
    const switcherSlider = document.querySelector('.switcher-bg-slider');
    const panes = document.querySelectorAll('.case-pane');

    const updateSwitcherSlider = (activeBtn) => {
      if (switcherSlider && activeBtn) {
        switcherSlider.style.width = `${activeBtn.offsetWidth}px`;
        switcherSlider.style.left = `${activeBtn.offsetLeft}px`;
      }
    };

    // Initial position on load
    const activeModeBtn = document.querySelector('.case-mode-btn.active');
    if (activeModeBtn) {
      setTimeout(() => updateSwitcherSlider(activeModeBtn), 300);
    }

    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateSwitcherSlider(btn);

        panes.forEach(pane => {
          pane.classList.remove('active');
          if (pane.id === `netflix-pane-${mode}`) {
            pane.classList.add('active');
            
            // GSAP entrance transition for the activated pane
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(pane, 
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
              );
            }
          }
        });
        
        // Refresh ScrollTrigger calculations since the page height has changed
        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 200);
        }
      });
    });

    // B. Hotspot Device Explorer Logic (Scoped & Conflict-Free)
    const hotspots = document.querySelectorAll('.hotspot-dot');
    const detailCards = document.querySelectorAll('.hotspot-details-card');
    const explorerScreenImg = document.querySelector('.explorer-phone-screen-img');

    // Hotspot ID to high-fidelity design screen mapping (Netflix)
    const screenMapping = {
      '1': 'netflix_screen_1.png', // Stranger Things video player view
      '2': 'netflix_screen_3.png', // Shoppable drawer open showing Max's Retro Jacket
      '3': 'netflix_screen_5.png', // Biometric verification payment success screen
      '4': 'netflix_screen_6.png'  // Social Fan Community Hub forum page
    };

    hotspots.forEach(dot => {
      dot.addEventListener('click', () => {
        const hotspotId = dot.getAttribute('data-hotspot');
        const parentSection = dot.closest('.case-study-section');
        if (!parentSection) return;
        
        // Toggle active hotspot inside this case study container only
        const localHotspots = parentSection.querySelectorAll('.hotspot-dot');
        localHotspots.forEach(h => h.classList.remove('active'));
        dot.classList.add('active');

        // Netflix image switching
        const localImg = parentSection.querySelector('.explorer-phone-screen-img');
        if (localImg && screenMapping[hotspotId]) {
          localImg.setAttribute('src', screenMapping[hotspotId]);
          
          // GSAP fade-in effect on screen swap for a smooth micro-animation
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(localImg,
              { opacity: 0.8 },
              { opacity: 1, duration: 0.4, ease: "power2.out" }
            );
          }
        }

        // Toggle active details card inside this case study container only
        const localCards = parentSection.querySelectorAll('.hotspot-details-card');
        localCards.forEach(card => {
          card.classList.remove('active');
          if (card.getAttribute('data-card') === hotspotId) {
            card.classList.add('active');
            
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card,
                { opacity: 0, x: 15 },
                { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
              );
            }
          }
        });
      });
    });

    // B.1 Live Figma Toggle Logic (Scoped & Conflict-Free)
    const deviceTabButtons = document.querySelectorAll('.device-tab-btn');
    const netflixFigmaUrl = "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FvQCGfU9G9ETS97J9UpUUIb%2FDesign-Challenge_1%3Fpage-id%3D273%253A2118%26type%3Ddesign%26node-id%3D273-3120%26viewport%3D1461%252C278%252C0.18%26t%3Dx5CiHHv1QnEC62T8-1%26scaling%3Dscale-down%26starting-point-node-id%3D273%253A2151%26mode%3Ddesign&hide-ui=1";

    deviceTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-device-tab');
        const parentSection = btn.closest('.case-study-section');
        if (!parentSection) return;

        const localTabButtons = parentSection.querySelectorAll('.device-tab-btn');
        localTabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const devicePhoneShell = parentSection.querySelector('.device-phone-shell');
        const explorerContent = parentSection.querySelector('.device-explorer-content');
        const figmaPane = parentSection.querySelector('.device-figma-pane');
        const figmaIframe = parentSection.querySelector('.device-figma-iframe');
        const figmaLoading = parentSection.querySelector('.figma-loading-overlay');

        if (tab === 'figma') {
          if (devicePhoneShell) devicePhoneShell.classList.add('figma-active');
          if (explorerContent) explorerContent.classList.remove('active');
          if (figmaPane) figmaPane.classList.add('active');

          if (figmaIframe && !figmaIframe.getAttribute('src')) {
            figmaIframe.setAttribute('src', netflixFigmaUrl);
            figmaIframe.addEventListener('load', () => {
              if (figmaLoading) figmaLoading.classList.add('loaded');
            });
          }
        } else {
          if (devicePhoneShell) devicePhoneShell.classList.remove('figma-active');
          if (explorerContent) explorerContent.classList.add('active');
          if (figmaPane) figmaPane.classList.remove('active');
        }
      });
    });

    // C. A/B Testing Card Switcher Logic (Scoped & Conflict-Free)
    const abButtons = document.querySelectorAll('.ab-toggle-btn');

    abButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const abTarget = btn.getAttribute('data-ab');
        const parentSection = btn.closest('.case-study-section');
        if (!parentSection) return;

        const localAbButtons = parentSection.querySelectorAll('.ab-toggle-btn');
        localAbButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const localCards = parentSection.querySelectorAll('.ab-comparison-card');
        localCards.forEach(card => {
          card.classList.remove('active');
          if (card.id === `ab-card-${abTarget}`) {
            card.classList.add('active');
            
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card,
                { opacity: 0, scale: 0.98, y: 10 },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" }
              );
            }
          }
        });
      });
    });

    // D. Process Stepper Logic (Scoped & Conflict-Free)
    const stepNodes = document.querySelectorAll('.step-node');

    stepNodes.forEach((node) => {
      node.addEventListener('click', () => {
        const stepValue = node.getAttribute('data-step');
        const parentStepper = node.closest('.stepper-widget');
        if (!parentStepper) return;

        const localNodes = parentStepper.querySelectorAll('.step-node');
        const localCards = parentStepper.querySelectorAll('.step-display-card');
        const localProgress = parentStepper.querySelector('.stepper-line-progress');

        // Find current step index (1-based)
        let activeIdx = 1;
        localNodes.forEach((n, idx) => {
          if (n === node) {
            activeIdx = idx + 1;
          }
        });

        // Update nodes classes
        localNodes.forEach((n, idx) => {
          n.classList.remove('active', 'completed');
          if (idx + 1 < activeIdx) {
            n.classList.add('completed');
          } else if (idx + 1 === activeIdx) {
            n.classList.add('active');
          }
        });

        // Update timeline progress bar width
        if (localProgress && localNodes.length > 1) {
          const percentage = ((activeIdx - 1) / (localNodes.length - 1)) * 100;
          localProgress.style.width = `${percentage}%`;
        }

        // Swap display cards
        localCards.forEach(card => {
          card.classList.remove('active');
          if (card.getAttribute('data-step-card') === stepValue) {
            card.classList.add('active');
            
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
              );
            }
          }
        });
      });
    });

    // E. Deep Dive Accordions Toggle Logic
    const accordions = document.querySelectorAll('.case-accordion');

    accordions.forEach(accordion => {
      const trigger = accordion.querySelector('.accordion-trigger');
      const content = accordion.querySelector('.accordion-content');

      if (trigger && content) {
        trigger.addEventListener('click', () => {
          const isOpen = accordion.classList.contains('open');
          
          // Collapse all first (accordion mode)
          accordions.forEach(acc => {
            acc.classList.remove('open');
            const accContent = acc.querySelector('.accordion-content');
            if (accContent) accContent.style.maxHeight = null;
          });

          // Toggle clicked
          if (!isOpen) {
            accordion.classList.add('open');
            content.style.maxHeight = `${content.scrollHeight}px`;
          } else {
            accordion.classList.remove('open');
            content.style.maxHeight = null;
          }

          // Dynamic ScrollTrigger refresh
          if (typeof ScrollTrigger !== 'undefined') {
            setTimeout(() => ScrollTrigger.refresh(), 500);
          }
        });
      }
    });

    // Handle recalculation on resize for modes
    window.addEventListener('resize', () => {
      const activeBtn = document.querySelector('.case-mode-btn.active');
      if (activeBtn) updateSwitcherSlider(activeBtn);
    });
  };

  // Run on resize
  window.addEventListener('resize', handleScrollEffects);

  // Initialize immediately on load/render
  handleScrollEffects();
  initNetflixCaseStudy();

  // ==========================================================================
  // 9. INTERACTIVE CENDROL CASE STUDY EXPLORER SYSTEM
  // ==========================================================================
  const initCendrolCaseStudy = () => {

    // A. CRM Mode Switcher (Tour ↔ Deep Dive)
    const crmModeSwitcher = document.getElementById('crm-mode-switcher');
    if (!crmModeSwitcher) return; // CRM section not present

    const crmModeButtons = crmModeSwitcher.querySelectorAll('.case-mode-btn');
    const crmSwitcherSlider = crmModeSwitcher.querySelector('.switcher-bg-slider');
    const crmTourPane = document.getElementById('crm-pane-tour');
    const crmDeepPane = document.getElementById('crm-pane-deep');

    const updateCRMSlider = (activeBtn) => {
      if (crmSwitcherSlider && activeBtn) {
        crmSwitcherSlider.style.width = `${activeBtn.offsetWidth}px`;
        crmSwitcherSlider.style.left = `${activeBtn.offsetLeft}px`;
      }
    };

    const activeCRMBtn = crmModeSwitcher.querySelector('.case-mode-btn.active');
    if (activeCRMBtn) setTimeout(() => updateCRMSlider(activeCRMBtn), 300);

    crmModeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        crmModeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateCRMSlider(btn);

        const showPane = mode === 'tour' ? crmTourPane : crmDeepPane;
        const hidePane = mode === 'tour' ? crmDeepPane : crmTourPane;

        if (hidePane) hidePane.classList.remove('active');
        if (showPane) {
          showPane.classList.add('active');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(showPane, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
          }
        }

        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 200);
        }
      });
    });

    window.addEventListener('resize', () => {
      const activeBtn = crmModeSwitcher.querySelector('.case-mode-btn.active');
      if (activeBtn) updateCRMSlider(activeBtn);
    });

    // B. Cendrol Split-Screen Chapters Dashboard Tab Click Logic
    const chapterTabs = document.querySelectorAll('.cendrol-chapter-tab');
    const dashboardVideo = document.getElementById('cendrol-dashboard-video');
    const dashboardQuote = document.getElementById('cendrol-dashboard-quote');
    const dashboardChallenge = document.getElementById('cendrol-dashboard-challenge');
    const dashboardSolution = document.getElementById('cendrol-dashboard-solution');
    const dashboardWorkstream = document.getElementById('cendrol-hud-workstream-val');

    const cendrolChapterData = {
      '1': {
        video: 'https://framerusercontent.com/assets/mYPTiswtqcC9hDxMgdbGcpoWVT8.mp4',
        workstream: '01_SUBMISSIONS',
        quote: '"Engineers were less concerned about submitting expenses and more concerned about tracking approvals."',
        challenge: 'Reducing receipt logging fields to capture receipts and parameters under 10 seconds in active construction zones.',
        solution: 'Designed a rapid 10-second mobile photo flow that automatically pre-fills parameters and minimizes active input.'
      },
      '2': {
        video: 'https://framerusercontent.com/assets/TZ7ytTpVPqZXYUNLzkUDLc53Lo.mp4',
        workstream: '02_ADMIN_CONTROL',
        quote: '"The administrative teams was swamped by manual filtering and verification layouts, which delayed claims."',
        challenge: 'Sorting, filtering, and cross-checking dozens of manual receipts against active site schedules manually.',
        solution: 'Built a unified CFO admin dashboard featuring rapid search, multi-claim filtering, and direct approval triggers.'
      },
      '3': {
        video: 'https://framerusercontent.com/assets/uprluZWUo2fOOM7JyDmVgfNyII.mp4',
        workstream: '03_PAYOUT_STATES',
        quote: '"Every payout delay created real mental stress for engineers who had spent out-of-pocket for site services."',
        challenge: 'Engineers had zero visibility into where their submitted expenses stood, causing severe friction.',
        solution: 'Introduced automatic real-time status trackers and progress updates that engineers can query instantly.'
      },
      '4': {
        video: 'https://framerusercontent.com/assets/p4j0AqBiupO0NvSzNiUmIDiyMM.mp4',
        workstream: '04_PROGRESSION',
        quote: '"By defining clear status progression stages, we eliminated bottleneck stages entirely."',
        challenge: 'Stages in the old B2B CRM felt disconnected and lacked visual progression cues for active operations.',
        solution: 'Mapped reimbursement phases onto a clear, linear timeline highlighting active bottlenecks and next steps.'
      },
      '5': {
        video: 'https://framerusercontent.com/assets/P9LeKh4t0jWLrI4VLc1lNFz1o.mp4',
        workstream: '05_REFLECTIONS',
        quote: '"The redesign was about taking a fragmented process and making it clear, legible, and structured."',
        challenge: 'Ensuring on-site teams actually adopted the B2B tracker without feeling it was administrative busywork.',
        solution: 'Empowered site teams with supportive expense tools, leading to a 79% adoption rate within weeks.'
      }
    };

    const swapText = (element, newText) => {
      if (!element) return;
      if (typeof gsap !== 'undefined') {
        gsap.to(element, {
          opacity: 0,
          y: -5,
          duration: 0.2,
          onComplete: () => {
            element.innerHTML = newText;
            gsap.fromTo(element, 
              { opacity: 0, y: 5 },
              { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
            );
          }
        });
      } else {
        element.innerHTML = newText;
      }
    };

    chapterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const chapter = tab.getAttribute('data-chapter');
        if (!chapter || !cendrolChapterData[chapter]) return;

        // Toggle active tab classes
        chapterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const data = cendrolChapterData[chapter];

        // 1. Swap video with premium fade out/in animation
        if (dashboardVideo) {
          if (typeof gsap !== 'undefined') {
            gsap.to(dashboardVideo, {
              opacity: 0,
              duration: 0.25,
              onComplete: () => {
                dashboardVideo.setAttribute('src', data.video);
                dashboardVideo.load();
                dashboardVideo.play().catch(() => {});
                gsap.to(dashboardVideo, { opacity: 1, duration: 0.35 });
              }
            });
          } else {
            dashboardVideo.setAttribute('src', data.video);
            dashboardVideo.load();
            dashboardVideo.play().catch(() => {});
          }
        }

        // 2. Swap text details using custom micro-animation
        swapText(dashboardQuote, data.quote);
        swapText(dashboardChallenge, data.challenge);
        swapText(dashboardSolution, data.solution);

        if (dashboardWorkstream) {
          dashboardWorkstream.textContent = data.workstream;
        }

        // 3. Recalculate GSAP ScrollTrigger since content height or state updated
        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 500);
        }
      });
    });
  };

  initCendrolCaseStudy();

  // ==========================================================================
  // 9.5. INTERACTIVE CENDROL MOBILE B2B CRM CASE STUDY SYSTEM
  // ==========================================================================
  const initCendrolCRMCaseStudy = () => {
    // A. CRM Mode Switcher (Tour ↔ Deep Dive)
    const authModeSwitcher = document.getElementById('auth-mode-switcher');
    if (!authModeSwitcher) return;

    const modeButtons = authModeSwitcher.querySelectorAll('.case-mode-btn');
    const slider = authModeSwitcher.querySelector('.auth-slider');
    const tourPane = document.getElementById('auth-pane-tour');
    const deepPane = document.getElementById('auth-pane-deep');

    const updateSlider = (activeBtn) => {
      if (slider && activeBtn) {
        slider.style.width = `${activeBtn.offsetWidth}px`;
        slider.style.left = `${activeBtn.offsetLeft}px`;
      }
    };

    const activeBtn = authModeSwitcher.querySelector('.case-mode-btn.active');
    if (activeBtn) setTimeout(() => updateSlider(activeBtn), 300);

    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateSlider(btn);

        const showPane = mode === 'auth-tour' ? tourPane : deepPane;
        const hidePane = mode === 'auth-tour' ? deepPane : tourPane;

        if (hidePane) hidePane.classList.remove('active');
        if (showPane) {
          showPane.classList.add('active');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(showPane, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
          }
        }

        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 200);
        }
      });
    });

    window.addEventListener('resize', () => {
      const activeBtn = authModeSwitcher.querySelector('.case-mode-btn.active');
      if (activeBtn) updateSlider(activeBtn);
    });

    // B. Simulator Interactivity (Tabs Switching)
    const crmTabs = document.querySelectorAll('.crm-tab-btn');
    const crmContents = document.querySelectorAll('.crm-app-content');
    const crmCards = document.querySelectorAll('.crm-details-card');

    crmTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-crm-tab');
        crmTabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');

        // Swap Content
        crmContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === `crm-tab-content-${tabName}`) {
            content.classList.add('active');
          }
        });

        // Swap Details Card
        crmCards.forEach(card => {
          card.classList.remove('active');
          if (card.getAttribute('data-crm-card') === tabName) {
            card.classList.add('active');
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card, { opacity: 0, x: 15 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
            }
          }
        });
      });
    });

    // C. Live Toast trigger overlays
    const toastBox = document.getElementById('crm-toast-box');
    const toastText = document.getElementById('crm-toast-text-content');
    let toastTimeout = null;

    const showToast = (message, type) => {
      if (!toastBox) return;
      if (toastTimeout) clearTimeout(toastTimeout);

      toastBox.className = `crm-toast-overlay ${type} visible`;
      if (toastText) toastText.textContent = message;

      toastTimeout = setTimeout(() => {
        toastBox.classList.remove('visible');
      }, 2500);
    };

    // Log site visits click handler
    const visitButtons = document.querySelectorAll('.log-visit-btn');
    visitButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-toast');
        let msg = "Site visit logged successfully!";
        if (target === 'visit-apex') msg = "Apex Towers site visit logged! Geo-checked.";
        if (target === 'visit-prestige') msg = "Prestige Green signoff logged! Syncing...";
        showToast(msg, 'success');
      });
    });

    // Checkboxes change handler
    const taskCheckboxes = document.querySelectorAll('.crm-checkbox');
    taskCheckboxes.forEach(chk => {
      chk.addEventListener('change', () => {
        if (chk.checked) {
          const target = chk.getAttribute('data-toast');
          let msg = "Task marked as complete!";
          if (target === 'task-wa') msg = "Budget sent! Activity logged on WhatsApp channel.";
          if (target === 'task-call') msg = "Call activity logged! Status: Completed.";
          if (target === 'task-mail') msg = "CFO Contract email logged! Status: Signed.";
          showToast(msg, 'success');
        }
      });
    });

    // Toast triggers buttons
    const triggerButtons = document.querySelectorAll('.toast-trigger-btn');
    triggerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-toast-type');
        let msg = "Alert triggered!";
        if (type === 'success') msg = "Success: Location verified! geo-pin saved.";
        if (type === 'warning') msg = "Warning: Weak network detected. Logged offline.";
        if (type === 'error') msg = "Error: Authentication expired. Re-log required.";
        showToast(msg, type);
      });
    });
  };

  initCendrolCRMCaseStudy();

  // ==========================================================================
  // 10. INTERACTIVE UPSC COMPANION CASE STUDY SYSTEM
  // ==========================================================================
  const initUPSCCompanion = () => {
    // A. UPSC Mode Switcher (Tour ↔ Deep Dive)
    const upscModeSwitcher = document.querySelector('.upsc-mode-switcher');
    if (!upscModeSwitcher) return;

    const modeButtons = upscModeSwitcher.querySelectorAll('.case-mode-btn');
    const slider = upscModeSwitcher.querySelector('.upsc-slider');
    const tourPane = document.getElementById('upsc-pane-upsc-tour');
    const deepPane = document.getElementById('upsc-pane-upsc-deep');

    const updateSlider = (activeBtn) => {
      if (slider && activeBtn) {
        slider.style.width = `${activeBtn.offsetWidth}px`;
        slider.style.left = `${activeBtn.offsetLeft}px`;
      }
    };

    // Set initial position
    const activeBtn = upscModeSwitcher.querySelector('.case-mode-btn.active');
    if (activeBtn) setTimeout(() => updateSlider(activeBtn), 300);

    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateSlider(btn);

        const showPane = mode === 'upsc-tour' ? tourPane : deepPane;
        const hidePane = mode === 'upsc-tour' ? deepPane : tourPane;

        if (hidePane) hidePane.classList.remove('active');
        if (showPane) {
          showPane.classList.add('active');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(showPane, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
          }
        }

        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 200);
        }
      });
    });

    window.addEventListener('resize', () => {
      const activeBtn = upscModeSwitcher.querySelector('.case-mode-btn.active');
      if (activeBtn) updateSlider(activeBtn);
    });

    // B. Yooki AI Conversational Mind-Map Simulator Data
    const yookiSimulatorData = {
      polity: {
        title: 'Polity AI Assistant',
        aspirantText: 'How should I approach Panchayati Raj amendments for GS Paper II?',
        aiText: 'Focus on the 73rd and 74th Amendments. Combine this with the dynamic link to Federalism under Economy. Make sure to cross-reference Fiscal Devolution patterns from the 15th Finance Commission. This covers approx 12-15 marks annually.',
        rec: 'Subject overlap detected: Link <span>Polity (Panchayati Raj)</span> with <span>Economy (Fiscal Devolution)</span> to solve 3 PYQs from last 5 years.',
        alert: '<span>Good Progress:</span> You scored 82% in yesterday\'s Polity daily quiz. Keep up the consistency.'
      },
      economy: {
        title: 'Economy AI Assistant',
        aspirantText: 'Where does Fiscal Federalism link with Polity in the syllabus?',
        aiText: 'Fiscal Federalism directly intersects with Article 280 (Finance Commission) and GST Council under Polity. Study tax devolution models, vertical vs horizontal imbalances, and recent state concerns on cooperative federalism.',
        rec: 'Recommended study track: Review the <span>GST Council voting share structure</span> under Article 279A, then attempt the Economy Mock Test.',
        alert: '<span>Concept Bottleneck:</span> Fiscal devolution has a low retention score. Attempting a short 5-question revision card session is recommended.'
      },
      environment: {
        title: 'Environment AI Assistant',
        aspirantText: 'Can we review my preparation levels for Environment and Ecology?',
        aiText: 'Your Environment & Ecology module is currently at 41% mastery. Standard conventions like UNFCCC COP decisions and wildlife conservation reserves have been neglected recently. You last studied this 18 days ago.',
        rec: 'Critical Focus: Revise <span>UNFCCC Paris Agreement targets</span> and India\'s updated NDC commitments before proceeding to other topics.',
        alert: '<span>Prep Alert:</span> Environment is severely neglected. Coverage is only 12% in the last month (Target is 30%+).'
      },
      history: {
        title: 'History AI Assistant',
        aspirantText: 'How do I memorize the complex timeline from Swadeshi to Non-Cooperation Movement?',
        aiText: 'Do not memorize rote dates. Instead, build associative node tracks: partition of Bengal (1905) led to Swadeshi, which paved the way for Home Rule League (1916), culminating in the Rowlatt Satyagraha and Non-Cooperation (1920). Let\'s walk through the transition.',
        rec: 'Visual Aid: Open the <span>Interactive Swadeshi Timeline Mind-Map</span> in Yooki to view the causes, leaders, and consequences visually.',
        alert: '<span>Revision Overdue:</span> Modern History has 4 pending review cards. Schedule a 10-minute active recall session tonight.'
      },
      current: {
        title: 'Current Affairs Daily',
        aspirantText: 'What are the main headlines from today\'s news that I need to connect to my GS Syllabus?',
        aiText: 'Today\'s Supreme Court ruling on cooperative federalism and legislative powers is highly critical. It maps directly to GS Paper II (Polity - Federal Structure). I have already highlighted the key briefs and mapped them to your Polity revision deck.',
        rec: 'Study Alert: A new Supreme Court federal ruling has been tagged directly to your <span>Polity Node</span>. Click to view the summary briefing.',
        alert: '<span>Streak Alert:</span> Current Affairs daily summary has been checked. 12-day reading streak maintained!'
      }
    };

    let typingInterval = null;

    const runTypewriter = (element, text, speed, callback) => {
      if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
      }
      element.textContent = '';
      element.classList.add('yooki-typewriter-cursor');
      let i = 0;
      typingInterval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          
          // Auto scroll the chat body to bottom during typing
          const chatBody = document.getElementById('yooki-chat-stream');
          if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
          }
        } else {
          clearInterval(typingInterval);
          typingInterval = null;
          element.classList.remove('yooki-typewriter-cursor');
          if (callback) callback();
        }
      }, speed);
    };

    const subjectNodes = document.querySelectorAll('.yooki-subject-node');
    const chatTitle = document.getElementById('yooki-chat-title-text');
    const chatStream = document.getElementById('yooki-chat-stream');
    const recText = document.getElementById('yooki-insight-rec');
    const alertText = document.getElementById('yooki-insight-alert');

    const selectNode = (nodeId, isInitial = false) => {
      const data = yookiSimulatorData[nodeId];
      if (!data) return;

      // Update active button
      subjectNodes.forEach(node => {
        if (node.getAttribute('data-yooki-node') === nodeId) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });

      // Update title
      if (chatTitle) chatTitle.textContent = data.title;

      // Update insights immediately
      if (recText) recText.innerHTML = data.rec;
      if (alertText) alertText.innerHTML = data.alert;

      // Premium micro-animation for insights
      if (typeof gsap !== 'undefined') {
        gsap.fromTo('.yooki-insight-box',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.1 }
        );
      }

      // Re-create the bubbles
      if (chatStream) {
        chatStream.innerHTML = '';

        // 1. Aspirant Bubble
        const aspirantBubble = document.createElement('div');
        aspirantBubble.className = 'yooki-chat-bubble aspirant';
        aspirantBubble.innerHTML = `
          <span class="yooki-bubble-sender">ASPIRANT</span>
          <div class="yooki-bubble-text">${data.aspirantText}</div>
        `;
        chatStream.appendChild(aspirantBubble);

        // 2. AI Bubble
        const aiBubble = document.createElement('div');
        aiBubble.className = 'yooki-chat-bubble ai';
        aiBubble.innerHTML = `
          <span class="yooki-bubble-sender">YOOKI AI</span>
          <div class="yooki-bubble-text" id="yooki-active-typewriter"></div>
        `;
        chatStream.appendChild(aiBubble);

        const typewriterEl = aiBubble.querySelector('#yooki-active-typewriter');
        
        if (isInitial) {
          typewriterEl.textContent = data.aiText;
          chatStream.scrollTop = chatStream.scrollHeight;
        } else {
          runTypewriter(typewriterEl, data.aiText, 15);
        }
      }
    };

    subjectNodes.forEach(node => {
      node.addEventListener('click', () => {
        const nodeId = node.getAttribute('data-yooki-node');
        selectNode(nodeId);
      });
    });

    // Initialize with Polity default state (no typewriter immediately on load so it looks ready)
    selectNode('polity', true);

    // C. 4-Stage Study Stepper Logic
    const stepNodes = document.querySelectorAll('.upsc-step-node');
    const stepCards = document.querySelectorAll('[data-step-card].step-display-card');
    const progressBar = document.querySelector('.upsc-progress-line');

    stepNodes.forEach((node) => {
      node.addEventListener('click', () => {
        const stepValue = node.getAttribute('data-step');
        if (!stepValue) return;

        const parentStepper = node.closest('.upsc-stepper');
        if (!parentStepper) return;

        const localNodes = parentStepper.querySelectorAll('.upsc-step-node');
        const localCards = parentStepper.querySelectorAll('.step-display-card');

        // Find step index (1-based)
        let activeIdx = 1;
        localNodes.forEach((n, idx) => {
          if (n === node) {
            activeIdx = idx + 1;
          }
        });

        // Update classes on stepper nodes
        localNodes.forEach((n, idx) => {
          n.classList.remove('active', 'completed');
          if (idx + 1 < activeIdx) {
            n.classList.add('completed');
          } else if (idx + 1 === activeIdx) {
            n.classList.add('active');
          }
        });

        // Update timeline progress bar fill
        if (progressBar && localNodes.length > 1) {
          const percentage = ((activeIdx - 1) / (localNodes.length - 1)) * 100;
          progressBar.style.width = `${percentage}%`;
        }

        // Swap cards
        localCards.forEach(card => {
          card.classList.remove('active');
          if (card.getAttribute('data-step-card') === stepValue) {
            card.classList.add('active');
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
            }
          }
        });
      });
    });
  };

  initUPSCCompanion();

  // ==========================================================================
  // 11. INTERACTIVE WORK PAGE SWITCHER SYSTEM
  // ==========================================================================
  const initWorkPageSwitcher = () => {
    const workSwitcher = document.getElementById('work-page-switcher');
    if (!workSwitcher) return;

    const switcherBtns = workSwitcher.querySelectorAll('.case-mode-btn');
    const slider = workSwitcher.querySelector('.switcher-bg-slider');
    const panes = document.querySelectorAll('.work-pane');

    const updateSlider = (activeBtn) => {
      if (slider && activeBtn) {
        slider.style.width = `${activeBtn.offsetWidth}px`;
        slider.style.left = `${activeBtn.offsetLeft}px`;
      }
    };

    // Set initial position on render/load
    const activeBtn = workSwitcher.querySelector('.case-mode-btn.active');
    if (activeBtn) {
      setTimeout(() => updateSlider(activeBtn), 300);
    }

    switcherBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-work-tab');
        switcherBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateSlider(btn);

        panes.forEach(pane => {
          pane.classList.remove('active');
          if (pane.id === `work-pane-${tab}`) {
            pane.classList.add('active');
            
            // GSAP entrance transition for the active work view pane
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(pane, 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
              );
            }
          }
        });

        // Force GSAP ScrollTrigger to recalculate active viewport bounding boxes
        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 250);
        }
      });
    });

    window.addEventListener('resize', () => {
      const activeBtn = workSwitcher.querySelector('.case-mode-btn.active');
      if (activeBtn) updateSlider(activeBtn);
    });
  };

  initWorkPageSwitcher();
};


// Bulletproof interaction engine initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInteractionEngine);
} else {
  initInteractionEngine();
}
