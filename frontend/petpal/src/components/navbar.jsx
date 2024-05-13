import React, { useEffect, useState } from 'react';
import { Link, useFetcher, useNavigate } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';
import { useUserContext } from '../contexts/UserContext';
import { BASE_URL } from '../api/constants';
import bell from '../assets/bell.png'
import axios from 'axios'

const Navbar = () => {
    const {user, logoutUser, isLoaded} = useUserContext();
    const navigate = useNavigate();


    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const [notifs, setNotifs] = useState(null)
    const [readStatus, setReadStatus] = useState(false)


    const signOut = () => {
        logoutUser();
        localStorage.clear();
        setNotifOpen(false)
        setDropdownOpen(false)
        navigate('/login')
    }

    const fetchNotifs = async (pagedUrl) => {
        let url = pagedUrl ? pagedUrl :  BASE_URL + 'notifications/notifications/'

        
        const params = {
            'read_status': readStatus ? "True" : "False",
        }

        try {
            const authToken = localStorage.getItem('access_token')
            
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                params: params,
            });
            // console.log("AHHHHHHHHHHHHHHHHHHHHHHH")
            // console.log(response.data)
            setNotifs(response.data)
        }
        catch {

        }
    }

    useEffect(() => {
        fetchNotifs()
    }, [readStatus])

    const deleteNotif = async (e, id) => {
        e.stopPropagation()
        let url = BASE_URL +'notifications/notification/' + id
        const authToken = localStorage.getItem('access_token')
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        console.log(response)
        fetchNotifs()
    }

    const getNotif = async (id) => {
        let url = BASE_URL +'notifications/notification/' + id
        const authToken = localStorage.getItem('access_token')
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        let redirect = response.data.url
        if (response.data.open_chat) {
            redirect += "?open_chat=true"
        }
        navigate(redirect)
        console.log(response)
        fetchNotifs()
        setNotifOpen(false)
    }

    useEffect(() => {
        if (user && isLoaded) {
            fetchNotifs()
        }
        else {
            setNotifs(null)
        }
    }, [user])

    

    
    return (
        <>
            {!user && isLoaded && 
                <header className="landing-page-header position-fixed top-0 left-0 d-flex flex-row align-items-center justify-content-between">
                    <Link to="/" style={{textDecoration:'none'}}>
                        <a className="petpalLogo fs-3 ms-3 text-white fw-medium text-decoration-none">Petpal</a>
                    </Link>
                    <div className="d-flex flex-row">
                        <Link to="/register" style={{textDecoration:'none'}}>
                            <button className="login-button mx-3">Sign Up</button>
                        </Link>
                        <Link to="/login" style={{textDecoration:'none'}}>
                            <button className="login-button mx-3">Login</button>
                        </Link>
                    </div>

                </header>
            }
            {user && user.type == "moderator" && 
                <header className="landing-page-header position-fixed top-0 left-0 d-flex flex-row align-items-center justify-content-between">
                    <Link to="/moderator" style={{textDecoration:'none'}}>
                        <a className="petpalLogo fs-3 ms-3 text-white fw-medium text-decoration-none">Petpal</a>
                    </Link>
                    <div className="d-flex flex-row">
                    <div className="notificationDropdown dropdown">
                        <div className="notificationBell" style={{cursor:'pointer'}} onClick={() => {setNotifOpen(!notifOpen);setDropdownOpen(false)}}>
                            <img src={bell}/>
                        </div>
                        {notifOpen && 
                        <div className="dropdown-menu" id="notifications">
                            <div className='notif-option-container'>
                                <div style={{display:'flex', flexDirection:'row', gap:10}}> 
                                    {notifs?.previous && <button className='pagination-btn' onClick={()=>fetchNotifs(notifs?.previous)}>{'<'} Previous</button>}
                                    {notifs?.next && <button className='pagination-btn' onClick={()=>fetchNotifs(notifs?.next)} >Next {'>'}</button>}
                                </div>
                                <button className='pagination-btn' onClick={()=>setReadStatus(!readStatus)}>{readStatus ? "Show Unread" : "Show Read"}</button>
                            </div>
                            <div className='notif-container'>
                                {notifs?.results?.map((notif)=>{

                                    return (
                                        <a style={{cursor:'pointer'}} className="dropdown-item" onClick={() => getNotif(notif.id)}>{notif.content}<span> | {notif.timestamp}</span> <span onClick={(e) => deleteNotif(e, notif.id)} className='notif-delete'>Delete</span></a>
                                    )
                                })}
                                {!notifs?.results?.length > 0 && "No notifications"}
                            </div>
                        </div>}
                    </div>
                    <div className="profileDropdown dropdown">
                        <div className="pfp" style={{cursor:'pointer'}} onClick={() => {setDropdownOpen(!dropdownOpen);setNotifOpen(false)}}>
                        <img src={'https://i.ibb.co/4jkCqdm/user.png'}/>
                        </div>
                        {dropdownOpen && <div className="dropdown-menu" id="profileDropdown">
                            <a className="dropdown-item" style={{cursor:'pointer'}} onClick={signOut}>Log out</a>
                        </div>}
                    </div>
                    </div>

                </header>
            }
            {user && user.type == "seeker" && 
                <header className="landing-page-header position-fixed top-0 left-0 d-flex flex-row align-items-center justify-content-between">
                    <div className="mx-3 d-flex flex-row">
                    <Link onClick={() => window.location.href = "/"} style={{textDecoration:'none'}}>
                        <a className="petpalLogo fs-3 text-white fw-medium text-decoration-none">Petpal</a>
                    </Link>
                    <div className="navLinksContainer">
                        <Link to="/" style={{textDecoration:'none'}}>
                            <a className="text-white fw-medium text-decoration-none">Search</a>
                        </Link>
                        <HashLink to="/profile#applications" style={{textDecoration:'none'}}>
                            <a className="text-white fw-medium text-decoration-none">Applications</a>
                        </HashLink>
                        <Link to="/shelters" style={{textDecoration:'none'}}>
                            <a className="text-white fw-medium text-decoration-none">Shelters</a>
                        </Link>
                    </div>
                    </div>
                    <div className="d-flex flex-row">
                    <div className="notificationDropdown dropdown">
                        <div className="notificationBell" style={{cursor:'pointer'}} onClick={() => {setNotifOpen(!notifOpen);setDropdownOpen(false)}}>
                            <img src={bell}/>
                        </div>
                        {notifOpen && 
                        <div className="dropdown-menu" id="notifications">
                            <div className='notif-option-container'>
                                <div style={{display:'flex', flexDirection:'row', gap:10}}> 
                                    {notifs?.previous && <button className='pagination-btn' onClick={()=>fetchNotifs(notifs?.previous)}>{'<'} Previous</button>}
                                    {notifs?.next && <button className='pagination-btn' onClick={()=>fetchNotifs(notifs?.next)} >Next {'>'}</button>}
                                </div>
                                <button className='pagination-btn' onClick={()=>setReadStatus(!readStatus)}>{readStatus ? "Show Unread" : "Show Read"}</button>
                            </div>
                            <div className='notif-container'>
                                {notifs?.results?.map((notif)=>{

                                    return (
                                        <a style={{cursor:'pointer'}} className="dropdown-item" onClick={() => getNotif(notif.id)}>{notif.content}<span> | {notif.timestamp}</span> <span onClick={(e) => deleteNotif(e, notif.id)} className='notif-delete'>Delete</span></a>
                                    )
                                })}
                                {!notifs?.results?.length > 0 && "No notifications"}
                            </div>
                        </div>}
                    </div>
                    <div className="profileDropdown dropdown">
                        <div className="pfp" style={{cursor:'pointer'}} onClick={() => {setDropdownOpen(!dropdownOpen);setNotifOpen(false)}}>
                        <img src={user.seeker.profile_image != null ? user.seeker.profile_image : 'https://i.ibb.co/4jkCqdm/user.png'}/>
                        </div>
                        {dropdownOpen && <div className="dropdown-menu" id="profileDropdown">
                            <Link to='/profile' style={{textDecoration:'none'}} onClick={()=>setDropdownOpen(false)}>
                                <a className="dropdown-item">My profile</a>
                            </Link>
                            <Link to='/profile/edit' style={{textDecoration:'none'}} onClick={()=>setDropdownOpen(false)}>
                                <a className="dropdown-item">Edit profile</a>
                            </Link>
                            <a className="dropdown-item" style={{cursor:'pointer'}} onClick={signOut}>Log out</a>
                        </div>}
                    </div>
                    </div>
                </header>
            }
            {user && user.type == "shelter" && 
                <header className="landing-page-header position-fixed top-0 left-0 d-flex flex-row align-items-center justify-content-between">
                    <div className="mx-3 d-flex flex-row">
                    <Link onClick={() => window.location.href = "/"} style={{textDecoration:'none'}}>
                        <a className="petpalLogo fs-3 text-white fw-medium text-decoration-none">Petpal</a>
                    </Link>
                    <div className="navLinksContainer">
                        <HashLink to="/profile#active_pets" style={{textDecoration:'none'}}>
                            <a className="text-white fw-medium text-decoration-none">Pets</a>
                        </HashLink>
                        <HashLink to="/profile#applications" style={{textDecoration:'none'}}>
                            <a className="text-white fw-medium text-decoration-none">Applications</a>
                        </HashLink>
                        <Link to="/shelters" style={{textDecoration:'none'}}>
                            <a className="text-white fw-medium text-decoration-none">Shelters</a>
                        </Link>
                    </div>
                    </div>
                    <div className="d-flex flex-row">
                    <div className="notificationDropdown dropdown">
                    <div className="notificationBell" style={{cursor:'pointer'}} onClick={() => {setNotifOpen(!notifOpen);setDropdownOpen(false)}}>
                            <img src={bell}/>
                        </div>
                        {notifOpen && 
                        <div className="dropdown-menu" id="notifications">
                            <div className='notif-option-container'>
                                <div style={{display:'flex', flexDirection:'row', gap:10}}> 
                                    {notifs?.previous && <button className='pagination-btn' onClick={()=>fetchNotifs(notifs?.previous)}>{'<'} Previous</button>}
                                    {notifs?.next && <button className='pagination-btn' onClick={()=>fetchNotifs(notifs?.next)} >Next {'>'}</button>}
                                </div>
                                <button className='pagination-btn' onClick={()=>setReadStatus(!readStatus)}>{readStatus ? "Show Unread" : "Show Read"}</button>
                            </div>
                            <div className='notif-container'>
                                {notifs?.results?.map((notif)=>{

                                    return (
                                        <a style={{cursor:'pointer'}} className="dropdown-item" onClick={() => getNotif(notif.id)}>{notif.content}<span> | {notif.timestamp}</span> <span onClick={(e) => deleteNotif(e, notif.id)} className='notif-delete'>Delete</span></a>
                                    )
                                })}
                                {!notifs?.results?.length > 0  && "No notifications"}
                            </div>
                        </div>}
                    </div>
                    <div className="profileDropdown dropdown">
                    <div className="pfp" style={{cursor:'pointer'}} onClick={() => {setDropdownOpen(!dropdownOpen);setNotifOpen(false)}}>
                            <img src={user.shelter.shelter_image != null ? user.shelter.shelter_image : 'https://i.ibb.co/4JLwVSq/shelter.png'}/>
                        </div>
                        {dropdownOpen && <div className="dropdown-menu" id="profileDropdown">
                            <Link to="/profile" style={{textDecoration:'none'}} onClick={()=>setDropdownOpen(false)}>
                                <a className="dropdown-item">My profile</a>
                            </Link>
                            <Link to="/profile/edit" style={{textDecoration:'none'}} onClick={()=>setDropdownOpen(false)}>
                                <a className="dropdown-item">Edit profile</a>
                            </Link>
                            <a className="dropdown-item" style={{cursor:'pointer'}} onClick={signOut}>Log out</a>
                        </div>}
                    </div>
                    </div>
                </header>
            }
        </>
    )
}

export default Navbar