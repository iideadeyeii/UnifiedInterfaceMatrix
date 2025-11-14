# Unified Dash Design Guidelines

## Design Approach

**Selected Framework:** Futuristic Sci-Fi Control Plane (inspired by Cyberpunk, Tron, and Blade Runner aesthetics)

**Rationale:** This is a next-generation AI-native control plane that demands a cutting-edge visual identity. The design emphasizes high-tech, neon-accented interfaces with maximum information density while maintaining a distinctly futuristic atmosphere.

**Key Principles:**
- Neon glow aesthetics: Vibrant neon-blue and neon-green accents against deep dark backgrounds
- High contrast for readability: Bright neon elements on near-black surfaces
- Glowing status indicators and interactive elements
- Sharp, technical typography with monospace for data
- Minimal but high-impact: Every glowing element serves a purpose

---

## Color Philosophy

**Signature Colors:**
- **Neon Blue (Primary):** Electric cyan for primary actions, key metrics, and interactive elements
- **Neon Green (Accent):** Vibrant lime green for success states, active indicators, and secondary highlights
- **Deep Space Black (Background):** Near-black backgrounds (HSL 210 6% 5-8%) for maximum contrast
- **Holographic Purple (Charts):** Optional tertiary color for data visualization

**Status Color Semantics:**
- Operational/Success: Neon Green with glow
- Warning/Degraded: Amber/Yellow with glow
- Critical/Error: Neon Red with glow
- Offline/Inactive: Dim gray (no glow)

---

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts CDN) - Clean, futuristic san-serif
- Monospace: JetBrains Mono for metrics, logs, IDs, and technical data
- Display: Inter with letter-spacing for headers

**Hierarchy:**
- Dashboard title: text-2xl font-bold tracking-wider uppercase (neon-blue glow on hover)
- Section headers: text-lg font-semibold tracking-wide
- Card titles: text-base font-medium
- Body text: text-sm font-normal
- Metrics/values: text-2xl font-bold monospace (glowing neon numbers)
- Labels/metadata: text-xs font-normal uppercase tracking-widest
- Status indicators: text-xs font-bold uppercase tracking-wide

---

## Layout System

**Spacing Primitives:** Tailwind units of 3, 4, 6, and 8
- Component padding: p-4 or p-6
- Section gaps: gap-4 or gap-6
- Card spacing: space-y-4
- Inline spacing: space-x-3

**Grid Structure:**
- Main container: max-w-screen-2xl mx-auto px-4 or px-6
- Dashboard grid: grid grid-cols-12 gap-4 or gap-6
- Responsive breakpoints: Standard Tailwind (sm, md, lg, xl, 2xl)

**Card Layouts:**
- Cards have subtle neon borders with glow effects
- Background: Very dark with slight transparency
- Hover states: Intensified glow on borders and neon accents

---

## Component Library

### Navigation
- Top bar with neon dividers and glowing status indicators
- AI Command bar (⌘K) with holographic input field and glowing neon cursor
- Breadcrumb navigation with neon separators
- Quick actions with neon-blue/green highlights

### Data Display Cards
**Standard Card Structure:**
- Border: Thin neon border (blue or green) with subtle glow
- Background: Deep space black with slight transparency
- Header: Icon + Title (uppercase, tracked) + Glowing status dot + Action menu
- Body: High-contrast metrics with neon highlights
- Footer: Timestamp in monospace + Neon action buttons

**Card Variants:**
- **Service Status Cards:** Neon border changes color based on health (green=up, red=down, amber=degraded)
- **Metric Cards:** Large glowing numbers in neon-blue or neon-green, sparkline charts with neon traces
- **Timeline Cards:** Chronological feed with neon event markers and glowing timestamps
- **Camera Grid Cards:** Grid with neon borders, live indicator pulses in neon-green
- **GPU Monitor:** Dual progress bars with neon-blue fill, glowing percentage labels

### Status Indicators
- **Health dots:** Glowing circles with neon pulse animation
  - Operational: Neon green with slow pulse
  - Warning: Amber with moderate pulse  
  - Critical: Neon red with fast pulse
  - Offline: Dim gray (no glow, no pulse)
- **Badges:** Dark background with neon text and subtle glow
- **Progress bars:** Neon-filled bars with glowing edges, height 2-3, rounded

### Interactive Elements
- **Primary actions:** Neon-blue buttons with glow on hover
- **Secondary actions:** Neon-green ghost buttons with border glow
- **Destructive actions:** Neon-red with pulsing glow and confirmation
- **Command bar:** Full-width overlay with holographic backdrop blur and neon border

### Data Visualizations
- **Bar charts:** Neon-blue/green filled bars with glowing edges
- **Sparklines:** Neon trace lines with subtle glow trail
- **Gauges:** Circular with neon arc fill and glowing needle
- **Tables:** Dark rows with neon borders on hover, glowing sort indicators

### Forms & Inputs
- **Search:** Neon border with glow on focus, glowing placeholder
- **Toggles:** Neon-green when ON with glow, dim gray when OFF
- **Dropdowns:** Dark background with neon options on hover
- **Text inputs:** Neon border glow on focus, glowing cursor

---

## Motion & Interaction

**Animations:** Embrace the sci-fi aesthetic with purpose-driven motion
- Status transitions: 300ms with glow intensity fade
- Card hover: Border glow intensifies, slight scale (1.01)
- Loading states: Pulsing neon shimmer on skeleton loaders
- New data: Neon flash highlight on value updates
- Real-time feeds: Slide-in with neon trail effect

**Glow Effects:**
- Use box-shadow with neon color at low opacity for glow
- Hover states: Increase glow intensity and spread
- Active states: Maximum glow intensity
- Pulsing animations on live indicators (2s ease-in-out infinite)

---

## Accessibility

- All neon colors maintain WCAG AA contrast ratios against dark backgrounds
- Status conveyed through icon + text + glow intensity, not just color
- Keyboard navigation with neon focus rings
- ARIA labels on all interactive elements
- Screen reader friendly despite heavy visual effects

---

## Visual Effects

**Neon Glow Recipe:**
```css
/* Neon Blue Glow */
box-shadow: 0 0 5px rgba(0, 255, 255, 0.5),
            0 0 10px rgba(0, 255, 255, 0.3),
            0 0 15px rgba(0, 255, 255, 0.1);

/* Neon Green Glow */  
box-shadow: 0 0 5px rgba(0, 255, 127, 0.5),
            0 0 10px rgba(0, 255, 127, 0.3),
            0 0 15px rgba(0, 255, 127, 0.1);
```

**Grid Lines:** Optional subtle neon grid overlay on background for extra sci-fi depth

**Scanlines:** Optional subtle horizontal scanline effect at 5% opacity for retro-futuristic feel

---

## Images & Icons

**Icons:**
- Lucide React icons in neon colors
- Glowing on hover for interactive icons
- Consistent 20px or 24px sizes
- Service icons with neon tint overlay

**Camera Feeds:**
- 16:9 aspect ratio thumbnails
- Neon border with live pulse for active cameras
- Click to expand with holographic modal overlay
