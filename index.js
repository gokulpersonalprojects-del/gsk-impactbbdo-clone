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

  // --- HERO VIDEO PERMISSION FAIL-SAFE ---
  const heroVideo = document.querySelector('.video-banner');
  if (heroVideo) {
    const primaryUrl = "hero_video.mp4";
    const fallbackUrl = "https://impactbbdo.com/wp-content/uploads/2025/06/Intro-Video_1440x734_CLEAN_NO-LOGO.mp4";
    
    const triggerFallback = () => {
      const currentSrc = heroVideo.currentSrc || heroVideo.getAttribute('src') || '';
      if (!currentSrc.includes('hero_video') && currentSrc !== fallbackUrl) {
        heroVideo.removeAttribute('src');
        // Clear all child sources if any exist
        const sources = heroVideo.querySelectorAll('source');
        sources.forEach(source => source.parentNode.removeChild(source));
        
        heroVideo.setAttribute('src', fallbackUrl);
        heroVideo.load();
        heroVideo.play().catch(() => {});
      }
    };

    // Listen for source loading errors (capturing phase is required for source elements)
    heroVideo.addEventListener('error', triggerFallback, true);

    // Immediate fallback trigger if error state is already resolved prior to script load
    if (heroVideo.error || heroVideo.networkState === 4) {
      triggerFallback();
    }

    // Bulletproof backup timer: if video metadata doesn't load in 2.5 seconds, trigger fallback
    const fallbackTimeout = setTimeout(() => {
      if (heroVideo.readyState < 1) { // HAVE_NOTHING
        triggerFallback();
      }
    }, 2500);

    heroVideo.addEventListener('loadedmetadata', () => {
      clearTimeout(fallbackTimeout);
    });
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

    // B. Hotspot Device Explorer Logic
    const hotspots = document.querySelectorAll('.hotspot-dot');
    const detailCards = document.querySelectorAll('.hotspot-details-card');
    const explorerScreenImg = document.querySelector('.explorer-phone-screen-img');

    // Hotspot ID to high-fidelity design screen mapping
    const screenMapping = {
      '1': 'netflix_screen_1.png', // Stranger Things video player view
      '2': 'netflix_screen_3.png', // Shoppable drawer open showing Max's Retro Jacket
      '3': 'netflix_screen_5.png', // Biometric verification payment success screen
      '4': 'netflix_screen_6.png'  // Social Fan Community Hub forum page
    };

    hotspots.forEach(dot => {
      dot.addEventListener('click', () => {
        const hotspotId = dot.getAttribute('data-hotspot');
        
        // Active dot class toggle
        hotspots.forEach(h => h.classList.remove('active'));
        dot.classList.add('active');

        // Swap the background design screen of the phone mockup
        if (explorerScreenImg && screenMapping[hotspotId]) {
          explorerScreenImg.setAttribute('src', screenMapping[hotspotId]);
          
          // GSAP fade-in effect on screen swap for a smooth micro-animation
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(explorerScreenImg,
              { opacity: 0.8 },
              { opacity: 1, duration: 0.4, ease: "power2.out" }
            );
          }
        }

        // Detail card swap animation
        detailCards.forEach(card => {
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

    // B.1 Live Figma Toggle Logic
    const devicePhoneShell = document.querySelector('.device-phone-shell');
    const deviceTabButtons = document.querySelectorAll('.device-tab-btn');
    const explorerContent = document.querySelector('.device-explorer-content');
    const figmaPane = document.querySelector('.device-figma-pane');
    const figmaIframe = document.querySelector('.device-figma-iframe');
    const figmaLoading = document.querySelector('.figma-loading-overlay');
    const figmaUrl = "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FvQCGfU9G9ETS97J9UpUUIb%2FDesign-Challenge_1%3Fpage-id%3D273%253A2118%26type%3Ddesign%26node-id%3D273-3120%26viewport%3D1461%252C278%252C0.18%26t%3Dx5CiHHv1QnEC62T8-1%26scaling%3Dscale-down%26starting-point-node-id%3D273%253A2151%26mode%3Ddesign&hide-ui=1";

    deviceTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-device-tab');
        
        deviceTabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (tab === 'figma') {
          if (devicePhoneShell) devicePhoneShell.classList.add('figma-active');
          if (explorerContent) explorerContent.classList.remove('active');
          if (figmaPane) figmaPane.classList.add('active');

          if (figmaIframe && !figmaIframe.getAttribute('src')) {
            figmaIframe.setAttribute('src', figmaUrl);
            
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

    // C. A/B Testing Card Switcher Logic
    const abButtons = document.querySelectorAll('.ab-toggle-btn');
    const abCards = document.querySelectorAll('.ab-comparison-card');

    abButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const abTarget = btn.getAttribute('data-ab');
        
        abButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        abCards.forEach(card => {
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

    // D. 3-Step Purchase Stepper Logic
    const stepNodes = document.querySelectorAll('.step-node');
    const stepCards = document.querySelectorAll('.step-display-card');
    const timelineProgress = document.querySelector('.stepper-line-progress');

    const updateTimelineProgress = (stepIndex) => {
      if (timelineProgress) {
        // Calculate progress percentage based on step index (1: 0%, 2: 50%, 3: 100%)
        const percentage = ((stepIndex - 1) / (stepNodes.length - 1)) * 100;
        timelineProgress.style.width = `${percentage}%`;
      }
    };

    stepNodes.forEach((node, idx) => {
      node.addEventListener('click', () => {
        const stepNum = parseInt(node.getAttribute('data-step'));
        
        // Update nodes classes
        stepNodes.forEach((n, nIdx) => {
          n.classList.remove('active', 'completed');
          if (nIdx + 1 < stepNum) {
            n.classList.add('completed');
          } else if (nIdx + 1 === stepNum) {
            n.classList.add('active');
          }
        });

        // Update progress bar
        updateTimelineProgress(stepNum);

        // Update step display details
        stepCards.forEach(card => {
          card.classList.remove('active');
          if (parseInt(card.getAttribute('data-step-card')) === stepNum) {
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
};


// Bulletproof interaction engine initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInteractionEngine);
} else {
  initInteractionEngine();
}
