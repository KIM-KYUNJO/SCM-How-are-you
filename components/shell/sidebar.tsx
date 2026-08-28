'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import { getMenuItems, type MenuRole } from '@/lib/menu';

export function Sidebar({ role = 'USER' }: { role?: MenuRole }) {
  const pathname = usePathname();
  return <aside className="sidebar"><div className="brand"><div className="brand-mark">SC</div><div className="brand-copy"><strong>SCM Control</strong><span>Supply Chain Management</span></div></div><div className="nav-label">{role} MENU</div><nav className="nav-list" aria-label="주요 메뉴">{getMenuItems(role).map((item) => { const Icon = item.icon; const active = pathname === item.href; return <Link className={`nav-button ${active ? 'active' : ''}`} href={item.href} key={item.href}><span className="nav-number"><Icon size={14} /></span><span>{item.label}</span>{active && <Check size={13} className="nav-check" />}</Link>; })}</nav><div className="sidebar-foot"><b>2026년 09월 발주계획</b><br />공통 디자인 시스템 · STEP 1</div></aside>;
}
