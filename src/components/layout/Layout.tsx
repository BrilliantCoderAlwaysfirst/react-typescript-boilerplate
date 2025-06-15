import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "@saeedkolivand/react-ui-toolkit";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
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
                <Link
                  to="/"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    padding: "0.5rem 1rem",
                  }}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    padding: "0.5rem 1rem",
                  }}
                >
                  About
                </Link>
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

export default Layout;
