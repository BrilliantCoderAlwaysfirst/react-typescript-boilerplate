import type { FC } from "react";
import { Container, Card, Row, Col } from "@saeedkolivand/react-ui-toolkit";
import { APP_NAME } from "@/config/constants";

const Home: FC = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <h1 className="text-center mb-2">Welcome to {APP_NAME}</h1>
            <p className="text-center">
              This is a modern React application with TypeScript and Vite
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
