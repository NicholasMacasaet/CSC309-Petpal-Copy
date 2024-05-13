import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import  axios  from 'axios';
import PetCard from './PetCard';
import ApplicationComments from '../common/Comments/application_comments'
import '../common/styles.css';    
import { BASE_URL } from '../api/constants';
import { useUserContext } from '../contexts/UserContext';

export default function ShelterApplication() {
    const [pet, setPet] = useState(null);
    const [application, setApplication] = useState(null);
    const [seeker, setSeeker] = useState(null);
    const [statusError, setStatusError] = useState('');
    const [chatOpen, setChatOpen] = useState(false)

    const {user} = useUserContext()
    const bearerToken = localStorage.getItem('access_token');

    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(()=>{
        const queryParams = new URLSearchParams(window.location.search);
        const open_chat = queryParams.get('open_chat');
        if (open_chat == "true") {
            setChatOpen(true)
        }
    }, [])

    const getApplication = async (app_id) => {
        try {
            const res = await axios.get(
                `${BASE_URL}pets/application/${app_id}/`,
                {
                    headers: { Authorization: `Bearer ${bearerToken}`, }
                }
            )
            console.log(res);
            setApplication(res.data);
        } catch (err) {
            navigate('/404/');
            console.log(err);
        }
    }

    const getPet = async (pet_id) => {
        try {
            const res = await axios.get(
                `${BASE_URL}pets/pet/${pet_id}/`,
                {
                    headers: { Authorization: `Bearer ${bearerToken}`, }
                }
            )

            console.log(res);
            setPet(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getSeeker = async (seeker_id) => {
        try {
            const res = await axios.get(
                `${BASE_URL}accounts/seekers/${seeker_id}/`,
                {
                    headers: { Authorization: `Bearer ${bearerToken}`, }
                }
            )

            console.log("SEEKER", res.data);
            setSeeker(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    // get pet
    useEffect(() => {
        if (application) {
            getPet(application.pet);
        }
    }, [application])

    // get application
    useEffect(() => {
        getApplication(id);
    }, [])

    // get seeker
     // get application
     useEffect(() => {
        if (application) {
            getSeeker(application.seeker);
        }
    }, [application])

    const handleButton = async (status) => {
        const formData = new FormData();
        formData.append('status', status);

        try {
            const res = await axios.patch(
                `${BASE_URL}pets/application/${id}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            console.log(res);

            const app_id = res.data.id

            const content = {
                content: `${user.shelter.shelter_name} ${status} your application for ${pet.name}.` 
            }

            await axios.post(
                `${BASE_URL}notifications/application/${app_id}/`,
                content,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                      },
                }
            )

            navigate('/profile');

        } catch (err) {
            console.log(err)
            const { data } = err.response;
            setStatusError(data.error ? data.error : '');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    return (
        <div className='content-container'>
            <main className="container" style={{ marginBottom:30, }}>
        <h3 className="mt-5 mb-4 fw-bold">View {seeker ? seeker.first_name + "'s" : 'This'} Application</h3>
        {seeker && <Link to={`/seeker/${application.seeker}`} style={{textDecoration:'none', color:'black', display:'inline-block'}}>
                    <div className='shelterCardSmall'>
                        <div className='shelterImg'>
                            <img src={seeker.profile_image ? seeker.profile_image : 'https://i.ibb.co/4jkCqdm/user.png'}/>
                        </div>
                        <div className='shelterInformation'>
                            <h1>{`${seeker.first_name} ${seeker.last_name}`}</h1>
                            <span>{seeker.email}</span>
                            <span>{seeker.description}</span>
                        </div>
                    </div>
        </Link>}
        <div className="row mt-5">
            {/* form */}
            <div className="col-md-6 col-12">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <input type="text" readOnly className="form-control bg-zinc-100 text-zinc-500" id="name1" value={seeker ? `${seeker.first_name} ${seeker.last_name}` : ''} />
                </div>

                <div className="mb-3">
                <input type="email" readOnly className="form-control bg-zinc-100 text-zinc-500" id="floatingInput" value={seeker ? seeker.email : ''}/>
                </div>

                <div className="mb-3">
                <input type="tel" readOnly className="form-control bg-zinc-100 text-zinc-500" id="tel" 
                    value={seeker ? `(${seeker.phone_number.substring(0, 3)}) ${seeker.phone_number.substring(3, 6)}-${seeker.phone_number.substring(6,10)}` : ''} />
                </div>

                <div className="mb-3">
                <select name="contactMethod" className="form-select bg-zinc-100 text-zinc-500" id="contactMethod" disabled>
                    <option >{application ? `Prefers to be contacted by ${application.preferred_contact}` : ''}</option>
                </select>
                </div>

                <div className="mb-3">
                <textarea name="reason" id="reason" className="form-control bg-zinc-100 text-zinc-500" readOnly style={{ height: '215px' }} 
                    value={application? application.description : ''}>
                </textarea>
                </div>

                {application?.status == "pending" &&
                    <>
                        <button className="primary-button mb-md-0 mb-3 d-inline-block" onClick={() => handleButton('accepted')}>Accept application</button>
                        <button className="primary-button mb-md-0 mb-3 d-inline-block" onClick={() => handleButton('denied')} style={{backgroundColor: 'crimson'}}>Reject application</button>
                    </>
                }
                {
                    application?.status == "accepted" && 
                    <button className="primary-button mb-md-0 mb-3 d-inline-block" disabled>{application.status}</button>
                }
                {
                    (application?.status == "withdrawn" || application?.status == "denied")  && 
                    <button className="primary-button mb-md-0 mb-3 d-inline-block" disabled style={{backgroundColor: 'crimson'}}>{application.status}</button>
                }



                { statusError && <div className="text-danger mb-3 mt-n3">{statusError}</div>}

                {/* <button className="primary-button mb-md-0 mb-3" style={{ backgroundColor: 'crimson' }} >
                Withdraw application
                </button>
                { statusError && <div className="text-danger mb-3 mt-n3">{statusError}</div>} */}
            </form>

            {/* Chat section */}
            <ApplicationComments pet={pet} chatOpen={chatOpen}/>
            </div>

            {/* Card */}
            <div className="col-md-6 col-12 mt-md-0 mt-3 mb-3 d-flex justify-content-center align-items-start">
            { pet && <PetCard 
                id={pet.id}
                image={pet.profile_image}
                status={pet.status}
                listed={pet.listed}
                name={pet.name}
                // TODO: get shelter
                shelter={pet.shelter}
                animal={pet.animal}
                birthday={pet.birthday}
                description={pet.description}
                // style={{ transform: 'scale(1.3)' }}
            />
            }
            </div>
        </div>
        </main>
        </div>
    )
}
