# Avatar Button Fix

## Issue Description
When clicking the "Change Avatar" button in the Edit Profile dialog, two unintended actions were being triggered:

1. **Form Submission**: The entire profile form was being submitted even though the user only wanted to change the avatar
2. **False Success Message**: A "Profile updated successfully" message appeared even though no profile data was changed

## Root Cause
The "Change Avatar" button was placed inside a `<form>` element but was missing the `type="button"` attribute. In HTML, buttons inside forms default to `type="submit"`, which means clicking them triggers form submission.

## Solution
Added `type="button"` attribute to the "Change Avatar" button to prevent it from submitting the form.

### Before (Problematic Code):
```tsx
<Button 
  variant="outline" 
  size="sm" 
  onClick={triggerFileInput}
  disabled={uploadAvatarMutation.isPending}
>
  <Camera className="h-4 w-4 mr-2" />
  {uploadAvatarMutation.isPending ? 'Uploading...' : 'Change Avatar'}
</Button>
```

### After (Fixed Code):
```tsx
<Button 
  type="button"  // ← Added this line
  variant="outline" 
  size="sm" 
  onClick={triggerFileInput}
  disabled={uploadAvatarMutation.isPending}
>
  <Camera className="h-4 w-4 mr-2" />
  {uploadAvatarMutation.isPending ? 'Uploading...' : 'Change Avatar'}
</Button>
```

## Expected Behavior After Fix
1. Clicking "Change Avatar" only opens the file browser
2. No form submission occurs
3. No "Profile updated successfully" message appears
4. User can select an image file, which then uploads via the separate avatar upload API
5. Success message only appears after successful image upload

## Files Modified
- `frontend/src/components/EditProfileDialog.tsx` - Added `type="button"` to avatar button

## Verification
Other buttons in the same form were checked and confirmed to have correct `type` attributes:
- ✅ "Add Skill" button: `type="button"`
- ✅ "Add Target Company" button: `type="button"`
- ✅ "Cancel" button: `type="button"`
- ✅ "Save Changes" button: `type="submit"`
- ✅ Remove skill/company buttons: `type="button"`

## Testing
To verify the fix:
1. Open Edit Profile dialog
2. Click "Change Avatar" button
3. Confirm that:
   - Only file browser opens
   - No success message appears
   - Form is not submitted
   - Profile data remains unchanged