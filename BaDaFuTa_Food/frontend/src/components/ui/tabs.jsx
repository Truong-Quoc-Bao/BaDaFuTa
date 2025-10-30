"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "./utils";

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-gray-200 text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Active state
        "data-[state=active]:bg-white",
        "dark:data-[state=active]:text-foreground",
        "dark:data-[state=active]:border-input",
        "dark:data-[state=active]:bg-input/30",

        // Focus styles
        "focus-visible:border-ring",
        "focus-visible:ring-ring/50",
        "focus-visible:outline-ring",
        "focus-visible:ring-[3px]",
        "focus-visible:outline-1",

        // Text
        "text-foreground",
        "dark:text-muted-foreground",
        "text-sm",
        "font-medium",
        "whitespace-nowrap",

        // Layout
        "inline-flex",
        "flex-1",
        "items-center",
        "justify-center",
        "gap-1.5",
        "rounded-xl",
        "border border-transparent",
        "px-2",
        "py-1",
        "h-[calc(100%-1px)]",
        "transition-[color,box-shadow]",

        // Disabled state
        "disabled:pointer-events-none",
        "disabled:opacity-50",

        // SVG inside
        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",

        // Allow custom className
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
