import { AppRouter } from "./router";
import { ToastViewport } from "./components/shared/ToastViewport";

export default function App() {
  return (
    <>
      <AppRouter />
      <ToastViewport />
    </>
  );
}