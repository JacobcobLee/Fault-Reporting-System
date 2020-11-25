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
import { useAsync, Async  } from 'react-async';

export default function ManageqrModal(props){
  const [qr, setQr] = useState([]);
  const [filterArray, setFilterArray] = useState([]);

  useEffect(()=>{
    axios
    .get("http://localhost:9998/api/v1/allstore")
    .then((response) => {
      setQr(response.data)
      setFilterArray(response.data)
  })
  },[])

  function searchFunction(e) {
    setFilterArray(qr.filter(function(item){
        return Object.values(item).some( val => 
            String(val).toLowerCase().includes(e.toLowerCase())
    )
  }))
}
  
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
          Manage QR Codes
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
      <input className="form-control" type="text" placeholder="Search" onChange={ e => searchFunction(e.target.value)}/>
      <Button color="success" onClick={e => searchFunction("")}>Reset Filter</Button>
      <Table
              tableHeaderColor="primary"
              tableHead={["Store Name", "Store Code", "QR String", ""]}
              tableData={
                filterArray.map((array) => {
                  return [array.name,array.code,array.qrstring,<Button onClick={event =>  window.location.href='/qr/editqrcode/'+array.code} fullWidth color="info">Edit</Button>]
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

// import React, { useEffect } from 'react';
// import {useState} from 'react';
// import Button from "components/CustomButtons/Button.js";
// import Modal from 'react-bootstrap/Modal';
// import ModalHeader from 'react-bootstrap/ModalHeader';
// import ModalTitle from 'react-bootstrap/ModalTitle';
// import ModalBody from 'react-bootstrap/ModalBody';
// import ModalFooter from 'react-bootstrap/ModalFooter';
// import Table from "components/Table/Table.js";
// import axios from 'axios';
// import { get } from 'jquery';


// // const [qr, setQR] = useState([]);
// // const qr = [];

// // function getQR(){
// //   axios
// //   .get("http://localhost:9998/api/v1/allstore")
// //   .then((response) => {
// //     //console.log(response.data);
// //       qr.push(response.data)
// //       array.push(qr[0])
// //       //console.log(array);
// //   })
// // }
// // getQR();
// const array = [];
// const qr = []
// const [search, setSearch] = useState('')
// const [filterArray, setFilterArray ] = useState(array);

// function test(){
//   console.log("??")
//   //api call 
//   return "json"
// }




// function ManageqrModal(props){

//   // const [qr, setQR] = useState([{code: "", name: "Loading..please wait!", qrstring: ""}]);
//   //filter through all data instead of only 1
//   // useEffect(()=>{
//   //   axios
//   //   .get("http://localhost:9998/api/v1/allstore")
//   //   .then((response) => {
//   //     //console.log(response.data);
//   //       qr.push(response.data)
//   //       array.push(qr[0])
//   //       //console.log(array);
//   //   }).catch((e) => console.log("err in manageQRModal.js err is : " + e))
//   // }, [qr]);

//   const getQR = () => {
//     axios
//       .get("http://localhost:9998/api/v1/allstore")
//       .then((response) => {
//         //console.log(response.data);
//           qr.push(response.data)
//           array.push(qr[0])
          
//           console.log(array);//defined 52 obj
//       }).catch((e)=>{console.log("error is caught in manageqrmodal getqr function error is :" + e)})
//   }
//   getQR();
  
//   async function test(){

//     let promise = new Promise((resolve, reject)=>{
//       axios.get("http://localhost:9998/api/v1/allstore")
//       .then((response) => {
//         //console.log(response.data);
//           qr.push(response.data)
//           array.push(qr[0])
//           console.log(array);
//       }).catch((e)=>{console.log("error is caught in manageqrmodal getqr function error is :" + e)})
//     })

//     let res = await promise;

//   }

//   // const filterArray = [];
// // const [filterArray, setFilterArray ] = useState(array);
// console.log(filterArray)
// console.log(array)

// console.log(qr[0] + "inside THE JSX")
// //filter through all data instead of only 1
//  const filterArray = array.filter(function(item){
//   return Object.values(item).some( val => 
//       String(val).toLowerCase().includes(search.toLowerCase()) 
//   )
// })
  
//   // const test = () => {
    
//   //   qr[0].filter(function(item){
//   //     sampleArr = Object.values(item).some( val => 
//   //       String(val).toLowerCase().includes(search.toLowerCase()) 
//   //     )
//   //   })
//   //     return console.log("method okay")
//   // }
//   // const filterArray = test()

  
//   return (
//     <Modal
//       {...props}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//       keyboard={false}
//     >
//       <ModalHeader closeButton >
//         <ModalTitle id="contained-modal-title-vcenter">
//           Manage QR Codes
//         </ModalTitle>
//       </ModalHeader>
//       <ModalBody>
//       <input className="form-control" type="text" placeholder="Search" onChange={ e => setSearch(e.target.value)}/>
//       <Table
//               tableHeaderColor="primary"
//               tableHead={["Store Name", "Store Code", "QR String", ""]}
//               tableData={ 
//                 filterArray.map((array) => {
//                   return [array.name,array.code,array.qrstring,<Button onClick={event =>  window.location.href='/qr/editqrcode/'+array.code} fullWidth color="info">Edit</Button>]
//               })
//               }
//             />
//       </ModalBody>
//       <ModalFooter>
//         <Button color="success" onClick={e => setSearch(e.value = "")}>Reset Filter</Button>
//         <Button color="danger" onClick={props.onHide}>Close</Button>
//       </ModalFooter>
//     </Modal>
//   );
// }

// export default ManageqrModal