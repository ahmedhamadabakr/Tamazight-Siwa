# نظام المصادقة والأمان المحسن

## نظرة عامة

تم تطوير نظام مصادقة شامل وآمن يتضمن إدارة الجلسات، التوكن، وميزات الأمان المتقدمة.

## المكونات الرئيسية

### 1. إدارة المصادقة (Authentication)

#### NextAuth.js Configuration
- **الملف**: `lib/auth.ts`
- **المزايا**:
  - مزود المصادقة المخصص (Credentials Provider)
  - إدارة JWT tokens
  - دعم "تذكرني" (Remember Me)
  - تحديث الجلسة التلقائي

#### API Routes
- **تسجيل الدخول**: `app/api/auth/login/route.ts`
- **تسجيل الخروج**: `app/api/auth/logout/route.ts`
- **تسجيل الخروج من جميع الأجهزة**: `app/api/auth/logout-all/route.ts`
- **تحديث التوكن**: `app/api/auth/refresh/route.ts`

### 2. إدارة الجلسات (Session Management)

#### Refresh Tokens
- تخزين آمن في قاعدة البيانات
- انتهاء صلاحية قابل للتخصيص
- معلومات الجهاز وIP
- تنظيف تلقائي للتوكن المنتهية الصلاحية

#### Active Sessions
- **API**: `app/api/auth/sessions/route.ts`
- **إدارة الجلسات**: `app/api/auth/sessions/[sessionId]/route.ts`
- **مكون الإدارة**: `components/auth/SessionManager.tsx`

### 3. الأمان (Security)

#### Rate Limiting
- **الخدمة**: `lib/security/rate-limit.ts`
- حماية من هجمات Brute Force
- قفل الحساب المؤقت
- تتبع محاولات تسجيل الدخول

#### Security Events Logging
- تسجيل جميع الأحداث الأمنية
- **API**: `app/api/auth/security-events/route.ts`
- **مكون العرض**: `components/auth/SecurityEvents.tsx`

#### Token Security
- **إدارة التوكن**: `lib/security/tokens.ts`
- JWT للوصول قصير المدى (15 دقيقة)
- Refresh tokens طويلة المدى (30-90 يوم)
- تشفير آمن وتوقيع

### 4. Middleware Protection

#### Route Protection
- **الملف**: `middleware.ts`
- حماية المسارات حسب الدور
- إعادة توجيه تلقائية
- رؤوس الأمان

#### Route Guards
- **مكون الحماية**: `components/auth/RouteGuard.tsx`
- حماية على مستوى المكونات
- مكونات مخصصة للأدوار المختلفة

### 5. React Hooks

#### useAuth Hook
- **الملف**: `hooks/useAuth.ts`
- إدارة حالة المصادقة
- وظائف تسجيل الخروج
- فحص الأذونات والأدوار

### 6. UI Components

#### Session Information
- **مكون**: `components/auth/SessionInfo.tsx`
- عرض معلومات الجلسة الحالية
- إدارة التوكن (في وضع التطوير)

#### Security Statistics
- **مكون**: `components/auth/SecurityStats.tsx`
- **API**: `app/api/auth/security-stats/route.ts`
- نظرة عامة على الأمان
- نقاط الأمان والتوصيات

### 7. Database Models

#### User Model
```typescript
interface IUser {
  _id?: ObjectId;
  name: string;
  fullName?: string;
  email: string;
  password: string;
  role: "user" | "manager" | "admin";
  isActive: boolean;
  
  // Security fields
  loginAttempts: number;
  lockoutUntil?: Date;
  lastLogin?: Date;
  lastLoginIP?: string;
  
  // Token management
  refreshTokens: IRefreshToken[];
  
  // Email verification
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
}
```

#### Security Event Model
```typescript
interface ISecurityEvent {
  userId?: ObjectId;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'ACCOUNT_LOCKED' | 'TOKEN_REFRESH';
  ipAddress?: string;
  userAgent?: string;
  details?: any;
  timestamp: Date;
}
```

### 8. Cleanup Service

#### Automatic Cleanup
- **الخدمة**: `lib/security/cleanup.ts`
- تنظيف التوكن المنتهية الصلاحية
- تنظيف حدود المعدل المنتهية
- تشغيل تلقائي في الإنتاج

## الميزات الأمنية

### 1. حماية من Brute Force
- تحديد محاولات تسجيل الدخول (5 محاولات)
- قفل مؤقت للحساب (10 دقائق)
- تتبع IP والبريد الإلكتروني

### 2. إدارة الجلسات
- جلسات متعددة الأجهزة
- تسجيل خروج انتقائي
- تسجيل خروج من جميع الأجهزة
- معلومات الجهاز والموقع

### 3. Token Security
- JWT قصير المدى للوصول
- Refresh tokens آمنة
- تدوير التوكن العشوائي
- تخزين HTTP-only cookies

### 4. Security Headers
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- HSTS في الإنتاج

### 5. Event Logging
- تسجيل جميع محاولات تسجيل الدخول
- تتبع الأنشطة المشبوهة
- سجل الأحداث الأمنية
- معلومات IP والجهاز

## الاستخدام

### حماية صفحة
```tsx
import { ProtectedRoute } from '@/components/auth/RouteGuard';

export default function SecurePage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>محتوى محمي للمدراء فقط</div>
    </ProtectedRoute>
  );
}
```

### استخدام Hook
```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, logout, hasRole } = useAuth();
  
  if (hasRole('admin')) {
    return <AdminPanel />;
  }
  
  return <UserPanel />;
}
```

### تسجيل الخروج
```tsx
// تسجيل خروج عادي
await logout();

// تسجيل خروج من جميع الأجهزة
await logout({ allDevices: true });
```

## صفحة إعدادات الأمان

يمكن الوصول إلى صفحة إعدادات الأمان الشاملة عبر `/security` والتي تتضمن:

- معلومات الجلسة الحالية
- إدارة الجلسات النشطة
- إحصائيات الأمان
- سجل الأحداث الأمنية
- توصيات الأمان

## متطلبات البيئة

```env
# Required
JWT_SECRET=your-jwt-secret-key-minimum-32-characters
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Database
MONGODB_URI=your-mongodb-connection-string
```

## الأمان في الإنتاج

1. **استخدم HTTPS دائماً**
2. **قم بتعيين JWT_SECRET قوي (32+ حرف)**
3. **فعل HSTS headers**
4. **راقب سجلات الأمان بانتظام**
5. **قم بتحديث التبعيات بانتظام**

## الصيانة

- يتم تنظيف التوكن المنتهية الصلاحية تلقائياً كل ساعة
- يمكن تشغيل التنظيف يدوياً عبر `securityCleanup.runManualCleanup()`
- راقب إحصائيات الأمان بانتظام
- راجع سجلات الأحداث الأمنية

## الاختبار

للاختبار في بيئة التطوير:
1. قم بتسجيل الدخول من أجهزة متعددة
2. اختبر تسجيل الخروج الانتقائي
3. اختبر حماية Rate Limiting
4. راجع سجلات الأحداث الأمنية
5. اختبر انتهاء صلاحية التوكن