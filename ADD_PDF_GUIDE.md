# Guide: How to Add New PDF Lab Manuals

This guide will help you add new PDF lab manuals to your application.

## Step 1: Add the PDF File

1. Place your PDF file in the `public/lab-manuals/` folder
2. Name the file using a simple, lowercase format with hyphens (e.g., `my-new-experiment.pdf`)
   - ✅ Good: `transistor-analysis.pdf`, `op-amp-circuits.pdf`
   - ❌ Bad: `My New Experiment.pdf`, `transistor_analysis.pdf`

## Step 2: Add Experiment Entry

Edit `app/experiments/page.tsx` and add a new entry to the `experiments` array:

```typescript
{
  id: "my-new-experiment",           // Unique ID (matches PDF filename without .pdf)
  title: "My New Experiment",         // Display title
  description: "Description of the experiment...",
  difficulty: "Beginner",             // "Beginner", "Intermediate", or "Advanced"
  duration: "60 min",                 // Estimated duration
  category: "Circuit Analysis",       // Category name
  participants: 0,                    // Number of participants (can start at 0)
  image: "/virtual-circuit-board-with-electronic-components-a.jpg", // Image path
  hasLabManual: true,                 // Set to true if PDF exists
  manualId: "my-new-experiment",      // Must match the PDF filename (without .pdf)
},
```

## Step 3: Add Manual Metadata

Edit `app/lab-manuals/[id]/page.tsx` and add an entry to the `manualMetadata` object:

```typescript
"my-new-experiment": {
  title: "My New Experiment - Full Title",
  description: "Comprehensive lab manual description...",
},
```

The key (e.g., `"my-new-experiment"`) must match:
- The `id` in the experiments array
- The `manualId` in the experiments array
- The PDF filename (without `.pdf`)

## Step 4: (Optional) Add Experiment Detail Page

If you want a detailed experiment page, edit `app/experiments/[id]/page.tsx` and add an entry to the `getExperiment` function.

## Example: Adding "Transistor Analysis" PDF

### 1. Add PDF file:
- File: `public/lab-manuals/transistor-analysis.pdf`

### 2. Add to `app/experiments/page.tsx`:
```typescript
{
  id: "transistor-analysis",
  title: "Transistor Analysis",
  description: "Learn how to analyze transistor circuits and understand their operation.",
  difficulty: "Intermediate",
  duration: "90 min",
  category: "Circuit Analysis",
  participants: 0,
  image: "/transistor-switch-circuit.jpg",
  hasLabManual: true,
  manualId: "transistor-analysis",
},
```

### 3. Add to `app/lab-manuals/[id]/page.tsx`:
```typescript
"transistor-analysis": {
  title: "Transistor Analysis - Bipolar Junction Transistors",
  description: "Comprehensive lab manual for analyzing BJT circuits and understanding transistor operation principles.",
},
```

## Quick Checklist

- [ ] PDF file added to `public/lab-manuals/` with correct naming
- [ ] Experiment added to `app/experiments/page.tsx`
- [ ] Metadata added to `app/lab-manuals/[id]/page.tsx`
- [ ] All IDs match (experiment id, manualId, and PDF filename)
- [ ] Test by visiting `/lab-manuals/your-experiment-id`

## Notes

- PDF filenames should be lowercase with hyphens (no spaces or special characters)
- The `manualId` must exactly match the PDF filename (without `.pdf`)
- You can use any image from the `public/` folder for the experiment card
- Categories can be: "Control Systems", "Circuit Analysis", or create new ones

