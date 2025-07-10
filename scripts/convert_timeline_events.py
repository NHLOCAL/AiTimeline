import yaml
import re
import os
import sys

def md_to_yaml(md_content):
    all_years_data = []  # <--- List to store structures for ALL years
    current_year_structure = None # Holds data for the year currently being processed
    current_event = None # Holds data for the event currently being processed

    lines = md_content.splitlines()

    for line in lines:
        line = line.strip()
        if not line:
            continue # Skip empty lines

        if line.startswith("# Year: "):
            # 1. Finalize and store the PREVIOUS year's structure (if one exists)
            if current_year_structure:
                if current_event: # Add the last event of the previous year
                    current_year_structure["events"].append(current_event)
                    current_event = None # Reset event since it's now stored
                all_years_data.append(current_year_structure) # Add completed year to the list

            # 2. Start the NEW year's structure
            try:
                year_num = int(line.replace("# Year: ", ""))
                current_year_structure = {"year": year_num, "events": []}
                current_event = None # Ensure event is reset for the new year
            except ValueError:
                print(f"Warning: Could not parse year from line: '{line}'. Skipping year.")
                current_year_structure = None # Invalidate current year structure

        elif line.startswith("## "):
            # Ensure we are inside a valid year structure
            if not current_year_structure:
                print(f"Warning: Found month line '{line}' outside of a year (# Year:). Skipping.")
                continue

            # Finalize the previous event within the CURRENT year
            if current_event:
                current_year_structure["events"].append(current_event)

            # Start the new event for the CURRENT year
            event_date = line.replace("## ", "")
            current_event = {"date": event_date, "info": []}

        elif line.startswith("- "):
            # Ensure we are inside a valid event structure
            if not current_event:
                # We could also check current_year_structure here for extra safety
                print(f"Warning: Found info line '{line}' outside of an event (## Month). Skipping.")
                continue

            # Process the info line for the current event
            text = line.replace("- ", "", 1).strip()
            is_special = False
            if text.endswith("(*special*)"):
                text = text[:-len("(*special*)")].strip() # Remove the marker
                is_special = True

            # Convert markdown bold to HTML bold
            # Use raw string r"<b>\1</b>" for replacement to avoid issues with backslashes
            text = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", text)

            info_entry = {"text": text}
            if is_special:
                info_entry["special"] = True # Add the special flag only if needed

            current_event["info"].append(info_entry)

    if current_year_structure:
        if current_event: # Add the last event of the last year
            current_year_structure["events"].append(current_event)
        all_years_data.append(current_year_structure) # Add the final year to the list

    if not all_years_data:
         print("Warning: No year data found or processed.")
         return "" # Return empty string or handle as error

    return yaml.safe_dump(all_years_data, sort_keys=False, allow_unicode=True, default_flow_style=False, indent=2, width=float("inf"))

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

                text = re.sub(r"<b>(.*?)</b>", r"**\1**", text)

                if is_special:
                    md_lines.append(f"- {text} (*special*)")
                else:
                    md_lines.append(f"- {text}")
            md_lines.append("")
        md_lines.append("")

    while md_lines and not md_lines[-1]:
        md_lines.pop()

    return "\n".join(md_lines)

# Main function to handle file inputs
def main():
    if len(sys.argv) < 2:
        print("Error: Please provide an input file path as a command-line argument.")
        print(f"Usage: python {sys.argv[0]} <path/to/file.md>")
        sys.exit(1)

    input_file = sys.argv[1]

    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' does not exist.")
        return

    file_extension = os.path.splitext(input_file)[1].lower()
    output_file = ""

    if file_extension == ".md":
        conversion_type = "md-to-yaml"
        output_file = input_file.replace(".md", ".yml")
        print(f"Converting Markdown ('{input_file}') to YAML ('{output_file}')...")
    elif file_extension in [".yaml", ".yml"]:
        conversion_type = "yaml-to-md"
        output_file = input_file.replace(file_extension, ".md")
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
        return

    if not converted_content or converted_content.startswith("Error:"):
         print(f"Conversion failed. No output written.")
         if converted_content: print(converted_content)
         return

    try:
        with open(output_file, "w", encoding="utf-8") as file:
            file.write(converted_content)
        print(f"Conversion completed successfully. Output written to '{output_file}'.")
    except Exception as e:
        print(f"Error writing output file '{output_file}': {e}")


if __name__ == "__main__":
    main()