
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/31ed4c2b-46a1-4093-8277-e7fe1cfc6078

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/31ed4c2b-46a1-4093-8277-e7fe1cfc6078) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/31ed4c2b-46a1-4093-8277-e7fe1cfc6078) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Communication Hub - Role-Based Access Integration Guide

The Communication Hub includes role-based access functionality that allows different views for primary caregivers and family members.

### Integration Steps

#### 1. Wrap your application with UserRoleProvider

```typescript
import UserRoleProvider from './src/components/UserRoleProvider';

// In your main app component or App.tsx:
function App() {
  return (
    <UserRoleProvider defaultRole="primary-caregiver">
      {/* Your existing app components */}
    </UserRoleProvider>
  );
}
```

#### 2. Use RoleAwareEmailDashboard instead of EmailDashboard

```typescript
// Replace this:
import EmailDashboard from './src/components/EmailDashboard';

// With this:
import RoleAwareEmailDashboard from './src/components/RoleAwareEmailDashboard';

// In your component:
<RoleAwareEmailDashboard searchQuery={searchQuery} />
```

#### 3. Set user role dynamically

```typescript
import { useUserRole } from './src/hooks/useUserRole';

function YourComponent() {
  const { userRole, setUserRole } = useUserRole();
  
  // Example: Set role based on authentication or user selection
  const handleRoleChange = (role: 'primary-caregiver' | 'family-member') => {
    setUserRole(role);
  };
  
  return (
    <div>
      <button onClick={() => handleRoleChange('primary-caregiver')}>
        Primary Caregiver View
      </button>
      <button onClick={() => handleRoleChange('family-member')}>
        Family Member View
      </button>
      <p>Current role: {userRole}</p>
    </div>
  );
}
```

### Features by Role

#### Primary Caregiver
- Can view ALL emails (including private ones)
- Can mark emails as private/public
- Full access to all functionality

#### Family Member (Read-Only)
- Can view only NON-PRIVATE emails
- Cannot see emails marked as private
- Limited to viewing functionality

### Components Added

- `UserRoleProvider`: Context provider for managing user roles
- `RoleAwareEmailDashboard`: Role-aware version of the dashboard
- `useUserRole`: Hook for accessing and setting user roles
- `useFilteredEmailData`: Hook for filtering emails based on privacy settings
- Updated `useEmailFiltering`: Now respects privacy settings based on user role

### Notes

- Private emails are completely hidden from family members (not just visually hidden)
- The role indicator badge shows the current view mode
- All filtering happens at the data level to ensure privacy
- The EmailDetail page and other components will automatically respect the user's role when accessing individual emails
