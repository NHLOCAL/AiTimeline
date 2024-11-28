# AI Timeline

Welcome to the Artificial Intelligence Timeline, showcasing the evolution and advancements in artificial intelligence technologies from 2022 to 2024. This timeline highlights key milestones, releases, and developments from leading companies and projects in the AI field.

## Overview

This timeline is structured chronologically, organized by year, and includes significant events, releases, and updates in the artificial intelligence landscape. From the introduction of new models and updates to open-source releases and major announcements, this timeline provides a comprehensive overview of the dynamic AI industry's progress over the years.

## Features

- **Year-wise Organization:** Events and releases are grouped by year for easy navigation and understanding.
- **Detailed Descriptions:** Each event includes a brief description, providing context and details about the milestones.
- **Multiple Events Handling:** For months with multiple events or updates, events are listed as bullet points under the respective month for clarity.
- **Responsive Design:** The timeline is designed to be responsive and accessible on various devices, ensuring a seamless viewing experience.

## How to Use

1. **View the Timeline:** Visit the [Artificial Intelligence Timeline](https://nhlocal.github.io/AiTimeline/) to explore the events and developments in the AI industry.
2. **Navigate the Timeline:** Scroll through the timeline to view events chronologically, or use the year indicators to jump to specific years.
3. **Explore Events:** Click on individual events to view detailed descriptions and learn more about each milestone.

## How the Site Works (Technical Details)

The website is generated using Jekyll, a static site generator. Content is managed in YAML data files and Markdown, making it easy to update and maintain.

**Key Files and Directories:**

* **`_data/`**: Contains the YAML files that store the timeline data (`timeline.yml`) and the external links (`links.yml`). **This is where you'll contribute new events and links!**
* **`_includes/`**: Contains reusable HTML components, such as the footer (`footer.html`).
* **`_layouts/`**: Contains the main site layout (`default.html`).
* **`assets/`**: Contains your CSS, images, and the favicon.
* **`index.md`**: The main content file for the homepage.

## Contributing

We welcome contributions to keep the timeline comprehensive and current. Here's how you can contribute:

1. **Fork the Repository:** Fork this repository to your GitHub account.

2. **Add or Update Events:**
    * Open the `_data/timeline.yml` file.
    * Add new events following this structure. Use month names for the date:

       ```yaml
       - year: 2024 # The year of the event
         events:
           - date: July # Date format: Month
             info:
               - text: "**New Amazing AI Model Released!**" # Event description (use **bold** for emphasis).
               - text: "More details about the release."
                 special: true # Add `special: true` to highlight events
       ```

    * You can also add new links in `_data/links.yml` using a similar structure.

3. **Commit and Push:** Commit your changes and push them to your forked repository.

4. **Create a Pull Request:** Create a pull request from your forked repository to the main repository.

5. **Review and Merge:** Your pull request will be reviewed, and after approval, will be merged into the main timeline.

## Running the Site Locally (Optional)

If you'd like to preview changes before submitting a pull request, you can run the site locally:

1. **Install Ruby:** Jekyll requires Ruby. Install it from [rubyinstaller.org](https://rubyinstaller.org/) or use your system's package manager.

2. **Install Jekyll:**
   ```bash
   gem install jekyll bundler
   ```

3. **Navigate to Project Directory:** In your terminal, navigate to the project's root directory.

4. **Build and Serve:**
   ```bash
   bundle exec jekyll serve
   ```

5. **View Locally:** Open your web browser and go to `http://localhost:4000`.

## About

This timeline was created as a project to document and showcase the advancements in artificial intelligence technologies. It serves as a resource for researchers, enthusiasts, and anyone interested in tracking the progress and evolution of AI technologies over the years.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for visiting the Artificial Intelligence Timeline! We hope you find this resource informative and useful. For any questions or inquiries, please [contact us](mailto:nh.local11@gmail.com).