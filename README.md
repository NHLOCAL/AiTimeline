# AI Timeline

An open-source timeline tracking the evolution and advancements in Artificial Intelligence from 2022 onwards.

## Overview

This project provides a chronological overview of significant milestones, model releases, and key developments in the AI field. It aims to be a clear and concise resource for tracking the industry's rapid progress.

## Features

- **Yearly Sections:** Events organized by year.
- **Monthly Events:** Clear breakdown of events within each month.
- **Key Event Highlighting:** Important milestones are visually emphasized.
- **Sortable View:** Toggle between newest-first and oldest-first chronological order.
- **Dark Mode:** Switch between light and dark themes.
- **Responsive Design:** Works well on desktop and mobile devices.
- **Further Reading:** Links to related articles and resources.

## How to Use

1.  **Visit the Timeline:** [https://nhlocal.github.io/AiTimeline/](https://nhlocal.github.io/AiTimeline/)
2.  **Navigate:** Scroll or use the year links at the top.
3.  **Sort:** Use the "Sort" button to change the timeline order.
4.  **Theme:** Use the toggle button (moon/sun icon) to switch between dark and light modes.

## How the Site Works

This site is built using **Jekyll**, a static site generator.

-   **Timeline Content:** Managed in two files within the `_data` folder:
    -   `timeline.md`: Human-readable Markdown format. **Edit this file to contribute events.**
    -   `timeline.yml`: YAML format used by Jekyll. **This file is generated automatically.**
-   **Conversion Script:** A Python script (`scripts/convert_timeline_events.py`) converts `timeline.md` to `timeline.yml`.
-   **Other Key Files:**
    -   `index.md`: Main page structure.
    -   `_layouts/default.html`: Base HTML template.
    -   `assets/`: CSS styles and JavaScript.
    -   `_data/links.yml`: Links for the "Learn more" section.

## Contributing

Contributions are welcome! Help keep the timeline accurate and up-to-date.

1.  **Fork & Clone:** Fork the repository to your GitHub account and clone it locally.
    ```bash
    git clone https://github.com/YOUR_USERNAME/AiTimeline.git
    cd AiTimeline
    ```

2.  **Edit `timeline.md`:**
    *   Open `_data/timeline.md`.
    *   Add or modify events using the existing format (`# Year:`, `## Month`, `- Event description`).
    *   Use `**bold text**` for emphasis (e.g., model names).
    *   **To highlight an event, add `(*special*)` at the end of its line** (with a space before it).
        ```markdown
        ## March
        - An important event happened. (*special*)
        - A regular event occurred.
        ```

3.  **Run the Conversion Script:**
    *   Make sure you have Python 3 installed.
    *   In your terminal (from the project root):
        ```bash
        python scripts/convert_timeline_events.py
        ```
    *   Enter `_data/timeline.md` when prompted for the input file. This will update `_data/timeline.yml`.

4.  **Commit Changes:**
    *   **Important:** Stage and commit *both* the `.md` and the generated `.yml` file.
        ```bash
        git add _data/timeline.md _data/timeline.yml
        git commit -m "Add [brief description of your change]"
        ```

5.  **Push and Create Pull Request:**
    *   Push your changes to your fork: `git push origin main` (or your branch name).
    *   Go to your fork on GitHub and open a Pull Request to the `main` branch of `NHLOCAL/AiTimeline`.

## Feedback and Suggestions

Have feedback, found a bug, or want to suggest an addition? Please **[open an issue](https://github.com/NHLOCAL/AiTimeline/issues)** on GitHub. We appreciate your input!

## Running Locally (Optional)

To preview your changes before creating a pull request:

1.  **Install Prerequisites:**
    *   Ruby and Bundler (see [Jekyll Installation Guide](https://jekyllrb.com/docs/installation/))
    *   Python 3 (for the conversion script)
2.  **Install Dependencies:**
    ```bash
    bundle install
    ```
3.  **(Optional) Run Conversion Script:** If you edited `timeline.md`:
    ```bash
    python scripts/convert_timeline_events.py
    # Enter _data/timeline.md
    ```
4.  **Serve the Site:**
    ```bash
    bundle exec jekyll serve
    ```
5.  **View:** Open your browser to `http://localhost:4000/AiTimeline/` (or the address provided).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.