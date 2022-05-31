import { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const { token } = useContext(AuthContext);
  const history = useHistory();
  const newPassword = useRef();
  const submitHandler = (e) => {
    e.preventDefault();
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAUSInGCstGKf1hFeOOLrKC-Lrc2tkYc-Q";
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        idToken: token,
        password: newPassword.current.value,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        console.log(res.json());
        history.replace("/");
      })
      .catch((err) => console.log(err));
  };
  return (
    <form className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input ref={newPassword} type="password" id="new-password" />
      </div>
      <div className={classes.action}>
        <button onClick={submitHandler}>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
