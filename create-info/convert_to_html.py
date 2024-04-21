def convert_to_html(input_file, output_file):
    with open(input_file, 'r') as f:
        lines = f.readlines()

    html = []
    for line in lines:
        line = line.strip()
        if line.startswith('--'):
            # Close previous month div if it exists
            if html and html[-1] != '</div>':
                html.append('</div>')
            month = line.replace('--', '').strip()
            html.append(f'<div class="event" data-date="{month}">')
            html.append(f'\t<div class="date">{month}</div>')
        elif line.startswith('-'):
            event = line.replace('-', '').strip()
            # Highlight text within ** with <b> tags
            event = event.replace('**', '<b>', 1)
            event = event.replace('**', '</b>', 1)
            html.append(f'\t<div class="info">{event}</div>')

    # Close the last month div if it exists
    if html and html[-1] != '</div>':
        html.append('</div>')

    with open(output_file, 'w') as f:
        f.write('\n'.join(html))

# Usage
input_file = 'input.txt'
output_file = 'output.html'
convert_to_html(input_file, output_file)
