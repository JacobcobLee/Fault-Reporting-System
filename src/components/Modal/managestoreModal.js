import React, { useEffect } from 'react';
import {useState} from 'react';
import Button from "components/CustomButtons/Button.js";
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Table from "components/Table/Table.js";
import axios from 'axios';
import { ContactSupportOutlined } from '@material-ui/icons';
import { array } from 'prop-types';



export default function ManagestoreModal(props){
  const [stores, setStores] = useState([]);
  const [filteredArray, setFilteredArray] = useState([])

  useEffect(()=>{
    axios
    .get("https://bchfrserver.herokuapp.com/api/v1/allstore")
    .then((response) => {
      setStores(response.data)
      setFilteredArray(response.data)
    })
  },[])

  function deleteStore(storeCode){
    let answer = window.confirm("Are you sure you want to delete?");

    if(answer){
      axios
     .delete("https://bchfrserver.herokuapp.com/api/v1/store/" + storeCode)
     .then(function(){ window.location.reload() })
     .catch((err)=>{console.log("inside delete store function wtf si the error : " + err)})
     
    }
    else{
        window.close();
        console.log("failed")
    } 
  }

  function searchFunction(e){
    setFilteredArray(stores.filter(function(item){
      return Object.values(item).some( val => String(val).toLowerCase().includes(e.toLowerCase()) )
    }))
  }
  
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      keyboard={false}
    >
      <ModalHeader closeButton >
        <ModalTitle id="contained-modal-title-vcenter">
          Manage Stores
          &nbsp;&nbsp;&nbsp;
          <Button onClick={event =>  window.location.href='/store/addstore'}  color="info">Add</Button>
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <input className="form-control" type="text" placeholder="Search" onChange={ e => searchFunction(e.target.value)}/>
        <Button color="success"  onClick={e => searchFunction("")}>Reset Filter</Button>
      <Table
              tableHeaderColor="primary"
              tableHead={["Store Name", "Store Code", "Store Address", "", ""]}
              tableData={
                filteredArray.map((array) => {
                  return [array.name,array.code,array.address,<Button onClick={event =>  window.location.href='/store/editstore/'+array.code} fullWidth color="info">Edit</Button>, <Button onClick={() => deleteStore(array.code)} fullWidth color="danger">Remove</Button>]
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

