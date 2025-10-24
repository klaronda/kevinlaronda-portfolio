# 📧 Contact Form Email Setup

This guide will help you set up automatic email notifications when someone submits your contact form.

## 🚀 Quick Setup Steps

### 1. Create Resend Account
1. Go to [resend.com](https://resend.com) and sign up for a free account
2. Verify your email address
3. Go to the API Keys section and create a new API key
4. Copy the API key (starts with `re_`)

### 2. Add API Key to Supabase
1. Go to your Supabase dashboard
2. Navigate to **Settings** → **Edge Functions**
3. Click **Environment Variables**
4. Add a new variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (e.g., `re_xxxxxxxxxxxx`)
   - **Description**: `API key for Resend email service`

### 3. Deploy the Edge Function
Run these commands in your terminal:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy send-contact-email
```

**Note**: Replace `YOUR_PROJECT_REF` with your actual Supabase project reference (found in your Supabase dashboard URL).

### 4. Create Database Trigger
Run this SQL in your Supabase SQL Editor:

```sql
-- Create function to call the edge function
CREATE OR REPLACE FUNCTION notify_contact_submission()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-contact-email',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body := json_build_object(
        'contactData', row_to_json(NEW)
      )::text
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER contact_submission_trigger
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_submission();
```

**Important**: Replace these values in the SQL:
- `YOUR_PROJECT_REF`: Your Supabase project reference
- `YOUR_ANON_KEY`: Your Supabase anon key (from Settings → API)

### 5. Configure Email Domain (Optional)
By default, emails will be sent from `noreply@yourdomain.com`. To use your own domain:

1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `kevinlaronda.com`)
3. Follow the DNS verification steps
4. Update the `from` field in the Edge Function

## 🧪 Testing

1. Submit a test contact form on your website
2. Check your email (klaronda@gmail.com) for the notification
3. Check the Supabase Edge Functions logs for any errors

## 🔧 Troubleshooting

### Email not sending?
1. Check the Edge Functions logs in Supabase dashboard
2. Verify your Resend API key is correct
3. Check that the trigger was created successfully

### Function deployment failed?
1. Make sure you're logged into Supabase CLI
2. Verify your project is linked correctly
3. Check that the function folder structure is correct

### Getting CORS errors?
The function includes CORS headers, but if you're still having issues, check:
1. Your Supabase project settings
2. Network connectivity
3. Function deployment status

## 📝 What You'll Receive

When someone submits your contact form, you'll get an email with:
- ✅ Sender's name and contact details
- ✅ Business information (if provided)
- ✅ Phone number (if provided)
- ✅ Full message content
- ✅ Timestamp of submission
- ✅ Reply-to set to sender's email

The email will be professionally formatted and easy to read!

## 🎯 Next Steps

Once this is working:
1. Consider setting up email templates for your responses
2. Add spam protection (reCAPTCHA)
3. Set up email analytics in Resend
4. Configure auto-responder emails to form submitters

---

**Need help?** Check the Supabase Edge Functions documentation or Resend's API docs for more advanced configurations.
