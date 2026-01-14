# PDX Campsite Reporter - Enhanced Version

A comprehensive conversational mobile-first web app that collects all details Portland needs for campsite reporting.

## 🎯 What's New

This version now collects **all the information** Portland's official form requires:
- ✅ Blocking pedestrian access (yes/no)
- ✅ Site items (tent, vehicle, trash - multi-select)
- ✅ Full vehicle details (type, make, color, license plate)
- ✅ Photo uploads for tents, vehicles, and trash
- ✅ Private property status
- ✅ Location and timeline
- ✅ Additional notes

## 📱 How It Works

### Quick Questions (2-3 minutes total)

1. **Location** - Where is the campsite?
2. **Blocking Access** - Is it blocking a sidewalk/path?
3. **Site Items** - What's there? (tent/vehicle/trash - can select multiple)

**Then, based on what you selected:**

4a. **If Tent** → Option to add photos of shelter
4b. **If Vehicle** → Answer 5 vehicle questions + photos:
   - Vehicle type (RV, car, truck, etc.)
   - Make/brand
   - Color
   - License plate state
   - License plate number
4c. **If Trash** → Option to add photos of debris

5. **Private Property** - Is it on private property?
6. **Timeline** - When did you first notice it?
7. **Additional Notes** (optional)
8. **Your Email** (optional for follow-up)

### Email Submission
All information is formatted into a professional email to `reportpdx@portlandoregon.gov` with:
- Clean formatting
- All required details
- Note about photos (manual attachment needed)

## 🎨 Features

### Multi-Select Questions
- Tap multiple options (checkboxes appear)
- Hit "Continue" when done selecting

### Photo Uploads
- Take photos or select from library
- Preview photos before submitting
- Can skip if you don't have photos
- **Note:** Photos must be manually attached to email (technical limitation of mailto links)

### Vehicle Details
- Streamlined flow for vehicle reporting
- Common options for quick selection
- Can type custom values for make/model
- License plate info optional

### Smart Conditional Logic
- Only asks relevant questions based on what you report
- No tent? No tent questions.
- No vehicle? Skips vehicle details.

## 🚀 Demo

**Live:** [figma-experiments.vercel.app/prototypes/campsite-reporter](https://figma-experiments.vercel.app/prototypes/campsite-reporter)

**Best viewed on mobile**

## 🛠️ Technical Details

### Stack
- Pure HTML/CSS/JavaScript
- No frameworks or dependencies
- Uses FileReader API for photo previews
- Mobile-first responsive design
- Viewport height fixes for all phone sizes

### New Features
- Multi-select button system with checkboxes
- Conditional question flows
- Photo upload with preview
- Complex state management for vehicle details
- Enhanced email formatting

### Browser Support
- ✅ iOS Safari (iPhone)
- ✅ Chrome (Android)
- ✅ Desktop browsers
- ✅ Photo upload works on all modern browsers

## 📊 Question Flow

```
Start
  ↓
Location
  ↓
Blocking Access?
  ↓
Site Items? (multi-select)
  ↓
  ├→ Tent? → Photos?
  ├→ Vehicle? → Type → Make → Color → Plate State → Plate # → Photos?
  └→ Trash? → Photos?
  ↓
Private Property?
  ↓
Timeline?
  ↓
Additional Notes? (optional)
  ↓
Email? (optional)
  ↓
Review Summary
  ↓
Submit via Email
```

## 🎯 Why This Approach?

### Matches Portland's Official Form
The city's web form collects all these details. By gathering them conversationally, we:
- ✅ Make it faster (questions vs form fields)
- ✅ Make it clearer (one question at a time)
- ✅ Make it mobile-friendly (no tiny dropdowns)
- ✅ Ensure completeness (all required info collected)

### Photos Are Important
Portland uses photos to:
- Prioritize urgent sites
- Verify reports
- Document conditions
- Plan appropriate response

## 📝 Known Limitations

1. **Photo Attachment**
   - Photos preview in the app
   - Photos stored in browser during session
   - Email opens with report text
   - User must manually attach photos to email
   - **Why:** mailto links can't auto-attach files (browser security)
   - **Future:** Could build backend to handle email + attachments automatically

2. **Long Vehicle Lists**
   - Only showing top 10 vehicle types/makes in buttons
   - Can type any vehicle type in text field
   - Full lists available in code

3. **Session Storage**
   - Photos cleared on page refresh
   - No persistent draft saving yet
   - **Future:** Add localStorage for drafts

## 🔮 Future Enhancements

- [ ] Backend API to auto-send email with photo attachments
- [ ] Save drafts in localStorage
- [ ] GPS auto-location
- [ ] Show map of reported sites
- [ ] Spanish language support
- [ ] Offline PWA support
- [ ] "Report Again" for same location

## 🎉 Impact

### For Residents
- **Before:** 10+ minute form, multiple pages, tiny mobile dropdowns
- **After:** 2-3 minute conversation with clear questions

### For Portland
- More complete reports with all required details
- More photos = better prioritization
- Vehicle details help with removal planning

### For Engineers
- Demonstrates complex conditional form logic
- Mobile-first conversational UX pattern
- Photo upload handling
- Multi-select button system
- State management without frameworks

## 🤝 Contributing

Test it and provide feedback:
1. Try reporting different scenarios (tent only, vehicle only, both)
2. Test photo uploads
3. Check email formatting
4. Share with neighbors!

## 📄 License

MIT - Feel free to adapt for other cities/use cases!

---

Built in Portland, for Portland 🌲

**Making civic participation easier, one conversation at a time.**
