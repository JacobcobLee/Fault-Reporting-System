import React, { useEffect } from "react";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";    
import axios from 'axios';
import {useState} from 'react';

var pageURL = window.location.href;
var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);

export default function Editstore(){
    const [storename,setStoreName] = useState("");
    const [storecode,setStoreCode] = useState("");
    const [storeaddress,setStoreAddress] = useState("");

    useEffect(()=>{
        axios
      .get("https://bchfrserver.herokuapp.com/api/v1/store/"+lastURLSegment)
      .then((response) => {
        setStoreName(response.data[lastURLSegment].name)
        setStoreCode(response.data[lastURLSegment].code)
        setStoreAddress(response.data[lastURLSegment].address)
      })
    },[])

    function putSpecificStore(){
        if((storename !== '')&&(storecode !== '')&&(storeaddress !== ''))
        {
            try{
            axios
            .put("https://bchfrserver.herokuapp.com/api/v1/store/"+lastURLSegment,{
                "name": storename, 
                "code": storecode,
                "address": storeaddress
            }).then((res)=> {
                if(res){
                window.alert('Successfully edited store!')
                window.location.href = "/admin/functions"
                }
            })
            }catch(e){
                console.error("error updating store info e is " + e)
            }
        }
        else{
            window.alert('Please input neccessary data!')
        }       
    }
    return(
        <div>
            <h3 style={{textAlign: 'left', marginLeft:'2.5em' }}><b>Edit Store</b></h3>
            <GridContainer justify="space-around">
            <GridItem xs={12} sm={10} md={11} lg={11}>
                    <Card>
                        <CardBody>
                        <h4><b>Store Name :</b></h4>
                        <input className="form-control" type="text" placeholder="Edit Store Name, example..Hillion Mall" defaultValue={storename} onChange={e=>{setStoreName(e.target.value)}}/> 
                        <br></br>
                        <h4><b>Store Code :</b></h4>
                        <input className="form-control" type="text" placeholder="Edit Store Code, last 4 digit of store no" defaultValue={storecode} onChange={e=>setStoreCode(e.target.value)}/>
                        <br></br>
                        <h4><b>Store Address :</b></h4>
                        <input className="form-control" type="text" placeholder="Edit Store Address" defaultValue={storeaddress} onChange={e=>setStoreAddress(e.target.value)}/>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={11} lg={11}>
                    <Button onClick={putSpecificStore} fullWidth color="success">Save</Button>
                    <Button onClick={event =>  window.location.href='/admin/functions'} fullWidth color="danger">Cancel</Button>
                </GridItem>
            </GridContainer>
        </div>
    )
}