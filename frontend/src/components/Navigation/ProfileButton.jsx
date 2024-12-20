import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle, FaBars } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { NavLink, useNavigate } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); //Останавливаем всплытие события, чтобы предотвратить закрытие меню
    setShowMenu(!showMenu);
  };

  const closeMenu = () => setShowMenu(false);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenuOnOutsideClick = (e) => {
      if (!ulRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("click", closeMenuOnOutsideClick);
    return () => document.removeEventListener("click", closeMenuOnOutsideClick);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {/*Button profile*/}
      <button className="profile-button" onClick={toggleMenu}>
        <FaBars className="menu-icon" /> {/**icon menu*/}
        <FaUserCircle className="user-icon" /> {/**icon user*/}
      </button>
      {/**dropdown menu*/}
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.username} !</li> <li>{user.email}</li>
            {/**Maybe put Hello, {user.user}?? */}
            <li className="manage-link">
              <NavLink to="/spots/current" onClick={closeMenu}>
                {" "}
                Manage Spots
              </NavLink>
            </li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
