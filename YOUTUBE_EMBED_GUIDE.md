# YouTube Video Embed Guide

## 🎥 How to Embed YouTube Videos

### **Method 1: Using the Rich Text Editor (Easiest)**

1. **Go to the Admin Panel** and edit a project
2. **Click in any rich text field** (Summary, Problem, Objective, Actions, Output, or Lessons)
3. **Click the YouTube icon** (📺) in the toolbar
4. **Enter the YouTube URL** when prompted:
   - Full URL: `https://www.youtube.com/watch?v=VIDEO_ID`
   - Short URL: `https://youtu.be/VIDEO_ID`
   - Embed URL: `https://www.youtube.com/embed/VIDEO_ID`
5. **Click OK** - The video will be embedded!
6. **Save your project**

### **Method 2: Manual HTML (Advanced)**

If you need more control, you can manually add the iframe HTML in the rich text editor:

```html
<iframe 
  width="640" 
  height="360" 
  src="https://www.youtube.com/embed/VIDEO_ID" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
```

Replace `VIDEO_ID` with your YouTube video ID (e.g., `dQw4w9WgXcQ`).

## 📝 Supported URL Formats

The YouTube extension automatically recognizes these URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`

## 🎨 Video Appearance

- Videos are **responsive** and will scale to fit the content area
- Default size: **640px wide × 480px tall**
- Videos maintain a **16:9 aspect ratio** on mobile devices
- Videos have **rounded corners** to match your site's design
- Videos have proper **spacing** above and below

## 💡 Tips

1. **Get the YouTube URL**:
   - Go to the video on YouTube
   - Click the "Share" button
   - Copy the URL

2. **Test Your Embed**:
   - After embedding, save your project
   - View the project page to see the video
   - Make sure it plays correctly

3. **Video Positioning**:
   - Videos can be placed anywhere in your text content
   - Add text before or after the video as needed
   - Multiple videos can be embedded in the same field

4. **Performance**:
   - Videos are loaded from YouTube's servers
   - They don't impact your site's storage or bandwidth
   - Videos load on-demand when users view the page

## 🔧 Customization

If you want to change the default video size, edit:
```typescript
// src/components/RichTextEditor.tsx
Youtube.configure({
  width: 640,  // Change this
  height: 480, // Change this
  HTMLAttributes: {
    class: 'rounded-lg my-4',
  },
})
```

## 📱 Responsive Design

Videos automatically adapt to different screen sizes:
- **Desktop**: Full 640px width (or smaller if content area is narrower)
- **Tablet**: Scales to fit container
- **Mobile**: Full width with maintained aspect ratio

## ✅ What's Been Added

- ✅ YouTube extension installed (`@tiptap/extension-youtube`)
- ✅ YouTube button added to rich text editor toolbar
- ✅ Responsive CSS styling for embedded videos
- ✅ Automatic URL parsing (works with all YouTube URL formats)
- ✅ Rounded corners and proper spacing

## 🎬 Example Usage

**Add to Summary:**
"Check out this overview of the project:"
[YouTube video embedded here]
"This demonstrates the key features..."

**Add to Actions:**
"Here's a walkthrough of the implementation process:"
[YouTube video embedded here]

**Add to Output:**
"The final result can be seen in this demo:"
[YouTube video embedded here]








