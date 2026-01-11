# Design Guidelines: Automotive Dealership Management System

## Design Approach

**Selected Approach:** Design System (Enterprise Productivity)

**Justification:** This is a utility-focused, data-heavy internal application requiring consistency, efficiency, and clarity. Drawing from modern enterprise tools like Linear, Notion, and Salesforce with emphasis on information density and rapid task completion.

**Core Principles:**
- Information clarity over visual flair
- Rapid scanning and task completion
- Consistent patterns across all tabs
- Mobile-responsive data tables

---

## Typography

**Font Stack:** Inter (Google Fonts) - optimized for UI and data readability

**Hierarchy:**
- Page Titles: 24px, font-semibold
- Section Headers: 18px, font-semibold  
- Table Headers: 14px, font-medium, uppercase tracking
- Body/Table Data: 14px, font-normal
- Labels: 12px, font-medium
- Metadata/Timestamps: 12px, font-normal

---

## Layout System

**Spacing Units:** Tailwind units of **2, 4, 6, 8** (p-2, m-4, gap-6, space-y-8)

**Container Structure:**
- Full-width application with left sidebar navigation (64px collapsed, 240px expanded)
- Main content area: max-w-full with px-6 py-8
- Cards/panels: p-6 with rounded-lg borders
- Dense data tables: p-4 cells with py-3 rows

**Grid Patterns:**
- Stat cards: grid-cols-2 md:grid-cols-4 gap-4
- Form layouts: grid-cols-1 md:grid-cols-2 gap-6
- Action buttons: space-x-2 for horizontal groups

---

## Component Library

### Navigation
**Left Sidebar:**
- Collapsible with icon-only mode
- 4 main tabs with icons (Inbox, Waitlist, Database, Chart)
- Active state: subtle background highlight
- Badge notifications for pending items

**Top Bar:**
- User profile (right)
- Search global (center-right)
- Notification bell with count

### Data Tables
**Standard Table Pattern:**
- Sticky header row
- Alternating row backgrounds for scannability
- Row hover state
- Inline status badges (rounded-full px-3 py-1 text-xs)
- Sortable columns with arrow indicators
- Checkbox selection column (left)
- Action menu (right, three-dot icon)

**Priority Badges:** Small pills with icons (High: exclamation, Medium: dash, Low: no icon)

**Status Badges:** Color-coded (use design system conventions, not specified here)

### Filters & Search
**Filter Bar (above tables):**
- Horizontal layout with dropdown filters
- Search input with icon (w-64 to w-96)
- "Clear filters" link when active
- Active filter count badge

### Forms
**Input Fields:**
- Full-width with labels above
- Helper text below in smaller font
- Required asterisk on labels
- Consistent height (h-10 for text inputs)

**Action Buttons:**
- Primary: px-4 py-2 rounded-md font-medium
- Secondary: border variant
- Tertiary: text-only
- Icon buttons: square (w-10 h-10) with centered icon

### Cards & Panels
**Information Cards:**
- Border, rounded-lg, p-6
- Header section with title + actions
- Content area with consistent spacing
- Footer for metadata/timestamps

**Stat Cards:**
- Compact design (p-4)
- Large number display (text-3xl font-bold)
- Label beneath (text-sm)
- Optional trend indicator (arrow + percentage)

### Detail Panels
**Email/Request Detail View:**
- Split layout (list 40% | detail 60%) on desktop
- Stacked on mobile
- Sticky action bar at top of detail panel
- Tabbed sections for related info (History, Notes, Client)

### Modals & Drawers
**Slide-out Drawer (right):** For quick-edit forms (w-96 to w-1/3)

**Modal Overlays:** For critical actions (max-w-2xl centered)

---

## Icons

**Library:** Heroicons (outline for navigation, solid for status indicators)

**Common Icons:**
- Inbox: envelope
- Waitlist: clock
- Database: database
- Stats: chart-bar
- Search: magnifying-glass
- Filter: funnel
- Actions: ellipsis-vertical
- Priority: exclamation-circle, minus-circle
- Edit: pencil
- Delete: trash
- Add: plus

---

## Responsive Behavior

**Breakpoints:**
- Mobile: Stack tables as cards with key info
- Tablet (md:): Show simplified tables, collapsible sidebar
- Desktop (lg:): Full data tables, expanded sidebar

**Mobile Tables:** Transform to card list with primary info prominent, secondary info in smaller text

---

## Animations

**Minimal Motion:**
- Sidebar expand/collapse: 200ms ease
- Dropdown menus: 150ms fade + slide
- Modal overlays: 200ms fade
- NO table loading animations, NO hover animations beyond subtle highlights

---

## Images

**No decorative images required.** This is a functional internal tool.

**Vehicle Photos (Section B - Stock):**
- Thumbnail in table (64x64 rounded)
- Gallery view in detail panel (grid-cols-3 with lightbox)
- Upload interface for adding photos

---

## Key Screen Patterns

**Tab 1 - Inbox:** Priority-based table → detail panel → response editor

**Tab 2 - Waitlist:** Filterable table → detail card with criteria → SMS composer

**Tab 3 - Knowledge Base:** Two sections (Info form + Vehicle table) with edit-in-place

**Tab 4 - Statistics:** Stat grid (top) → charts (middle) → detailed table (bottom)