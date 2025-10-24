# 🔑 How to Get Your Real Supabase Anon Key

## ❌ Current Problem:
The `.env.local` file has a **placeholder key** that doesn't work. You need the **real** anon key from your Supabase project.

## ✅ Get Your Real Key:

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard/project/ncefkmwkjyidchoprhth
2. Click on **"Settings"** (gear icon in the left sidebar)
3. Click on **"API"** in the settings menu

### Step 2: Copy Your Keys
You'll see two important values:
- **Project URL**: `https://ncefkmwkjyidchoprhth.supabase.co`
- **anon public key**: A long string starting with `eyJ...`

### Step 3: Update .env.local
1. Open the `.env.local` file in your project
2. Replace the contents with:
```
VITE_SUPABASE_URL=https://ncefkmwkjyidchoprhth.supabase.co
VITE_SUPABASE_ANON_KEY=[PASTE YOUR REAL KEY HERE]
```

### Step 4: Restart Dev Server
After updating the file, the server should auto-restart. If not:
```bash
npm run dev
```

## 📋 Where to Find Each Value:

**Supabase Dashboard → Settings → API**

Look for:
- **URL**: Under "Project URL" section
- **Anon Key**: Under "Project API keys" → "anon public"

## ✅ How to Know It's Working:
- Key should be ~200+ characters long
- Starts with `eyJ`
- Ends with random characters
- No spaces or line breaks

## 🔒 Security Note:
The `anon` key is safe to use in your frontend - it's meant to be public. The real security comes from your database Row Level Security (RLS) policies.

---

**Once you update the key, image uploads will work immediately!** 🚀
