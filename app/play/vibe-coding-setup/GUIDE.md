# Vibe Coding Setup Guide

> **Note:** This is an exported version of the guide for easier contribution and review.
> Original source: `app/play/vibe-coding-setup/content.js`
> 
> Last exported: 2026-01-20T17:02:29.416Z

---

## Get the vibes right (man).

This guide will walk you through setting up everything you need to start vibe coding with Figma designs.
          Vibe coding is about creating a seamless workflow between design and development, allowing you to quickly
          translate Figma designs into working code with the help of AI-powered tools.

        By the end of this tutorial, you'll have a complete development environment that connects Figma, Cursor,
          GitHub, and Vercel into a cohesive workflow. We'll also cover Supabase (optional) if you need backend functionality.

---

## Prerequisites

Before you begin, make sure you have the following accounts and software ready:

        
        
### Required Accounts

        - **GitHub account** - For version control and repository hosting
- **Vercel account** - For deployment and hosting (free tier available)
- **Supabase account (optional)** - For backend services if you need a database or authentication (free tier available)
- **Figma account** - For design files (free tier available)

        
### Required Software

        - **Cursor** - AI-powered code editor (download from cursor.sh)
- **Node.js (optional)** - Version 18 or higher (only needed if you're using Next.js or React)

---

## GitHub Repository Setup

GitHub will serve as your version control system and the source of truth for your code.
          It also integrates seamlessly with Vercel for automatic deployments.

        
### Creating a New Repository

        1. Go to [github.com/new](https://github.com/new)
2. Choose a repository name (e.g., "my-vibe-project")
3. Set it to Public or Private based on your preference
4. Initialize with a README if you want a starting point
5. Click "Create repository"

        
### Connecting GitHub to Cursor via MCP

        Once you have your repository, connect it to Cursor so you can work with it directly:

        1. In Cursor, open Settings (Cmd/Ctrl + ,)
2. Navigate to "Features" → "Model Context Protocol"
3. Click "Add Server" or edit existing configuration
4. Add the GitHub MCP server configuration

        You'll need a GitHub Personal Access Token. Ask Cursor to help you create one, or follow these steps:

        1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Cursor MCP")
4. Select scopes: `repo`, `read:org`, `read:user`
5. Generate and copy the token
6. Add it to Cursor's MCP configuration

        Example GitHub MCP configuration (Cursor can help you set this up):

        
```

    }
  }
}
```

        **Pro tip:** Instead of manually cloning repositories, ask Cursor to help you clone your GitHub repo.
        Just paste the repository URL and ask Cursor to clone it for you.

---

## Vercel Deployment

Vercel provides seamless deployment from GitHub with automatic previews for every push.
          It works with different types of projects, and it's important to understand the differences.

        
### Understanding Project Types

        Vercel can deploy different kinds of projects:

        - **Static Sites** - Simple HTML, CSS, and JavaScript files. No server needed.
          Perfect for landing pages, portfolios, or simple websites. Just upload your files and they're live.
- **React Apps** - Interactive web applications built with React. These need to be built
          (compiled) before deployment. Vercel handles this automatically.
- **Next.js Apps** - A framework built on React that adds features like server-side rendering,
          routing, and API routes. Next.js projects can be more complex but offer more features out of the box.

        For vibe coding, you can start with a simple static site (just HTML/CSS/JS) or jump into Next.js if you want
        more features. Cursor can help you decide which is right for your project.

        
### Connecting GitHub Repository

        1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Select your GitHub repository from the list
4. Vercel will auto-detect your project type (Next.js, React, or static site)
5. Click "Deploy"

        
### Environment Variables

        If your project needs API keys or other secrets (like Supabase keys), you'll need to add them as environment variables.
        Instead of doing this manually, ask Cursor to help you set up environment variables. Just tell Cursor what keys you need,
        and it can guide you through the process or even help you create the configuration files.

        In Vercel dashboard:

        1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add variables for each environment (Production, Preview, Development)

        Then access them in your code (Cursor can help you with this syntax):

        
```
// Next.js
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

        
### Deployment Process

        Once connected, every push to your main branch triggers a production deployment.
        Pull requests get preview deployments automatically. You'll receive:

        - Production URL: `your-project.vercel.app`
- Preview URLs: `your-project-git-branch.vercel.app`
- Deployment status notifications

---

## Custom Domain Setup

Adding a custom domain gives your project a professional URL and makes it easier to share.
          This is completely optional - your Vercel URL works perfectly fine.

        
### DNS Configuration

        In your domain registrar (where you bought your domain):

        1. Add a CNAME record pointing to `cname.vercel-dns.com`
2. Or add A records pointing to Vercel's IP addresses (if CNAME not supported)
3. Wait for DNS propagation (can take up to 48 hours, usually much faster)

        
### Vercel Domain Settings

        1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Enter your domain name (e.g., `example.com` or `www.example.com`)
4. Vercel will verify DNS configuration
5. Once verified, your site will be live on your custom domain

---

## Connecting Figma to Cursor

The Figma MCP (Model Context Protocol) server allows Cursor to access your Figma designs,
          extract design details, and generate code based on your designs. This is the magic that makes vibe coding work.

        
### Getting Your Figma Personal Access Token

        First, you need to create a token that lets Cursor access your Figma files:

        1. Open Figma (desktop app or web)
2. Go to Figma → Settings → Account
3. Scroll down to "Personal access tokens"
4. Click "Create new token"
5. Give it a name (e.g., "Cursor MCP")
6. **Copy the token immediately** - you won't be able to see it again!

        
### Configuring Figma MCP in Cursor

        Now let's connect it to Cursor:

        1. Open Cursor settings (Cmd/Ctrl + ,)
2. Navigate to "Features" → "Model Context Protocol"
3. Click "Add Server" or edit existing configuration
4. Add the Figma MCP server configuration

        You'll need to add configuration that looks like this (Cursor can help you set this up if you ask):

        
```

    }
  }
}
```

        
### Sharing Your Figma File

        For Cursor to access your designs, your Figma file needs to be accessible:

        1. Open your Figma file
2. Click "Share" in the top right
3. Set permissions to "Can view" (this is enough for MCP access)
4. Copy the file URL - you can paste this in Cursor when asking about designs

        
### Testing the Connection

        Once configured, test the connection in Cursor:

        - Open a chat in Cursor
- Paste a Figma URL and ask: "Can you access this Figma design?"
- Or try: "Get the design context for this Figma file" (with the URL)
- If working, Cursor should be able to describe your designs and extract design details

        **Troubleshooting:** If it's not working, make sure your Figma file is shared (even if just with "Can view" permission)
        and that you've restarted Cursor after adding the MCP configuration.

---

## Cursor Setup

Cursor is an AI-powered code editor that integrates with Figma, GitHub, and other tools
          to streamline your development workflow. This is where the magic happens.

        
### Installing Cursor

        1. Go to [cursor.sh](https://cursor.sh)
2. Download for your operating system (macOS, Windows, Linux)
3. Install the application
4. Open Cursor and sign in (or create an account)

        That's it! Cursor comes ready to use. You can start asking it questions and writing code right away.

---

## Cursor Memory & Context Management

Cursor has a limited context window—the amount of information it can "see" in a single conversation.
          Without proper memory management, you'll find yourself repeating information, losing important context
          between sessions, and hitting token limits. This section shows you how to set up persistent memory
          that survives across sessions and how to monitor your context usage effectively.

        
### Why Persistent Memory Matters

        Every Cursor conversation has a context limit (typically 1M tokens for premium plans, less for free).
          Once you hit this limit, Cursor can't see earlier parts of the conversation. More importantly, when you
          start a new chat session, Cursor forgets everything from previous sessions unless you explicitly tell it
          to read certain files. By creating structured context files and configuring Cursor to reference them,
          you ensure important decisions, architecture choices, and project state persist across sessions.

        
### Quick Setup (Let Cursor Do It)

        After cloning a repository, simply ask Cursor:

        
```
"Set up persistent memory for this project. Create docs/ai-context.md 
and update .cursorrules to reference it."
```

        Cursor will create the necessary files and configure everything automatically. Once set up, Cursor will:

        - Automatically read `docs/ai-context.md` at the start of every new chat
- Automatically update `docs/ai-context.md` when you make architectural decisions
- Automatically monitor context usage and suggest new chats when needed

        Here's what gets created:

        
### What Gets Created

        1. **docs/ai-context.md** - Your persistent memory file that Cursor reads at the start of each session
2. **.cursorrules** - Configuration file that tells Cursor to always check `docs/ai-context.md`

        **Pro tip:** Pin `docs/ai-context.md` in your Cursor editor (right-click → Pin) so it's always visible.
          Cursor will automatically update it when you make important decisions—no manual work needed.

        
### Template Structure

        The `docs/ai-context.md` file should include:

        - **Project Overview** - What this project is, its purpose, tech stack
- **Key Decisions** - Important architectural choices, why they were made
- **Architecture Notes** - How the codebase is organized, important patterns
- **Current State** - What's working, what's in progress, known issues
- **Important Context** - Domain knowledge, business rules, edge cases

        Ask Cursor to create this file with a starter template, or reference the example in this repo.
          Once configured, Cursor automatically updates it when you make architectural decisions, introduce new patterns,
          or solve important problems—you don't need to remember to update it manually.

        
### Monitoring Context Usage

        Cursor automatically monitors context usage and shows you:

        - **Token Counter** - Visible at the bottom of the chat panel showing tokens used vs. available
- **Automatic Warnings** - Cursor proactively warns you when approaching limits (80%+ usage)
- **Automatic Detection** - Cursor watches for warning signs and suggests starting a new chat when needed

        
### Warning Signs (Cursor Detects These Automatically)

        Cursor automatically watches for these indicators that context is getting exhausted:

        - **Model repetition** - If Cursor notices itself repeating the same things, it may have lost earlier context
- **Forgetting recent decisions** - When Cursor asks about things you just discussed, it's a sign context is full
- **Can't see earlier code** - References to files or functions from earlier in the conversation fail
- **Token counter near limit** - At 80%+ usage, Cursor automatically suggests starting a new chat
- **Generic responses** - When Cursor gives generic answers instead of project-specific ones, context may be exhausted

        When Cursor detects these signs, it will automatically suggest: "Context is getting full. Let's start a new chat—I'll read
          `ai-context.md` to catch up."

        
### How It Works (Automatically)

        Once you have `.cursorrules` configured, Cursor handles everything automatically:

        - **Automatic session kickoff** - At the start of every new chat, Cursor automatically reads
            `docs/ai-context.md` to understand project context. No manual prompt needed.
- **Automatic context updates** - When you make architectural decisions, introduce new patterns,
            or solve important problems, Cursor automatically updates `ai-context.md` with the decision and reasoning.
            It won't update for small changes—only meaningful decisions.
- **Automatic context monitoring** - Cursor watches token usage and proactively suggests starting
            a new chat when context gets full (80%+). When you start fresh, it automatically reads `ai-context.md`
            to catch up.
- **Strategic file references** - Cursor automatically prefers referencing specific files over
            pasting large code blocks, keeping context usage efficient.
- **Focused context file** - Cursor keeps `ai-context.md` focused on essential information:
            decisions, architecture, and current state. It won't dump everything in—code comments and documentation belong elsewhere.
- **Team handoffs** - For team projects, `ai-context.md` serves as an automatic handoff document.
            When someone new joins or you switch contexts, that file brings them up to speed automatically.

        
### No Manual Work Required

        With `.cursorrules` properly configured, you don't need to do anything manually:

        - **No kickoff prompts needed** - Cursor automatically reads `docs/ai-context.md`
            at the start of every new chat session
- **No manual updates** - Cursor automatically updates `ai-context.md` when you make
            architectural decisions, introduce patterns, or solve important problems
- **No context monitoring** - Cursor watches token usage and proactively suggests when to start
            a new chat

        Just work normally—Cursor handles the memory management behind the scenes. The goal is to make this completely
          seamless so you can focus on building, not managing context.

        
### Example Workflow

        1. Clone a new repository
2. Ask Cursor: "Set up persistent memory for this project"
3. Cursor creates `docs/ai-context.md` and `.cursorrules` automatically
4. Pin `docs/ai-context.md` in your editor (optional, but helpful to see what Cursor is tracking)
5. Work normally—Cursor automatically updates `ai-context.md` when you make architectural decisions
6. When starting new chats, Cursor automatically reads `ai-context.md` to get context
7. Cursor monitors token usage and suggests new chats when context gets full

        **Remember:** The best memory system is one that works automatically. Once set up, you don't need to
          think about it—Cursor handles reading, updating, and monitoring context so you can focus on building.

---

## Figma & Cursor

The magic happens when Figma and Cursor work together. Here's how to translate your designs into code.

        
### Example Workflow

        Let's say you have a button design in Figma and want to code it:

        1. In Figma, select the button frame or component you want to code
2. Copy the Figma URL (or the node ID from the URL)
3. In Cursor, paste the URL and ask: "Create an HTML button that matches this Figma design"
4. Cursor will access the Figma design, extract the colors, spacing, typography, and generate the code
5. Review the code, make adjustments if needed, and ask Cursor to refine it

        Example prompts you can try:

        - "Create a React component based on this Figma design: [paste URL]"
- "What are the exact colors and spacing used in this Figma frame?"
- "Generate CSS for this button design from Figma"
- "Create a Next.js page that matches this Figma layout"
- "Extract the design tokens (colors, fonts, spacing) from this Figma file"

        
### Best Practices in Figma

        To make vibe coding easier, use these Figma features:

        - **Auto Layout** - Use Auto Layout for frames so Cursor can better understand spacing and relationships between elements
- **Name layers clearly** - Use descriptive names that match your component structure (e.g., "Button", "Card", "Header")
- **Use components** - Create reusable components for buttons, cards, etc. This helps Cursor understand your design system
- **Organize with frames** - Group related elements in frames so Cursor can understand the layout structure

---

## Do it live!

To see your changes in real-time, you'll need to run a local development server.
          The good news: Cursor can help you set this up and fix any issues that come up.

        
### Setting Up Your Project

        Instead of running commands manually, ask Cursor to help you:

        - **For Next.js:** "Help me create a new Next.js project" or "Set up a Next.js development server"
- **For static sites:** "Help me set up a local server for my HTML files"
- **For React:** "Create a new React project" or "Set up a React development environment"

        Cursor can create the project structure, install dependencies, and get everything running for you.

        
### When Things Go Wrong

        If your server won't start or you see errors, Cursor can help:

        1. Open the terminal in Cursor (View → Terminal, or the terminal panel at the bottom)
2. If you see an error message, select it (highlight the text)
3. Ask Cursor: "This error appeared when I tried to start my dev server. Can you help fix it?"
4. Or paste the error and ask: "What does this error mean and how do I fix it?"

        **Common issues Cursor can help with:**

        - Port already in use (e.g., "Address already in use" error) - Cursor can help you find what's using the port or switch to a different one
- Missing dependencies - Cursor can help install what's needed
- Configuration errors - Cursor can help fix config files
- Build errors - Select the error message and ask Cursor to explain and fix it

        The key is: if Cursor can do it, let it. Don't struggle with command line errors when you can just ask for help.

---

## Extensions

Extensions can enhance your Cursor experience. Here are some that might be useful for vibe coding
          and web development. (Note: I haven't used all of these, so I'm curious how well they work!)

        
### Recommended Extensions List

        - **Prettier** - Code formatter for consistent styling
- **ESLint** - JavaScript linter for code quality
- **Tailwind CSS IntelliSense** - Autocomplete for Tailwind classes
- **GitLens** - Enhanced Git capabilities and blame annotations
- **Error Lens** - Inline error highlighting
- **Auto Rename Tag** - Automatically rename paired HTML/JSX tags
- **Path Intellisense** - Autocomplete for file paths
- **Color Highlight** - Highlight color codes in your code
- **Bracket Pair Colorizer** - Color matching brackets
- **Live Server** - Launch a development server with live reload

        
### Installation Instructions

        1. Open Cursor
2. Press `Cmd/Ctrl + Shift + X` to open Extensions view
3. Search for the extension name
4. Click "Install"
5. Some extensions may require a reload (click "Reload" when prompted)

        **Tip:** Ask Cursor to help you set up extensions if you're not sure which ones you need or how to configure them.

---

## What About Backend? (Optional)

If your project needs a database, user authentication, or other backend features,
          Supabase is a great option. It's like having a backend without managing servers yourself.

        
### What is Supabase?

        Supabase provides:

        - **PostgreSQL database** - A full-featured database (think of it like a spreadsheet, but much more powerful)
- **Built-in authentication** - Let users sign up and log in (email, social logins, magic links)
- **Real-time subscriptions** - Your app can update instantly when data changes
- **Storage** - Upload and manage files (images, documents, etc.)
- **Auto-generated APIs** - Supabase automatically creates APIs from your database, so you don't have to write backend code
- **Free tier** - Generous limits for personal projects

        
### Creating a Supabase Project

        Ask Cursor to help you set up Supabase, or follow these steps:

        1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose an organization (or create one)
4. Enter project name and database password
5. Select a region closest to your users
6. Click "Create new project" (takes 1-2 minutes)

        
### Getting Your API Keys

        Once your project is ready:

        1. Go to Project Settings → API
2. Copy your Project URL (e.g., `https://xxxxx.supabase.co`)
3. Copy your anon/public key (safe for client-side use)
4. Copy your service_role key (keep secret, server-side only)

        **Pro tip:** Ask Cursor to help you set up Supabase in your project. Just tell Cursor you want to use Supabase,
        and it can help you install the client library and set up the connection.

        
### Using Supabase in Your Project

        Ask Cursor to help you connect Supabase, or use this as a starting point:

        
```
// Install the Supabase client (ask Cursor to do this)
// npm install @supabase/supabase-js

// Create a Supabase client (Cursor can help you set this up)
import  from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

        Then ask Cursor to help you use it. For example: "Help me query data from Supabase" or
        "How do I add user authentication with Supabase?"

---

## Troubleshooting

Common issues and their solutions when setting up your vibe coding environment.

        
### Common Issues

        
#### Figma MCP Not Connecting

        - Verify your Figma Personal Access Token is correct and not expired
- Check that the file URL is accessible (not private without proper permissions)
- Restart Cursor after MCP configuration changes
- Check Cursor's MCP logs for error messages

        
#### GitHub MCP Issues

        - Ensure your GitHub token has the correct scopes (`repo`, `read:org`)
- Check token expiration date
- Verify repository permissions if accessing private repos

        
#### Vercel Deployment Fails

        - Check build logs in Vercel dashboard for specific errors
- Verify environment variables are set correctly
- Ensure `package.json` has correct build scripts
- Check Node.js version compatibility

        
#### Supabase Connection Issues (Optional)

        - Verify API URL and keys are correct
- Check Supabase project status (not paused)
- Verify Row Level Security (RLS) policies if data isn't accessible
- Check browser console for CORS errors
- **Better yet:** Select the error message and ask Cursor to help fix it

        
#### Local Dev Server Not Starting

        Instead of troubleshooting manually, try this:

        - Open the terminal in Cursor
- Select the error message
- Ask Cursor: "This error appeared when I tried to start my dev server. Can you help fix it?"
- Common issues Cursor can help with: port conflicts, missing dependencies, configuration errors

        
### Solutions

        General troubleshooting steps:

        1. **Check logs** - Most tools provide detailed error logs
2. **Restart services** - Often fixes transient issues
3. **Update dependencies** - `npm update` or check for updates
4. **Clear caches** - Browser cache, npm cache, Next.js cache
5. **Verify credentials** - Tokens, API keys, passwords
6. **Check documentation** - Official docs often have troubleshooting sections

---

## Next Steps

Now that your environment is set up, here are some resources and next steps to continue
          your vibe coding journey.

        
### Resources

        - [Cursor Documentation](https://cursor.sh/docs) - Official Cursor docs
- [Figma Developer Resources](https://www.figma.com/developers) - API and plugin docs
- [Vercel Documentation](https://vercel.com/docs) - Deployment guides
- [Supabase Documentation (Optional)](https://supabase.com/docs) - Database and auth guides
- [Next.js Documentation](https://nextjs.org/docs) - Framework reference
- [MCP GitHub](https://github.com/modelcontextprotocol) - Model Context Protocol resources

        
### Further Reading

        - **Design Systems** - Learn about creating reusable design components
- **Component Architecture** - Best practices for organizing React/Next.js components
- **API Design** - How to structure your Supabase database and APIs
- **Performance Optimization** - Tips for fast-loading web applications
- **Accessibility** - Making your sites usable for everyone

        Happy vibe coding! Remember, the best workflow is the one that works for you.
          Experiment, iterate, and refine your setup as you go.

---

## Overview

This section provides a comprehensive overview of the tech stack, tool relationships, costs, and design system
          used in the vibe coding workflow.

        
### Technologies

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

        
### Relationship Between Apps

        The vibe coding workflow creates a seamless pipeline from design to deployment:

        1. **Figma → Cursor:** Design files are accessed via Figma MCP, allowing Cursor to extract design tokens, colors, typography, spacing, and component structures.
2. **Cursor → GitHub:** Code is written in Cursor and committed to GitHub repositories via GitHub MCP integration, enabling version control and collaboration.
3. **GitHub → Vercel:** Every push to GitHub automatically triggers deployments on Vercel, creating production and preview URLs.
4. **Supabase (Optional):** Provides backend services that can be accessed from frontend code deployed on Vercel, completing the full-stack workflow.

        This creates a continuous workflow: Design → Code → Deploy → Iterate, all powered by AI assistance in Cursor.

        
### Cost

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
        **Total Free Tier Cost:** $0/month - You can build and deploy projects completely free using the free tiers of all services.
          Paid plans unlock additional features, higher limits, and team collaboration tools.

        
### Design System

        
#### Type

        **Font Family:** System font stack for optimal performance and native feel:

        
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif
```

        This ensures the site uses the native system font on each platform (San Francisco on macOS, Segoe UI on Windows, etc.).

        
#### Type Scale

        - **H1:** 42px, font-weight: 700, line-height: 1.2
- **H2:** 28px, font-weight: 600, line-height: 1.2
- **H3:** 20px, font-weight: 600, line-height: 1.3
- **H4:** 16px, font-weight: 600, line-height: 1.4
- **Body:** 16px (default), line-height: 1.7
- **Small:** 14px, line-height: 1.6
- **Code:** 14px (in code blocks), 0.9em (inline), font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', monospace

        
#### Color

        **Light Mode:**

        <div className="color-info">
          <span className="color-name">Background Primary:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#ffffff</span>
        </div>
        <div className="color-info">
          <span className="color-name">Background Secondary:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#f8f9fa</span>
        </div>
        <div className="color-info">
          <span className="color-name">Text Primary:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#1a1a1a</span>
        </div>
        <div className="color-info">
          <span className="color-name">Text Secondary:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#666666</span>
        </div>
        <div className="color-info">
          <span className="color-name">Text Tertiary:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#999999</span>
        </div>
        <div className="color-info">
          <span className="color-name">Accent:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#5e6ad2</span>
        </div>
        <div className="color-info">
          <span className="color-name">Border:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#e5e5e5</span>
        </div>

        **Dark Mode:**

        <div className="color-info">
          <span className="color-name">Background Primary:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#0d1117</span>
        </div>
        <div className="color-info">
          <span className="color-name">Background Secondary:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#161b22</span>
        </div>
        <div className="color-info">
          <span className="color-name">Text Primary:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#c9d1d9</span>
        </div>
        <div className="color-info">
          <span className="color-name">Text Secondary:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#8b949e</span>
        </div>
        <div className="color-info">
          <span className="color-name">Text Tertiary:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#6e7681</span>
        </div>
        <div className="color-info">
          <span className="color-name">Accent:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#58a6ff</span>
        </div>
        <div className="color-info">
          <span className="color-name">Border:</span>
          <span className="color-swatch" style=}></span>
          <span className="color-value">#30363d</span>
        </div>

        
#### Other Design System Elements

        - **Border Radius:** 4px (small elements), 6px (buttons, inputs), 8px (cards, modals)
- **Spacing Scale:** 4px base unit (4px, 8px, 12px, 16px, 24px, 32px, 48px)
- **Shadows:** Minimal, used for modals and elevated elements
- **Transitions:** 0.2s-0.3s ease for interactive elements
- **Code Blocks:** Light background (#f6f8fa light / #161b22 dark) with border
- **Sidebar Width:** 240px fixed
- **Content Max Width:** 900px
- **Header Height:** 60px fixed

---

