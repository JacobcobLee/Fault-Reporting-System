import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
import faultimg from "assets/img/celling_aircon.jpg";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Button from "components/CustomButtons/Button.js";    
import axios from 'axios';
import { Fragment} from 'react';
import Select from 'react-select';
import pendingcaseModal from "components/Modal/pendingcaseModal";
import resolvedcaseModal from "components/Modal/resolvedcaseModal";
import {useState} from 'react';
import { Redirect } from "react-router-dom";

var pageURL = window.location.href;
var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);

const qr = [];
const array = [];
const temp=[];
function getSpecificQR(){
  axios
  .get("http://localhost:8080/api/v1/store/"+lastURLSegment)
  .then((response) => {
    //console.log(response.data);
      qr.push(response.data)
      array.push(qr[0])
      temp.push(Object.values(array[0]))
      console.log("below");
      console.log(temp);
  })
}
getSpecificQR();




export default function Editqrcode(){
    const [edit,setEdit] = useState(temp[0].map(item=>{
        return item.qrstring
    }));
    function putSpecificQR(){
        if(edit!=""){
            axios
            .put("http://localhost:8080/api/v1/store/"+lastURLSegment,{"qrstring": edit.toString() })
            window.alert('Successfully edited qr!')
            window.location.href = "/admin/functions"
        }
        else{
            window.alert('Please input neccessary data!')
        }
      }
    return(
        <div>
            <h3><b>Edit QR Code</b></h3>
            <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
                    <Card>
                        <CardHeader>
                            <h4><b>Store Name :</b></h4>
                        </CardHeader>
                        <CardBody>
                        {temp[0].map(item=>{
                            return item.name
                        })}
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                    <Card>
                        <CardHeader>
                            <h4><b>Store Address :</b></h4>
                        </CardHeader>
                        <CardBody>
                        {temp[0].map(item=>{
                            return item.address
                        })}
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                    <Card>
                        <CardHeader>
                            <h4><b>Store Code :</b></h4>
                        </CardHeader>
                        <CardBody>
                       {temp[0].map(item=>{
                            return item.code
                        })}
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
            <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader>
                            <h4><b>QR String :</b></h4>
                        </CardHeader>
                        <CardBody>
                        <input type="text" defaultValue={edit} onChange={e=>setEdit(e.target.value)} className="form-control" />
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
            <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                    <Button onClick={putSpecificQR} fullWidth color="success">Save</Button> 
            </GridItem>
            </GridContainer>
        </div>
    )
}