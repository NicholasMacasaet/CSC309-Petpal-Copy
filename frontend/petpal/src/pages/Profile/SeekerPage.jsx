import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../api/constants';

const SeekerPage = () => {
    const { user, isLoaded} = useUserContext();
    const navigate = useNavigate()
    const [data, setData] = useState(null);
    const [applications, setApplicationsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [appDropdownOpen, setAppDropdownOpen] = useState(false)
    const [app2DropdownOpen, setApp2DropdownOpen] = useState(false)
    const {id} = useParams()
    const [status, setStatus] = useState('pending')
    const [sort, setSort] = useState('-modified_date')
    const authToken = localStorage.getItem('access_token');

    useEffect(() => {
      if (isLoaded && !user) {
          navigate('/404')
      }
  }, [user, isLoaded])



    useEffect(() => {
        setLoading(true);
        setError(null);
    
        const fetchSeekerProfile = axios.get(BASE_URL +`accounts/seekers/${id}/`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
    
        Promise.all([fetchSeekerProfile])
            .then(([profileResponse]) => {
                setData(profileResponse.data);
            })
            .catch(error => {
                setError(error);
                console.error('Error fetching data', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user, authToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        const errorCode = error.response?.status || 'Unknown';
        return <div>{errorCode} error: an error occurred</div>;
    }
    return (
        <div className="page-container">
        <div className="super-wrapper w-100 h-100 d-flex flex-column align-items-center">
      <div className="profile-wrapper w-75 d-flex flex-column align-items-left">
        <h1>{data.first_name}'s Profile</h1>
        <div className="picture-and-contact w-75 d-flex mt-3">

          <div className="headshot-wrapper">
            <img src={data.profile_image ? data.profile_image : 'https://i.ibb.co/4jkCqdm/user.png'} alt="headshot" className="headshot w-100, h-100"/>
          </div>
          <div>
            <h3 className="fw-medium">{data.first_name} {data.last_name}</h3>
            <h4 className="fw-light" style={{fontSize:16}}>{data.email}</h4>
            <h4 className="fw-light" style={{fontSize:16}}>{data.address}</h4>
            {data.phone_number && <h4 className="fw-light" style={{fontSize:16}}>{ `(${data.phone_number.slice(0, 3)})-${data.phone_number.slice(3, 6)}-${data.phone_number.slice(6)}`}</h4>}
          </div>

        </div>

        <p className="text-zinc-600 fs-10 mt-4">
        Bio: {data.description}
        </p>
      </div>
    </div>
    </div>
    );
    


}
export default SeekerPage;

