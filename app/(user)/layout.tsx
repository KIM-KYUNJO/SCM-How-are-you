import { Sidebar } from '@/components/shell/sidebar';
export default function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <div className="app-shell"><Sidebar role="USER" /><main className="main">{children}</main></div>; }
