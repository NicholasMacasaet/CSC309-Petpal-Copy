
import { useEffect, useInsertionEffect, useMemo, useRef, useState } from 'react';
import { Link, useFetcher } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep';
import PetCard from '../../components/PetCard';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useUserContext } from '../../contexts/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import ShelterComments from '../../common/Comments/shelter_comments';
import { BASE_URL } from '../../api/constants';

const ShelterListPage = () => {

    const [shelters, setShelters] = useState(null)
    const {user, isLoaded} = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoaded && !user) {
            navigate('/404')
        }
    }, [user, isLoaded]);

    const fetchShelters = async (pagedUrl) => {
        let url = pagedUrl ? pagedUrl : BASE_URL +'accounts/shelters'
    
        try {
          const authToken = localStorage.getItem('access_token')
          const response = await axios.get(url, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
          });
          console.log(response.data)
          setShelters(response.data)
        }
        catch {
          setShelters({})
        }
    }

    useEffect(() => {
        fetchShelters()
    }, [])
    
    if (shelters) {

    return (
        <div className="page-container2">
            <div className='shelterList'>

            {shelters?.results?.map((shelter)=> {
                console.log(shelter)
                return (
                    <Link to={`/shelter/${shelter.id}`} style={{textDecoration:'none', color:'black'}}>
                    <div className='shelterCard'>
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
                    </Link>
                )

            })}
            <div style={{display:'flex', flexDirection:'row', gap:10, marginBottom: 30,}}> 
                {shelters?.previous && <button className='pagination-btn' onClick={()=>fetchShelters(shelters?.previous)} >{'<'} Previous</button>}
                {shelters?.next && <button className='pagination-btn' onClick={()=>fetchShelters(shelters?.next)}>Next {'>'}</button>}
            </div>
            </div>
        </div>
    )
    }
    else {
        return <div className="page-container"></div>
    }
}
export default ShelterListPage