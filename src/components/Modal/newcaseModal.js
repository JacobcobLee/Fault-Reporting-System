import React, { useEffect } from 'react';
import { Fragment} from 'react';
import {useState} from 'react';
import Select from 'react-select';
import Button from "components/CustomButtons/Button.js";
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Table from "components/Table/Table.js";
import axios from 'axios';

export default function NewcaseModal(props){
  const [newCases, setNewCases] = useState([])
  const [storeOptions, setStoreOptions] = useState([]);
  const [filterArray, setFilterArray] = useState([]);

  
  useEffect(()=>{
    let temp = [];
    axios
    .get("https://bchfrserver.herokuapp.com/api/v1/faultunresolved")
    .then((response) => {
      temp = Object.values(response.data)
      setNewCases(temp)
      setFilterArray(temp.sort((a, b) => a - b).reverse())
    }).catch((error)=>{
          console.log("error in newCase modal use effect 1, error is:  "+error);
        })
  }, [])
  
  useEffect(()=>{
    axios
    .get("https://bchfrserver.herokuapp.com/api/v1/allstorename")
    .then((response) => {
      response.data.forEach(storeName => {
        var object = {value: storeName, label: storeName}
        setStoreOptions(object)
      });
    }).catch((err) => {
      console.log("error in newCase modal use effect 2, error is:  "+err);
    });
  },[])


  //To filter the table data using dropdown value
  function filterSearch(e){
    var temp = newCases.filter((item)=>{
      return item.storeName.toLowerCase().includes(e.toLowerCase())
    })
    setFilterArray(temp)
  };
 
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
          Unresolved Issues
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
      <Fragment>
        <h2><b>Search by store location</b></h2>
        <input className="form-control" type="text" placeholder="Search" onChange={e => filterSearch(e.target.value)}/>
    <Button color="success" onClick={e => filterSearch("")}>Reset Filter</Button>
      </Fragment>
      <Table
              tableHeaderColor="primary"
              tableHead={["Reported on", "Fault type", "Store Location", ""]}
              tableData={
                filterArray.map((array) => {
                  return [array.dateTime,array.problem.category,array.storeName,<Button onClick={event =>  window.location.href='/newcases/solve/'+array.uuid} fullWidth color="info">Solve</Button>]
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
