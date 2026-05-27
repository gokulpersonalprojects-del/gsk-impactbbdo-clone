import re

# Read index.html
with open('c:/Users/ASUS/Desktop/impactbbdo cone/index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# Read extracted_work_section.html
with open('c:/Users/ASUS/Desktop/impactbbdo cone/scratch/extracted_work_section.html', 'r', encoding='utf-8') as f:
    work_section_content = f.read()

# Find the start and end indices of the work section in index.html
start_marker = '<section class="work-section" data-header-color="black">'
end_marker = '    <!-- ==========================================================================\n         OUTLINED TEXT TICKER'

# Let's use a simpler marker search to be extremely robust
start_idx = index_html.find(start_marker)
end_idx = index_html.find('<!-- ==========================================================================\n         OUTLINED TEXT TICKER')

if start_idx == -1:
    # try with other line endings/spaces
    start_idx = index_html.find('<section class="work-section"')

if end_idx == -1:
    end_idx = index_html.find('<!-- ==========================================================================\n         OUTLINED TEXT TICKER')
    if end_idx == -1:
        end_idx = index_html.find('<!-- ==========================================================================')
        # We want the second occurrences since preloader/masthead also have this. Let's search from start_idx
        end_idx = index_html.find('<!-- ==========================================================================', start_idx)

print(f"Start index: {start_idx}, End index: {end_idx}")

if start_idx != -1 and end_idx != -1:
    # Extract prefix and suffix
    prefix = index_html[:start_idx]
    suffix = index_html[end_idx:]
    
    # Combine with the new work section content
    # Let's ensure proper formatting and indentation
    new_html = prefix + work_section_content.strip() + "\n\n  " + suffix
    
    # Save back to index.html
    with open('c:/Users/ASUS/Desktop/impactbbdo cone/index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Success: index.html has been updated with the exact BBDO work section!")
else:
    print("Error: Could not find start or end marker in index.html")
