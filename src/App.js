import React, { useEffect, useState } from "react";
import Home from "./Pages/Home/Home";
import Header from "./components/Header/Header";
import { useLocation } from "react-router";
import { connect } from "react-redux";
import Loader from "./components/Loader/Loader";
import {AnimatePresence} from 'framer-motion'
import AuthView from "./Pages/AuthView/AuthView";
import StorageView from "./Pages/StorageView/StorageView";
import { Switch, Route, Redirect } from "react-router-dom";
import Home2 from "./Pages/Home/Home2";
import { auth, database, getUserWithId } from "./firebase/firebase.utils";
import { signinUser, signoutUser, setLoadingState } from "./actions";
import PrivateRoute from './PrivateRoute'
import RoomView from "./Room/RoomView";
import Room from "./Room/Room";
import MeetEnded from "./SecondaryPages/MeetEnded";

import { onAuthStateChanged } from "@firebase/auth";
import { doc, getDoc } from "@firebase/firestore";
const App = ({
  signinUser,
  signoutUser,
  authStatus,
  isActive,
}) => {
  const location= useLocation();
  const [loading, setLoading] = useState(true);
  useEffect(() => setLoading(true), [])
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      getUserWithId(uid).then((res) => {
        signinUser(res);
        setLoading(false)
        console.log("status updated to signedin ");

      });

    } else {
      signoutUser();
      setLoading(false)


      console.log("status updated to signedout ");
    }
  });
  if (loading) return <Loader text="Checking authentication" />


  return (
    <>
      {!isActive && <Header />}
      {
        <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.key}>
          <Route path="/" exact>
            <Home2/>
          </Route>
          <Route path="/authentication" exact>
          {!authStatus?<AuthView/>:<Redirect to="/"/>}
          </Route>
          <Route path="/Storage" exact>
            {authStatus ? <StorageView /> : <Redirect to="/authentication" />}
          </Route>
          <Route path="/room/:roomid" exact>
            {/* {authStatus?<RoomView/>:<Redirect to="/authentication"/>} */}
            <Room authStatus={authStatus}/>
          </Route>
          <Route path="/room/:roomid/ended" exact><MeetEnded /></Route>
        </Switch>
        </AnimatePresence>
      }
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isActive: state.isActive,
    authStatus: state.authStatus.isSignedin,

  };
};

export default connect(mapStateToProps, {
  signinUser,
  signoutUser,

})(App);
