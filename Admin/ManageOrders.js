import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Container,Table,Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import {toast} from "react-toastify";
import { TOAST_PROP } from "../App";
import OrderDetailsModal from "./OrderDetailsModal";

const ManageOrders = () => {
    const [orders, setOrders] =useState([]);
    const [singleOrder,setSingleOrders] = useState({});
    const [show,setShow] = useState(false);

    const toggle = (order) => {
        setShow(!show)
        setSingleOrders(order)
    }

    const loadALLOrders = () => {
        axios
        .get(`http://localhost:8080/GetAllOrders`)
        .then((res) => {
            console.log(res.data);
            setOrders(res.data);
        })
        .catch((err) => console.log(err));
    };

    useEffect(() => {
        loadALLOrders();
    }, []);

    const updateOrder = (id,status) =>{
        const data = {
            status: status,
        };

        axios
        .put(`http://localhost:8080/UpdateStatus/${id}`,data)
        .then((res) => {
            toast.success(res.data, TOAST_PROP);
            loadALLOrders();
        })
        .catch((err) => {
            toast.error(err.response.data);
        });
    };

    return(
        <Container>
            <h2 className="text-center my-3 text-primary"> Manage Orders</h2>
            <Table striped bordered hover>
                <thead className="text-center">
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Totals</th>
                        <th>Status</th>
                        <th>Ratings</th>
                        <th>Actions</th>
                    </tr>    
                </thead>
                <tbody className="text-center">
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="fw-semibold aligh-middle"><Link onClick={() => toggle(order)}>{order.id}</Link>
                            <OrderDetailsModal show={show} toggle={toggle} data={singleOrder}/>
                            </td>

                            <td className="aligh-middle text-capitalize">
                                {order?.users.name}
                            </td>
                            <td>
                                {order.products.map((item,index) => (
                                    <p key ={index}>{item.name}</p>
                                ))}
                                
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}