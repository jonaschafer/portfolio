# Deployment Guide

## 🚀 Deploy Your Blog to Vercel

### Option 1: Vercel CLI (Fastest - 2 minutes)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Navigate to blog folder**
```bash
cd /Users/jon/git/brand/blog
```

3. **Deploy**
```bash
vercel
```

4. **Follow prompts:**
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No**
- Project name? **brand-studio-blog** (or whatever you want)
- Directory? **./  (just press enter)**
- Override settings? **No**

**Done!** Vercel will give you a URL like: `brand-studio-blog.vercel.app`

### Option 2: GitHub + Vercel Dashboard (5 minutes)

1. **Push to GitHub**
```bash
cd /Users/jon/git/brand
git add blog/
git commit -m "Add blog site"
git push
```

2. **Import to Vercel**
- Go to [vercel.com/new](https://vercel.com/new)
- Click "Import Git Repository"
- Select your repo
- **Important:** Set "Root Directory" to `blog`
- Click "Deploy"

**Done!** Vercel auto-detects Next.js and deploys.

---

## 🌐 Custom Domain Setup

After deploying, you can add a custom domain:

### Option A: Subdomain (Easy)
- Domain: `blog.classdojo.com`
- Add CNAME record in DNS: `blog → cname.vercel-dns.com`

### Option B: Your Personal Domain
- Domain: `jonschafer.design` or `blog.jonschafer.com`
- Follow Vercel's domain setup wizard

---

## 🔒 Keep It Private (Initially)

Want to share internally before making it public?

### Option 1: Vercel Authentication
In Vercel dashboard:
- Project Settings → Deployment Protection
- Enable "Vercel Authentication"
- Only people you invite can view

### Option 2: Password Protection
```typescript
// middleware.ts (create this file)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== 'Bearer YOUR_SECRET_TOKEN') {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic' },
    });
  }
  
  return NextResponse.next();
}
```

---

## 📊 Analytics (Optional)

Add simple analytics:

### Vercel Analytics (Free)
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Plausible (Privacy-focused)
Add to `app/layout.tsx`:
```typescript
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## 🔄 Future Updates

After initial deployment, updating is easy:

**Option 1: Auto-deploy (Recommended)**
- Push to GitHub → Vercel auto-deploys
- Every commit triggers new deployment

**Option 2: Manual deploy**
```bash
cd /Users/jon/git/brand/blog
vercel --prod
```

---

## ✅ Deployment Checklist

Before making it public:

- [ ] Test locally (`npm run dev`)
- [ ] Check both pages (home + article)
- [ ] Verify Mermaid diagrams render
- [ ] Test on mobile (responsive design)
- [ ] Update contact email/links
- [ ] Deploy to Vercel
- [ ] Test live URL
- [ ] Share internally for feedback
- [ ] Add custom domain (optional)
- [ ] Enable analytics (optional)
- [ ] Make public or keep private

---

## 🆘 Common Issues

**Build fails on Vercel?**
- Check `package.json` dependencies
- Run `npm run build` locally first
- Check Vercel build logs

**Articles not loading?**
- Ensure `public/article-content.md` exists
- Check file paths are correct
- Look at browser console for errors

**Styling broken?**
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check Tailwind config

---

## 🎉 You're Done!

Your blog is now:
- ✅ Built with Next.js
- ✅ Styled beautifully (Figma + Colossal inspired)
- ✅ Supports Mermaid diagrams
- ✅ Mobile responsive
- ✅ Ready to deploy
- ✅ Easy to update

Share your live URL! 🚀
