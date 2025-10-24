# Admin Authentication Setup Guide

Your portfolio site now has a secure authentication system for the admin panel! 🔐

## What's New?

- **Login Page**: Accessible at `/login`
- **Protected Admin Panel**: `/admin` route now requires authentication
- **User Management**: Logout button and user info displayed in admin panel
- **Keyboard Shortcut**: `Ctrl+Shift+A` (or `Cmd+Shift+A`) still works and will redirect to login if not authenticated

## Creating Your Admin Account

### Step 1: Go to Supabase Authentication

1. Open your Supabase project: https://supabase.com/dashboard/project/ncefkmwkjyidchoprhth
2. Click on **Authentication** in the left sidebar
3. Click on **Users** tab

### Step 2: Add a New User

1. Click the **"Add user"** button in the top right
2. Choose **"Create new user"**
3. Enter your email address (e.g., `kevin@kevinlaronda.com`)
4. Enter a secure password
5. Click **"Create user"**

### Step 3: Verify Email (Optional)

If you want to enable email verification:
1. In Authentication settings, enable **"Enable email confirmations"**
2. Configure email templates if desired

For now, you can skip this and just create the user directly.

## Using the Admin Panel

### Option 1: Direct Login
1. Navigate to: `http://localhost:3000/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the admin panel

### Option 2: Keyboard Shortcut
1. From any page, press `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac)
2. If not logged in, you'll be redirected to the login page
3. After logging in, you'll be taken to the admin panel

### Logging Out
- Click the **"Logout"** button in the top right corner of the admin panel
- You'll be signed out and redirected to the login page

## Security Notes

- Passwords are securely hashed by Supabase
- Sessions are managed automatically
- The admin panel is protected and requires authentication
- You can add multiple admin users if needed

## Troubleshooting

### "Invalid login credentials"
- Double-check your email and password
- Make sure you created the user in Supabase first
- Check that the user's email is confirmed (or disable email confirmation)

### "Admin panel not loading"
- Make sure you're logged in
- Check that `.env.local` has the correct Supabase credentials
- Verify that Supabase Auth is enabled in your project settings

### Need to Reset Password?
1. Go to Supabase Dashboard → Authentication → Users
2. Find your user
3. Click the "..." menu → "Reset Password"
4. You can set a new password directly or send a reset email

## Adding Additional Admin Users

To add more admin users:
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user"
3. Enter the new admin's email and password
4. The new user can now log in using their credentials

---

**Pro Tip**: Save your login credentials in a password manager for easy access!

