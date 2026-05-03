# Vercel Deployment Guide

## Prerequisites
- Vercel Account (sign up at [vercel.com](https://vercel.com))
- GitHub Account (recommended)
- MongoDB Atlas Database

## Step 1: Push to GitHub
1. Create a new repository on GitHub
2. Push your code to the repository:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

## Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will automatically detect the framework and settings

## Step 3: Configure Environment Variables
In Vercel dashboard, go to your project → Settings → Environment Variables and add:

1. **MONGO_URI**
   - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0`

2. **JWT_SECRET**
   - Your JWT secret key
   - Example: `your-secret-jwt-key-here`

3. **NODE_ENV**
   - Set to: `production`

## Step 4: Deploy
1. Click "Deploy" button
2. Wait for deployment to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

## Step 5: Seed Database (Optional)
If you need to seed your database with initial data:
1. Deploy the application first
2. Run the seeder locally or create a temporary API endpoint for seeding

## Files Created for Deployment
- `vercel.json` - Vercel configuration
- `backend/api/index.js` - Serverless API entry point
- `.env.example` - Environment variables template
- Updated `package.json` - Build scripts

## Troubleshooting

### Common Issues:
1. **Build fails** - Check environment variables in Vercel dashboard
2. **API routes not working** - Verify `vercel.json` configuration
3. **Database connection fails** - Check MongoDB URI and network access
4. **CORS issues** - Ensure frontend and backend are properly configured

### Environment Variables Note:
- Never commit `.env` file to Git
- Use Vercel's Environment Variables for sensitive data
- Make sure MongoDB Atlas allows access from anywhere (0.0.0.0/0)

## Post-Deployment
1. Test all API endpoints
2. Verify user authentication works
3. Test database operations
4. Monitor logs in Vercel dashboard

## Custom Domain (Optional)
1. Go to project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
