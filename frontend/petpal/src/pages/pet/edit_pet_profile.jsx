import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../api/constants';
import { useUserContext } from '../../contexts/UserContext';


function EditPetProfile() {
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState({});
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user, isLoaded } = useUserContext();
    const [profile, setProfile] = useState({
        breed: '',
        name: '',
        animal: '',
        birthday: null,
        vacine_status: '',
        caretaker: '',
        description: '',
        status: '',
        profile_image: null,
        shelter: '',
    });
    const { id } = useParams();
    const authToken = localStorage.getItem('access_token');
    const navigate = useNavigate()
    const [displayImage, setDisplayImage] = useState(null)

    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleFileChange = (e) => {
        setProfile({ ...profile, profile_image: e.target.files[0] });
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
            if (profile[key] != null && key != 'profile_image') {
                formData.append(key, profile[key]);
            }
        });

        // Append the file to formData if it exists
        if (profile.profile_image instanceof File) {
            formData.append('profile_image', profile.profile_image);
        }

        try {
            const response = await axios.put(BASE_URL +`pets/pet/${id}/`, formData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            navigate(`/pet/${id}`)
            setSuccessMessage('Pet updated successfully.');
        } catch (error) {
            console.error("Error updating pet profile:", error);
            if (error.response && error.response.data) {
                // Set error messages based on server response
                setErrorMessages(error.response.data);
            }
        }
    };

    // Fetch existing data when the component mounts
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(BASE_URL +`pets/pet/${id}/`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setLoading(false)
                setProfile(response.data);
                setDisplayImage(response.data.profile_image)
            } catch (error) {
                console.error("Error fetching pet data:", error);
            }
        };

        fetchProfileData();
    }, []);

    useEffect(() => {
        if (isLoaded && profile && !loading) {
            if (!user || user.type != "shelter") {
                navigate('/404')
                return
            }
            else if (user.shelter.id !== profile.shelter) {
                navigate('/404')
            }
            else {
                setIsOwner(true)
            }
        }
    }, [user, profile, loading, isLoaded]);

    if (loading){
        return <div>loading...</div>
    }
    if (!isOwner){
        return <div>Error 403: You are not authorized to edit this pet</div>
    }
    return (
        <div className="content-container">
        <main className="container">
            <div className="row mt-5 mx-auto">
                <h3 className="mb-5 fw-bold">Edit Pet</h3>
                <form onSubmit={handleSubmit} className="col-12">
                    <div className="row">
                        <div className="col-md-6">
                        <div className="mb-3">
                                    <h6>Pet Status</h6>
                                    <select name="status" onChange={handleChange} className="form-select bg-zinc-100 text-zinc-500" id="status" value={profile.status} required>
                                        <option value="available">Available</option>
                                        <option value="withdrawn">Withdrawn</option>
                                        <option value="adopted">Adopted</option>
                                    </select>
                                    {errorMessages.status && <div className="text-danger">{errorMessages.status}</div>}
                                </div>

                            <div className="mb-3">
                                <h6>Pet Name</h6>
                                <input type="text" name="name" onChange={handleChange} className="form-control bg-zinc-100 text-zinc-500" id="name" placeholder="Name" value={profile.name} required/>
                                {errorMessages.name && <div className="text-danger">{errorMessages.name}</div>}
                            </div>

                            <div className="mb-3">
                                <h6>Animal Type</h6>
                                <select name="animal" onChange={handleChange} className="form-select bg-zinc-100 text-zinc-500" id="animal" value={profile.animal}>
                                    <option value="dog">Dog</option>
                                    <option value="cat">Cat</option>
                                    <option value="bear">Bear</option>
                                    <option value="turtle">Turtle</option>
                                    <option value="rabbit">Rabbit</option>
                                    <option value="snake">Snake</option>
                                    <option value="lizard">Lizard</option>
                                    <option value="hamster">Hamster</option>
                                    <option value="other">Other</option>
                                </select>
                                {errorMessages.animal && <div className="text-danger">{errorMessages.animal}</div>}
                            </div>

                            <div className="mb-3">
                                <h6>Breed (optional)</h6>
                                <input type="text" onChange={handleChange} className="form-control bg-zinc-100 text-zinc-500" id="breed" name="breed" placeholder="Breed" value={profile.breed} />
                                {errorMessages.breed && <div className="text-danger">{errorMessages.breed}</div>}
                            </div>

                            <div className="mb-3">
                                <h6>Birthday (optional)</h6>
                                <input type="date" onChange={handleChange} className="form-control bg-zinc-100 text-zinc-500" id="birthday" value={profile.birthday} name="birthday" placeholder="Birthday (optional)" />
                                {errorMessages.birthday && <div className="text-danger">{errorMessages.birthday}</div>}
                            </div>

                            <div className="mb-3">
                                <h6>Caretaker (optional)</h6>
                                <input type="text" onChange={handleChange} className="form-control bg-zinc-100 text-zinc-500" id="caretaker" name="caretaker" value={profile.caretaker} placeholder="Caretaker" />
                                {errorMessages.caretaker && <div className="text-danger">{errorMessages.caretaker}</div>}
                            </div>

                            <div className="mb-3">
                                <h6>Vaccination Status (optional)</h6>
                                <textarea name="vaccine_status" onChange={handleChange} id="vaccine" className="form-control bg-zinc-100 text-zinc-500" value={profile.vacine_status} placeholder="Vaccine and Medical Information" style={{ height: '122px' }}></textarea>
                                {errorMessages.vacine_status && <div className="text-danger">{errorMessages.vacine_status}</div>}
                            </div>

                            <div className="mb-3">
                                <h6>description</h6>
                                <textarea name="description" onChange={handleChange} id="description" className="form-control bg-zinc-100 text-zinc-500" value={profile.description} placeholder="Enter description" style={{ height: '177px' }}></textarea>
                                {errorMessages.description && <div className="text-danger">{errorMessages.description}</div>}
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-center">
                            <div className="flex-container">
                                <img src={displayImage} className="img-fluid mt-2" alt="upload-image placeholder" />
                                <h6>Pet Photo</h6>
                                <input type="file" name="profile_image" accept="image/*" onChange={handleFileChange} className="form-control bg-zinc-100 text-zinc-500 mt-md-0 mt-3 mb-3" />
                                {errorMessages.profile_image && <div className="text-danger">{errorMessages.profile_image}</div>}
                                <button type="submit" className="btn btn-success ps-5 pe-5 mb-md-0 mb-3">Save Changes</button>
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

export default EditPetProfile;