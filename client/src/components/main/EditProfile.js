import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { getUser, updateUser, clearStatus } from "../../actions/authActions";
import {
  AddAPhoto,
  ChevronLeft,
  AccountCircle,
  Phone,
  Email,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { CircularProgress, Button } from "@material-ui/core";
import emailValidator from "email-validator";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { checkImageType, isObjId } from "../../functions/otherFunctions";
import Chip from "@material-ui/core/Chip";

const EditProfile = ({
  auth: { user, loader3, status },
  getUser,
  updateUser,
  clearStatus,
}) => {
  useEffect(() => {
    clearStatus();
    getUser();
    // eslint-disable-next-line
  }, []);

  const [values, setValues] = useState({
    username: "",
    bio: "",
    email: "",
    password: "",
    phone: "",
    showPassword: false,
  });
  const [validate, setValidate] = useState(null);
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const handleChange = (prop) => (event) => {
    // setValidate(null);
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const selectAv = () => {
    const file = document.getElementById("file");
    file.click();
  };

  useEffect(() => {
    if (user) {
      const { username, bio, github, google, password, phone, email } = user;

      if (google && google.email) {
        setValues({
          ...values,
          email: google.email ? google.email : "",
          username,
          bio,
          phone,
        });
      } else if (github && github.email) {
        setValues({
          ...values,
          email: github.email ? github.email : "",
          username,
          bio,
          phone,
        });
      } else {
        setValues({
          ...values,
          username,
          bio,
          phone,
          email: email ? email : "",
        });
      }
    } // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (status) {
      setOpen(true);
    } // eslint-disable-next-line
  }, [status]);

  const save = () => {
    if (!user.type) {
      //validation
      if (values.username.trim() === "") {
        setValidate({ type: 1, msg: "Username is required" });
      } else if (!emailValidator.validate(values.email)) {
        setValidate({ type: 2, msg: "Invalid Email" });
      } else if (
        values.password.trim() !== "" &&
        values.password.trim().length < 6
      ) {
        setValidate({ type: 3, msg: "Minimum passqord length is 6" });
      } else {
        let formData = new FormData();
        if (avatar) {
          formData.append("avatar", avatar);
        }
        formData.append("data", JSON.stringify(values));
        setValidate(null);
        if (avatar) {
          if (checkImageType(avatar.type)) {
            updateUser(formData);
            setAvatar(null);
          }
        } else {
          updateUser(formData);
        }
      }
    } else if (user.type === "github" || user.type === "google") {
      if (values.username.trim() === "") {
        setValidate({ type: 1, msg: "Username is required" });
      } else if (
        values.email.trim() !== "" &&
        !emailValidator.validate(values.email)
      ) {
        setValidate({ type: 2, msg: "Invalid Email" });
      } else {
        let formData = new FormData();
        if (avatar) {
          formData.append("avatar", avatar);
        }
        formData.append(
          "data",
          JSON.stringify({
            ...values,
            password: null,
            email: values.email.trim() === "" ? null : values.email,
            type: user.type,
          })
        );
        setValidate(null);
        if (avatar) {
          if (checkImageType(avatar.type)) {
            updateUser(formData);
            setAvatar(null);
          } else {
          }
        } else {
          updateUser(formData);
        }
        setValidate(null);
      }
    }
  };

  return (
    <Fragment>
      {status && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            {status && status.msg}
          </Alert>
        </Snackbar>
      )}
      {!user ? (
        <div className="loaderPosition">
          <CircularProgress />
        </div>
      ) : (
        <div className="editProfile">
          <div className="container2">
            <Link to="/" className="back">
              <ChevronLeft /> Back
            </Link>
            <div className="cover">
              <form action="">
                <input
                  type="file"
                  id="file"
                  name="avatar"
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
                <p className="header">Change Info</p>
                <small>Changes will be reflected to every services</small>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={selectAv}
                >
                  <div
                    className="image"
                    style={{
                      backgroundImage: `url(${
                        isObjId(user.avatar)
                          ? "/api/user/avatar/" + user.avatar
                          : user.avatar
                      })`,
                    }}
                  >
                    <div className="overlay"></div>
                    <div className="center">
                      <AddAPhoto />
                    </div>
                  </div>
                  <span className="right">CHANGE PHOTO</span>
                </div>
                <div className="container3">
                  {avatar && (
                    <div className="newAv">
                      <Chip
                        label="New Avatar:"
                        style={{ marginRight: "10px" }}
                      />
                      <Chip label={avatar.name} />
                    </div>
                  )}
                  <TextField
                    label="Name"
                    type="text"
                    variant="outlined"
                    value={values.username}
                    onChange={handleChange("username")}
                    fullWidth
                    required
                    error={validate && validate.type === 1 ? true : false}
                    helperText={
                      validate && validate.type === 1 ? validate.msg : false
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <AccountCircle style={{ color: "#828282" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />
                  <div className="mb-1"></div>
                  <TextField
                    label="Bio"
                    onChange={handleChange("bio")}
                    value={values.bio}
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />
                  <br />
                  <div className="mb-1"></div>
                  <TextField
                    label="Phone"
                    type="text"
                    variant="outlined"
                    value={values.phone}
                    onChange={handleChange("phone")}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Phone style={{ color: "#828282" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />
                  <div className="mb-1"></div>
                  <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={values.email}
                    onChange={handleChange("email")}
                    error={validate && validate.type === 2 ? true : false}
                    helperText={
                      validate && validate.type === 2 ? validate.msg : false
                    }
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Email style={{ color: "#828282" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />
                  <div className="mb-1"></div>
                  <TextField
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    label="Password"
                    variant="outlined"
                    fullWidth
                    disabled={user.type ? true : false}
                    error={validate && validate.type === 3 ? true : false}
                    helperText={
                      validate && validate.type === 3 ? validate.msg : false
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />
                  <div className="mb-1"></div>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ color: "#fff" }}
                    onClick={save}
                  >
                    {loader3 ? (
                      <CircularProgress size={25} color="inherit" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, { getUser, updateUser, clearStatus })(
  EditProfile
);
