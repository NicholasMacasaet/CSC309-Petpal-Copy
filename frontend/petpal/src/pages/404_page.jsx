import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../common/styles.css'; // Make sure to create this CSS file

const NotFoundPage = () => {
  return (
    <div className="page-container">
    <div className="not-found-page d-flex align-items-center justify-content-center text-center">
      <div>
        <h1 className="display-1 font-weight-bold" style={{color:'black'}}>404</h1>
        <p className="lead">Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="btn btn-primary" style={{background:'rgba(5, 150, 105, 1)'}}>Go Home</a>
      </div>
    </div>
    </div>
  );
}

export default NotFoundPage;