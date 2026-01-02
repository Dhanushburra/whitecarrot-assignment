# Careers Page Builder

A full-stack application that helps recruiters create branded careers pages for their companies, and allows candidates to browse open roles.

## Tech Stack

- **Backend**: Django 4.2 + Django REST Framework
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Styling**: Tailwind CSS

## Features

### For Recruiters:
- Set brand theme (colors, banner, logo, culture video)
- Add, remove, or reorder content sections (About Us, Life at Company, etc.)
- Preview how the page will look before publishing
- Save settings — each company's data stored separately
- Share their company's public Careers link

### For Candidates:
- Learn about the company through the Careers page
- Browse open jobs with filters (Location, Job Type, Experience, etc.)

## Local Development

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Deployment
- **Backend**: Render.com
- **Frontend**: Vercel
- **Database**: Supabase

## API Endpoints

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `GET /api/auth/me/` - Get current user
- `GET /api/companies/me/` - Get current user's company
- `PUT /api/companies/me/` - Update company
- `GET /api/companies/{slug}/public/` - Get public company info
- `GET /api/jobs/public/` - Get public jobs (with filters)
- `GET /api/content/{company_id}/public/` - Get public content sections

## Demo link: https://drive.google.com/file/d/1CO_zYL3fABWpBfeeUihBI9kq80C8EXtm/view?usp=sharing

## Deployement: https://whitecarrot-assignment-three.vercel.app/

## GitHub: https://github.com/Dhanushburra/whitecarrot-assignment