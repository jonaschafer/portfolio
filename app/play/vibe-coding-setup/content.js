// Content sections for the vibe-coding-setup wiki
export const sections = [
  {
    id: 'intro',
    title: 'Get the vibes right (man).',
    content: (
      <>
        <p>
          This guide will walk you through setting up everything you need to start vibe coding with Figma designs.
          Vibe coding is about creating a seamless workflow between design and development, allowing you to quickly
          translate Figma designs into working code with the help of AI-powered tools.
        </p>
        <p>
          By the end of this tutorial, you'll have a complete development environment that connects Figma, Cursor,
          GitHub, and Vercel into a cohesive workflow. We'll also cover Supabase (optional) if you need backend functionality.
        </p>
      </>
    )
  },
  {
    id: 'prerequisites',
    title: 'Prerequisites',
    content: (
      <>
        <p>Before you begin, make sure you have the following accounts and software ready:</p>
        
        <h3>Required Accounts</h3>
        <ul>
          <li><strong>GitHub account</strong> - For version control and repository hosting</li>
          <li><strong>Vercel account</strong> - For deployment and hosting (free tier available)</li>
          <li><strong>Supabase account (optional)</strong> - For backend services if you need a database or authentication (free tier available)</li>
          <li><strong>Figma account</strong> - For design files (free tier available)</li>
        </ul>

        <h3>Required Software</h3>
        <ul>
          <li><strong>Cursor</strong> - AI-powered code editor (download from cursor.sh)</li>
          <li><strong>Node.js (optional)</strong> - Version 18 or higher (only needed if you're using Next.js or React)</li>
        </ul>
      </>
    )
  },
  {
    id: 'github-repository-setup',
    title: 'GitHub Repository Setup',
    content: (
      <>
        <p>
          GitHub will serve as your version control system and the source of truth for your code.
          It also integrates seamlessly with Vercel for automatic deployments.
        </p>

        <h3>Creating a New Repository</h3>
        <ol>
          <li>Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">github.com/new</a></li>
          <li>Choose a repository name (e.g., "my-vibe-project")</li>
          <li>Set it to Public or Private based on your preference</li>
          <li>Initialize with a README if you want a starting point</li>
          <li>Click "Create repository"</li>
        </ol>

        <h3>Connecting GitHub to Cursor via MCP</h3>
        <p>Once you have your repository, connect it to Cursor so you can work with it directly:</p>
        <ol>
          <li>In Cursor, open Settings (Cmd/Ctrl + ,)</li>
          <li>Navigate to "Features" → "Model Context Protocol"</li>
          <li>Click "Add Server" or edit existing configuration</li>
          <li>Add the GitHub MCP server configuration</li>
        </ol>

        <p>You'll need a GitHub Personal Access Token. Ask Cursor to help you create one, or follow these steps:</p>
        <ol>
          <li>Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)</li>
          <li>Click "Generate new token (classic)"</li>
          <li>Give it a name (e.g., "Cursor MCP")</li>
          <li>Select scopes: <code>repo</code>, <code>read:org</code>, <code>read:user</code></li>
          <li>Generate and copy the token</li>
          <li>Add it to Cursor's MCP configuration</li>
        </ol>

        <p>Example GitHub MCP configuration (Cursor can help you set this up):</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-token-here"
      }
    }
  }
}`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <p><strong>Pro tip:</strong> Instead of manually cloning repositories, ask Cursor to help you clone your GitHub repo.
        Just paste the repository URL and ask Cursor to clone it for you.</p>
      </>
    )
  },
  {
    id: 'vercel-deployment',
    title: 'Vercel Deployment',
    content: (
      <>
        <p>
          Vercel provides seamless deployment from GitHub with automatic previews for every push.
          It works with different types of projects, and it's important to understand the differences.
        </p>

        <h3>Understanding Project Types</h3>
        <p>Vercel can deploy different kinds of projects:</p>
        <ul>
          <li><strong>Static Sites</strong> - Simple HTML, CSS, and JavaScript files. No server needed.
          Perfect for landing pages, portfolios, or simple websites. Just upload your files and they're live.</li>
          <li><strong>React Apps</strong> - Interactive web applications built with React. These need to be built
          (compiled) before deployment. Vercel handles this automatically.</li>
          <li><strong>Next.js Apps</strong> - A framework built on React that adds features like server-side rendering,
          routing, and API routes. Next.js projects can be more complex but offer more features out of the box.</li>
        </ul>

        <p>For vibe coding, you can start with a simple static site (just HTML/CSS/JS) or jump into Next.js if you want
        more features. Cursor can help you decide which is right for your project.</p>

        <h3>Connecting GitHub Repository</h3>
        <ol>
          <li>Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a> and sign in with GitHub</li>
          <li>Click "Add New Project"</li>
          <li>Select your GitHub repository from the list</li>
          <li>Vercel will auto-detect your project type (Next.js, React, or static site)</li>
          <li>Click "Deploy"</li>
        </ol>

        <h3>Environment Variables</h3>
        <p>If your project needs API keys or other secrets (like Supabase keys), you'll need to add them as environment variables.
        Instead of doing this manually, ask Cursor to help you set up environment variables. Just tell Cursor what keys you need,
        and it can guide you through the process or even help you create the configuration files.</p>

        <p>In Vercel dashboard:</p>
        <ol>
          <li>Go to your project settings</li>
          <li>Navigate to "Environment Variables"</li>
          <li>Add variables for each environment (Production, Preview, Development)</li>
        </ol>

        <p>Then access them in your code (Cursor can help you with this syntax):</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`// Next.js
const apiKey = process.env.NEXT_PUBLIC_API_KEY;`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <h3>Deployment Process</h3>
        <p>Once connected, every push to your main branch triggers a production deployment.
        Pull requests get preview deployments automatically. You'll receive:</p>
        <ul>
          <li>Production URL: <code>your-project.vercel.app</code></li>
          <li>Preview URLs: <code>your-project-git-branch.vercel.app</code></li>
          <li>Deployment status notifications</li>
        </ul>
      </>
    )
  },
  {
    id: 'custom-domain-setup',
    title: 'Custom Domain Setup',
    content: (
      <>
        <p>
          Adding a custom domain gives your project a professional URL and makes it easier to share.
          This is completely optional - your Vercel URL works perfectly fine.
        </p>

        <h3>DNS Configuration</h3>
        <p>In your domain registrar (where you bought your domain):</p>
        <ol>
          <li>Add a CNAME record pointing to <code>cname.vercel-dns.com</code></li>
          <li>Or add A records pointing to Vercel's IP addresses (if CNAME not supported)</li>
          <li>Wait for DNS propagation (can take up to 48 hours, usually much faster)</li>
        </ol>

        <h3>Vercel Domain Settings</h3>
        <ol>
          <li>In Vercel dashboard, go to your project settings</li>
          <li>Navigate to "Domains"</li>
          <li>Enter your domain name (e.g., <code>example.com</code> or <code>www.example.com</code>)</li>
          <li>Vercel will verify DNS configuration</li>
          <li>Once verified, your site will be live on your custom domain</li>
        </ol>
      </>
    )
  },
  {
    id: 'figma-mcp-setup',
    title: 'Connecting Figma to Cursor',
    content: (
      <>
        <p>
          The Figma MCP (Model Context Protocol) server allows Cursor to access your Figma designs,
          extract design details, and generate code based on your designs. This is the magic that makes vibe coding work.
        </p>

        <h3>Getting Your Figma Personal Access Token</h3>
        <p>First, you need to create a token that lets Cursor access your Figma files:</p>
        <ol>
          <li>Open Figma (desktop app or web)</li>
          <li>Go to Figma → Settings → Account</li>
          <li>Scroll down to "Personal access tokens"</li>
          <li>Click "Create new token"</li>
          <li>Give it a name (e.g., "Cursor MCP")</li>
          <li><strong>Copy the token immediately</strong> - you won't be able to see it again!</li>
        </ol>

        <h3>Configuring Figma MCP in Cursor</h3>
        <p>Now let's connect it to Cursor:</p>
        <ol>
          <li>Open Cursor settings (Cmd/Ctrl + ,)</li>
          <li>Navigate to "Features" → "Model Context Protocol"</li>
          <li>Click "Add Server" or edit existing configuration</li>
          <li>Add the Figma MCP server configuration</li>
        </ol>

        <p>You'll need to add configuration that looks like this (Cursor can help you set this up if you ask):</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-figma"
      ],
      "env": {
        "FIGMA_PERSONAL_ACCESS_TOKEN": "paste-your-token-here"
      }
    }
  }
}`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <h3>Sharing Your Figma File</h3>
        <p>For Cursor to access your designs, your Figma file needs to be accessible:</p>
        <ol>
          <li>Open your Figma file</li>
          <li>Click "Share" in the top right</li>
          <li>Set permissions to "Can view" (this is enough for MCP access)</li>
          <li>Copy the file URL - you can paste this in Cursor when asking about designs</li>
        </ol>

        <h3>Testing the Connection</h3>
        <p>Once configured, test the connection in Cursor:</p>
        <ul>
          <li>Open a chat in Cursor</li>
          <li>Paste a Figma URL and ask: "Can you access this Figma design?"</li>
          <li>Or try: "Get the design context for this Figma file" (with the URL)</li>
          <li>If working, Cursor should be able to describe your designs and extract design details</li>
        </ul>

        <p><strong>Troubleshooting:</strong> If it's not working, make sure your Figma file is shared (even if just with "Can view" permission)
        and that you've restarted Cursor after adding the MCP configuration.</p>
      </>
    )
  },
  {
    id: 'cursor-setup',
    title: 'Cursor Setup',
    content: (
      <>
        <p>
          Cursor is an AI-powered code editor that integrates with Figma, GitHub, and other tools
          to streamline your development workflow. This is where the magic happens.
        </p>

        <h3>Installing Cursor</h3>
        <ol>
          <li>Go to <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer">cursor.sh</a></li>
          <li>Download for your operating system (macOS, Windows, Linux)</li>
          <li>Install the application</li>
          <li>Open Cursor and sign in (or create an account)</li>
        </ol>

        <p>That's it! Cursor comes ready to use. You can start asking it questions and writing code right away.</p>
      </>
    )
  },
  {
    id: 'cursor-memory-context',
    title: 'Cursor Memory & Context Management',
    content: (
      <>
        <p>
          Cursor has a limited context window—the amount of information it can "see" in a single conversation.
          Without proper memory management, you'll find yourself repeating information, losing important context
          between sessions, and hitting token limits. This section shows you how to set up persistent memory
          that survives across sessions and how to monitor your context usage effectively.
        </p>

        <h3>Why Persistent Memory Matters</h3>
        <p>
          Every Cursor conversation has a context limit (typically 1M tokens for premium plans, less for free).
          Once you hit this limit, Cursor can't see earlier parts of the conversation. More importantly, when you
          start a new chat session, Cursor forgets everything from previous sessions unless you explicitly tell it
          to read certain files. By creating structured context files and configuring Cursor to reference them,
          you ensure important decisions, architecture choices, and project state persist across sessions.
        </p>

        <h3>How .cursorrules Works</h3>
        <p>
          <code>.cursorrules</code> is a special file that Cursor automatically reads when it starts working in your project.
          Think of it as instructions that tell Cursor how to behave in your codebase. When you create a <code>.cursorrules</code>
          file in your project root, Cursor reads it automatically—no configuration needed.
        </p>
        <p>
          The file contains plain text rules that guide Cursor's behavior. For persistent memory, you'll add rules that tell
          Cursor to read <code>docs/ai-context.md</code> at the start of sessions and update it when you make important decisions.
        </p>
        <p>
          <strong>Important:</strong> Cursor automatically detects and reads <code>.cursorrules</code> from your project root.
          Just create the file, and Cursor will use it. No settings, no configuration—it just works.
        </p>

        <h3>Repeatable Setup Framework</h3>
        <p>
          <strong>Important:</strong> Simply telling Cursor to "create the files" isn't enough. You need to provide a prompt
          that includes the actual rules and content. Here's a repeatable framework you can use for any project:
        </p>

        <h4>Step 1: Set Up .cursorrules</h4>
        <p>Copy and paste this prompt into Cursor:</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`Create a \`.cursorrules\` file in the project root with the following content:

# Cursor Rules for Persistent Memory

## Automatic Session Kickoff

- At the start of EVERY new chat session, automatically read \`docs/ai-context.md\` to understand project context before responding
- If \`docs/ai-context.md\` doesn't exist, offer to create it with a starter template
- Reference information from \`docs/ai-context.md\` when making suggestions or answering questions

## Automatic Context Updates

You MUST automatically update \`docs/ai-context.md\` in the following situations:

- **Architectural decisions**: When the user makes or you suggest architectural choices (framework selection, design patterns, project structure changes)
- **New patterns introduced**: When establishing new coding patterns, conventions, or approaches that should be reused
- **Important problem solutions**: When solving complex problems that required significant reasoning or decisions
- **Project state changes**: When completing major features, fixing critical bugs, or making changes that affect project state
- **Key decisions**: When the user makes decisions about tools, libraries, or approaches that impact the project

**When NOT to update:**
- Small bug fixes or minor changes
- Routine code additions that don't introduce new patterns
- Temporary workarounds
- Code that's self-documenting through comments

**How to update:**
- Read the current \`docs/ai-context.md\` first
- Add entries in the appropriate sections with date and reasoning
- Keep entries concise and focused on decisions, not implementation details
- Update the "Last Updated" date at the bottom

## Context Management

- Before starting major refactors or new features, read \`docs/ai-context.md\` to ensure alignment with existing decisions
- When context is getting full (80%+ token usage), proactively suggest starting a new chat session
- Monitor for warning signs: model repetition, forgetting recent decisions, generic responses
- When you notice context exhaustion, suggest: "Context is getting full. Let's start a new chat—I'll read \`ai-context.md\` to catch up."

## File References

- ALWAYS prefer referencing specific files over pasting large code blocks in chat
- Use file paths and line numbers when discussing code changes (format: \`path/to/file.js:12:45\`)
- When code is needed, reference the file and ask if the user wants you to read it, rather than pasting it

## Context File Maintenance

- Keep \`docs/ai-context.md\` focused on essential information: decisions, architecture, current state
- Don't duplicate information that belongs in code comments or documentation
- Structure updates clearly with dates and reasoning
- For team projects: Treat \`docs/ai-context.md\` as a handoff document—ensure it's comprehensive enough for new team members`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <h4>Step 2: Set Up docs/ai-context.md</h4>
        <p>After creating <code>.cursorrules</code>, use this prompt to create the context file:</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`Create a \`docs/ai-context.md\` file with a starter template. The file should include:

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
\`\`\`
[Brief overview of how the codebase is organized]
\`\`\`

### Important Patterns
- [Pattern name]: [Description and where it's used]
  - Example: "Custom hooks pattern: All data fetching logic lives in hooks/ directory"

### Key Files/Directories
- \`[path]\`: [What it does and why it's important]
  - Example: "\`lib/api.js\`: Central API client with authentication handling"

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
- \`[VAR_NAME]\`: [Purpose and where it's used]
  - Example: "\`NEXT_PUBLIC_API_URL\`: Base URL for all API calls, set in Vercel dashboard"

### External Services
- [Service]: [How it's integrated and what it's used for]
  - Example: "Supabase: Database and auth. Connection config in \`lib/supabase.js\`"

## Notes for Future Sessions

- [Any important reminders or context for future work]
  - Example: "Remember: Always run tests before deploying. Test suite located in \`__tests__/\`"

---

**Last Updated:** [Date]
**Maintained By:** [Your name/team]`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <p>
          <strong>Why This Framework Works:</strong>
        </p>
        <ul>
          <li>
            <strong>Complete Content</strong> - The prompts include the full rules and template content, not just "create a file"
          </li>
          <li>
            <strong>Repeatable</strong> - Copy and paste these prompts into any new project to set up persistent memory
          </li>
          <li>
            <strong>No Manual Work</strong> - Once set up, Cursor automatically reads and updates the files based on the rules
          </li>
          <li>
            <strong>Customizable</strong> - You can modify the prompts to add project-specific rules or context
          </li>
        </ul>

        <h3>What Gets Created</h3>
        <ol>
          <li>
            <strong><code>docs/ai-context.md</code></strong> - Your persistent memory file that Cursor reads at the start of each session
          </li>
          <li>
            <strong><code>.cursorrules</code></strong> - Configuration file that tells Cursor to always check <code>docs/ai-context.md</code>
          </li>
        </ol>

        <p>
          <strong>Pro tip:</strong> Pin <code>docs/ai-context.md</code> in your Cursor editor (right-click → Pin) so it's always visible.
          Cursor will automatically update it when you make important decisions—no manual work needed.
        </p>

        <h3>How It Works (Automatically)</h3>
        <p>
          Once you have <code>.cursorrules</code> configured, Cursor handles everything automatically:
        </p>
        <ul>
          <li>
            <strong>Automatic session kickoff</strong> - At the start of every new chat, Cursor automatically reads
            <code>docs/ai-context.md</code> to understand project context. No manual prompt needed.
          </li>
          <li>
            <strong>Automatic context updates</strong> - When you make architectural decisions, introduce new patterns,
            or solve important problems, Cursor automatically updates <code>ai-context.md</code> with the decision and reasoning.
            It won't update for small changes—only meaningful decisions.
          </li>
          <li>
            <strong>Automatic context monitoring</strong> - Cursor watches token usage and proactively suggests starting
            a new chat when context gets full (80%+). When you start fresh, it automatically reads <code>ai-context.md</code>
            to catch up.
          </li>
          <li>
            <strong>Strategic file references</strong> - Cursor automatically prefers referencing specific files over
            pasting large code blocks, keeping context usage efficient.
          </li>
          <li>
            <strong>Focused context file</strong> - Cursor keeps <code>ai-context.md</code> focused on essential information:
            decisions, architecture, and current state. It won't dump everything in—code comments and documentation belong elsewhere.
          </li>
          <li>
            <strong>Team handoffs</strong> - For team projects, <code>ai-context.md</code> serves as an automatic handoff document.
            When someone new joins or you switch contexts, that file brings them up to speed automatically.
          </li>
        </ul>

        <h3>Monitoring Context Usage</h3>
        <p>Cursor automatically monitors context usage and shows you:</p>
        <ul>
          <li>
            <strong>Token Counter</strong> - Visible at the bottom of the chat panel showing tokens used vs. available
          </li>
          <li>
            <strong>Automatic Warnings</strong> - Cursor proactively warns you when approaching limits (80%+ usage)
          </li>
          <li>
            <strong>Automatic Detection</strong> - Cursor watches for warning signs and suggests starting a new chat when needed
          </li>
        </ul>

        <h3>Warning Signs (Cursor Detects These Automatically)</h3>
        <p>Cursor automatically watches for these indicators that context is getting exhausted:</p>
        <ul>
          <li>
            <strong>Model repetition</strong> - If Cursor notices itself repeating the same things, it may have lost earlier context
          </li>
          <li>
            <strong>Forgetting recent decisions</strong> - When Cursor asks about things you just discussed, it's a sign context is full
          </li>
          <li>
            <strong>Can't see earlier code</strong> - References to files or functions from earlier in the conversation fail
          </li>
          <li>
            <strong>Token counter near limit</strong> - At 80%+ usage, Cursor automatically suggests starting a new chat
          </li>
          <li>
            <strong>Generic responses</strong> - When Cursor gives generic answers instead of project-specific ones, context may be exhausted
          </li>
        </ul>
        <p>
          When Cursor detects these signs, it will automatically suggest: "Context is getting full. Let's start a new chat—I'll read
          <code>ai-context.md</code> to catch up."
        </p>

        <h3>No Manual Work Required</h3>
        <p>
          With <code>.cursorrules</code> properly configured, you don't need to do anything manually:
        </p>
        <ul>
          <li>
            <strong>No kickoff prompts needed</strong> - Cursor automatically reads <code>docs/ai-context.md</code>
            at the start of every new chat session
          </li>
          <li>
            <strong>No manual updates</strong> - Cursor automatically updates <code>ai-context.md</code> when you make
            architectural decisions, introduce patterns, or solve important problems
          </li>
          <li>
            <strong>No context monitoring</strong> - Cursor watches token usage and proactively suggests when to start
            a new chat
          </li>
        </ul>
        <p>
          Just work normally—Cursor handles the memory management behind the scenes. The goal is to make this completely
          seamless so you can focus on building, not managing context.
        </p>

        <h3>Example Workflow</h3>
        <ol>
          <li>Clone a new repository</li>
          <li>Copy and paste the "Step 1: Set Up .cursorrules" prompt above into Cursor</li>
          <li>Copy and paste the "Step 2: Set Up docs/ai-context.md" prompt above into Cursor</li>
          <li>Cursor creates both files with the complete rules and template content</li>
          <li>Pin <code>docs/ai-context.md</code> in your editor (optional, but helpful to see what Cursor is tracking)</li>
          <li>Work normally—Cursor automatically updates <code>ai-context.md</code> when you make architectural decisions</li>
          <li>When starting new chats, Cursor automatically reads <code>ai-context.md</code> to get context</li>
          <li>Cursor monitors token usage and suggests new chats when context gets full</li>
        </ol>

        <p>
          <strong>Remember:</strong> The best memory system is one that works automatically. Once set up with the complete prompts above,
          you don't need to think about it—Cursor handles reading, updating, and monitoring context so you can focus on building.
        </p>
      </>
    )
  },
  {
    id: 'working-with-figma-and-cursor',
    title: 'Figma & Cursor',
    content: (
      <>
        <p>
          The magic happens when Figma and Cursor work together. Here's how to translate your designs into code.
        </p>

        <h3>Example Workflow</h3>
        <p>Let's say you have a button design in Figma and want to code it:</p>
        <ol>
          <li>In Figma, select the button frame or component you want to code</li>
          <li>Copy the Figma URL (or the node ID from the URL)</li>
          <li>In Cursor, paste the URL and ask: "Create an HTML button that matches this Figma design"</li>
          <li>Cursor will access the Figma design, extract the colors, spacing, typography, and generate the code</li>
          <li>Review the code, make adjustments if needed, and ask Cursor to refine it</li>
        </ol>

        <p>Example prompts you can try:</p>
        <ul>
          <li>"Create a React component based on this Figma design: [paste URL]"</li>
          <li>"What are the exact colors and spacing used in this Figma frame?"</li>
          <li>"Generate CSS for this button design from Figma"</li>
          <li>"Create a Next.js page that matches this Figma layout"</li>
          <li>"Extract the design tokens (colors, fonts, spacing) from this Figma file"</li>
        </ul>

        <h3>Best Practices in Figma</h3>
        <p>To make vibe coding easier, use these Figma features:</p>
        <ul>
          <li><strong>Auto Layout</strong> - Use Auto Layout for frames so Cursor can better understand spacing and relationships between elements</li>
          <li><strong>Name layers clearly</strong> - Use descriptive names that match your component structure (e.g., "Button", "Card", "Header")</li>
          <li><strong>Use components</strong> - Create reusable components for buttons, cards, etc. This helps Cursor understand your design system</li>
          <li><strong>Organize with frames</strong> - Group related elements in frames so Cursor can understand the layout structure</li>
        </ul>
      </>
    )
  },
  {
    id: 'local-development-server',
    title: 'Do it live!',
    content: (
      <>
        <p>
          To see your changes in real-time, you'll need to run a local development server.
          The good news: Cursor can help you set this up and fix any issues that come up.
        </p>

        <h3>Setting Up Your Project</h3>
        <p>Instead of running commands manually, ask Cursor to help you:</p>
        <ul>
          <li><strong>For Next.js:</strong> "Help me create a new Next.js project" or "Set up a Next.js development server"</li>
          <li><strong>For static sites:</strong> "Help me set up a local server for my HTML files"</li>
          <li><strong>For React:</strong> "Create a new React project" or "Set up a React development environment"</li>
        </ul>

        <p>Cursor can create the project structure, install dependencies, and get everything running for you.</p>

        <h3>When Things Go Wrong</h3>
        <p>If your server won't start or you see errors, Cursor can help:</p>
        <ol>
          <li>Open the terminal in Cursor (View → Terminal, or the terminal panel at the bottom)</li>
          <li>If you see an error message, select it (highlight the text)</li>
          <li>Ask Cursor: "This error appeared when I tried to start my dev server. Can you help fix it?"</li>
          <li>Or paste the error and ask: "What does this error mean and how do I fix it?"</li>
        </ol>

        <p><strong>Common issues Cursor can help with:</strong></p>
        <ul>
          <li>Port already in use (e.g., "Address already in use" error) - Cursor can help you find what's using the port or switch to a different one</li>
          <li>Missing dependencies - Cursor can help install what's needed</li>
          <li>Configuration errors - Cursor can help fix config files</li>
          <li>Build errors - Select the error message and ask Cursor to explain and fix it</li>
        </ul>

        <p>The key is: if Cursor can do it, let it. Don't struggle with command line errors when you can just ask for help.</p>
      </>
    )
  },
  {
    id: 'helpful-cursor-extensions',
    title: 'Extensions',
    content: (
      <>
        <p>
          Extensions can enhance your Cursor experience. Here are some that might be useful for vibe coding
          and web development. (Note: I haven't used all of these, so I'm curious how well they work!)
        </p>

        <h3>Recommended Extensions List</h3>
        <ul>
          <li><strong>Prettier</strong> - Code formatter for consistent styling</li>
          <li><strong>ESLint</strong> - JavaScript linter for code quality</li>
          <li><strong>Tailwind CSS IntelliSense</strong> - Autocomplete for Tailwind classes</li>
          <li><strong>GitLens</strong> - Enhanced Git capabilities and blame annotations</li>
          <li><strong>Error Lens</strong> - Inline error highlighting</li>
          <li><strong>Auto Rename Tag</strong> - Automatically rename paired HTML/JSX tags</li>
          <li><strong>Path Intellisense</strong> - Autocomplete for file paths</li>
          <li><strong>Color Highlight</strong> - Highlight color codes in your code</li>
          <li><strong>Bracket Pair Colorizer</strong> - Color matching brackets</li>
          <li><strong>Live Server</strong> - Launch a development server with live reload</li>
        </ul>

        <h3>Installation Instructions</h3>
        <ol>
          <li>Open Cursor</li>
          <li>Press <code>Cmd/Ctrl + Shift + X</code> to open Extensions view</li>
          <li>Search for the extension name</li>
          <li>Click "Install"</li>
          <li>Some extensions may require a reload (click "Reload" when prompted)</li>
        </ol>

        <p><strong>Tip:</strong> Ask Cursor to help you set up extensions if you're not sure which ones you need or how to configure them.</p>
      </>
    )
  },
  {
    id: 'what-about-backend',
    title: 'What About Backend? (Optional)',
    content: (
      <>
        <p>
          If your project needs a database, user authentication, or other backend features,
          Supabase is a great option. It's like having a backend without managing servers yourself.
        </p>

        <h3>What is Supabase?</h3>
        <p>Supabase provides:</p>
        <ul>
          <li><strong>PostgreSQL database</strong> - A full-featured database (think of it like a spreadsheet, but much more powerful)</li>
          <li><strong>Built-in authentication</strong> - Let users sign up and log in (email, social logins, magic links)</li>
          <li><strong>Real-time subscriptions</strong> - Your app can update instantly when data changes</li>
          <li><strong>Storage</strong> - Upload and manage files (images, documents, etc.)</li>
          <li><strong>Auto-generated APIs</strong> - Supabase automatically creates APIs from your database, so you don't have to write backend code</li>
          <li><strong>Free tier</strong> - Generous limits for personal projects</li>
        </ul>

        <h3>Creating a Supabase Project</h3>
        <p>Ask Cursor to help you set up Supabase, or follow these steps:</p>
        <ol>
          <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a> and sign up</li>
          <li>Click "New Project"</li>
          <li>Choose an organization (or create one)</li>
          <li>Enter project name and database password</li>
          <li>Select a region closest to your users</li>
          <li>Click "Create new project" (takes 1-2 minutes)</li>
        </ol>

        <h3>Getting Your API Keys</h3>
        <p>Once your project is ready:</p>
        <ol>
          <li>Go to Project Settings → API</li>
          <li>Copy your Project URL (e.g., <code>https://xxxxx.supabase.co</code>)</li>
          <li>Copy your anon/public key (safe for client-side use)</li>
          <li>Copy your service_role key (keep secret, server-side only)</li>
        </ol>

        <p><strong>Pro tip:</strong> Ask Cursor to help you set up Supabase in your project. Just tell Cursor you want to use Supabase,
        and it can help you install the client library and set up the connection.</p>

        <h3>Using Supabase in Your Project</h3>
        <p>Ask Cursor to help you connect Supabase, or use this as a starting point:</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`// Install the Supabase client (ask Cursor to do this)
// npm install @supabase/supabase-js

// Create a Supabase client (Cursor can help you set this up)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <p>Then ask Cursor to help you use it. For example: "Help me query data from Supabase" or
        "How do I add user authentication with Supabase?"</p>
      </>
    )
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    content: (
      <>
        <p>
          Common issues and their solutions when setting up your vibe coding environment.
        </p>

        <h3>Common Issues</h3>

        <h4>Figma MCP Not Connecting</h4>
        <ul>
          <li>Verify your Figma Personal Access Token is correct and not expired</li>
          <li>Check that the file URL is accessible (not private without proper permissions)</li>
          <li>Restart Cursor after MCP configuration changes</li>
          <li>Check Cursor's MCP logs for error messages</li>
        </ul>

        <h4>GitHub MCP Issues</h4>
        <ul>
          <li>Ensure your GitHub token has the correct scopes (<code>repo</code>, <code>read:org</code>)</li>
          <li>Check token expiration date</li>
          <li>Verify repository permissions if accessing private repos</li>
        </ul>

        <h4>Vercel Deployment Fails</h4>
        <ul>
          <li>Check build logs in Vercel dashboard for specific errors</li>
          <li>Verify environment variables are set correctly</li>
          <li>Ensure <code>package.json</code> has correct build scripts</li>
          <li>Check Node.js version compatibility</li>
        </ul>

        <h4>Supabase Connection Issues (Optional)</h4>
        <ul>
          <li>Verify API URL and keys are correct</li>
          <li>Check Supabase project status (not paused)</li>
          <li>Verify Row Level Security (RLS) policies if data isn't accessible</li>
          <li>Check browser console for CORS errors</li>
          <li><strong>Better yet:</strong> Select the error message and ask Cursor to help fix it</li>
        </ul>

        <h4>Local Dev Server Not Starting</h4>
        <p>Instead of troubleshooting manually, try this:</p>
        <ul>
          <li>Open the terminal in Cursor</li>
          <li>Select the error message</li>
          <li>Ask Cursor: "This error appeared when I tried to start my dev server. Can you help fix it?"</li>
          <li>Common issues Cursor can help with: port conflicts, missing dependencies, configuration errors</li>
        </ul>

        <h3>Solutions</h3>
        <p>General troubleshooting steps:</p>
        <ol>
          <li><strong>Check logs</strong> - Most tools provide detailed error logs</li>
          <li><strong>Restart services</strong> - Often fixes transient issues</li>
          <li><strong>Update dependencies</strong> - <code>npm update</code> or check for updates</li>
          <li><strong>Clear caches</strong> - Browser cache, npm cache, Next.js cache</li>
          <li><strong>Verify credentials</strong> - Tokens, API keys, passwords</li>
          <li><strong>Check documentation</strong> - Official docs often have troubleshooting sections</li>
        </ol>
      </>
    )
  },
  {
    id: 'next-steps',
    title: 'Next Steps',
    content: (
      <>
        <p>
          Now that your environment is set up, here are some resources and next steps to continue
          your vibe coding journey.
        </p>

        <h3>Resources</h3>
        <ul>
          <li><a href="https://cursor.sh/docs" target="_blank" rel="noopener noreferrer">Cursor Documentation</a> - Official Cursor docs</li>
          <li><a href="https://www.figma.com/developers" target="_blank" rel="noopener noreferrer">Figma Developer Resources</a> - API and plugin docs</li>
          <li><a href="https://vercel.com/docs" target="_blank" rel="noopener noreferrer">Vercel Documentation</a> - Deployment guides</li>
          <li><a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer">Supabase Documentation (Optional)</a> - Database and auth guides</li>
          <li><a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">Next.js Documentation</a> - Framework reference</li>
          <li><a href="https://github.com/modelcontextprotocol" target="_blank" rel="noopener noreferrer">MCP GitHub</a> - Model Context Protocol resources</li>
        </ul>

        <h3>Further Reading</h3>
        <ul>
          <li><strong>Design Systems</strong> - Learn about creating reusable design components</li>
          <li><strong>Component Architecture</strong> - Best practices for organizing React/Next.js components</li>
          <li><strong>API Design</strong> - How to structure your Supabase database and APIs</li>
          <li><strong>Performance Optimization</strong> - Tips for fast-loading web applications</li>
          <li><strong>Accessibility</strong> - Making your sites usable for everyone</li>
        </ul>

        <p>
          Happy vibe coding! Remember, the best workflow is the one that works for you.
          Experiment, iterate, and refine your setup as you go.
        </p>
      </>
    )
  },
  {
    id: 'overview',
    title: 'Overview',
    content: (
      <>
        <p>
          This section provides a comprehensive overview of the tech stack, tool relationships, costs, and design system
          used in the vibe coding workflow.
        </p>

        <h3>Technologies</h3>
        <div className="tech-item">
          <div className="tech-icon">🎨</div>
          <div className="tech-details">
            <div className="tech-name">Figma</div>
            <div className="tech-description">Design tool for creating UI/UX designs. Provides MCP integration for accessing design files, extracting design tokens, and generating code from designs.</div>
          </div>
        </div>
        <div className="tech-item">
          <div className="tech-icon">🤖</div>
          <div className="tech-details">
            <div className="tech-name">Cursor</div>
            <div className="tech-description">AI-powered code editor built on VS Code. Integrates with Figma, GitHub, and other tools via Model Context Protocol (MCP) to enable vibe coding workflows.</div>
          </div>
        </div>
        <div className="tech-item">
          <div className="tech-icon">🐙</div>
          <div className="tech-details">
            <div className="tech-name">GitHub</div>
            <div className="tech-description">Version control and repository hosting. Serves as the source of truth for code and integrates with Vercel for automatic deployments.</div>
          </div>
        </div>
        <div className="tech-item">
          <div className="tech-icon">▲</div>
          <div className="tech-details">
            <div className="tech-name">Vercel</div>
            <div className="tech-description">Deployment and hosting platform. Automatically deploys from GitHub with preview URLs for every push and pull request. Supports static sites, React, and Next.js.</div>
          </div>
        </div>
        <div className="tech-item">
          <div className="tech-icon">🗄️</div>
          <div className="tech-details">
            <div className="tech-name">Supabase (Optional)</div>
            <div className="tech-description">Backend-as-a-Service providing PostgreSQL database, authentication, real-time subscriptions, and storage. Auto-generates APIs from database schema.</div>
          </div>
        </div>
        <div className="tech-item">
          <div className="tech-icon">📦</div>
          <div className="tech-details">
            <div className="tech-name">Model Context Protocol (MCP)</div>
            <div className="tech-description">Protocol that enables AI assistants to securely access external tools and data sources. Connects Cursor to Figma, GitHub, and other services.</div>
          </div>
        </div>
        <div className="tech-item">
          <div className="tech-icon">⚛️</div>
          <div className="tech-details">
            <div className="tech-name">React / Next.js (Optional)</div>
            <div className="tech-description">JavaScript frameworks for building interactive web applications. Next.js adds server-side rendering, routing, and API routes on top of React.</div>
          </div>
        </div>
        <div className="tech-item">
          <div className="tech-icon">💻</div>
          <div className="tech-details">
            <div className="tech-name">HTML / CSS / JavaScript</div>
            <div className="tech-description">Core web technologies. Can start with simple static sites or use frameworks for more complex applications.</div>
          </div>
        </div>

        <h3>Relationship Between Apps</h3>
        <p>The vibe coding workflow creates a seamless pipeline from design to deployment:</p>
        <ol>
          <li><strong>Figma → Cursor:</strong> Design files are accessed via Figma MCP, allowing Cursor to extract design tokens, colors, typography, spacing, and component structures.</li>
          <li><strong>Cursor → GitHub:</strong> Code is written in Cursor and committed to GitHub repositories via GitHub MCP integration, enabling version control and collaboration.</li>
          <li><strong>GitHub → Vercel:</strong> Every push to GitHub automatically triggers deployments on Vercel, creating production and preview URLs.</li>
          <li><strong>Supabase (Optional):</strong> Provides backend services that can be accessed from frontend code deployed on Vercel, completing the full-stack workflow.</li>
        </ol>
        <p>This creates a continuous workflow: Design → Code → Deploy → Iterate, all powered by AI assistance in Cursor.</p>

        <h3>Cost</h3>
        <table className="cost-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Free Tier</th>
              <th>Paid Plans</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Figma</strong></td>
              <td className="cost-free">Free</td>
              <td>Professional: $12/editor/month, Organization: $45/editor/month</td>
            </tr>
            <tr>
              <td><strong>Cursor</strong></td>
              <td>Limited free tier</td>
              <td>Pro: $20/month, Business: $40/user/month</td>
            </tr>
            <tr>
              <td><strong>GitHub</strong></td>
              <td className="cost-free">Free</td>
              <td>Team: $4/user/month, Enterprise: Custom pricing</td>
            </tr>
            <tr>
              <td><strong>Vercel</strong></td>
              <td className="cost-free">Free (Hobby)</td>
              <td>Pro: $20/month, Enterprise: Custom pricing</td>
            </tr>
            <tr>
              <td><strong>Supabase</strong></td>
              <td className="cost-free">Free</td>
              <td>Pro: $25/month, Team: $599/month</td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>Total Free Tier Cost:</strong> $0/month - You can build and deploy projects completely free using the free tiers of all services.
          Paid plans unlock additional features, higher limits, and team collaboration tools.
        </p>

        <h3>Design System</h3>
        <h4>Type</h4>
        <p><strong>Font Family:</strong> System font stack for optimal performance and native feel:</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <p>This ensures the site uses the native system font on each platform (San Francisco on macOS, Segoe UI on Windows, etc.).</p>

        <h4>Type Scale</h4>
        <ul>
          <li><strong>H1:</strong> 42px, font-weight: 700, line-height: 1.2</li>
          <li><strong>H2:</strong> 28px, font-weight: 600, line-height: 1.2</li>
          <li><strong>H3:</strong> 20px, font-weight: 600, line-height: 1.3</li>
          <li><strong>H4:</strong> 16px, font-weight: 600, line-height: 1.4</li>
          <li><strong>Body:</strong> 16px (default), line-height: 1.7</li>
          <li><strong>Small:</strong> 14px, line-height: 1.6</li>
          <li><strong>Code:</strong> 14px (in code blocks), 0.9em (inline), font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', monospace</li>
        </ul>

        <h4>Color</h4>
        <p><strong>Light Mode:</strong></p>
        <div className="color-info">
          <span className="color-name">Background Primary:</span>
          <span className="color-swatch" style={{backgroundColor: '#ffffff'}}></span>
          <span className="color-value">#ffffff</span>
        </div>
        <div className="color-info">
          <span className="color-name">Background Secondary:</span>
          <span className="color-swatch" style={{backgroundColor: '#f8f9fa'}}></span>
          <span className="color-value">#f8f9fa</span>
        </div>
        <div className="color-info">
          <span className="color-name">Text Primary:</span>
          <span className="color-swatch" style={{backgroundColor: '#1a1a1a'}}></span>
          <span className="color-value">#1a1a1a</span>
        </div>
        <div className="color-info">
          <span className="color-name">Text Secondary:</span>
          <span className="color-swatch" style={{backgroundColor: '#666666'}}></span>
          <span className="color-value">#666666</span>
        </div>
        <div className="color-info">
          <span className="color-name">Text Tertiary:</span>
          <span className="color-swatch" style={{backgroundColor: '#999999'}}></span>
          <span className="color-value">#999999</span>
        </div>
        <div className="color-info">
          <span className="color-name">Accent:</span>
          <span className="color-swatch" style={{backgroundColor: '#5e6ad2'}}></span>
          <span className="color-value">#5e6ad2</span>
        </div>
        <div className="color-info">
          <span className="color-name">Border:</span>
          <span className="color-swatch" style={{backgroundColor: '#e5e5e5'}}></span>
          <span className="color-value">#e5e5e5</span>
        </div>

        <p><strong>Dark Mode:</strong></p>
        <div className="color-info">
          <span className="color-name">Background Primary:</span>
          <span className="color-swatch" style={{backgroundColor: '#0d1117'}}></span>
          <span className="color-value">#0d1117</span>
        </div>
        <div className="color-info">
          <span className="color-name">Background Secondary:</span>
          <span className="color-swatch" style={{backgroundColor: '#161b22'}}></span>
          <span className="color-value">#161b22</span>
        </div>
        <div className="color-info">
          <span className="color-name">Text Primary:</span>
          <span className="color-swatch" style={{backgroundColor: '#c9d1d9'}}></span>
          <span className="color-value">#c9d1d9</span>
        </div>
        <div className="color-info">
          <span className="color-name">Text Secondary:</span>
          <span className="color-swatch" style={{backgroundColor: '#8b949e'}}></span>
          <span className="color-value">#8b949e</span>
        </div>
        <div className="color-info">
          <span className="color-name">Text Tertiary:</span>
          <span className="color-swatch" style={{backgroundColor: '#6e7681'}}></span>
          <span className="color-value">#6e7681</span>
        </div>
        <div className="color-info">
          <span className="color-name">Accent:</span>
          <span className="color-swatch" style={{backgroundColor: '#58a6ff'}}></span>
          <span className="color-value">#58a6ff</span>
        </div>
        <div className="color-info">
          <span className="color-name">Border:</span>
          <span className="color-swatch" style={{backgroundColor: '#30363d'}}></span>
          <span className="color-value">#30363d</span>
        </div>

        <h4>Other Design System Elements</h4>
        <ul>
          <li><strong>Border Radius:</strong> 4px (small elements), 6px (buttons, inputs), 8px (cards, modals)</li>
          <li><strong>Spacing Scale:</strong> 4px base unit (4px, 8px, 12px, 16px, 24px, 32px, 48px)</li>
          <li><strong>Shadows:</strong> Minimal, used for modals and elevated elements</li>
          <li><strong>Transitions:</strong> 0.2s-0.3s ease for interactive elements</li>
          <li><strong>Code Blocks:</strong> Light background (#f6f8fa light / #161b22 dark) with border</li>
          <li><strong>Sidebar Width:</strong> 240px fixed</li>
          <li><strong>Content Max Width:</strong> 900px</li>
          <li><strong>Header Height:</strong> 60px fixed</li>
        </ul>
      </>
    )
  },
  {
    id: 'contribute',
    title: 'Contribute',
    content: (
      <>
        <p>
          This guide is a living document. If you use Cursor, Claude Code, or other AI coding tools,
          your unique workflow and tips can help others!
        </p>

        <h3>How to Contribute</h3>
        <p>Use this prompt with your AI tool to document your workflow:</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`Help me document my complete workflow by asking me questions about:

1. **Setup & Configuration**
   - How I installed and configured the tool
   - Any MCP servers or integrations I use (Figma, GitHub, etc.)
   - Custom settings, extensions, or configurations
   - Any setup steps that were tricky or non-obvious

2. **Daily Workflow**
   - How I typically start a new project
   - How I work with Figma designs (if applicable)
   - How I use AI features (prompts, code generation, etc.)
   - How I handle version control (Git/GitHub)
   - How I deploy projects
   - Any shortcuts, tricks, or workflows I've developed

3. **Tips & Tricks**
   - Prompts that work really well for me
   - Common problems and how I solve them
   - Tools or extensions I can't live without
   - Any unique approaches or techniques

4. **Troubleshooting**
   - Common issues I've encountered
   - Solutions that worked for me
   - Things that tripped me up initially

Ask me questions one at a time, and compile my answers into a structured markdown document that captures my complete workflow. Be thorough and ask follow-up questions if something is unclear.`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <p>
          Share the markdown file with Jon to compare against the current version of the wiki. He'll create a PR and format each contribution with <code>&gt; **💡 Contributor Note:**</code> blockquotes to mark what came from you vs. the original guide.
        </p>
      </>
    )
  }
]

// Navigation labels for sidebar
export const navLabels = {
  'overview': 'Tech Stack',
  'contribute': 'Contribute',
  'prerequisites': 'Pre-reqs',
  'github-repository-setup': 'Github',
  'vercel-deployment': 'Vercel',
  'custom-domain-setup': 'Custom domain',
  'figma-mcp-setup': 'Figma 🤝 Cursor',
  'cursor-setup': 'Cursor',
  'cursor-memory-context': 'Memory & Context'
}

// Sections that should be nested under Prerequisites
export const nestedSections = [
  'github-repository-setup',
  'vercel-deployment',
  'custom-domain-setup',
  'figma-mcp-setup',
  'cursor-setup'
]

// Sections that should be nested under Cursor
export const cursorNestedSections = [
  'cursor-memory-context'
]
