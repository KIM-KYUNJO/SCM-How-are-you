import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const required = [
  'styles/shell.css', 'styles/components.css', 'styles/chart.css', 'styles/legacy.css', 'lib/menu.ts',
  'components/shell/sidebar.tsx', 'components/shell/topbar.tsx', 'components/shell/page-header.tsx',
  'components/ui/kpi-card.tsx', 'components/ui/panel.tsx', 'components/ui/badge.tsx', 'components/ui/button.tsx',
  'components/ui/data-table.tsx', 'components/ui/alert-row.tsx', 'components/ui/insight-banner.tsx', 'components/ui/empty-value.tsx',
  'app/(auth)/login/page.tsx', 'app/(user)/layout.tsx', 'app/(user)/lead-time/page.tsx', 'app/(user)/stockout-risk/page.tsx',
  'app/(admin)/layout.tsx', 'app/(legacy)/workflow/page.tsx',
];
const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) throw new Error(`Missing required files: ${missing.join(', ')}`);
const sourceDirs = ['app/(user)', 'app/(admin)', 'components/ui', 'components/shell'];
const hex = /#[0-9a-f]{3,8}\b/i;
const violations = [];
for (const dir of sourceDirs) for (const file of readdirSync(join(root, dir), { recursive: true })) {
  if (typeof file === 'string' && /\.(tsx|ts)$/.test(file)) {
    const full = join(root, dir, file);
    if (hex.test(readFileSync(full, 'utf8'))) violations.push(join(dir, file));
  }
}
if (violations.length) throw new Error(`Hex colors found in screen/component files: ${violations.join(', ')}`);
console.log('STEP 1 checks passed');
