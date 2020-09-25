import React from "react";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";    
import axios from 'axios';
import {useState} from 'react';

var pageURL = window.location.href;
var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);

const store = [];
const array = [];
const temp=[];
const temp2=[];
function getSpecificStore(){
  axios
  .get("https://bchserver.herokuapp.com/api/v1/store/"+lastURLSegment)
  .then((response) => {
    //console.log(response.data);
      store.push(response.data)
      array.push(store[0])
      temp.push(Object.values(array[0]))
      temp2.push(Object.keys(array[0]))
      console.log("below");
      console.log(temp);
  })
}
getSpecificStore();

export default function Editstore(){
    const [storename,setStoreName] = useState(temp[0].map(item=>{
        return item.name
    }));
    const [storecode,setStoreCode] = useState(temp[0].map(item=>{
        return item.code
    }));
    const [storeaddress,setStoreAddress] = useState(temp[0].map(item=>{
        return item.address
    }));
    function putSpecificStore(){
        if((storename !== '')&&(storecode !== '')&&(storeaddress !== ''))
        {
            axios
            .put("https://bchserver.herokuapp.com/api/v1/store/"+lastURLSegment,{
                "name": storename.toString(), 
                "code": storecode.toString(),
                "address": storeaddress.toString()
            })
            window.alert('Successfully edited store!')
            window.location.href = "/admin/functions"
        }
        else{
            window.alert('Please input neccessary data!')
        }
        //console.log(edit)
       
      }
    return(
        <div>
            <h3><b>Edit Store</b></h3>
            <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardBody>
                        <h4><b>Store Name :</b></h4>
                        <input className="form-control" type="text" placeholder="Edit Store Name, example..Hillion Mall" defaultValue={storename} onChange={e=>setStoreName(e.target.value)}/> 
                        <br></br>
                        <h4><b>Store Code :</b></h4>
                        <input className="form-control" type="text" placeholder="Edit Store Code, last 4 digit of store no" defaultValue={storecode} onChange={e=>setStoreCode(e.target.value)}/>
                        <br></br>
                        <h4><b>Store Address :</b></h4>
                        <input className="form-control" type="text" placeholder="Edit Store Address" defaultValue={storeaddress} onChange={e=>setStoreAddress(e.target.value)}/>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                    <Button onClick={putSpecificStore} fullWidth color="success">Save</Button> 
                </GridItem>
            </GridContainer>
        </div>
    )
}