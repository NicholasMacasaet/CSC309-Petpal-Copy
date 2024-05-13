import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext';

const PetCard = ({id, image, status, listed, name, shelter, animal, birthday, description}) => {
    
    const {user, shelters} = useUserContext();

    const listedDateObj = new Date(listed);
    const formattedListedDate = `${listedDateObj.getMonth() + 1}/${listedDateObj.getDate()}/${listedDateObj.getFullYear()}`;


    const birthDate = new Date(birthday);
    const currentDate = new Date();
    const yearDiff = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    const adjustedYearDiff = monthDiff < 0 ? yearDiff - 1 : yearDiff;
    const remainingMonthDiff = (12 + monthDiff) % 12;

    let age = '';
    if (adjustedYearDiff > 0) {
        age += `${adjustedYearDiff} ${adjustedYearDiff === 1 ? 'year' : 'years'}`;
    }

    if (remainingMonthDiff > 0) {
        if (age.length > 0) {
            age += ' ';
        }
        age += `${remainingMonthDiff} ${remainingMonthDiff === 1 ? 'month' : 'months'}`;
    }

    return (
        <Link to={(user?.type == "shelter" || user?.type == "seeker") ? `/pet/${id}/` : '/login'} className='pet-card-link-wrapper'>
            <div className="pet-card">
                <div className="pet-img">
                    <img src={image ? image : 'https://i.ibb.co/cbb4bJg/dog.png'}/>
                    <div className="pet-status">{status}</div>
                </div>
                <div className="pet-details">
                    <div className="pet-listed-date">Listed {formattedListedDate}</div>
                    <h4 className="pet-name text-capitalize">{name}</h4>
                    <span className="pet-info text-capitalize">{shelters[shelter]?.shelter_name}</span>
                    <span className="pet-info text-capitalize">{animal}</span>
                    {birthday && <span className="pet-info">{age}</span>}
                    <span className="pet-description">{description}</span>
                </div> 
            </div>
        </Link>
    )
}

export default PetCard