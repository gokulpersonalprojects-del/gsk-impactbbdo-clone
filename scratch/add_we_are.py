import re

path = r'c:\Users\ASUS\Desktop\impactbbdo cone\index.html'
content = open(path, encoding='utf-8').read()

# 1. Structural change: Replace section id="section-home" open tags
content = content.replace(
    '<section class="video-banner-section active-section" id="section-home">',
    '<div class="home-page-container active-section" id="section-home">\n    <div class="video-banner-section">'
)

# 2. Structural change: Replace section-home close tags and inject the We Are section
old_end = """        <!-- Corner Texts spelling "CREATE [ART] DIFFERENT" -->
        <div class="bottom-left-text">CREATE</div>
        <div class="bottom-right-text">DIFFERENT</div>
      </div>
    </section>"""

new_end = """        <!-- Corner Texts spelling "CREATE [ART] DIFFERENT" -->
        <div class="bottom-left-text">CREATE</div>
        <div class="bottom-right-text">DIFFERENT</div>
      </div>
    </div>

    <!-- ==========================================================================
         WE ARE GOKUL SK - SECTION (STAGE 4: INTERACTIVE VIDEO BADGES)
         ========================================================================== -->
    <div class="we-are-section">
      <div class="we-are-container">
        <!-- Left Column: Giant Typography with Inline Looping Video Badges -->
        <div class="we-are-left">
          <h2 class="we-are-title">
            <span class="title-row">WE ARE 
              <span class="video-badge-pill open-modal" data-video="https://impactbbdo.com/wp-content/uploads/2025/05/We-Are-BBDO_AnNahar-NewPresident2025_1280x720-2.mp4">
                <video autoplay loop muted playsinline>
                  <source src="https://impactbbdo.com/wp-content/uploads/2025/05/We-Are-BBDO_AnNahar-NewPresident2025_1280x720-2.mp4" type="video/mp4">
                </video>
              </span>
            </span>
            <span class="title-row">
              <span class="video-badge-pill wide open-modal" data-video="https://impactbbdo.com/wp-content/uploads/2025/05/We-Are-BBDO_GMO-UAE-Flying-Taxi_1280x720-2.mp4">
                <video autoplay loop muted playsinline>
                  <source src="https://impactbbdo.com/wp-content/uploads/2025/05/We-Are-BBDO_GMO-UAE-Flying-Taxi_1280x720-2.mp4" type="video/mp4">
                </video>
                <span class="badge-text">A FUTURE THEY HAVE NEVER SEEN.</span>
              </span>
              GOKUL SK
            </span>
            <span class="title-row">WE 
              <span class="video-badge-pill open-modal" data-video="https://impactbbdo.com/wp-content/uploads/2025/06/We-Are-BBDO_Etihad_1280x720.mp4">
                <video autoplay loop muted playsinline>
                  <source src="https://impactbbdo.com/wp-content/uploads/2025/06/We-Are-BBDO_Etihad_1280x720.mp4" type="video/mp4">
                </video>
              </span>
              DO
            </span>
            <span class="title-row">BIG THINGS</span>
          </h2>
        </div>

        <!-- Right Column: Paragraph Content & CTA Button -->
        <div class="we-are-right">
          <div class="we-are-description">
            <p>We solve big problems with strategy and creative that make a big impact.</p>
            <p>We work with brands and marketers that have the biggest ambitions.</p>
            <p>We hire big talent and bring them big opportunities that build boundless careers.</p>
            <p class="cta-question">Want to Do Big Things?</p>
          </div>
          <a href="#" class="btn-we-are-contact" id="btn-cta-contact">Contact Us</a>
        </div>
      </div>
    </div>
  </div>"""

content = content.replace(old_end, new_end)

# 3. Inject the Fullscreen Video Modal at the bottom
modal_code = """  <!-- ==========================================================================
       FULLSCREEN VIDEO PLAYER MODAL (STAGE 4: INTERACTIVE MODAL)
       ========================================================================== -->
  <div id="video-modal" class="modal">
    <div class="modal-overlay" id="modal-close-overlay"></div>
    <div class="modal-wrapper">
      <div class="modal-content">
        <video id="modal-video-player" class="modal-video" controls autoplay playsinline></video>
        <button class="modal-close-btn" id="modal-close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- SPA Router Fullscreen Red Transition Wipe -->"""

content = content.replace('<!-- SPA Router Fullscreen Red Transition Wipe -->', modal_code)

open(path, 'w', encoding='utf-8').write(content)
print("Injecting We Are section and Video Modal successfully complete!")
