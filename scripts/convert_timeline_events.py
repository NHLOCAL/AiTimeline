import yaml
import re
import os

# Function to convert MD to YAML-like format
def md_to_yaml(md_content):
    yaml_structure = {"year": None, "events": []}
    lines = md_content.splitlines()

    for line in lines:
        line = line.strip()
        if line.startswith("# Year: "):
            yaml_structure["year"] = int(line.replace("# Year: ", ""))
        elif line.startswith("## "):
            event_date = line.replace("## ", "")
            yaml_structure["events"].append({"date": event_date, "info": []})
        elif line.startswith("- "):
            text = line.replace("- ", "", 1)
            # החלף **טקסט** ב-<b>טקסט</b>
            text = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", text)
            if yaml_structure["events"]:
                yaml_structure["events"][-1]["info"].append({"text": text})

    # עטוף את המבנה הראשי ברשימה
    yaml_list = [yaml_structure]

    return yaml.dump(yaml_list, sort_keys=False, allow_unicode=True, default_flow_style=False, indent=2)

# Function to convert YAML-like format to MD
def yaml_to_md(yaml_content):
    data = yaml.safe_load(yaml_content)
    md_lines = []

    # בדיקה אם הנתונים הם רשימה
    if isinstance(data, list):
        for item in data:
            if "year" in item and item["year"]:
                md_lines.append(f"# Year: {item['year']}")

            for event in item.get("events", []):
                md_lines.append(f"## {event['date']}")
                for info in event.get("info", []):
                    text = info.get("text", "")
                    # החלף <b>טקסט</b> ב-**טקסט**
                    text = re.sub(r"<b>(.*?)</b>", r"**\1**", text)
                    md_lines.append(f"- {text}")
    else:
        # טיפול במקרה בו הנתונים אינם בתוך רשימה
        if "year" in data and data["year"]:
            md_lines.append(f"# Year: {data['year']}")

        for event in data.get("events", []):
            md_lines.append(f"## {event['date']}")
            for info in event.get("info", []):
                text = info.get("text", "")
                # החלף <b>טקסט</b> ב-**טקסט**
                text = re.sub(r"<b>(.*?)</b>", r"**\1**", text)
                md_lines.append(f"- {text}")

    return "\n".join(md_lines)

# Main function to handle file inputs
def main():
    input_file = input("Enter the input file path: ").strip()
    if not os.path.exists(input_file):
        print("Input file does not exist.")
        return

    file_extension = os.path.splitext(input_file)[1].lower()

    if file_extension == ".md":
        conversion_type = "md-to-yaml"
        output_file = input_file.replace(".md", ".yml")
    elif file_extension in [".yaml", ".yml"]:
        conversion_type = "yaml-to-md"
        output_file = input_file.replace(file_extension, ".md")
    else:
        print("Unsupported file format. Please use .md or .yaml/.yml files.")
        return

    with open(input_file, "r", encoding="utf-8") as file:
        content = file.read()

    if conversion_type == "md-to-yaml":
        converted_content = md_to_yaml(content)
    elif conversion_type == "yaml-to-md":
        converted_content = yaml_to_md(content)

    with open(output_file, "w", encoding="utf-8") as file:
        file.write(converted_content)

    print(f"Conversion completed. Output written to {output_file}.")

if __name__ == "__main__":
    main()
