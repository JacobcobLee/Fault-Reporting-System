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



export default function PendingcaseModal(props){
  const [pendingCases, setpendingCases] = useState([])
  const [storeOptions, setStoreOptions] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  //To filter the table data using dropdown value
  useEffect(()=>{
    let temp = [];
    axios
    .get("https://bchfrserver.herokuapp.com/api/v1/faultp")
    .then((response) => {
      temp = Object.values(response.data);
      setpendingCases(temp);
      setFilterArray(temp.sort((a, b) => a - b).reverse());
      }).catch((e)=>{console.log("err is in pending case modal, err is : " + e)})
  },[])
 
  useEffect(()=>{
    axios
    .get("https://bchfrserver.herokuapp.com/api/v1/allstorename")
    .then((response) => {
      response.data.forEach(storeName => {
        var object = {value: storeName, label: storeName}
        setStoreOptions(object)
      });
    })
    .catch((err) => {
      console.log(err);
    });
  },[])

  //To filter the table data using dropdown value
  function filterSearch(e){
    setFilterArray(
      pendingCases.filter(item=>{
        return item.storeName.toLowerCase().includes(e.toLowerCase())
      })
    )
  }
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
          Pending Issues
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
      <Fragment>
        <p><b>Store Location</b></p>
        <Select
          className="basic-single"
          classNamePrefix="select"
          name="color"
          options={storeOptions}
          onChange={ e => filterSearch(e.target.value) }
        />
        <Button color="success" onClick={e => filterSearch(e.target.value = "")}>Reset Filter</Button>
      </Fragment>
      <Table
              tableHeaderColor="primary"
              tableHead={["Reported on", "Fault type", "Store Location", ""]}
              tableData={
                filterArray.map((array) => {
                  return [array.dateTime,array.problem.category,array.storeName,<Button onClick={event =>  window.location.href='/pending/view/'+array.uuid} fullWidth color="info">View</Button>]
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

//<Button onClick={event =>  window.location.href='/newcases/solve'} fullWidth color="info">Solve</Button>