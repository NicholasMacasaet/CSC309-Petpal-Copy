import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import  axios  from 'axios';
import PetCard from './PetCard';
import ApplicationComments from '../common/Comments/application_comments'
import '../common/styles.css';
import { BASE_URL } from '../api/constants';
import { useUserContext } from '../contexts/UserContext';

export default function SeekerApplication() {
    const [pet, setPet] = useState(null);
    const [application, setApplication] = useState(null);
    const [statusError, setStatusError] = useState('');
    const [shelter, setShelter] = useState(null)
    const [chatOpen, setChatOpen] = useState(false)
    const {user} = useUserContext()

    const { id } = useParams();

    const navigate = useNavigate();
    const bearerToken = localStorage.getItem('access_token');

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
            setPet(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getShelter = async (id) => {
        try {
            const res = await axios.get(
                `${BASE_URL}accounts/shelters/${id}/`,
                {
                    headers: { Authorization: `Bearer ${bearerToken}`, }
                }
            )
            setShelter(res.data);
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

    useEffect(() => {
        if (pet) {
            getShelter(pet.shelter)
        }
    }, [pet])

    // get application
    useEffect(() => {
        getApplication(id);
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('status', 'withdrawn');

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
                content: `${user.seeker.first_name} ${user.seeker.last_name} withdrew their application for your pet ${pet.name}.` 
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

            navigate('/profile/');

        } catch (err) {
            console.log(err)
            const { data } = err.response;
            setStatusError(data.error ? data.error : '');
        }
    }

    return (
        <div className="content-container">
        <main className="container">
        <h3 className="mb-4 fw-bold">View Your Application</h3>
        {shelter && <Link to={`/shelter/${shelter.id}`} style={{textDecoration:'none', color:'black', display:'inline-block'}}>
                    <div className='shelterCardSmall'>
                        <div className='shelterImg'>
                            <img src={shelter.shelter_image ? shelter.shelter_image : 'https://i.ibb.co/4JLwVSq/shelter.png'}/>
                        </div>
                        <div className='shelterInformation'>
                            <h1>{shelter.shelter_name}</h1>
                            <span>{shelter.email}</span>
                            <span>{shelter.address}</span>
                            <span>{shelter.description}</span>
                        </div>
                    </div>
        </Link>}
        <div className="row mt-5">
            {/* form */}
            <div className="col-md-6 col-12">
            {/* TODO: make name change based on which application */}
            {/* TODO: add aria */}
            {/* TODO: change input to boxes with same styling */}
            <form onSubmit={handleSubmit}>
                {/* <div className="mb-3">
                <input type="text" readOnly className="form-control bg-zinc-100 text-zinc-500" id="name1" value="David David" />
                </div> */}

                {/* <div className="mb-3">
                <input type="email" readOnly className="form-control bg-zinc-100 text-zinc-500" id="floatingInput" value="david@example.com" />
                </div> */}

                {/* <div className="mb-3">
                <input type="tel" readOnly className="form-control bg-zinc-100 text-zinc-500" id="tel" 
                    value={application ? application.phone : ''} />
                </div> */}

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
                    <button className="primary-button mb-md-0 mb-3" style={{ backgroundColor: 'crimson' }} >
                        Withdraw application
                    </button>
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
