import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthHeader() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    SQA Shopping
                </Link>
                <div className="navbar-nav ms-auto">
                    <Link className="nav-link" to="/">Login</Link>
                    <Link className="nav-link" to="/adduser">Sign Up</Link>
                </div>
            </div>
        </nav>
    );
}