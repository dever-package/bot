import { lazy, Suspense, useCallback, useState } from "react";
import { CanvasStartupLoading } from "./space-startup-loading";

const WorkSpacePage = lazy(() =>
  import("./space-page").then((module) => ({
    default: module.WorkSpacePage,
  })),
);

export function WorkSpaceNode() {
  const [initialLoading, setInitialLoading] = useState(true);
  const handleInitialLoadComplete = useCallback(() => {
    setInitialLoading(false);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <WorkSpacePage onInitialLoadComplete={handleInitialLoadComplete} />
      </Suspense>
      {initialLoading ? <CanvasStartupLoading /> : null}
    </>
  );
}
