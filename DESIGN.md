# Fermentation Dynamics — Design System

> Scientific precision meets kitchen warmth. A data-rich fermentation simulator that feels trustworthy, clean, and approachable.

---

## 1. Visual Theme & Atmosphere

**Philosophy**: "Quiet confidence." The interface recedes so the data can speak. White canvas with barely-there borders, soft shadows for depth, and generous spacing that lets each element breathe. Color enters purposefully — green for life and growth (fermentation), blue and purple for microbial data, amber for caution.

**Density**: Medium-low. Enough information density for scientific users, enough whitespace for newcomers. Progressive disclosure hides complexity behind clean toggles.

**Mood**: Lab notebook meets modern dashboard. Not playful, not austere — trustworthy and warm.

**Signature patterns**:
- Shadow-as-border on cards (1px ring shadow, no CSS borders)
- Monospace numbers for all data values (tabular-nums)
- Green accent used sparingly: CTA buttons, active states, safety indicators
- Subtle warm tint in shadows (not pure gray)

---

## 2. Color Palette & Roles

### Light Mode

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#FAFBFC` | Page canvas — barely off-white |
| `--bg-surface` | `#FFFFFF` | Card/panel surfaces |
| `--bg-surface-raised` | `#FFFFFF` | Elevated cards (differentiated by shadow) |
| `--bg-subtle` | `#F1F5F9` | Recessed areas, code blocks, input backgrounds |
| `--text` | `#0F172A` | Primary text — near-black, not pure |
| `--text-secondary` | `#475569` | Secondary prose, descriptions |
| `--text-muted` | `#94A3B8` | Tertiary: labels, placeholders, axis ticks |
| `--text-faint` | `#CBD5E1` | Disabled, decorative |
| `--border` | `rgba(15, 23, 42, 0.08)` | Card borders (shadow-as-border) |
| `--border-strong` | `rgba(15, 23, 42, 0.12)` | Input borders, dividers |
| `--border-focus` | `rgba(34, 197, 94, 0.5)` | Focus rings |

### Dark Mode

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#0C0F17` | Page canvas — deep navy-black |
| `--bg-surface` | `#151922` | Card/panel surfaces |
| `--bg-surface-raised` | `#1C2130` | Elevated cards |
| `--bg-subtle` | `#1E2536` | Recessed areas |
| `--text` | `#E8ECF1` | Primary text — warm off-white |
| `--text-secondary` | `#94A3B8` | Secondary |
| `--text-muted` | `#64748B` | Tertiary |
| `--border` | `rgba(148, 163, 184, 0.08)` | Card borders |
| `--border-strong` | `rgba(148, 163, 184, 0.12)` | Input borders |

### Accent & Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#16A34A` | Primary CTA, active states, "safe" status |
| `--accent-hover` | `#15803D` | Hover on accent elements |
| `--accent-soft` | `rgba(22, 163, 74, 0.10)` | Accent backgrounds (badges, highlights) |
| `--blue` | `#3B82F6` | Info, early-phase species (chart) |
| `--purple` | `#8B5CF6` | Late-phase species (chart) |
| `--amber` | `#F59E0B` | Warning, nitrite, caution states |
| `--red` | `#EF4444` | Error, danger, high-risk |
| `--teal` | `#14B8A6` | Secondary accent (mid-phase species) |

### Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-ring` | `0 0 0 1px var(--border)` | Card border replacement |
| `--shadow-xs` | `0 1px 2px rgba(15, 23, 42, 0.04)` | Subtle lift (buttons resting) |
| `--shadow-sm` | `0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)` | Small cards, inputs |
| `--shadow-md` | `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)` | Main cards |
| `--shadow-lg` | `0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04)` | Elevated panels, modals |
| `--shadow-focus` | `0 0 0 3px var(--border-focus)` | Focus state ring |

---

## 3. Typography Rules

**Families**:
- Primary: `Inter`, `Noto Sans KR`, `Noto Sans SC`, `system-ui`, sans-serif
- Monospace: `JetBrains Mono`, `SF Mono`, `Consolas`, monospace
- OpenType: `font-feature-settings: "cv01", "cv03", "ss01"`

**Weights**: 400 (body), 500 (UI labels), 600 (headings), 700 (hero numbers)

| Role | Size | Weight | Line-Height | Letter-Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| Hero Number | 32px | 700 | 1.0 | -0.02em | Monospace, tabular-nums, accent color |
| Card Heading | 15px | 600 | 1.3 | -0.01em | Primary text color |
| Section Title | 13px | 600 | 1.4 | 0 | Uppercase optional, secondary color |
| Body | 13px | 400 | 1.6 | 0 | Primary text |
| Small Body | 12px | 400 | 1.5 | 0 | Secondary text |
| Caption | 11px | 500 | 1.4 | 0.01em | Muted, chart annotations |
| Micro | 10px | 500 | 1.3 | 0.02em | Unit labels, footnotes |
| Data Value | 13px | 600 | 1.0 | 0 | Monospace, tabular-nums |

---

## 4. Component Stylings

### Cards

**Standard Card**:
```css
background: var(--bg-surface);
box-shadow: var(--shadow-ring), var(--shadow-md);
border-radius: 16px;
padding: 20px;
border: none; /* shadow-as-border replaces this */
```

**Subtle Card** (nested/recessed):
```css
background: var(--bg-subtle);
border-radius: 12px;
padding: 16px;
border: none;
box-shadow: none;
```

### Buttons

**Primary (CTA)**:
```css
background: var(--accent);
color: #FFFFFF;
font-size: 14px;
font-weight: 600;
padding: 10px 20px;
border-radius: 10px;
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
transition: all 0.15s ease;
/* Hover: background var(--accent-hover), translateY(-1px) */
```

**Ghost Button**:
```css
background: transparent;
color: var(--text-secondary);
border: 1px solid var(--border-strong);
padding: 6px 12px;
border-radius: 8px;
font-size: 12px;
font-weight: 500;
/* Hover: background var(--bg-subtle) */
```

**Chip / Toggle**:
```css
background: var(--bg-subtle);
color: var(--text-secondary);
font-size: 12px;
font-weight: 500;
padding: 6px 12px;
border-radius: 8px;
border: 1px solid transparent;
/* Active: background var(--accent-soft), color var(--accent), border-color var(--accent) with 0.2 opacity */
```

### Inputs

**Number Input**:
```css
background: var(--bg-subtle);
color: var(--text);
font-family: var(--mono);
font-size: 14px;
font-weight: 600;
font-variant-numeric: tabular-nums;
text-align: center;
width: 64px;
padding: 8px 4px;
border: 1px solid var(--border-strong);
border-radius: 8px;
/* Focus: border-color var(--accent), box-shadow var(--shadow-focus) */
```

### Navigation / Header

```css
position: sticky;
top: 0;
z-index: 100;
background: var(--bg); /* Solid, no blur — cleaner */
border-bottom: 1px solid var(--border);
padding: 0 24px;
height: 52px;
```

### Microbe Species Cards

```css
padding: 8px 12px;
border-radius: 10px;
border-left: 3px solid; /* Species color */
background: transparent;
transition: background 0.2s;
/* Active: background var(--bg-subtle) */
```

---

## 5. Layout Principles

**Spacing Scale** (8px base):

| Token | Value | Usage |
|-------|-------|-------|
| `--sp-1` | 4px | Tight grouping (label + value) |
| `--sp-2` | 8px | Element gap, inline spacing |
| `--sp-3` | 12px | Card internal padding (compact) |
| `--sp-4` | 16px | Card padding, section gap |
| `--sp-5` | 20px | Between cards |
| `--sp-6` | 24px | Section padding |
| `--sp-8` | 32px | Major section breaks |
| `--sp-10` | 40px | Hero spacing |
| `--sp-12` | 48px | Page margins |

**Container**: `max-width: 960px`, centered, `padding: 0 20px`

**Grid**: Two-column (1fr 1fr) on desktop, single column on mobile (< 768px). Gap: 16px.

**Border Radius Scale**:

| Token | Value | Usage |
|-------|-------|-------|
| 6px | Inputs, small badges |
| 8px | Buttons, chips, inner cards |
| 10px | Standard buttons |
| 12px | Nested cards |
| 16px | Main cards |
| 9999px | Pills, badges |

---

## 6. Depth & Elevation

| Level | Shadow | Usage |
|-------|--------|-------|
| Flat | None | Recessed panels, nested content |
| Resting | `var(--shadow-ring)` | Subtle boundary, inactive cards |
| Raised | `var(--shadow-ring), var(--shadow-sm)` | Interactive cards at rest |
| Elevated | `var(--shadow-ring), var(--shadow-md)` | Main content cards |
| Floating | `var(--shadow-lg)` | Dropdowns, tooltips, popovers |
| Focus | `var(--shadow-focus)` | Active input/button focus |

**Dark mode note**: Shadows become near-invisible. Rely on surface color stepping (subtle luminance differences) for depth instead.

---

## 7. Do's and Don'ts

### Do
- Use shadow-as-border (`box-shadow: 0 0 0 1px`) instead of CSS `border` for cards
- Use monospace + tabular-nums for ALL numerical data
- Limit accent green to interactive elements and safety indicators
- Use 400/500/600 weight progression — no bold (700) except hero numbers
- Let data values be the visual focal point (larger, darker than labels)
- Prefix unit labels in muted color, smaller than the value they annotate
- Maintain 8px spacing rhythm

### Don't
- Don't use glassmorphism/frosted glass (too heavy for data-dense UI)
- Don't use decorative gradients or glows
- Don't set body text below 12px (accessibility)
- Don't use pure black (`#000`) or pure white (`#FFF`) for text
- Don't put shadows on elements inside cards (one shadow level per surface)
- Don't use colored text for body paragraphs (reserve for status/accent only)
- Don't animate chart redraws with CSS transitions (use Chart.js built-in)
- Don't use `backdrop-filter: blur()` on the header (causes paint thrashing on scroll)

---

## 8. Responsive Behavior

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Desktop | ≥ 960px | Two-column layout, full sidebar |
| Tablet | 768–959px | Two-column with tighter gaps |
| Mobile | 640–767px | Single column, stacked cards |
| Small Mobile | < 640px | Compact cards, reduced padding, smaller type |

**Collapsing rules**:
- Two-column grid → single column at 768px
- Process flow strip → horizontal scroll at 640px
- Header controls → wrap to second line at 640px
- Chart height: 280px → 200px at 640px
- Card padding: 20px → 14px at 640px
- Main container padding: 20px → 12px at 640px

**Touch targets**: Minimum 44×44px for all interactive elements on mobile.

---

## 9. Agent Prompt Guide

### Quick Reference
```
Background:  Light #FAFBFC / Dark #0C0F17
Surface:     Light #FFFFFF / Dark #151922
Text:        Light #0F172A / Dark #E8ECF1
Accent:      #16A34A (green)
Border:      box-shadow: 0 0 0 1px rgba(15,23,42,0.08)
Font:        Inter 400/500/600, JetBrains Mono for data
Radius:      16px cards, 10px buttons, 8px inputs
```

### Component Prompts

**Data Card**:
> Build a card on `#FFFFFF` surface, `box-shadow: 0 0 0 1px rgba(15,23,42,0.08), 0 4px 6px -1px rgba(15,23,42,0.06)`, `border-radius: 16px`, `padding: 20px`. Heading in Inter 600 15px `#0F172A`. Data values in JetBrains Mono 600 13px with `font-variant-numeric: tabular-nums`.

**Status Chip**:
> Pill with `border-radius: 9999px`, `padding: 4px 10px`, `font-size: 11px`, `font-weight: 600`. Safe = `background: rgba(22,163,74,0.1)` + `color: #16A34A`. Warning = amber variant. Danger = red variant.

**Number Input**:
> Input on `#F1F5F9` background, `border: 1px solid rgba(15,23,42,0.12)`, `border-radius: 8px`, `width: 64px`, `text-align: center`, JetBrains Mono 600 14px. Focus: `border-color: #16A34A` + `box-shadow: 0 0 0 3px rgba(22,163,74,0.15)`.
