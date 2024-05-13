
import '../../common/styles.css'

import { Link } from 'react-router-dom'

import cheems from '../../assets/cheems.jpg'
import dog from '../../assets/dog.png'
import sealofapproval from '../../assets/sealofapproval.jpg'

function LandingPage() {
    return (
    <div className="page-container">
        <div className="landing-container w-100 d-flex">
            <div className="landing-page-info  h-25 d-flex flex-column align-items-center ">
                    <div className="text-center">
                        <h1 className="display-3 fw-medium">Every adoption changes a life</h1>
                        <p className="h4">Here at Petpal we ensure all pets find their forever home</p>
                    </div>
                    <div>
                        {/* <button type="button" class="btn btn-lg  btn-success adopt-color"><a href="signup_page_seeker.html" class="link">I want to adopt</a></button> */}
                        <Link to="/register/seeker/"><button type="button" className="btn btn-lg  btn-success adopt-color">I want to adopt</button></Link>
                        <Link to="/register/shelter/"> <button type="button" className="btn btn-secondary btn-lg  shelter-color">I'm a Shelter</button></Link>
                        {/* <button type="button" class="btn btn-secondary btn-lg  shelter-color"><a href="signup_page_shelter.html" class="link">I'm a Shelter</a></button> */}
                    </div>
            </div>

                <div className="h-100 w-50">
                    <div className="image-container h-50 mt-3 w-100 h-100">
                    <img src={cheems} className="w-25 h-25 landing-image z-1 position-relative" />
                    <img src={dog} className="w-25 h-25 position-relative top-50 end-0 z-0 landing-image z-0"/>
                    <img src={sealofapproval} className="w-25 h-25 position-relative bottom-0 end-0 z-2 landing-image z-2"/> 
                    </div>
                </div>  
                
        </div>
    </div>)
}
export default LandingPage