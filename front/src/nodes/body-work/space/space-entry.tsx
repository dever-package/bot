import { useCallback, useState } from "react";
import { CanvasStartupLoading } from "./space-loading";
import { WorkSpacePage } from "./space-page";

export function WorkSpaceEntry() {
  const [initialLoading, setInitialLoading] = useState(true);
  const handleInitialLoadComplete = useCallback(() => {
    setInitialLoading(false);
  }, []);

  return (
    <>
      <WorkSpacePage onInitialLoadComplete={handleInitialLoadComplete} />
      {initialLoading ? <CanvasStartupLoading /> : null}
    </>
  );
}
