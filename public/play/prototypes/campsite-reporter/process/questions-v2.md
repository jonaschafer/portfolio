# Complete Question List - PDX Campsite Reporter

## Core Questions (Always Asked)

### 1. Location
**Question:** "Where is the campsite located? (You can say the address, intersection, or nearby landmark)"
- **Type:** Text input
- **Example:** "SE Hawthorne and 32nd" or "123 Main St"

### 2. Blocking Access
**Question:** "Is the campsite blocking pedestrian access, like a sidewalk, trail, or path?"
- **Options:** Yes | No

### 3. Tent Question
**Question:** "Is there a tent, tarp, or other shelter?"
- **Options:** Yes | No

### 4. Trash Question
**Question:** "Trash or debris?"
- **Options:** Yes | No

### 5. Vehicle Question
**Question:** "Is there a vehicle (car, truck, RV, trailer, etc.)?"
- **Options:** Yes | No

---

## Conditional Questions (Based on Answers)

### If YES to "Is there a tent, tarp, or other shelter?"

**Reminder:** "Great! Please take photos and have them ready to attach to the email."
- No additional questions
- Continues to next section

### If YES to "Trash or debris?"

**Reminder:** "Great! Please take photos and have them ready to attach to the email."
- No additional questions
- Continues to next section

### If YES to "Is there a vehicle?"

#### Vehicle Question 1
**Question:** "What kind of vehicle?"
- **Type:** Text input
- **Example:** "RV", "Pickup truck", "SUV"

#### Vehicle Question 2
**Question:** "What make/model?"
- **Type:** Text input
- **Example:** "Ford F-150", "Honda Civic", "Dodge Caravan"

#### Vehicle Question 3
**Question:** "What color?"
- **Type:** Text input
- **Example:** "white", "blue", "beige"

#### Vehicle Question 4
**Question:** "What is the license plate state and number?"
- **Type:** Text input
- **Example:** "OR ABC123", "Washington XYZ789", "California 1ABC234"

**Reminder:** "Great! Please take photos and have them ready to attach to the email."

---

## Remaining Core Questions (Always Asked)

### 6. Private Property
**Question:** "Is the location on private property?"
- **Options:** Yes | No | Not sure

### 7. Timeline
**Question:** "When did you first notice this campsite?"
- **Options:** Today | This week | This month | Longer than a month

### 8. Additional Notes (Optional)
**Question:** "Anything else you'd like to add? (optional - describe conditions, concerns, etc.)"
- **Type:** Text input
- **Can skip**

### 9. Contact Email (Optional)
**Question:** "Would you like to provide your email for follow-up? (optional)"
- **Type:** Text input
- **Can skip**

---

## Summary & Submit

### Summary Display
Shows all collected information:
```
📍 Location: [location]
🚶 Blocking access: [Yes/No]
📋 Items at site: [Tent/shelter, Trash/debris, Vehicle]
🚗 Vehicle: [type] [make/model] ([color])
   Plate: [license plate info]
🏠 Private property: [Yes/No/Not sure]
📅 First noticed: [timeline]
💬 Notes: [optional notes]
```

### Photo Reminder (If Applicable)
**Message:** "📸 IMPORTANT: Don't forget to attach your photos to the email before sending!"

### Final Message
**Message:** "I'll now open your email app with everything pre-filled. Review the details and send!"

**Button:** "📧 Open Email to Submit"

---

## Complete Question Flow Examples

### Example 1: Tent Only (No Vehicle)
1. Location: "SE 82nd and Division"
2. Blocking access: Yes
3. Tent: Yes → Photo reminder
4. Trash: No
5. Vehicle: No
6. Private property: No
7. Timeline: This week
8. Notes: (skip)
9. Email: (skip)
10. Summary → Submit

**Total questions: 7 main + 2 optional skipped = 9 interactions**

### Example 2: Vehicle Only (No Tent/Trash)
1. Location: "NW 23rd and Lovejoy"
2. Blocking access: No
3. Tent: No
4. Trash: No
5. Vehicle: Yes
6. → What kind: "RV"
7. → Make/model: "Winnebago"
8. → Color: "white"
9. → License plate: "OR ABC123"
10. → Photo reminder
11. Private property: Not sure
12. Timeline: This month
13. Notes: "Parked on grass"
14. Email: me@example.com
15. Summary → Submit

**Total questions: 14 (all answered)**

### Example 3: Everything (Tent + Trash + Vehicle)
1. Location: "Waterfront Park"
2. Blocking access: Yes
3. Tent: Yes → Photo reminder
4. Trash: Yes → Photo reminder
5. Vehicle: Yes
6. → What kind: "Pickup truck"
7. → Make/model: "Chevrolet Silverado"
8. → Color: "blue"
9. → License plate: "WA XYZ789"
10. → Photo reminder
11. Private property: No
12. Timeline: Longer than a month
13. Notes: "Multiple tents, significant debris"
14. Email: (skip)
15. Summary → Submit

**Total questions: 14 + 1 optional skipped = 15 interactions**

### Example 4: Nothing Present (Shortest Path)
1. Location: "Laurelhurst Park"
2. Blocking access: No
3. Tent: No
4. Trash: No
5. Vehicle: No
6. Private property: No
7. Timeline: Today
8. Notes: (skip)
9. Email: (skip)
10. Summary → Submit

**Total questions: 7 main + 2 optional skipped = 9 interactions (shortest possible)**

---

## Question Count Summary

**Always asked:** 9 questions total
- 5 core yes/no questions (location, blocking, tent, trash, vehicle)
- 2 remaining core questions (private property, timeline)
- 2 optional questions (notes, email)

**If vehicle present:** +4 vehicle detail questions
- What kind
- Make/model
- Color
- License plate

**Photo reminders:** 0-3 depending on what's present
- Tent = 1 reminder
- Trash = 1 reminder
- Vehicle = 1 reminder (after vehicle questions)

**Minimum interactions:** 9 (nothing present, skip optionals)
**Maximum interactions:** 16 (tent + trash + vehicle + all optionals answered + 3 photo reminders)
**Most common:** 10-12 interactions

---

## Time Estimates

- **Shortest path** (nothing present, skip optionals): ~60 seconds
- **Average path** (tent or vehicle): ~90-120 seconds
- **Longest path** (everything): ~2-3 minutes

Much faster than Portland's official 10+ minute multi-page form! 🎉

---

## Key Differences from Previous Version

### Changed:
- ❌ Multi-select for site items → ✅ Three separate yes/no questions
- ❌ Button options for vehicle details → ✅ Text input only
- ❌ Separate plate state/number questions → ✅ Combined into one question

### Benefits:
- ✅ Simpler logic - no multi-select complexity
- ✅ More flexible vehicle details - user can type anything
- ✅ Faster flow - yes/no questions are quicker to answer
- ✅ Clearer - one question at a time, no confusion
