import React from "react";
import { Container } from "@saeedkolivand/react-ui-toolkit";
import { Link } from "react-router-dom";
import homeRoute from "../Home/Home.router";

const NotFound: React.FC = () => {
  return (
    <Container>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to={homeRoute.path!}>Go back to home</Link>
    </Container>
  );
};

export default NotFound;
