import React, { useState, useEffect } from "react";
import logo from "../../images/logo.svg";
import Github from "../../images/Github.svg";
import Google from "../../images/Google.svg";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { connect } from "react-redux";
import { auth } from "../../actions/authActions";
import {
  Email,
  Visibility,
  VisibilityOff,
  AccountCircle,
  ExitToApp,
} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import { CircularProgress, Button } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import emailValidator from "email-validator";

const Register = ({ auth, error, loader }) => {
  const [validate, setValidate] = useState(null);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    email: "",
    username: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValidate(null);
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (error) {
      setOpen(true);
    } // eslint-disable-next-line
  }, [error]);

  const submit = () => {
    setValidate(null);
    if (values.username.trim() === "") {
      setValidate({ type: 1, msg: "Username is required" });
    } else {
      if (!emailValidator.validate(values.email)) {
        setValidate({ type: 2, msg: "Invalid email" });
      } else {
        if (values.password.length < 6) {
          setValidate({ type: 3, msg: "Min length: 6" });
        } else {
          const data = {
            email: values.email,
            username: values.username,
            password: values.password,
          };
          auth("register", data);
        }
      }
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="register">
      <img
        src={logo}
        alt=""
        style={{ width: "140px" }}
        className="firstImage"
      />
      <p
        style={{ fontSize: ".9rem", margin: "20px 30px 40px 0" }}
        className="top"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit quasi
        rerum, eos nobis optio minus aspernatur.
      </p>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {error && error.msg}
        </Alert>
      </Snackbar>

      <form action="">
        <TextField
          id="outlined-search"
          label="Username"
          type="text"
          variant="outlined"
          value={values.username}
          onChange={handleChange("username")}
          error={validate && validate.type === 1 ? true : false}
          helperText={validate && validate.type === 1 && validate.msg}
          fullWidth
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
          id="outlined-search"
          label="Email"
          type="email"
          variant="outlined"
          value={values.email}
          error={validate && validate.type === 2 ? true : false}
          helperText={validate && validate.type === 2 && validate.msg}
          onChange={handleChange("email")}
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
          id="outlined-adornment-password"
          type={values.showPassword ? "text" : "password"}
          value={values.password}
          error={validate && validate.type === 3 ? true : false}
          helperText={validate && validate.type === 3 && validate.msg}
          onChange={handleChange("password")}
          label="Password"
          variant="outlined"
          minLength={6}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
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
          disabled={loader}
          startIcon={
            !loader ? (
              <ExitToApp />
            ) : (
              <CircularProgress size={22} color="inherit" />
            )
          }
          fullWidth
          onClick={submit}
        >
          Sign-Up
        </Button>

        <p className="bottom" style={{ marginTop: "25px" }}>
          or continue with these social profile
        </p>
        <ul>
          <li>
            <a href="/api/auth/google">
              <img src={Google} alt="" />
            </a>
          </li>
          <li>
            <a href="/api/auth/github">
              <img src={Github} alt="" />
            </a>
          </li>
        </ul>
        <p className="bottom">
          Adready a member? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  error: state.auth.error,
  loader: state.auth.loader,
});

export default connect(mapStateToProps, { auth })(Register);
