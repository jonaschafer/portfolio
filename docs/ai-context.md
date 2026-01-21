# AI Context - Project Memory

This file serves as persistent memory for Cursor AI across chat sessions. Update it when making important decisions, architectural choices, or when project state changes significantly.

## Project Overview

**What is this project?**
- [Brief description of the project and its purpose]

**Tech Stack:**
- [List key technologies, frameworks, libraries]

**Key Dependencies:**
- [Important packages or services the project relies on]

## Key Decisions

### Architecture Decisions
- [Date] - [Decision]: [Reasoning]
  - Example: "2024-01-15 - Chose Next.js over plain React: Need SSR for SEO and better performance"

### Design Patterns
- [Pattern used]: [Why it was chosen]
  - Example: "Component composition pattern: Allows for flexible, reusable UI components"

### Tooling Choices
- [Tool]: [Why it was chosen]
  - Example: "Tailwind CSS: Rapid development with utility-first approach"

## Architecture Notes

### Project Structure
```
[Brief overview of how the codebase is organized]
```

### Important Patterns
- [Pattern name]: [Description and where it's used]
  - Example: "Custom hooks pattern: All data fetching logic lives in hooks/ directory"

### Key Files/Directories
- `[path]`: [What it does and why it's important]
  - Example: "`lib/api.js`: Central API client with authentication handling"

## Current State

### What's Working
- [Feature/component]: [Status and notes]
  - Example: "User authentication: Fully functional, using Supabase Auth"

### In Progress
- [Feature/component]: [Current status]
  - Example: "Dashboard redesign: 60% complete, need to finish responsive layout"

### Known Issues
- [Issue]: [Impact and potential solutions]
  - Example: "Slow API response on mobile: Investigating caching strategy"

### Recent Changes
- [Date] - [Change]: [Impact]
  - Example: "2024-01-20 - Migrated to new API version: All endpoints updated, breaking changes handled"

## Important Context

### Domain Knowledge
- [Business rule or domain concept]: [Explanation]
  - Example: "User roles: Admin, Editor, Viewer. Only Admins can delete content."

### Edge Cases
- [Edge case]: [How it's handled]
  - Example: "Empty state handling: All lists show helpful empty state messages with CTAs"

### Environment Variables
- `[VAR_NAME]`: [Purpose and where it's used]
  - Example: "`NEXT_PUBLIC_API_URL`: Base URL for all API calls, set in Vercel dashboard"

### External Services
- [Service]: [How it's integrated and what it's used for]
  - Example: "Supabase: Database and auth. Connection config in `lib/supabase.js`"

## Notes for Future Sessions

- [Any important reminders or context for future work]
  - Example: "Remember: Always run tests before deploying. Test suite located in `__tests__/`"

---

**Last Updated:** [Date]
**Maintained By:** [Your name/team]
