import { RouteObject } from "react-router-dom";
import NotFound from "./index";

export const notFoundRoute: RouteObject = {
  path: "*",
  element: <NotFound />,
  id: "Page Not Found",
};

export default notFoundRoute;
