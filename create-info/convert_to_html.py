def convert_to_html(input_file, output_file):
    with open(input_file, 'r') as f:
        lines = f.readlines()

    html = []
    current_article = None

    for line in lines:
        line = line.strip()
        if line.startswith('--'):
            # Close the previous article if exists
            if current_article:
                html.append('</article>')
            
            month = line.replace('--', '').strip()
            year = "2024"  # You may want to make this dynamic
            current_article = f'<article class="event" data-date="{month} {year}">'
            html.append(current_article)
            html.append(f'\t<h3 class="date">{month}</h3>')
        elif line.startswith('-'):
            event = line.replace('-', '').strip()
            # Highlight all text between **
            while '**' in event:
                event = event.replace('**', '<strong>', 1)
                event = event.replace('**', '</strong>', 1)
            
            # Check if the event is special (you may want to define criteria for this)
            if "special" in event.lower():
                html.append(f'\t<p class="info special">{event}</p>')
            else:
                html.append(f'\t<p class="info">{event}</p>')

    # Close the last article if exists
    if current_article:
        html.append('</article>')

    with open(output_file, 'w') as f:
        f.write('\n'.join(html))

# Usage
input_file = 'input.txt'
output_file = 'output.html'
convert_to_html(input_file, output_file)