import React, { useEffect } from 'react';
import { useState } from 'react';
import Button from "components/CustomButtons/Button.js";
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Table from "components/Table/Table.js";
import axios from 'axios';

export default function ManageqrModal(props) {
  const [qr, setQr] = useState([]);
  const [filterArray, setFilterArray] = useState([]);

  useEffect(() => {
    axios
      .get("https://bchfrserver.herokuapp.com/api/v1/allstore")
      .then((response) => {
        setQr(response.data)
        setFilterArray(response.data)
      })
  }, [])

  function searchFunction(e) {
    setFilterArray(qr.filter(function (item) {
      return Object.values(item).some(val =>
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
        <input className="form-control" type="text" placeholder="Search" onChange={e => searchFunction(e.value)} />
        <Button color="success" onClick={e => searchFunction(" ")}>Reset Filter</Button>
        <Table
          tableHeaderColor="primary"
          tableHead={["Store Name", "Store Code", "QR String", ""]}
          tableData={
            filterArray.map((array) => {
              return [array.name, array.code, array.qrstring, <Button onClick={event => window.location.href = '/qr/editqrcode/' + array.code} fullWidth color="info">Edit</Button>]
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