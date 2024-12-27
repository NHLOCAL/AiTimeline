import yaml
from markdown import markdown
from bs4 import BeautifulSoup

# Conversion from MD to YAML-like format
def md_to_yaml(md_text):
    lines = md_text.splitlines()
    result = []
    current_year = None
    current_events = []

    for line in lines:
        if line.startswith("# "):
            # If we encounter a new year header, finalize the previous one
            if current_year:
                result.append({"year": current_year, "events": current_events})
                current_events = []
            current_year = line[2:].strip()
        elif line.startswith("## "):
            # New date header
            date = line[3:].strip()
            current_events.append({"date": date, "info": []})
        elif line.startswith("- "):
            # Event information
            text = line[2:].strip()
            if text.endswith("*special*"):
                text = text.replace("*special*", "").strip()
                current_events[-1]["info"].append({"text": text, "special": True})
            else:
                current_events[-1]["info"].append({"text": text})

    # Finalize the last year
    if current_year:
        result.append({"year": current_year, "events": current_events})

    return yaml.dump(result, allow_unicode=True, sort_keys=False)

# Conversion from YAML-like format to MD
def yaml_to_md(yaml_text):
    data = yaml.safe_load(yaml_text)
    md_lines = []

    for entry in data:
        md_lines.append(f"# {entry['year']}")
        for event in entry['events']:
            md_lines.append(f"## {event['date']}")
            for info in event['info']:
                text = info.get("text", "")
                if info.get("special", False):
                    md_lines.append(f"- {text} *special*")
                else:
                    md_lines.append(f"- {text}")

    return "\n".join(md_lines)

# Example usage
if __name__ == "__main__":
    md_example = """# 2022
## February
- <strong>Midjourney v1</strong>
## March
- OpenAI releases <strong>text-davinci-002</strong> and <strong>code-davinci-002</strong> with an API approach.
## April
- <strong>Midjourney v2</strong>
- <strong>DALL-E 2</strong> is announced for gradual release. *special*
"""

    yaml_example = """- year: 2022
  events:
  - date: February
    info:
    - text: <strong>Midjourney v1</strong>
  - date: March
    info:
    - text: OpenAI releases <strong>text-davinci-002</strong> and <strong>code-davinci-002</strong> with an API approach.
  - date: April
    info:
    - text: <strong>Midjourney v2</strong>
    - text: <strong>DALL-E 2</strong> is announced for gradual release.
      special: true
"""

    # Convert MD to YAML
    converted_yaml = md_to_yaml(md_example)
    print("YAML Output:")
    print(converted_yaml)

    # Convert YAML to MD
    converted_md = yaml_to_md(yaml_example)
    print("MD Output:")
    print(converted_md)