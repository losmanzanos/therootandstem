# The Root and Stem

A single-page site for the trainings-and-retreats branch of Full Bloom Counseling.
Plain HTML, CSS and vanilla JS. No build step, no framework, no dependencies — drop the
folder on any host and it works.

```
rootandstem/
├── index.html
├── css/style.css
├── js/main.js
├── fonts/            self-hosted woff2, same faces as fullbloomcounseling.com
├── images/           licensed photography + logo files
└── README.md
```

---

## The tie to Full Bloom

Three places carry it, so the relationship is stated without being laboured:

- **The wordmark sub-line** — “A branch of Full Bloom Counseling”, under the logo in the nav and repeated in the footer.
- **The hero** — “Every bloom needs something holding it up.” The headline, *Before the bloom, the root*, names the relationship in the brand's own botanical language.
- **A dedicated section** — “Grown from Full Bloom Counseling”, with a link across and a plain sentence pointing therapy-seekers back to Full Bloom.

The JSON-LD also declares Full Bloom as `parentOrganization`, which is the signal that
tells search engines the two sites are related rather than duplicative.

## Design relationship

**Shared with Full Bloom** — Cormorant Garamond + DM Sans, self-hosted; the 2px radius;
uppercase letterspaced eyebrows and buttons; the fixed header that goes opaque on scroll.

**Its own** — forest and clay instead of cream and petal. Editorial asymmetric grid with
hanging index numbers. Film grain over the whole page. Line-by-line masked reveals on
headings, clip-path wipes on images, parallax on the full-bleed sections.

| Token | Value | Use |
|---|---|---|
| `--forest` | `#263A2F` | primary dark, buttons, headings |
| `--forest-deep` | `#16231B` | hero, interlude, footer |
| `--moss` | `#6E8B6A` | rules, tags, accents |
| `--clay` / `--clay-dark` | `#B07A55` / `#8C5C3B` | index numerals, eyebrows — the thread back to Full Bloom's petal |
| `--paper` / `--cream` | `#FBF8F2` / `#F2ECE1` | alternating bands |

## The logo

Roots, a stem, and a **bud that hasn't opened yet** — held in a seed ring broken top and
bottom, so the plant grows out of it and through it.

The earlier version terminated in a leaf, which made the whole mark read as a tree. That
was wrong: a stem belongs to a flowering plant, and the stem is the thing holding the
bloom up. The bud also does the concept better than an open flower would — the name is
*Before the bloom, the root*, so the bloom shouldn't have happened yet.

Eight variants were tested at four sizes on both grounds. The symmetrical ones read as a
spade or an insect; the single leaf low on the left is what keeps it alive. Three files:

- `images/mark.svg` — glyph only, inherits `currentColor`
- `images/logo-lockup.svg` — glyph + wordmark + sub-line
- `images/favicon.svg` — reversed on a forest tile

The wordmark sets “and” in italic Cormorant at reduced weight — a small typographic
signature that keeps the three-word name from reading as a list.

## Photography

Six images, licensed through Adobe Stock **on your Adobe account** — they're yours, and
the licences are on file there. All six are conventional photographs, not AI generations
(each was checked for `isGenTech: false` before licensing).

They were then graded to a single house look: desaturated, split-toned toward forest
shadows and warm highlights, with the roots and cabin shots pushed further into duotone
because their native colour fought the palette. Each is exported as WebP with a JPEG
fallback and correct `width`/`height` to prevent layout shift.

| File | Adobe Stock ID | Where |
|---|---|---|
| `hero-stems` | 273532039 | hero |
| `room` | 1034362084 | “why we started” |
| `roots` | 472274029 | full-bleed interlude |
| `cabin` | 258471563 | retreats |
| `seedhead` | 407532685 | who teaches |
| `leaves` | 589263674 | join section |

The hero and the “who teaches” image were both replaced in v2 for the same reason as the
logo: a conifer forest and a stand of pine trunks are trees, not stems. They're now a
field of grass and flower stems in mist, and a dried seed head still standing on its
stem. Same mood, correct botany. The meadow shot was cropped below its treeline and
graded off its native cold blue toward the site's warm forest tones.

---

## Launch state

Every placeholder is filled. There is no bracketed text left in the page — it is
publishable as-is tonight.

Four things were written to be *true now* rather than aspirational, and should be
revisited as facts change:

**1. CE credit.** The FAQ says approval is **in progress** and that hours and the
approving body will be listed per-training once confirmed. It also says plainly that most
retreats won't carry CE. Nothing on the page claims an approval you don't hold — worth
keeping it that way, since a false CE claim is a licensing problem, not a marketing one.

**2. Reduced-rate seats — I picked two per cohort.** That's a business decision I made a
default for, not one you told me. Change the number in the FAQ if it's wrong.

**3. Cancellation policy** — full refund to 30 days, half to 14, credit after that,
emergencies case by case. Standard shape for this kind of programme. Read it once and
make sure you're willing to honour it.

**4. Nobody is named as faculty.** The section now says teaching assignments are still
being set, which is true and reads as deliberate. When they're settled it becomes a row
of photographs with names, credentials and a line each — get written consent first.

### The signup form works tonight

`action=` is still `#`, so `main.js` catches the submit and hands the address to the
visitor's mail client, pre-addressed to `hello@therootandstem.com` and pre-written. Not
elegant, but it means nobody who tries to sign up tonight falls into a void.

**When you connect Mailchimp / Flodesk / ConvertKit**, set `action=` to their endpoint and
the fallback switches itself off — no other change needed.

### Two things to confirm before you push

- **`hello@therootandstem.com` must exist.** It appears in the footer, the join section,
  the calendar note, the schema, and the form fallback. If the mailbox isn't created,
  every one of those is a dead end.
- **The calendar is a deliberate "not yet" panel**, not an empty list. When you have real
  dates, delete the `.agenda-empty` block and use the `.agenda` list markup below it —
  those styles are already written and waiting.

## On the writing

The first draft had the usual tells. This one was measured against them:

| | first draft | now |
|---|---|---|
| “actually” | 6 | 1 |
| “no ___, no ___, no ___” runs | 3 | 0 |
| “Made for humans, by humans” in the footer | yes | removed |
| scrolling word ticker + animated scroll line | yes | removed |
| section length spread | all within ~15% | 37–281 words |

That last row matters most. Writing by one person is lumpy — the retreats section runs
long because it's the emotional centre, the supervision blurb is four flat sentences
because it's admin. Even, well-proportioned sections are the real tell.

On the two gaps that used to be bracketed: they're now filled with copy that is true
without being invented. The "why" section says Full Bloom already had the pieces and this
is that habit opened outward — grounded in what the practice actually is, with no
fabricated anecdote. The retreat paragraph says the first one is being booked without
naming a place that doesn't exist yet.

Both would still be better with the real thing. The specific training that started this,
and the actual location once it's signed — those will outperform anything written from
the outside. Drop them in when you have them; the paragraphs are sized for it.

## Build notes

- **Fonts self-hosted**, two preloaded, hero image preloaded as WebP — no third-party
  requests, nothing render-blocking.
- **Works without JS.** `main.js` only adds header state, the drawer, reveals, parallax
  and scrollspy. The FAQ uses native `<details>`.
- **`prefers-reduced-motion`** disables grain, parallax and every reveal, and
  forces all content visible.
- **Accessibility** — skip link, visible focus rings, `aria-expanded` on the toggle,
  decorative SVGs hidden, one `h1`, alt text on every content image.
- **Cache busting** — `style.css?v=4`, `main.js?v=4`. Bump on edit, same convention as
  the Full Bloom site.

Three bugs worth knowing about, since all are easy to reintroduce:

1. **Never put the reveal `clip-path` on the element the IntersectionObserver watches.**
   It clips itself to zero height, the observer never registers it, and it can never
   reveal. The clip lives on the inner `<picture>`.
2. **`<picture>` is a real box.** A full-bleed `<img height:100%>` inside one has nothing
   to resolve against unless the `<picture>` is given a height too.
3. **Line masks shear descenders.** The heading reveal wraps each line in an
   `overflow:hidden` box, and at this leading Cormorant's g/p/y tails fell outside it.
   The inner element carries a `padding-bottom` to grow the mask and the line carries a
   matching negative margin to give the leading back. If you retune the heading
   `line-height`, re-check a word with a descender.

## Local preview

```bash
cd rootandstem && python3 -m http.server 8000
```
