// AppLayout.tsx
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PageTitleProvider, usePageTitle } from "@/contexts/PageTitleContext";
import { ContextMenu } from "@/components/ContextMenu";

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { title } = usePageTitle();

  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          "--sidebar-width": "14rem",
          "--sidebar-width-mobile": "18rem",
          "--sidebar-width-icon": "3.25rem",
        } as React.CSSProperties
      }
    >
      {/* ⬇️ These three must share the same parent */}
      <AppSidebar />
      <SidebarInset>
        <div className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur">
          <div className="h-12 flex items-center gap-2 ps-5 pe-5">
            <SidebarTrigger className="-ml-1 size-7 rounded-md hover:bg-accent" />
            <div className="w-full max-w-6xl flex items-center justify-between px-2">
              <span className="text-sm font-medium">{title}</span>
            </div>
          </div>
        </div>

        <div className=" w-full py-6">
          {children}
        </div>
      </SidebarInset>
      <ContextMenu />
    </SidebarProvider>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageTitleProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </PageTitleProvider>
  );
}
