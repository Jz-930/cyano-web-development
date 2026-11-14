import { ViewTransition } from "react";

export function RouteTransitions({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="vt-page-in" exit="vt-page-out" default="none">
      {children}
    </ViewTransition>
  );
}
