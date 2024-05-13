import '../../common/styles.css'
import { Link , useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react'
import  axios  from 'axios';



function TestHomePage(){

    const[message, setMessage] = useState("");


    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('access_token') === null){
            navigate('/login/')
        }           
    },[])

    return<>
        <div className="page-container">
            <h1>We should only see this if authentication and login was successful </h1>
        </div>
    </>

}


export default TestHomePage