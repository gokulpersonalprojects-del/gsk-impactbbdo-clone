path = r'c:\Users\ASUS\Desktop\impactbbdo cone\index.html'
content = open(path, encoding='utf-8').read()

# Locate and replace the entire we-are-section structure
old_we_are = """    <!-- ==========================================================================
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
    </div>"""

new_we_are = """    <!-- ==========================================================================
         WE ARE BBDO - SECTION (STAGE 4: INTERACTIVE VIDEO BADGES)
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
                <span class="badge-text">THE IMPOSSIBLE FLYING TAXI</span>
              </span>
              BBDO
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
          <a href="#" class="btn-we-are-contact" id="btn-cta-contact">CONTACT US</a>
        </div>
      </div>
    </div>"""

content = content.replace(old_we_are, new_we_are)
open(path, 'w', encoding='utf-8').write(content)
print("Section home alignment successfully completed!")
