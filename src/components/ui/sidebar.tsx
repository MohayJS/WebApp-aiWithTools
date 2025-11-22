"use client"

import React from 'react';
import { cn } from '@/lib/utils';
import { NeumorphButton } from './neumorph-button';

interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
}

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarMenuItemProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-screen w-64 flex-col fixed left-0 top-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Sidebar.displayName = "Sidebar";

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto p-4", className)}
      {...props}
    >
      {children}
    </div>
  )
);
SidebarContent.displayName = "SidebarContent";

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-4 border-b border-gray-200/20", className)}
      {...props}
    >
      {children}
    </div>
  )
);
SidebarHeader.displayName = "SidebarHeader";

const SidebarMenu = React.forwardRef<HTMLDivElement, SidebarMenuProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLDivElement, SidebarMenuItemProps>(
  ({ className, children, isActive, onClick, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    >      <NeumorphButton
        onClick={onClick}
        className={cn(
          "w-full justify-start text-left transition-all duration-200",
          isActive && "ring-2 ring-blue-300/50 shadow-inner"
        )}
        size="medium"
      >
        {children}
      </NeumorphButton>
    </div>
  )
);
SidebarMenuItem.displayName = "SidebarMenuItem";

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
};
