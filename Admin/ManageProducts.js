import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import {Col, Row} from "react-bootstrap";
export default function ManageProducts() {
    const [name,setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [availability, setAvailability] = useState("");
    const [productid, setProductId] = useState("");
    const [category, setCategory] = useState("");

    const [productList, setProductList] = useState([]);

    const categories = ["Trees", "Plants", "Seeds", "Flowers", "Gift"];

    const { pathname } = useLocation();
    console.log(pathname);

    useEffect(() => {
        getProducts();  
    }, []);

    const handleImageChange = (e) => {
        const file=e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataURL = reader.result;
            setImage(dataURL);
        };
        reader.readAsDataURL(file);
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        const newPlant = {
            name: name,
            price: price,
            image: image,
            description: description,
            availability: availability,
            category: category,
       };

       productid 
       ? axios.put(`http://localhost:8080/UpdateProduct/${productid}`, newPlant)
       
       : axios.post('http://localhost:8080/AddProducts', newPlant)
       .then((res) => {
           toast.success(res.data);
           getProducts();
           ClearFields();
       })
       .catch((err) => {
           console.log(err);
       });
    };

    function getProducts(){
        axios
        .get("http://localhost:8080/GetAllProducts")
        .then((res) => {
            setProductList(res.data);           
        })
        .catch((err) => {
            console.log(err);
        });
    }

    function ClearFields() {
        setName("");
        setDescription("");
        setPrice("");
        setAvailability("");
        setImage("");
        setProductId("");
        document.getElementById("image").value = null;
        setCategory("");
    }

    function deleteProduct(id) {
        axios
            .delete(`http://localhost:8080/DeleteProducts/${id}`)
            .then((res) => {
                toast.success(res.data);
                getProducts();
                ClearFields();
            })
            .catch((err) => {
                console.log("Error deleting product:", err);
            
            });
    }
    

    const AssignData = (product) => {
        
        setName(product.name);
        setPrice(product.price);
        setAvailability(product.availability);
        setDescription(product.description);
        setProductId(product.id);
        setCategory(product.category);
        window.scrollTo(0, 0);
    };

    return (
        <div>
            <div className="container">
                {pathname === "/panageproducts" && (
                    <>
                    <h2 className="text-center mt-3"> Add Product to Sell</h2>
                    <form onSubmit={handleAddProduct}>
                        <select
                        value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="form-control text-center mb-3"
                            required
                            >
                                <option value ="" hidden>
                                    ---select category---
                                </option>
                                {categories.map((cat)=> {
                                    return <option value={cat}>{cat}</option>;                                 
                                })}
                        </select>
                        <label>Plant Name:</label>  
                            <input
                             type="text"
                            className= "form-control mb-3"
                            value={name}
                            onChange= {(e) => setName(e.target.value) }
                            required 
                            />

                            <label> Price:</label>
                            <input
                            type="number"
                            className="form-control mb-3"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            />

                            <label> Image: </label>
                            <input
                            type="file"
                            id="image"
                            className="form-control mb-3"
                            onChange={handleImageChange}
                            required={!productid}
                            />

                            <label> Description</label>
                            <textarea
                           className="form-control mb-3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}              
                            required
                            ></textarea>     

                            {productid && (
                                <div className="mb-3">
                                    <label htmlFor="availability" className="form-label">
                                     Availability:
                                  </label>

                                  <select className="form-select"
                                  name="availability"
                                  value={availability}
                                  onChange={(e) => setAvailability(e.target.value)}
                                  >
                                    <option value="In Stock">In Stock</option>
                                    <option value="Out Of Stock">Out Of Stock</option>
                                  </select>
                                  </div>
                                  )}
                                  <button className="btn btn-primary" type="submit">
                                    {productid ? "Update Product" : "Add Plant"}
                                  </button>

                                 <button className="btn btn-Link" onClick={ClearFields}>
                                    Reset Fields
                                  </button>
                                 </form>
                                  </>
                               )}

                <h2 className="mt-4"> Added products:</h2>
                <Row>
                    {productList.map((plant, index) => (
                        <Col md={4}>
                            <div 
                            key={index}
                            className="cards mb-3" 
                            style={{height:"500px"}}
                            >
                                <img 
                                src={plant.image}
                                alt={plant.name}
                                className="card-img-top"
                                height={200}
                                width={200}
                                />
                                <div className="card-body" style={{ overflowY: "auto"}}>
                                    <h3 className="card-title">{plant.name}</h3>
                                    <p className="card-text">
                                        <strong>Category:</strong> {plant.category}
                                    </p>
                                    <p className="card-text">
                                        <strong> Price:</strong> &#x20b9; {plant.price}
                                    </p>

                                    <p className="card-text">
                                        <strong > Availability:</strong>
                                        <span
                                        className={
                                            plant.availability === "In Stock"
                                            ? "text-success"
                                            : "text-danger"
                                        }
                                        >
                                            {plant.availability}
                                        </span>
                                    </p>
                                    <p className="card-text">
                                        <strong>Description:</strong> {plant.description}
                                    </p>
                                </div>
                                <div className="card-footer d-flex justify-content-end">
                                    <button
                                    className="btn btn-primary"
                                    onClick={() =>deleteProduct(plant.id)}
                                    >
                                     Delete
                                    </button>
                                    {pathname === "/admindashboard/manageproducts" && (
                                        <button
                                        className="btn btn-warning ms-3"
                                        onClick={() =>AssignData(plant)}
                                        >
                                        Edit
                                        </button>
                                   )}
                                </div>
                            </div>
                        </Col>
                         ))}
                </Row>
                </div>
                </div>
         );
 }
