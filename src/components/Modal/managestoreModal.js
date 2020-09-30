import React from 'react';
import {useState} from 'react';
import Button from "components/CustomButtons/Button.js";
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Table from "components/Table/Table.js";
import axios from 'axios';


const stores = [];
const array = [];
function getStores(){
  axios
  .get("https://bchfrserver.herokuapp.com/api/v1/store")
  .then((response) => {
    //console.log(response.data);
      stores.push(response.data)
      array.push(stores[0])
      //console.log(array);
  })
}
  
getStores();



export default function ManagestoreModal(props){
  function deleteStore(storeCode){
    var answer = window.confirm("Are you sure you want to delete?");
    if(answer){
      axios
     .delete("https://bchfrserver.herokuapp.com/api/v1/store/" + storeCode)
     window.location.href = "/admin/functions"
    }
    else{
        window.close();
    } 
  }

  const [search, setSearch] = useState('')
  // const filterArray = stores[0].filter(item=>{
  //   return item.code.toLowerCase().includes(search.toLowerCase())
  // })
  
  //filter through all data instead of only 1
   const filterArray = stores[0].filter(function(item){
    return Object.values(item).some( val => 
        String(val).toLowerCase().includes(search.toLowerCase()) 
    )
})
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
      <input className="form-control" type="text" placeholder="Search" onChange={ e => setSearch(e.target.value)}/>
      <Table
              tableHeaderColor="primary"
              tableHead={["Store Name", "Store Code", "Store Address", "", ""]}
              tableData={
                filterArray.map((array) => {
                  return [array.name,array.code,array.address,
                  <Button onClick={event =>  window.location.href='/store/editstore/'+array.code} fullWidth color="info">Edit</Button>, 
                  <Button onClick={() => deleteStore(array.code)} fullWidth color="danger">Remove</Button>]
              })
            }
            />
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={e => setSearch(e.value = "")}>Reset Filter</Button>
        <Button color="danger" onClick={props.onHide}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}

