import codecs

# Load index.html with UTF-8 encoding
with codecs.open('index.html', 'r', 'utf-8') as f:
    content = f.read()

# Replace works cards links
content = content.replace("class='card-work main-card'", "class='card-work main-card fade-up'")
content = content.replace("class='card-work '", "class='card-work fade-up'")

# Replace button container at the bottom
content = content.replace('class="button-container"\r\n\t\t\t\tdata-animation="fade-in"', 'class="button-container fade-up"\r\n\t\t\t\tdata-animation="fade-in"')
content = content.replace('class="button-container"\n\t\t\t\tdata-animation="fade-in"', 'class="button-container fade-up"\n\t\t\t\tdata-animation="fade-in"')

with codecs.open('index.html', 'w', 'utf-8') as f:
    f.write(content)

print("Dynamic scroll-reveal classes applied successfully!")
