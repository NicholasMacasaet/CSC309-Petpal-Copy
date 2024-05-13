import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../contexts/UserContext';
import ShelterProfileEditPage from './ShelterProfileEditPage';
import SeekerProfileEditPage from './SeekerProfileEditPage';
import { useNavigate } from 'react-router-dom';

const ProfileEditPage = () => {
    const {user, isLoaded} = useUserContext()
    const navigate = useNavigate()

    useEffect(()=>{
        if (isLoaded && !user) {
            navigate('/404')
        }
    }, [user, isLoaded])

    return (
        <>
            {user?.type == "shelter" && <ShelterProfileEditPage />}
            {user?.type == "seeker" && <SeekerProfileEditPage />}
        </>
    )
}

export default ProfileEditPage