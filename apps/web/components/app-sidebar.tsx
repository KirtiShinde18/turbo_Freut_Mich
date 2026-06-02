"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, Shirt } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "Kirti",
    email: "kirtishinde3520@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Freut Mich 👚",
      logo: (
        <Shirt
        />
      ),
      plan: "E-Commerce ",
    },

  ],
  navMain: [
    {
      title: "Women",
      url: "#",
      icon: (
        <BotIcon
        />
      ),
      isActive: true,
      items: [
        {
          title: "Tops",
          url: "#",
        },
        {
          title: "Bottom",
          url: "#",
        },
        {
          title: "Dresses",
          url: "#",
        },
        {
          title: "Accessories",
          url: "#",
        },
      ],
    },
    {
      title: "Men",
      url: "#",
      icon: (
        <BotIcon
        />
      ),
      items: [
        {
          title: "Shirt",
          url: "#",
        },
        {
          title: "Bottom",
          url: "#",
        },
        {
          title: "Accessories",
          url: "#",
        },
      ],
    },

  ],
  projects: [
    {
      name: "Dahboard Admin",
      url: "/admin",
      icon: (
        <FrameIcon
        />
      ),
    },

  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
