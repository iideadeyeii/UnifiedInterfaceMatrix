# Unified Dash Design Guidelines

## Design Approach

**Selected Framework:** Data-Centric Dashboard System (inspired by Linear, Grafana, and Carbon Design)

**Rationale:** This is a technical control plane requiring maximum information density, real-time monitoring clarity, and operational efficiency. Design prioritizes rapid comprehension of system state over aesthetic experimentation.

**Key Principles:**
- Data-first hierarchy: Critical metrics immediately visible
- Consistent information architecture across all panels
- Minimal cognitive load for status interpretation
- Zero decorative elements that don't serve function

---

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono for logs, metrics, code snippets

**Hierarchy:**
- Dashboard title: text-2xl font-semibold
- Section headers: text-lg font-medium
- Card titles: text-base font-medium
- Body text: text-sm font-normal
- Metrics/values: text-xl font-semibold (monospace)
- Labels/metadata: text-xs font-normal
- Status indicators: text-xs font-medium uppercase tracking-wide

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 or p-6
- Section gaps: gap-4 or gap-6
- Card spacing: space-y-4
- Inline spacing: space-x-2

**Grid Structure:**
- Main container: max-w-screen-2xl mx-auto px-4 or px-6
- Dashboard grid: grid grid-cols-12 gap-4 or gap-6
- Responsive breakpoints: Standard Tailwind (sm, md, lg, xl, 2xl)

**Card Layouts:**
- Single-column cards: col-span-12 md:col-span-6 lg:col-span-4
- Wide cards: col-span-12 lg:col-span-8
- Sidebar panels: col-span-12 lg:col-span-4
- Full-width: col-span-12

---

## Component Library

### Navigation
- Top bar with global actions and user profile
- Command bar (⌘K trigger) with search/action routing
- Breadcrumb navigation for nested views
- Quick action toolbar contextual to selected view

### Data Display Cards
**Standard Card Structure:**
- Header: Icon + Title + Status badge + Action menu (3-dot)
- Body: Metrics grid or data table
- Footer: Last updated timestamp + quick action buttons

**Card Variants:**
- **Service Status Cards:** Icon, name, health indicator (green/yellow/red dot), uptime percentage, quick actions (Open, Logs, Restart)
- **Metric Cards:** Large numerical value, label, trend indicator (up/down arrow), sparkline chart
- **Timeline Cards:** Chronological event list with timestamps, type icons, and expandable details
- **Camera Grid Cards:** 2x2 or 3x3 thumbnail grid with camera names, live indicators, and click-to-expand
- **GPU Monitor:** Dual bars (GPU0/GPU1), utilization percentage, VRAM usage bar, job queue count

### Status Indicators
- **Health dots:** Solid circles (8px) - green (operational), yellow (warning), red (critical), gray (offline)
- **Live indicators:** Pulsing animation on green dots only
- **Badges:** Rounded rectangles with text - subtle background, medium contrast text
- **Progress bars:** Height of 2 or 3, rounded, with percentage labels

### Interactive Elements
- **Primary actions:** Solid buttons with medium emphasis
- **Secondary actions:** Ghost buttons or icon buttons
- **Destructive actions:** Red accent with confirmation dialog
- **Command bar:** Full-width overlay with fuzzy search and keyboard navigation

### Data Visualizations
- **Bar charts:** Horizontal for comparisons (VRAM usage across GPUs)
- **Sparklines:** Inline trend indicators (CPU/memory over time)
- **Gauges:** Circular for percentage metrics (storage capacity)
- **Tables:** Sortable headers, row hover states, inline actions

### Forms & Inputs
- **Search:** Icon prefix, placeholder text, keyboard shortcuts hint
- **Toggles:** Switch components for camera enables, automation triggers
- **Dropdowns:** For GPU selection, model placement, service filtering
- **Text inputs:** Consistent height (h-10), border on focus

---

## Layout Patterns

### Dashboard Home
- Header: Logo + breadcrumb + command bar trigger + user menu
- Hero panel: System overview card spanning col-span-12 with key metrics (services up/down, GPU utilization, storage warning)
- Primary grid: 3-column layout on desktop (service cards, GPU monitor, storage alerts)
- Secondary row: Vision operations hub spanning 8 columns, automation summary 4 columns
- Bottom: Timeline feed full-width

### Service Discovery View
- Filterable card grid (2-3 columns responsive)
- Each card: Service icon, name, status, container ID, quick actions
- No pagination - scroll-based lazy loading

### GPU Scheduler View
- Split layout: GPU0 panel (left) | GPU1 panel (right)
- Each panel: Utilization bar, VRAM bar, job queue list, "Schedule Here" action
- Bottom: Placement recommendations with explanations

### Vision Hub
- Camera grid: 7 cards in responsive grid (3-4 columns desktop)
- Each camera: Thumbnail, name, caption toggle, rate limit input
- Caption stream: Scrollable timeline with filters (camera, time range, search)
- Automation builder: Side drawer triggered from caption entries

---

## Motion & Interaction

**Animations:** Use sparingly - status transitions only
- Status dot color changes: 200ms ease
- Card hover: slight elevation increase (shadow-md to shadow-lg)
- Loading states: Subtle pulse on skeleton loaders
- No page transitions, no decorative animations

**Real-time Updates:**
- Metrics update without flash/fade - direct value change
- New timeline entries: slide-in from top with brief highlight

---

## Accessibility

- All status conveyed with icon + text, not just visual treatment
- Keyboard navigation for all interactive elements
- Focus indicators with high contrast rings
- ARIA labels on all icon-only buttons
- Sufficient contrast ratios (WCAG AA minimum)

---

## Images

**No hero images.** This is a functional dashboard - every pixel serves operational purpose. 

**Icons only:**
- Service type icons (Docker logo, database icons, camera icons)
- Status icons (checkmark, warning triangle, error X)
- Action icons (Heroicons library - consistent 20px or 24px sizes)

**Camera thumbnails:**
- Live snapshots from Reolink cameras displayed in Vision Hub
- Thumbnail size: 16:9 aspect ratio, ~200px wide
- Grid layout with camera names below each thumbnail
- Click to expand to full-size overlay