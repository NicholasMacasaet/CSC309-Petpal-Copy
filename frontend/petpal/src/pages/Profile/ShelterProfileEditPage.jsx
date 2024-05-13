import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../contexts/UserContext';
import { BASE_URL } from '../../api/constants';

function ShelterProfileEditPage() {
    const { user } = useUserContext();
    const [successMessage, setSuccessMessage] = useState('');
    const [isShelter, setIsShelter] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessages, setErrorMessages] = useState({});
    const navigate = useNavigate()
    const [profile, setProfile] = useState({
        shelter_name: '',
        website: '',
        email: '',
        phone_number: '',
        description: '',
        address: '',
        shelter_image: null,
    });
    const authToken = localStorage.getItem('access_token');
    const [displayImage, setDisplayImage] = useState(null)

    useEffect(() => {
        if (user?.type === "shelter") {
            setIsShelter(true);
            fetchProfileData();
        }
        else{
            setLoading(false);
        }
    }, [user]);


    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleFileChange = (e) => {
        setProfile({ ...profile, shelter_image: e.target.files[0] });
        try {
            setDisplayImage(URL.createObjectURL(e.target.files[0]))
        }
        catch {
            setDisplayImage(null)
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage(''); // Reset success message
        setErrorMessages({});  // Reset error messages
        const formData = new FormData();
    
        // Append text fields to formData
        Object.keys(profile).forEach(key => {
            if (key !== 'shelter_image') {
                formData.append(key, profile[key]);
            }
        });
    
        // Append the file to formData if it exists
        if (profile.shelter_image instanceof File) {
            formData.append('shelter_image', profile.shelter_image);
        }
    
        try {
            let url = BASE_URL + 'accounts/shelters/' + user.shelter.id + `/`;
            const response = await axios.put(url, formData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setSuccessMessage('Profile updated successfully.');
            navigate('/profile/');
            
        } catch (error) {
            console.log(error);
            
            console.error("Error updating profile:", error);
            if (error.response && error.response.data) {
                // Set error messages based on server response
                setErrorMessages(error.response.data);
            }
        }
    };

        const fetchProfileData = async () => {
            try {
                let url =  BASE_URL +'accounts/shelters/' + user.shelter.id
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setProfile(response.data);
                setDisplayImage(response.data.shelter_image)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
    

    if (loading){
        return <div>Loading...</div>
    }
    if (!isShelter){
        return <div> Error: Seekers cannot edit a shelter profile page.</div>
    }
    return (
        <div className="content-container">
        <main className="container">
            <div className="row mt-5 mx-auto">
                <h3 className="mb-5 fw-bold">Edit Profile</h3>
                <form onSubmit={handleSubmit} className="col-12">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h6>Shelter Name</h6>
                                <input
                                    type="text"
                                    className="form-control bg-zinc-100 text-zinc-500"
                                    name="shelter_name"
                                    placeholder="Shelter Name"
                                    value={profile.shelter_name}
                                    onChange={handleChange}
                                    required
                                />
                                {errorMessages.shelter_name && <div className="text-danger">{errorMessages.shelter_name}</div>}
                            </div>
                            <div className="mb-3">
                                <h6>Email</h6>
                                <input type="text" className="form-control bg-zinc-100 text-zinc-500" name="email" onChange={handleChange} id="email" placeholder="Email" value={profile.email}
                                    required />
                                    {errorMessages.email && <div className="text-danger">{errorMessages.email}</div>}
                            </div>

                            <div className="mb-3">
                                <h6>Phone</h6>
                                <input type="text" className="form-control bg-zinc-100 text-zinc-500" name="phone_number" onChange={handleChange} id="phone_number" placeholder="Phone" value={profile.phone_number} required />
                                {errorMessages.phone_number && <div className="text-danger">{errorMessages.phone_number}</div>}
                            </div>

                            <div className="mb-3">
                                <h6>Address</h6>
                                <input type="text" className="form-control bg-zinc-100 text-zinc-500" name="address" id="address" onChange={handleChange} placeholder="Address"
                                    value={profile.address} />
                                    {errorMessages.address && <div className="text-danger">{errorMessages.address}</div>}
                            </div>

                            <div className="mb-3">
                                <h6>Description</h6>
                                <textarea id="description" className="form-control bg-zinc-100 text-zinc-500" onChange={handleChange} placeholder="Description"
                                    style={{ height: '122px' }} name="description" value={profile.description}></textarea>
                                {errorMessages.description && <div className="text-danger">{errorMessages.description}</div>}
                            </div>
                            <div className="mb-3">
                                <h6>Website (optional)</h6>
                                <input type="text" className="form-control bg-zinc-100 text-zinc-500" id="website" onChange={handleChange} name="website" placeholder="website.com"
                                    value={profile.website} />
                                    {errorMessages.website && <div className="text-danger">{errorMessages.website}</div>}
                            </div>
                            
                        </div>
                        <div className="col-md-6 d-flex justify-content-center">
                            <div className="flex-container">
                                <img src={displayImage} className="img-fluid mt-2" alt="upload-image placeholder" />
                                <h6>Shelter Photo</h6>
                                <input type="file" name="shelter_image" onChange={handleFileChange} className="form-control bg-zinc-100 text-zinc-500 mt-md-0 mt-3" />
                                {errorMessages.shelter_image && <div className="text-danger">{errorMessages.shelter_image}</div>}
                                <button type="submit" className="btn btn-success ps-5 pe-5 mb-md-0 mb-3" style={{marginTop:'10px'}}>Update Profile</button>
                            {successMessage && <div className="text-success">{successMessage}</div>}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    </div>
    );
}

export default ShelterProfileEditPage;