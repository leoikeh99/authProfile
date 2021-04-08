import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getUser } from "../../actions/authActions";
import { Link } from "react-router-dom";
import { isObjId } from "../../functions/otherFunctions";
import CircularProgress from "@material-ui/core/CircularProgress";

const Profile = ({ getUser, auth: { user } }) => {
  useEffect(() => {
    getUser();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="profile">
      <div className="container2">
        {!user ? (
          <div className="loaderPosition">
            <CircularProgress />
          </div>
        ) : (
          <div>
            <h1>Personal info</h1>
            <p>Basic info, like your name and photo</p>

            <ul>
              <li>
                <div className="top">
                  <p>Profile</p>
                  <small>Some info may be visible to other people</small>
                </div>
                <Link to="/editProfile" className="editBtn">
                  Edit
                </Link>
              </li>
              <li>
                <p>PHOTO</p>
                {user.avatar ? (
                  <img
                    src={
                      isObjId(user.avatar)
                        ? "http://localhost:5000/api/user/avatar/" + user.avatar
                        : user.avatar
                    }
                    alt=""
                  />
                ) : (
                  <p>none</p>
                )}
              </li>
              <li>
                <p>NAME</p>
                <p>{user.username}</p>
              </li>
              <li>
                <p>BIO</p>
                <p>{user.bio === "" ? "none" : user.bio}</p>
              </li>
              <li>
                <p>PHONE</p>
                <p>{user.phone === "" ? "none" : user.phone}</p>
              </li>
              <li>
                <p>EMAIL</p>
                {!user.type ? (
                  <p>{user.email}</p>
                ) : user.google ? (
                  <p>{user.google.email ? user.google.email : "none"}</p>
                ) : user.github ? (
                  <p>{user.github.email ? user.github.email : "none"}</p>
                ) : (
                  <p>none</p>
                )}
              </li>
              <li>
                <p>PASSWORD</p>
                <p>{!user.type ? "********" : "none"}</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, { getUser })(Profile);
