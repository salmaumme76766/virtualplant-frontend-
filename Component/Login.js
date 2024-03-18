import React,{useState} from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";




function Login() {
    const[usertype, setUsertype] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const obj = { email: username, password, userType:usertype };
        axios
            .post("http://localhost:8080/LoginVerify", obj)
            .then((res) => {
                console.log(res);
                if (res.data === "admin") {
                    navigate("/admin");
                    alert("Login successfully");
                }
                 else  if (res.data === "user") {
                    navigate("/user");
                    alert("Login successfully");
                }
            })
            .catch((err) => {
                console.log(err);
                alert(err.data ? err.data : "Failed to login");
            });
    }
        
    return (
        <div>
        <div className="card p-3 w-50 mx-auto">
            <h2 className="text-center">Login Page</h2>
            <form onSubmit={handleSubmit}>
                <label>Select Usertype</label>
                <select
                    className="form-select text-center"
                    value={usertype}
                    onChange={(e) => setUsertype(e.target.value)}
                    required
                >
                    
                    
                    <option value="" hidden>
                        Select Usertype
                    </option>
                    <option value="admin">admin</option>
                    <option value="user">user</option>
                </select>
                <label>Enter email</label>
                <input
                    type="email"
                    className="form-control mb-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label>Enter Password</label>
                <input
                    type="password"
                    className="form-control mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="btn btn-primary" type="submit">Login</button>
    
                 <Link className="btn btn-Link" to='/register'>Register</Link>
                </form>
            </div>
        </div>
    );

}

export default Login;



