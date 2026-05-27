# Read index.css
with open('c:/Users/ASUS/Desktop/impactbbdo cone/index.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Locate the boundaries
start_marker = '/* ==========================================================================\n   11. CREATIVE PORTFOLIO GRID STYLING'
end_marker = '/* ==========================================================================\n   12. INFINITE TICKER MARQUEE STYLING'

start_idx = css_content.find(start_marker)
end_idx = css_content.find(end_marker)

print(f"Start index: {start_idx}, End index: {end_idx}")

new_css_block = """/* ==========================================================================
   11. CREATIVE PORTFOLIO GRID STYLING (STAGE 5: exactly like BBDO website)
   ========================================================================== */
.work-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #161616;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 86px;
  z-index: 10;
}

@media (min-width: 1024px) {
  .work-section {
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 76px;
  }
}

.work-section .work-section-container {
  display: flex;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  align-items: flex-start;
  justify-content: center;
}

.work-section .work-section-container .text-work-container-desktop {
  display: none;
}

@media (min-width: 1024px) {
  .work-section .work-section-container .text-work-container-desktop {
    display: block;
    width: 20%;
  }
}

.work-section .work-section-container .text-work-container-desktop h2 {
  font-family: 'Outfit', sans-serif;
  font-size: 160px;
  line-height: 166px;
  letter-spacing: 0px;
  font-weight: 600;
  text-transform: uppercase;
  color: rgb(255, 0, 0);
  writing-mode: vertical-lr;
  transform: rotate(180deg);
}

@media (min-width: 1024px) {
  .work-section .work-section-container .text-work-container-desktop h2 {
    font-size: 200px;
    line-height: 250px;
    letter-spacing: 0px;
  }
}

@media (min-width: 2100px) {
  .work-section .work-section-container .text-work-container-desktop h2 {
    font-size: 240px;
  }
}

.work-section .work-section-container .works {
  display: flex;
  width: 100%;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .work-section .work-section-container .works {
    width: 80%;
  }
}

.work-section .work-section-container .works .works-inside-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;
}

@media (min-width: 1024px) {
  .work-section .work-section-container .works .works-inside-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: auto auto;
    column-gap: 20px;
    row-gap: 48px;
  }
}

.work-section .work-section-container .works .works-inside-grid .mobile-special-container {
  display: flex;
  width: max-content;
  transform: translate(116px, 0);
  align-items: center;
  justify-content: center;
  gap: 60px;
}

@media (min-width: 1024px) {
  .work-section .work-section-container .works .works-inside-grid .mobile-special-container {
    grid-column: span 3 / span 3;
    grid-row: span 2 / span 2;
    height: 100%;
    width: 100%;
    transform: translate(0px, 0);
  }
}

.work-section .work-section-container .works .works-inside-grid .mobile-special-container .mobile-image {
  margin-top: -39px;
  display: flex;
  height: 517px;
  width: 200px;
}

@media (min-width: 1024px) {
  .work-section .work-section-container .works .works-inside-grid .mobile-special-container .mobile-image {
    display: none;
  }
}

.work-section .work-section-container .works .works-inside-grid .mobile-special-container .mobile-image svg {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.work-section .work-section-container .works .works-inside-grid .mobile-special-container .card-work {
  height: 100%;
  width: 100%;
  min-width: 90vw;
  max-width: 90vw;
}

@media (min-width: 1024px) {
  .work-section .work-section-container .works .works-inside-grid .mobile-special-container .card-work {
    min-width: 100%;
    max-width: 100%;
  }
}

.work-section .work-section-container .works .works-inside-grid .card-work:nth-child(2) {
  grid-column-end: 7;
  grid-row-start: 1;
}

@media (min-width: 1024px) {
  .work-section .work-section-container .works .works-inside-grid .card-work:nth-child(2) {
    grid-column-start: 4;
  }
}

.work-section .work-section-container .works .works-inside-grid .card-work:nth-child(3) {
  grid-column-end: 7;
  grid-row-start: 2;
}

@media (min-width: 1024px) {
  .work-section .work-section-container .works .works-inside-grid .card-work:nth-child(3) {
    grid-column-start: 4;
  }
}

.work-section .flex-works {
  margin-top: 48px;
  display: flex;
  width: 100%;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;
}

@media (min-width: 1024px) {
  .work-section .flex-works {
    margin-top: 48px;
    flex-direction: row;
    gap: 20px;
  }
}

.work-section .flex-works a {
  width: 100% !important;
}

/* Card work standard styling */
.card-work {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', sans-serif;
  color: rgb(250, 250, 250);
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.14, 0.21, 0.31, 0.98);
}

@media (min-width: 1024px) {
  .card-work:hover {
    color: rgb(255, 0, 0) !important;
  }
}

@media (min-width: 1024px) {
  .card-work:hover .image-container img {
    transform: scale(1.25);
  }

  .card-work:hover .card-work-text-content h2 {
    font-weight: 600;
  }

  .card-work:hover .card-work-text-content .subtitle-line .line {
    height: 2px;
    background-color: rgb(255, 0, 0);
  }
}

.card-work .card-work-container {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  gap: 8px;
}

@media (min-width: 768px) {
  .card-work .card-work-container {
    gap: 12px;
  }
}

@media (min-width: 1920px) {
  .card-work .card-work-container {
    gap: 8px;
  }
}

.card-work .image-container {
  aspect-ratio: 343/304;
  height: 100%;
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
  background-color: #1a1a19;
}

@media (min-width: 1024px) {
  .card-work .image-container {
    aspect-ratio: 555/357;
  }
}

.card-work .image-container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  transition: all 800ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card-work.main-card .image-container {
  aspect-ratio: 343/494;
  height: 100%;
  width: 100%;
}

@media (min-width: 1024px) {
  .card-work.main-card .image-container {
    aspect-ratio: 555/800;
  }
}

.card-work .card-work-text-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

@media (min-width: 1024px) {
  .card-work .card-work-text-content {
    flex-direction: row;
    align-items: flex-end;
    gap: 16px;
  }
}

.card-work .card-work-text-content h2 {
  margin-bottom: 8px;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: 0px;
  font-weight: 400;
  text-transform: uppercase;
}

@media (min-width: 1024px) {
  .card-work .card-work-text-content h2 {
    margin-bottom: 0px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: 35px;
  }
}

@media (min-width: 1920px) {
  .card-work .card-work-text-content h2 {
    font-size: 40px;
    line-height: 46px;
  }
}

.card-work .card-work-text-content .subtitle-line {
  display: flex;
  align-items: flex-end;
  gap: 16px;
}

.card-work .card-work-text-content .subtitle-line .line {
  margin-bottom: 5px;
  height: 1px;
  width: 32px;
  background-color: rgb(250, 250, 250);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 1024px) {
  .card-work .card-work-text-content .subtitle-line .line {
    width: 42px;
  }
}

.card-work .card-work-text-content .subtitle-line h3 {
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  margin: 0;
}

@media (min-width: 1024px) {
  .card-work .card-work-text-content .subtitle-line h3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
}

.work-section .button-container {
  margin-top: 48px;
  margin-bottom: 96px;
  width: 100%;
  padding-left: 0px;
  padding-right: 0px;
  display: flex;
  justify-content: center;
}

@media (min-width: 768px) {
  .work-section .button-container {
    width: auto;
  }
}

@media (min-width: 1024px) {
  .work-section .button-container {
    margin-top: 56px;
    margin-bottom: 80px;
  }
}

.work-section .primary-button {
  display: inline-block;
  border: 2px solid var(--color-white);
  color: var(--color-white);
  background: transparent;
  padding: 0.75rem 2.2rem;
  border-radius: 50px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  font-size: 0.85rem;
  transition: background var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
  cursor: pointer;
}

.work-section .primary-button:hover {
  background-color: var(--color-white);
  color: var(--color-black) !important;
  transform: translateY(-2px);
}

/* Outlined text animation bottom of work section */
.work-section .animation-text-container {
  margin-bottom: 94px;
  width: 100%;
}

@media (min-width: 1024px) {
  .work-section .animation-text-container {
    margin-bottom: 104px;
  }
}

.work-section .animation-text-container .animation-text {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.work-section .animation-text-container .animation-text h2 {
  width: fit-content;
  text-wrap: nowrap;
  font-family: 'Outfit', sans-serif;
  font-size: 86px;
  line-height: 110px;
  letter-spacing: 0px;
  font-weight: 600;
  text-transform: uppercase;
}

@media (min-width: 1024px) {
  .work-section .animation-text-container .animation-text h2 {
    font-size: 160px;
    line-height: 166px;
    letter-spacing: 0px;
  }
}

@media (min-width: 1536px) {
  .work-section .animation-text-container .animation-text h2 {
    font-size: 237px;
  }
}

.work-section .animation-text-container .animation-text .right {
  align-self: flex-end;
  color: rgb(250, 250, 250);
}

.work-section .animation-text-container .animation-text .left {
  width: fit-content;
  align-self: flex-start;
}

.work-section .animation-text-container .animation-text .left svg {
  height: 100%;
  width: 100%;
}

.work-section .animation-text-container .animation-text .left .mobile-title {
  margin-top: -42px;
  display: block;
  width: 180%;
}

@media (min-width: 1024px) {
  .work-section .animation-text-container .animation-text .left .mobile-title {
    display: none;
  }
}

.work-section .animation-text-container .animation-text .left .desktop-title {
  display: none;
}

@media (min-width: 1024px) {
  .work-section .animation-text-container .animation-text .left .desktop-title {
    display: block;
  }
}

@media (min-width: 1536px) {
  .work-section .animation-text-container .animation-text .left .desktop-title {
    margin-top: 1.25rem;
    height: 200px;
    transform: scale(1.5) !important;
  }
}

"""

if start_idx != -1 and end_idx != -1:
    prefix = css_content[:start_idx]
    suffix = css_content[end_idx:]
    new_css = prefix + new_css_block + suffix
    
    with open('c:/Users/ASUS/Desktop/impactbbdo cone/index.css', 'w', encoding='utf-8') as f:
        f.write(new_css)
    print("Success: index.css work-section styling has been updated with the exact BBDO layout rules!")
else:
    print("Error: Could not find start or end marker in index.css")
