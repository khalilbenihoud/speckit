import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { MessageSquarePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { threadsStore, type Thread } from "@/lib/threads-store";
import { cn } from "@/lib/utils";
import { t, useLang } from "@/lib/i18n";

export function AppSidebar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [threads, setThreads] = useState<Thread[]>([]);
  const [lang] = useLang();

  useEffect(() => {
    const refresh = () => setThreads(threadsStore.list());
    refresh();
    window.addEventListener("speckit:threads", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("speckit:threads", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const handleNew = () => {
    const thread = threadsStore.create();
    navigate({ to: "/$threadId", params: { threadId: thread.id } });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    threadsStore.remove(id);
    if (pathname === `/${id}`) {
      navigate({ to: "/" });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-lg text-primary-foreground">
            📋
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">SpecKit</span>
            <span className="text-xs text-muted-foreground">{t("sidebarTagline", lang)}</span>
          </div>
        </div>
        <Button onClick={handleNew} className="mt-2 w-full justify-start gap-2" size="sm">
          <MessageSquarePlus className="h-4 w-4" />
          {t("newSpec", lang)}
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("recentChats", lang)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {threads.length === 0 && (
                <p className="px-2 py-4 text-xs text-muted-foreground">
                  {t("noConversations", lang)}
                </p>
              )}
              {threads.map((thread) => {
                const active = pathname === `/${thread.id}`;
                return (
                  <SidebarMenuItem key={thread.id}>
                    <div
                      className={cn(
                        "group/thread relative flex items-center rounded-md hover:bg-sidebar-accent",
                        active && "bg-sidebar-accent",
                      )}
                    >
                      <Link
                        to="/$threadId"
                        params={{ threadId: thread.id }}
                        className="flex-1 truncate px-2 py-1.5 text-sm text-sidebar-foreground"
                        title={thread.title}
                      >
                        {thread.title}
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, thread.id)}
                        aria-label={t("deleteConversation", lang)}
                        className="mr-1 rounded p-1 opacity-0 transition group-hover/thread:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <p className="px-2 py-2 text-[10px] text-muted-foreground">
          {t("localOnly", lang)}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}