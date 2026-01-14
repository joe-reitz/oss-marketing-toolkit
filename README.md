# Marketing Toolkit

A free, open-source collection of marketing tools that you can customize with your own branding. Perfect for marketing teams who want their own branded toolkit without hiring developers.

## 🎯 What's Included

- **UTM Generator** - Create trackable campaign URLs with UTM parameters (get both full URL and query string)
- **Image Generator** - Design branded social media images with custom backgrounds, logos, and text
- **QR Code Generator** - Generate custom QR codes for campaigns and events
- **Naming Generators** - Create consistent names for campaigns and assets (SFDC, MAP, and generic formats)
- **Date & Time Generator** - Create calendar event links (Agical & Google Calendar) with timezone support
- **Content Analyzer** - Analyze and rewrite marketing content using AI (requires OpenAI API key)
- **Data Tools** - Format data for SOQL queries and convert spreadsheet data to comma-separated values

## 🚀 Quick Start (For Non-Developers)

### Prerequisites

Before you begin, you'll need:

1. **A computer** (Mac, Windows, or Linux)
2. **Node.js installed** - Download from [nodejs.org](https://nodejs.org/) (choose the "LTS" version)
   - To check if you have it: Open Terminal (Mac) or Command Prompt (Windows) and type `node --version`
   - You should see something like `v20.x.x`

### Step 1: Download This Project

**Option A: Using Git** (if you have it installed)
```bash
git clone https://github.com/yourusername/marketing-toolkit.git
cd marketing-toolkit
```

**Option B: Download as ZIP**
1. Click the green "Code" button at the top of this page
2. Click "Download ZIP"
3. Extract the ZIP file to a folder on your computer
4. Open Terminal (Mac) or Command Prompt (Windows)
5. Navigate to the folder: `cd path/to/marketing-toolkit`

### Step 2: Install Dependencies

In your Terminal or Command Prompt, run:

```bash
npm install
```

This will download all the code libraries this project needs. It might take a few minutes.

### Step 3: Start the Development Server

```bash
npm run dev
```

You should see a message like:
```
  ▲ Next.js 14.2.15
  - Local:        http://localhost:3000
```

**Open your browser and go to:** `http://localhost:3000`

🎉 **You should now see your Marketing Toolkit!**

---

## 🎨 Customizing for Your Brand

### Step 1: Update Company Information

1. **Find the file:** `src/config/brand.ts`
2. **Open it in any text editor** (VS Code, Sublime Text, or even Notepad)
3. **Change these values:**

```typescript
company: {
  name: "Your Company Name",      // Full company name (shown on desktop)
  shortName: "YCN",                // Short version (shown on mobile)
},
```

### Step 2: Add Your Logo (Optional)

You can either use an emoji or add custom logo files.

**Option A: Use an Emoji** (Easiest)

In `src/config/brand.ts`, change the fallback emoji:

```typescript
logo: {
  fallback: "🚀",  // Change this to any emoji you like
},
```

**Option B: Add Custom Logo Files**

1. **Create a folder** at `public/images/` (if it doesn't exist)
2. **Add these 4 files** (or just 2 if you want to use the same logo for light and dark):
   - `icon-light.svg` - Your logo icon for dark backgrounds (white or light colored)
   - `icon-dark.svg` - Your logo icon for light backgrounds (dark colored)
   - `logotype-light.svg` - Your full logo with text for dark backgrounds
   - `logotype-dark.svg` - Your full logo with text for light backgrounds

**Logo Requirements:**
- **Format:** SVG preferred (PNG also works)
- **Icon Size:** 512×512 pixels (square)
- **Logotype Size:** Any width, ~512px height
- **Background:** Transparent

**If you only have one logo:**
Just use the same file for both light and dark versions. The toolkit will still work!

### Step 3: Change Brand Colors (Optional)

In `src/config/brand.ts`, you can customize the color scheme:

```typescript
colors: {
  primary: {
    hue: 221,        // 0-360 (221 is blue, 0 is red, 120 is green, etc.)
    saturation: 83,  // 0-100 (how vibrant the color is)
    lightness: 53,   // 0-100 (how bright the color is)
  },
  accent: {
    hue: 142,
    saturation: 71,
    lightness: 45,
  },
},
```

**Not sure what HSL values to use?**
Use this free tool: [HSL Color Picker](https://hslpicker.com/)

### Step 4: Customize Image Backgrounds (Optional)

Add custom gradient backgrounds for the Image Generator tool.

In `src/config/brand.ts`, add to the `imageBackgrounds` array:

```typescript
imageBackgrounds: [
  {
    id: "my-brand-gradient",           // Unique ID (no spaces)
    name: "My Brand Gradient",         // Name shown to users
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "my-brand-color",
    name: "My Brand Color",
    gradient: "#3b82f6",              // Solid color (use your brand color)
  },
  // Keep or remove the existing presets below
]
```

**Find gradient colors:**
- [WebGradients](https://webgradients.com/) - Copy the CSS gradient
- [uiGradients](https://uigradients.com/) - Interactive gradient maker

### Step 5: Update Links (Optional)

In `src/config/brand.ts`, update your website and GitHub links:

```typescript
links: {
  website: "https://yourcompany.com",
  github: "https://github.com/yourcompany/marketing-toolkit",
  documentation: "https://docs.yourcompany.com",
},
```

### Step 6: Enable/Disable Features (Optional)

Don't need all the tools? Turn them off in `src/config/brand.ts`:

```typescript
features: {
  utmGenerator: true,           // UTM link builder
  imageGenerator: true,         // Social image creator
  qrCodeGenerator: true,        // QR code maker
  namingGenerators: true,       // Campaign name generators
  contentAnalyzer: true,        // AI content rewriter (needs API key)
  dateTimePicker: true,         // Calendar event link generator
  emailBuilder: true,           // Email builder (not yet implemented)
  emailPriorityPlanner: true,   // Email planner (not yet implemented)
  soqlQueryHelper: true,        // Data formatting tools
},
```

Set any of these to `false` to hide them from the navigation.

---

## 🤖 Setting Up the Content Analyzer (AI Feature)

The Content Analyzer uses OpenAI's API to rewrite and improve marketing content.

### Step 1: Get an OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create new secret key**
5. Copy the key (it looks like: `sk-...`)

### Step 2: Add Your API Key

1. **Copy the example file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Open `.env.local` in your text editor**

3. **Replace the placeholder with your key:**
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

4. **Save the file**

5. **Restart your development server:**
   - Press `Ctrl+C` to stop it
   - Run `npm run dev` again

**Note:** The `.env.local` file is ignored by Git, so your API key stays private.

---

## 🌐 Deploying to the Internet

Once you've customized your toolkit, you'll want to deploy it so your team can access it online.

### Option 1: Deploy to Vercel (Recommended - Free)

Vercel is the company behind Next.js and offers free hosting.

1. **Create a free account** at [vercel.com](https://vercel.com)
2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```
3. **Deploy:**
   ```bash
   vercel
   ```
4. **Follow the prompts** - it will ask you to confirm project settings
5. **Done!** You'll get a live URL like `https://your-toolkit.vercel.app`

**Adding your API key to Vercel:**
1. Go to your project on vercel.com
2. Click **Settings** → **Environment Variables**
3. Add `OPENAI_API_KEY` with your key
4. Click **Save**
5. Redeploy: `vercel --prod`

### Option 2: Deploy to Netlify (Also Free)

1. **Create account** at [netlify.com](https://netlify.com)
2. **Connect your GitHub repository**
3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Add environment variables** in Netlify dashboard
5. **Deploy!**

### Option 3: Deploy to Your Own Server

If you have your own hosting:

```bash
# Build the production version
npm run build

# Start the production server
npm start
```

You'll need a server that can run Node.js (like DigitalOcean, AWS, or any VPS).

---

## 📁 Project Structure

Here's what's in each folder:

```
marketing-toolkit/
├── public/
│   ├── images/              ← Put your logo files here
│   └── fonts/               ← Custom fonts (if needed)
│
├── src/
│   ├── app/                 ← Each tool has its own folder
│   │   ├── utm-generator/
│   │   ├── image-generator/
│   │   ├── qr-code-generator/
│   │   ├── naming-generators/
│   │   ├── date-time-picker/
│   │   ├── content-analyzer/
│   │   ├── soql-query-helper/
│   │   └── page.tsx         ← Home page
│   │
│   ├── components/
│   │   ├── ui/              ← Reusable UI components
│   │   ├── Navigation.tsx   ← Top navigation bar
│   │   └── theme-*.tsx      ← Light/dark mode toggle
│   │
│   ├── config/
│   │   └── brand.ts         ← 🎨 YOUR BRAND SETTINGS GO HERE
│   │
│   └── lib/                 ← Helper functions
│
├── .env.local.example       ← Copy this to .env.local
├── .env.local               ← Your API keys (not tracked by Git)
├── package.json             ← Project dependencies
└── README.md                ← This file
```

---

## 🎨 Understanding the Tools

### UTM Generator
Creates trackable campaign URLs with UTM parameters. You can copy either:
- The full URL with parameters
- Just the query string (to append to any URL)

**Use cases:**
- Email campaigns
- Social media posts
- Paid advertising
- Partner links

### Image Generator
Create branded social media images with:
- Custom text and positioning
- 10+ gradient backgrounds (or upload your own)
- Your logo automatically applied
- Multiple size presets (Open Graph, YouTube, Email, etc.)
- Optional background blur for uploaded images

**Formats available:**
- Open Graph (1200×630) - for social sharing
- YouTube Thumbnail (1280×720)
- Twitter Card (1200×675)
- Email Banners (600×200 or 600×400 @2x)
- Wide Banner (2048×400)

### QR Code Generator
Generate QR codes for:
- Event registration
- Campaign landing pages
- Product pages
- App downloads

Adjustable size from 128px to 512px.

### Naming Generators
Create consistent naming conventions for:
- **SFDC Campaigns** - Salesforce campaign names
- **MAP Campaigns** - Marketing automation platform campaigns (like Marketo, HubSpot, etc.)
- **MAP Assets** - Marketing automation platform assets (emails, lists, audiences)

Ensures your whole team follows the same naming structure.

### Date & Time Generator
Two tools in one:
1. **Calendar Event Links** - Generate Agical (.ics) and Google Calendar links with timezone support
2. **SFDC Date/Time** - Format dates for Salesforce imports

Perfect for event invitations and webinar campaigns.

### Content Analyzer
Powered by OpenAI's GPT models to:
- Rewrite marketing copy
- Analyze tone and clarity
- Suggest improvements
- Support multiple content types (emails, blog posts, social, ads)

**Requires:** OpenAI API key (see setup instructions above)

### Data Tools
Two utilities:
1. **SOQL Query Helper** - Format values for Salesforce SOQL queries
2. **Comma Separator** - Convert spreadsheet data to comma-separated values

---

## 🎯 Light & Dark Mode

The toolkit automatically supports both light and dark themes:

- **Toggle button** in the top right of the navigation bar
- **Remembers your preference** across visits
- **System preference detection** - starts with your OS theme
- **All tools are theme-aware** - no broken styling in either mode

---

## ❓ Troubleshooting

### "npm: command not found"
**Solution:** You need to install Node.js first. Download from [nodejs.org](https://nodejs.org/)

### Port 3000 is already in use
**Solution:** Either:
- Stop whatever is running on port 3000
- Or Next.js will automatically try port 3001, 3002, etc.

### Changes not showing up
**Solution:**
1. Make sure you saved the file
2. The browser should automatically refresh
3. If not, manually refresh the page (Cmd+R or Ctrl+R)
4. If still not working, stop the server (Ctrl+C) and run `npm run dev` again

### "Module not found" errors
**Solution:** Run `npm install` again - a dependency might be missing

### Logo not showing
**Solution:**
- Check the file path in `src/config/brand.ts` matches your actual file
- Make sure files are in `public/images/` (not `src/images/`)
- File names are case-sensitive
- Try using the fallback emoji instead

### Content Analyzer not working
**Solution:**
- Make sure you created the `.env.local` file (not `.env.local.example`)
- Check that your OpenAI API key is correct
- Verify you have API credits in your OpenAI account
- Restart the dev server after adding the key

### Build fails
**Solution:**
1. Run `npm install` to make sure all dependencies are installed
2. Check for any TypeScript errors: `npm run type-check`
3. Check for linting errors: `npm run lint`
4. Make sure all your changes in `brand.ts` have correct syntax

---

## 🔧 Advanced Customization

### Adding a New Tool

1. Create a new folder in `src/app/` (e.g., `src/app/my-tool/`)
2. Create a `page.tsx` file in that folder
3. Add your tool's code
4. Add it to the navigation in `src/components/Navigation.tsx`

### Changing the Font

The toolkit uses Geist Sans by default. To change:

1. Add your font files to `public/fonts/`
2. Update `src/app/layout.tsx` to import your font
3. Update the font family in `tailwind.config.ts`

### Modifying Styles

The toolkit uses Tailwind CSS. Key files:
- `src/app/globals.css` - Global styles and theme colors
- `tailwind.config.ts` - Tailwind configuration
- Component files use Tailwind classes directly

---

## 📦 Tech Stack

**For the curious:**
- **Framework:** Next.js 14 (React framework with App Router)
- **Language:** TypeScript (JavaScript with types)
- **Styling:** Tailwind CSS (utility-first CSS)
- **Components:** Radix UI + shadcn/ui (accessible component library)
- **Icons:** Lucide React
- **QR Codes:** qrcode.react
- **Date Handling:** date-fns

---

## 📄 License

MIT License - This means you can:
- ✅ Use it commercially
- ✅ Modify it however you want
- ✅ Distribute it
- ✅ Use it privately
- ❌ Hold the authors liable

See the `LICENSE` file for full details.

---

## 🤝 Contributing

Found a bug? Want to add a feature? Contributions are welcome!

1. Fork this repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## 💬 Support

Need help?
- 📖 Read through this README carefully
- 🐛 [Open an issue](https://github.com/yourusername/marketing-toolkit/issues) on GitHub
- 💡 Check the troubleshooting section above

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) by Vercel
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by marketing teams who need better tools

---

**Made with ❤️ for marketing teams everywhere**

Start customizing your toolkit today and make it your own!
