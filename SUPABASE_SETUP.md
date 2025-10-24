# Supabase Setup Guide for Kevin Laronda Portfolio

## 🚀 Quick Setup

### 1. Create Environment File
```bash
# Copy the example file
cp .env.example .env.local
```

### 2. Get Your Supabase Credentials

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **"kevinlaronda"** project
3. Go to **Settings > API**
4. Copy the **Project URL** and **anon public** key
5. Update your `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Create Database Tables

Run these SQL commands in your Supabase SQL Editor:

#### Projects Table
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  summary TEXT NOT NULL,
  situation TEXT NOT NULL,
  task TEXT NOT NULL,
  action TEXT NOT NULL,
  results TEXT NOT NULL,
  lessons_learned TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '[]',
  images JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your use case)
CREATE POLICY "Enable read access for all users" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');
```

#### Ventures Table
```sql
CREATE TABLE ventures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON ventures
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON ventures
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON ventures
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON ventures
  FOR DELETE USING (auth.role() = 'authenticated');
```

#### Resume Table
```sql
CREATE TABLE resume (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience JSONB NOT NULL DEFAULT '[]',
  skills JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON resume
  FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users" ON resume
  FOR UPDATE USING (auth.role() = 'authenticated');
```

### 4. Insert Sample Data (Optional)

You can insert some sample data to get started:

```sql
-- Insert sample project
INSERT INTO projects (title, badge_type, hero_image, summary, situation, task, action, results, lessons_learned, metrics, images)
VALUES (
  'FinTech Platform Redesign',
  'UX Design',
  'https://images.unsplash.com/photo-1698434156098-68e834638679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVWCUyMGRlc2lnbiUyMHdpcmVmcmFtZSUyMG1vY2t1cHxlbnwxfHx8fDE3NTk3NjU2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Complete platform redesign increasing user engagement by 40%',
  'A leading fintech company was experiencing declining user engagement...',
  'Redesign the entire platform experience to improve usability...',
  'Conducted extensive user research including interviews...',
  'The redesigned platform delivered significant improvements...',
  'The importance of balancing regulatory requirements with user experience...',
  '[{"value": "40%", "title": "User Engagement", "description": "Increase in daily active users and session duration"}]',
  '["https://images.unsplash.com/photo-1698434156098-68e834638679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVWCUyMGRlc2lnbiUyMHdpcmVmcmFtZSUyMG1vY2t1cHxlbnwxfHx8fDE3NTk3NjU2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"]'
);
```

### 5. Test the Connection

1. Start your development server: `npm run dev`
2. Open the admin interface: Press `Ctrl+Shift+A` or go to `/admin`
3. Try adding/editing content to test the Supabase connection

## 🔧 Features Enabled

With Supabase integration, you now have:

- ✅ **Real-time data** from your Supabase database
- ✅ **Admin interface** for content management
- ✅ **CRUD operations** for projects, ventures, and resume
- ✅ **Row Level Security** for data protection
- ✅ **Type-safe** database operations
- ✅ **Error handling** and loading states

## 🚨 Troubleshooting

### Common Issues:

1. **"Supabase configuration missing" warning**
   - Check that your `.env.local` file exists and has the correct values
   - Restart your development server after adding environment variables

2. **Database connection errors**
   - Verify your Supabase URL and API key are correct
   - Check that your database tables exist
   - Ensure Row Level Security policies are set up correctly

3. **Permission errors**
   - Make sure you're authenticated (if using auth)
   - Check your RLS policies allow the operations you're trying to perform

## 📝 Next Steps

1. **Customize the data structure** to match your needs
2. **Add authentication** if you want to secure the admin interface
3. **Set up file storage** for images and assets
4. **Deploy** your portfolio with Supabase backend

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
