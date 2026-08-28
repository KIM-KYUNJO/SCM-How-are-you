import type { LucideIcon } from 'lucide-react';
import { BarChart3, Boxes, Gauge, LayoutDashboard, Settings2, ShieldCheck, TrendingDown } from 'lucide-react';

export type MenuRole = 'USER' | 'ADMIN';
export type MenuItem = { label: string; href: string; icon: LucideIcon; roles: MenuRole[] };

export const menuItems: MenuItem[] = [
  { label: '전체 현황', href: '/user/overview', icon: Gauge, roles: ['USER', 'ADMIN'] },
  { label: 'Lead Time 분석', href: '/user/lead-time', icon: BarChart3, roles: ['USER', 'ADMIN'] },
  { label: 'Stockout Risk', href: '/user/stockout-risk', icon: TrendingDown, roles: ['USER', 'ADMIN'] },
  { label: '재고·공급', href: '/user/supply', icon: Boxes, roles: ['USER', 'ADMIN'] },
  { label: '관리자 설정', href: '/admin', icon: Settings2, roles: ['ADMIN'] },
  { label: '사용자 관리', href: '/admin/users', icon: Settings2, roles: ['ADMIN'] },
  { label: 'Forecast 설정', href: '/admin/forecast-settings', icon: Settings2, roles: ['ADMIN'] },
  { label: '권한·감사', href: '/admin/audit', icon: ShieldCheck, roles: ['ADMIN'] },
];

export function getMenuItems(role: MenuRole = 'USER') {
  return menuItems.filter((item) => item.roles.includes(role));
}


