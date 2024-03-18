import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Button, Card, CardFooter, Container } from "react-bootstrap";
import {Col,Row} from "react-bootstrap";
import ProductCard from "./ProductCard";
import OrderModal from "./OrderModal";
const Cart = () => {
    const [cartItems,setCartItems] = useState([]);
    const loggeduser = sessionStorage.getItem("user");

    useEffect(() => {
        getCartByUser()
    })

    function getCartByUser() {
        axios
        .get(`http://localhost:8080/GetCartByUser/${loggeduser}`)
        .then((res) => {
            setCartItems(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    function DeleteCart() {
        axios
        .delete(`http://localhost:8080/DeleteCart/${loggeduser}`)
        .then((res) => {
            toast.success(res.data);
            getCartByUser();
        })
        .catch((err) => {
            console.log(err);
            toast.error(err.response.data);
        });
    }
    const [show,setShow] =useState(false);

    const toggle =() => setShow(!show);

    const flexStyle = "d-flex justify-content-between aligh-item-center";

    const subTotals = cartItems.map((item) => {
        return item.quantity = item.products?.price;
    });

    const totalPrice = subTotals.reduce((acc , curr) => {
        return acc + curr;

    }, 0);

    const totalQuantity = cartItems.reduce((acc, item.quantity, 0));

    const orderDetails={
    totalPrice:totalPrice,
    totalQuantity:totalQuantity,
    };

    return (
        <div className="cart-bg">
            <Container className="p-3">
                {cartItems.length !== 0 ? (
                    <Row>
                        <div className="d-flex justify-content-between w-100">
                            <h2 className="text-primary">My Cart</h2>
                            <div>
                                <Button
                                size="sm"
                                onClick={() => {
                                    DeleteCart();
                                }}>
                                    Clear Cart
                                </Button>
                            </div>
                        </div>
                        <Col md={7}>
                            {cartItems.map((item) => (
                                <ProductCard key={item.id} product={item}/>
                            ))}
                        </Col>
                        <Col md={5}>
                            <Card className="my-2 shadow">
                                <Card.Header className="fs-3 text-primary text-center">
                                  Payment Details
                                </Card.Header>

                                <Card.Body>
                                    <Card.Text className={flexStyle}>
                                        <span className="fw-bold">Delivery Fee:</span>
                                        Free Delivery("")
                                        <i className="text-muted text-decoration-line-through">
                                        ₹40
                                        </i>
                                    </Card.Text>
                                    <Card.Text className={flexStyle}>
                                        <span className="fw-bold"> Total:</span>
                                        <span>₹{totalPrice}</span>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Button className="w-100" onClick={toggle}>
                                        CheckOut
                                    </Button>
                                    <OrderModal
                                    show={show}
                                    toggle={toggle}
                                    orderDetails={orderDetails}
                                    />
                                </Card.Footer>
                            </Card>
                        </Col>
                      </Row>
                ):(
                    <div  className="d-flex flex-column justify-content-center aligh-item-center"
                    style={{ minHeight:"60vh"}}>
                    <h2> No Items In the cart...!</h2>
                    <p>
                        <Link to ="/userdashboard/products"> Click Here</Link>&ndsp; to add items to acrt
                    </p>
                    </div>
                )}
            </Container>

        </div>
    );

};
export default Cart;