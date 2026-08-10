import { lazy, Suspense, useCallback, useState } from "react";
import { CanvasStartupLoading } from "./space-loading";

const WorkSpacePage = lazy(() =>
  import("./space-page").then((module) => ({
    default: module.WorkSpacePage,
  })),
);

export function WorkSpaceEntry() {
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
