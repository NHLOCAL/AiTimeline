import yaml
import re
import os

# Function to convert MD to YAML-like format (Corrected Version with Type Parsing)
def md_to_yaml(md_content):
    all_years_data = []
    current_year_structure = None
    current_event = None

    lines = md_content.splitlines()

    # Regex to find type tag like (type: image) or (type: language model)
    type_regex = re.compile(r'\s*\(type:\s*([^)]+)\)\s*')

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if line.startswith("# Year: "):
            if current_year_structure:
                if current_event:
                    current_year_structure["events"].append(current_event)
                    current_event = None
                all_years_data.append(current_year_structure)

            try:
                year_num = int(line.replace("# Year: ", ""))
                current_year_structure = {"year": year_num, "events": []}
                current_event = None
            except ValueError:
                print(f"Warning: Could not parse year from line: '{line}'. Skipping year.")
                current_year_structure = None

        elif line.startswith("## "):
            if not current_year_structure:
                print(f"Warning: Found month line '{line}' outside of a year (# Year:). Skipping.")
                continue

            if current_event:
                current_year_structure["events"].append(current_event)

            event_date = line.replace("## ", "")
            current_event = {"date": event_date, "info": []}

        elif line.startswith("- "):
            if not current_event:
                print(f"Warning: Found info line '{line}' outside of an event (## Month). Skipping.")
                continue

            text = line.replace("- ", "", 1).strip()
            is_special = False
            event_type = None # Initialize type

            # Check for special marker first and remove it
            if text.endswith("(*special*)"):
                text = text[:-len("(*special*)")].strip()
                is_special = True

            # Check for type marker using regex and remove it
            type_match = type_regex.search(text)
            if type_match:
                event_type = type_match.group(1).strip().lower().replace(' ', '-') # Get type, lowercase, replace space with dash
                text = type_regex.sub('', text).strip() # Remove the type tag from text

            # Convert markdown bold to HTML bold
            text = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", text)

            info_entry = {"text": text}
            if event_type:
                info_entry["type"] = event_type # Add type if found
            if is_special:
                info_entry["special"] = True

            current_event["info"].append(info_entry)

    # After the loop, finalize and add the VERY LAST year processed
    if current_year_structure:
        if current_event:
            current_year_structure["events"].append(current_event)
        all_years_data.append(current_year_structure)

    if not all_years_data:
         print("Warning: No year data found or processed.")
         return ""

    return yaml.safe_dump(all_years_data, sort_keys=False, allow_unicode=True, default_flow_style=False, indent=2, width=float("inf"))


# Function to convert YAML-like format to MD (Add type tag reconstruction)
def yaml_to_md(yaml_content):
    data = yaml.safe_load(yaml_content)
    md_lines = []

    if not isinstance(data, list):
        print("Warning: Expected YAML input to be a list of years.")
        if isinstance(data, dict) and "year" in data:
            data = [data]
        else:
            return "Error: Invalid YAML format."


    for item in data:
        if "year" in item and item["year"]:
            md_lines.append(f"# Year: {item['year']}")
            md_lines.append("")

        for event in item.get("events", []):
            md_lines.append(f"## {event['date']}")
            for info in event.get("info", []):
                text = info.get("text", "")
                is_special = info.get("special", False)
                event_type = info.get("type") # Get type if exists

                # Convert HTML bold back to markdown bold
                text = re.sub(r"<b>(.*?)</b>", r"**\1**", text)

                # Reconstruct the line
                line_parts = ["-", text]
                if event_type:
                    # Convert type back (e.g., language-model -> language model) if needed, or keep as is
                    # For simplicity, keeping it as stored (e.g., 'language-model')
                    line_parts.append(f"(type: {event_type})")
                if is_special:
                    line_parts.append("(*special*)")

                md_lines.append(" ".join(line_parts))

            md_lines.append("")
        md_lines.append("")

    while md_lines and not md_lines[-1]:
        md_lines.pop()

    return "\n".join(md_lines)


# Main function remains the same
def main():
    input_file = input("Enter the input file path: ").strip()
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' does not exist.")
        return

    file_extension = os.path.splitext(input_file)[1].lower()
    output_file = "" # Initialize output_file

    if file_extension == ".md":
        conversion_type = "md-to-yaml"
        # Suggest default output name, allow override? For now, auto-generate.
        default_output = input_file.replace(".md", ".yml")
        output_file = input(f"Enter the output YAML file path (default: {default_output}): ").strip() or default_output
        print(f"Converting Markdown ('{input_file}') to YAML ('{output_file}')...")
    elif file_extension in [".yaml", ".yml"]:
        conversion_type = "yaml-to-md"
        default_output = input_file.replace(file_extension, ".md")
        output_file = input(f"Enter the output Markdown file path (default: {default_output}): ").strip() or default_output
        print(f"Converting YAML ('{input_file}') to Markdown ('{output_file}')...")
    else:
        print("Error: Unsupported file format. Please use .md or .yaml/.yml files.")
        return

    try:
        with open(input_file, "r", encoding="utf-8") as file:
            content = file.read()
    except Exception as e:
        print(f"Error reading input file '{input_file}': {e}")
        return

    converted_content = ""
    try:
        if conversion_type == "md-to-yaml":
            converted_content = md_to_yaml(content)
        elif conversion_type == "yaml-to-md":
            converted_content = yaml_to_md(content)
    except Exception as e:
        print(f"Error during conversion: {e}")
        # import traceback
        # traceback.print_exc()
        return

    if not converted_content or converted_content.startswith("Error:"):
         print(f"Conversion failed. No output written.")
         if converted_content: print(converted_content) # Print error message from function
         return

    try:
        with open(output_file, "w", encoding="utf-8") as file:
            file.write(converted_content)
        print(f"Conversion completed successfully. Output written to '{output_file}'.")
    except Exception as e:
        print(f"Error writing output file '{output_file}': {e}")


if __name__ == "__main__":
    main()