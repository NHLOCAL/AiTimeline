def convert_to_html(input_file, output_file):
    with open(input_file, 'r') as f:
        lines = f.readlines()

    html = []
    for line in lines:
        line = line.strip()
        if line.startswith('--'):
            # סגור את div הקודם אם קיים
            if html and html[-1] != '</div>':
                html.append('</div>')
            month = line.replace('--', '').strip()
            html.append(f'<div class="event" data-date="{month}">')
            html.append(f'\t<div class="date">{month}</div>')
        elif line.startswith('-'):
            event = line.replace('-', '').strip()
            # הדגש את כל הטקסט בין **
            while '**' in event:
                event = event.replace('**', '<b>', 1)
                event = event.replace('**', '</b>', 1)
            html.append(f'\t<div class="info">{event}</div>')

    # סגור את div האחרון אם קיים
    if html and html[-1] != '</div>':
        html.append('</div>')

    with open(output_file, 'w') as f:
        f.write('\n'.join(html))

# שימוש
input_file = 'input.txt'
output_file = 'output.html'
convert_to_html(input_file, output_file)
