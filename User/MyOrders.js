import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {Container,Table,Card,Button,Row,Col,Collapse,
} from "react-bootstrap";
import { TOAST_PROP } from "../App";
import {toast} from "react-toastify";
import { FaStar} from "react-icons/fa";

const MyOrders = () => {
    const [orders,SetOrders] = useState([]);
    const [expandedOrder,setExpandedOrder] =useState(null);
    const [ratings,setRatings] = useState({});

    const loggeduser = sessionStorage.getItem("user");

    useEffect(() => {
        getMyOrders();
    },[loggeduser]);

    function getMyOrders() {
        axios
        .get(`http://localhost:8080/GetAllOrdersByUser/${loggeduser}`)
        .then((res) => {
            console.log(res.data);
            SetOrders(res.data);
            res.data.array.forEach(element => {
                setRatings((prevRatings) => ({
                    ...prevRatings,
                    [element.id]: element.rating,
                }));
            });
        });
    }
    const toggleCollapse = (orderId) => {
        if (expandedOrder ===orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
    };

    const updateOrder = (id,status) => {
        if (status === "placed" || status ==="delivered") {
            const data ={
                status :status === "placed" ? "cancelled" : "return requested",
            }
             .promise(
              axios
              .put(`http://localhost:8080/UpdateStatus/${id}`,data),
            {
                pending:"Status updating....",
            },
            TOAST_PROP
        )
        .then((res)=> {
            toast.success(res.data,TOAST_PROP);
            getMyOrders();
        })
        .catch((err) => {
            toast.error(
                err.response ? err.response.data : "Failed to update Order",
                TOAST_PROP
            );
        });
        }else {
            toast.info("Order already" + status);
            return;
        }
    };

    const rateOrder =(orderId ,rating) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [orderId] :rating,
        }));
        axios.put(`http://localhost:8080/AddRating/${orderId}/$rating`)
        .then((res) =>{
            toast.success(res.data);
            getMyOrders();
        }) 
        .catch((err) => {
            toast.error(err.response.data);
        });
    };

    return (
        <Container fluid className="p-1">
            <Card className="border-0" style={{ backgroundColor:"transparent"}}>
                <Card.Header className="bg-primary rounded">
                    <h2 className="text-light text-center"> </h2>
                </Card.Header>
                <Container>
                    <Card.Body className="p-0">
                        {orders.map((order) => (
                            <Card key={order?.id} className="my-3 shadow">
                                <Card.Body>
                                    <Card.Title className="fw-bold"> Order #{order.id}</Card.Title>
                                    <div>
                                        <Row className="my-2">
                                            <Col md={3}> Ordered Date:</Col>
                                            <Col>{order.date}</Col>
                                        </Row>
                                        <Collapse in= {expandedOrder === order.id}>
                                            <div>
                                               <Row className="my-2">
                                                <Col md={3}> Total Price:</Col>
                                                <Col>₹{order?.totalPrice}</Col>
                                                </Row> 
                                                <Row className="my-2">
                                                    <Col md={3}>Total Ouantity: </Col>
                                                    <Col> {order.products.length} items</Col>
                                                </Row>
                                                <Row className="my-2">
                                                    <Col md={3}>Order Status:</Col>
                                                    <Col className={order.status ==="cancelled" ? "text-danger" : ""}> {order.status}</Col>
                                                </Row>
                                            </div>
                                        </Collapse>
                                    </div>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr className="text-center text-capitalizer">
                                                <th>Name</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.products.map((item) => (
                                                <tr 
                                                key={item?.id}>
                                                    <th>{item.name}</th>
                                                    <th>₹{item.price}</th>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <Button 
                                            variant="info"
                                            size="sm"
                                            onClick={() => toggleCollapse(order?.id)}>
                                            {expandedOrder ===order.id ? "Hide":"View"} Order Details
                                            </Button>{""}
                                            {!order.status=== "refunded" && <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() =>updateOrder(order?.id, order.status)}>
                                                {order.status ==="placed"
                                                ? "Request Cancellation"
                                                :"Request Returrn"}
                                                </Button>}
                                        </div>
                                        {order.status ==="delivered" && (
                                            <div className="pe-3">
                                                <span>Rate Order:</span>{" "}
                                                {[1,2,3,4,5,].map((rating) => (
                                                    <FaStar
                                                    key={rating}
                                                    size={24}
                                                    className={
                                                        rating <= (rating[order.id] || 0)
                                                        ? "text-warning"
                                                        :"text-secondary"

                                                    }
                                                    style ={{ cursor:"pointer"}}
                                                    onClick={() => rateOrder(order.id,rating)}/>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </Card.Body>
                </Container>
            </Card>
        </Container>
    );
 };
export default MyOrders
