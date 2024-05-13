import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../contexts/UserContext';
import SeekerProfilePage from './SeekerProfilePage';
import ShelterProfilePage from './ShelterProfilePage';

const ProfilePage = () => {
    const {user, isLoaded} = useUserContext()
    const navigate = useNavigate()

    useEffect(()=>{
        if (isLoaded && !user) {
            navigate('/404')
        }
    }, [user, isLoaded])

    return (
        <>
            {user?.type == "shelter" && <ShelterProfilePage />}
            {user?.type == "seeker" && <SeekerProfilePage />}
        </>
    )
}

export default ProfilePage