import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../common/styles.css';
import { useUserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Moderator() {
    const [reportedComments, setReportedComments] = useState([]);
    const [nextPage, setNextPage] = useState(false);
    const {user, isLoaded} = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoaded && user?.type != "moderator") {
            navigate('/404')
        }
    }, [user, isLoaded]);

    // use next and prev page to determine whether to show the buttons to navigate to the next and previous pages
    const [page, setPage] = useState(1);
    const bearerToken = localStorage.getItem('access_token');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchComment = async(comment_id) => {
        try {
            const res = await axios.get(
                `${BASE_URL}comments/specific_review/${comment_id}/`,
                {
                    headers: { Authorization: `Bearer ${bearerToken}`, }
                }
            );
            return res.data;
        } catch(e) {
            console.log(e);
        }
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}comments/report/all/?page=${page}`,
                {
                    headers: { Authorization: `Bearer ${bearerToken}`, }
                }
            );
            let newComments = []
            for (let comment of res.data.results) {
                console.log(comment)
                let fetchedComment = await fetchComment(comment.comment);
                let newComment = {...comment, content: fetchedComment.content}
                // console.log(newComment)
                newComments.push(newComment);
            }
            setReportedComments([...reportedComments, ...newComments]);
            console.log("reported comments",reportedComments)
            if(res.data.next) {
                setNextPage(true);
                setPage(page + 1)
            } else {
                setNextPage(false);
            }
            // console.log(res);
            // console.log(res.data);
            // console.log(res.data.next)
        } catch (e) {
            console.log(e);
        }
    };

    const loadMore = async () => {
        if (nextPage) {
            fetchData();
        }
    }
    
    const handleDelete = async (id) => {
     
        try{
            const response = await axios({
                method: 'delete',
                url: BASE_URL + 'comments/' + 'report/'+ 'deleted_report/'+ id + '/',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
                
            })
            console.log("deleted comment", id)
            alert("Comment successfully deleted")
            window.location.reload()
            // setReportedComments(reportedComments.filter((comment) => comment.comment != id))
        } catch (error) {
            console.log(error)
        }
        
    }
    const handleDismiss = async (id) => {
     
        try{
            const response = await axios({
                method: 'delete',
                url: BASE_URL + 'comments/'+ 'report/' + 'dissmissed_report/'+  id + '/',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
                
            })
            console.log("deleted comment", id)
            alert("Report dismissed")
            setReportedComments(reportedComments.filter((comment) => comment.id != id))
        }catch(error){
            console.log("error deleting comment", error)
        }
    }

    return (
     <div className="content-container">
     <div className="reported-comments-container mt-6" style={{marginTop: '200px'}}>
        <h1 className="mb-4">Hello, Admin!</h1>
      <p className="lead mb-4">
        Below is a list of comments that have been flagged for review. Please assess them for any inappropriate content.
      </p>
      <h1 className="mb-4">Reported Comments</h1>
        <div className="list-group">
        {reportedComments.length == 0 && <span>No reports founds</span>}
      {reportedComments.map(reportComment => (
        <div className="reported-comment-item list-group-item list-group-item-action flex-column align-items-start" key={reportComment.id}>
          <div className="d-flex w-100 justify-content-between">
            <p className="reported-comment-title">Reported Comment: {reportComment.comment}</p>
            <p className="reported-comment-title">Content: {reportComment.content}</p>
            <small className="reported-comment-date">{reportComment.date}</small>
            <p className="reported-comment-reason mb-1">reason for report: {reportComment.reason}</p>
          </div>
          <button className="btn btn-secondary mr-2" onClick={()=> handleDismiss(reportComment.id)}>Dismiss</button>
          <button className="btn btn-danger" onClick={()=> handleDelete(reportComment.id)}>Delete</button>
        </div>
      ))}
      </div>
      {nextPage ? 
      <button className="load-more-btn btn btn-success mt-3 mb-3" onClick={loadMore}>Load More</button> :
      <></>
    }
      
    </div>
    </div> 
    );      
}
