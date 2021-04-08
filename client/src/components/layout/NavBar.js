import React, { useState } from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/authActions";
import { isObjId } from "../../functions/otherFunctions";
import {
  ArrowDropDown,
  AccountCircle,
  Group,
  ExitToApp,
} from "@material-ui/icons";
import logo from "../../images/logo.svg";

const NavBar = ({ user, logout }) => {
  const [menu, setMenu] = useState(false);
  return (
    <nav>
      <div className="container1">
        <div className="spaceOut">
          <img src={logo} alt="" />

          <div className="menu" onClick={() => setMenu(!menu)}>
            {user ? (
              <div className="spaceOut">
                <img
                  src={
                    isObjId(user.avatar)
                      ? "/api/user/avatar/" + user.avatar
                      : user.avatar
                  }
                  alt=""
                />
                <p style={{ display: "flex", alignItems: "center" }}>
                  {user.username} <ArrowDropDown />{" "}
                </p>
              </div>
            ) : null}
            {menu && (
              <ul className="dropDown">
                <li>
                  <AccountCircle /> <p>Profile</p>
                </li>
                <li>
                  <Group />
                  <p>Group Chat</p>
                </li>
                <hr />
                <li onClick={() => logout()}>
                  <ExitToApp />
                  <p>Logout</p>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({ user: state.auth.user });

export default connect(mapStateToProps, { logout })(NavBar);
