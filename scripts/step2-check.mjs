import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const required = [
  'lib/supabase/browser.ts', 'lib/supabase/server.ts', 'lib/supabase/service-role.ts', 'lib/auth.ts', 'middleware.ts',
  'supabase/migrations/202608280001_auth_rbac.sql', 'app/(auth)/login/login-form.tsx', 'app/(auth)/login/actions.ts',
  'app/(auth)/logout/route.ts', 'app/(admin)/users/page.tsx', 'app/(admin)/users/actions.ts',
];
const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) throw new Error(`STEP 2 missing: ${missing.join(', ')}`);
const sql = readFileSync(join(root, 'supabase/migrations/202608280001_auth_rbac.sql'), 'utf8');
for (const token of ['core.app_user', 'core.audit_log', 'core.is_admin', 'auth.users', 'ENABLE ROW LEVEL SECURITY', 'anon']) {
  if (!sql.toLowerCase().includes(token.toLowerCase())) throw new Error(`STEP 2 SQL missing: ${token}`);
}
const auth = readFileSync(join(root, 'lib/auth.ts'), 'utf8');
for (const token of ['requireUser', 'requireAdmin', 'getRole']) if (!auth.includes(token)) throw new Error(`STEP 2 auth missing: ${token}`);
const actions = readFileSync(join(root, 'app/(admin)/users/actions.ts'), 'utf8');
for (const token of ['requireAdmin', 'audit_log', 'active', 'role']) if (!actions.includes(token)) throw new Error(`STEP 2 admin action missing: ${token}`);
const middleware = readFileSync(join(root, 'middleware.ts'), 'utf8');
for (const token of ['searchParams.set', 'Forbidden', '/admin']) if (!middleware.includes(token)) throw new Error(`STEP 2 middleware missing: ${token}`);
const clientFiles = ['app/(auth)/login/login-form.tsx', 'components/shell/sidebar.tsx'];
for (const file of clientFiles) if (readFileSync(join(root, file), 'utf8').includes('service-role')) throw new Error(`Service role imported by client: ${file}`);
console.log('STEP 2 checks passed');



