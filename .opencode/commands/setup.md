---
description: Onboard your profile into the AI job search framework. Reads documents/ folder, imports a CV, or walks through an interview to build your candidate profile.
---

You are running the onboarding setup for the AI Job Search framework. Your goal is to collect the user's professional information and populate all profile files so the `/apply` workflow works out of the box.

There are three paths into setup. Step 0 picks the right one; all three converge on Step 3 (file generation) and Step 4 (confirmation).

---

## Step 0: Welcome & Choose Path

If `$ARGUMENTS` contains `--section <name>`, skip directly to that section in Path C for an update-only flow. Do not run the path-selection prompt below.

Otherwise, before greeting the user, scan the `documents/` folder. Use Glob with `documents/**/*` and count files per subfolder (`cv/`, `linkedin/`, `diplomas/`, `references/`, `applications/`).

Then welcome the user with a single message listing three paths.

**If `documents/` has files** in one or more subfolders, lead with Path A:
- Path A: Read documents folder (recommended)
- Path B: Single CV import
- Path C: Interview mode

**If `documents/` is empty or missing**, lead with Path A as an option:

---

## Path A: Documents Folder

### Step A1: Inventory
### Step A2: Read Existing Skill Files
Read these in parallel:
- `.opencode/skills/job-application-assistant/01-candidate-profile.md`
- `.opencode/skills/job-application-assistant/02-behavioral-profile.md`
- `.opencode/skills/job-application-assistant/03-writing-style.md`
- `.opencode/skills/job-application-assistant/04-job-evaluation.md`
- `.opencode/skills/job-application-assistant/05-cv-templates.md`
- `.opencode/skills/job-application-assistant/06-cover-letter-templates.md`
- `.opencode/skills/job-application-assistant/07-interview-prep.md`

### Step A3: Parse Documents
### Step A4: Cross-Reference Check
### Step A5: Build Change Sets
### Step A6: Present and Confirm Changes
### Step A7: Write Confirmed Changes and Fill Gaps

---

## Path B: Single CV Import

Extract structured information from the user's CV.

---

## Path C: Interview Mode

Walk through each section conversationally:

### Section 1: Identity & Contact
### Section 2: Education
### Section 3: Professional Experience
### Section 4: Technical Skills
### Section 5: Publications & Awards (optional)
### Section 6: Behavioral Profile (optional)
### Section 7: Career Goals & Preferences
### Section 8: References (optional)
### Section 9: Job Search Configuration

---

## Step 3: Generate Profile Files

### 1. Update `AGENTS.md`
### 2. Populate `01-candidate-profile.md`
### 3. Populate `02-behavioral-profile.md`
### 4. Update `04-job-evaluation.md`
### 5. Update `05-cv-templates.md`
### 6. Update `07-interview-prep.md`
### 7. Update `cv/main_example.tex`
### 8. Generate search queries

---

## Step 4: Confirm & Next Steps

Present a summary and suggest running `/scrape` and `/apply`.
