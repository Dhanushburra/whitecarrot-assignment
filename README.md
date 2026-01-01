# Careers Page Builder

A full-stack application that helps recruiters create branded careers pages for their companies, and allows candidates to browse open roles.

## Tech Stack

- **Backend**: Django 4.2 + Django REST Framework
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: PostgreSQL
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Styling**: Tailwind CSS

## Features

### For Recruiters:
- ✅ Set brand theme (colors, banner, logo, culture video)
- ✅ Add, remove, or reorder content sections (About Us, Life at Company, etc.)
- ✅ Preview how the page will look before publishing
- ✅ Save settings — each company's data stored separately
- ✅ Share their company's public Careers link
- ✅ Manage job postings

### For Candidates:
- ✅ Learn about the company through the Careers page
- ✅ Browse open jobs with filters (Location, Job Type) and search by Job Title
- ✅ Clean, mobile-friendly, and accessible UI
- ✅ SEO-ready page structure

## Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL (local installation or use a cloud service)
- pip (Python package manager)
- npm or yarn

## Setup Instructions

### 1. Database Setup

**Option A: Local PostgreSQL**

First, start PostgreSQL and create a database:

**For macOS (Homebrew):**
```bash
# Start PostgreSQL service
brew services start postgresql@14
# Or if you have a different version:
# brew services start postgresql

# Connect to PostgreSQL (default user is your macOS username)
psql postgres
# Or: psql -U your-username postgres

# Create database
CREATE DATABASE careers_builder;

# Exit psql
\q
```

**For Linux/Other:**
```bash
# Start PostgreSQL (if not running)
sudo systemctl start postgresql

# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE careers_builder;

# Exit psql
\q
```

**Note:** On macOS with Homebrew, the default PostgreSQL user is your macOS username (not `postgres`). Use your username in the `.env` file.

**Option B: Cloud Database (Supabase/Neon.tech)**

For cloud database setup, see **[CLOUD_DATABASE_SETUP.md](CLOUD_DATABASE_SETUP.md)** for detailed instructions on setting up Supabase or Neon.tech.

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp env.example .env

# Edit .env file with your database credentials:
# SECRET_KEY=your-secret-key-here (generate a random string)
# DEBUG=True
# DATABASE_NAME=careers_builder
# DATABASE_USER=your-username (on macOS, this is your macOS username)
# DATABASE_PASSWORD= (leave empty if no password, or set your password)
# DATABASE_HOST=localhost
# DATABASE_PORT=5432

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create sample data (optional, for testing)
python manage.py create_sample_data
# This creates a demo user (username: demo, password: demo123) with sample company and jobs

# Create superuser (optional, for Django admin)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file (optional, defaults to localhost:8000)
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
whitecarrot-assignment/
├── backend/
│   ├── careers_builder/      # Main Django project
│   ├── accounts/             # Authentication app
│   ├── companies/             # Company management app
│   ├── jobs/                  # Job postings app
│   ├── content/               # Content sections app
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/        # React components
    │   ├── pages/             # Page components
    │   ├── services/          # API service layer
    │   ├── contexts/          # React contexts
    │   └── App.tsx
    ├── package.json
    └── vite.config.ts
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `GET /api/auth/me/` - Get current user

### Companies
- `GET /api/companies/me/` - Get recruiter's company
- `PUT /api/companies/me/` - Update company
- `GET /api/companies/{slug}/public/` - Get public company data

### Content Sections
- `GET /api/content/` - Get all sections
- `POST /api/content/` - Create section
- `PUT /api/content/{id}/` - Update section
- `DELETE /api/content/{id}/` - Delete section
- `POST /api/content/reorder/` - Reorder sections
- `GET /api/content/public/?company={slug}` - Get public sections

### Jobs
- `GET /api/jobs/` - Get all jobs
- `POST /api/jobs/` - Create job
- `PUT /api/jobs/{id}/` - Update job
- `DELETE /api/jobs/{id}/` - Delete job
- `GET /api/jobs/public/?company={slug}` - Get public jobs with filters

## Usage Guide

### For Recruiters:

1. **Register/Login**: Create an account or login at `/login`
2. **Create Company**: On first login, a company will be automatically created
3. **Customize Brand**:
   - Go to "Brand Theme" tab
   - Set primary and secondary colors
   - Upload logo and banner images
   - Add culture video URL
4. **Add Content Sections**:
   - Go to "Content Sections" tab
   - Click "Add Section"
   - Choose section type, add title and content
   - Drag and drop to reorder sections
5. **Add Jobs**:
   - Go to "Jobs" tab
   - Click "Add Job"
   - Fill in job details
   - Mark as active to show on public page
6. **Preview**: Click "Preview" button to see how the page looks
7. **Share**: Click "Copy Share Link" to get the public URL

### For Candidates:

1. Visit the public careers page at `/{company-slug}/careers`
2. Browse company information and content sections
3. Use search and filters to find relevant jobs
4. Click "Apply Now" on any job (application flow not implemented)

## Sample Data

You can add sample data through:
1. Django admin at `/admin` (after creating superuser)
2. Through the recruiter dashboard UI
3. Using Django management commands

## Development Notes

- Backend runs on port 8000
- Frontend runs on port 5173
- CORS is configured to allow frontend-backend communication
- Media files (logos, banners) are stored in `backend/media/`
- JWT tokens are stored in localStorage

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env` file
- Verify database exists: `psql -U postgres -l`

### CORS Errors
- Ensure backend CORS settings include frontend URL
- Check that both servers are running

### Image Upload Issues
- Ensure `backend/media/` directory exists
- Check file permissions
- Verify file size limits

## Next Steps / Improvements

- [ ] Add job application flow
- [ ] Implement email notifications
- [ ] Add analytics tracking
- [ ] Implement image optimization
- [ ] Add rich text editor for content sections
- [ ] Add more customization options
- [ ] Implement caching for better performance
- [ ] Add unit and integration tests
- [ ] Add CI/CD pipeline
- [ ] Deploy to production

## License

This project is created for the Whitecarrot assignment.

