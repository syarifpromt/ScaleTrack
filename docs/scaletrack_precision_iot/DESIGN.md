---
name: ScaleTrack Precision IoT
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-weight-lg:
    fontFamily: JetBrains Mono
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.04em
  display-weight-lg-mobile:
    fontFamily: JetBrains Mono
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-weight-md:
    fontFamily: JetBrains Mono
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  mono-label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.06em
  mono-label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

The design system is calibrated for mission-critical industrial telemetry and precision measurement environments. It targets plant managers, QA technicians, laboratory operators, and logistics engineers who require immediate, unambiguous operational awareness under variable warehouse and workstation lighting. 

The aesthetic blends **Modern Industrial Tech** with **Utilitarian Minimalism**. Visual decisions prioritize high-density data legibility, low cognitive friction, and tactile feedback. Physical laboratory instruments and industrial switchgears inspire the interactive elements: crisp structural boundaries, dedicated functional zones, clear operational signifiers, and instant state feedback. The atmosphere feels authoritative, ultra-precise, engineered, and reliable.

## Colors

The palette balances clinical cleanliness with high-chroma functional indicators:

- **Primary Canvas & Surfaces**: The default application canvas utilizes `#F8FAFC`, while elevated analytical modules, metric panels, and operational docks leverage crisp `#FFFFFF`.
- **Primary Brand/Action (`#2563EB`)**: An electric blue used exclusively for primary affirmative actions, active navigational triggers, focus halos, and core system telemetry highlights. Interacted/pressed state settles into `#1D4ED8`.
- **Secondary / Deep Slate (`#0F172A`)**: Represents authoritative structural components, primary telemetry headers, and dominant numerical metrics. Paired with supporting slate (`#334155`) for secondary metrics and `#64748B` for meta labels.
- **Hardware Status Spectrum**:
  - **Connected / Calibrated / Nominal**: Emerald Green (`#10B981`) paired with subtle background tint (`#ECFDF5`).
  - **Tare / Zeroing / In-Transit**: Industrial Amber (`#F59E0B`) with tint (`#FFFBEB`).
  - **Overload / Offline / Alert**: Crimson (`#EF4444`) with tint (`#FEF2F2`).
- **Subtle Boundaries**: Structural panel dividing lines leverage `#E2E8F0`, transitioning to `#CBD5E1` for actionable control borders.

## Typography

Typography establishes an unambiguous distinction between human-readable interfaces, analytical framing, and real-time streaming machine data:

- **JetBrains Mono** serves as the telemetry and numerical core. Weight readouts, gross/tare measurements, batch IDs, serial identifiers, and sensor tolerances must always render in monospace with tabular lining figures to eliminate horizontal visual twitch during real-time load cell data streaming.
- **Space Grotesk** anchors dashboard section titles, operational mode banners, and top-tier metrics, imparting a precise, engineered personality.
- **Inter** handles all explanatory copy, status descriptions, user guidance, tooltips, and general dashboard navigation for maximum optical clarity at standard UI sizes.
- Monospace labels and technical operational flags (`mono-label-*`) should default to uppercase styling with positive letter tracking to mirror industrial equipment labeling.

## Layout & Spacing

The layout operates on an uncompromising 4px/8px modular base rhythm, structured across a dynamic 12-column responsive fluid grid:

- **Desktop (1280px+)**: 12 columns, `gutter-lg` (24px) gutters, and `margin-lg` (32px) screen margins. Enables a side-docked tactical instrument rack alongside expansive telemetry, multi-sensor trend charts, and batch tables.
- **Tablet / Industrial Touch Terminal (768px - 1279px)**: 8 columns, `gutter` (16px) gutters, and `margin-md` (24px) screen margins. Grid collapses into dedicated split views (Digital Readout Console on top/left, Actionable controls and logs on bottom/right).
- **Mobile Handheld (320px - 767px)**: 4 columns, `gutter` (16px) gutters, and `margin` (16px) margins. Scales stack vertically with prioritized large-format reading modules and prominent bottom-pinned hardware triggers.
- Density is prioritized: compact component padding keeps crucial instrument data within standard operational sightlines without demanding continuous vertical scrolling.

## Elevation & Depth

Visual hierarchy leverages crisp surface architecture combining flat structural outlines with subtle ambient elevation to retain technical clarity:

- **Level 0 (Canvas Base)**: Flat `#F8FAFC` base layer.
- **Level 1 (Card & Module Layer)**: Pure `#FFFFFF` surfaces bounded by a hairline 1px border (`#E2E8F0`) and an ambient, low-spread drop shadow: `0px 1px 3px rgba(15, 23, 42, 0.04), 0px 4px 6px -2px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Tactile Controls & Active Modals)**: Lifted interactive consoles, popovers, and calibrator sheets: bounded by `#CBD5E1` with shadow `0px 4px 12px -2px rgba(15, 23, 42, 0.08), 0px 2px 4px -1px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Overload & Urgent Interventions)**: High-contrast modal notifications bounded by contextual stroke (e.g., Crimson `#EF4444` at 50% opacity) with a tinted deep ambient shadow: `0px 12px 24px -4px rgba(239, 68, 68, 0.12), 0px 4px 8px -2px rgba(15, 23, 42, 0.06)`.
- No skeuomorphic bevels; mechanical tactility is rendered cleanly through solid borders and high-contrast state transitions.

## Shapes

The design system incorporates a disciplined **Soft (`1`)** corner geometry. Small components (buttons, input fields, badges, tabs) utilize `0.25rem` (4px) corner radii. Structural cards, telemetry viewports, and modals utilize `0.5rem` (8px). 

This restrained geometry preserves the industrial, rack-mounted instrument aesthetic, rejecting consumer-style overly-rounded pill shapes in favor of machined, tight corners that emphasize precision and structural order.

## Components

### Tactical Hardware Buttons (TARE, ZERO, CALIBRATE, PRINT)
- **Primary Industrial Triggers**: High-contrast, bold monospaced typography (`mono-label-lg`). Minimum height 48px to accommodate gloved operation.
- **TARE / ZERO**: Styled with a solid slate boundary (`#0F172A`), crisp white surface, and strong slate label. Hover shifts to `#F1F5F9`; Active/Pressed depresses visually with an internal inset shadow (`inset 0px 2px 4px rgba(0,0,0,0.12)`) and background `#E2E8F0`.
- **Affirmative Primary (SAVE / PRINT / ACQUIRE)**: Solid Electric Blue (`#2563EB`), text `#FFFFFF`, with a vibrant glow on focus (`0 0 0 3px rgba(37, 99, 235, 0.3)`).

### Digital Scale Weight Display Panels
- Prominent module featuring an inset-style container (`#0F172A` dark viewport variant or pure `#FFFFFF` light viewport with `#E2E8F0` border).
- Value rendered using `display-weight-lg` in `JetBrains Mono`.
- Sub-indicators display unit toggles (`kg`, `g`, `lbs`, `oz`), live center-of-zero markers `[>0<]`, stability indicators `[~ STABLE]`, and net/gross tags directly adjacent to the readout using high-contrast colored micro-badges.

### Status Indicators & IoT Health Chips
- Small, compact tags pairing an animated 6px live pulse dot with uppercase monospace text.
- **Online**: Background `#ECFDF5`, text `#065F46`, dot `#10B981`.
- **Tare Active**: Background `#FFFBEB`, text `#92400E`, dot `#F59E0B`.
- **Overload / Comm Fault**: Background `#FEF2F2`, text `#991B1B`, dot `#EF4444`.

### Data Tables & Log Records
- High density with 36px row heights. Alternating or border-separated rows (`#F1F5F9`).
- Timestamp and numerical measurements strictly right-aligned using tabular monospace numbers; device serials and status flags center-aligned; human-readable batch annotations left-aligned in standard sans-serif.

### Form Inputs & Limit Threshold Sliders
- Inputs feature 1px `#CBD5E1` borders, pure `#FFFFFF` background, and `Inter` body text. Focused state displays a crisp `#2563EB` border with a 2px blue ring.
- Tolerance configuration fields (Over / Accept / Under) are color-bracketed directly on input borders (Red for Under, Green for Accept, Yellow/Red for Over).