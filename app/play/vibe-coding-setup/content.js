// Content sections for the vibe-coding-setup wiki
const allSections = [
  {
    id: 'intro',
    title: 'Get the vibes right (man).',
    content: (
      <>
        <p>
          Vibe coding is building software by describing what you want instead of writing every line of code yourself.
        </p>
        <p>
          Traditional coding means you write every function, debug every error, and read documentation for every library. You copy-paste from Stack Overflow. Basic features take hours. Vibe coding flips that: you describe what you want—like &quot;Add user authentication&quot;—and AI writes the implementation, debugs errors, and knows the documentation. You get working code in minutes instead of hours.
        </p>
        <p>
          You&apos;re still the developer. You make architectural decisions, review code, and ensure quality. But you&apos;re freed from the tedious work of translating ideas into syntax.
        </p>
        <p>
          This isn&apos;t lazy. It&apos;s leverage. A construction foreman doesn&apos;t personally nail every board. They direct the work, ensure quality, make decisions. That&apos;s you with AI.
        </p>
        <p>
          The question isn&apos;t &quot;Can AI code?&quot; It&apos;s &quot;Why are you still doing work AI can do?&quot;
        </p>
      </>
    )
  },
  {
    id: 'workflow',
    title: 'The Actual Vibe Coding Workflow',
    content: (
      <>
        <p><strong>What vibe coding looks like in practice:</strong></p>
        <ol>
          <li><strong>Start with strategy (Claude)</strong> — Describe what you want to build. Discuss architecture, tradeoffs, decisions. Get a plan before writing code.</li>
          <li><strong>Execute with code (Cursor)</strong> — Take the plan to Cursor. Let Cursor write the actual code. Cursor reads your project docs for context.</li>
          <li><strong>Iterate and refine (both)</strong> — Cursor for implementation details. Claude for &quot;should we do it this way or that way?&quot; Back and forth as needed.</li>
        </ol>
        <h3>Example Session</h3>
        <p><strong>You (in Claude):</strong> &quot;I need to add user authentication to my app. Should I use Supabase Auth or build custom?&quot;</p>
        <p><strong>Claude:</strong> Discusses options, recommends Supabase Auth for faster MVP, explains security benefits, notes you can migrate later if needed.</p>
        <p><strong>You (in Cursor):</strong> &quot;Add Supabase authentication to the app. Email/password + Google Sign-In.&quot;</p>
        <p><strong>Cursor:</strong> Reads AGENTS.md for context, writes auth code, updates database schema, adds UI components, updates relevant docs.</p>
        <h3>Key Insight</h3>
        <p>Claude for thinking. Cursor for doing. Don&apos;t try to make one tool do both jobs.</p>
        <p>The magic happens when you use each tool for what it&apos;s optimized for:</p>
        <ul>
          <li>Claude excels at strategic thinking, exploring options, critiquing approaches</li>
          <li>Cursor excels at writing code, implementing features, executing plans</li>
        </ul>
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
    id: 'claude-setup',
    title: 'Claude Setup',
    content: (
      <>
        <p>
          Use <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude</a> for strategy and planning before you write code. No special setup required—just create an account and start a conversation.
        </p>
        <h3>Memory / Project Context</h3>
        <p>
          For ongoing projects, start each Claude session by pasting or uploading a short summary of your project (tech stack, what you&apos;re building, key decisions). You can use the same <code>AGENTS.md</code> summary you use for Cursor. This gives Claude context so you don&apos;t re-explain everything.
        </p>
        <p>
          <strong>Tip:</strong> Keep a project context note (or link to AGENTS.md) and paste it into Claude when you start a planning session. &quot;Here&apos;s my project context. I need to decide...&quot;
        </p>
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

        <h3>Connecting Vercel to Cursor via MCP</h3>
        <p>You can connect Vercel to Cursor via MCP to manage deployments, check build status, and configure environment variables directly from Cursor:</p>
        <ol>
          <li>In Cursor, open Settings (Cmd/Ctrl + ,)</li>
          <li>Navigate to "Features" → "Model Context Protocol"</li>
          <li>Click "Add Server" or edit existing configuration</li>
          <li>Add the Vercel MCP server configuration</li>
        </ol>

        <p>You'll need a Vercel Access Token. To create one:</p>
        <ol>
          <li>Go to Vercel → Settings → Tokens</li>
          <li>Click "Create Token"</li>
          <li>Give it a name (e.g., "Cursor MCP")</li>
          <li>Copy the token immediately</li>
        </ol>

        <p>Example Vercel MCP configuration:</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": [
        "-y",
        "@vercel/mcp"
      ],
      "env": {
        "VERCEL_ACCESS_TOKEN": "your-vercel-token-here"
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

        <h3>Custom Domain Setup</h3>
        <p>
          Adding a custom domain gives your project a professional URL and makes it easier to share.
          This is completely optional - your Vercel URL works perfectly fine.
        </p>

        <h4>DNS Configuration</h4>
        <p>In your domain registrar (where you bought your domain):</p>
        <ol>
          <li>Add a CNAME record pointing to <code>cname.vercel-dns.com</code></li>
          <li>Or add A records pointing to Vercel's IP addresses (if CNAME not supported)</li>
          <li>Wait for DNS propagation (can take up to 48 hours, usually much faster)</li>
        </ol>

        <h4>Vercel Domain Settings</h4>
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

        <h3>Rules for AI (Cursor Settings)</h3>
        <p>
          Add project-agnostic instructions via <strong>Settings → Cursor Settings → Rules for AI</strong>.
          One rule we recommend: tell Cursor to use tools directly instead of giving you manual instructions.
        </p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`When you have access to tools via MCP or other integrations, ALWAYS use them directly instead of giving me instructions.

If you can execute an action yourself (create files, run SQL, make API calls, etc.), do it immediately. Never say "go to X and do Y" - just do Y yourself.

Only give me manual instructions when you literally cannot perform the action (e.g., requires physical access, external authentication you don't have).

Default to action, not explanation.`}</code></pre>
        </div>

        <h3>Example .cursorrules</h3>
        <p>Here&apos;s a real <code>.cursorrules</code> file that demonstrates &quot;concise, action-oriented&quot;:</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`# Project: [Your App Name]
# Stack: [Your tech stack]

## Before Making Changes
- Read AGENTS.md for current context
- Show me your plan before executing
- Ask about tradeoffs when multiple approaches exist
- Wait for approval

## After Completing Work
- Update AGENTS.md with what changed and why
- Note new patterns
- Clean up only your changes

## Code Quality
- [Your language/framework] best practices
- Prefer simplicity over cleverness
- Comment only when code isn't self-explanatory

## Communication Style
- Direct and concise
- Code-first: show code, explain when asked
- Default to action, not explanation

## Project Context
- Current phase: [e.g., MVP v1]
- Key constraints: [e.g., Solo builder, 3-month timeline]
- Team: [e.g., Solo with 2 advisors]

## Anti-Patterns to Avoid
- Don't suggest [deferred features]
- Don't add [libraries we don't need yet]
- Don't over-engineer for scale we don't have`}</code></pre>
        </div>
        <p><strong>Why this works:</strong> Cursor knows what to do by default. You don&apos;t have to remember prompts or paste instructions every time. The file tells Cursor: what to read for context (AGENTS.md), how to behave (ask before big changes, update docs after), what quality standards to follow, and what to avoid. Once configured, you just open Cursor and start working.</p>

        <h3>Connecting Figma to Cursor via MCP</h3>
        <p>
          The Figma MCP (Model Context Protocol) server allows Cursor to access your Figma designs,
          extract design details, and generate code based on your designs. This is the magic that makes vibe coding work.
        </p>

        <h4>Getting Your Figma Personal Access Token</h4>
        <p>First, you need to create a token that lets Cursor access your Figma files:</p>
        <ol>
          <li>Open Figma (desktop app or web)</li>
          <li>Go to Figma → Settings → Account</li>
          <li>Scroll down to "Personal access tokens"</li>
          <li>Click "Create new token"</li>
          <li>Give it a name (e.g., "Cursor MCP")</li>
          <li><strong>Copy the token immediately</strong> - you won't be able to see it again!</li>
        </ol>

        <h4>Configuring Figma MCP in Cursor</h4>
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

        <h4>Sharing Your Figma File</h4>
        <p>For Cursor to access your designs, your Figma file needs to be accessible:</p>
        <ol>
          <li>Open your Figma file</li>
          <li>Click "Share" in the top right</li>
          <li>Set permissions to "Can view" (this is enough for MCP access)</li>
          <li>Copy the file URL - you can paste this in Cursor when asking about designs</li>
        </ol>

        <h4>Testing the Connection</h4>
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
    id: 'best-practices',
    title: 'Best Practices',
    content: (
      <>
        <p>
          These best practices will help you get the most out of vibe coding: project memory, when to use which tool,
          and common mistakes to avoid.
        </p>
      </>
    )
  },
  {
    id: 'project-memory-system',
    title: 'Project Memory System',
    content: (
      <>
        <p><strong>The problem:</strong> AI forgets everything between sessions.</p>
        <p><strong>The solution:</strong> Documentation files that AI reads automatically.</p>
        <h3>The System</h3>
        <p><strong>AGENTS.md</strong> — Quick reference. Current decisions and tech stack, what&apos;s built so far, active context AI needs. AI reads this FIRST every session.</p>
        <p><strong>DECISIONS.md</strong> — Decision log. Full rationale for choices made, alternatives considered, when and why. &quot;Why did we choose X over Y?&quot;</p>
        <p><strong>.cursorrules</strong> — Behavioral defaults. How Cursor should act, project-specific conventions, quality standards. Cursor reads this automatically.</p>
        <h3>How It Works</h3>
        <ol>
          <li>You open Cursor</li>
          <li>Cursor reads <code>.cursorrules</code> (knows how to behave)</li>
          <li>Cursor reads <code>AGENTS.md</code> (knows project context)</li>
          <li>You start working with full context loaded</li>
        </ol>
        <p>You don&apos;t explain the project every time. You just start working.</p>
        <h3>Example AGENTS.md</h3>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`# Project Context

**Last Updated**: 2026-01-30

## Tech Stack
- React Native + Expo (iOS/Android)
- Supabase (database, auth, storage)
- TypeScript

## What's Built
- ✅ Authentication (email/password + Google)
- ✅ User profiles
- ✅ Basic dashboard
- 🚧 Friend management (in progress)

## Current Focus
Building friend orbit visualization for MVP v1

## Key Decisions
- Using Supabase Auth (not custom)
- iOS first, Android later
- Manual friend entry (no contact import yet)

See DECISIONS.md for full rationale`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <h3>Best Practices</h3>
        <p><strong>Keep AGENTS.md current</strong> — Update when you build new features. Keep it concise. Link to detailed docs for more.</p>
        <p><strong>Don&apos;t over-document</strong> — Start with just AGENTS.md. Add DECISIONS.md when you have decisions. Don&apos;t create empty files &quot;for later&quot;.</p>
        <p><strong>Let Cursor update them</strong> — After finishing work: &quot;Update AGENTS.md with what we just built.&quot; Cursor will update the file. You don&apos;t manually maintain it. The system works when it&apos;s frictionless.</p>
      </>
    )
  },
  {
    id: 'when-to-use-which-tool',
    title: 'When to Use Which Tool',
    content: (
      <>
        <h3>Use Claude for</h3>
        <ul>
          <li><strong>Strategy and planning</strong> — &quot;Should we build this feature?&quot; &quot;What&apos;s the best approach for X?&quot;</li>
          <li><strong>Architecture decisions</strong> — &quot;Supabase or Firebase?&quot; &quot;REST API or GraphQL?&quot;</li>
          <li><strong>Exploring tradeoffs</strong> — &quot;What are the pros and cons?&quot; &quot;What will we regret in 6 months?&quot;</li>
          <li><strong>Learning new concepts</strong> — &quot;Explain how OAuth works&quot; &quot;JWT vs sessions?&quot;</li>
          <li><strong>Reviewing and critiquing</strong> — &quot;Review this code for security&quot; &quot;Is this architecture sound?&quot;</li>
          <li><strong>&quot;Is this a good idea?&quot;</strong> — &quot;Should we add this dependency?&quot; &quot;Am I overthinking this?&quot;</li>
        </ul>
        <h3>Use Cursor for</h3>
        <ul>
          <li><strong>Writing actual code</strong> — &quot;Add user authentication&quot; &quot;Create a dashboard component&quot;</li>
          <li><strong>Implementing features from a plan</strong> — After discussing with Claude, execute in Cursor. Cursor reads your docs and writes the code.</li>
          <li><strong>Debugging and fixing errors</strong> — &quot;Fix this TypeScript error&quot; &quot;Why isn&apos;t this API call working?&quot;</li>
          <li><strong>Refactoring existing code</strong> — &quot;Extract this into a reusable component&quot; &quot;Add error handling here&quot;</li>
          <li><strong>Creating files and project structure</strong> — &quot;Create a new React component&quot; &quot;Set up the database schema&quot;</li>
          <li><strong>Running commands</strong> (when MCP configured) — &quot;Run the tests&quot; &quot;Create the Supabase table&quot; &quot;Deploy to staging&quot;</li>
        </ul>
        <h3>The Pattern</h3>
        <ol>
          <li><strong>Think in Claude</strong> → Get a plan, discuss tradeoffs, make decisions</li>
          <li><strong>Build in Cursor</strong> → Execute the plan, write the code</li>
          <li><strong>Iterate</strong> → Back and forth as needed</li>
        </ol>
        <p><strong>Example flow:</strong> Claude: &quot;Let&apos;s use Supabase Auth with row-level security. Here&apos;s why...&quot; You: &quot;Sounds good.&quot; Cursor: &quot;Add Supabase Auth with RLS policies for users table&quot; → implements it. Claude: &quot;Review this auth implementation for security issues&quot; → suggests improvements. Cursor: &quot;Apply those security improvements&quot; → updates code.</p>
        <p>Don&apos;t try to do everything in one tool. They&apos;re optimized for different jobs.</p>
      </>
    )
  },
  {
    id: 'common-mistakes',
    title: 'Common Vibe Coding Mistakes',
    content: (
      <>
        <p><strong>❌ Mistake 1: Making AI explain instead of do</strong> — Wrong: &quot;How would I add authentication?&quot; Right: &quot;Add Supabase authentication with email/password and Google Sign-In&quot;. The AI can do it. Let it.</p>
        <p><strong>❌ Mistake 2: Not using project memory</strong> — Wrong: Re-explaining your project every session. Right: Create AGENTS.md once; AI reads it automatically. Every session starts with full context.</p>
        <p><strong>❌ Mistake 3: Using one tool for everything</strong> — Wrong: All planning in Cursor or all coding in Claude. Right: Claude for strategy, Cursor for execution.</p>
        <p><strong>❌ Mistake 4: Not configuring tools properly</strong> — Wrong: Default settings; AI gives instructions instead of acting. Right: Configure MCP, set behavioral defaults, connect to your tools. Action over explanation.</p>
        <p><strong>❌ Mistake 5: Over-documenting</strong> — Wrong: Creating 20 empty docs &quot;for later&quot;. Right: Create docs when you have content. Start with AGENTS.md and .cursorrules. Empty files are noise.</p>
        <p><strong>❌ Mistake 6: Under-specifying</strong> — Wrong: &quot;Make it better&quot;. Right: &quot;Add error handling for failed API calls with user-friendly messages&quot;. Be specific. AI can&apos;t read your mind.</p>
        <p><strong>❌ Mistake 7: Not reviewing AI output</strong> — Wrong: Blindly accepting everything. Right: Review code, test features, verify logic. You&apos;re still the developer.</p>
        <p><strong>❌ Mistake 8: Fighting with AI instead of redirecting</strong> — Wrong: &quot;No that&apos;s not what I meant&quot; → &quot;No still wrong&quot;. Right: &quot;Actually, I want X instead of Y. Here&apos;s why...&quot; Clarify. It&apos;s a conversation.</p>
        <p><strong>❌ Mistake 9: Not leveraging AI&apos;s strengths</strong> — Wrong: Writing boilerplate manually. Right: &quot;Create all CRUD operations for the users table&quot;. AI excels at boilerplate, repetitive tasks, well-known solutions. Save your brain for the interesting problems.</p>
        <p><strong>❌ Mistake 10: Forgetting you&apos;re still the architect</strong> — Wrong: &quot;Just build me an app that does X&quot;. Right: &quot;Here&apos;s my plan: [architecture]. Start with authentication using Supabase.&quot; You make the decisions. AI implements them. You&apos;re the senior engineer. AI is the junior dev who codes fast.</p>
      </>
    )
  },
  {
    id: 'best-practices-design',
    title: 'Design Smart',
    content: (
      <>
        <p>
          The magic happens when Figma and Cursor work together. Here's how to translate your designs into code effectively.
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

        <h3>Design Best Practices for .cursorrules</h3>
        <p>Add these rules to your <code>.cursorrules</code> file to ensure consistent design implementation:</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`# Design Best Practices

## Before Building UI
- Always read the design best practices file (e.g., docs/design-best-practices.md) before implementing any UI
- Extract and reference design tokens (colors, spacing, typography) from the design system
- Check for existing components that match or can be extended

## During Implementation
- Match Figma designs pixel-perfectly unless responsive adjustments are needed
- Use semantic HTML elements (button, nav, article, etc.)
- Implement mobile-first responsive design
- Ensure all interactive elements have proper hover/focus/active states

## Accessibility
- Include proper alt text for images
- Ensure sufficient color contrast (WCAG AA minimum)
- Support keyboard navigation
- Use ARIA labels where semantic HTML is insufficient`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <h3>Creating a Design Best Practices File</h3>
        <p>
          For larger projects, create a dedicated <code>docs/design-best-practices.md</code> file that Cursor reads before implementing UI.
          This gives you a single source of truth for design decisions. Here's an example structure:
        </p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`# Design Best Practices (Builder Guide)

**Purpose**: Internal guide for Cursor to translate sparse product requirements into consistent, modern UI choices.

---

## Decision Order (Highest Priority Wins)

1. **Brand voice**: \`docs/brand/voice.md\`
2. **Platform**: iOS-first (HIG defaults), Android later (Material defaults)
3. **Existing screens**: match current typography, spacing, and button styles
4. **Accessibility**: minimum touch target + contrast
5. **Performance**: avoid heavy animations unless asked

---

## Default UI Choices (When User Gives Minimal Input)

### Layout Defaults
- **Page padding**: 20px horizontal, 20px vertical
- **Section spacing**: 24px between major blocks
- **Title -> subtitle**: 8px
- **Subtitle -> content**: 32-40px
- **Background**: white (\`#fff\`)

### Typography Defaults
- **Title**: 32px, bold, \`#000\`
- **Subtitle**: 16px, regular, \`#666\`
- **Body**: 16px, regular, \`#000\`
- **Small**: 14px, regular, \`#666\`

### Button Defaults
- **Primary**: full-width, \`#000\` bg, \`#fff\` text, 16px padding, radius 8
- **Secondary**: full-width, outline \`#000\`, radius 8, 16px padding
- **Destructive**: \`#ff3b30\` bg, white text

### Input Defaults
- **TextInput**: 1px border \`#ddd\`, radius 8, padding 16, font 16

---

## Motion Defaults

- **Tap feedback**: scale 0.98 or opacity 0.8 (200ms)
- **Screen transitions**: standard stack push
- **List items**: simple fade-in (200-300ms)
- **Avoid**: heavy shared-element transitions unless asked

---

## State Defaults

- **Loading**: spinner for simple screens, skeleton for lists
- **Empty**: title + short helper text + primary CTA
- **Error**: short error text + retry action

---

## Accessibility Defaults

- **Touch targets**: minimum 44x44
- **Contrast**: WCAG AA for text on backgrounds
- **Labels**: add accessibility labels on icon-only buttons`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <p>
          Then in your <code>.cursorrules</code>, add: <code>Before implementing any UI, read docs/design-best-practices.md</code>.
          This ensures Cursor applies your design system consistently without you having to repeat specifications.
        </p>
      </>
    )
  },
  {
    id: 'best-practices-errors',
    title: 'Error Handling',
    content: (
      <>
        <p>
          One of the most powerful ways to improve your vibe coding workflow is to make your AI assistant autonomous when handling errors.
          Instead of copying and pasting error messages back and forth, configure your assistant to debug independently.
        </p>

        <h3>Autonomous Error Resolution</h3>
        <p>Add this to your <code>.cursorrules</code> file:</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`# Autonomous Error Resolution

When you encounter an error after attempting a solution:
1. DO NOT wait for me to copy-paste errors or ask you to fix them
2. Automatically read error messages, logs, or console output
3. Analyze the root cause
4. Implement a fix
5. Test the fix
6. If still broken, iterate autonomously up to 3 times
7. Only stop to ask if you've tried 3 approaches without success

Default mode: Keep going until it works. Don't ask permission to debug.

Exception: If the error suggests a fundamental misunderstanding of requirements, stop and clarify.`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <h3>Why This Works</h3>
        <ul>
          <li><strong>Faster iteration</strong> - No waiting for you to copy errors back into the chat</li>
          <li><strong>Better context</strong> - The AI can see the full error message and surrounding code</li>
          <li><strong>Compound fixes</strong> - Sometimes fixing one error reveals another; autonomous mode handles the chain</li>
          <li><strong>Less context pollution</strong> - Error messages don't fill up your chat history</li>
        </ul>

        <h3>When to Intervene</h3>
        <p>The AI should stop and ask you when:</p>
        <ul>
          <li>It has tried 3 different approaches without success</li>
          <li>The error suggests a misunderstanding of what you're trying to build</li>
          <li>The fix requires access to external systems (databases, APIs) it can't reach</li>
          <li>The error is in a file or area you haven't given it permission to modify</li>
        </ul>
      </>
    )
  },
  {
    id: 'best-practices-action',
    title: 'Action over Explanation',
    content: (
      <>
        <p>
          When your AI assistant has access to tools via MCP or other integrations, it should use them directly
          instead of giving you instructions. This is one of the most impactful rules you can add.
        </p>

        <h3>The Rule</h3>
        <p>Add this to your Cursor Settings → Rules for AI (or <code>.cursorrules</code>):</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`When you have access to tools via MCP or other integrations, ALWAYS use them directly instead of giving me instructions.

If you can execute an action yourself (create files, run SQL, make API calls, etc.), do it immediately. Never say "go to X and do Y" - just do Y yourself.

Only give me manual instructions when you literally cannot perform the action (e.g., requires physical access, external authentication you don't have).

Default to action, not explanation.`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <h3>Why This Matters</h3>
        <ul>
          <li><strong>Faster workflow</strong> - No copy-pasting commands or navigating to external tools</li>
          <li><strong>Fewer errors</strong> - The AI executes precisely; you might make typos or miss steps</li>
          <li><strong>True automation</strong> - You're leveraging the full power of MCP integrations</li>
          <li><strong>Less context switching</strong> - Stay in your editor instead of jumping between apps</li>
        </ul>

        <h3>Examples</h3>
        <p><strong>Without this rule:</strong> "Go to Vercel and check your deployment status..."</p>
        <p><strong>With this rule:</strong> The AI uses the Vercel MCP to check status and reports back directly.</p>

        <p><strong>Without this rule:</strong> "Run this SQL query in Supabase..."</p>
        <p><strong>With this rule:</strong> The AI executes the query via Supabase MCP and shows you the results.</p>
      </>
    )
  },
  {
    id: 'memory-context',
    title: 'Memory & Context',
    content: (
      <>
        <p>
          AI coding assistants have limited context windows—the amount of information they can "see" in a single conversation.
          Without proper memory management, you'll find yourself repeating information, losing important context
          between sessions, and hitting token limits. This section covers two approaches to persistent memory,
          from simple to comprehensive.
        </p>

        <h3>Why Persistent Memory Matters</h3>
        <p>
          Every AI conversation has a context limit. Once you hit this limit, the AI can't see earlier parts of the conversation.
          More importantly, when you start a new chat session, the AI forgets everything from previous sessions unless you
          explicitly tell it to read certain files. By creating structured context files, you ensure important decisions,
          architecture choices, and project state persist across sessions.
        </p>

        <h3>Choose Your Approach</h3>
        <p>
          There are two main approaches to persistent memory. Choose based on your project complexity and team size:
        </p>
        <ul>
          <li><strong>Simple (Two-File)</strong> - Best for smaller projects, solo work, or when you need the wider team to quickly understand what decisions were made</li>
          <li><strong>Nuanced (Multi-File)</strong> - Best for substantial projects built over months, multiple people/AI sessions, or when you want to tell the story later</li>
        </ul>
      </>
    )
  },
  {
    id: 'memory-simple',
    title: 'Simple Approach',
    content: (
      <>
        <p>
          This process was used on the Dojo Brand Studio "AI Speedrun" project to keep things simple and for the wider team to understand what decisions were made.
        </p>

        <h3>Two-File Memory System</h3>
        <p>The simple approach uses just two files with distinct purposes:</p>

        <h4>AGENTS.md (Static Reference)</h4>
        <p>
          <code>AGENTS.md</code> is typically a static reference document—it defines the agent's role, capabilities, and operational guidelines.
          Think of it as the agent's job description and manual. It's meant to be relatively stable and consulted when the agent needs to understand "what am I and what should I do?"
        </p>
        <ul>
          <li>Project overview and tech stack</li>
          <li>Coding conventions and patterns to follow</li>
          <li>File structure guidelines</li>
          <li>Do's and don'ts for the codebase</li>
        </ul>

        <h4>changelog.md (Dynamic Log)</h4>
        <p>
          <code>changelog.md</code> (or similar names like <code>agent-diary.md</code>, <code>memory.md</code>) is a dynamic log that accumulates over time.
          The agent writes to it after tasks, documenting what it learned, decisions made, and context for future sessions.
          It's the agent's growing memory across interactions.
        </p>
        <ul>
          <li>Date-stamped entries of work completed</li>
          <li>Decisions made and why</li>
          <li>Problems encountered and solutions</li>
          <li>Context for future sessions</li>
        </ul>

        <h3>When to Use This Approach</h3>
        <ul>
          <li>Weekend projects or quick prototypes</li>
          <li>Solo development without complex handoffs</li>
          <li>When you need team members to quickly scan what happened</li>
          <li>Projects where simplicity beats comprehensiveness</li>
        </ul>

        <h3>Setup</h3>
        <p>Ask your AI assistant to create these files, or create them manually:</p>
        <ol>
          <li>Create <code>AGENTS.md</code> in your project root with your project overview and guidelines</li>
          <li>Create <code>changelog.md</code> (or <code>docs/changelog.md</code>) for the dynamic log</li>
          <li>Tell the AI to read <code>AGENTS.md</code> at session start and append to <code>changelog.md</code> after completing tasks</li>
        </ol>
      </>
    )
  },
  {
    id: 'memory-nuanced',
    title: 'Nuanced Approach',
    content: (
      <>
        <p>
          This process was used for the creation of Orbit, to keep different concerns in separate files so it's easier to understand for a human.
          In turn, these separate docs were used in the local-only wiki.
        </p>

        <h3>Multi-File Memory Architecture</h3>
        <p>
          This approach separates agent context into specialized files by purpose, rather than a single static reference + single dynamic log.
          Each file serves a distinct cognitive function, making it easier for AI assistants to find relevant context quickly and for humans to maintain documentation over time.
        </p>

        <h3>Core Files</h3>

        <h4>AGENTS.md (Entry Point)</h4>
        <p>
          The entry point and quick reference—a summary document that AI assistants read first to get oriented.
          It contains key decisions (with brief rationale), architecture principles, current project status, and pointers to detailed files.
          Think of it as the "executive summary" that tells the agent what it needs to know to start working, without requiring it to read everything.
          It's updated when decisions change, but kept concise—details live elsewhere.
        </p>

        <h4>DECISIONS.md (Why)</h4>
        <p>
          A chronological append-only log of all decisions with full context. Each entry includes:
        </p>
        <ul>
          <li>Date and decision summary</li>
          <li>Context (why this needed deciding)</li>
          <li>Rationale (why this option)</li>
          <li>Alternatives considered</li>
          <li>Trade-offs accepted</li>
          <li>Owner and status</li>
        </ul>
        <p>
          This is the source of truth for "why did we do it this way?" and prevents revisiting settled decisions.
          AI assistants check this before proposing approaches.
        </p>

        <h4>JOURNEY.md (Story)</h4>
        <p>
          Captures the narrative and meta-story—origin story, milestones, challenges overcome, wins celebrated, and reflections over time.
          It's the human layer: what sparked the idea, how the team dynamics evolved, what surprised you, what you learned.
          This file is for storytelling and motivation, not operational reference. It's what you'll share with investors, press, or future team members.
        </p>

        <h4>ROADMAP.md (What)</h4>
        <p>
          Defines what's being built and when—phases, features per version, success criteria, and explicit "what we're NOT building yet" lists.
          It keeps scope creep at bay and gives AI assistants context for prioritization. Updated as phases complete or priorities shift.
        </p>

        <h4>RESEARCH.md (Context)</h4>
        <p>
          Holds problem space exploration, competitive analysis, user research, market data, and inspiration.
          It's the "homework" file—everything you learned that informed decisions but doesn't belong in the decision log itself.
          AI assistants reference this for context on why certain directions were chosen.
        </p>

        <h3>How The Files Work Together</h3>
        <div className="code-block-wrapper">
          <pre><code>{`┌─────────────────────────────────────────────────────────┐
│  AGENTS.md (read first)                                 │
│  "Here's what you need to know to start working"        │
│  - Key decisions (summarized)                           │
│  - Current status                                       │
│  - Pointers to detail files                             │
└─────────────────────┬───────────────────────────────────┘
                      │ references
          ┌───────────┼───────────┬─────────────┐
          ▼           ▼           ▼             ▼
┌─────────────┐ ┌───────────┐ ┌─────────┐ ┌──────────┐
│ DECISIONS   │ │ ROADMAP   │ │ JOURNEY │ │ RESEARCH │
│ (why)       │ │ (what)    │ │ (story) │ │ (context)│
│             │ │           │ │         │ │          │
│ Full        │ │ Phases    │ │ Origin  │ │ Market   │
│ decision    │ │ Features  │ │ Wins    │ │ Comps    │
│ records     │ │ Success   │ │ Lessons │ │ Users    │
│ w/ context  │ │ criteria  │ │ Quotes  │ │ Data     │
└─────────────┘ └───────────┘ └─────────┘ └──────────┘
     ▲               ▲             ▲            ▲
     │               │             │            │
     └───────────────┴─────────────┴────────────┘
              All append-only or semi-static
              (updated incrementally, never wiped)`}</code></pre>
        </div>

        <h3>Why This Works Better Than Simple</h3>
        <ul>
          <li><strong>Separation of concerns</strong> - Decisions, roadmap, narrative, and research serve different cognitive needs. Splitting them means you always know where to look (and where to write).</li>
          <li><strong>Scalability</strong> - A single changelog becomes unwieldy fast. Separate files can grow independently without becoming a wall of text.</li>
          <li><strong>AI efficiency</strong> - Agents can read only what they need. Working on a feature? Read AGENTS.md + ROADMAP.md. Questioning a past choice? Read DECISIONS.md. Understanding competitive positioning? Read RESEARCH.md.</li>
          <li><strong>Human maintainability</strong> - It's clear what goes where. New decision? DECISIONS.md. Shipped something? JOURNEY.md. Found relevant research? RESEARCH.md. No ambiguity.</li>
          <li><strong>Narrative preservation</strong> - JOURNEY.md keeps the story intact. In the simple approach, the narrative gets buried in operational entries.</li>
        </ul>

        <h3>Workflow for AI Assistants</h3>
        <p>Per the AGENTS.md instructions:</p>
        <ul>
          <li><strong>Before starting work:</strong> Read AGENTS.md first for quick context, check DECISIONS.md before suggesting new approaches</li>
          <li><strong>When making decisions:</strong> Update DECISIONS.md with full entry, update AGENTS.md summary, conditionally update other files if relevant</li>
          <li><strong>Don't defer updates</strong> - update files as decisions are made, not later</li>
          <li><strong>Cross-reference</strong> - always link between files</li>
        </ul>

        <h3>When to Use This Approach</h3>
        <ul>
          <li>Building something substantial over months (not a weekend project)</li>
          <li>Multiple people (or AI sessions) need to pick up context quickly</li>
          <li>You want to tell the story later (investors, users, team members)</li>
          <li>Decisions need clear documentation for "why did we do it this way?"</li>
          <li>You're using AI tools extensively and need to manage context efficiently</li>
        </ul>

        <p>
          <strong>Note:</strong> For simpler projects, the two-file approach (Simple) may be sufficient.
          This architecture adds overhead that pays off at scale.
        </p>
      </>
    )
  },
  {
    id: 'memory-cursor-setup',
    title: 'Cursor Setup',
    content: (
      <>
        <p>
          If you're using Cursor, here's how to configure it to work with your persistent memory files automatically
          using <code>.cursorrules</code>.
        </p>

        <h3>How .cursorrules Works</h3>
        <p>
          <code>.cursorrules</code> is a special file that Cursor automatically reads when it starts working in your project.
          Think of it as instructions that tell Cursor how to behave in your codebase. When you create a <code>.cursorrules</code>
          file in your project root, Cursor reads it automatically—no configuration needed.
        </p>

        <h3>Setup for Simple Approach</h3>
        <p>Copy and paste this prompt into Cursor:</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`Create a \`.cursorrules\` file in the project root with the following content:

# Cursor Rules for Persistent Memory

## Session Start
- At the start of EVERY new chat session, automatically read \`AGENTS.md\` to understand project context
- If \`AGENTS.md\` doesn't exist, offer to create it

## After Completing Tasks
- Append an entry to \`changelog.md\` documenting:
  - Date and what was done
  - Any decisions made and why
  - Context for future sessions
- Keep entries concise but informative

## File References
- ALWAYS prefer referencing specific files over pasting large code blocks
- Use file paths and line numbers when discussing code (format: \`path/to/file.js:12\`)`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <h3>Setup for Nuanced Approach</h3>
        <p>Copy and paste this prompt into Cursor:</p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`Create a \`.cursorrules\` file in the project root with the following content:

# Cursor Rules for Multi-File Memory

## Session Start
- At the start of EVERY new chat session, read \`AGENTS.md\` first for quick context
- Check \`DECISIONS.md\` before suggesting new approaches

## When Making Decisions
- Update \`DECISIONS.md\` with full entry (date, decision, context, rationale, alternatives, trade-offs)
- Update \`AGENTS.md\` summary if the decision affects project overview
- Update \`ROADMAP.md\` if the decision affects what's being built
- Update \`JOURNEY.md\` for significant milestones or wins

## File Reading by Task Type
- Working on a feature: AGENTS.md + ROADMAP.md
- Questioning a past choice: DECISIONS.md
- Understanding competitive positioning: RESEARCH.md
- Adding milestone or win: JOURNEY.md

## Important Rules
- Don't defer updates—update files as decisions are made, not later
- Cross-reference between files when relevant
- Keep AGENTS.md concise—details live in other files
- DECISIONS.md is append-only (never edit past entries)

## File References
- ALWAYS prefer referencing specific files over pasting large code blocks
- Use file paths and line numbers when discussing code (format: \`path/to/file.js:12\`)`}</code></pre>
          <button className="copy-button" aria-label="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <h3>Monitoring Context Usage</h3>
        <p>Cursor shows context usage and can warn you when approaching limits:</p>
        <ul>
          <li><strong>Token Counter</strong> - Visible at the bottom of the chat panel showing tokens used vs. available</li>
          <li><strong>Warning Signs</strong> - Model repetition, forgetting recent decisions, generic responses</li>
          <li><strong>When Full</strong> - Start a new chat; the AI will read your memory files to catch up</li>
        </ul>

        <p>
          <strong>Pro tip:</strong> Pin your primary memory file (e.g., <code>AGENTS.md</code> or <code>docs/ai-context.md</code>) in Cursor (right-click → Pin)
          so it's always visible and you can see when it's updated.
        </p>
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
    id: 'supabase-mcp',
    title: 'Power Move: Connect Cursor Directly to Supabase',
    content: (
      <>
        <p>This is the difference between vibe coding and regular coding.</p>
        <p><strong>Instead of:</strong></p>
        <ol>
          <li>Writing SQL in Cursor</li>
          <li>Copying it</li>
          <li>Opening Supabase dashboard</li>
          <li>Pasting into SQL editor</li>
          <li>Running it manually</li>
          <li>Going back to Cursor</li>
        </ol>
        <p><strong>You do this:</strong></p>
        <ol>
          <li>&quot;Create a users table with email and name columns&quot;</li>
          <li>Cursor does it</li>
        </ol>
        <h3>What Supabase MCP Enables</h3>
        <ul>
          <li>Cursor can read your database schema</li>
          <li>Cursor can execute SQL directly</li>
          <li>Cursor can create tables, add columns, run migrations</li>
          <li>Cursor can add RLS (Row Level Security) policies</li>
          <li>You never leave your editor</li>
        </ul>
        <h3>Setup (5 minutes)</h3>
        <h4>Step 1: Get your Supabase credentials</h4>
        <p>Go to your Supabase project: Settings → API. Copy Project URL (e.g. <code>https://xxxxx.supabase.co</code>) and the <strong>service_role</strong> key (NOT the anon key).</p>
        <h4>Step 2: Add to Cursor MCP config</h4>
        <p>Mac: <code>~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json</code></p>
        <p>Windows: <code>%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json</code></p>
        <div className="code-block-wrapper">
          <pre><code className="copyable-code">{`{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase",
        "YOUR_PROJECT_URL",
        "YOUR_SERVICE_ROLE_KEY"
      ]
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
        <p>Replace <code>YOUR_PROJECT_URL</code> and <code>YOUR_SERVICE_ROLE_KEY</code> with your actual values.</p>
        <h4>Step 3: Restart Cursor</h4>
        <p>Close and reopen Cursor completely.</p>
        <h3>Now You Can Say</h3>
        <ul>
          <li><strong>&quot;Create a users table with email and name columns&quot;</strong> → Cursor creates it in Supabase</li>
          <li><strong>&quot;Add RLS policies to the people table so users can only see their own data&quot;</strong> → Cursor adds the policies</li>
          <li><strong>&quot;Show me all tables in the database&quot;</strong> → Cursor shows you the schema</li>
          <li><strong>&quot;Add a profile_photo_url column to users table&quot;</strong> → Cursor runs the migration</li>
          <li><strong>&quot;Create a hangouts table with user_id, date, and notes columns&quot;</strong> → Cursor creates it with proper foreign keys</li>
        </ul>
        <h3>Why This Matters</h3>
        <p>Without MCP: You&apos;re a translator between AI and tools. With MCP: AI operates the tools directly. This is vibe coding. You describe what you want. The AI does it. No more copying and pasting SQL, switching between windows, or manual migrations. Just: &quot;Make it so&quot; and it happens.</p>
        <h3>Troubleshooting</h3>
        <p><strong>&quot;MCP server not found&quot;</strong> — Restart Cursor completely. Check the file path for your OS. Verify the JSON is valid (no trailing commas).</p>
        <p><strong>&quot;Authentication failed&quot;</strong> — Use service_role key, not anon key. Check project URL has no trailing slash.</p>
        <p><strong>&quot;Command not found: npx&quot;</strong> — Install Node.js from nodejs.org and restart terminal/Cursor.</p>
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
    id: 'example-projects',
    title: 'Example Projects',
    content: (
      <>
        <p>Links to real examples built with vibe coding:</p>
        <ul>
          <li><a href="https://cursor.sh/docs" target="_blank" rel="noopener noreferrer">Cursor Documentation</a></li>
          <li><a href="https://www.figma.com/developers" target="_blank" rel="noopener noreferrer">Figma Developer Resources</a></li>
          <li><a href="https://vercel.com/docs" target="_blank" rel="noopener noreferrer">Vercel Documentation</a></li>
          <li><a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer">Supabase Documentation</a></li>
          <li><a href="https://github.com/modelcontextprotocol" target="_blank" rel="noopener noreferrer">MCP GitHub</a></li>
        </ul>
      </>
    )
  },
  {
    id: 'real-example',
    title: 'Real Example: Building Authentication in 5 Minutes',
    content: (
      <>
        <p>Here&apos;s what vibe coding looks like for a real feature.</p>
        <h3>Step 1: Strategy in Claude</h3>
        <p><strong>You:</strong> &quot;I need to add authentication to my React Native app. Should I use Supabase Auth or build custom?&quot;</p>
        <p><strong>Claude:</strong> For an MVP, use Supabase Auth. Production-ready security, email/password + OAuth built-in, Row Level Security, generous free tier. 5 minutes to implement vs 5 days custom. You can migrate later if you outgrow it.</p>
        <p><strong>You:</strong> &quot;Sold. What&apos;s the implementation plan?&quot;</p>
        <p><strong>Claude:</strong> 1) Install Supabase client. 2) Configure Supabase in your app. 3) Create login/signup screens. 4) Add Google Sign-In. 5) Set up auth state management. 6) Add protected routes. 7) Test the flow.</p>
        <h3>Step 2: Implementation in Cursor</h3>
        <p><strong>You (in Cursor):</strong> &quot;Add Supabase authentication with email/password and Google Sign-In to the app. Use the plan from Claude.&quot;</p>
        <p><strong>Cursor</strong> (reads AGENTS.md, sees React Native + Expo + Supabase): Installs @supabase/supabase-js, creates lib/supabase.ts, screens/LoginScreen.tsx, SignupScreen.tsx, adds Google Sign-In button, sets up auth state in App.tsx, adds protected route logic, updates AGENTS.md.</p>
        <p><strong>5 minutes later:</strong> Working authentication.</p>
        <h3>Step 3: Test and Refine</h3>
        <p>You test it. Login works. Signup works. Google Sign-In works. You notice error messages are generic.</p>
        <p><strong>You (in Cursor):</strong> &quot;Improve error messages to be user-friendly. &apos;Invalid credentials&apos; instead of error codes.&quot;</p>
        <p><strong>Cursor:</strong> Updates error handling with friendly messages. Done.</p>
        <h3>What Just Happened</h3>
        <ul>
          <li><strong>Planning:</strong> 2 minutes with Claude</li>
          <li><strong>Implementation:</strong> 5 minutes with Cursor</li>
          <li><strong>Refinement:</strong> 1 minute with Cursor</li>
          <li><strong>Total:</strong> 8 minutes</li>
        </ul>
        <p>Traditional approach: 2–4 hours minimum. That&apos;s vibe coding. You focused on the decision (which auth to use). AI handled implementation. Now you can ship.</p>
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

// Exclude old memory sections (replaced by project-memory-system)
const excludedSectionIds = ['memory-context', 'memory-simple', 'memory-nuanced', 'memory-cursor-setup']
export const sections = allSections.filter(s => !excludedSectionIds.includes(s.id))

// Navigation labels for sidebar
export const navLabels = {
  'overview': 'Tech Stack',
  'contribute': 'Contribute',
  'workflow': 'The Actual Workflow',
  'prerequisites': 'Pre-reqs',
  'claude-setup': 'Claude',
  'next-steps': 'Next Steps',
  'github-repository-setup': 'Github',
  'vercel-deployment': 'Vercel',
  'cursor-setup': 'Cursor',
  'supabase-mcp': 'Supabase MCP',
  'best-practices': 'Best Practices',
  'project-memory-system': 'Project Memory',
  'when-to-use-which-tool': 'When to Use Which Tool',
  'common-mistakes': 'Common Mistakes',
  'best-practices-design': 'Design Smart',
  'best-practices-errors': 'Error Handling',
  'best-practices-action': 'Action over Explanation',
  'example-projects': 'Example Projects',
  'real-example': 'Real Example'
}

// Sections that should be nested under Prerequisites
export const nestedSections = [
  'claude-setup',
  'github-repository-setup',
  'vercel-deployment',
  'cursor-setup'
]

// Sections that should be nested under Best Practices
export const bestPracticesNestedSections = [
  'project-memory-system',
  'when-to-use-which-tool',
  'common-mistakes',
  'best-practices-design',
  'best-practices-errors',
  'best-practices-action'
]

// No longer used (memory consolidated into project-memory-system)
export const memoryNestedSections = []
