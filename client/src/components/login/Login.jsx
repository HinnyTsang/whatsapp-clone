import React, { useRef } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { v4 as uuid4 } from 'uuid';

const Login = ({ onIdSubmit }) => {
  const idRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onIdSubmit(idRef.current.value);
  };

  const createNewId = (e) => {
    e.preventDefault();
    onIdSubmit(uuid4());
  };

  return (
    <Container
      className="align-items-center d-flex"
      style={{
        height: '100vh',
      }}
    >
      <Form className="w-100" onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Enter your Id</Form.Label>
          <Form.Control
            type="Test"
            ref={idRef}
            required
          ></Form.Control>
          <Button type="submit" className="mr-2">
            Login
          </Button>
          <Button variant="secondary" onClick={createNewId}>
            Create A New ID
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Login;
