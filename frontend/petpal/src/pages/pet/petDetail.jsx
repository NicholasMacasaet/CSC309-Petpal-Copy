import React, { useState, useEffect } from 'react';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../common/styles.css';
import PetCard from '../../components/PetCard';
import { useUserContext } from '../../contexts/UserContext';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';
import { BASE_URL } from '../../api/constants';


function PetDetail(){
        const [pet, setPet] = useState(null);
        const [shelter, setShelter] = useState(null);
        const [petListData, setPetListData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [isOwner, setIsOwner] = useState(false);
        const [error, setError] = useState(null);
        const { id } = useParams();
        const {user, isLoaded} = useUserContext()
        const navigate = useNavigate()       
        const authToken = localStorage.getItem('access_token');

        const [app2DropdownOpen, setApp2DropdownOpen] = useState(false)
        const [sort, setSort] = useState('-modified_date')
        const [appDropdownOpen, setAppDropdownOpen] = useState(false)
        const [appType, setAppType] = useState('pending')
        const [applications, setApplicationsData] = useState(null);

            
        useEffect(()=>{
            if (isLoaded && !user) {
                navigate('/404')
            }
        }, [user, isLoaded]) 

        const sort_mapping = {
            'created_date': 'Created',
            '-created_date': 'Created Desc',
            'modified_date': 'Modified',
            '-modified_date': 'Modified Desc',
        }

        const fetchApps = async (pagedUrl) => {
            let url = pagedUrl ? pagedUrl : BASE_URL +'pets/applications/'
            let user_url = BASE_URL + 'accounts/seekers/'
    
            const params = {
                'status': appType,
                'shelter': user.shelter.id,
                'sort': sort,
                'pet': id,
            }
    
            try {
                const accumulator = []
                const authToken = localStorage.getItem('access_token')
                
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    params: params,
                });
                for (let i=0;i<response.data.results.length;i++) {
                    const app = response.data.results[i]
                    const seeker_response = await axios.get(user_url + app.seeker, {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        }
                    })
                    app.pet_name = pet.name
                    console.log(seeker_response)
                    app.seeker_name = seeker_response.data.first_name
                    app.seeker_email = seeker_response.data.email
                    accumulator.push(response.data.results[i])
                }
                setApplicationsData({
                    next: response.data.next,
                    previous: response.data.previous, 
                    results: accumulator
                })
            } catch (error) {
              setError(error);
            }
        }

        useEffect(() => {
            if (isOwner) {
                fetchApps()
            }
        }, [sort, appType])

        useEffect(() => {
            if (isOwner) {
                fetchApps()
            }
        }, [isOwner])
    

        useEffect(() => {
            setLoading(true);
            setError(false);
            axios.get(BASE_URL +`pets/pet/${id}/`, 
            {
                headers: { Authorization: `Bearer ${authToken}` }
            })
            .then(response => {
                setPet(response.data);
                return axios.get(BASE_URL +`accounts/shelters/${response.data.shelter}/`, 
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
            })
            .then(response => {
                setShelter(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(true);
                setLoading(false);
                console.error('There was an error!', error);
            });
        }, [id, authToken]);
    
        useEffect(() => {
            if (pet?.shelter) {
                axios.get(BASE_URL +'pets/pets/?shelter=' + pet.shelter, 
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                })
                .then(response => {
                    setPetListData(response.data);
                })
                .catch(error => {
                    setError(true);
                    console.error('There was an error!', error);
                });
            }
        }, [authToken, pet]); 
        
        useEffect(() => {
            if (!loading && user?.type === "shelter" && pet) {
                setIsOwner(user.shelter.id === pet.shelter);
            } else {  
                setIsOwner(false);
            }
        }, [user, pet, shelter, loading]);

        const handleDeletePet = () => {
            if (window.confirm('Are you sure you want to delete this pet listing?')) {
                axios.delete(BASE_URL +`pets/pet/${id}/`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                })
                .then(() => {
                    navigate('/profile/');
                })
                .catch(error => {
                    console.error('Error deleting pet', error);
                });
            }
        };

        if (loading) {
            return <div>Loading...</div>;
        }
        if (error) {
            return <div>Error occurred!</div>;
        }
        if (!isOwner){
            return (
            <div className="page-container">
                <div className="content-container d-flex flex-column align-items-center">
                <div className="pet-container d-flex">
        
                <div className="pet-images-container d-flex flex-column align-items-end">
                <div className="pet-cover-image"> <img src={pet.profile_image} alt={pet.name}/> </div>
                </div>
                
        
                <div className="pet-details-container d-flex flex-column align-items-start">
                <div className="pet-info-container d-flex flex-row">
                  <h1 className="text-zinc-700 fs-3 fw-bold">{pet.name}</h1>
                  {pet.status == 'available' && user.type == "seeker" && 
                    
                    <Link to={`apply`}>
                        <button 
                        className={`primary-button ${pet.status}`}
                        style={{marginLeft:20}}
                        disabled={pet.status !== 'available'}
                    >
                        Apply
                    </button>
                    </Link>
                  }
                  {pet.status != 'available' && 
                        <button 
                        className={`primary-button ${pet.status}`}
                        style={{marginLeft:20}}
                        disabled={pet.status !== 'available'}
                        >
                            {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                        </button>
                    }
                    </div>
                
                <div className="pet-info-container d-flex flex-row">
                  <div className="pet-icon-list d-flex flex-column pe-5">
                    <span className="text-zinc-400 fs-8"><i className="bi bi-house"></i>
                    <Link to={`/shelter/${shelter.id}`}>
                        <a className="shelter-link-text">{shelter.shelter_name}</a>
                    </Link>
                    </span>
                    {pet.breed && <span className="text-zinc-400 fs-8"><i className="bi bi-chat-square-heart"></i>{pet.breed}</span>}
                    {pet.birthday && <span className="text-zinc-400 fs-8"><i className="bi bi-cake"></i> {pet.birthday}</span>}
                  </div>
                  <div className="d-flex flex-column">
                  <span className="text-zinc-400 fs-8"><i className="bi bi-piggy-bank"></i>{pet.animal}</span>
                    {pet.caretaker && <span className="text-zinc-400 fs-8"> <i className="bi bi-person"></i> {pet.caretaker}</span>}
                  </div>
                </div>
                <p className="text-zinc-600 fs-8 mt-4">Description: {pet.description}</p>
                {pet.vaccine_status && <p className="text-zinc-600 fs-8 mt-0">Vaccine Status: {pet.vaccine_status}</p>}
                <div className="pet-info-container d-flex flex-row">
                <div className="d-flex flex-column pe-5">
                  <span className="text-zinc-400 fs-8"><i className="bi bi-envelope"></i> {shelter.email}</span>
                  <span className="text-zinc-400 fs-8"> <i className="bi bi-geo-alt"></i> {shelter.address}</span>
                  {shelter.phone_number && <span className="text-zinc-400 fs-8"> <i className="bi bi-telephone-inbound"></i> {shelter.phone_number}</span>}
                </div>
                
              </div>
              </div>
              
              
              </div>
              <div className="our-friends-container w-100 px-5 mt-3 d-flex flex-column align-items-start">
              <h1 className="text-zinc-700 fs-3 fw-bold">Our Friends</h1>
               {/* <!-- PET CARDS --> */}
               <div className='listing-card-grid-container'>
                    {!loading && error && "ERROR OCCURED"}
                    {!loading && petListData && petListData.results.length > 0 &&
                        <>
                        <div className="listing-card-grid">
                            {petListData.results.length == 0 && 
                                <div>No friends found</div>
                            }
                            {petListData.results?.map((pet) => {
                                    return (
                                        <PetCard 
                                        id={pet.id}
                                            image={pet.profile_image}
                                            status={pet.status}
                                            listed={pet.listed}
                                            name={pet.name}
                                            shelter="Annex Dog Rescue"
                                            animal={pet.animal}
                                            birthday={pet.birthday}
                                            description={pet.description}
                                        />
                                    )
                                })
                            }
                        </div>
                        </>
                    }
                </div>
                </div>
              </div>
              </div>
            );
        }
        else {
            {/* shelter view of pet*/}
            return (
                <div className="page-container">
                <div class="content-container d-flex flex-column align-items-center">
    <div class="pet-container d-flex">
      <div class="pet-images-container d-flex flex-column align-items-end">
        <div class="pet-cover-image"> <img src={pet.profile_image ? pet.profile_image : 'https://i.ibb.co/cbb4bJg/dog.png'}/> </div>
      </div>
      <div class="pet-details-container d-flex flex-column align-items-start">
        <div class="pet-info-container d-flex flex-row">
          <h1 class="text-zinc-700 fs-3 fw-bold">{pet.name}</h1>
            {pet.status == "withdrawn" &&            
                <button className="primary-button mb-md-0 mb-3 ml-3" style={{ marginLeft:20, backgroundColor: 'crimson', height:35,}} >
                    {pet.status}
                </button>
            }
            {pet.status != "withdrawn" &&            
                <button className="primary-button mb-md-0 mb-3 ml-3" style={{ marginLeft:20, height:35,}} >
                    {pet.status}
                </button>
            }
            {/* <HashLink to="/profile#applications"><button class="view-app-button">View Applications</button></HashLink> */}
        </div>
        
        <div className="pet-info-container d-flex flex-row">
                  <div className="pet-icon-list d-flex flex-column pe-5">
                    <span className="text-zinc-400 fs-8"><i className="bi bi-house"></i>
                    <Link to={`/shelter/${shelter.id}`}>
                        <a className="shelter-link-text">{shelter.shelter_name}</a>
                    </Link>
                    </span>
                    {pet.breed && <span className="text-zinc-400 fs-8"><i className="bi bi-chat-square-heart"></i>{pet.breed}</span>}
                    {pet.birthday && <span className="text-zinc-400 fs-8"><i className="bi bi-cake"></i> {pet.birthday}</span>}
                  </div>
                  <div className="d-flex flex-column">
                  <span className="text-zinc-400 fs-8"><i className="bi bi-piggy-bank"></i>{pet.animal}</span>
                    {pet.caretaker && <span className="text-zinc-400 fs-8"> <i className="bi bi-person"></i> {pet.caretaker}</span>}
                  </div>
                </div>
                <p className="text-zinc-600 fs-8 mt-4">Description: {pet.description}</p>
                {pet.vaccine_status && <p className="text-zinc-600 fs-8 mt-0">Vaccine Status: {pet.vaccine_status}</p>}
        <div class="pet-info-container d-flex flex-row">
        <div class="d-flex flex-column pe-5">
          <span class="text-zinc-400 fs-8"><i class="bi bi-envelope"></i> {shelter.email}</span>
          <span class="text-zinc-400 fs-8"> <i class="bi bi-geo-alt"></i> {shelter.address}</span>
          {shelter.phone_number && <span class="text-zinc-400 fs-8"> <i class="bi bi-telephone-inbound"></i> {shelter.phone_number}</span>}
        </div>
      </div>
      </div>
    </div>



    <div id="applications" className="px-5 mt-5 mb-2 d-flex flex-column align-items-start" style={{width:'50%', minWidth:300}}>
                <div className="d-flex flex-row">
                    <h1 className="text-zinc-700 fs-3 fw-bold">Applications</h1>
                </div>
                <div className="d-flex flex-row mt-3" style={{gap:10}}>
                <div className="dropdown" style={{position:'relative'}}>
                    <button className="btn btn-secondary dropdown-toggle text-capitalize" type="button" onClick={()=>setAppDropdownOpen(!appDropdownOpen)} id="dropdownMenuButton" data-expanded="false">
                        {appType}
                    </button>
                        {appDropdownOpen && 
                            <div className="dropdown-menu dropdown-menu-right-screen-edge" id="dropdownMenu">
                                <a className="dropdown-item" href="#" onClick={() => {setAppType('pending'); setAppDropdownOpen(false)}}>Pending</a>
                                <a className="dropdown-item" href="#" onClick={() => {setAppType('accepted'); setAppDropdownOpen(false)}}>Accepted</a>
                                <a className="dropdown-item" href="#" onClick={() => {setAppType('denied'); setAppDropdownOpen(false)}}>Denied</a>
                                <a className="dropdown-item" href="#" onClick={() => {setAppType('withdrawn'); setAppDropdownOpen(false)}}>Withdrawn</a>
                            </div>
                        }
                    </div>
                    <div className="dropdown" style={{position:'relative', marginBottom: 20,}}>

                    <button className="btn btn-secondary dropdown-toggle text-capitalize" type="button" onClick={()=>setApp2DropdownOpen(!app2DropdownOpen)} id="dropdownMenuButton" data-expanded="false">
                        {sort_mapping[sort]}
                    </button>
                        {app2DropdownOpen && 
                            <div className="dropdown-menu dropdown-menu-left-screen-edge" id="dropdownMenu">
                                <a className="dropdown-item" href="#" onClick={() => {setSort('created_date'); setApp2DropdownOpen(false)}}>Created</a>
                                <a className="dropdown-item" href="#" onClick={() => {setSort('modified_date'); setApp2DropdownOpen(false)}}>Modified</a>
                                <a className="dropdown-item" href="#" onClick={() => {setSort('-created_date'); setApp2DropdownOpen(false)}}>Created Desc</a>
                                <a className="dropdown-item" href="#" onClick={() => {setSort('-modified_date'); setApp2DropdownOpen(false)}}>Modified Desc</a>
                            </div>
                        }
                    </div>
                </div>
            <div className="pending-applications">
              {applications?.results?.length > 0 ? 
              <>
              <table className="table application-table w-100 mt-2">
                <thead>
                  <tr>
                    <th scope="col">Applicant</th>
                    <th scope="col">Pet</th>
                    <th scope="col">Date</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Application</th>
                  </tr>
                </thead>
                {applications?.results.map((app) => {
                     const inputDate = new Date(app.created_date);
                     const month = String(inputDate.getMonth() + 1).padStart(2, '0');
                    const day = String(inputDate.getDate()).padStart(2, '0');
                    const year = inputDate.getFullYear();
                    const formattedDate = `${month}/${day}/${year}`;

                    return (
                        <tr>
                            <td>{app.seeker_name}</td>
                            <td>{app.pet_name}</td>
                            <td>{formattedDate}</td>
                            <td>{app.seeker_email}</td>
                            <td>{app.status}</td>
                            <td><Link to={`/application/${app.id}`}>View application</Link></td>
                        </tr>
                    )
                })}
              </table>
              <div style={{display:'flex', flexDirection:'row', gap:10}}> 
                {applications?.previous && <button className='pagination-btn' onClick={()=>fetchApps(applications?.previous)} >{'<'} Previous</button>}
                {applications?.next && <button className='pagination-btn' onClick={()=>fetchApps(applications?.next)}>Next {'>'}</button>}
            </div>
              </>: 
                <span>No applications found</span>
              }
            </div>
          </div>



    <div className="pet-info-container d-flex flex-row">
    <Link to={`edit`}><button class="edit-listing-button">Edit Listing</button></Link>
    <button className="delete-listing-button" style={{border:'none'}} onClick={handleDeletePet}>Delete Listing</button>
  </div>
  </div>
  </div>
            
            
    );
    }
}


export default PetDetail;