# Bug Fix - Duplicate Variable Declaration

## Issue
```
Uncaught SyntaxError: Identifier 'waitingForPhotos' has already been declared
```

## Cause
When removing photo upload functionality, leftover code from the old implementation wasn't fully cleaned up:
- Line 378: `let waitingForPhotos = false;` (from new code)
- Line 425: `let waitingForPhotos = false;` (leftover from old photo upload code)
- Also had unused `photoUploadType` variable
- Also had unused `continueAfterPhotos()` function

## Fix
Removed all unused code:
- ❌ Removed duplicate `waitingForPhotos` declaration (line 425)
- ❌ Removed unused `photoUploadType` variable
- ❌ Removed unused `continueAfterPhotos()` function

## What Remains
The working functions for photo reminders:
- ✅ `notePhotosNeeded(itemType)` - Shows reminder message
- ✅ `continueAfterPhotoNote()` - Continues to next question after reminder

## Status
✅ Fixed and tested - app should now load without errors!
