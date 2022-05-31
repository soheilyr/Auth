import { useState, useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";
import { useHistory } from "react-router-dom";
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const emailValue = useRef();
  const passValue = useRef();
  const authCTX = useContext(AuthContext);
  const history = useHistory();
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const submitHandler = (e) => {
    console.log(emailValue);
    console.log(passValue);
    e.preventDefault();
    setLoading(true);
    let url = "";
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAUSInGCstGKf1hFeOOLrKC-Lrc2tkYc-Q";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAUSInGCstGKf1hFeOOLrKC-Lrc2tkYc-Q";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: emailValue.current.value,
        password: passValue.current.value,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      setLoading(false);
      if (res.ok) {
        res.json().then((data) => {
          console.log(data);
          const expirationTime = new Date(
            new Date().getTime() + +data.expiresIn * 1000
          );
          console.log(expirationTime);
          authCTX.logIn(data.idToken, expirationTime);
        });
        history.replace("/");
      } else {
        //handle the err
        res.json().then((data) => {
          let errMessage = "sign up / login failed";
          if (data.error && data.error.message) {
            errMessage = data.error.message;
          }
          alert(errMessage);
        });
      }
    });
  };
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailValue} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input ref={passValue} type="password" id="password" required />
        </div>
        <div className={classes.actions}>
          {!loading && (
            <button disabled={loading}>
              {isLogin ? "Login" : "Create Account"}
            </button>
          )}
          {loading && <p>Loading ... </p>}

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
