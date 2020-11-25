import React, { useEffect } from 'react';
import Button from "components/CustomButtons/Button.js";
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Table from "components/Table/Table.js";
import axios from 'axios';
import {useState} from 'react';

export default function ManagefaultModal(props){
  const [fault, setFault] = useState([]);
  const [filteredArray, setFilteredArray] = useState([])

  useEffect(()=>{
    axios
    .get("http://localhost:9998/api/v1/category")
    .then((response) => {
      setFault(response.data)
      setFilteredArray(response.data)
      // console.log(fault + "this is fault")
      // console.log(response.data );
  })
  }, [])

  function searchFunction(e) {
    var temp = fault.filter((item)=>{
      return item.name.toLowerCase().includes(e.toLowerCase())
    })
    setFilteredArray(temp)
  };

  function deleteFault(faultid){
    var answer = window.confirm("Are you sure you want to delete?");
    if(answer){
      axios
      .delete("http://localhost:9998/api/v1/category/" + faultid)
      window.location.href = "/admin/functions"
    }
    else{
      window.close();
    } 
  };

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
          Manage Faults
          &nbsp;&nbsp;&nbsp;
          <Button onClick={event =>  window.location.href='/fault/addfault'} color="info">Add</Button>
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
      <input className="form-control" type="text" placeholder="Search" onChange={e => searchFunction(e.target.value)}/>
      <Button color="success" onClick={e => searchFunction("")}>Reset Filter</Button>
      <Table
              tableHeaderColor="primary"
              tableHead={["Fault type", "Has Radio Option?", "Has Checkbox Option?", "", ""]}
              tableData={
                filteredArray.map((array) => {
                  return [array.name,array.haveRadio,array.haveCheck,
                  <Button onClick={event =>  window.location.href='/fault/editfault/'+array.uuid} fullWidth color="info">Edit</Button>,
                  <Button onClick={() => deleteFault(array.uuid)} fullWidth color="danger">Remove</Button>]
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

