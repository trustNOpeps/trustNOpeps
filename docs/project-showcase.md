# Portfolio project showcases

Added 19 November 2026. The portfolio preserves the dark studio identity and existing project links. Engineering and Digital now use alternating image/copy rows; the hero has no duplicate project cards.

## Visual mapping

Laptop: MechLabs, Tensile Desk, Tamuform Studio, Pixel Pad.
Phone: BOURN, captured from its existing 390px responsive preview.
Browser: VI Fieldnotes, Little World, Request Desk.
System concept: Mechatronics Lab (sensor, control, servo; not a wiring diagram).
Editorial: AFTER WANTING original Memory Garden collection and the book's existing typographic cover concept.

Screenshots in assets/showcase were captured from the public project pages on 19 November 2026 and encoded as local WebP files. They are static previews, not interactive embedded applications. Device shells are original CSS; no third-party runtime, subscription, or screenshot service is needed by visitors. Existing Little World and clothing assets are reused.

References reviewed: https://thesyedbasim.com/work (user-supplied screenshots), https://github.com/picturepan2/devices.css (CSS device approach, no source copied), https://www.thum.io/documentation/api/url (capture API).

## Maintenance and checks

Refresh screenshots when project interfaces change. Keep the actual viewport ratio; never squeeze a desktop screenshot into a phone.

qa/showcase.html provides a noindex same-origin iframe to check widths 320, 390, 768, and 1140 using `?width=390&project=project-bourn`. It reports document overflow, image loading failures, and showcase count. Main project links stay normal HTML links and work without showcase JavaScript.

Static checks confirmed: 11 showcase rows; all original main links retained; no duplicate IDs; local preview images exist; no hero project shelf; immersive-world.js syntax unchanged and valid.

## MachineScope addition — 27 November 2026

MachineScope appears in Engineering / Machine Intelligence with the existing system-study visual component. Its visual explains the workflow and is not a screenshot. Live app and public case study links are included; source repository visibility is awaiting GitHub account verification. Existing chapter design and JavaScript are unchanged. Showcase rows now total 12. Static checks confirm unique IDs, sequential numbered project rows, correct Engineering placement and preservation of all existing link destinations.
