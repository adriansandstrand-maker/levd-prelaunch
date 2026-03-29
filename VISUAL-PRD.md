# Clawdbot Visual PRD
## Adrian's Design Preferences

---

## Who I Am

My name is Adrian. I am Norwegian, based in Miami, Florida. I run Beach Consult AS, a Norwegian consulting company. I study International Relations at Florida International University.

My background is business, sales, and tech entrepreneurship. I think in systems. I value clean execution over decoration.

---

## Primary Use Case

You are helping me build UI/UX mockups for **Levd.ai**.

Levd.ai is a "Life Infrastructure Platform" — a personal archive where users store and organize life data over time. Think structured, private memory system.

Tech stack:
- React + TypeScript + Vite
- Tailwind CSS
- shadcn/ui components
- Supabase (backend and auth)
- Vercel (deployment)

All UI work must be compatible with this stack. Default to shadcn/ui patterns and Tailwind utility classes.

---

## Visual Identity

### Aesthetic Direction

Three words describe my style: **minimalist, Nordic, technical**.

Reference products I admire: **Notion, Linear, Figma UI kits**. Study these. Absorb their restraint, their precision, their use of space.

What this means in practice:
- No decoration for decoration's sake
- Every element earns its place
- Functionality drives form
- Clean grid, clear hierarchy

### Color

**Background:** Off-white or cream. Not pure white (#FFFFFF). Think warm paper, not sterile lab.

**Accents:** Two colors in balance. Not one dominant, not a rainbow. Two tones that complement each other and carry equal visual weight. Pick colors that feel calm and considered, not playful or loud.

**Mode:** Both light and dark mode matter equally. Design with both in mind. When I specify one, optimize for that. When I do not specify, default to light.

### Typography

**Style:** Monospace or technical. This is non-negotiable. Think JetBrains Mono, IBM Plex Mono, Geist Mono, or similar. It should feel like it was built, not styled.

Apply monospace consistently across UI text, labels, and data display. Use it to reinforce the archival, technical nature of Levd.ai.

### Spacing and Layout

**Whitespace:** Balanced. Not cramped, not empty. Elements breathe but information density stays reasonable.

**Border radius:** Slightly rounded, 4px to 8px. Feels precise, not soft. Avoid pill shapes and fully sharp corners.

**Section separation:** I am undecided on this. Default to using a combination of subtle borders and background color variation. Do not use heavy shadows. Keep it light.

**Screen sizes:** Desktop and mobile matter equally. Design responsive from the start. Do not build desktop-only mockups unless I ask.

---

## Approved Reference: Hero Section

This hero section was built and approved on 2026-03-28. It is the visual benchmark for all future Levd.ai UI work. When in doubt, match this.

### What it does right

**Typografi:** JetBrains Mono throughout the entire layout, not just in code blocks. It signals "built, not marketed."

**Two accents in balance:** Warm sand (#6B5C3E) and cool forest (#2F5F52). Neither dominates. Warm accent on some cards, cool accent on hover states and primary CTA.

**Subtle grid texture:** 32px background grid at 5% opacity. Invisible at first glance, adds depth without decoration.

**Micro-interactions with purpose:**
- Cards slide 3px right on hover and reveal an accent stripe on the left
- Typewriter animation cycles through real product values: archived, structured, searchable, yours
- Counter animates up on load

**Off-white layering:** Three tones of off-white create depth without shadows. Background #F7F4EF, right panel slightly darker, cards one layer darker again.

### Concrete color tokens to use

| Token | Hex | Usage |
|---|---|---|
| Background base | #F7F4EF | Page background |
| Background panel | rgba(47,95,82,0.04) | Secondary panels |
| Background card | #F2EDE6 | Cards and surfaces |
| Accent cool | #2F5F52 | Primary CTA, hover states, active indicators |
| Accent cool dark | #244a40 | CTA hover state |
| Accent warm | #6B5C3E | Secondary labels, warm card accents |
| Accent warm light | rgba(107,92,62,0.1) | Tag backgrounds |
| Text primary | #1a1a18 | Headlines |
| Text secondary | #5a5248 | Body text |
| Text muted | #8a8070 | Labels, metadata |
| Text faint | #aaa090 | Dates, hints |
| Border default | rgba(90,82,72,0.12) | Card borders |
| Border emphasis | rgba(90,82,72,0.35) | Button borders |

### Grid background pattern

Apply this to any full-width section as a subtle structural element:

```css
background-image:
  linear-gradient(rgba(90,80,60,0.055) 1px, transparent 1px),
  linear-gradient(90deg, rgba(90,80,60,0.055) 1px, transparent 1px);
background-size: 32px 32px;
```

### Card hover pattern

Every interactive card follows this pattern: 3px right translate on hover, left accent stripe revealed, border color shifts to accent.

```css
.card:hover { border-color: rgba(47,95,82,0.4); transform: translateX(3px); }
.card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #2F5F52; opacity: 0; transition: opacity 0.15s; }
.card:hover::before { opacity: 1; }
```

### Prompt template to replicate this quality

Use this when asking me to build a new component:

> "Lag [component navn] for Levd.ai. Bruk visual PRD. JetBrains Mono, bakgrunn #F7F4EF med subtle 32px grid, to aksenter: #2F5F52 og #6B5C3E. [Beskriv spesifikk funksjonalitet]. Responsive desktop og mobil."

---

## What to Avoid

- Pure white backgrounds
- Rounded pill buttons
- Bright or saturated accent colors
- Heavy drop shadows
- Decorative elements with no function
- Marketing-style layouts
- Sans-serif that feels casual or friendly (this is a technical product)
- Generic SaaS startup aesthetics

---

## How to Work With Me

**I lack context about myself** is the main problem with your current output. Use this document every time you generate a visual. Do not default to generic UI patterns without checking against my preferences here.

When I ask for a mockup or component, apply this PRD automatically. Do not ask me to repeat my preferences. Do not explain what you are doing. Just build it correctly the first time.

If something is unclear, ask one specific question. Then build.

---

## Quick Reference Card

| Property | Value |
|---|---|
| Background | #F7F4EF (off-white/cream) |
| Accent cool | #2F5F52 (forest green) |
| Accent warm | #6B5C3E (sand/tobacco) |
| Typography | Monospace / technical |
| Border radius | 4 to 8px |
| Whitespace | Balanced |
| Mode | Both light and dark |
| Screen size | Desktop and mobile equally |
| References | Notion, Linear, Figma UI kits |
| Aesthetic | Minimalist, Nordic, technical |
| Stack | React, Tailwind, shadcn/ui, Supabase |
