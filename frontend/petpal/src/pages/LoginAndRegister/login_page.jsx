
import '../../common/styles.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../contexts/UserContext';
import { BASE_URL } from '../../api/constants' 

import  axios  from 'axios';
function LoginPage(){

    const { loginUser, logoutUser } = useUserContext();
    let login_append='accounts/api/token/'

    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");



    const handleUsernameChange = (event) => {
            setUsername(event.target.value);
    }
    const handlePasswordChange = (event) => {
            setPassword(event.target.value);
    }

    const navigate = useNavigate();
    const [error, setError] = useState("")
    console.log("username: "+username, "password: "+password)
    const handleLogin = async (event) => { 
        event.preventDefault();

        const user ={
            username: username,
            password: password,
        
        }
        try{

            const {data} = await 
                        axios.post(BASE_URL+login_append,
                        user, 
                        {headers:
                            {'Content-Type': 'application/json'}}, {withCredentials: true});

            localStorage.clear();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            loginUser(data.user)

            axios.defaults.headers['Authorization'] = `Bearer ${data['access']}`;

            if (data.user.type == "shelter") {
                navigate('/profile')
            }
            else if (data.user.type == "moderator") {
                navigate('/moderator')
            }
            else {
                navigate('/')
            }
        }
        catch(error){
            logoutUser();
            console.log(error)
            setError(error.response.data.detail)
        }

        
    }

    return <>
        <div className="page-container">
        <div className="super-wrapper w-100 h-100 d-flex align-items-center justify-content-center">
            <div className="login-wrapper d-flex flex-column align-items-left mb-5  h-100">
                <div className="login-header text-left d-flex flex-column">
                    <h4 className="fw-light">Welcome Back User</h4>
                    <p className="display-4 fw-medium">Login to your account</p>
                    {/* <h4 className="fw-light">Dont't have an account ? <a href="index.html" className="landinglink">Register</a></h4> */}
                    <h4 className="fw-light">Dont't have an account ? <Link to="/register" className="landinglink">Register</Link></h4>
                    {/* <!--for now our landing page serves as the way to either register as a user or shelter--> */}
                </div>


                <div className="w-75">
                    <form method="post" onSubmit={handleLogin}>

                    {/* <!--used form-control configurations from boostrap to align input boxes
                    https://getbootstrap.com/docs/5.3/forms/overview/#overview , https://getbootstrap.com/docs/5.3/forms/form-control/
                    --> */}
                    <div className="mb-3 mt-5">
                        <input type="text" className="form-control" id="username" name="username"placeholder="Username..." onChange={handleUsernameChange}/>
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" id="password" name="password" placeholder="Password..." onChange={handlePasswordChange}/>
                    </div>
                    {/* <!--note, form control classNamees are default configs provided by bootstrap--> */}

                    {
                        error && <div className="alert alert-danger" role="alert"> {error}. Perhaps you've entered a wrong username or password.</div>
                    }
                    <div className="mb-3 d-flex justify-content-start">
                        <button type="submit" className="login-button">Login</button>
                    </div>
                    {/* <!--for now this is meant to go to the fail page as we dont have the tools
                    to make it actually see if the password is correct or not-->
                    <!--once we have functionality to actually pass around views, ill take out the anchor tags--> */}
                    
                    </form>
                </div>

            </div>
        </div>
        </div>
    </>;



}


export default LoginPage

// group_3772\P3\frontend\petpal\src\common\styles.css