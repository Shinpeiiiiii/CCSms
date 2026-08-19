# Sidebar UI Redesign Prompt

## Objective

Redesign the sidebar of a modern **School Management System (Teacher Portal)** while maintaining the clean **white background**. The goal is to create a premium, enterprise-grade interface that is modern, minimal, and timeless.

> **Important:** Completely avoid blue, violet, purple, cyan, or any neon accent colors.

The design should feel similar to:

- Linear
- Notion
- GitHub
- Stripe Dashboard
- Microsoft Admin Center
- Vercel Dashboard

---

# Design Philosophy

The sidebar should prioritize:

- Simplicity
- Professionalism
- Excellent readability
- Clear information hierarchy
- Plenty of whitespace
- Consistent spacing
- Subtle interactions
- Accessibility

Avoid flashy gradients, glowing effects, or colorful UI elements.

---

# Color Palette

## Background

```
#FFFFFF
```

## Neutral Palette (Recommended)

| Element | Color |
|----------|---------|
| Sidebar Background | #FFFFFF |
| Sidebar Border | #E5E7EB |
| Primary Text | #111827 |
| Secondary Text | #475569 |
| Muted Text | #6B7280 |
| Icons | #64748B |
| Hover Background | #F8FAFC |
| Active Background | #F1F5F9 |
| Active Indicator | #334155 |

---

## Optional Accent

If a subtle accent color is desired, only use muted tones.

### Slate (Recommended)

```
Accent: #334155
Active BG: #F1F5F9
```

### Emerald

```
Accent: #15803D
Active BG: #ECFDF5
```

### Charcoal

```
Accent: #2F2F2F
Active BG: #F5F5F5
```

---

# Colors to Avoid

Do not use:

- Blue
- Violet
- Purple
- Cyan
- Neon colors
- Heavy gradients
- Glassmorphism
- Strong shadows
- Glow effects

---

# Sidebar Layout

The sidebar should feel spacious and balanced.

Recommended spacing:

- Sidebar width: **270–280px**
- Horizontal padding: **16–20px**
- Menu item height: **42–46px**
- Gap between menu items: **6–8px**
- Rounded corners: **10–12px**
- Gap between navigation groups: **24–32px**

The design should feel lighter and less cramped than the current version.

---

# Navigation Group Headers

The current section headers are **too small** and do not establish enough hierarchy.

Redesign them to feel like proper navigation categories.

Requirements:

- Font Size: **13–14px**
- Font Weight: **600 (Semibold)**
- Letter Spacing: **0.04–0.06em**
- Text Transform: **Title Case**
- Color: **#374151**
- Margin Top: **24–32px**
- Margin Bottom: **10–12px**

Example:

```
Administration

Academic

Students
```

Optionally place a subtle divider above each section (except the first).

Divider:

```
Color: #F1F5F9
Thickness: 1px
Spacing:
24px above
16px below
```

Avoid ALL CAPS headers.

The group title should immediately communicate the beginning of a new navigation section without relying on bright colors.

---

# Navigation Items

Navigation items should feel larger and easier to scan.

Requirements:

- Height: **42–46px**
- Horizontal Padding: **12–14px**
- Border Radius: **10px**
- Gap between icon and label: **12px**

Typography:

```
Font:
Inter

Size:
14–15px

Weight:
Normal: 500
Active: 600
```

Colors:

Default

```
#475569
```

Active

```
#111827
```

---

# Icons

Use **Lucide React** icons.

Requirements:

- Size: **18–20px**
- Stroke Width: **1.75**
- Default Color: #64748B
- Active Color: Match active text

Icons should feel consistent and slightly muted.

---

# Hover State

Hover interactions should be subtle.

On hover:

- Background changes to #F8FAFC
- Text darkens slightly
- Icon color transitions smoothly
- Duration: 180–220ms
- Ease In Out

Avoid:

- Scaling
- Bounce
- Glow
- Strong shadows

---

# Active State

Replace the current colored pill with a cleaner enterprise style.

Instead of:

```
[ Subject ]
```

Use:

```
┃ Subject
```

Active item should include:

- Thin 3–4px left indicator
- Very light background
- Semibold text
- Matching icon color
- No gradients
- No glow
- No drop shadow

---

# Suggested Navigation Structure

```
Dashboard

────────────────

Administration
    Department
    Accounts

────────────────

Academic
    Program
    Subject
    Enrollment Period
    Curriculum
    Sections
    Section Subjects
    Academic Loads
    Prerequisites

────────────────

Students
    Students
    Grades
    Applications
```

Every navigation group should be visually distinct without using bright colors.

---

# User Profile Card

Replace the dark footer with a cleaner profile card.

Include:

- Circular avatar
- User name
- Role badge
- Three-dot overflow menu

Card Style:

- White background
- Thin border
- Border radius: 12px
- Soft shadow
- Comfortable padding

Avoid dark backgrounds.

---

# Animations

Animations should be subtle and professional.

Duration:

```
180–220ms
```

Animate only:

- Background color
- Text color
- Icon color

Avoid:

- Rotation
- Scaling
- Bounce
- Elastic effects

---

# Accessibility

Ensure:

- High contrast text
- Large clickable areas (minimum 40px)
- Clear keyboard focus state
- Easy-to-read typography
- Consistent spacing

---

# Overall Design Direction

The sidebar should resemble enterprise software used by universities, healthcare systems, banks, or modern ERP platforms.

It should communicate:

- Professional
- Clean
- Premium
- Modern
- Trustworthy
- Minimal
- Timeless

The redesign should feel significantly more polished than the current version by improving hierarchy, spacing, typography, and navigation clarity while preserving the clean white background.