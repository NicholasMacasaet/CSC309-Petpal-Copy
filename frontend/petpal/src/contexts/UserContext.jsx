// UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/constants';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shelters, setShelters] = useState({})

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoaded(true)
    }
    else {
      setIsLoaded(true);
    }
  }, []);

  const loginUser = (userData) => {
    console.log('logged in', userData)
    setUser(userData);
    setIsLoaded(true);
  };

  const logoutUser = () => {
    console.log('logged out')
    setUser(null);
    setIsLoaded(true);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      fetchShelters();
    }
  }, [user]);

  useEffect(()=>{
    fetchShelters()
  }, [])

  const fetchShelters = async () => {
    let url = BASE_URL +'accounts/shelters'

    try {
      const authToken = localStorage.getItem('access_token')
      let accum = {}
      while (true) {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
        });
        // console.log(response)
        response.data.results.map((shelter) => {
          accum[shelter['id']] = shelter
        })
        if (response.data.next) {
          url = response.data.next
        }
        else {
          break
        }
      }
      setShelters(accum);
    }
    catch {
      setShelters({})
    }
}
  

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, shelters, isLoaded }}>
      {children}
    </UserContext.Provider>
  );
};