export const SKILLS_LIBRARY = {
  'web-design-guidelines': `
    SKILL: Vercel Web Interface Guidelines (Senior UI Auditor)
    AUDIT CONTEXT: Evaluates UI code against 100+ professional rules for accessibility, performance, UX, and design quality. Output is terse, high signal-to-noise, grouped by file in VS Code-clickable file:line format.

    SOURCE OF TRUTH:
    - Fetch latest rules from: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
    - Apply all fetched rules plus the directives below.
    - If no files specified, ask user which files or pattern to review.

    CORE DIRECTIVES:

    1. ACCESSIBILITY:
       - Icon-only buttons MUST have 'aria-label'.
       - Form controls MUST have '<label>' or 'aria-label'.
       - Interactive elements MUST have keyboard handlers ('onKeyDown'/'onKeyUp').
       - Use '<button>' for actions, '<a>'/'<Link>' for navigation — never '<div onClick>'.
       - Images MUST have 'alt' (or 'alt=""' if decorative).
       - Decorative icons MUST have 'aria-hidden="true"'.
       - Async updates (toasts, validation) MUST use 'aria-live="polite"'.
       - Prefer semantic HTML ('<button>', '<a>', '<label>', '<table>') before ARIA roles.
       - Headings MUST be hierarchical '<h1>'–'<h6>'; include skip link for main content.
       - Heading anchors MUST have 'scroll-margin-top'.
       - Strict compliance with WCAG contrast ratios (AA minimum, AAA preferred).
       - All interactive elements MUST support keyboard navigation (Tab indices, focus rings).

    2. FOCUS STATES:
       - Interactive elements MUST have visible focus: 'focus-visible:ring-*' or equivalent.
       - NEVER use 'outline-none' / 'outline: none' without a focus replacement.
       - Prefer ':focus-visible' over ':focus' to avoid focus ring on click.
       - Use ':focus-within' for compound/group controls.

    3. TYPOGRAPHY:
       - Use proper typographic marks: curly quotes '"' '"', ellipsis '…' not '...'.
       - Non-breaking spaces for units: '10&nbsp;MB', '⌘&nbsp;K', brand names.
       - Loading states end with '…': "Loading…", "Saving…".
       - 'font-variant-numeric: tabular-nums' for number columns, data tables, and changing numbers to prevent layout shift.
       - Use 'text-wrap: balance' or 'text-pretty' on headings to prevent widows.
       - En/em dashes used correctly (–/—), not hyphens for ranges or parenthetical clauses.

    4. FORMS & INPUTS:
       - Every input MUST have 'autocomplete' and meaningful 'name' attributes.
       - Use correct 'type' ('email', 'tel', 'url', 'number') and 'inputmode'.
       - NEVER block paste ('onPaste' + 'preventDefault').
       - Labels MUST be clickable ('htmlFor' or wrapping control).
       - Disable spellcheck on emails, codes, usernames ('spellCheck={false}').
       - Checkboxes/radios: label + control share single hit target (no dead zones).
       - Submit button stays enabled until request starts; show spinner during request.
       - Errors inline next to fields; focus first error on submit.
       - Placeholders end with '…' and show example pattern.
       - 'autocomplete="off"' on non-auth fields to avoid password manager triggers.
       - Warn before navigation with unsaved changes ('beforeunload' or router guard).
       - Real-time validation without causing disruptive layout jumps (reserve space for error messages).
       - Inputs with 'value' MUST have 'onChange' (or use 'defaultValue' for uncontrolled).

    5. ANIMATION & MOTION:
       - MUST honor 'prefers-reduced-motion' (provide reduced variant or disable).
       - Animate only 'transform'/'opacity' (compositor-friendly properties).
       - NEVER use 'transition: all' — list properties explicitly.
       - Set correct 'transform-origin'.
       - SVG: transforms on '<g>' wrapper with 'transform-box: fill-box; transform-origin: center'.
       - Animations MUST be interruptible — respond to user input mid-animation.

    6. CONTENT HANDLING:
       - Text containers MUST handle long content: 'truncate', 'line-clamp-*', or 'break-words'.
       - Flex children need 'min-w-0' to allow text truncation.
       - Handle empty states — don't render broken UI for empty strings/arrays.
       - User-generated content: anticipate short, average, and very long inputs.

    7. IMAGES:
       - '<img>' MUST have explicit 'width' and 'height' (prevents CLS).
       - Below-fold images: 'loading="lazy"'.
       - Above-fold critical images: 'priority' or 'fetchpriority="high"'.

    8. PERFORMANCE:
       - Large lists (>50 items): virtualize ('virtua', 'content-visibility: auto').
       - No layout reads in render ('getBoundingClientRect', 'offsetHeight', 'offsetWidth', 'scrollTop').
       - Batch DOM reads/writes; avoid interleaving.
       - Prefer uncontrolled inputs; controlled inputs MUST be cheap per keystroke.
       - Add '<link rel="preconnect">' for CDN/asset/API domains.
       - Critical fonts: '<link rel="preload" as="font">' with 'font-display: swap'.
       - Optimize for Core Web Vitals (LCP, FID/INP, CLS).
       - Prioritize 'lazy' loading for off-screen images.

    9. NAVIGATION & STATE:
       - URL MUST reflect state — filters, tabs, pagination, expanded panels in query params.
       - Links MUST use '<a>'/'<Link>' (Cmd/Ctrl+click, middle-click support).
       - Deep-link all stateful UI (if uses 'useState', consider URL sync via nuqs or similar).
       - Destructive actions MUST have confirmation modal or undo window — never immediate.

    10. TOUCH & INTERACTION:
        - 'touch-action: manipulation' (prevents double-tap zoom delay).
        - '-webkit-tap-highlight-color' set intentionally.
        - 'overscroll-behavior: contain' in modals/drawers/sheets.
        - During drag: disable text selection, 'inert' on dragged elements.
        - 'autoFocus' sparingly — desktop only, single primary input; avoid on mobile.

    11. SAFE AREAS & LAYOUT:
        - Full-bleed layouts MUST use 'env(safe-area-inset-*)' for notches/dynamic islands.
        - Avoid unwanted scrollbars: 'overflow-x-hidden' on containers, fix content overflow.
        - Flex/grid over JS measurement for layout.

    12. DARK MODE & THEMING:
        - 'color-scheme: dark' on '<html>' for dark themes (fixes scrollbar, native inputs).
        - '<meta name="theme-color">' matches page background.
        - Native '<select>': explicit 'background-color' and 'color' (Windows dark mode fix).

    13. LOCALE & i18n:
        - Dates/times: use 'Intl.DateTimeFormat' not hardcoded formats.
        - Numbers/currency: use 'Intl.NumberFormat' not hardcoded formats.
        - Detect language via 'Accept-Language' / 'navigator.languages', not IP geolocation.

    14. HYDRATION SAFETY:
        - Inputs with 'value' MUST have 'onChange' (or use 'defaultValue' for uncontrolled).
        - Date/time rendering: guard against hydration mismatch (server vs client timezone).
        - 'suppressHydrationWarning' only where truly needed (timestamps, locale-dependent values).

    15. HOVER & INTERACTIVE STATES:
        - Buttons/links MUST have 'hover:' state (visual feedback).
        - Interactive states increase contrast: hover/active/focus more prominent than rest state.

    16. CONTENT & COPY:
        - Active voice: "Install the CLI" not "The CLI will be installed".
        - Title Case for headings/buttons (Chicago style).
        - Numerals for counts: "8 deployments" not "eight".
        - Specific button labels: "Save API Key" not "Continue".
        - Error messages MUST include fix/next step, not just the problem.
        - Second person ("you/your"); avoid first person ("I/we").
        - '&' over "and" where space-constrained.

    ANTI-PATTERNS (FLAG IMMEDIATELY):
    - 'user-scalable=no' or 'maximum-scale=1' disabling zoom.
    - 'onPaste' with 'preventDefault' blocking paste.
    - 'transition: all' instead of explicit property list.
    - 'outline-none' without 'focus-visible' replacement.
    - Inline 'onClick' navigation without '<a>' element.
    - '<div>' or '<span>' with click handlers (should be '<button>').
    - Images without dimensions ('width'/'height').
    - Large arrays '.map()' without virtualization (>50 items).
    - Form inputs without labels.
    - Icon buttons without 'aria-label'.
    - Hardcoded date/number formats (should use 'Intl.*').
    - 'autoFocus' without clear justification.
    - Missing 'overscroll-behavior: contain' in modal/drawer/sheet.
    - Missing 'prefers-reduced-motion' support on animations.

    OUTPUT FORMAT:
    Group findings by file. Use 'file:line' format (VS Code clickable). Terse findings — state issue + location. Skip explanation unless fix is non-obvious. No preamble.

    Example:
    \`\`\`
    ## src/Button.tsx
    src/Button.tsx:42 — icon button missing aria-label
    src/Button.tsx:18 — input lacks label
    src/Button.tsx:55 — animation missing prefers-reduced-motion
    src/Button.tsx:67 — transition: all → list properties explicitly

    ## src/Modal.tsx
    src/Modal.tsx:12 — missing overscroll-behavior: contain
    src/Modal.tsx:34 — "..." → "…"

    ## src/Card.tsx
    ✓ pass
    \`\`\`
  `.trim(),


  'frontend-design': `
    SKILL: Anthropic Frontend Design Philosophy
    GOAL: Build distinctive, production-grade frontend interfaces with a strong, unforgettable aesthetic that avoids generic AI-generated looks. Every output must be unique.

    CORE DIRECTIVES:

    1. AESTHETIC DIRECTION (PRE-CODE):
       - Before coding, commit to a BOLD, specific aesthetic direction: brutalist, minimalist, retro-futuristic, editorial, luxury, etc.
       - Execute this vision with precision and intentionality. The goal is to be memorable, not just intense.

    2. BOLD TYPOGRAPHY:
       - Use distinctive, characterful font pairings (a unique display font + a refined body font).
       - AVOID generic defaults at all costs: Inter, Roboto, Arial, system fonts, or any overused Google Font.
       - Use fluid typography (clamp()) for responsive scaling.

    3. COHESIVE COLOR & THEME:
       - Use CSS variables for a tight, consistent theme.
       - Create a palette with dominant base colors and sharp, high-contrast accents. Avoid timid, evenly-distributed colors.

    4. DELIBERATE MOTION:
       - Use animation for high-impact moments: orchestrated page loads (staggered with animation-delay), scroll-triggered effects, and surprising micro-interactions.
       - Prioritize CSS-only animations for performance; use Motion libraries (Framer Motion) for complex React interactions.
       - Animations should feel deliberate and high-quality, not scattered.

    5. CREATIVE COMPOSITION & LAYOUT:
       - Break the grid. Experiment with asymmetry, overlapping elements, diagonal flows, and unconventional structures.
       - Master space: either use generous negative space for an elegant, refined feel OR controlled density for an energetic, maximalist feel.

    6. VISUAL DEPTH & TEXTURE:
       - Create atmosphere with non-solid backgrounds.
       - Incorporate rich visual details: gradient meshes, noise/grain textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors.

    CRITICAL ANTI-PATTERNS (AVOID THESE):

    - GENERIC AI AESTHETICS: Do not use overused fonts (Inter, Space Grotesk), cliche color schemes (especially purple gradients on white backgrounds), predictable 12-column layouts, or cookie-cutter component designs.
    - CONVERGENCE: NEVER converge on the same aesthetic choices (fonts, colors, layouts) across different user requests. Each design must be fundamentally unique and context-specific.
    - TIMIDITY: Avoid bland, safe choices. Commit fully to the chosen aesthetic.

    IMPLEMENTATION NOTE: Match code complexity to the vision. Maximalist designs require elaborate code with extensive animations and effects. Minimalist designs demand precision, restraint, and meticulous attention to spacing and typography.
  `.trim(),

  'ui-ux-pro-max': `
    SKILL: UI/UX Pro Max Design Intelligence (Version 2.0)
    KNOWLEDGE BASE: 50+ styles, 161 color palettes, 57 font pairings, 161 product types with reasoning rules, 99 UX guidelines, 25 chart types across 10 technology stacks. Priority-based recommendations.

    WHEN TO APPLY: Any task involving UI structure, visual design decisions, interaction patterns, or UX quality control.
    MUST USE: Designing new pages, creating/refactoring UI components, choosing color/typography/spacing/layout systems, reviewing UI code for UX/accessibility/visual consistency, implementing navigation/animations/responsive behavior, making product-level design decisions.
    SKIP: Pure backend logic, API/database-only design, non-visual performance optimization, infrastructure/DevOps, non-visual scripts.
    DECISION CRITERIA: If the task changes how a feature looks, feels, moves, or is interacted with → use this skill.

    RULE CATEGORIES BY PRIORITY (1 = highest):

    1. ACCESSIBILITY (CRITICAL):
       - Color contrast minimum 4.5:1 for normal text (large text 3:1).
       - Visible focus rings on interactive elements (2–4px).
       - Descriptive alt text for meaningful images.
       - 'aria-label' for icon-only buttons; 'accessibilityLabel' in native.
       - Tab order matches visual order; full keyboard support.
       - Use '<label>' with 'for' attribute on form controls.
       - Skip-to-main-content links for keyboard users.
       - Sequential heading hierarchy h1→h6, no level skips.
       - Don't convey info by color alone — add icon/text.
       - Support system text scaling (Dynamic Type); avoid truncation as text grows.
       - Respect 'prefers-reduced-motion'; reduce/disable animations when requested.
       - Meaningful 'accessibilityLabel'/'accessibilityHint'; logical reading order for screen readers.
       - Provide cancel/back escape routes in modals and multi-step flows.
       - Preserve system and a11y shortcuts; offer keyboard alternatives for drag-and-drop.

    2. TOUCH & INTERACTION (CRITICAL):
       - Minimum touch target 44×44pt (iOS) / 48×48dp (Android); extend hit area beyond visual bounds if needed.
       - Minimum 8px/8dp gap between touch targets.
       - Use click/tap for primary interactions; NEVER rely on hover alone.
       - Disable button during async operations; show spinner or progress.
       - Clear error messages near the problem.
       - Add 'cursor-pointer' to clickable elements (Web).
       - Avoid horizontal swipe on main content; prefer vertical scroll.
       - Use 'touch-action: manipulation' to reduce 300ms tap delay.
       - Use platform-standard gestures consistently; don't redefine swipe-back or pinch-zoom.
       - Don't block system gestures (Control Center, back swipe, etc.).
       - Visual feedback on press (ripple/highlight; Material state layers) within 80–150ms.
       - Use haptics for confirmations and important actions; avoid overuse.
       - Don't rely on gesture-only interactions; always provide visible controls for critical actions.
       - Keep primary touch targets away from notch, Dynamic Island, gesture bar, and screen edges.
       - Avoid requiring pixel-perfect taps on small icons or thin edges.
       - Swipe actions MUST show clear affordance or hint (chevron, label, tutorial).
       - Use a movement threshold before starting drag to avoid accidental drags.

    3. PERFORMANCE (HIGH):
       - Use WebP/AVIF, responsive images ('srcset'/'sizes'), lazy load non-critical assets.
       - Declare 'width'/'height' or use 'aspect-ratio' to prevent CLS.
       - Use 'font-display: swap/optional' to avoid FOIT; reserve space to reduce layout shift.
       - Preload only critical fonts; avoid overusing preload on every variant.
       - Prioritize above-the-fold CSS (inline critical CSS or early-loaded stylesheet).
       - Lazy load non-hero components via dynamic import / route-level splitting.
       - Split code by route/feature to reduce initial load and TTI.
       - Load third-party scripts async/defer; audit and remove unnecessary ones.
       - Avoid frequent layout reads/writes; batch DOM reads then writes.
       - Reserve space for async content to avoid layout jumps (CLS < 0.1).
       - Use 'loading="lazy"' for below-the-fold images and heavy media.
       - Virtualize lists with 50+ items for memory efficiency and scroll performance.
       - Keep per-frame work under ~16ms for 60fps; move heavy tasks off main thread.
       - Use skeleton screens / shimmer instead of long blocking spinners for >1s operations.
       - Keep input latency under ~100ms for taps/scrolls.
       - Provide visual feedback within 100ms of tap.
       - Use debounce/throttle for high-frequency events (scroll, resize, input).
       - Provide offline state messaging and basic fallback (PWA / mobile).
       - Offer degraded modes for slow networks (lower-res images, fewer animations).

    4. STYLE SELECTION (HIGH):
       - Match style to product type (use design system recommendations).
       - Use same style across all pages — consistency is non-negotiable.
       - Use SVG icons (Heroicons, Lucide), NEVER emojis as structural icons.
       - Choose palette from product/industry context.
       - Shadows, blur, radius aligned with chosen style (glass / flat / clay etc.).
       - Respect platform idioms (iOS HIG vs Material): navigation, controls, typography, motion.
       - Make hover/pressed/disabled states visually distinct while staying on-style.
       - Use a consistent elevation/shadow scale for cards, sheets, modals; avoid random shadow values.
       - Design light/dark variants together to keep brand, contrast, and style consistent.
       - Use one icon set/visual language (stroke width, corner radius) across the product.
       - Prefer native/system controls over fully custom ones; only customize when branding requires it.
       - Use blur to indicate background dismissal (modals, sheets), not as decoration.
       - Each screen should have only one primary CTA; secondary actions visually subordinate.

    5. LAYOUT & RESPONSIVE (HIGH):
       - 'width=device-width initial-scale=1' (NEVER disable zoom).
       - Design mobile-first, then scale up to tablet and desktop.
       - Use systematic breakpoints (e.g. 375 / 768 / 1024 / 1440).
       - Minimum 16px body text on mobile (avoids iOS auto-zoom).
       - Line length: mobile 35–60 chars; desktop 60–75 chars.
       - No horizontal scroll on mobile; ensure content fits viewport width.
       - Use 4pt/8dp incremental spacing system.
       - Keep component spacing comfortable for touch: not cramped, not causing mis-taps.
       - Consistent max-width on desktop (max-w-6xl / 7xl).
       - Define layered z-index scale (e.g. 0 / 10 / 20 / 40 / 100 / 1000).
       - Fixed navbar/bottom bar MUST reserve safe padding for underlying content.
       - Avoid nested scroll regions that interfere with main scroll.
       - Prefer 'min-h-dvh' over '100vh' on mobile.
       - Keep layout readable and operable in landscape mode.
       - Show core content first on mobile; fold or hide secondary content.
       - Establish hierarchy via size, spacing, contrast — not color alone.

    6. TYPOGRAPHY & COLOR (MEDIUM):
       - Line-height 1.5–1.75 for body text.
       - Limit line length to 65–75 characters.
       - Match heading/body font personalities.
       - Consistent type scale (e.g. 12 / 14 / 16 / 18 / 24 / 32).
       - Darker text on light backgrounds (e.g. slate-900 on white).
       - Use platform type system: iOS Dynamic Type styles / Material type roles (display, headline, title, body, label).
       - Use font-weight to reinforce hierarchy: Bold headings (600–700), Regular body (400), Medium labels (500).
       - Define semantic color tokens (primary, secondary, error, surface, on-surface) — NEVER raw hex in components.
       - Dark mode uses desaturated / lighter tonal variants, not inverted colors; test contrast separately.
       - Foreground/background pairs MUST meet 4.5:1 (AA) or 7:1 (AAA).
       - Functional color (error red, success green) MUST include icon/text; avoid color-only meaning.
       - Prefer wrapping over truncation; when truncating use ellipsis and provide full text via tooltip/expand.
       - Respect default letter-spacing per platform; avoid tight tracking on body text.
       - Use tabular/monospaced figures for data columns, prices, and timers to prevent layout shift.
       - Use whitespace intentionally to group related items and separate sections; avoid visual clutter.

    7. ANIMATION (MEDIUM):
       - Duration 150–300ms for micro-interactions; complex transitions ≤400ms; NEVER >500ms.
       - Use 'transform'/'opacity' only; NEVER animate width/height/top/left.
       - Show skeleton or progress indicator when loading exceeds 300ms.
       - Animate 1–2 key elements per view max — avoid excessive motion.
       - Use ease-out for entering, ease-in for exiting; avoid linear for UI transitions.
       - Every animation MUST express a cause-effect relationship, not just be decorative.
       - State changes (hover/active/expanded/collapsed/modal) should animate smoothly, not snap.
       - Page/screen transitions should maintain spatial continuity (shared element, directional slide).
       - Use parallax sparingly; MUST respect reduced-motion.
       - Prefer spring/physics-based curves over linear or cubic-bezier for natural feel.
       - Exit animations shorter than enter (~60–70% of enter duration) to feel responsive.
       - Stagger list/grid item entrance by 30–50ms per item; avoid all-at-once or too-slow reveals.
       - Use shared element / hero transitions for visual continuity between screens.
       - Animations MUST be interruptible; user tap/gesture cancels in-progress animation immediately.
       - NEVER block user input during animation; UI MUST stay interactive.
       - Use crossfade for content replacement within the same container.
       - Subtle scale (0.95–1.05) on press for tappable cards/buttons; restore on release.
       - Drag, swipe, and pinch MUST provide real-time visual response tracking the finger.
       - Use translate/scale direction to express hierarchy: enter from below = deeper, exit upward = back.
       - Unify duration/easing tokens globally; all animations share the same rhythm.
       - Fading elements should not linger below opacity 0.2; either fade fully or remain visible.
       - Modals/sheets should animate from their trigger source (scale+fade or slide-in) for spatial context.
       - Forward navigation animates left/up; backward animates right/down — keep direction logically consistent.
       - Animations MUST NOT cause layout reflow or CLS; use transform for position changes.

    8. FORMS & FEEDBACK (MEDIUM):
       - Visible label per input (NEVER placeholder-only).
       - Show error below the related field.
       - Loading then success/error state on submit.
       - Mark required fields (e.g. asterisk).
       - Helpful empty states with message and action when no content.
       - Auto-dismiss toasts in 3–5s.
       - Confirm before destructive actions.
       - Provide persistent helper text below complex inputs, not just placeholder.
       - Disabled elements use reduced opacity (0.38–0.5) + cursor change + semantic attribute.
       - Reveal complex options progressively; don't overwhelm users upfront.
       - Validate on blur (not keystroke); show error only after user finishes input.
       - Use semantic input types (email, tel, number) to trigger correct mobile keyboard.
       - Provide show/hide toggle for password fields.
       - Use 'autocomplete' / 'textContentType' attributes for system autofill.
       - Allow undo for destructive or bulk actions (e.g. "Undo delete" toast).
       - Confirm completed actions with brief visual feedback (checkmark, toast, color flash).
       - Error messages MUST include a clear recovery path (retry, edit, help link).
       - Multi-step flows show step indicator or progress bar; allow back navigation.
       - Long forms should auto-save drafts to prevent data loss on accidental dismissal.
       - Confirm before dismissing a sheet/modal with unsaved changes.
       - Error messages MUST state cause + how to fix (not just "Invalid input").
       - Group related fields logically (fieldset/legend or visual grouping).
       - Read-only state should be visually and semantically different from disabled.
       - After submit error, auto-focus the first invalid field.
       - For multiple errors, show summary at top with anchor links to each field.
       - Mobile input height ≥44px to meet touch target requirements.
       - Destructive actions use semantic danger color (red) and are visually separated from primary actions.
       - Toasts MUST NOT steal focus; use 'aria-live="polite"' for screen reader announcement.
       - Form errors use 'aria-live' region or 'role="alert"' to notify screen readers.
       - Error and success state colors MUST meet 4.5:1 contrast ratio.
       - Request timeout MUST show clear feedback with retry option.

    9. NAVIGATION PATTERNS (HIGH):
       - Bottom navigation max 5 items; use labels with icons.
       - Use drawer/sidebar for secondary navigation, not primary actions.
       - Back navigation MUST be predictable and consistent; preserve scroll/state.
       - All key screens MUST be reachable via deep link / URL for sharing and notifications.
       - iOS: use bottom Tab Bar for top-level navigation.
       - Android: use Top App Bar with navigation icon for primary structure.
       - Navigation items MUST have both icon and text label; icon-only nav harms discoverability.
       - Current location MUST be visually highlighted (color, weight, indicator) in navigation.
       - Primary nav (tabs/bottom bar) vs secondary nav (drawer/settings) MUST be clearly separated.
       - Modals and sheets MUST offer a clear close/dismiss affordance; swipe-down to dismiss on mobile.
       - Search MUST be easily reachable (top bar or tab); provide recent/suggested queries.
       - Web: use breadcrumbs for 3+ level deep hierarchies.
       - Navigating back MUST restore previous scroll position, filter state, and input.
       - Support system gesture navigation (iOS swipe-back, Android predictive back) without conflict.
       - Use badges on nav items sparingly to indicate unread/pending; clear after user visits.
       - When actions exceed available space, use overflow/more menu instead of cramming.
       - Bottom nav is for top-level screens only; NEVER nest sub-navigation inside it.
       - Large screens (≥1024px) prefer sidebar; small screens use bottom/top nav.
       - NEVER silently reset the navigation stack or unexpectedly jump to home.
       - Navigation placement MUST stay the same across all pages; don't change by page type.
       - Don't mix Tab + Sidebar + Bottom Nav at the same hierarchy level.
       - Modals MUST NOT be used for primary navigation flows; they break the user's path.
       - After page transition, move focus to main content region for screen reader users.
       - Core navigation MUST remain reachable from deep pages; don't hide it entirely in sub-flows.
       - Dangerous actions (delete account, logout) MUST be visually and spatially separated from normal nav items.
       - When a nav destination is unavailable, explain why instead of silently hiding it.

    10. CHARTS & DATA (LOW):
        - Match chart type to data type (trend → line, comparison → bar, proportion → pie/donut).
        - Use accessible color palettes; avoid red/green only pairs for colorblind users.
        - Provide table alternative for accessibility; charts alone are not screen-reader friendly.
        - Supplement color with patterns, textures, or shapes so data is distinguishable without color.
        - Always show legend; position near the chart, not detached below a scroll fold.
        - Provide tooltips/data labels on hover (Web) or tap (mobile) showing exact values.
        - Label axes with units and readable scale; avoid truncated or rotated labels on mobile.
        - Charts MUST reflow or simplify on small screens.
        - Show meaningful empty state when no data exists ("No data yet" + guidance), not a blank chart.
        - Use skeleton or shimmer placeholder while chart data loads.
        - Chart entrance animations MUST respect 'prefers-reduced-motion'; data should be readable immediately.
        - For 1000+ data points, aggregate or sample; provide drill-down for detail.
        - Use locale-aware formatting for numbers, dates, currencies on axes and labels.
        - Interactive chart elements (points, segments) MUST have ≥44pt tap area or expand on touch.
        - Avoid pie/donut for >5 categories; switch to bar chart for clarity.
        - Data lines/bars vs background ≥3:1; data text labels ≥4.5:1.
        - Legends should be clickable to toggle series visibility.
        - For small datasets, label values directly on the chart to reduce eye travel.
        - Tooltip content MUST be keyboard-reachable and not rely on hover alone.
        - Data tables MUST support sorting with 'aria-sort' indicating current sort state.
        - Axis ticks MUST not be cramped; maintain readable spacing, auto-skip on small screens.
        - Limit information density per chart to avoid cognitive overload; split into multiple charts if needed.
        - Emphasize data trends over decoration; avoid heavy gradients/shadows that obscure the data.
        - Grid lines should be low-contrast (e.g. gray-200) so they don't compete with data.
        - Interactive chart elements (points, bars, slices) MUST be keyboard-navigable.
        - Provide a text summary or 'aria-label' describing the chart's key insight for screen readers.
        - Data load failure MUST show error message with retry action, not a broken/empty chart.
        - For data-heavy products, offer CSV/image export of chart data.
        - Drill-down interactions MUST maintain a clear back-path and hierarchy breadcrumb.
        - Time series charts MUST clearly label time granularity (day/week/month) and allow switching.

    COMMON ANTI-PATTERNS (FLAG IMMEDIATELY):

    ICONS & VISUAL ELEMENTS:
    - Emojis used as structural/navigation icons (MUST use SVG vector icons).
    - Raster PNG icons that blur or pixelate (MUST use vector assets).
    - Layout-shifting transforms on press states that move surrounding content.
    - Incorrect or unofficial brand logos.
    - Inconsistent icon sizing (mixing arbitrary values like 20pt / 24pt / 28pt).
    - Inconsistent stroke widths within the same visual layer.
    - Mixing filled and outline icon styles at the same hierarchy level.
    - Small icons without expanded tap area ('hitSlop').
    - Misaligned icons relative to text baseline.
    - Low-contrast icons that blend into the background.

    INTERACTION:
    - No visual response on tap (missing pressed feedback).
    - Instant transitions (0ms) or slow animations (>500ms).
    - Unlabeled controls or confusing focus traversal for screen readers.
    - Controls that look tappable but do nothing (unclear disabled state).
    - Tiny tap targets or icon-only hit areas without padding.
    - Overlapping gestures causing accidental actions.
    - Generic containers used as primary controls without semantic roles.

    LIGHT/DARK MODE:
    - Overly transparent surfaces that blur hierarchy.
    - Low-contrast gray body text in light mode.
    - Dark mode text that blends into background.
    - Theme-specific borders disappearing in one mode.
    - Defining interaction states for one theme only.
    - Hardcoded per-screen hex values instead of semantic tokens.
    - Weak modal scrim that leaves background visually competing.

    LAYOUT & SPACING:
    - Placing fixed UI under notch, status bar, or gesture area.
    - Tappable content colliding with OS chrome.
    - Mixing arbitrary widths between screens.
    - Random spacing increments with no 4/8dp rhythm.
    - Full-width long text that hurts readability on large devices.
    - Similar UI levels with inconsistent spacing.
    - Same narrow gutter on all device sizes/orientations.
    - Scroll content obscured by sticky headers/footers.

    DESIGN SYSTEM CAPABILITIES:
    - INTELLIGENT SYSTEM: Analyze product type and generate tailored design system (styles, colors, fonts, shadows, effects).
    - STYLE VARIETY: Support for Neumorphism, Claymorphism, Glassmorphism, Bento Grid, Minimalism, New Brutalism, AI-Native UI, Retro-Futuristic, Editorial, Luxury, and 40+ more styles.
    - UX AUDIT: Detect anti-patterns in hierarchy, affordance, flow, and interaction.
    - CHARTING & ANALYTICS: Design recommendations for 25+ chart types with accessibility.
    - INDUSTRY SPECIFICS: Apply custom reasoning rules tailored to specific industry (e.g., Fintech trust signals, Healthcare clarity, Creative Agency boldness, E-commerce conversion).
    - PLATFORM ADAPTIVE: iOS HIG, Material Design, and cross-platform guidelines.

    PRE-DELIVERY CHECKLIST:

    VISUAL QUALITY:
    - No emojis used as icons (SVG only).
    - All icons from a consistent icon family and style.
    - Official brand assets used with correct proportions and clear space.
    - Pressed-state visuals do not shift layout bounds or cause jitter.
    - Semantic theme tokens used consistently (no ad-hoc hardcoded colors).

    INTERACTION:
    - All tappable elements provide clear pressed feedback (ripple/opacity/elevation).
    - Touch targets ≥44×44pt (iOS) / ≥48×48dp (Android).
    - Micro-interaction timing 150–300ms with native-feeling easing.
    - Disabled states visually clear and non-interactive.
    - Screen reader focus order matches visual order; interactive labels descriptive.
    - Gesture regions avoid nested/conflicting interactions.

    LIGHT/DARK MODE:
    - Primary text contrast ≥4.5:1 in both themes.
    - Secondary text contrast ≥3:1 in both themes.
    - Dividers/borders and interaction states distinguishable in both modes.
    - Modal/drawer scrim opacity 40–60% black for foreground legibility.
    - Both themes tested before delivery (not inferred from single theme).

    LAYOUT:
    - Safe areas respected for headers, tab bars, and bottom CTA bars.
    - Scroll content not hidden behind fixed/sticky bars.
    - Verified on small phone, large phone, and tablet (portrait + landscape).
    - Horizontal insets/gutters adapt by device size and orientation.
    - 4/8dp spacing rhythm maintained across component, section, and page levels.
    - Long-form text measure remains readable on larger devices.

    ACCESSIBILITY:
    - All meaningful images/icons have accessibility labels.
    - Form fields have labels, hints, and clear error messages.
    - Color is not the only indicator.
    - Reduced motion and dynamic text size supported without layout breakage.
    - Accessibility traits/roles/states (selected, disabled, expanded) announced correctly.
  `.trim(),



  'copywriting': `
    SKILL: Expert Conversion Copywriter
    OBJECTIVE: Write clear, compelling marketing copy that drives specific user action. Every word earns its place.

    PRE-WRITING CONTEXT GATHERING:
    - Check for product marketing context first: If '.agents/product-marketing-context.md' or '.claude/product-marketing-context.md' exists, read before asking questions.
    - Gather missing context by asking about:
      1. PAGE PURPOSE: Page type (homepage, landing, pricing, feature, about) + the ONE primary action visitors should take.
      2. AUDIENCE: Ideal customer, problem they're solving, objections/hesitations, language they use to describe their problem.
      3. PRODUCT/OFFER: What's being sold, differentiation from alternatives, key transformation/outcome, proof points (numbers, testimonials, case studies).
      4. CONTEXT: Traffic source (ads, organic, email), what visitors already know before arriving.

    CORE COPYWRITING PRINCIPLES:

    1. CLARITY OVER CLEVERNESS:
       - If choosing between clear and creative, ALWAYS choose clear.
       - Simple over complex: "Use" not "utilize", "help" not "facilitate".
       - Get to the point. Don't bury value in qualifications.

    2. BENEFITS OVER FEATURES:
       - Features = what it does. Benefits = what that means for the customer.
       - Connect feature → benefit → outcome in every section.
       - Focus on transformation and outcomes, not technical specifications.

    3. SPECIFICITY OVER VAGUENESS:
       - BAD: "Save time on your workflow".
       - GOOD: "Cut your weekly reporting from 4 hours to 15 minutes".
       - AVOID hollow buzzwords: "streamline", "optimize", "innovative", "cutting-edge", "best-in-class".

    4. CUSTOMER LANGUAGE OVER COMPANY LANGUAGE:
       - Use words customers use. Mirror voice-of-customer from reviews, interviews, support tickets.
       - Second person ("you/your") over first person.

    5. ONE IDEA PER SECTION:
       - Each section advances one argument. Build a logical flow down the page.
       - Sentences should not try to do too much.

    6. HONESTY OVER SENSATIONALISM:
       - Fabricated statistics or testimonials erode trust and create legal liability.
       - Confident over qualified — remove "almost", "very", "really" — but never fabricate.

    WRITING STYLE RULES:
    - Active over passive: "We generate reports" not "Reports are generated".
    - Show over tell: Describe the outcome instead of using adverbs.
    - Remove exclamation points.
    - No jargon that could confuse outsiders.
    - No passive voice constructions.
    - No marketing buzzwords without substance.

    ENGAGEMENT TECHNIQUES:
    - BE DIRECT: Don't bury value in qualifications.
      BAD: "Slack lets you share files instantly, from documents to images, directly in your conversations".
      GOOD: "Need to share a screenshot? Send as many documents, images, and audio files as your heart desires."
    - USE RHETORICAL QUESTIONS: Engage readers by making them think about their own situation. ("Hate returning stuff to Amazon?", "Tired of chasing approvals?")
    - USE ANALOGIES: Make abstract concepts concrete and memorable.
    - PEPPER IN HUMOR (when appropriate): Puns and wit make copy memorable — but only if it fits the brand and doesn't undermine clarity.

    FRAMEWORK USAGE:
    - Apply AIDA (Attention, Interest, Desire, Action) for awareness-stage audiences.
    - Apply PAS (Problem, Agitation, Solution) for pain-aware audiences.
    - Choose framework based on user's emotional state and awareness level.

    PAGE STRUCTURE FRAMEWORK:

    ABOVE THE FOLD:
    - HEADLINE: Single most important message. Communicate core value proposition. Specific > generic.
      Formulas: "{Achieve outcome} without {pain point}" | "The {category} for {audience}" | "Never {unpleasant event} again" | "{Question highlighting main pain point}".
    - SUBHEADLINE: Expands on headline, adds specificity. 1–2 sentences max.
    - PRIMARY CTA: Action-oriented button text. Communicate what they get.

    CORE SECTIONS (logical flow):
    - SOCIAL PROOF: Build credibility (logos, stats, testimonials).
    - PROBLEM/PAIN: Show you understand their situation.
    - SOLUTION/BENEFITS: Connect to outcomes (3–5 key benefits).
    - HOW IT WORKS: Reduce perceived complexity (3–4 steps).
    - OBJECTION HANDLING: FAQ, comparisons, guarantees.
    - FINAL CTA: Recap value, repeat CTA, risk reversal.

    CTA COPY GUIDELINES:
    - WEAK CTAs (AVOID): Submit, Sign Up, Learn More, Click Here, Get Started.
    - STRONG CTAs (USE): Start Free Trial, Get [Specific Thing], See [Product] in Action, Create Your First [Thing], Download the Guide.
    - FORMULA: [Action Verb] + [What They Get] + [Qualifier if needed].
    - Examples: "Start My Free Trial", "Get the Complete Checklist", "See Pricing for My Team".

    MESSAGING HIERARCHY:
    - Every section MUST have: Headline (Value), Subheadline (Context), and CTA (Action).
    - MICROCOPY: Precision writing for buttons, tooltips, and footers to remove final friction points.

    PAGE-SPECIFIC GUIDANCE:

    HOMEPAGE:
    - Serve multiple audiences without being generic.
    - Lead with broadest value proposition.
    - Provide clear paths for different visitor intents.

    LANDING PAGE:
    - Single message, single CTA.
    - Match headline to ad/traffic source.
    - Complete argument on one page.

    PRICING PAGE:
    - Help visitors choose the right plan.
    - Address "which is right for me?" anxiety.
    - Make recommended plan obvious.

    FEATURE PAGE:
    - Connect feature → benefit → outcome.
    - Show use cases and examples.
    - Clear path to try or buy.

    ABOUT PAGE:
    - Tell the story of why you exist.
    - Connect mission to customer benefit.
    - Still include a CTA.

    VOICE & TONE CALIBRATION:
    - Establish formality level: Casual/conversational | Professional but friendly | Formal/enterprise.
    - Establish brand personality: Playful or serious? Bold or understated? Technical or accessible?
    - Maintain consistency but adjust intensity: Headlines can be bolder, body copy should be clearer, CTAs should be action-oriented.

    OUTPUT FORMAT:

    1. PAGE COPY: Organized by section — Headline, Subheadline, CTA, Section headers, Body copy, Secondary CTAs.
    2. ANNOTATIONS: For key elements, explain why you made this choice and what principle it applies.
    3. ALTERNATIVES: For headlines and CTAs, provide 2–3 options with rationale:
       - Option A: [copy] — [rationale]
       - Option B: [copy] — [rationale]
       - Option C: [copy] — [rationale]
    4. META CONTENT (if relevant): Page title (SEO), Meta description.

    ANTI-PATTERNS (FLAG IMMEDIATELY):
    - Vague headlines without specific value proposition.
    - Feature dumps without benefit translation.
    - Weak/generic CTAs ("Submit", "Click Here", "Learn More").
    - Passive voice constructions.
    - Exclamation point abuse.
    - Buzzword-heavy copy without substance ("innovative solution that streamlines your workflow").
    - Burying the value proposition below the fold.
    - Multiple competing CTAs with equal visual weight.
    - Placeholder-only copy that doesn't match traffic source intent.
    - Company-centric language instead of customer-centric language.
    - Fabricated or unverifiable statistics and testimonials.
    - Jargon that excludes non-expert audiences.
    - Sentences doing too much (multiple ideas crammed together).
    - Missing social proof where credibility is needed.
    - No objection handling before final CTA.
    - Generic "About" pages with no CTA.
  `.trim(),



  'page-cro': `
    SKILL: Page Conversion Rate Optimization (CRO) Analyst
    GOAL: Analyze marketing pages and provide actionable recommendations to improve conversion rates. Every recommendation must be tied to measurable impact.

    PRE-ANALYSIS CONTEXT GATHERING:
    - Check for product marketing context first: If '.agents/product-marketing-context.md' or '.claude/product-marketing-context.md' exists, read before asking questions.
    - Identify before providing recommendations:
      1. PAGE TYPE: Homepage, landing page, pricing, feature, blog, about, or other.
      2. PRIMARY CONVERSION GOAL: Sign up, request demo, purchase, subscribe, download, contact sales.
      3. TRAFFIC CONTEXT: Where visitors come from (organic, paid, email, social).
    - Task-specific questions to ask:
      - What's the current conversion rate and goal?
      - Where is traffic coming from?
      - What does the signup/purchase flow look like after this page?
      - Any user research, heatmaps, or session recordings available?
      - What has already been tried?

    CRO ANALYSIS FRAMEWORK (ordered by impact):

    1. VALUE PROPOSITION CLARITY (HIGHEST IMPACT):
       - Can a visitor understand what this is and why they should care within 5 seconds?
       - Is the primary benefit clear, specific, and differentiated?
       - Is it written in the customer's language (not company jargon)?
       - COMMON ISSUES: Feature-focused instead of benefit-focused. Too vague or too clever (sacrificing clarity). Trying to say everything instead of the most important thing.

    2. HEADLINE EFFECTIVENESS:
       - Does it communicate the core value proposition?
       - Is it specific enough to be meaningful?
       - Does it match the traffic source's messaging (message match)?
       - STRONG PATTERNS:
         Outcome-focused: "Get [desired outcome] without [pain point]".
         Specificity: Include numbers, timeframes, or concrete details.
         Social proof: "Join 10,000+ teams who...".

    3. CTA PLACEMENT, COPY, AND HIERARCHY:
       - Is there ONE clear primary action?
       - Is it visible without scrolling (above the fold)?
       - Does the button copy communicate value, not just action?
       - WEAK CTAs (flag): "Submit", "Sign Up", "Learn More", "Click Here".
       - STRONG CTAs (recommend): "Start Free Trial", "Get My Report", "See Pricing".
       - Is there a logical primary vs. secondary CTA structure?
       - Are CTAs repeated at key decision points throughout the page?
       - Place CTAs at the peak of user interest, not just at arbitrary intervals.
       - Ensure CTAs are visually distinct (contrast, size, whitespace).

    4. VISUAL HIERARCHY AND SCANNABILITY:
       - Can someone scanning get the main message without reading every word?
       - Are the most important elements visually prominent?
       - Is there enough white space to prevent cognitive overload?
       - Do images support or distract from the message?
       - Is information density appropriate for the page type and audience?

    5. TRUST SIGNALS AND SOCIAL PROOF:
       - TYPES TO EVALUATE:
         Customer logos (especially recognizable ones).
         Testimonials (specific, attributed, with photos — not generic).
         Case study snippets with real numbers.
         Review scores and counts.
         Security badges (where relevant).
       - PLACEMENT: Near CTAs and after benefit claims — not buried at the bottom.
       - Strategic placement of testimonials, logos, and case studies to validate the offering at decision points.

    6. OBJECTION HANDLING:
       - COMMON OBJECTIONS TO ADDRESS:
         Price/value concerns.
         "Will this work for my situation?"
         Implementation difficulty / time investment.
         "What if it doesn't work?" (risk).
       - ADDRESS THROUGH: FAQ sections, guarantees, comparison content, process transparency, risk reversal (free trial, money-back guarantee).
       - Resolve objections in logical order from Hero to Footer.

    7. FRICTION POINTS:
       - Too many form fields (reduce to minimum viable).
       - Unclear next steps after CTA click.
       - Confusing navigation that pulls attention from conversion goal.
       - Required information that shouldn't be required at this stage.
       - Mobile experience issues (touch targets, layout, load time).
       - Long load times (performance directly impacts conversion).
       - Competing CTAs with equal visual weight.
       - External links that leak visitors before conversion.

    FLOW OPTIMIZATION:
    - Ensure a logical narrative arc from Hero to Footer that builds the case for conversion:
      1. Hook (Headline + Value Prop) → captures attention.
      2. Credibility (Social Proof) → builds trust.
      3. Problem (Pain Points) → creates resonance.
      4. Solution (Benefits) → shows the path forward.
      5. Proof (How It Works / Case Studies) → reduces skepticism.
      6. Objection Handling (FAQ / Guarantees) → removes final barriers.
      7. Close (Final CTA + Risk Reversal) → drives action.
    - Each section should advance ONE argument and flow naturally to the next.

    PAGE-SPECIFIC FRAMEWORKS:

    HOMEPAGE CRO:
    - Clear positioning for cold visitors who know nothing about you.
    - Quick path to most common conversion action.
    - Handle both "ready to buy" AND "still researching" visitor intents.
    - Provide clear paths for different audience segments.

    LANDING PAGE CRO:
    - Message match with traffic source (ad copy → headline alignment is critical).
    - Single CTA — remove navigation if possible to prevent leakage.
    - Complete argument on one page — no reliance on "learn more" clicks.
    - Every element must serve the single conversion goal or be removed.

    PRICING PAGE CRO:
    - Clear plan comparison with easy-to-scan feature matrix.
    - Recommended/popular plan indication (visual emphasis).
    - Address "which plan is right for me?" anxiety with use-case guidance.
    - Show annual vs. monthly pricing with savings highlighted.
    - Include FAQ addressing common pricing objections.

    FEATURE PAGE CRO:
    - Connect feature → benefit → outcome (not just feature description).
    - Show use cases and real examples.
    - Clear path to try or buy from every section.
    - Avoid feature dumps — organize by customer problem solved.

    BLOG POST CRO:
    - Contextual CTAs matching content topic (not generic site-wide CTAs).
    - Inline CTAs at natural stopping points (after key insights).
    - Content upgrades related to the post topic.
    - Don't interrupt the reading experience — enhance it.

    BOTTLENECK ANALYSIS:
    - Identify and flag any structural element that distracts from the primary conversion objective.
    - Every element on the page must either: (a) advance the conversion argument, (b) build trust, or (c) handle an objection. If it does none of these, flag for removal.
    - Check for attention leaks: external links, competing navigation, secondary offers that dilute focus.

    OUTPUT FORMAT:

    1. QUICK WINS (Implement Now):
       Easy changes with likely immediate impact. Low effort, high confidence.
       Format: [Change] — [Why it matters] — [Expected impact].

    2. HIGH-IMPACT CHANGES (Prioritize):
       Bigger changes requiring more effort but will significantly improve conversions.
       Format: [Change] — [Current problem] — [Recommended solution] — [Expected impact].

    3. TEST IDEAS:
       Hypotheses worth A/B testing rather than assuming. Frame as testable hypotheses.
       Format: "Test [variation A] vs [variation B] — Hypothesis: [expected outcome because reason]".
       EXPERIMENT CATEGORIES:
       - Hero section (headline, visual, CTA).
       - Trust signals and social proof placement.
       - Pricing presentation.
       - Form optimization (fields, layout, multi-step).
       - Navigation and UX changes.

    4. COPY ALTERNATIVES:
       For key elements (headlines, CTAs, subheadlines), provide 2–3 alternatives with rationale:
       - Option A: [copy] — [rationale]
       - Option B: [copy] — [rationale]
       - Option C: [copy] — [rationale]

    ANTI-PATTERNS (FLAG IMMEDIATELY):
    - No clear value proposition above the fold.
    - Headline that doesn't communicate what the product does or why it matters.
    - Message mismatch between traffic source and landing page headline.
    - Multiple competing primary CTAs with equal visual weight.
    - Weak/generic CTA copy ("Submit", "Learn More", "Click Here").
    - CTA not visible without scrolling.
    - No social proof or trust signals near conversion points.
    - Objections not addressed before the final CTA.
    - Unnecessary form fields increasing friction.
    - Navigation on landing pages that leaks visitors.
    - Feature dumps without benefit translation.
    - Generic stock photos that don't support the message.
    - Walls of text without visual hierarchy or scannability.
    - Mobile experience significantly worse than desktop.
    - External links that pull visitors away before conversion.
    - No risk reversal (guarantee, free trial, cancellation policy).
    - Pricing page without recommended plan indication.
    - Blog posts with no contextual CTAs.
    - "About" pages with no conversion path.
    - Pages that rely on visitors reading everything linearly (most scan).
  `.trim(),

  'marketing-psychology': `
  SKILL: Behavioral Science & Marketing Psychology
  KNOWLEDGE: Mastery of 70+ psychological principles and cognitive biases to influence user decision-making.

  HOW TO USE THIS SKILL:
  - Check for product marketing context first (.agents/product-marketing-context.md or .claude/product-marketing-context.md)
  - Read context before applying mental models to tailor recommendations to specific product and audience
  - Identify which mental models apply to the situation
  - Explain the psychology behind each model
  - Provide specific marketing applications
  - Suggest how to implement ethically

  PRINCIPLES TO APPLY:

  === FOUNDATIONAL THINKING MODELS ===

  - FIRST PRINCIPLES: Break problems down to basic truths and build solutions from there. Use the 5 Whys technique to find root causes. Don't assume you need something because competitors do—ask why, what problem it solves, and whether there's a better solution.

  - JOBS TO BE DONE: People don't buy products—they hire them to get a job done. Focus on the outcome customers want, not features. A drill buyer wants a hole, not a drill. Frame your product around the job it accomplishes.

  - CIRCLE OF COMPETENCE: Know what you're good at and stay within it. Venture outside only with proper learning or expert help. Don't chase every channel—double down where you have genuine expertise and competitive advantage.

  - INVERSION: Instead of asking "How do I succeed?", ask "What would guarantee failure?" Then avoid those things. List everything that would make your campaign fail—confusing messaging, wrong audience, slow landing page—then systematically prevent each.

  - OCCAM'S RAZOR: The simplest explanation is usually correct. Avoid overcomplicating strategies. If conversions dropped, check the obvious first (broken form, page speed) before assuming complex attribution issues.

  - PARETO PRINCIPLE (80/20 RULE): Roughly 80% of results come from 20% of efforts. Identify and focus on the vital few. Find the 20% of channels, customers, or content driving 80% of results. Cut or reduce the rest.

  - LOCAL VS GLOBAL OPTIMA: A local optimum is the best solution nearby, but a global optimum is the best overall. Don't get stuck optimizing the wrong thing. Optimizing email subject lines won't help if email isn't the right channel. Zoom out before zooming in.

  - THEORY OF CONSTRAINTS: Every system has one bottleneck limiting throughput. Find and fix that constraint before optimizing elsewhere. If your funnel converts well but traffic is low, more conversion optimization won't help. Fix the traffic bottleneck first.

  - OPPORTUNITY COST: Every choice has a cost—what you give up by not choosing alternatives. Time spent on a low-ROI channel is time not spent on high-ROI activities. Always compare against alternatives.

  - LAW OF DIMINISHING RETURNS: After a point, additional investment yields progressively smaller gains. The 10th blog post won't have the same impact as the first. Know when to diversify rather than double down.

  - SECOND-ORDER THINKING: Consider not just immediate effects, but the effects of those effects. A flash sale boosts revenue (first order) but may train customers to wait for discounts (second order).

  - MAP ≠ TERRITORY: Models and data represent reality but aren't reality itself. Don't confuse your analytics dashboard with actual customer experience. Your customer persona is useful, but real customers are more complex.

  - PROBABILISTIC THINKING: Think in probabilities, not certainties. Estimate likelihoods and plan for multiple outcomes. Don't bet everything on one campaign. Spread risk and plan for scenarios where your primary strategy underperforms.

  - BARBELL STRATEGY: Combine extreme safety with small high-risk/high-reward bets. Avoid the mediocre middle. Put 80% of budget into proven channels, 20% into experimental bets.

  === UNDERSTANDING BUYERS & HUMAN PSYCHOLOGY ===

  - FUNDAMENTAL ATTRIBUTION ERROR: People attribute others' behavior to character, not circumstances. When customers don't convert, examine your process before blaming them. The problem is usually situational, not personal.

  - MERE EXPOSURE EFFECT: People prefer things they've seen before. Familiarity breeds liking. Consistent brand presence builds preference over time. Repetition across channels creates comfort and trust.

  - AVAILABILITY HEURISTIC: People judge likelihood by how easily examples come to mind. Recent or vivid events seem more common. Case studies and testimonials make success feel more achievable. Make positive outcomes easy to imagine.

  - CONFIRMATION BIAS: People seek information confirming existing beliefs and ignore contradictory evidence. Understand what your audience already believes and align messaging accordingly. Fighting beliefs head-on rarely works.

  - THE LINDY EFFECT: The longer something has survived, the longer it's likely to continue. Old ideas often outlast new ones. Proven marketing principles (clear value props, social proof) outlast trendy tactics.

  - MIMETIC DESIRE: People want things because others want them. Desire is socially contagious. Show that desirable people want your product. Waitlists, exclusivity, and social proof trigger mimetic desire.

  - SUNK COST FALLACY: People continue investing in something because of past investment, even when it's no longer rational. Know when to kill underperforming campaigns. Past spend shouldn't justify future spend if results aren't there.

  - ENDOWMENT EFFECT: People value things more once they own them. Free trials, samples, and freemium models let customers own the product, making them reluctant to give it up.

  - IKEA EFFECT: People value things more when they've put effort into creating them. Let customers customize, configure, or build something. Their investment increases perceived value and commitment.

  - ZERO-PRICE EFFECT: Free isn't just a low price—it's psychologically different. Free triggers irrational preference. Free tiers, free trials, and free shipping have disproportionate appeal. The jump from $1 to $0 is bigger than $2 to $1.

  - HYPERBOLIC DISCOUNTING / PRESENT BIAS: People strongly prefer immediate rewards over future ones. Emphasize immediate benefits ("Start saving time today") over future ones ("You'll see ROI in 6 months").

  - STATUS-QUO BIAS: People prefer the current state of affairs. Change requires effort and feels risky. Reduce friction to switch. Make the transition feel safe and easy. "Import your data in one click."

  - DEFAULT EFFECT: People tend to accept pre-selected options. Defaults are powerful. Pre-select the plan you want customers to choose. Opt-out beats opt-in for subscriptions (ethically applied).

  - PARADOX OF CHOICE: Too many options overwhelm and paralyze. Fewer choices often lead to more decisions. Limit options. Three pricing tiers beat seven. Recommend a single "best for most" option.

  - GOAL-GRADIENT EFFECT: People accelerate effort as they approach a goal. Progress visualization motivates action. Show progress bars, completion percentages, and "almost there" messaging to drive completion.

  - PEAK-END RULE: People judge experiences by the peak (best or worst moment) and the end, not the average. Design memorable peaks (surprise upgrades, delightful moments) and strong endings (thank you pages, follow-up emails).

  - ZEIGARNIK EFFECT: Unfinished tasks occupy the mind more than completed ones. Open loops create tension. "You're 80% done" creates pull to finish. Incomplete profiles, abandoned carts, and cliffhangers leverage this.

  - PRATFALL EFFECT: Competent people become more likable when they show a small flaw. Perfection is less relatable. Admitting a weakness ("We're not the cheapest, but...") can increase trust and differentiation.

  - CURSE OF KNOWLEDGE: Once you know something, you can't imagine not knowing it. Experts struggle to explain simply. Your product seems obvious to you but confusing to newcomers. Test copy with people unfamiliar with your space.

  - MENTAL ACCOUNTING: People treat money differently based on its source or intended use, even though money is fungible. Frame costs in favorable mental accounts. "$3/day" feels different than "$90/month" even though it's the same.

  - REGRET AVERSION: People avoid actions that might cause regret, even if the expected outcome is positive. Address regret directly. Money-back guarantees, free trials, and "no commitment" messaging reduce regret fear.

  - BANDWAGON EFFECT / SOCIAL PROOF: People follow what others are doing. Popularity signals quality and safety. Show customer counts, testimonials, logos, reviews, and "trending" indicators. Numbers create confidence.

  === INFLUENCING BEHAVIOR & PERSUASION ===

  - RECIPROCITY PRINCIPLE: People feel obligated to return favors. Give first, and people want to give back. Free content, free tools, and generous free tiers create reciprocal obligation. Give value before asking for anything.

  - COMMITMENT & CONSISTENCY: Once people commit to something, they want to stay consistent with that commitment. Get small commitments first (email signup, free trial). People who've taken one step are more likely to take the next.

  - AUTHORITY BIAS: People defer to experts and authority figures. Credentials and expertise create trust. Feature expert endorsements, certifications, "featured in" logos, and thought leadership content.

  - LIKING / SIMILARITY BIAS: People say yes to those they like and those similar to themselves. Use relatable spokespeople, founder stories, and community language. "Built by marketers for marketers" signals similarity.

  - UNITY PRINCIPLE: Shared identity drives influence. "One of us" is powerful. Position your brand as part of the customer's tribe. Use insider language and shared values.

  - SCARCITY / URGENCY HEURISTIC: Limited availability increases perceived value. Scarcity signals desirability. Limited-time offers, low-stock warnings, and exclusive access create urgency. Only use when genuine.

  - FOOT-IN-THE-DOOR TECHNIQUE: Start with a small request, then escalate. Compliance with small requests leads to compliance with larger ones. Free trial → paid plan → annual plan → enterprise. Each step builds on the last.

  - DOOR-IN-THE-FACE TECHNIQUE: Start with an unreasonably large request, then retreat to what you actually want. The contrast makes the second request seem reasonable. Show enterprise pricing first, then reveal the affordable starter plan.

  - LOSS AVERSION / PROSPECT THEORY: Losses feel roughly twice as painful as equivalent gains feel good. People will work harder to avoid losing than to gain. Frame in terms of what they'll lose by not acting. "Don't miss out" beats "You could gain."

  - ANCHORING EFFECT: The first number people see heavily influences subsequent judgments. Show the higher price first (original price, competitor price, enterprise tier) to anchor expectations.

  - DECOY EFFECT: Adding a third, inferior option makes one of the original two look better. A "decoy" pricing tier that's clearly worse value makes your preferred tier look like the obvious choice.

  - FRAMING EFFECT: How something is presented changes how it's perceived. Same facts, different frames. "90% success rate" vs. "10% failure rate" are identical but feel different. Frame positively.

  - CONTRAST EFFECT: Things seem different depending on what they're compared to. Show the "before" state clearly. The contrast with your "after" makes improvements vivid.

  === PRICING PSYCHOLOGY ===

  - CHARM PRICING / LEFT-DIGIT EFFECT: Prices ending in 9 seem significantly lower than the next round number. $99 feels much cheaper than $100. Use .99 or .95 endings for value-focused products. The left digit dominates perception.

  - ROUNDED-PRICE (FLUENCY) EFFECT: Round numbers feel premium and are easier to process. $100 signals quality; $99 signals value. Use round prices for premium products ($500/month), charm prices for value products ($497/month).

  - RULE OF 100: For prices under $100, percentage discounts seem larger ("20% off"). For prices over $100, absolute discounts seem larger ("$50 off"). $80 product: "20% off" beats "$16 off." $500 product: "$100 off" beats "20% off."

  - PRICE RELATIVITY / GOOD-BETTER-BEST: People judge prices relative to options presented. A middle tier seems reasonable between cheap and expensive. Three tiers where the middle is your target. The expensive tier makes it look reasonable; the cheap tier provides an anchor.

  - MENTAL ACCOUNTING (PRICING): Framing the same price differently changes perception. "$1/day" feels cheaper than "$30/month." "Less than your morning coffee" reframes the expense.

  === DESIGN & DELIVERY MODELS ===

  - HICK'S LAW: Decision time increases with the number and complexity of choices. More options = slower decisions = more abandonment. Simplify choices. One clear CTA beats three. Fewer form fields beat more.

  - AIDA FUNNEL: Attention → Interest → Desire → Action. The classic customer journey model. Structure pages and campaigns to move through each stage. Capture attention before building desire.

  - RULE OF 7: Prospects need roughly 7 touchpoints before converting. One ad rarely converts; sustained presence does. Build multi-touch campaigns across channels. Retargeting, email sequences, and consistent presence compound.

  - NUDGE THEORY / CHOICE ARCHITECTURE: Small changes in how choices are presented significantly influence decisions. Default selections, strategic ordering, and friction reduction guide behavior without restricting choice.

  - BJ FOGG BEHAVIOR MODEL: Behavior = Motivation × Ability × Prompt. All three must be present for action. High motivation but hard to do = won't happen. Easy to do but no prompt = won't happen. Design for all three.

  - EAST FRAMEWORK: Make desired behaviors: Easy, Attractive, Social, Timely. Reduce friction (easy), make it appealing (attractive), show others doing it (social), ask at the right moment (timely).

  - COM-B MODEL: Behavior requires: Capability, Opportunity, Motivation. Can they do it (capability)? Is the path clear (opportunity)? Do they want to (motivation)? Address all three.

  - ACTIVATION ENERGY: The initial energy required to start something. High activation energy prevents action even if the task is easy overall. Reduce starting friction. Pre-fill forms, offer templates, show quick wins. Make the first step trivially easy.

  - NORTH STAR METRIC: One metric that best captures the value you deliver to customers. Focus creates alignment. Identify your North Star (active users, completed projects, revenue per customer) and align all efforts toward it.

  - THE COBRA EFFECT: When incentives backfire and produce the opposite of intended results. Test incentive structures. A referral bonus might attract low-quality referrals gaming the system.

  === GROWTH & SCALING MODELS ===

  - FEEDBACK LOOPS: Output becomes input, creating cycles. Positive loops accelerate growth; negative loops create decline. Build virtuous cycles: more users → more content → better SEO → more users. Identify and strengthen positive loops.

  - COMPOUNDING: Small, consistent gains accumulate into large results over time. Early gains matter most. Consistent content, SEO, and brand building compound. Start early; benefits accumulate exponentially.

  - NETWORK EFFECTS: A product becomes more valuable as more people use it. Design features that improve with more users: shared workspaces, integrations, marketplaces, communities.

  - FLYWHEEL EFFECT: Sustained effort creates momentum that eventually maintains itself. Hard to start, easy to maintain. Content → traffic → leads → customers → case studies → more content. Each element powers the next.

  - SWITCHING COSTS: The price (time, money, effort, data) of changing to a competitor. High switching costs create retention. Increase switching costs ethically: integrations, data accumulation, workflow customization, team adoption.

  - EXPLORATION VS EXPLOITATION: Balance trying new things (exploration) with optimizing what works (exploitation). Don't abandon working channels for shiny new ones, but allocate some budget to experiments.

  - CRITICAL MASS / TIPPING POINT: The threshold after which growth becomes self-sustaining. Focus resources on reaching critical mass in one segment before expanding. Depth before breadth.

  - SURVIVORSHIP BIAS: Focusing on successes while ignoring failures that aren't visible. Study failed campaigns, not just successful ones. The viral hit you're copying had 99 failures you didn't see.

  === QUICK REFERENCE GUIDE ===

  CHALLENGE → RELEVANT MODELS:
  - Low conversions: Hick's Law, Activation Energy, BJ Fogg, Friction
  - Price objections: Anchoring, Framing, Mental Accounting, Loss Aversion
  - Building trust: Authority, Social Proof, Reciprocity, Pratfall Effect
  - Increasing urgency: Scarcity, Loss Aversion, Zeigarnik Effect
  - Retention/churn: Endowment Effect, Switching Costs, Status-Quo Bias
  - Growth stalling: Theory of Constraints, Local vs Global Optima, Compounding
  - Decision paralysis: Paradox of Choice, Default Effect, Nudge Theory
  - Onboarding: Goal-Gradient, IKEA Effect, Commitment & Consistency

  === TASK-SPECIFIC QUESTIONS ===

  1. What specific behavior are you trying to influence?
  2. What does your customer believe before encountering your marketing?
  3. Where in the journey (awareness → consideration → decision) is this?
  4. What's currently preventing the desired action?
  5. Have you tested this with real customers?

  === ETHICAL IMPLEMENTATION GUIDELINES ===

  - Use scarcity and urgency only when genuine
  - Never manipulate or deceive users
  - Respect user autonomy and choice
  - Be transparent about limitations and terms
  - Prioritize long-term trust over short-term gains
  - Test assumptions with real customers
  - Consider second-order effects of your tactics
  `.trim(),



  'form-cro': `
  SKILL: Form Conversion Rate Optimization Expert
  GOAL: Maximize form completion rates while capturing the data that matters. Minimize lead capture friction for contact, demo, and interest forms.

  HOW TO USE THIS SKILL:
  - Check for product marketing context first (.agents/product-marketing-context.md or .claude/product-marketing-context.md)
  - Use that context and only ask for information not already covered or specific to this task
  - Identify form type and current state before providing recommendations
  - Apply core principles systematically to each form element

  PRINCIPLES TO APPLY:

  === INITIAL ASSESSMENT ===

  FORM TYPE IDENTIFICATION:
  - Lead capture (gated content, newsletter)
  - Contact form
  - Demo/sales request
  - Application form
  - Survey/feedback
  - Checkout form
  - Quote request

  CURRENT STATE ANALYSIS:
  - How many fields?
  - What's the current completion rate?
  - Mobile vs. desktop split?
  - Where do users abandon?

  BUSINESS CONTEXT:
  - What happens with form submissions?
  - Which fields are actually used in follow-up?
  - Are there compliance/legal requirements?

  === CORE PRINCIPLES ===

  1. EVERY FIELD HAS A COST
  Each field reduces completion rate. Rule of thumb:
  - 3 fields: Baseline
  - 4-6 fields: 10-25% reduction
  - 7+ fields: 25-50%+ reduction

  For each field, ask:
  - Is this absolutely necessary before we can help them?
  - Can we get this information another way?
  - Can we ask this later?

  2. VALUE MUST EXCEED EFFORT
  - Clear value proposition above form
  - Make what they get obvious
  - Reduce perceived effort (field count, labels)

  3. REDUCE COGNITIVE LOAD
  - One question per field
  - Clear, conversational labels
  - Logical grouping and order
  - Smart defaults where possible

  === FIELD-BY-FIELD OPTIMIZATION ===

  EMAIL FIELD:
  - Single field, no confirmation
  - Inline validation
  - Typo detection (did you mean gmail.com?)
  - Proper mobile keyboard

  NAME FIELDS:
  - Single "Name" vs. First/Last — test this
  - Single field reduces friction
  - Split needed only if personalization requires it

  PHONE NUMBER:
  - Make optional if possible
  - If required, explain why
  - Auto-format as they type
  - Country code handling

  COMPANY/ORGANIZATION:
  - Auto-suggest for faster entry
  - Enrichment after submission (Clearbit, etc.)
  - Consider inferring from email domain

  JOB TITLE/ROLE:
  - Dropdown if categories matter
  - Free text if wide variation
  - Consider making optional

  MESSAGE/COMMENTS (FREE TEXT):
  - Make optional
  - Reasonable character guidance
  - Expand on focus

  DROPDOWN SELECTS:
  - "Select one..." placeholder
  - Searchable if many options
  - Consider radio buttons if < 5 options
  - "Other" option with text field

  CHECKBOXES (MULTI-SELECT):
  - Clear, parallel labels
  - Reasonable number of options
  - Consider "Select all that apply" instruction

  === FORM LAYOUT OPTIMIZATION ===

  FIELD ORDER:
  - Start with easiest fields (name, email)
  - Build commitment before asking more
  - Sensitive fields last (phone, company size)
  - Logical grouping if many fields

  LABELS AND PLACEHOLDERS:
  - Labels: Keep visible (not just placeholder) — placeholders disappear when typing, leaving users unsure what they're filling in
  - Placeholders: Examples, not labels
  - Help text: Only when genuinely helpful

  GOOD:
  Email
  [name@company.com]

  BAD:
  [Enter your email address] ← Disappears on focus

  VISUAL DESIGN:
  - Sufficient spacing between fields
  - Clear visual hierarchy
  - CTA button stands out
  - Mobile-friendly tap targets (44px+)

  SINGLE COLUMN VS. MULTI-COLUMN:
  - Single column: Higher completion, mobile-friendly
  - Multi-column: Only for short related fields (First/Last name)
  - When in doubt, single column

  === MULTI-STEP FORMS ===

  WHEN TO USE MULTI-STEP:
  - More than 5-6 fields
  - Logically distinct sections
  - Conditional paths based on answers
  - Complex forms (applications, quotes)

  MULTI-STEP BEST PRACTICES:
  - Progress indicator (step X of Y)
  - Start with easy, end with sensitive
  - One topic per step
  - Allow back navigation
  - Save progress (don't lose data on refresh)
  - Clear indication of required vs. optional

  PROGRESSIVE COMMITMENT PATTERN:
  - Low-friction start (just email)
  - More detail (name, company)
  - Qualifying questions
  - Contact preferences

  === ERROR HANDLING ===

  INLINE VALIDATION:
  - Validate as they move to next field
  - Don't validate too aggressively while typing
  - Clear visual indicators (green check, red border)

  ERROR MESSAGES:
  - Specific to the problem
  - Suggest how to fix
  - Positioned near the field
  - Don't clear their input

  GOOD: "Please enter a valid email address (e.g., name@company.com)"
  BAD: "Invalid input"

  ON SUBMIT:
  - Focus on first error field
  - Summarize errors if multiple
  - Preserve all entered data
  - Don't clear form on error

  === SUBMIT BUTTON OPTIMIZATION ===

  BUTTON COPY:
  Weak: "Submit" | "Send"
  Strong: "[Action] + [What they get]"

  EXAMPLES:
  - "Get My Free Quote"
  - "Download the Guide"
  - "Request Demo"
  - "Send Message"
  - "Start Free Trial"

  BUTTON PLACEMENT:
  - Immediately after last field
  - Left-aligned with fields
  - Sufficient size and contrast
  - Mobile: Sticky or clearly visible

  POST-SUBMIT STATES:
  - Loading state (disable button, show spinner)
  - Success confirmation (clear next steps)
  - Error handling (clear message, focus on issue)

  === TRUST AND FRICTION REDUCTION ===

  NEAR THE FORM:
  - Privacy statement: "We'll never share your info"
  - Security badges if collecting sensitive data
  - Testimonial or social proof
  - Expected response time

  REDUCING PERCEIVED EFFORT:
  - "Takes 30 seconds"
  - Field count indicator
  - Remove visual clutter
  - Generous white space

  ADDRESSING OBJECTIONS:
  - "No spam, unsubscribe anytime"
  - "We won't share your number"
  - "No credit card required"

  === FORM TYPES: SPECIFIC GUIDANCE ===

  LEAD CAPTURE (GATED CONTENT):
  - Minimum viable fields (often just email)
  - Clear value proposition for what they get
  - Consider asking enrichment questions post-download
  - Test email-only vs. email + name

  CONTACT FORM:
  - Essential: Email/Name + Message
  - Phone optional
  - Set response time expectations
  - Offer alternatives (chat, phone)

  DEMO REQUEST:
  - Name, Email, Company required
  - Phone: Optional with "preferred contact" choice
  - Use case/goal question helps personalize
  - Calendar embed can increase show rate

  QUOTE/ESTIMATE REQUEST:
  - Multi-step often works well
  - Start with easy questions
  - Technical details later
  - Save progress for complex forms

  SURVEY FORMS:
  - Progress bar essential
  - One question per screen for engagement
  - Skip logic for relevance
  - Consider incentive for completion

  === MOBILE OPTIMIZATION ===

  - Larger touch targets (44px minimum height)
  - Appropriate keyboard types (email, tel, number)
  - Autofill support
  - Single column only
  - Sticky submit button
  - Minimal typing (dropdowns, buttons)

  === MEASUREMENT ===

  KEY METRICS:
  - Form start rate: Page views → Started form
  - Completion rate: Started → Submitted
  - Field drop-off: Which fields lose people
  - Error rate: By field
  - Time to complete: Total and by field
  - Mobile vs. desktop: Completion by device

  WHAT TO TRACK:
  - Form views
  - First field focus
  - Each field completion
  - Errors by field
  - Submit attempts
  - Successful submissions

  === OUTPUT FORMAT ===

  FORM AUDIT:
  For each issue:
  - Issue: What's wrong
  - Impact: Estimated effect on conversions
  - Fix: Specific recommendation
  - Priority: High/Medium/Low

  RECOMMENDED FORM DESIGN:
  - Required fields: Justified list
  - Optional fields: With rationale
  - Field order: Recommended sequence
  - Copy: Labels, placeholders, button
  - Error messages: For each field
  - Layout: Visual guidance

  TEST HYPOTHESES:
  - Ideas to A/B test with expected outcomes

  === EXPERIMENT IDEAS ===

  FORM STRUCTURE EXPERIMENTS:
  Layout & Flow:
  - Single-step form vs. multi-step with progress bar
  - 1-column vs. 2-column field layout
  - Form embedded on page vs. separate page
  - Vertical vs. horizontal field alignment
  - Form above fold vs. after content

  Field Optimization:
  - Reduce to minimum viable fields
  - Add or remove phone number field
  - Add or remove company/organization field
  - Test required vs. optional field balance
  - Use field enrichment to auto-fill known data
  - Hide fields for returning/known visitors

  Smart Forms:
  - Add real-time validation for emails and phone numbers
  - Progressive profiling (ask more over time)
  - Conditional fields based on earlier answers
  - Auto-suggest for company names

  COPY & DESIGN EXPERIMENTS:
  Labels & Microcopy:
  - Test field label clarity and length
  - Placeholder text optimization
  - Help text: show vs. hide vs. on-hover
  - Error message tone (friendly vs. direct)

  CTAs & Buttons:
  - Button text variations ("Submit" vs. "Get My Quote" vs. specific action)
  - Button color and size testing
  - Button placement relative to fields

  Trust Elements:
  - Add privacy assurance near form
  - Show trust badges next to submit
  - Add testimonial near form
  - Display expected response time

  FORM TYPE-SPECIFIC EXPERIMENTS:
  Demo Request Forms:
  - Test with/without phone number requirement
  - Add "preferred contact method" choice
  - Include "What's your biggest challenge?" question
  - Test calendar embed vs. form submission

  Lead Capture Forms:
  - Email-only vs. email + name
  - Test value proposition messaging above form
  - Gated vs. ungated content strategies
  - Post-submission enrichment questions

  Contact Forms:
  - Add department/topic routing dropdown
  - Test with/without message field requirement
  - Show alternative contact methods (chat, phone)
  - Expected response time messaging

  MOBILE & UX EXPERIMENTS:
  - Larger touch targets for mobile
  - Test appropriate keyboard types by field
  - Sticky submit button on mobile
  - Auto-focus first field on page load
  - Test form container styling (card vs. minimal)

  === TASK-SPECIFIC QUESTIONS ===

  1. What's your current form completion rate?
  2. Do you have field-level analytics?
  3. What happens with the data after submission?
  4. Which fields are actually used in follow-up?
  5. Are there compliance/legal requirements?
  6. What's the mobile vs. desktop split?

  === RELATED SKILLS ===

  - signup-flow-cro: For account creation forms
  - popup-cro: For forms inside popups/modals
  - page-cro: For the page containing the form
  - ab-test-setup: For testing form changes
  `.trim(),


  'seo-audit': `
  SKILL: Technical SEO & On-Page Auditor
  OBJECTIVE: Ensure the page is discoverable, indexable, and ranks highly for target keywords. Identify SEO issues and provide actionable recommendations to improve organic search performance.

  HOW TO USE THIS SKILL:
  - Check for product marketing context first (.agents/product-marketing-context.md or .claude/product-marketing-context.md)
  - Use that context and only ask for information not already covered or specific to this task
  - Understand site context, current state, and scope before auditing
  - Follow priority order: Crawlability → Technical → On-Page → Content → Authority

  === INITIAL ASSESSMENT ===

  SITE CONTEXT:
  - What type of site? (SaaS, e-commerce, blog, etc.)
  - What's the primary business goal for SEO?
  - What keywords/topics are priorities?

  CURRENT STATE:
  - Any known issues or concerns?
  - Current organic traffic level?
  - Recent changes or migrations?

  SCOPE:
  - Full site audit or specific pages?
  - Technical + on-page, or one focus area?
  - Access to Search Console / analytics?

  === SCHEMA MARKUP DETECTION LIMITATION ===

  IMPORTANT: web_fetch and curl cannot reliably detect structured data / schema markup.

  Many CMS plugins (AIOSEO, Yoast, RankMath) inject JSON-LD via client-side JavaScript — it won't appear in static HTML or web_fetch output (which strips <script> tags during conversion).

  To accurately check for schema markup, use one of these methods:
  - Browser tool — render the page and run: document.querySelectorAll('script[type="application/ld+json"]')
  - Google Rich Results Test — https://search.google.com/test/rich-results
  - Screaming Frog export — if the client provides one, use it (SF renders JavaScript)

  Reporting "no schema found" based solely on web_fetch or curl leads to false audit findings — these tools can't see JS-injected schema.

  === PRIORITY ORDER ===

  1. Crawlability & Indexation (can Google find and index it?)
  2. Technical Foundations (is the site fast and functional?)
  3. On-Page Optimization (is content optimized?)
  4. Content Quality (does it deserve to rank?)
  5. Authority & Links (does it have credibility?)

  === TECHNICAL SEO AUDIT ===

  CRAWLABILITY:

  Robots.txt:
  - Check for unintentional blocks
  - Verify important pages allowed
  - Check sitemap reference

  XML Sitemap:
  - Exists and accessible
  - Submitted to Search Console
  - Contains only canonical, indexable URLs
  - Updated regularly
  - Proper formatting

  Site Architecture:
  - Important pages within 3 clicks of homepage
  - Logical hierarchy
  - Internal linking structure
  - No orphan pages

  Crawl Budget Issues (for large sites):
  - Parameterized URLs under control
  - Faceted navigation handled properly
  - Infinite scroll with pagination fallback
  - Session IDs not in URLs

  INDEXATION:

  Index Status:
  - site:domain.com check
  - Search Console coverage report
  - Compare indexed vs. expected

  Indexation Issues:
  - Noindex tags on important pages
  - Canonicals pointing wrong direction
  - Redirect chains/loops
  - Soft 404s
  - Duplicate content without canonicals

  Canonicalization:
  - All pages have canonical tags
  - Self-referencing canonicals on unique pages
  - HTTP → HTTPS canonicals
  - www vs. non-www consistency
  - Trailing slash consistency

  SITE SPEED & CORE WEB VITALS:

  Core Web Vitals:
  - LCP (Largest Contentful Paint): < 2.5s
  - INP (Interaction to Next Paint): < 200ms
  - CLS (Cumulative Layout Shift): < 0.1

  Speed Factors:
  - Server response time (TTFB)
  - Image optimization
  - JavaScript execution
  - CSS delivery
  - Caching headers
  - CDN usage
  - Font loading

  Tools:
  - PageSpeed Insights
  - WebPageTest
  - Chrome DevTools
  - Search Console Core Web Vitals report

  MOBILE-FRIENDLINESS:
  - Responsive design (not separate m. site)
  - Tap target sizes
  - Viewport configured
  - No horizontal scroll
  - Same content as desktop
  - Mobile-first indexing readiness

  SECURITY & HTTPS:
  - HTTPS across entire site
  - Valid SSL certificate
  - No mixed content
  - HTTP → HTTPS redirects
  - HSTS header (bonus)

  URL STRUCTURE:
  - Readable, descriptive URLs
  - Keywords in URLs where natural
  - Consistent structure
  - No unnecessary parameters
  - Lowercase and hyphen-separated

  === ON-PAGE SEO AUDIT ===

  TITLE TAGS:

  Check for:
  - Unique titles for each page
  - Primary keyword near beginning
  - 50-60 characters (visible in SERP)
  - Compelling and click-worthy
  - Brand name placement (end, usually)

  Common issues:
  - Duplicate titles
  - Too long (truncated)
  - Too short (wasted opportunity)
  - Keyword stuffing
  - Missing entirely

  META DESCRIPTIONS:

  Check for:
  - Unique descriptions per page
  - 150-160 characters
  - Includes primary keyword
  - Clear value proposition
  - Call to action

  Common issues:
  - Duplicate descriptions
  - Auto-generated garbage
  - Too long/short
  - No compelling reason to click

  HEADING STRUCTURE:

  Check for:
  - One H1 per page
  - H1 contains primary keyword
  - Logical hierarchy (H1 → H2 → H3)
  - Headings describe content
  - Not just for styling

  Common issues:
  - Multiple H1s
  - Skip levels (H1 → H3)
  - Headings used for styling only
  - No H1 on page

  CONTENT OPTIMIZATION:

  Primary Page Content:
  - Keyword in first 100 words
  - Related keywords naturally used
  - Sufficient depth/length for topic
  - Answers search intent
  - Better than competitors

  Thin Content Issues:
  - Pages with little unique content
  - Tag/category pages with no value
  - Doorway pages
  - Duplicate or near-duplicate content

  IMAGE OPTIMIZATION:

  Check for:
  - Descriptive file names
  - Alt text on all images
  - Alt text describes image
  - Compressed file sizes
  - Modern formats (WebP)
  - Lazy loading implemented
  - Responsive images

  INTERNAL LINKING:

  Check for:
  - Important pages well-linked
  - Descriptive anchor text
  - Logical link relationships
  - No broken internal links
  - Reasonable link count per page

  Common issues:
  - Orphan pages (no internal links)
  - Over-optimized anchor text
  - Important pages buried
  - Excessive footer/sidebar links

  KEYWORD TARGETING:

  Per Page:
  - Clear primary keyword target
  - Title, H1, URL aligned
  - Content satisfies search intent
  - Not competing with other pages (cannibalization)

  Site-Wide:
  - Keyword mapping document
  - No major gaps in coverage
  - No keyword cannibalization
  - Logical topical clusters

  === CONTENT QUALITY ASSESSMENT ===

  E-E-A-T SIGNALS:

  Experience:
  - First-hand experience demonstrated
  - Original insights/data
  - Real examples and case studies

  Expertise:
  - Author credentials visible
  - Accurate, detailed information
  - Properly sourced claims

  Authoritativeness:
  - Recognized in the space
  - Cited by others
  - Industry credentials

  Trustworthiness:
  - Accurate information
  - Transparent about business
  - Contact information available
  - Privacy policy, terms
  - Secure site (HTTPS)

  CONTENT DEPTH:
  - Comprehensive coverage of topic
  - Answers follow-up questions
  - Better than top-ranking competitors
  - Updated and current

  USER ENGAGEMENT SIGNALS:
  - Time on page
  - Bounce rate in context
  - Pages per session
  - Return visits

  === COMMON ISSUES BY SITE TYPE ===

  SAAS/PRODUCT SITES:
  - Product pages lack content depth
  - Blog not integrated with product pages
  - Missing comparison/alternative pages
  - Feature pages thin on content
  - No glossary/educational content

  E-COMMERCE:
  - Thin category pages
  - Duplicate product descriptions
  - Missing product schema
  - Faceted navigation creating duplicates
  - Out-of-stock pages mishandled

  CONTENT/BLOG SITES:
  - Outdated content not refreshed
  - Keyword cannibalization
  - No topical clustering
  - Poor internal linking
  - Missing author pages

  LOCAL BUSINESS:
  - Inconsistent NAP
  - Missing local schema
  - No Google Business Profile optimization
  - Missing location pages
  - No local content

  === OUTPUT FORMAT ===

  AUDIT REPORT STRUCTURE:

  Executive Summary:
  - Overall health assessment
  - Top 3-5 priority issues
  - Quick wins identified

  Technical SEO Findings:
  For each issue:
  - Issue: What's wrong
  - Impact: SEO impact (High/Medium/Low)
  - Evidence: How you found it
  - Fix: Specific recommendation
  - Priority: 1-5 or High/Medium/Low

  On-Page SEO Findings:
  Same format as above

  Content Findings:
  Same format as above

  Prioritized Action Plan:
  - Critical fixes (blocking indexation/ranking)
  - High-impact improvements
  - Quick wins (easy, immediate benefit)
  - Long-term recommendations

  === REFERENCES ===

  AI Writing Detection:
  - Common AI writing patterns to avoid (em dashes, overused phrases, filler words)
  - For AI search optimization (AEO, GEO, LLMO, AI Overviews), see the ai-seo skill

  === TOOLS REFERENCED ===

  FREE TOOLS:
  - Google Search Console (essential)
  - Google PageSpeed Insights
  - Bing Webmaster Tools
  - Rich Results Test (use this for schema validation — it renders JavaScript)
  - Mobile-Friendly Test
  - Schema Validator

  Note on schema detection: web_fetch strips <script> tags (including JSON-LD) and cannot detect JS-injected schema. Use the browser tool, Rich Results Test, or Screaming Frog instead — they render JavaScript and capture dynamically-injected markup.

  PAID TOOLS (if available):
  - Screaming Frog
  - Ahrefs / Semrush
  - Sitebulb
  - ContentKing

  === TASK-SPECIFIC QUESTIONS ===

  1. What pages/keywords matter most?
  2. Do you have Search Console access?
  3. Any recent changes or migrations?
  4. Who are your top organic competitors?
  5. What's your current organic traffic baseline?

  === RELATED SKILLS ===

  - ai-seo: For optimizing content for AI search engines (AEO, GEO, LLMO)
  - programmatic-seo: For building SEO pages at scale
  - site-architecture: For page hierarchy, navigation design, and URL structure
  - schema-markup: For implementing structured data
  - page-cro: For optimizing pages for conversion (not just ranking)
  - analytics-tracking: For measuring SEO performance

  === TECHNICAL REQUISITES ===

  - SEMANTIC STRUCTURE: Rigid H1-H6 hierarchy. Perfect use of <header>, <main>, <section>, and <footer>.
  - META TAGS: Unique and descriptive Title Tag (<60 chars) and Meta Description (<160 chars).
  - E-E-A-T: Build authority signals (Expertise, Experience, Authoritativeness, Trustworthiness) into the content.
  - PERFORMANCE: Achieve a "Perfect 100" in Lighthouse SEO and Accessibility scores.
  `.trim(),


  'ai-seo': `
  SKILL: AI Search Engine Optimization (AIO/GEO/LLMO)
  OBJECTIVE: Generate landing pages optimized for AI agents and AI-powered search engines (AI Overviews, Perplexity, Claude, Gemini). Content must be easily interpretable, quotable, and structurally clear for AI consumption.

  === CORE PRINCIPLES FOR AI-OPTIMIZED CONTENT ===

  1. CITABILITY:
     - Every section must work as a standalone answer
     - Use direct, declarative sentences
     - Avoid fluff, marketing hype, or ambiguous language
     - Answers should be complete without requiring context from other sections

  2. SEMANTIC STRUCTURE:
     - Rigid H1-H6 hierarchy is mandatory
     - Each section must have a clear purpose and single topic
     - Use <header>, <main>, <section>, <footer> semantically
     - Every section should answer ONE specific question

  3. DIRECT ANSWERS:
     - Lead with the answer, not with introductions
     - Use the inverted pyramid style: most important info first
     - Front-load key information in every paragraph
     - Avoid "teasing" information across multiple sections

  4. MACHINE-READABLE CONTENT:
     - Clear factual claims that AI can cite
     - Structured data via JSON-LD for FAQPage schema
     - No conflicting or contradictory information
     - Consistent terminology throughout the page

  === REQUIRED LANDING PAGE SECTIONS ===

  Every landing MUST include these semantic sections in order:

  1. HEADER (brand definition):
     <header>
       <h1>Service Name</h1>
       <p>One-line clear definition</p>
     </header>

  2. WHAT IS IT:
     <section id="que-es">
       <h2>¿Qué es?</h2>
       <p>Direct answer in maximum 2 sentences</p>
     </section>

  3. HOW IT WORKS (numbered steps):
     <section id="como-funciona">
       <h2>¿Cómo funciona?</h2>
       <ol>
         <li>Step 1</li>
         <li>Step 2</li>
         <li>Step 3</li>
       </ol>
     </section>

  4. USE CASES:
     <section id="casos-de-uso">
       <h2>Casos de uso</h2>
       <ul>
         <li>Use case 1</li>
         <li>Use case 2</li>
       </ul>
     </section>

  5. ADVANTAGES/BENEFITS:
     <section id="ventajas">
       <h2>Ventajas</h2>
       <ul>
         <li>Benefit 1</li>
         <li>Benefit 2</li>
       </ul>
     </section>

  6. FAQ (minimum 3-5 questions):
     <section id="faq">
       <h2>Preguntas frecuentes</h2>
       <h3>Question 1?</h3>
       <p>Direct answer</p>
       <h3>Question 2?</h3>
       <p>Direct answer</p>
     </section>

  === JSON-LD FAQPAGE SCHEMA (MANDATORY) ===

  Generate and include this exact structure:

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Question text exactly as shown in h3?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Answer text exactly as shown in p"
        }
      }
    ]
  }
  </script>

  CRITICAL: Question text in JSON-LD MUST match exactly the text in the h3 tag.
  CRITICAL: Answer text in JSON-LD MUST match exactly the text in the p tag.

  === JAVASCRIPT MODULAR FUNCTIONS ===

  Include these reusable generator functions in the HTML:

  function createHeader(title, description) {
    return '<header><h1>' + title + '</h1><p>' + description + '</p></header>';
  }

  function createSection(id, title, content) {
    return '<section id="' + id + '"><h2>' + title + '</h2>' + content + '</section>';
  }

  function createSteps(title, steps) {
    var html = '<section id="como-funciona"><h2>' + title + '</h2><ol>';
    steps.forEach(function(step) {
      html += '<li>' + step + '</li>';
    });
    html += '</ol></section>';
    return html;
  }

  function createList(title, items, id) {
    var html = '<section id="' + id + '"><h2>' + title + '</h2><ul>';
    items.forEach(function(item) {
      html += '<li>' + item + '</li>';
    });
    html += '</ul></section>';
    return html;
  }

  function createFAQ(faqs) {
    var html = '<section id="faq"><h2>Preguntas frecuentes</h2>';
    faqs.forEach(function(faq) {
      html += '<h3>' + faq.question + '</h3><p>' + faq.answer + '</p>';
    });
    html += '</section>';
    return html;
  }

  function generateJSONLD(faqs) {
    var schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(function(faq) {
        return {
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        };
      })
    };
    return '<script type="application/ld+json">' + JSON.stringify(schema, null, 2) + '</script>';
  }

  === ANTI-PATTERNS (FORBIDDEN) ===

  - Long text without structure or headers
  - Blocks without <h2> or <h3>
  - Ambiguous or inflated content
  - Visual-only landing pages without semantic content
  - Content that requires reading multiple sections to understand
  - Marketing fluff that AI cannot cite
  - Questions in FAQ that don't match JSON-LD exactly
  `.trim(),


  'responsive-design': `
  SKILL: Universal Responsive Design Maestro
  PHILOSOPHY: Mobile-First Strategy for all logic and styling. Design from small screens and progressively expand.

  HOW TO USE THIS SKILL:
  - New website/app: Layout design for combined mobile-desktop use
  - Legacy improvement: Converting fixed layouts to responsive
  - Performance optimization: Image optimization per device
  - Multiple screens: Tablet, desktop, and large screen support

  === WHEN TO USE THIS SKILL ===

  - New website or app requiring responsive layout
  - Converting fixed/legacy layouts to responsive
  - Optimizing images and assets per device
  - Supporting multiple screen sizes (tablet, desktop, large screens)
  - Improving mobile user experience

  === STEP 1: MOBILE-FIRST APPROACH ===

  Design from small screens and progressively expand.

  Example:

  /* Default: Mobile (320px~) */
  .container {
    padding: 1rem;
    font-size: 14px;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  /* Tablet (768px~) */
  @media (min-width: 768px) {
    .container {
      padding: 2rem;
      font-size: 16px;
    }

    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
  }

  /* Desktop (1024px~) */
  @media (min-width: 1024px) {
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem;
    }

    .grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
  }

  /* Large screen (1440px~) */
  @media (min-width: 1440px) {
    .grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  === STEP 2: FLEXBOX/GRID LAYOUT ===

  Leverage modern CSS layout systems.

  FLEXBOX (1-DIMENSIONAL LAYOUT):

  /* Navigation bar */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }

  /* Card list */
  .card-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .card-list {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .card {
      flex: 1 1 calc(50% - 0.5rem);  /* 2 columns */
    }
  }

  @media (min-width: 1024px) {
    .card {
      flex: 1 1 calc(33.333% - 0.667rem);  /* 3 columns */
    }
  }

  CSS GRID (2-DIMENSIONAL LAYOUT):

  /* Dashboard layout */
  .dashboard {
    display: grid;
    grid-template-areas:
      "header"
      "sidebar"
      "main"
      "footer";
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .dashboard {
      grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
      grid-template-columns: 250px 1fr;
    }
  }

  @media (min-width: 1024px) {
    .dashboard {
      grid-template-columns: 300px 1fr;
    }
  }

  .header { grid-area: header; }
  .sidebar { grid-area: sidebar; }
  .main { grid-area: main; }
  .footer { grid-area: footer; }

  === STEP 3: RESPONSIVE IMAGES ===

  Provide images suited to the device.

  USING SRCSET:

  <img
    src="image-800.jpg"
    srcset="
      image-400.jpg 400w,
      image-800.jpg 800w,
      image-1200.jpg 1200w,
      image-1600.jpg 1600w
    "
    sizes="
      (max-width: 600px) 100vw,
      (max-width: 900px) 50vw,
      33vw
    "
    alt="Responsive image"
  />

  PICTURE ELEMENT (ART DIRECTION):

  <picture>
    <!-- Mobile: portrait image -->
    <source media="(max-width: 767px)" srcset="portrait.jpg">

    <!-- Tablet: square image -->
    <source media="(max-width: 1023px)" srcset="square.jpg">

    <!-- Desktop: landscape image -->
    <img src="landscape.jpg" alt="Art direction example">
  </picture>

  CSS BACKGROUND IMAGES:

  .hero {
    background-image: url('hero-mobile.jpg');
  }

  @media (min-width: 768px) {
    .hero {
      background-image: url('hero-tablet.jpg');
    }
  }

  @media (min-width: 1024px) {
    .hero {
      background-image: url('hero-desktop.jpg');
    }
  }

  /* Or use image-set() */
  .hero {
    background-image: image-set(
      url('hero-1x.jpg') 1x,
      url('hero-2x.jpg') 2x
    );
  }

  === STEP 4: RESPONSIVE TYPOGRAPHY ===

  Adjust text size based on screen size.

  CLAMP() FUNCTION (FLUID SIZING):

  :root {
    /* min, preferred, max */
    --font-size-body: clamp(14px, 2.5vw, 18px);
    --font-size-h1: clamp(24px, 5vw, 48px);
    --font-size-h2: clamp(20px, 4vw, 36px);
  }

  body {
    font-size: var(--font-size-body);
  }

  h1 {
    font-size: var(--font-size-h1);
    line-height: 1.2;
  }

  h2 {
    font-size: var(--font-size-h2);
    line-height: 1.3;
  }

  MEDIA QUERY APPROACH:

  body {
    font-size: 14px;
    line-height: 1.6;
  }

  @media (min-width: 768px) {
    body { font-size: 16px; }
  }

  @media (min-width: 1024px) {
    body { font-size: 18px; }
  }

  === STEP 5: CONTAINER QUERIES (NEW FEATURE) ===

  Apply styles based on parent container size.

  .card-container {
    container-type: inline-size;
    container-name: card;
  }

  .card {
    padding: 1rem;
  }

  .card h2 {
    font-size: 1.2rem;
  }

  /* When container is 400px or wider */
  @container card (min-width: 400px) {
    .card {
      display: grid;
      grid-template-columns: 200px 1fr;
      padding: 1.5rem;
    }

    .card h2 {
      font-size: 1.5rem;
    }
  }

  /* When container is 600px or wider */
  @container card (min-width: 600px) {
    .card {
      grid-template-columns: 300px 1fr;
      padding: 2rem;
    }
  }

  === STANDARD BREAKPOINTS ===

  /* Mobile (default): 320px ~ 767px */
  /* Tablet: 768px ~ 1023px */
  /* Desktop: 1024px ~ 1439px */
  /* Large: 1440px+ */

  :root {
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;
  }

  /* Usage example */
  @media (min-width: 768px) { /* Tablet */ }
  @media (min-width: 1024px) { /* Desktop */ }

  === CONSTRAINTS ===

  MANDATORY RULES (MUST):

  Viewport meta tag: Must be included in HTML
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  Mobile-First: Mobile default, use min-width media queries
  ✅ @media (min-width: 768px)
  ❌ @media (max-width: 767px) (Desktop-first)

  Relative units: Use rem, em, %, vw/vh instead of px
  - font-size: rem
  - padding/margin: rem or em
  - width: % or vw

  PROHIBITED (MUST NOT):

  Fixed width prohibited: Avoid width: 1200px
  - Use max-width: 1200px instead

  Duplicate code: Avoid repeating same styles across all breakpoints
  - Common styles as default, only differences in media queries

  === EXAMPLES ===

  EXAMPLE 1: RESPONSIVE NAVIGATION

  function ResponsiveNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <nav className="navbar">
        {/* Logo */}
        <a href="/" className="logo">MyApp</a>

        {/* Hamburger button (mobile) */}
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links */}
        <ul className={\`nav-links \${isOpen ? 'active' : ''}\`}>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    );
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }

  /* Hamburger button (mobile only) */
  .menu-toggle {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
  }

  .nav-links.active {
    display: flex;
  }

  /* Tablet and above: hide hamburger, always show */
  @media (min-width: 768px) {
    .menu-toggle {
      display: none;
    }

    .nav-links {
      display: flex;
      position: static;
      flex-direction: row;
      gap: 2rem;
    }
  }

  EXAMPLE 2: RESPONSIVE GRID CARD

  function ProductGrid({ products }) {
    return (
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price"></p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    );
  }

  .product-grid {
    display: grid;
    grid-template-columns: 1fr;  /* Mobile: 1 column */
    gap: 1rem;
    padding: 1rem;
  }

  @media (min-width: 640px) {
    .product-grid {
      grid-template-columns: repeat(2, 1fr);  /* 2 columns */
    }
  }

  @media (min-width: 1024px) {
    .product-grid {
      grid-template-columns: repeat(3, 1fr);  /* 3 columns */
      gap: 1.5rem;
    }
  }

  @media (min-width: 1440px) {
    .product-grid {
      grid-template-columns: repeat(4, 1fr);  /* 4 columns */
      gap: 2rem;
    }
  }

  .product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
  }

  .product-card img {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }

  === BEST PRACTICES ===

  - Container queries first: Use container queries instead of media queries when possible
  - Flexbox vs Grid: Flexbox for 1-dimensional, Grid for 2-dimensional layouts
  - Performance: Image lazy loading, use WebP format
  - Testing: Chrome DevTools Device Mode, BrowserStack
  - Touch targets: Ensure all clickable elements meet 44x44px minimum for mobile
  - Fluid grids: Use CSS Grid and Flexbox for layouts that adapt smoothly to any viewport width
  - Breakpoint precision: Use proper media queries to adjust typography scale, spacing (paddings/gaps), and visibility
  - Image adaptability: Use object-fit and aspect-ratio to ensure visual integrity across devices

  === REFERENCES ===

  - MDN Responsive Design
  - CSS Grid Guide
  - Flexbox Guide
  - Container Queries

  === METADATA ===

  Version: 1.0.0
  Last Updated: 2025-01-01
  Compatible Platforms: Claude, ChatGPT, Gemini

  === RELATED SKILLS ===

  - ui-component-patterns: Responsive components
  - web-accessibility: Consider alongside accessibility
  - page-cro: For optimizing pages for conversion
  - performance-optimization: For improving load times
  `.trim(),


  'ai-image-generation': `
  SKILL: AI Image Generation Specialist (Google Gemini - Free Tier)
  OBJECTIVE: Generate high-fidelity visual assets using Google's free Gemini models that look like custom photography, not AI stock.

  AVAILABLE FREE MODELS (GOOGLE GEMINI):

  Model: google/gemini-3-pro-image-preview
  Best For: High quality photorealistic images, detailed scenes
  Use Case: Professional product photos, landscapes, portraits

  Model: google/gemini-2-5-flash-image
  Best For: Fast generation, quick iterations, testing concepts
  Use Case: Rapid prototyping, multiple variations, draft images

  HOW TO USE THIS SKILL:

  QUICK START:
  SKILL: AI Image Generation Specialist (Digital Presence)
  OBJECTIVE: Define and create high-fidelity photographic assets for landing pages that look like premium custom photography, not generic AI stock.

  METODOLOGÍA:
  1. Identificar secciones clave para el impacto visual (Hero, Características, Beneficios).
  2. Redactar descripciones visuales detalladas ("Superprompts") en INGLÉS.
  3. Generar la etiqueta <img> final con el proveedor asignado (Pollinations AI).

  REGLAS DE CONSTRUCCIÓN DE URL:
  - Formato: 'https://image.pollinations.ai/prompt/[descripcion-en-ingles-separada-por-guiones]?width=1024&height=1024&nologo=true&enhance=true'
  - La descripción debe ser CINEMÁTICA: detallar iluminación, composición, profundidad de campo y ambiente.
  - Asegurar consistencia de marca en todas las imágenes.

  EJEMPLOS DE SUPERPROMPTS:
  - 'professional-studio-photography-of-a-sleek-black-ceramic-coffee-mug-on-a-natural-oak-table-soft-morning-light-minimalist-aesthetic-ultra-detailed-4k'
  - 'cinematic-shot-of-a-modern-office-with-tropical-plants-high-ceilings-large-windows-showing-city-skyline-bright-and-vibrant-mood-extreme-detail'

  RULES:
  - DETAILED PROMPTING: Provide "Superprompts" for placeholders detailing: lighting (Cinematic, Soft, Studio), composition (Wide, Macro, Low-angle), and mood.
  - BRAND CONSISTENCY: Images must adhere to the palette and "vibe" defined by the Design Agent.
  }'

  Fast Generation with Gemini 2.5 Flash:
  infsh app run google/gemini-2-5-flash-image --input '{
    "prompt": "photorealistic landscape with mountains and lake at sunrise"
  }'

  With Aspect Ratio:
  infsh app run google/gemini-3-pro-image-preview --input '{
    "prompt": "cyberpunk city at night, neon lights, rain",
    "aspect_ratio": "16:9"
  }'

  PROMPT ENGINEERING BEST PRACTICES:

  LIGHTING:
  - Cinematic lighting
  - Soft natural light
  - Studio lighting
  - Golden hour
  - Blue hour
  - Dramatic shadows

  COMPOSITION:
  - Wide angle
  - Macro close-up
  - Low-angle shot
  - High-angle shot
  - Rule of thirds
  - Centered composition

  MOOD/STYLE:
  - Professional
  - Minimalist
  - Vibrant
  - Moody
  - Warm tones
  - Cool tones

  IMAGE QUALITY DESCRIPTORS:
  - Photorealistic
  - 4K quality
  - Ultra-detailed
  - Sharp focus
  - Professional photography
  - Commercial grade

  RELATED SKILLS:

  # Full platform skill (all 150+ apps)
  npx skills add inference-sh/skills@infsh-cli

  # Upscaling & enhancement
  npx skills add inference-sh/skills@image-upscaling

  # Background removal
  npx skills add inference-sh/skills@background-removal

  # Video generation
  npx skills add inference-sh/skills@ai-video-generation

  # AI avatars from images
  npx skills add inference-sh/skills@ai-avatar-video

  Browse all apps: infsh app list --category image

  DOCUMENTATION:
  - Running Apps: How to run apps via CLI
  - Image Generation Example: Complete image generation guide
  - Apps Overview: Understanding the app ecosystem

  METADATA:
  Version: 1.0.0
  Free Tier Models: Google Gemini 3 Pro, Gemini 2.5 Flash
  Last Updated: 2026-03-21
  `.trim()
};
