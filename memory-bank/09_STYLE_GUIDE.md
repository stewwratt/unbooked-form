# 🎨 **UNBOOKED DESIGN SYSTEM & STYLE GUIDE**

_Updated: 2025-02-05 - Marc Lou Typography & Spacing Optimization_

## 🎯 **DESIGN PHILOSOPHY**

**Unbooked** embodies **professional sophistication** with a **modern, trust-inspiring aesthetic** designed for both tech-savvy clients and traditional service professionals. The design balances **digital innovation** with **timeless professionalism**.

### **Core Design Principles:**

1. **Trust & Reliability**: Professional appearance that inspires confidence
2. **Accessibility First**: Works for all users regardless of technical expertise
3. **Mobile Excellence**: Optimized for on-the-go professional use
4. **Sophisticated Simplicity**: Clean design with powerful functionality underneath

---

## 🎨 **COLOR SYSTEM - REFINED BLUE SPECTRUM**

### **Primary Brand Colors:**

```css
/* Core Brand Gradient - Used for primary actions and brand elements */
--brand-primary-start: #5e8bf4    /* Deep Professional Blue */
--brand-primary-end: #61baff      /* Bright Trust Blue */
--brand-gradient: linear-gradient(135deg, #5e8bf4 0%, #61baff 100%);

/* Gradient Variations for Different Contexts */
--brand-gradient-subtle: linear-gradient(135deg, rgba(94, 139, 244, 0.1) 0%, rgba(97, 186, 255, 0.1) 100%);
--brand-gradient-hover: linear-gradient(135deg, #4a79e8 0%, #4da8f0 100%);
--brand-gradient-pressed: linear-gradient(135deg, #3d6bd1 0%, #3a96e1 100%);
```

### **Supporting Colors:**

```css
/* Neutral System - Foundation colors */
--neutral-black: #000000          /* Pure black for text and boundaries `*/
--neutral-white: #ffffff          /* Pure white for backgrounds and text */
--neutral-gray-50: #f9fafb        /* Very light gray for subtle backgrounds */
--neutral-gray-100: #f3f4f6       /* Light gray for card backgrounds */
--neutral-gray-200: #e5e7eb       /* Border gray for subtle divisions */
--neutral-gray-300: #d1d5db       /* Placeholder text gray */
--neutral-gray-400: #9ca3af       /* Secondary text gray */
--neutral-gray-500: #6b7280       /* Tertiary text gray */
--neutral-gray-600: #4b5563       /* Dark text gray */
--neutral-gray-700: #374151       /* Heading text gray */
--neutral-gray-800: #1f2937       /* Very dark text */
--neutral-gray-900: #111827       /* Near-black text */

/* Semantic Colors for Status and Feedback */
--success-green: #10b981          /* Success states, confirmations */
--warning-amber: #f59e0b          /* Warnings, attention needed */
--error-red: #ef4444             /* Errors, destructive actions */
--info-blue: #3b82f6             /* Information, neutral alerts */
```

### **Cash Payment System Colors:**

```css
/* New colors for cash payment features */
--cash-primary: #16a34a           /* Cash transaction green */
--cash-secondary: #15803d         /* Darker cash green for hover states */
--cash-light: #dcfce7            /* Light cash background */
--reconciliation-yellow: #fbbf24  /* Reconciliation pending indicator */
--compliance-blue: #2563eb        /* Compliance status indicator */
```

### **Minimal Design Color Patterns (Updated 2025-01-30):**

```css
/* MINIMAL DESIGN PHILOSOPHY - NEUTRAL FOCUS */
/*
  New guidelines established for clean, professional appearance:
  - Remove ALL green status colors (use neutral gray instead)
  - Remove ALL star rating colors (use neutral gray)
  - Eliminate "instant booking" and unclear status text
  - Use only brand colors and neutral grays
*/

/* Status Badges - NEUTRAL ONLY */
--status-neutral-bg: #f3f4f6        /* Light gray backgrounds for all status badges */
--status-neutral-text: #6b7280      /* Medium gray text for all status */
--status-neutral-dot: #9ca3af       /* Gray dots for status indicators */

/* Rating System - NEUTRAL ONLY */
--rating-star-color: #9ca3af        /* Gray stars, no yellow/colored fills */
--rating-text-color: #6b7280        /* Gray text for rating numbers */

/* Card Elements - STANDARDIZED */
--card-height-standard: h-full       /* All cards same height using flexbox */
--card-content-padding: p-6          /* Consistent internal padding */
--card-border-color: #e5e7eb         /* Light gray borders only */
```

---

## 🎯 **MINIMAL DESIGN PATTERNS (NEW STANDARDS)**

### **Organization/Service Cards:**

```css
/* Clean card structure with standardized heights */
.organization-card {
  @apply h-full flex flex-col bg-white rounded-2xl border border-gray-100;
  @apply hover:shadow-xl hover:border-blue-200 transition-all duration-300;
}

.organization-card-content {
  @apply p-6 flex-grow flex flex-col;
}

/* Status badges - NEUTRAL ONLY */
.status-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-medium;
  @apply bg-gray-100 text-gray-600; /* NO GREEN - always neutral */
}

.status-indicator-dot {
  @apply w-2 h-2 bg-gray-400 rounded-full mr-2; /* NO GREEN - always gray */
}

/* Rating display - MINIMAL */
.rating-display {
  @apply flex items-center;
}

.rating-star {
  @apply h-4 w-4 text-gray-400; /* NO YELLOW/COLOR - always gray */
}

.rating-text {
  @apply text-sm text-gray-600 ml-1;
}
```

### **Filter Buttons:**

```css
/* Brand-colored selection with neutral unselected state */
.filter-button {
  @apply flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all;
}

.filter-button-selected {
  @apply text-white shadow-lg;
  background: var(--brand-gradient); /* Use brand gradient, not gray */
}

.filter-button-unselected {
  @apply bg-white text-gray-700 border border-gray-200;
  @apply hover:bg-gray-50 hover:border-gray-300;
}
```

### **Location Selectors:**

```css
/* Clean dropdown that matches input styling */
.location-dropdown {
  @apply relative;
}

.location-dropdown-button {
  @apply w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  @apply hover:border-gray-400 transition-colors;
}

.location-dropdown-menu {
  @apply absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg;
  @apply max-h-60 overflow-auto;
}

/* Only show for multi-location organizations */
.location-dropdown[data-single-location="true"] {
  @apply hidden;
}
```

### **Key Principles:**

1. **NO GREEN COLORS** - All status uses neutral gray (`bg-gray-100`, `text-gray-600`)
2. **NO COLORED STARS** - Ratings use `text-gray-400` (no fill, no yellow)
3. **STANDARDIZED HEIGHTS** - All cards use `h-full flex flex-col` with `flex-grow`
4. **CLEAR STATUS LANGUAGE** - Remove vague terms like "instant booking"
5. **BRAND COLORS ONLY** - Selected states use brand gradient, not arbitrary colors
6. **MINIMAL DROPDOWNS** - Clean styling that matches input components

---

## 🖼️ **TYPOGRAPHY SYSTEM**

### **Font Stack:**

```css
/* Primary font stack - optimized for professional readability */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
  "Helvetica Neue", Arial, sans-serif;

/* Fallback stack for maximum compatibility */
font-family: ui-sans-serif, system-ui, sans-serif;
```

### **Typography Scale - Marc Lou Optimized:**

```css
/* HERO HEADLINES - Marc Lou's 80/20 Rules Applied */
.hero-primary {
  font-size: 3.75rem; /* 60px - Marc's max recommendation */
  line-height: 1; /* Marc's tight line height */
  letter-spacing: -0.025em; /* Marc's -0.4px equivalent */
  font-weight: 700; /* Bold - Marc's minimum */
}

.hero-secondary {
  font-size: 3rem; /* 48px - Marc's h2 recommendation */
  line-height: 1;
  letter-spacing: -0.025em;
  font-weight: 700;
}

/* Mobile Hero Adjustments */
@media (max-width: 640px) {
  .hero-primary {
    font-size: 2.25rem; /* 36px - Marc's mobile sweet spot */
  }

  .hero-secondary {
    font-size: 2rem; /* 32px - Marc's mobile minimum */
  }
}

/* Standard Typography Scale */
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
} /* 12px - Small labels */
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
} /* 14px - Body small */
.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
} /* 16px - Body text */
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
} /* 18px - Large body */
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
} /* 20px - Small headings */
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
} /* 24px - Section headings */
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
} /* 30px - Page headings */
.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
} /* 36px - Hero headings mobile */
.text-5xl {
  font-size: 3rem;
  line-height: 1;
} /* 48px - Hero headings desktop */
.text-6xl {
  font-size: 3.75rem;
  line-height: 1;
} /* 60px - Primary hero desktop */

/* Marc Lou's Optimized Headline Classes */
.headline-hero-primary {
  @apply text-4xl sm:text-5xl lg:text-6xl font-bold leading-none tracking-tight;
}

.headline-hero-secondary {
  @apply text-4xl sm:text-5xl font-bold leading-none tracking-tight;
}

.headline-section {
  @apply text-3xl sm:text-4xl font-bold leading-tight;
}

/* Font Weights */
.font-normal {
  font-weight: 400;
} /* Regular text */
.font-medium {
  font-weight: 500;
} /* Emphasized text */
.font-semibold {
  font-weight: 600;
} /* Headings */
.font-bold {
  font-weight: 700;
} /* Strong emphasis - Marc's minimum for headlines */
```

---

## 📏 **SPACING SYSTEM - Marc Lou's Semantic Approach**

### **Marc Lou's 4-Point Grid System:**

Every space (margin or padding) between elements should be divisible by 4. This helps users understand how components relate to each other and provides a shortcut to designing faster.

```css
/* Marc Lou's Semantic Spacing Rules */
.spacing-headline-to-paragraph {
  margin-top: 1rem; /* 16px - Headlines to descriptions */
}

.spacing-text-to-button {
  margin-top: 2rem; /* 32px - Text blocks to CTAs */
}

.spacing-text-to-image {
  margin-top: 3rem; /* 48px - Text blocks to images */
}

.spacing-section-to-section {
  padding: 16rem 0; /* 256px - Major section separation */
}

/* Breathing Room - "When in doubt, add too much empty space" */
.section-major {
  @apply py-64; /* 256px - Hero, main features, CTA sections */
}

.section-standard {
  @apply py-20; /* 80px - Secondary sections */
}

.section-minor {
  @apply py-12; /* 48px - Tight sections, FAQs */
}

/* Component Spacing Standards */
.hero-element-spacing {
  @apply space-y-4; /* 16px between hero elements */
}

.hero-cta-spacing {
  @apply pt-8; /* 32px from text to buttons */
}

.section-header-spacing {
  @apply mb-16; /* 64px below section headers */
}
```

### **Spacing Relationship Rules:**

1. **Paragraph to headline**: 16px (shows description relationship)
2. **Button to text block**: 32px (clear action separation)
3. **Image to text block**: 48px (visual content separation)
4. **Section to section**: 256px (major content boundaries)

### **Limited Constraints Principle:**

Use only 5-6 spacing rules maximum across the entire landing page for clarity and consistency.

---

## 📝 **MARC LOU'S HEADLINE PRINCIPLES**

### **The 80/20 Rules for Headlines:**

Based on [Marc Lou's design principles](https://newsletter.marclou.com/p/design-beautiful-headlines-to-sell-your-micro-saas) that generated $1M+ in sales:

#### **1. Make it Big (but not too big)**

- **Desktop**: 36px-60px sweet spot (`text-4xl` to `text-6xl`)
- **Mobile**: 32px-40px (`text-3xl` to `text-4xl`)
- **Never exceed**: 60px (avoid `text-7xl` and above)

#### **2. Make it Bold**

- **Minimum**: `font-bold` (700)
- **Sweet spot**: 700-900 weight
- **Consistency**: Pick one weight and use everywhere

#### **3. Make it Tight**

- **Letter spacing**: `tracking-tight` (-0.025em ≈ -0.4px)
- **Line height**: `leading-none` (1.0) for headlines
- **Readability**: Compact text is easier to read

#### **4. Make it Light (Character Count)**

- **Maximum**: 70 characters per headline
- **Break lines**: At semantic points, not visual ones
- **Line limit**: Avoid more than 2 lines

#### **5. Make it Pop (Contrast)**

- **Use**: Highest contrast color (our brand gradient)
- **Avoid**: Multiple colors that conflict with CTAs
- **Highlight**: Use primary color for numbers only

#### **6. Use Responsibly (Structure)**

- **One headline per section** - never 0, never 2
- **Section structure**: 1 headline + 1 paragraph + 1 image + 1 button
- **Hierarchy**: Clear visual relationship between elements

### **Implementation Examples:**

```css
/* ✅ GOOD - Marc Lou Optimized */
.hero-headline {
  @apply text-4xl sm:text-5xl lg:text-6xl font-bold leading-none tracking-tight;
  /* 36px → 48px → 60px, tight spacing, bold weight */
}

.section-headline {
  @apply text-4xl sm:text-5xl font-bold leading-none tracking-tight;
  /* Secondary hierarchy, consistent styling */
}

/* ❌ BAD - Common Mistakes */
.bad-headline {
  @apply text-7xl font-normal leading-relaxed;
  /* Too big, too light, too loose */
}
```

### **Mobile Responsiveness:**

All rules work on mobile except font size - make headlines smaller:

- **Desktop `text-6xl`** → **Mobile `text-4xl`**
- **Desktop `text-5xl`** → **Mobile `text-3xl`**
- Keep all other properties (weight, spacing, line-height) consistent

---

## 🧩 **COMPONENT DESIGN PATTERNS**

### **Professional Booking Components:**

#### **1. Client Lookup Card**

```css
.client-lookup-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.client-lookup-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #61baff;
}
```

#### **2. Cash Payment Indicator**

```css
.cash-payment-badge {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.cash-payment-badge::before {
  content: "💵";
  font-size: 1rem;
}
```

#### **3. Professional Service Card**

```css
.professional-service-card {
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.professional-service-card:hover {
  border-color: #61baff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(97, 186, 255, 0.15);
}

.professional-service-card.selected {
  border-color: #5e8bf4;
  background: linear-gradient(
    135deg,
    rgba(94, 139, 244, 0.05) 0%,
    rgba(97, 186, 255, 0.05) 100%
  );
}
```

### **Interactive States:**

#### **Button System:**

```css
/* Primary Action Buttons */
.btn-primary {
  background: var(--brand-gradient);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--brand-gradient-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(94, 139, 244, 0.3);
}

.btn-primary:active {
  background: var(--brand-gradient-pressed);
  transform: translateY(0);
}

/* Cash Payment Buttons */
.btn-cash {
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-cash:hover {
  background: #15803d;
  transform: translateY(-1px);
}

/* Secondary Buttons */
.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}
```

---

## 📱 **RESPONSIVE DESIGN GUIDELINES**

### **Breakpoint System:**

```css
/* Mobile First Approach */
/* Default: Mobile (320px+) */

@media (min-width: 640px) {
  /* sm - Small tablets */
}
@media (min-width: 768px) {
  /* md - Tablets */
}
@media (min-width: 1024px) {
  /* lg - Laptops */
}
@media (min-width: 1280px) {
  /* xl - Desktops */
}
@media (min-width: 1536px) {
  /* 2xl - Large desktops */
}
```

### **Professional Mobile Optimization:**

- **Touch Targets**: Minimum 44px for professional on-the-go use
- **Text Size**: Minimum 16px to prevent zoom on mobile
- **Form Spacing**: Generous padding for accurate touch input
- **Navigation**: Bottom tab bar for thumb-friendly professional tools

---

## 🎭 **ANIMATION & TRANSITIONS**

### **Standard Timing Functions:**

```css
/* Smooth easing for professional feel */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-slow: cubic-bezier(0.25, 0.1, 0.25, 1);

/* Standard durations */
--duration-fast: 150ms; /* Quick feedback */
--duration-normal: 300ms; /* Standard transitions */
--duration-slow: 500ms; /* Complex animations */
```

### **Professional Booking Animations:**

```css
/* Expandable service descriptions */
.service-description-enter {
  animation: expandDown 300ms var(--ease-smooth);
}

@keyframes expandDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 200px;
    transform: translateY(0);
  }
}

/* Cash payment confirmation */
.cash-payment-success {
  animation: cashSuccess 600ms var(--ease-bounce);
}

@keyframes cashSuccess {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

---

## 💼 **PROFESSIONAL FEATURES STYLING**

### **Cash Management Dashboard:**

```css
.cash-dashboard-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cash-balance-display {
  font-size: 2.25rem;
  font-weight: 700;
  color: #16a34a;
  font-variant-numeric: tabular-nums;
}

.reconciliation-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 0.875rem;
  font-weight: 500;
}

.reconciliation-status.pending {
  background: #fef3c7;
  color: #92400e;
}

.reconciliation-status.complete {
  background: #d1fae5;
  color: #065f46;
}
```

### **Professional Booking Interface:**

```css
.professional-booking-interface {
  background: #fafbfc;
  min-height: 100vh;
  padding: 16px;
}

.booking-step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}

.booking-step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin: 0 8px;
  transition: all 0.3s ease;
}

.booking-step.active {
  background: var(--brand-gradient);
  color: white;
}

.booking-step.completed {
  background: #16a34a;
  color: white;
}

.booking-step.pending {
  background: #e5e7eb;
  color: #6b7280;
}
```

---

## 🛡️ **ACCESSIBILITY STANDARDS**

### **WCAG 2.1 AA Compliance:**

- **Color Contrast**: 4.5:1 minimum for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Tab order and keyboard shortcuts

### **Professional Accessibility Features:**

```css
/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --brand-primary-start: #1e40af;
    --brand-primary-end: #1d4ed8;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus indicators */
.focus-ring {
  outline: 2px solid #61baff;
  outline-offset: 2px;
}
```

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **Design System Compliance:**

- [ ] **Color Usage**: Only approved colors from the blue spectrum
- [ ] **Typography**: Consistent font weights and sizes
- [ ] **Component Patterns**: Reusable component library
- [ ] **Responsive Design**: Mobile-first approach
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Animation**: Smooth, professional transitions
- [ ] **Professional Features**: Cash payment and booking management styling

### **Brand Consistency:**

- [ ] **Visual Hierarchy**: Clear information architecture
- [ ] **Professional Trust**: Sophisticated, reliable appearance
- [ ] **User Experience**: Intuitive and efficient workflows
- [ ] **Mobile Excellence**: Optimized for professional mobile use
- [ ] **Accessibility**: Inclusive design for all users

---

## 🎯 **DESIGN PRINCIPLES FOR PROFESSIONAL FEATURES**

### **Cash Payment System Design:**

1. **Trust Indicators**: Clear visual cues for secure transactions
2. **Professional Efficiency**: Streamlined workflows for busy professionals
3. **Compliance Clarity**: Obvious status indicators for financial compliance
4. **Error Prevention**: Clear validation and confirmation steps

### **Professional Booking Interface:**

1. **Speed Optimization**: Minimal steps for quick booking creation
2. **Client Focus**: Clear display of client information and preferences
3. **Service Clarity**: Easy service selection with clear pricing
4. **Payment Flexibility**: Clear options for different payment methods

---

## 🌟 **LOADING INDICATORS - LOGO-BASED SYSTEM**

_Updated: 2025-01-30 - Unified Logo Loading Implementation_

### **Overview**

All loading indicators across the application now use the Unbooked logo with professional animations. This creates consistent branding and a cohesive user experience while maintaining excellent performance.

### **Logo Loading Components:**

#### **1. FullPageLogoLoader - Major Page Transitions**

```typescript
<FullPageLogoLoader message="Loading your dashboard..." />
```

- **Use Case**: Dashboard loading, initial app loading, major navigation
- **Size**: Large (96px)
- **Background**: Full screen with gray-50 background
- **Animation**: Pulse (2s)

#### **2. CenteredLogoLoader - Section Loading**

```typescript
<CenteredLogoLoader message="Loading services..." size="medium" />
```

- **Use Case**: Form submissions, data fetching, modal content
- **Size**: Medium (80px) or customizable
- **Background**: Centered with padding
- **Animation**: Pulse (2s)

#### **3. InlineLogoLoader - Component Loading**

```typescript
<InlineLogoLoader size="small" />
```

- **Use Case**: Button loading states, inline updates, small components
- **Size**: Small (48px)
- **Background**: Inline/minimal footprint
- **Animation**: Pulse (2s)

### **Animation Specifications:**

#### **Pulse Animation (Primary)**

```css
@keyframes logo-pulse {
  0% {
    opacity: 0.4;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.4;
    transform: scale(0.95);
  }
}
```

- **Duration**: 2 seconds
- **Timing**: ease-in-out infinite
- **Use**: Default for all loading states

#### **Breathe Animation (Alternative)**

```css
@keyframes logo-breathe {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}
```

- **Duration**: 3 seconds
- **Timing**: ease-in-out infinite
- **Use**: Alternative for subtle contexts

### **Implementation Standards:**

#### **Size Classes:**

```typescript
const sizeClasses = {
  small: "w-12 h-12", // 48px - Buttons, inline loading
  medium: "w-20 h-20", // 80px - Section loading, modals
  large: "w-24 h-24", // 96px - Full page loading
};
```

#### **Message Typography:**

- **Font**: System font stack (inherited)
- **Weight**: font-medium (500)
- **Color**: text-gray-600
- **Spacing**: mt-4 (16px margin top)
- **Alignment**: center

#### **Performance Features:**

- ✅ **GPU Acceleration**: Hardware-accelerated transforms
- ✅ **Image Optimization**: Next.js Image with priority loading
- ✅ **Drop Shadow**: Subtle drop-shadow-lg for depth
- ✅ **Reduced Motion**: Respects user accessibility preferences

### **Migration from Old Loading Indicators:**

#### **Before (Deprecated):**

```typescript
// ❌ Old spinner-based loading
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
<p>Loading...</p>

// ❌ Old LoadingSpinner with pixel sizes
<LoadingSpinner size="h-6 w-6" className="mr-2" />
```

#### **After (Current Standard):**

```typescript
// ✅ New logo-based loading
<CenteredLogoLoader message="Loading data..." />

// ✅ Updated LoadingSpinner with semantic sizes
<LoadingSpinner size="medium" />
```

### **Accessibility Features:**

#### **Screen Reader Support:**

- **Alt Text**: "Loading..." for screen readers
- **ARIA Labels**: Proper loading state communication
- **Focus Management**: Non-disruptive to keyboard navigation

#### **Motion Preferences:**

- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Performance**: 60fps animations with efficient CPU usage
- **Battery Conscious**: Optimized for mobile devices

### **Usage Guidelines:**

#### **Do's ✅:**

- Use appropriate size for context (small for buttons, large for pages)
- Include descriptive messages for longer loading operations
- Maintain consistent animation style across the application
- Test loading states on slower devices

#### **Don'ts ❌:**

- Mix logo loading with old spinner styles
- Use loading indicators for operations under 300ms
- Forget to include loading states in error boundaries
- Override animations without accessibility considerations

### **Component Integration:**

#### **With Error Boundaries:**

```typescript
<DataLoadingErrorBoundary>
  {loading ? (
    <CenteredLogoLoader message="Loading analytics..." />
  ) : (
    <AnalyticsContent />
  )}
</DataLoadingErrorBoundary>
```

#### **In Button Components:**

```typescript
<LoadingButton loading={isSubmitting}>
  {isSubmitting ? "Processing..." : "Submit Order"}
</LoadingButton>
```

### **Brand Consistency Benefits:**

1. **Professional Identity**: Reinforces brand recognition during wait times
2. **Trust Building**: Consistent logo exposure builds user confidence
3. **Quality Perception**: Smooth animations reflect attention to detail
4. **User Experience**: Predictable loading patterns reduce perceived wait time

**This logo-based loading system ensures consistent, professional, and accessible user experiences across all Unbooked features while strengthening brand identity and user trust.**
