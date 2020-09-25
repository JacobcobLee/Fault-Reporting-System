import React from 'react';
import Select from 'react-select';
import { useState } from 'react';
import Button from "components/CustomButtons/Button.js";
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Table from "components/Table/Table.js";
import axios from 'axios';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from 'components/Card/CardFooter';
import { auth, db } from '../../Firebase';

const userOptions = [{ value: "Member", label: "Member" }, { value: "Admin", label: "Admin" }]
const users = [];
const array = [];
function getUsers() {

  axios
    .get("https://bchserver.herokuapp.com/api/v1/allusers")
    .then((response) => {
      users.push(response.data)
      array.push(users[0])
    })
}
getUsers();



export default function ManageaccountModal(props) {

  const [registeremail, setRegisterEmail] = useState("");
  const [registerpassword, setRegisterPassword] = useState("");
  const [registerconfirmpassword, setRegisterConfirmPassword] = useState("");
  const [roleofuser, setRoleOfUser] = useState("Member");
  const [role,setRole] = useState("");

  function createAccount() {
    if (registeremail !== "" && registerpassword !== "" && registerconfirmpassword !== "") {
      if (registerpassword === registerconfirmpassword) {
        var result = auth.createUserWithEmailAndPassword(registeremail, registerpassword).then(cred => {
          return db.ref('/users/' + cred.user.uid).set({
            email: cred.user.email,
            role: roleofuser,
            uid: cred.user.uid
          })
        })
        result.then(function () {
          window.location.href = "/"
        })
        result.catch(function (error) {
          var errorCode = error.code;
          var errorMsg = error.message;

          console.log(errorCode + errorMsg);
          window.alert("Message: " + errorMsg)

        });
      }
      else {
        window.alert("Password and Confirm Password do not match.")
      }
    }
    else {
      window.alert("Please fill out all fields!")
    }
  }

  function test() {
    auth.onAuthStateChanged(function (user) {
      db.ref('users/'+user.uid).on('value', snapshot => {
        let data = snapshot.val();
        console.log(data.role);
        setRole(data.role);
      })
    })
  }
  test();

  function addAccount() {
    if(role==="Admin"){
      return (
        <div>
          <Card>
            <CardHeader>
              <h6>Add a new account</h6>
            </CardHeader>
            <CardBody>
              <input className="form-control" type="text" required="true" placeholder="Email" onChange={e => setRegisterEmail(e.target.value)} />
              <br></br>
              <input className="form-control" type="password" required="true" placeholder="Password" onChange={e => setRegisterPassword(e.target.value)} />
              <br></br>
              <input className="form-control" type="password" required="true" placeholder="Confirm Password" onChange={e => setRegisterConfirmPassword(e.target.value)} />
              <br></br>
              <Select
                defaultValue={{ value: "Member", label: "Member" }}
                className="basic-single"
                classNamePrefix="select"
                name="color"
                options={userOptions}
                onChange={e => setRoleOfUser(e.value)}
              />
              <br></br>
            </CardBody>
            <CardFooter>
              <Button onClick={createAccount} fullWidth="true" color="info">Create</Button>
            </CardFooter>
          </Card>
        </div>
      )
    }
    else{
    }
  }

  const [search, setSearch] = useState('')

  //filter through all data instead of only 1
  const filterArray = users[0].filter(function (item) {
    return Object.values(item).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  })
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      keyboard={false}
    >
      <ModalHeader closeButton >
        <ModalTitle id="contained-modal-title-vcenter">
          View Accounts
          &nbsp;&nbsp;&nbsp;
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        {addAccount()}
        <br></br>
        <input className="form-control" type="text" placeholder="Search" onChange={e => setSearch(e.target.value)} />
        <Table
          tableHeaderColor="primary"
          tableHead={["Account ID", "Account Email", "Last login"]}
          tableData={
            filterArray.map((array) => {
              return [array.uid, array.email, array.metadata.lastSignInTime]
            })
          }
        />
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={props.onHide}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}


