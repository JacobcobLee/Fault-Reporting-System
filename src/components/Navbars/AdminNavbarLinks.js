import React from "react";
import { auth } from '../../Firebase';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";



const useStyles = makeStyles(styles);
var user2 = "sample text";

//this function will get the email the user entered from the local storage
function userName() {
  if (localStorage.getItem('user')) {
    user2 = localStorage.getItem('user');// this sets the local var with the one in the local storage
    // console.log(user2); //display the the username to check in the console 
  }
}

export default function AdminNavbarLinks() {
  userName();
  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  // eslint-disable-next-line
  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);   
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  // eslint-disable-next-line
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  // eslint-disable-next-line
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  // eslint-disable-next-line
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  return (
    <div className={classes.typo}>
      <h6><b>Welcome, {user2}</b></h6>
      <div style={{ float: 'right' }}>
        <button className="btn btn-danger" onClick={() => { auth.signOut(); }}>Sign out</button>
      </div>
      <div style={{ clear: 'both' }}></div>
    </div>
  );

}
