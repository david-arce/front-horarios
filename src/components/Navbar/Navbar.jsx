import React from 'react';
import LogoutButton from '../../components/Auth/LogoutButton';
import './NavBar.css';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar__spacer" />
      <div className="navbar__logout">
        <LogoutButton />
      </div>
    </nav>
  );
}