import React from 'react';
import { Fragment } from 'react';
import Select from 'react-select';
import {useState} from 'react';
import Button from "components/CustomButtons/Button.js";
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Table from "components/Table/Table.js";
import axios from 'axios';

const qr = [];
const array = [];
function getQR(){
  axios
  .get("http://localhost:8080/api/v1/qrcodes")
  .then((response) => {
    //console.log(response.data);
      qr.push(response.data)
      array.push(qr[0])
      console.log(array);
  })
}
getQR();

export default function ManageqrModal(props){
  const [search, setSearch] = useState('')

  //filter through all data instead of only 1
   const filterArray = qr[0].filter(function(item){
    return Object.values(item).some( val => 
        String(val).toLowerCase().includes(search.toLowerCase()) 
    )
})
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader closeButton >
        <ModalTitle id="contained-modal-title-vcenter">
          Manage QR Codes
          &nbsp;&nbsp;&nbsp;
          <Button color="info">Add</Button>
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
      <input className="form-control" type="text" placeholder="Search" onChange={ e => setSearch(e.target.value)}/>
      <Table
              tableHeaderColor="primary"
              tableHead={["Store Name", "Store Code", "QR String", "", ""]}
              tableData={
                filterArray.map((array) => {
                  return [array.storename,array.storecode,array.qrstring,<Button onClick={event =>  window.location.href='/newcases/solve'} fullWidth color="info">Edit</Button>, <Button onClick={event =>  window.location.href='/newcases/solve'} fullWidth color="danger">Remove</Button>]
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

