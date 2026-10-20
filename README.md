# Major Projects Office

A responsive Bootstrap 5 realization of Loogart’s [August 2025 Figma design](https://www.figma.com/design/y26tBAblpkSNl9CauhLodl/Major-Projects-Office-Final-August-27-2025?node-id=477-128).

## Preview

Open `index.html` in a browser. Everything required to render the site is included locally; no install, build, API keys, or backend is needed.

For a local server, run this from this folder:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Publish on GitHub Pages

1. Create your new GitHub repository.
2. Upload **the contents of this folder** to the repository root. `index.html` must be at the root, alongside `styles.css`, `script.js`, `assets/`, and `vendor/`.
3. Commit the files to `main`.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/(root)**, and save.
6. GitHub will show the published address on that page when deployment finishes.

All file paths are relative, including SVG icon references, so this works under a GitHub Pages repository subdirectory. `.nojekyll` tells Pages to serve these static files directly. No GitHub Actions setup is required.

## Included

- Bootstrap 5.3.3, stored in `vendor/`.
- Locally hosted Geist typefaces, with their OFL license in `assets/Geist-LICENSE.txt`.
- Original Figma artwork, logos, illustrations, and photographs downloaded into `assets/`.
- Responsive navigation, three priority cards, a three-stage review section, the six-project registry, announcements, contact form, confirmation screen, and footer.
- Accessible project detail dialogs and a review-process accordion.
- Native SVG artwork with a single draw-on of its existing connections, followed by horizontal aircraft drift, separated floating flower heads, waving water, a flame rocking around its center, and a continuous trim loop in the infinity symbol. No visible overlay trails or markers.
- Word-by-word heading reveals with fade, blur, and upward movement, reversible on scroll.
- Support for the operating system’s reduced-motion preference, without a floating motion button.
- Skip navigation, visible keyboard focus, and Bootstrap’s modal focus handling.

## Edit the site

- **Content and links:** `index.html`
- **Colors, spacing, breakpoints, and motion:** `styles.css`; the main colors are `--green`, `--dark-green`, `--lime`, and `--paper`.
- **Project dialog content and heading/scroll animation:** `script.js`
- **Artwork:** `assets/`

The hero artwork supplied by Figma is a transparent PNG, retained intact as `assets/imgImage6.png`. The homepage now uses a vector tracing of that artwork, with its original three-color palette and geometry. This is a conversion from the PNG, not an export of original Illustrator/Figma vector paths. `assets/hero-design.svg` is the static traced artwork, and `assets/hero-animated.svg` is a self-contained animated version. The homepage inlines the same vector shapes so its shapes can move directly without a network fetch or runtime library. No screenshot of the page is used as an implementation asset.

## Content decisions

The six project names, classifications, partners, and dollar amounts are preserved from the design as illustrative portfolio content; their dialogs identify them as such. The unfinished August 27 announcement placeholder was replaced with the [official August 29, 2025 launch announcement](https://www.pm.gc.ca/en/news/news-releases/2025/08/29/prime-minister-carney-launches-new-major-projects-office-fast-track-nation-building-projects). Other announcement copy follows the supplied design.

Navigation and calls to action connect the local pages. Policy references and the explicitly labeled official links lead to public resources. The Français link opens the official French-language website; this local concept currently contains the English page. The footer identifies this as an independent portfolio demonstration.

## Verification

Checked all eight pages in the in-app browser at 1440px desktop, 390px phone, and intermediate tablet widths. Verified mobile menu expansion and collapse after navigation, all six project dialogs, the review modal and accordion, word reveals, asset rendering, horizontal page width, required-field validation, and the demo contact-to-confirmation flow. JavaScript syntax and local file/anchor references were also checked.

## Credits

Design and artwork: Loogart / supplied Figma file. Original artwork and government identifiers retain their existing rights; no new license for them is granted here. Bootstrap is MIT-licensed (copyright notice retained in the distributed files). Geist is licensed under the SIL Open Font License.

## Complete page inventory

| Page | File | Figma frame |
| --- | --- | --- |
| Homepage | `index.html` | `477:128` |
| About Us and Leadership | `about.html` | `477:425` |
| Advancing Nation-Building Projects | `nation-building.html` | `790:284` |
| Partnering with Indigenous Peoples | `indigenous.html` | `790:588` |
| Supporting Proponents | `proponents.html` | `803:204` |
| Project Registry | `projects.html` | `803:448` |
| Contact | `contact.html` | `968:335` |
| Thank You | `thank-you.html` | `968:901` |

The About Us menu exposes all interior information pages. Homepage priority cards link to their matching pages. Project links open the corresponding project details, and contact calls to action open the contact page. The wide artwork, leadership portraits, oversized vector graphics, funding panels, and all six registry images are included locally.

## Contact form

The contact form validates required fields and the email address, then opens `thank-you.html?demo=1`. This static demonstration does **not** send or store contact information, and the demo confirmation states that clearly. The default confirmation layout retains the supplied design wording with a visible preview note. To receive real inquiries, connect a form service or backend and replace the demo submission handler in `script.js`. Do not remove the demo notice until delivery is configured. GitHub Pages itself cannot process form submissions.

Leadership names, roles, and bios reproduce the original concept, including its illustrative content. They are not a current staff directory. Funding copy follows the supplied August 2025 design.

## Refined hero motion

The hero uses traced native SVG shapes derived from the supplied PNG. Its existing connections draw once over approximately 3.3 seconds. The aircraft moves only horizontally over an 18-second cycle. Two flower heads move vertically by 8 SVG units in either direction, with different rhythms and generous separation; their connecting stem stays continuous. The water layers gently shift, tilt, and flex in staggered phases. The fire rocks between -4 and +4 degrees around its own center. An invisible animated mask continuously trims the actual infinity symbol in a seamless seven-second loop. No colored trails or additional decorative geometry are overlaid on the artwork.

The operating system’s reduced-motion preference shows the complete static illustration and fully visible text. There is no pause button. The standalone `assets/hero-animated.svg` includes its own motion styles and reduced-motion support.

Hero timings are under the “Animate the actual artwork” comment in `styles.css`. Named SVG groups include `hero-aircraft`, `hero-energy-flame`, `hero-flower-upper`, `hero-flower-lower`, `hero-infinity`, and `hero-water-*`. The SVG is an automatic tracing; an original vector source would allow exact source-curve fidelity.

## Layout and reversible reveals

Header and content proportions follow the Impact Canada reference (https://impact.canada.ca/en): a 220px-wide Government of Canada signature in a 48px top bar, a compact office logo in a 76px navigation row, and a 969px desktop container including 15px inner gutters. Between 768px and 1199px, containers fill the available width with 32px outer margins, up to the 969px desktop maximum; hero headings scale from 44px to 50px to avoid excessive wrapping. Small tablets below 768px use 540px, and phones retain 20px gutters. Navigation text and its contact button use 16px type. About-page columns remain fluid within the narrower layout; homepage priority cards stack below the desktop breakpoint so headings retain comfortable space. Verified all eight pages at 390px, 768px, 1024px, and 1440px widths after this refinement.

All eight pages share restrained content fades and vertical lifts. Reveal progress follows each item’s position near the bottom of the viewport and reverses on upward scrolling. Cards, leadership profiles, and process steps have a small stagger. Long content stays visible while reading.

Every HTML heading is split into words without changing its text, line breaks, emphasis, links, or buttons. Words fade in from a 6px blur and a small upward lift, staggered in reading order. Initial visible headings have a short entrance; later headings follow scroll position and reverse as they leave the reveal range on upward scrolling. Project dialog titles are prepared again when their text changes.

Keyboard focus forces the focused heading or interactive content block visible. Reduced-motion preferences and print styles show all content immediately. Without JavaScript, all text and content remain visible. No extra animation library is required.
