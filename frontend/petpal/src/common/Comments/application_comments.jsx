import { Link , useParams, useNavigate, useFetcher} from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import './comments.css'
import axios from 'axios'
import { useUserContext } from '../../contexts/UserContext.jsx';

import { BASE_URL } from '../../api/constants.js';

function ApplicationComments({pet, chatOpen}){

    //TODO: when making the axios call, do a check to see if the user is the shelter or the applicant
    // if the user is the shelter, then while parsing the data, set is_user to true if the sender is the shelter,
    // and set is_user to false if the sender is the applicant


    let { id } = useParams()
    const navigate = useNavigate();
    let base_url =  BASE_URL
    let application_comments_append=`comments/application/${ id }/`
    const[application_comments, setApplicationComments] = useState([]) 
    const[nextPageUrl, setNextPageUrl] = useState(null)
    const[previousPageUrl, setPreviousPageUrl] = useState(null)

    useEffect(() => {
        setOpen(chatOpen)
    }, [chatOpen])

    const fetch_messages = async () => {
        console.log("fetching message data")
        try{
            const response = await axios.get(base_url+application_comments_append, {headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}})
            // if(response.data.next !== null){
                setNextPageUrl(response.data.next)
            // }
            // if(response.data.previous !== null){
                setPreviousPageUrl(response.data.previous)
            // }
            setApplicationComments(response.data.results)
        } catch(error){
            console.log("error retrieving messages",error)
        }

    }

    useEffect(() => {
        let is_mounted = true;
        if(localStorage.getItem('access_token') === null){
            navigate('/login/')
        }

        fetch_messages()
        return () => {is_mounted = false}

    },[])

    console.log("application comments", application_comments.reverse())

    const {user} = useUserContext()
    let user_id = 0
    if(user !== null){
        if (user.type === "seeker"){
            user_id = user.seeker.user
            console.log("user_id (messages)",user_id)
        }
        if (user.type === "shelter"){
            user_id = user.shelter.user
            console.log("user_id (messages)",user_id)
        }
    }
    let formatted_messages= []

    application_comments.reverse().forEach((message) => {
        let is_user = false
        if (message.sender === user_id){
            is_user = true
        }
        let message_content = message.content
        message={
            content:message_content,
            is_user:is_user,
        }
        formatted_messages.push(message)
    })


    // TODO: when the user types something in the chat

    const[open, setOpen] = useState(false)

    const toggle = () => { 
        setOpen(!open)
    }

    const chatboxRef = useRef(null)

    useEffect(()=>{
        if(chatboxRef.current && open){
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
        }
    }, [open])


    const[message, setMessage] = useState("")
    const handle_user_input = (event) => {
        event.preventDefault()
        setMessage(event.target.value)
    }

    const packaged_data = {
        content:message,
        sender:user_id,
        application:id,
    }
    console.log("user message:", packaged_data)

    const handle_user_message = async(event) => {
        event.preventDefault()

        try{
            const res = await axios({
                method: 'post',
                url: base_url+application_comments_append,
                data: packaged_data,
                headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
                
            })
            
            const comment_id = res.data.id
            const content = {
                "content": user.type == "seeker" ? `${user.seeker.first_name} ${user.seeker.last_name} left a comment on their application for ${pet.name}.` : `${user.shelter.shelter_name} left a comment on your application for ${pet.name}.`
            }

            console.log("AHHHHHH", content)

            await axios.post(
                `${base_url}notifications/application_comment/${comment_id}/`,
                content,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                      },
                }
            )
            
            fetch_messages()
            console.log('aASDASDASDASDASD')
            document.getElementById('message_input').value = ""
            console.log("message sent, success")
        }catch(error){
            console.log("error posting message", error)
        }
    }
    const next_page = () => {
        if (nextPageUrl !== null){
            axios.get(nextPageUrl, {headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}})
            .then((response) => {
                setApplicationComments(response.data.results)
                setNextPageUrl(response.data.next)
                setPreviousPageUrl(response.data.previous)
            })
            .catch((error) => {
                console.log("error retrieving next page", error)
            })
        }
    }

    const previous_page = () => {
        if (previousPageUrl !== null){
            axios.get(previousPageUrl, {headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}})
            .then((response) => {
                setApplicationComments(response.data.results)
                setNextPageUrl(response.data.next)
                setPreviousPageUrl(response.data.previous)
            })
            .catch((error) => {
                console.log("error retrieving previous page", error)
            })
        }
    }


    return <>
        <div className="chat-wrapper d-flex flex-column">
            <a className="btn btn-success mt-3 text-white" onClick={toggle}>
                {`Chat with the ${user.type === 'shelter' ? 'applicant' : 'shelter'}`}
            </a>
            {open && 
                <>
                <div className='reviewsBackSplash' onClick={()=>setOpen(false)}></div>
                <div className='messageContainerContainer'>
                    <div className='messageContainer'>
                        <div className='closebtn' onClick={()=>setOpen(false)}>
                            Close
                        </div>
                        <div className="chatbox-wrapper d-flex flex-column card card-body" ref={chatboxRef}>
                        {
                            formatted_messages.reverse().map((message, index) => {
                                let styling ="user-styling rounded-2"
                                let alignment = "text-right"
                                if(!message.is_user){
                                    styling = "recipiant-styling rounded-2"
                                    alignment = "text-left"
                                }
                                return<>
                                <div className={alignment}>
                                    <div className={styling} key={index}>
                                        <p>{message.content}</p>
                                    </div>
                                </div>
                                </>
                            })
                        }
                        </div>
                        <div className='pagination-button-container'>
                            {nextPageUrl && <button onClick={next_page}>previous messages {'<'}</button>}
                            {previousPageUrl && <button onClick={previous_page}>recent messages{'>'}</button>}
                        </div>
                        <form className="card-footer rounded pt-3 d-flex flex-row" style={{gap:10, alignItems:'center'}} method="post" onSubmit={handle_user_message}>
                            <input type="text" id='message_input' class="message-field rounded" placeholder="Type something..." onInput={handle_user_input}/>
                            <button className="btn btn-success rounded-circle textSend" type="submit">
                                {'>'}
                            </button>
                        </form>
                    </div>
                </div>
                </>
            } 
        </div>
        

        
    </>
}


export default ApplicationComments;