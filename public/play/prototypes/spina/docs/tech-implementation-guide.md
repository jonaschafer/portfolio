# Technical Implementation Guide: Artist E-Commerce Setup

**For:** The tech-savvy friend helping a non-technical artist  
**Goal:** Set up low-maintenance online sales infrastructure  
**Time:** 3-4 hours total implementation  
**Ongoing maintenance:** ~15 min/week (mostly monitoring)

---

## Architecture Overview

```
Customer Journey:
Instagram → Product Tag → Shopify/Square → Checkout → Fulfillment
Google Search → Business Profile → Store Link → Checkout → Fulfillment

Revenue Streams:
1. Direct sales (she packs/ships)
2. Print-on-demand (Printful auto-fulfills)
3. Wholesale inquiries (Google Business → email)
```

---

## Option A: Shopify Stack (Recommended)

**Pros:**
- Best Instagram Shopping integration
- Massive app ecosystem
- Better analytics
- Scales if she grows

**Cons:**
- $39/month (but worth it)
- Slight learning curve

### Implementation Steps

#### 1. Shopify Setup (20 minutes)

```bash
# Account creation
1. Go to shopify.com/free-trial
2. Email: [her email]
3. Store name: [her business name]
4. Skip all the "What are you selling" questions (they're just marketing)

# Theme selection
5. Online Store → Themes → Theme Library
6. Pick "Dawn" (it's free and clean)
7. Customize → Save

# Essential settings
8. Settings → Payments → Set up Shopify Payments
   - Uses her bank account
   - No transaction fees (vs 2% with PayPal)
   - Stripe underneath (solid)

9. Settings → Checkout
   - Enable "Email marketing" checkbox (build her list)
   - Set "After an order is paid" to send confirmation email

10. Settings → Shipping and delivery
    - Create zone: United States
    - Add rate: "Standard Shipping" - $5 flat rate
    - Add rate: "Free Shipping" - Free over $50
```

#### 2. Product Setup (30 minutes)

**Product structure:**
```yaml
Example Product:
  Title: "Mountain Landscape T-Shirt"
  Description: |
    Hand-illustrated mountain scene on super-soft cotton.
    Perfect for hikers and nature lovers.
    
    - 100% cotton Bella+Canvas 3001
    - Unisex fit
    - Printed locally in [City]
    - Machine wash cold
  
  Variants:
    - Small: $28, SKU: MTN-LS-SM
    - Medium: $28, SKU: MTN-LS-MD  
    - Large: $28, SKU: MTN-LS-LG
    - XL: $30, SKU: MTN-LS-XL
  
  Images:
    - Front view on white background (main)
    - Detail shot of design
    - Lifestyle shot (someone wearing it)
  
  Collections:
    - "T-Shirts"
    - "Nature Designs"
  
  Tags:
    - mountain, landscape, outdoor, hiking
```

**Bulk setup script (if she has CSV of products):**
```python
# products_import.csv template
Handle,Title,Vendor,Type,Tags,Variant SKU,Variant Price,Image Src
mountain-tee,"Mountain Landscape T-Shirt","[Her Business]","Apparel","mountain,nature",MTN-LS-SM,28,https://...
mountain-tee,"Mountain Landscape T-Shirt","[Her Business]","Apparel","mountain,nature",MTN-LS-MD,28,https://...
```

Upload via: Products → Import

#### 3. Instagram Shopping Integration (15 minutes + 24hr wait)

```bash
# Prerequisites check
- Instagram account must be Business or Creator account
- Facebook page connected to Instagram
- Products must have checkout enabled

# Setup flow
1. Sales channels → Click "+"
2. Add Facebook & Instagram channel
3. Connect Facebook Business Manager
4. Connect Instagram account
5. Select "Checkout on website" (not Instagram checkout - fewer fees)
6. Submit for review

# What Instagram reviews:
- Account compliance (no fake followers/engagement)
- Products comply with commerce policies
- Business information is accurate

# Approval time: 24-48 hours typically
```

**After approval:**
```bash
# Tag products in posts
1. Create Instagram post (phone app)
2. Tap "Tag Products" before posting
3. Tap product in photo → search → select
4. Products show with price tag icon
5. Users tap → see product → "View on Website" → Shopify checkout

# Tips for her:
- Tag max 5 products per post
- Use lifestyle photos (product in use) not just product shots
- Carousel posts can tag different products per image
```

#### 4. Print-on-Demand Setup (45 minutes)

**Printful Integration:**
```bash
# Connect to Shopify
1. printful.com → Sign up
2. Choose "I have an online store"
3. Select Shopify
4. Authorize connection

# Product creation workflow
5. Add Product → Choose category (Clothing → T-shirts)
6. Select product: Bella+Canvas 3001 (her blank)
   - Why this one: Soft, standard, $12.95 base cost
   
# Design upload requirements
7. Upload design file:
   - Format: PNG with transparent background (best) or JPG
   - Resolution: Minimum 3000x3000px for chest print
   - Color mode: RGB
   - DPI: 300
   
# Mockup generation
8. Position design (front/back/both)
9. Generate mockups (takes 30 seconds)
10. Review mockup photos (these go to Shopify)

# Pricing strategy
   Base cost: $12.95
   Shipping: ~$4-6 (Printful charges customer)
   Her cost: $12.95 + $0 (Printful bills her, ships direct)
   
   Suggested retail: $28
   Her profit: $15.05 per sale (54% margin)

# Publish to store
11. Submit to store
12. Product auto-appears in Shopify with mockup images
13. Edit title/description as needed
```

**Automation setup:**
```bash
# Order routing (CRITICAL)
Shopify → Settings → Apps and sales channels → Printful

Enable:
- Automatic order import (orders go to Printful instantly)
- Auto-fulfill orders (marks order complete when shipped)
- Email customer with tracking (Printful sends it)

Set up:
- Printful as fulfillment location for POD products
- Her address as fulfillment location for custom/market items
```

**Product organization:**
```yaml
Shopify Collections:
  "Print-on-Demand":
    - Ships in 5-7 days
    - All Printful products
    
  "Made to Order":  
    - Ships in 2-3 weeks
    - Custom work she does
    
  "Ready to Ship":
    - Ships next day
    - Market overstock
```

#### 5. Email Marketing Setup (15 minutes)

**Shopify Email (free for 10k emails/month):**
```bash
# Install app
Apps → Shopify App Store → Search "Shopify Email" → Install

# Create welcome automation
1. Marketing → Automations → Create automation
2. Template: "Welcome new subscriber"
3. Edit email:
   Subject: "Welcome! Here's 10% off your first order"
   Body: 
     - Thanks for subscribing
     - Here's coupon code: WELCOME10
     - Shop link
     - Instagram link
     - Unsubscribe link (required)
     
# When it sends:
- Someone subscribes via popup
- Someone checks "email me" at checkout
- Manual addition

# Popup setup
4. Online Store → Themes → Customize
5. Add section → Email signup popup
6. Offer: "Get 10% off your first order"
7. Timing: 10 seconds after page load
8. Save
```

---

## Option B: Square Stack (Alternative)

**Pros:**
- Free forever plan
- She might already use Square at markets
- Familiar interface if she has Square POS

**Cons:**
- Instagram integration not as smooth
- Fewer apps/integrations
- 2.9% + 30¢ transaction fee on free plan

### Implementation (if choosing Square)

```bash
# Account setup
1. squareup.com/signup
2. Business type: Individual/Sole Proprietor
3. Connect bank account

# Online store activation  
4. Go to square.com/us/en/online-store
5. "Get Started" → Choose Free plan
6. Customize site (similar to Shopify)

# Instagram setup
7. Marketing → Instagram Shopping
8. Connect Instagram Business account
9. Submit for review (same 24-48hr wait)

# Note: Print-on-demand harder with Square
# Workaround: Use Printful's direct links
```

---

## Google Business Profile Setup (20 minutes)

```bash
# Initial setup
1. business.google.com
2. Sign in with her Gmail (or create: [businessname]@gmail.com)
3. Business name: [Her Business Name]
4. Category: "Artist" (primary), "Custom T-Shirt Store" (secondary)

# Location setup - Two scenarios:

Scenario A (Sells from home/studio):
  - Add address: [her address]
  - Set hours: "By appointment"
  - Service area: [city + 25 mile radius]

Scenario B (Market-only):
  - Choose "I deliver goods and services"
  - No physical address shown
  - Service area: [cities where she vends]

# Contact info
5. Phone: [her number]
6. Website: [Shopify store URL]
7. Instagram: @[her handle]

# Verification
8. Google sends postcard to address (5-7 days)
9. Enter code from postcard
10. Profile goes live

# Photo requirements
- Logo: 720x720px minimum
- Cover: 1024x576px minimum  
- Products: At least 3 photos, 720x720px

# Business description (750 char limit)
Template:
"[Business Name] creates custom illustrated apparel and art prints 
in [City]. Find original t-shirts, hoodies, prints, and unique gifts 
at local farmers markets and online. Wholesale inquiries welcome.

Specialties:
- Hand-illustrated designs
- Locally printed apparel
- Custom commission work
- Eco-friendly materials

Supporting local art since [year]."

# Attributes to enable
- Women-owned (if applicable)
- Online estimates
- Online appointments  
- Debit cards accepted
- Credit cards accepted
```

**Google Posts Automation:**
```bash
# She should post weekly - set up template:

Market Update Post (Fridays):
  Photo: Booth setup or products
  Text: "Find us at [Market Name] this [Day] from [Time]! 
         We'll have new [product type] designs.
         [Address if needed]"
  Button: "Learn more" → [Store URL]

New Product Post (Wednesdays):  
  Photo: New product
  Text: "New design alert! [Product name] now available online 
         and at our next market. Link in bio to shop."
  Button: "Buy" → [Product URL]

# Tool to make this easier:
- Download "Google Business" app (iOS/Android)
- She posts directly from phone
- Takes 2 minutes
```

---

## SEO Setup (30 minutes)

**Shopify SEO basics:**
```bash
# Homepage
Settings → General → 
  Store name: "[Business Name] - Custom T-Shirts & Art Prints in [City]"
  Meta description: "Shop original illustrated apparel and prints 
    by [Name]. Locally designed, sustainably printed. Free shipping over $50."

# Product SEO template
Products → [Product] → Search engine listing preview:

Title: "[Product Name] - [Type] | [Business Name]"
  Example: "Mountain Landscape T-Shirt - Unisex | Sarah's Designs"

Description: "[Product description] + local keywords"
  Example: "Hand-illustrated mountain t-shirt by Portland artist Sarah Chen. 
    Soft cotton, locally printed. Perfect for hikers and nature lovers in the PNW."

URL: Keep it simple
  Good: /products/mountain-tee
  Bad: /products/mountain-landscape-tshirt-unisex-soft-cotton

# Blog posts (for SEO juice)
Online Store → Blog posts → Create post

Monthly post ideas:
- "Behind the Design: [Product Name]"
- "Where to Find Us This Month" (lists all markets)
- "Meet the Artist" (about her)
- "[Season] Gift Guide"

These rank for "[city] local artist blog" type searches
```

**Google Search Console setup:**
```bash
1. search.google.com/search-console
2. Add property: [store URL]
3. Verify via Shopify (Settings → Apps → Google)
4. Submit sitemap: [store-url]/sitemap.xml
5. Let it index for 2 weeks
6. Monitor "Performance" tab for ranking keywords
```

---

## Analytics Setup (15 minutes)

**Google Analytics 4:**
```bash
# Setup
1. analytics.google.com
2. Create account → [Business Name]
3. Create property → [Store Name]
4. Data stream → Web → [Store URL]
5. Copy Measurement ID: G-XXXXXXXXXX

# Shopify integration
6. Shopify → Settings → Analytics
7. Paste Google Analytics 4 ID
8. Save

# Events to track (auto-tracked):
- Page views
- Add to cart  
- Begin checkout
- Purchase
- Product views

# Custom events (set up later if needed):
- Instagram clicks
- Email signups
- Print-on-demand sales
```

**Shopify Analytics dashboard:**
```bash
# Show her this view:
Analytics → Reports → 
  "Sales over time" (daily/weekly/monthly)
  "Sales by traffic source" (where customers come from)
  "Sales by product" (bestsellers)

Filters:
- Instagram traffic (track effectiveness)
- Google organic (SEO working?)
- Direct traffic (market customers remembering her URL)
```

---

## Maintenance Automation

**Weekly tasks (minimize her workload):**

```yaml
Automated:
  Order fulfillment (Printful):
    - Customer orders
    - Printful receives order instantly
    - Prints in 2-3 days  
    - Ships with tracking
    - Customer gets email
    - Money deposited to her account
    - Zero work for her
    
  Email marketing:
    - Welcome sequence sends automatically
    - Abandoned cart emails (Shopify Marketing)
    - Order confirmations/shipping updates
    
  Inventory tracking:
    - Shopify alerts when stock low
    - Only matters for non-POD items

Manual (what she does):
  Monday:
    - Check orders (5 min)
    - Pack + ship custom orders
    
  Wednesday:  
    - Post Instagram with product tags (10 min)
    
  Friday:
    - Google Business update about weekend market (5 min)
    
  Sunday:
    - Review sales (5 min)
    - Add 1 new product if she made something new (10 min)

Total: 35 min/week
```

**Set up these Shopify automations:**
```bash
# Abandoned cart recovery
Marketing → Automations → Create automation
Template: "Abandoned cart"
Trigger: Cart abandoned for 4 hours
Email: "Forget something? Complete your order and get free shipping"

# Low stock alerts
Settings → Notifications → Low stock
Set threshold: 3 items
Email: [her email]

# Order notifications  
Settings → Notifications → Orders
Enable: Order confirmation, Fulfillment request, Shipping confirmation
These go to customers automatically
```

---

## Wholesale Inquiry Handling

**This will happen (local shops find her on Google):**

Setup auto-response:
```bash
# Shopify Contact Form
Online Store → Pages → Create page
Title: "Wholesale"
Content:
  "Interested in carrying our designs in your shop?
   
   Minimum order: 24 pieces
   Wholesale pricing: 50% off retail
   Typical turnaround: 2-3 weeks
   
   Fill out the form below and we'll send you our wholesale catalog."

# Form fields:
- Business name
- Contact name  
- Email
- Phone
- Type of business (retail, cafe, etc.)
- Interested in (apparel, prints, other)

# Notification  
Settings → Notifications → Customer
Enable "Contact form submitted" → [her email]

# Her response template (give her this):
"Hi [Name],

Thanks for your interest in [Business Name]! I'd love to work with you.

Our wholesale terms:
- 50% off retail pricing
- Minimum order: 24 pieces (can mix styles/sizes)
- Payment: 50% deposit, 50% on delivery
- Turnaround: 2-3 weeks from order

I'm attaching our current product catalog. Let me know what interests you 
and I'll send over a quote!

Best,
[Her name]"
```

---

## Security & Backup

```bash
# Shopify security (built-in):
- SSL certificate (automatic)
- PCI compliance (automatic)  
- DDoS protection (automatic)
- Daily backups (automatic)

# Two-factor authentication (set up for her):
Settings → Users and permissions → [Her account] → Enable 2FA
Use Authy app (easier than Google Authenticator for non-tech folks)

# Password manager
Set her up with:
- Bitwarden (free, easy)
- Store all passwords there
- Master password she can remember: [meaningful phrase]

# Regular backups (monthly):
Apps → Shopify App Store → "Export" or "Backup"
Schedule automatic export of:
- Products
- Orders  
- Customer data
Sent to her email monthly
```

---

## Cost Breakdown

### Initial Setup
```yaml
Domain (optional): $14/year
  - Get [businessname].com via Shopify
  - Makes her look more professional
  - Not required (can use [store].myshopify.com)

Shopify: $1 for first month, then $39/month
Printful: $0 (only charged per order)
Google Business: $0
Photography: $0 (phone camera is fine)

Total: $15-40 first month
```

### Ongoing Monthly
```yaml
Shopify: $39
Email marketing: $0 (included up to 10k emails)
Printful: $0 (pay per order)
Apps: $0 (using free versions)

Total: $39/month

Break-even: 3 POD sales ($15 profit each)
```

### Per-Order Economics
```yaml
Print-on-Demand T-Shirt:
  Retail price: $28
  Printful cost: $12.95
  Shopify fee (2.9% + 30¢): $1.11
  Her profit: $13.94 (49.8% margin)

Custom/Market Item:
  Retail price: $28  
  Her cost: $8 (blank + materials)
  Shopify fee: $1.11
  Shipping cost: $4
  Her profit: $14.89 (53% margin)
  
Direct at market:
  Retail price: $28
  Her cost: $8
  Square fee (2.6% + 10¢): $0.83
  Her profit: $19.17 (68% margin)
```

**Insight:** Market sales are most profitable, but online sales happen while she sleeps.

---

## Troubleshooting Guide (for her)

**"Someone ordered but I didn't get an email"**
- Check spam folder
- Check Shopify → Orders
- Verify Settings → Notifications → Email is correct

**"Instagram won't let me tag products"**
- Wait 24-48 hours for approval
- Check that product has price and image
- Make sure Instagram is Business account
- Reconnect Facebook & Instagram in Shopify

**"Printful order failed"**  
- Check billing info in Printful account
- Make sure card has funds
- Contact Printful support (they're helpful)

**"Google Business isn't showing up"**
- Verification can take 7 days (postcard)
- Must verify before profile shows
- Check that business hours are set

**"No sales yet"**
- Normal for first 2 weeks
- Takes time for Google/Instagram to index
- Post regularly to Instagram
- Tell market customers about online shop

---

## Handoff Checklist

Before you hand this over to her:

```bash
□ Shopify store live with 5+ products
□ Instagram Shopping connected and approved
□ Google Business created (waiting for verification postcard)
□ Printful connected with 2-3 designs
□ Payment processing working (do test order)
□ Shipping rates configured
□ Email automations enabled
□ Her passwords saved in Bitwarden
□ Show her where to find:
  - New orders
  - How to mark custom orders as fulfilled
  - How to post Instagram with product tags
  - How to update Google Business
  - How to add new products
□ Set up weekly check-in (first month) to troubleshoot

# Success metrics (show her how to check):
Month 1 goal: 5 orders
Month 2 goal: 10 orders  
Month 3 goal: 20 orders

# When to re-evaluate:
- If making $500+/month: Consider paid Instagram ads
- If getting wholesale inquiries: Set up wholesale portal
- If doing $2k+/month: Consider Shopify Plus or hiring VA
```

---

## Growth Plays (Later)

**When she's ready to scale:**

1. **Instagram Ads** ($100/month test)
   - Target: Women 25-45 in [city] + 50 miles
   - Interests: Local art, handmade, sustainability
   - Objective: Traffic to website
   - Expected: 5-10 sales/month ($150-300 revenue)

2. **Email Marketing** (advanced)
   - Segment customers by product type
   - Monthly newsletter with new designs
   - Birthday/anniversary discounts
   - Expected: 20% boost in repeat purchases

3. **Wholesale Program** (if inquiries are consistent)
   - Create wholesale portal (Shopify app: "Wholesale Club")
   - Set minimum orders
   - Automated invoicing
   - Expected: $1k-5k bulk orders quarterly

4. **Subscription Box** (if she makes monthly designs)
   - "Design of the Month Club"
   - $25/month for exclusive design
   - Shopify Subscriptions app
   - Expected: 20-50 subscribers = $500-1250/month recurring

---

## Resources for You

**Learning:**
- Shopify YouTube channel (official tutorials)
- ReCharge (subscription billing)
- Printful YouTube (POD best practices)

**Tools:**
- Canva (help her with mockups)
- Remove.bg (background removal)
- TinyPNG (compress images)
- ColorZilla (grab colors from her designs)

**Communities:**
- /r/shopify (Reddit)
- Shopify Community forums
- Printful Facebook group

**If you get stuck:**
- Shopify support chat (24/7, actually helpful)
- Printful support (email, responds in 24hr)
- Me (you can always ask follow-up questions)

---

## Final Notes

**This setup is intentionally simple.** 

You could add:
- Multi-currency
- Dropshipping from AliExpress
- Complex inventory management
- Wholesale portal
- Subscription boxes
- Loyalty programs
- Affiliate marketing

**Don't.** Not yet.

She needs to:
1. Get comfortable with the basics
2. Prove demand for online sales
3. Build confidence

**Start minimal.** Add complexity only when she's asking for it.

The goal isn't to build Amazon. It's to help her make $1000/month online with 30 minutes of work per week.

**Nail that first.** Everything else is noise.

Good luck! 🎨