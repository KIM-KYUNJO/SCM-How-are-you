import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Topbar } from '@/components/shell/topbar';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/ui/panel';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';
export default async function ForecastSettingsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.schema('analytics').from('v_forecast_settings').select('*').single();
  return <><Topbar title="Forecast 설정" /><div className="content"><PageHeader title="학습·검증 기간 설정" description="DB 설정과 데이터 커버리지를 확인합니다." /><Panel title="Forecast 설정" description="ADMIN 조회 화면"><div className="grid grid-2"><div><b>전체 데이터 기간</b><p>{data?.data_start ?? '—'} ~ {data?.data_end ?? '—'}</p></div><div><b>학습 기간</b><p>{data?.train_start ?? '—'} ~ {data?.train_end ?? '—'}</p></div><div><b>검증 기간</b><p>{data?.test_start ?? '—'} ~ {data?.test_end ?? '—'}</p></div><div><b>Granularity</b><p>{data?.granularity ?? '—'}</p></div></div><div className="button-row" style={{ marginTop: 16 }}><Badge status={data?.isolation_configured && data?.train_window_ok && data?.test_window_ok ? 'SAFE' : 'WARNING'}>{error ? '설정 조회 실패' : data?.isolation_configured && data?.train_window_ok && data?.test_window_ok ? '데이터 격리 정상' : '설정 확인 필요'}</Badge></div></Panel></div></>;
}
