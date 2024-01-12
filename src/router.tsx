import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./pages/error-page";
import { DashboardPage } from "./pages/dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
    ],
  },
]);
