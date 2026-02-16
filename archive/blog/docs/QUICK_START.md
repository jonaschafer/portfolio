# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
cd /Users/jon/git/brand/blog
npm install
```

This will install all required packages (Next.js, React, Tailwind, Mermaid, etc.)

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

You should see:
- **Home page** with the featured article card
- **Article page** at `/intake-case-study` with full case study

### 3. Deploy to Vercel (Optional)

**Option A: Vercel CLI (Easiest)**
```bash
npm install -g vercel
cd /Users/jon/git/brand/blog
vercel
```

Follow the prompts. Vercel will give you a live URL in ~2 minutes.

**Option B: GitHub + Vercel Dashboard**
1. Push `/blog` folder to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel auto-detects Next.js and deploys

---

## 📁 What Was Created

```
/Users/jon/git/brand/blog/
├── app/
│   ├── layout.tsx              # Global layout & metadata
│   ├── page.tsx                # Home page with article card
│   ├── globals.css             # Tailwind + custom styles
│   └── intake-case-study/
│       └── page.tsx            # Full case study article
├── components/
│   ├── BlogHeader.tsx          # Simple navigation
│   ├── ArticleHero.tsx         # Article title/meta section
│   ├── Mermaid.tsx             # Diagram renderer
│   └── Icons.tsx               # Simple SVG icons
├── public/
│   └── article-content.md      # Your case study markdown
├── package.json                # Dependencies
├── tailwind.config.ts          # Design system config
├── tsconfig.json               # TypeScript config
└── README.md                   # Full documentation
```

---

## 🎨 Design Features

**Inspired by Figma Blog + Colossal:**
- Clean, spacious layout with generous whitespace
- Large, readable typography (18-20px body)
- Serif fonts for headings, sans-serif for body
- Indigo accent color (#6366f1)
- Minimal navigation without distraction
- Full support for Mermaid diagrams
- Responsive, mobile-friendly

**Typography:**
- Headings: Georgia (serif)
- Body: System fonts (San Francisco, Segoe UI, Roboto)
- Line height: 1.8 for comfortable reading
- Max width: 800px for article content

---

## ✏️ Customization

### Change Colors

Edit `tailwind.config.ts`:
```typescript
accent: {
  DEFAULT: '#6366f1', // Change this!
  dark: '#4f46e5',
}
```

### Update Author Info

Edit `app/page.tsx` and article pages:
- Author name
- Email/contact links
- Social media links

### Add More Articles

1. **Create new folder:** `app/new-article/`
2. **Add page.tsx:** Copy from `intake-case-study/page.tsx`
3. **Add markdown:** Save to `public/new-article.md`
4. **Update home:** Add article card to `app/page.tsx`

---

## 🐛 Troubleshooting

**Port 3001 already in use?**
```bash
# Kill the process or change port
npm run dev -- -p 3002
```

**Mermaid diagrams not rendering?**
- Check browser console for errors
- Ensure markdown has proper ` ```mermaid ` code fences

**Styling looks broken?**
```bash
# Rebuild Tailwind
rm -rf .next
npm run dev
```

---

## 📦 Deploy Options

| Platform | Difficulty | Free Tier | Custom Domain |
|----------|-----------|-----------|---------------|
| Vercel | Easiest | Yes | Yes |
| Netlify | Easy | Yes | Yes |
| GitHub Pages | Medium | Yes | Yes |

**Recommended: Vercel** (Made by Next.js creators, zero config)

---

## 🎯 Next Steps

1. **Test it locally:** Run `npm run dev` and check both pages
2. **Deploy to Vercel:** Get a live URL in 2 minutes
3. **Share internally first:** Get team feedback
4. **Make public later:** Adjust domain settings when ready

---

Need help? Check `README.md` for full documentation!
