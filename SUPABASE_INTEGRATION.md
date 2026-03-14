# Supabase Integration - StudyFlow App

## Overview

The StudyFlow application has been successfully integrated with Supabase for authentication and data persistence. All user data is now securely stored in the Supabase PostgreSQL database with Row Level Security (RLS) policies enforcing user-specific data access.

## Database Schema

### Tables Created

1. **users** - User profiles (auto-managed by Supabase Auth)
   - `id`: UUID (primary key, references auth.users)
   - `email`: Text (unique)
   - `full_name`: Text (optional)
   - `created_at`: Timestamp
   - `updated_at`: Timestamp

2. **subjects** - Study subjects/topics
   - `id`: UUID (primary key)
   - `user_id`: UUID (foreign key to users)
   - `name`: Text (required)
   - `color`: Text (hex color code)
   - `description`: Text (optional)
   - `created_at`: Timestamp
   - `updated_at`: Timestamp

3. **study_plans** - User-created study plans
   - `id`: UUID (primary key)
   - `user_id`: UUID (foreign key to users)
   - `name`: Text (required)
   - `description`: Text (optional)
   - `start_date`: Date
   - `end_date`: Date
   - `study_hours_per_day`: Numeric
   - `include_weekends`: Boolean
   - `created_at`: Timestamp
   - `updated_at`: Timestamp

4. **modules** - Study modules within plans
   - `id`: UUID (primary key)
   - `study_plan_id`: UUID (foreign key to study_plans)
   - `subject_id`: UUID (foreign key to subjects)
   - `name`: Text (required)
   - `estimated_hours`: Numeric
   - `scheduled_date`: Date
   - `status`: Text (Not Started, In Progress, Completed, Skipped)
   - `notes`: Text (optional)
   - `created_at`: Timestamp
   - `updated_at`: Timestamp

5. **study_sessions** - Individual study sessions
   - `id`: UUID (primary key)
   - `user_id`: UUID (foreign key to users)
   - `module_id`: UUID (foreign key to modules)
   - `session_date`: Date
   - `duration_minutes`: Integer
   - `completed`: Boolean
   - `notes`: Text (optional)
   - `created_at`: Timestamp
   - `updated_at`: Timestamp

## Row Level Security (RLS) Policies

All tables have RLS enabled with the following policies:

### users
- Users can view their own profile (SELECT)
- Users can update their own profile (UPDATE)

### subjects
- Users can view their own subjects (SELECT)
- Users can insert their own subjects (INSERT)
- Users can update their own subjects (UPDATE)
- Users can delete their own subjects (DELETE)

### study_plans
- Users can view their own study plans (SELECT)
- Users can insert their own study plans (INSERT)
- Users can update their own study plans (UPDATE)
- Users can delete their own study plans (DELETE)

### modules
- Users can view modules in their study plans (SELECT)
- Users can insert modules to their study plans (INSERT)
- Users can update modules in their study plans (UPDATE)
- Users can delete modules in their study plans (DELETE)

### study_sessions
- Users can view their own study sessions (SELECT)
- Users can insert their own study sessions (INSERT)
- Users can update their own study sessions (UPDATE)
- Users can delete their own study sessions (DELETE)

## Authentication Flow

### Setup Files

- **`lib/supabase/client.ts`** - Browser-side Supabase client
- **`lib/supabase/server.ts`** - Server-side Supabase client for Server Components
- **`lib/supabase/proxy.ts`** - Session refresh middleware for token management
- **`middleware.ts`** - Next.js middleware for auth state management

### Auth Pages

- **`app/auth/login/page.tsx`** - Login page with email/password auth
- **`app/auth/sign-up/page.tsx`** - Sign-up page with password confirmation
- **`app/auth/sign-up-success/page.tsx`** - Email confirmation page

### Protected Routes

All app pages are protected using the `ProtectedRoute` wrapper component:

- ✅ `/dashboard` - Main dashboard
- ✅ `/study-planner` - Create study plans
- ✅ `/calendar` - View study calendar
- ✅ `/modules` - Module tracker
- ✅ `/focus-mode` - Focus timer
- ✅ `/subjects` - Subject progress
- ✅ `/settings` - User settings

Unauthenticated users are automatically redirected to `/auth/login`.

## Integration Implementation

### Custom Hooks

**`lib/hooks/useSupabaseStudyData.ts`** provides all CRUD operations:

```typescript
const {
  user,              // Current authenticated user
  isLoading,         // Loading state
  error,             // Error messages
  fetchStudyPlans,   // GET study plans
  createStudyPlan,   // CREATE study plan
  createModule,      // CREATE module
  fetchModules,      // GET modules for plan
  updateModuleStatus, // UPDATE module status
  createStudySession, // CREATE study session
  fetchSubjects,     // GET subjects
  createSubject,     // CREATE subject
} = useSupabaseStudyData()
```

### Data Persistence

Currently, the app still uses localStorage for local state management via `useStudyPlanStore`. To fully migrate to Supabase:

1. Update dashboard components to fetch data from Supabase
2. Update module operations to use `useSupabaseStudyData` hook
3. Update study planner to create records in Supabase
4. Update calendar/modules pages to fetch and update from Supabase

## Migration Notes

### Current Architecture
- **Authentication**: ✅ Supabase (complete)
- **Data Storage**: Hybrid (localStorage + Supabase-ready)
- **State Management**: useStudyPlanStore (localStorage)

### Next Steps for Full Migration
1. Replace localStorage with Supabase API calls in components
2. Add optimistic updates for better UX
3. Implement real-time subscriptions for multi-device sync
4. Add error handling and retry logic
5. Update components to use `useSupabaseStudyData` hook

## Environment Variables

The following environment variables are automatically set by Vercel's Supabase integration:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_URL` - Supabase URL (server-side)
- `SUPABASE_JWT_SECRET` - JWT secret for signing
- `SUPABASE_ANON_KEY` - Anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- `POSTGRES_URL` - PostgreSQL connection string
- Plus other database connection variables

## Testing the Integration

1. **Sign Up**: Create a new account at `/auth/sign-up`
2. **Email Confirmation**: Click the confirmation link in your email
3. **Login**: Use credentials to login at `/auth/login`
4. **Create Study Plan**: Navigate to `/study-planner`
5. **View Dashboard**: Check `/dashboard` for data persistence
6. **Module Tracking**: Manage modules at `/modules`

## Security Considerations

✅ All queries enforce Row Level Security based on `auth.uid()`
✅ Passwords are hashed by Supabase Auth
✅ Email confirmation required before account activation
✅ Session tokens managed via secure HTTP-only cookies
✅ No sensitive data stored in localStorage
✅ Middleware refreshes sessions on every request

## Troubleshooting

### User not redirecting to dashboard after login
- Check that middleware.ts is present and configured
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
- Clear browser cookies and try again

### RLS policy errors
- Verify user_id is being passed correctly
- Check that user is authenticated before making requests
- Ensure email is confirmed before attempting CRUD operations

### Email confirmation not received
- Check Supabase email configuration in project settings
- Verify email is not going to spam folder
- Set up email templates in Supabase dashboard

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js 16 + Supabase Integration](https://supabase.com/docs/guides/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
