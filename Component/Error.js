import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import {Row} from "react-bootstrap";
import {Col }from "react-bootstrap";

const Error = () => {
    return (
        <div className="errorbg">
            <Container>
                <Row className="justify-content-center align-items-center vh-100 text-white fs-4">
                    <Col md={4}>
                        <p className="text-center ms-3">
                            You are logged out. Click{" "}
                            <Link to="/login" className="text decoration-none">
                                Here
                            </Link>{" "}
                            to log in again....
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
export default Error;