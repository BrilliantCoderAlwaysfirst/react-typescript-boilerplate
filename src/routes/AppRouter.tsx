import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Spinner } from "@saeedkolivand/react-ui-toolkit";
import pageRoutes from "@/pages";

const LoadingContainer = () => (
  <Container>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "1.5rem",
        color: "#666",
      }}
    >
      <Spinner />
    </div>
  </Container>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingContainer />}>
      <Routes>
        {pageRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
