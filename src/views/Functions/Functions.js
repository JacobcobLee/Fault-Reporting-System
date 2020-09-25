import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import CardIcon from "components/Card/CardIcon.js";
import CropFree from "@material-ui/icons/CropFree";
import Store from "@material-ui/icons/Store";
import ReportProblem from "@material-ui/icons/ReportProblem";
import SupervisorAccount from "@material-ui/icons/SupervisorAccount";
import ManageQrModal from "components/Modal/manageqrModal.js";
import ManageStoreModal from "components/Modal/managestoreModal.js";
import ManageFaultModal from "components/Modal/managefaultModal.js";
import ManageAccountModal from "components/Modal/manageaccountModal.js";
import { auth, db } from '../../Firebase';
import { useState } from 'react';


import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";


const useStyles = makeStyles(styles);


export default function Functions() {
  const classes = useStyles();
  const [role, setRole] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [modalShow3, setModalShow3] = React.useState(false);
  const [modalShow4, setModalShow4] = React.useState(false);


  function test() {
    auth.onAuthStateChanged(function (user) {
      db.ref('users/' + user.uid).on('value', snapshot => {
        let data = snapshot.val();
        console.log(data.role);
        setRole(data.role);
      })
    })
  }
  test();

  function displayAccountModal() {
    if (role === "Admin") {
      return (
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <SupervisorAccount />
              </CardIcon>
              <p className={classes.cardCategory}>Manage Accounts</p>
              <h5 className={classes.cardTitle}>View/Create Accounts</h5>
            </CardHeader>
            <CardBody>
              <Button onClick={() => setModalShow4(true)} fullWidth color="success">View</Button>
              <ManageAccountModal
                show={modalShow4}
                onHide={() => setModalShow4(false)}
              />
            </CardBody>
          </Card>
        </GridItem>
      )
    }
    else
    {

    }
  }


  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={4}>
        <Card>
          <CardHeader color="info" stats icon>
            <CardIcon color="info">
              <CropFree />
            </CardIcon>
            <p className={classes.cardCategory}>Manage QR Codes</p>
            <h5 className={classes.cardTitle}>Edit QR here!</h5>
          </CardHeader>
          <CardBody>
            <Button onClick={() => setModalShow(true)} fullWidth color="success">View</Button>
            <ManageQrModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
        <Card>
          <CardHeader color="warning" stats icon>
            <CardIcon color="warning">
              <Store />
            </CardIcon>
            <p className={classes.cardCategory}>Manage Stores</p>
            <h5 className={classes.cardTitle}>Add/Remove/Edit Stores here!</h5>
          </CardHeader>
          <CardBody>
            <Button onClick={() => setModalShow2(true)} fullWidth color="success">View</Button>
            <ManageStoreModal
              show={modalShow2}
              onHide={() => setModalShow2(false)}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
        <Card>
          <CardHeader color="danger" stats icon>
            <CardIcon color="danger">
              <ReportProblem />
            </CardIcon>
            <p className={classes.cardCategory}>Manage Faults</p>
            <h5 className={classes.cardTitle}>Add/Remove/Edit Faults here!</h5>
          </CardHeader>
          <CardBody>
            <Button onClick={() => setModalShow3(true)} fullWidth color="success">View</Button>
            <ManageFaultModal
              show={modalShow3}
              onHide={() => setModalShow3(false)}
            />
          </CardBody>
        </Card>
      </GridItem>
      {displayAccountModal()}
    </GridContainer>
  );
}
