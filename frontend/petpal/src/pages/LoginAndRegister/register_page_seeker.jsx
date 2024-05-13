import '../../common/styles.css'
import { Link , useNavigate} from 'react-router-dom'
import { useState } from 'react'
import { BASE_URL } from '../../api/constants';
import  axios  from 'axios';

function RegisterPageSeeker() {



    const[username, setUsername] = useState("");
    const[email, setEmail] = useState("");
    const[phone_number, setPhoneNumber] = useState("");
    const[address, setAddress] = useState("");
    const[password, setPassword] = useState("");
    const[confirm_password, setConfirmPassword] = useState("");



    const handleUsernameChange = (event) => {

        setUsername(event.target.value);
    }
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    }

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const packaged_data ={
        username: username,
        email: email,
        phone_number: phone_number,
        address: address,
        password: password,
        confirm_password: confirm_password
    }


    let create_seeker_append='accounts/seekers/'
    let navigate = useNavigate();


    const[error, setError] = useState("")  
    const handleSeekerRegister = async(event) => {
        event.preventDefault();

        try{
            const data = await axios({
                method: 'post',
                url: BASE_URL+create_seeker_append,
                // data: packaged_data,
                data: JSON.stringify(packaged_data),
                headers: {'Content-Type': 'application/json' }
            });
            console.log("seeker registration successful!");
            navigate('/login/');
        }
        catch (error) {
            console.log("error in seeker registration", error.response.data.non_field_errors[0]);
            setError(error.response.data.non_field_errors[0]);
        }
    }

    let all_filled = (username && email && phone_number && address && password && confirm_password);
    console.log(packaged_data);

    return <>
    <div className="page-container">
        <div className="super-wrapper w-100 h-100 d-flex align-items-center justify-content-center">

            <div className="login-wrapper d-flex flex-column align-items-left w-75 mb-5 h-100">
            <div className="login-header text-left d-flex flex-column">
                <h4 className="fw-light">Get started as a Seeker</h4>
                <p className="display-4 fw-medium">Create a Seeker Account</p>
                {/* <h4 className="fw-light">Already have an account ? <a href="login_page.html" className="landinglink">Log in</a></h4> */}
                <h4 className="fw-light">Already have an account ?<Link to="/login/" className="landinglink"> Log in</Link></h4>
            </div>


            <div className="w-100">
            <h4 className="fw-light"><Link to="/" className="landinglink">Go Back</Link></h4>
                <form method="post" onSubmit={handleSeekerRegister}> 
                {/* <!--used form-control configurations from boostrap to align input boxes
                https://getbootstrap.com/docs/5.3/forms/overview/#overview, https://getbootstrap.com/docs/5.3/forms/form-control/
                -->
                 */}
                <div className="w-50">

                    <div className="mb-3 mt-5">
                        <input type="text" className="form-control" id="username" name="username" placeholder="Username..." onChange={handleUsernameChange}/>
                    </div>
                    <div className="mb-3">
                    <input type="email" className="form-control" id="email" name="email" placeholder="Email..." onChange={handleEmailChange}/>
                    </div>

                    <div className="mb-3">
                    <input type="text" className="form-control" id="phone_number" name="phone_number" placeholder="phone number..." onChange={handlePhoneNumberChange}/>
                    </div>

                    <div className="mb-3">
                    <input type="text" className="form-control" id="address" name="address" placeholder="address..." onChange={handleAddressChange}/>
                    </div>
                </div>


                <div className="w-100 d-flex mb-5">
                   
                    <div className="mb-3 w-50 me-1">
                    <input type="password" className="form-control" id="password" name="password" placeholder="Password..." onChange={handlePasswordChange}/>
                    </div>

                    <div className="mb-3 w-50">
                    <input type="password" className="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm Password..." onChange={handleConfirmPasswordChange}/>
                    </div>

                </div>
                {/* <div className="mb-3 d-flex justify-content-start">
                    <button type="submit" className="login-button">Register</button>    
                    </div> */}
                
                {
                    error && <div className="alert alert-danger" role="alert">
                    {error}
                    </div>
                }

                {
                    all_filled && <div className="mb-3 d-flex justify-content-start">
                    <button type="submit" className="login-button">Register</button>
                    </div>
                }

                {
                    !(all_filled) && <div className="alert alert-danger" role="alert">
                    Notice, all fields must be filled out
                    </div>
                }
                {
                    !(all_filled) && <div className="mb-3 d-flex justify-content-start">
                    <button type="submit" className="login-button" disabled>Register</button>    
                    </div>
                }

                
                </form>
            </div>

            </div>
        </div>  
        </div>
    </>;
}

export default RegisterPageSeeker