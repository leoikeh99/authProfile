import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getUser } from "../../actions/authActions";

const Home = ({ getUser, auth: { user, loader2 } }) => {
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div>
      {!user ? (
        <div>loading...</div>
      ) : (
        <div>Welcome {user && user.username}</div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, { getUser })(Home);
