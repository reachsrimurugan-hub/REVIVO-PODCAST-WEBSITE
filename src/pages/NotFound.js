import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 text-center">
      <div className="display-1">404</div>
      <p className="lead">Oops! The page you're looking for has tuned out.</p>
      <div className="my-4">
        <i className="fa-solid fa-headphones fa-3x text-primary"></i>
      </div>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
};

export default NotFound;