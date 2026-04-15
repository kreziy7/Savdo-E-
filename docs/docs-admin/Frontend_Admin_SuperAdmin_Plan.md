# Frontend Admin / Super Admin Panel Reja

## 1. Loyihaning maqsadi
Bu panel tizimni boshqarish, foydalanuvchilarni nazorat qilish, kontent va operatsion jarayonlarni kuzatish uchun mo'ljallangan frontend admin interfeys bo'ladi.

Asosiy rollar:
- `Admin`
- `Super Admin`

Asosiy biznes qoida:
- Tizimda `faqat 1 ta Super Admin` bo'ladi
- `Admin` accountlar soni cheklanmaydi

## 2. Asosiy vazifalar
- Tizim statistikalarini ko'rsatish
- Foydalanuvchilarni boshqarish
- Rollar va ruxsatlarni boshqarish
- Kontent yoki ma'lumotlarni CRUD qilish
- Sozlamalarni boshqarish
- Audit log va faoliyat tarixini ko'rish

## 3. Rollar bo'yicha imkoniyatlar

### Admin
- Dashboard ko'rish
- Foydalanuvchilar ro'yxatini ko'rish
- Oddiy foydalanuvchilarni qo'shish, tahrirlash, bloklash
- Kontent/modullarni boshqarish
- Buyurtmalar, so'rovlar yoki ma'lumotlarni ko'rish
- Hisobotlarni ko'rish
- Boshqa adminlarni yoki super adminni yarata olmaydi

### Super Admin
- Adminning barcha huquqlari
- Tizimdagi yagona eng yuqori rol hisoblanadi
- Admin accountlarni yaratish va o'chirish
- Role/permission management
- Global system settings
- Tizim konfiguratsiyasi
- Audit log va xavfsizlik nazorati
- Har bir modulga to'liq access

## 4. Frontend bo'limlari

### 4.1 Login / Auth
- Login sahifa
- Forgot password
- Reset password
- 2FA tayyor arxitektura
- Token refresh logikasi

### 4.2 Dashboard
- Umumiy statistika kartalari
- Grafiklar
- So'nggi faoliyatlar
- Tezkor action tugmalar
- Notification block

### 4.3 User Management
- User list
- Search / filter / sort
- User detail page
- Create user modal/form
- Edit user
- Block / unblock
- Delete confirmation

### 4.4 Admin Management
- Faqat super admin uchun
- Admin list
- Create admin
- Edit admin role
- Permission assign qilish
- `Create Super Admin` funksiyasi bo'lmaydi
- Agar super admin allaqachon mavjud bo'lsa, ikkinchisini yaratish bloklanadi

### 4.5 Role & Permission
- Role list
- Permission matrix
- Custom role yaratish
- Modul bo'yicha access control

### 4.6 Content / Data Management
- Jadval ko'rinishi
- Create / edit / delete
- Status change
- Bulk actions
- Media upload UI

### 4.7 Reports
- Statistik hisobotlar
- Sana bo'yicha filter
- Export: CSV / Excel / PDF

### 4.8 Settings
- Profile settings
- System settings
- Notification settings
- Security settings

### 4.9 Audit Log
- Kim nima o'zgartirdi
- Sana va amal bo'yicha filter
- Action detail drawer/modal

## 5. UI/UX struktura
- `Sidebar navigation`
- `Topbar`
- `Responsive table`
- `Cards`
- `Charts`
- `Modal / Drawer / Form`
- `Breadcrumb`
- `Toast notifications`
- `Empty / Loading / Error states`

## 6. Tavsiya etiladigan frontend texnologiyalar
- `React` yoki `Next.js`
- `TypeScript`
- `Tailwind CSS` yoki `MUI`
- `React Query` / `TanStack Query`
- `React Hook Form`
- `Zod` validation
- `Axios` yoki `fetch wrapper`
- `Chart.js` yoki `Recharts`

## 7. Permission arxitekturasi
- Route level protection
- Component level protection
- Button/action level protection
- Role-based rendering
- Permission constants bilan ishlash
- Singleton `super_admin` qoidasini frontend va backend birgalikda validatsiya qiladi

Misol:
- `super_admin.users.create`
- `super_admin.admins.manage`
- `admin.users.view`
- `admin.content.update`

## 8. Sahifalar ro'yxati
- `/login`
- `/dashboard`
- `/users`
- `/users/:id`
- `/admins`
- `/roles`
- `/permissions`
- `/reports`
- `/settings`
- `/audit-logs`
- `/profile`

## 9. Komponentlar reja ro'yxati
- `AppLayout`
- `ProtectedRoute`
- `RoleGuard`
- `Sidebar`
- `Topbar`
- `StatsCard`
- `DataTable`
- `FilterBar`
- `ConfirmModal`
- `UserForm`
- `AdminForm`
- `PermissionMatrix`
- `ActivityTimeline`

## 10. State va API ishlash
- Auth state
- User profile state
- Permission state
- Dashboard stats query
- Users CRUD query/mutation
- Admin CRUD query/mutation
- Settings query/mutation
- Global error handler

## 11. Frontend workflow
1. Login bo'ladi
2. Token saqlanadi
3. User profile va role olinadi
4. Permissionlar yuklanadi
5. Sidebar rolega qarab render bo'ladi
6. Har bir page API orqali ma'lumot oladi
7. CRUD amallaridan keyin cache invalidate qilinadi

## 12. Xavfsizlik talablar
- Protected routes
- Token expiry handling
- Unauthorized sahifaga redirect
- Sensitive action uchun confirm modal
- Audit uchun muhim actionlarni log qilish

## 13. MVP bosqich
- Login
- Dashboard
- User management
- Admin management
- Role/permission management
- Settings basic page

## 14. 2-bosqich
- Reports
- Audit logs
- Export funksiyalar
- Advanced filters
- Notification center

## 15. 3-bosqich
- 2FA
- Real-time notifications
- Activity monitoring
- Advanced analytics

## 16. Development roadmap
1. Project setup
2. Auth architecture
3. Layout va routing
4. Dashboard UI
5. User management module
6. Admin management module
7. Role & permission module
8. Settings module
9. Reports
10. Audit logs
11. Testing
12. Deployment

## 17. Testing reja
- Auth flow test
- Role-based access test
- Form validation test
- CRUD flow test
- API error handling test
- Responsive UI test

## 18. Natija
Yakuniy mahsulot professional, kengaytiriladigan va role-based boshqaruvga ega frontend admin panel bo'ladi. U admin va super admin uchun alohida nazorat darajalarini ta'minlaydi.

## 19. Sidebar menu strukturasi

### Admin sidebar
- Dashboard
- Users
- Content
- Reports
- Settings
- Profile

### Super Admin sidebar
- Dashboard
- Users
- Admins
- Roles
- Permissions
- Content
- Reports
- Audit Logs
- System Settings
- Profile

### Sidebar behavior
- Collapse / expand holati bo'ladi
- Active menu highlight qilinadi
- Permission bo'lmasa menu ko'rinmaydi
- Mobile holatda drawer ko'rinishida ishlaydi

## 20. Page structure

### Dashboard page
- Header: page title + quick actions
- Stats cards qatori
- Charts section
- Recent activity section
- Notifications / alerts section

### Users page
- Header: title + create user button
- Filter bar
- Users data table
- Pagination
- Create/Edit modal
- Delete confirm modal

### User detail page
- User profile card
- Role va status info
- Activity history
- Related actions block

### Admins page
- Header + create admin button
- Admin list table
- Role assign modal
- Permission preview
- Yagona `Super Admin` qatorda protected badge bilan ko'rsatiladi
- `Create Super Admin` action mavjud bo'lmaydi

### Roles page
- Role cards yoki table
- Create role form
- Edit role modal
- Permission mapping section

### Permissions page
- Permission matrix
- Module bo'yicha grouped list
- Save changes action

### Reports page
- Date range filter
- Metrics cards
- Charts
- Export actions
- Table summary

### Audit logs page
- Filter bar
- Activity table
- Detail drawer

### Settings page
- Profile settings
- Security settings
- Notification settings
- System config block

## 21. Tavsiya etilgan component composition

### Layout components
- `AppLayout`
- `Sidebar`
- `Topbar`
- `PageHeader`
- `Breadcrumbs`

### Shared UI components
- `Button`
- `Input`
- `Select`
- `Textarea`
- `Modal`
- `Drawer`
- `Badge`
- `Tabs`
- `Dropdown`
- `Pagination`
- `Skeleton`
- `EmptyState`

### Data components
- `DataTable`
- `FilterBar`
- `StatsCard`
- `ChartCard`
- `SearchInput`
- `StatusBadge`

### Guard components
- `ProtectedRoute`
- `RoleGuard`
- `PermissionGuard`

## 22. React / Next.js folder architecture

```text
src/
  app/
    (auth)/
      login/
      forgot-password/
      reset-password/
    (dashboard)/
      dashboard/
      users/
        page.tsx
        [id]/
          page.tsx
      admins/
      roles/
      permissions/
      reports/
      settings/
      audit-logs/
      profile/
    layout.tsx
    providers.tsx
  components/
    layout/
    shared/
    tables/
    charts/
    forms/
    guards/
  features/
    auth/
      api/
      components/
      hooks/
      schemas/
      types/
    users/
      api/
      components/
      hooks/
      schemas/
      types/
    admins/
      api/
      components/
      hooks/
      schemas/
      types/
    roles/
    permissions/
    reports/
    settings/
    audit-logs/
  lib/
    api/
    auth/
    constants/
    utils/
  store/
  hooks/
  types/
  styles/
```

## 23. Module bo'yicha frontend ownership
- `auth`: login, token, session, protected route
- `users`: user list, detail, create/edit/delete
- `admins`: admin accounts va role biriktirish
- `roles`: role yaratish va update
- `permissions`: matrix va access mapping
- `reports`: charts, filter, export
- `settings`: profile va system config
- `audit-logs`: activity history va detail view

## 24. API endpoint naming tavsiyasi
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /me`
- `GET /users`
- `POST /users`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `GET /admins`
- `POST /admins`
- `PATCH /admins/:id`
- `GET /roles`
- `POST /roles`
- `GET /permissions`
- `GET /reports/overview`
- `GET /audit-logs`
- `GET /settings`
- `PATCH /settings`

## 25. Implementation uchun qisqa texnik tavsiya
- `Next.js App Router` ishlatish qulay bo'ladi
- Har bir modulni `features` ichida ajratish kerak
- API querylar uchun `TanStack Query` ishlatish kerak
- Form validation uchun `React Hook Form + Zod` kombinatsiyasi yaxshi
- Permission tekshiruvi route va component darajada bo'lishi kerak

## 26. Design system yo'nalishi

### Ranglar
- Primary: ishonchli va professional ko'k
- Secondary: neytral kulrang
- Success: yashil
- Warning: sariq
- Danger: qizil
- Info: och ko'k

### Tavsiya etilgan color tokens
- `--color-primary-50`
- `--color-primary-100`
- `--color-primary-500`
- `--color-primary-700`
- `--color-bg`
- `--color-surface`
- `--color-border`
- `--color-text`
- `--color-text-muted`

### Typography
- Heading uchun kuchli va aniq sans-serif
- Body uchun o'qilishi qulay font
- Monospace faqat log, code, ID va tokenlar uchun

### Spacing
- 4px asosli spacing system
- `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48`

### Border radius
- Kichik: `8px`
- O'rta: `12px`
- Katta: `16px`

### Shadow
- Card shadow
- Modal shadow
- Dropdown shadow

## 27. Layout wireframe matni

### Login page wireframe
- Chap tomonda brand block
- O'ng tomonda login card
- Login card ichida title, subtitle, email, password, remember me, login button
- Pastda forgot password link

### Dashboard wireframe
- Yuqorida topbar
- Chapda sidebar
- Content ichida:
- 1-qator: 4 ta stats card
- 2-qator: revenue/users/activity chart
- 3-qator: recent activity table va notification panel

### Users page wireframe
- Header: `Users`
- O'ngda `Create User` tugmasi
- Filter row: search, role filter, status filter, date filter
- Pastda data table
- Table actionlari: view, edit, block, delete

### Admins page wireframe
- Header: `Admins`
- `Create Admin` action
- Table ichida admin name, email, role, last active, status

### Settings page wireframe
- Chapda settings tabs
- O'ngda tanlangan settings form
- Footer qismida `Save Changes` button

## 28. Dashboard widget ideas
- Jami foydalanuvchilar soni
- Faol foydalanuvchilar
- Bugungi yangi userlar
- Bloklangan userlar
- Adminlar soni
- Ochiq requestlar soni
- Tizim xatolari soni
- So'nggi loginlar
- Server yoki API health status
- Top active modules

## 29. User management jadval ustunlari
- Avatar
- Full name
- Email
- Phone
- Role
- Status
- Created at
- Last login
- Actions

### User filters
- Search by name/email
- Role filter
- Status filter
- Date range
- Sort by newest/oldest

### User actionlari
- View details
- Edit
- Reset password
- Block
- Unblock
- Delete
- Assign role

## 30. User create/edit form fieldlari
- Full name
- Username
- Email
- Phone
- Password
- Confirm password
- Role
- Status
- Avatar upload
- Notes

### Validation
- Email unique bo'lishi kerak
- Password minimum uzunlikka ega bo'lishi kerak
- Phone format tekshiriladi
- Required fieldlar bo'sh qolmaydi

## 31. Admin management detali

### Admin jadval ustunlari
- Full name
- Email
- Assigned role
- Permissions summary
- Status
- Last active
- Created by
- Actions

### Admin actionlari
- Create admin
- Edit admin
- Suspend admin
- Delete admin
- Change role
- View activity
- Super admin uchun delete yoki role change actionlari maxsus qoida bilan cheklanadi

## 32. Role va permission matrix tafsiloti

### Role examples
- `super_admin`
- `admin`
- `editor`
- `viewer`
- `support`

### Role business rule
- `super_admin` roli tizimda faqat bitta accountga biriktiriladi
- `admin` roli istalgan miqdordagi accountga biriktirilishi mumkin
- Oddiy create-admin forma orqali `super_admin` roli berilmaydi

### Permission modules
- `dashboard`
- `users`
- `admins`
- `roles`
- `permissions`
- `reports`
- `settings`
- `audit_logs`
- `content`

### Har bir module uchun actionlar
- `view`
- `create`
- `update`
- `delete`
- `export`
- `manage`

## 33. Reports bo'limi ideas
- Daily active users
- Weekly registrations
- Monthly growth
- Admin activity report
- Blocked users report
- Failed login report
- Content status report
- Permission changes report

### Export options
- CSV
- Excel
- PDF

## 34. Audit log tafsiloti

### Audit log ustunlari
- Action type
- Actor
- Target entity
- Entity ID
- Old value summary
- New value summary
- IP address
- Device/browser
- Timestamp

### Audit action examples
- User created
- User deleted
- Role updated
- Permission changed
- Login success
- Login failed
- Password reset
- Settings updated

## 35. Notification center g'oyalari
- New user registration
- Failed login attempts
- Critical system alerts
- Admin invitation accepted
- Permission changes
- Export completed
- Daily summary

### Notification turlari
- In-app toast
- Notification list panel
- Email trigger
- Critical banner

## 36. Empty, loading, error state rejalari

### Empty state
- Tushunarli message
- Contextual illustration yoki icon
- Primary CTA

### Loading state
- Table skeleton
- Card skeleton
- Button loading spinner
- Full-page loading faqat zarur holatda

### Error state
- User-friendly error message
- Retry button
- Technical detail faqat dev mode yoki log ichida

## 37. Search va filter UX
- Debounced search input
- Filter chiplar ko'rinishi
- `Clear all filters` action
- Saved filters
- URL query ichida filter state saqlanishi

## 38. Pagination va table UX
- Server-side pagination
- Page size selector
- Bulk select
- Sticky header
- Column hide/show
- Column sorting
- Export selected rows

## 39. Bulk action g'oyalari
- Bulk block
- Bulk unblock
- Bulk delete
- Bulk export
- Bulk role assign

## 40. Profile page contenti
- Personal info
- Avatar update
- Change password
- 2FA setup
- Session management
- Login history

## 41. Security UI ideas
- Suspicious login alert
- Force logout from other devices
- Password strength meter
- 2FA QR setup
- Recent sessions list
- Permission escalation confirm modal

## 42. Responsive behavior

### Desktop
- Full sidebar
- 3-4 column dashboard grid
- Table first-class layout

### Tablet
- Semi-collapsed sidebar
- 2-column dashboard
- Horizontal scroll table

### Mobile
- Drawer sidebar
- Single-column layout
- Cards table o'rniga stacked list ko'rinishi
- Sticky action buttonlar

## 43. Accessibility talablar
- Keyboard navigatsiya
- Focus ring aniq bo'lishi kerak
- Color contrast AA standartga yaqin bo'lishi kerak
- Button va inputlarda aria label
- Modal focus trap
- Escape orqali modal yopilishi

## 44. Internationalization
- `uz`
- `ru`
- `en`

### Til bo'yicha tayyorgarlik
- Static textlar translation file ichida saqlanadi
- Sana va son formatlari locale bo'yicha ko'rsatiladi
- RTL support hozircha kerak emas, lekin structure tayyor bo'lsa yaxshi

## 45. Naming convention
- Components: `PascalCase`
- Hooks: `useSomething`
- API functions: `getUsers`, `createUser`
- Constants: `UPPER_SNAKE_CASE`
- Routes: `kebab-case`
- Query keys: array format

## 46. TanStack Query strategy
- Har bir modul uchun alohida query key factory
- List va detail querylar ajratiladi
- Mutationdan keyin invalidate yoki optimistic update
- Retry faqat GET requestlarga ehtiyotkorlik bilan

### Query key examples
- `['users', filters]`
- `['user', id]`
- `['admins']`
- `['roles']`
- `['audit-logs', filters]`

## 47. Auth flow batafsil
1. Login request yuboriladi
2. Access token va refresh token olinadi
3. `me` endpoint orqali profil yuklanadi
4. Permissionlar state ga yoziladi
5. Protected route ichiga kirishga ruxsat beriladi
6. Token eskirsa refresh qilinadi
7. Refresh ishlamasa logout qilinadi

## 48. Route protection strategy
- Public routes: login, forgot password, reset password
- Private routes: dashboard va barcha ichki sahifalar
- Super admin only routes: admins, roles, permissions, audit logs, system settings

## 48.1 Super admin singleton qoidasi
- Frontend `me` response orqali joriy user `super_admin` ekanini biladi
- Admin yaratish formasida default role `admin` bo'ladi
- Ikkinchi `super_admin` yaratish uchun UI action ko'rsatilmaydi
- Backend `Only one super admin is allowed` qaytarsa, frontend aniq xabar chiqaradi
- Super adminga tegishli xavfli actionlar ikki bosqichli confirm bilan ishlaydi

## 49. Frontend middleware ideas
- Auth token check
- Redirect if unauthorized
- Redirect logged-in user away from login page
- Locale resolve

## 50. Form architecture
- Har bir yirik form uchun alohida `schema`
- Reusable form componentlar
- Server error mapping
- Dirty state detection
- Unsaved changes modal

## 51. Reusable modal turlari
- Confirm modal
- Form modal
- Side drawer modal
- Success modal
- Danger action modal

## 52. Toast va feedback rules
- Success: yuqori o'ngda, qisqa message
- Error: action bilan birga
- Warning: muhim ogohlantirish
- Info: eksport yoki background process status

## 53. Frontend performance rejalari
- Code splitting
- Dynamic import chartlar uchun
- Server pagination
- Image optimization
- Memoization faqat kerak joyda
- Table virtual scroll katta datasetda

## 54. Logging va monitoring
- Frontend error boundary
- API error logger
- Sentry yoki shunga o'xshash servisga tayyorgarlik
- User action tracking

## 55. Analytics ideas
- Daily active admin
- Most used page
- Average session duration
- Export count
- Failed action rate
- Search usage

## 56. Content management extension ideas
- Category management
- Tag management
- Draft/published status
- Schedule publish
- Rich text editor
- Media library

## 57. Advanced permission ideas
- Module-level access
- Row-level access
- Field-level read only holat
- Temporary access grant
- Access expiry date

## 58. System settings bo'limlari
- General settings
- Branding
- Email settings
- Security policy
- Session timeout
- File upload limits
- Feature flags

## 59. Feature flag ideas
- Reports beta
- Audit export beta
- 2FA required
- New dashboard enabled
- Advanced permissions enabled

## 60. Session management details
- Current session
- Other sessions list
- Revoke session
- Last activity timestamp
- Device info

## 61. Searchable command palette idea
- `Ctrl + K` orqali ochiladi
- Sahifalarga tez o'tish
- User qidirish
- Sozlamaga tez kirish
- Recent actions ko'rsatish

## 62. Quick actions ideas
- Create user
- Invite admin
- Export report
- View failed logins
- Open settings

## 63. Page-level acceptance criteria

### Login
- Xato login aniq ko'rsatiladi
- To'g'ri login dashboardga olib kiradi
- Token expiry handle qilinadi

### Users
- Filter ishlaydi
- Pagination ishlaydi
- CRUD actionlar ishlaydi
- Permission bo'lmasa action yashiriladi

### Roles
- Role create/update ishlaydi
- Permission matrix saqlanadi
- `super_admin` role assignment cheklovi ishlaydi

### Audit logs
- Filter ishlaydi
- Detail ko'rinadi
- Export faqat permission bilan ishlaydi

### Admin management
- `admin` ni istalgancha yaratish mumkin
- Ikkinchi `super_admin` yaratib bo'lmaydi
- Super admin bilan bog'liq actionlar audit logga tushadi

## 64. Testing strategy kengaytmasi

### Unit test
- Utility functionlar
- Validation schema
- Permission check helperlar

### Component test
- Form render
- Table actions
- Modal open/close
- Guard componentlar

### E2E test
- Login
- User create
- User edit
- Role change
- Export report
- Logout

## 65. Release bosqichlari
- `v1`: login, dashboard, users, admins, roles
- `v1.1`: reports, settings, profile
- `v1.2`: audit logs, notifications, export
- `v2`: 2FA, analytics, feature flags, command palette

## 66. Sprint breakdown idea

### Sprint 1
- Project setup
- Design system base
- Auth pages
- Layout

### Sprint 2
- Dashboard
- Users list
- User form

### Sprint 3
- Admins
- Roles
- Permissions

### Sprint 4
- Reports
- Settings
- Profile

### Sprint 5
- Audit logs
- Notifications
- Polish va testing

## 67. Developer checklist
- Env variables tayyor
- API base URL sozlangan
- Auth provider ishlayapti
- Query client provider ulangan
- Protected layout ishlayapti
- Error boundary qo'shilgan
- Toast provider qo'shilgan

## 68. QA checklist
- Har bir role alohida tekshirildi
- Route permissionlar tekshirildi
- CRUD success/fail holatlari tekshirildi
- Responsive tekshirildi
- Loading/error state tekshirildi
- Browser compatibility tekshirildi
- `super_admin` duplicate create holati tekshirildi
- `admin` unlimited create oqimi tekshirildi

## 69. UI polish ideas
- Hover states
- Smooth drawer animation
- Staggered dashboard reveal
- Highlighted active menu
- Clean status badges
- Consistent iconography

## 70. Icon set ideas
- `lucide-react`
- `heroicons`
- `tabler-icons`

## 71. Table row action UX
- 3 nuqta dropdown
- Eng muhim actionlar inline
- Danger action qizil rangda
- Super admin only actionlar badge bilan

## 72. Breadcrumb namunasi
- `Dashboard / Users`
- `Dashboard / Users / User Detail`
- `Dashboard / Settings / Security`

## 73. Statuslar

### User status
- `active`
- `inactive`
- `blocked`
- `pending`

### Admin status
- `active`
- `suspended`
- `invited`

### Content status
- `draft`
- `published`
- `archived`

## 74. File upload UI ideas
- Drag and drop area
- Progress bar
- Preview
- File size validation
- Type validation

## 75. Error code mapping ideas
- `401`: session expired
- `403`: permission denied
- `404`: item topilmadi
- `422`: validation error
- `500`: server error

## 76. UX microcopy ideas
- `No users found`
- `Try adjusting your filters`
- `Changes saved successfully`
- `You do not have permission for this action`
- `Session expired, please log in again`

## 77. Skeleton plan
- Dashboard stats uchun 4 skeleton card
- Table uchun 8-10 skeleton row
- Detail page uchun profile skeleton
- Chart card uchun loading block

## 78. SEO kerak bo'lmagan, lekin meta structure kerak
- Admin panel public SEO uchun emas
- Biroq page title va metadata tartibli bo'lishi kerak

## 79. Deployment readiness
- Production env
- Staging env
- Error monitoring ulangan
- Build optimization tekshirilgan
- Source map policy belgilangan

## 80. Future ideas
- Real-time activity feed
- Live support chat for admins
- AI-based anomaly detection
- Smart report summary
- Voice search in admin
- Approval workflow for dangerous actions

## 81. Figma uchun sectionlar
- Cover
- Brand guidelines
- Design tokens
- Components
- Auth screens
- Dashboard screens
- User management screens
- Admin management screens
- Reports screens
- Settings screens
- Audit log screens
- Responsive screens

## 82. Backend bilan aniqlashtirilishi kerak bo'lgan savollar
- Permission object structure qanday bo'ladi
- Refresh token cookie orqali keladimi yoki body orqali
- Audit log detail qanchalik chuqur bo'ladi
- Report export async bo'ladimi yoki sync
- Search qaysi fieldlar bo'yicha ishlaydi
- Pagination cursor-basedmi yoki page-basedmi
- Super admin account delete qilinishi mumkinmi yoki faqat transfer qilinadimi
- Super admin transfer bo'lsa, eski super admin avtomatik `admin` ga tushadimi

## 83. Final product vision
Tayyor mahsulot korporativ darajadagi, kengaytiriladigan, toza arxitekturaga ega frontend admin panel bo'lishi kerak. U nafaqat oddiy CRUD panel, balki role-based access, audit, analytics, security va scale uchun tayyor boshqaruv tizimi bo'lishi kerak.
