import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton'
import './Navigation.css';
import logo from '../../images/logo.png';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="header">
      <div className='nav-left'>
        <NavLink to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">-JAVacation-</span> 
        </NavLink>
      </div>
      <div className="menu-right">
        {sessionUser && (
          <NavLink to='/spots/new' className="create-spot-butn">
        Create a New Spot
        </NavLink>
        )}
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
    </nav>
  );
}

export default Navigation;