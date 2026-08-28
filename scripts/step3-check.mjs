import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const required = ['supabase/migrations/202608280002_data_model_boundaries.sql', 'lib/forecast-data.ts', 'app/(admin)/forecast-settings/page.tsx'];
const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) throw new Error(`STEP 3 missing: ${missing.join(', ')}`);
const sql = readFileSync(join(root, required[0]), 'utf8').toLowerCase();
for (const token of ['raw.business_event', 'raw.sales_order', 'raw.item_substitute', 'batch_id', 'source_type', 'loaded_at', 'source_record_id', 'core.policy_config', 'core.outlier_rule', 'core.item_policy', 'core.forecast_setting', 'core.v_train_demand', 'core.v_test_actual', 'analytics.v_data_coverage', 'analytics.v_forecast_settings', 'enable row level security', 'core.is_admin()']) {
  if (!sql.includes(token)) throw new Error(`STEP 3 SQL missing: ${token}`);
}
const data = readFileSync(join(root, 'lib/forecast-data.ts'), 'utf8');
if (!data.includes("from('v_train_demand')") || !data.includes("from('v_test_actual')")) throw new Error('Forecast data access must use train/test views');
const forbidden = /(forecast|demand|backtest)/i;
for (const file of ['lib/forecast-data.ts']) if (forbidden.test(file) && /raw\.usage_history/.test(readFileSync(join(root, file), 'utf8'))) throw new Error(`Direct raw usage_history read found: ${file}`);
console.log('STEP 3 checks passed');
