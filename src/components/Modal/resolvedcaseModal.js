import React from 'react';
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


const resolvedCases = [];
const array =[];
function getResolvedCases(){
  axios
  .get("http://bchserver.herokuapp.com/api/v1/faultresolved10") //only take last 10 of resolved cases. the rest can view at analytics
  .then((response) => {
    try{
    resolvedCases.push(response.data)
    array.push(Object.values(resolvedCases[0]))
    array[0].sort((a, b) => a - b).reverse()
    //console.log(array[0]);
    }
    catch(error){
      console.log(error);
    }
})
}
getResolvedCases();

const storeOptions = [];
function getStoreOptions(){
  axios
  .get("http://bchserver.herokuapp.com/api/v1/allstorename")
  .then((response) => {
    response.data.forEach(storeName => {
      var object = {value: storeName, label: storeName}
      storeOptions.push(object)
  });
 //console.log(storeOptions);
})
  .catch((err) => {
    console.log(err);
  });
}
getStoreOptions();


export default function ResolvedcaseModal(props){
  //To filter the table data using dropdown value
  const [search, setSearch] = useState('')
  const filterArray = array[0].filter(item=>{
    return item.storeName.toLowerCase().includes(search.toLowerCase())
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
          Resolved Issues
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
          onChange={ e => setSearch(e.value) }
        />
      </Fragment>
      <Table
              tableHeaderColor="primary"
              tableHead={["Reported on", "Fault type", "Store Location", ""]}
              tableData={
                filterArray.map((array) => {
                  return [array.dateTime,array.problem.category,array.storeName,<Button onClick={event =>  window.location.href='/resolvedcases/view/'+array.uuid} fullWidth color="info">View</Button>]
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

//<Button onClick={event =>  window.location.href='/newcases/solve'} fullWidth color="info">Solve</Button>