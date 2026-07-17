import { Toaster } from "sonner";

export function BodyToaster() {
  return (
    <Toaster
      className="bot-work-toaster"
      position="top-center"
      richColors
      closeButton
    />
  );
}
