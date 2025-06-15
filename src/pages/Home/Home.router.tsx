import { RouteObject } from "react-router-dom";
import Home from "./index";

const homeRoute: RouteObject = {
  path: "/",
  element: <Home />,
  id: "Home",
};

export default homeRoute;
