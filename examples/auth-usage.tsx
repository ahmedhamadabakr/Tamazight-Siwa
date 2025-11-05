// مثال على استخدام نظام المصادقة والتفويض الجديد

import React from 'react';
import { 
  withAuth, 
  withAdminAuth, 
  withManagerAuth,
  useRole,
  usePermissions,
  ProtectedComponent,
  UserRole 
} from '@/lib/auth/withAuth';

// 1. حماية صفحة كاملة بـ HOC
const AdminDashboard = withAdminAuth(() => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>only admin can access this page</p>
    </div>
  );
});

// 2. حماية مكون بدور محدد
const ManagerPanel = withManagerAuth(() => {
  return (
    <div>
      <h1>Manager Panel</h1>
      <p>only manager can access this page</p>
    </div>
  );
});

// 3. حماية مخصصة بأدوار متعددة
const CustomProtectedComponent = withAuth(() => {
  return (
    <div>
      <h1>Custom Protected</h1>
      <p>only manager and admin can access this page</p>
    </div>
  );
});

// 4. استخدام hooks للتحقق من الأدوار
function RoleBasedUI() {
  const { role, hasRole, isAdmin, isManager } = useRole();
  const { canAccess, user } = usePermissions();

  return (
    <div>
      <h2>hello {user?.name}</h2>
      <p>your role is: {role}</p>
      
      {isAdmin && (
        <button>admin settings</button>
      )}
      
      {isManager && (
        <button>manager panel</button>
      )}
      
      {hasRole() && (
        <button>user profile</button>
      )}
      
      {canAccess() && (
        <button>admin settings</button>
      )}
    </div>
  );
}

// 5. حماية أجزاء من المكون
function ConditionalContent() {
  return (
    <div>
      <h1>public content</h1>
      
      {/* محتوى للمستخدمين المسجلين فقط */}
      <ProtectedComponent requiredRole={UserRole.USER}>
        <p>only user can access this page</p>
      </ProtectedComponent>
      
      {/* محتوى للمديرين فقط */}
      <ProtectedComponent 
        allowedRoles={[UserRole.MANAGER, UserRole.ADMIN]}
        fallback={<p>only manager and admin can access this page</p>}
      >
        <button>manager panel</button>
      </ProtectedComponent>
      
      {/* محتوى للأدمن فقط */}
      <ProtectedComponent requiredRole={UserRole.ADMIN}>
        <div>
          <h3>admin panel</h3>
          <p>Admin-only content here</p>
        </div>
      </ProtectedComponent>
    </div>
  );
}

// 6. مثال على API محمي
// في ملف API route
/*
import { checkServerPermission, UserRole, Permission } from '@/lib/auth';

export async function GET() {
  const { authorized, user, error } = await checkServerPermission(
    UserRole.MANAGER, 
    Permission.VIEW_REPORTS
  );
  
  if (!authorized) {
    return Response.json({ error }, { status: 403 });
  }
  
  // المستخدم مخول للوصول
  return Response.json({ data: 'sensitive data', user });
}
*/

// 7. مثال على middleware مخصص
/*
import { createPermissionMiddleware, UserRole } from '@/lib/auth';

const requireAdmin = createPermissionMiddleware(UserRole.ADMIN);

export async function adminOnlyFunction() {
  try {
    const user = await requireAdmin();
    // المستخدم أدمن، يمكن المتابعة
    console.log('Admin user:', user);
  } catch (error) {
    // المستخدم ليس أدمن
    throw new Error('Admin access required');
  }
}
*/

export {
  AdminDashboard,
  ManagerPanel,
  CustomProtectedComponent,
  RoleBasedUI,
  ConditionalContent
};