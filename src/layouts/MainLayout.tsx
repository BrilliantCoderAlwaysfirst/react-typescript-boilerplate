import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "@saeedkolivand/react-ui-toolkit";
import pageRoutes from "@/pages";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header style={{ backgroundColor: "#333", padding: "1rem" }}>
        <Container>
          <Row>
            <Col>
              <nav
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                {pageRoutes.map(
                  (page) =>
                    page.path !== "*" && (
                      <Link
                        key={page.path}
                        to={page.path!}
                        style={{
                          color: "white",
                          textDecoration: "none",
                          padding: "0.5rem 1rem",
                        }}
                      >
                        {page.id}
                      </Link>
                    ),
                )}
              </nav>
            </Col>
          </Row>
        </Container>
      </header>
      <main style={{ flex: 1, padding: "2rem" }}>
        <Container>
          <Card>{children}</Card>
        </Container>
      </main>
    </div>
  );
};

export default MainLayout;
