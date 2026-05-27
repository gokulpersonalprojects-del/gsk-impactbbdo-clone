path = r'c:\Users\ASUS\Desktop\impactbbdo cone\index.html'
content = open(path, encoding='utf-8').read()

# 1. Replace the opening container tag
content = content.replace(
    '<div class="home-page-container active-section" id="section-home">',
    '<section class="home-page-container active-section" id="section-home">'
)

# 2. Replace the closing container tag at the bottom of the app-shell
old_closing = """    <!-- OTHER SECTIONS FOR ROUTER -->"""
# Let's locate the end of section-contact and the closing of section-home
content = content.replace(
    '</section>\n\n  </div>\n\n  <!-- SPA Router Fullscreen',
    '</section>\n\n  </section>\n\n  <!-- SPA Router Fullscreen'
)

open(path, 'w', encoding='utf-8').write(content)
print("Section home tag conversion completed successfully!")
