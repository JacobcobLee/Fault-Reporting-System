import React, {useState, useEffect} from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import axios from 'axios';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import ToolkitProvider from 'react-bootstrap-table2-toolkit';


export default function TableList() {
    const [customerfeedback,setCustomerFeedback] = useState([]);
    const getFeedbacksData = async ()=> {
        try{
            await axios
            .get("http://localhost:9998/api/v1/feedback")
            .then((response) => {
                console.log(response.data);
                setCustomerFeedback(Object.values(response.data));
            })
        }
        catch(e){
            console.log(e + "error at tablelist.js");
        }
    }

    const columns = [//,filter: dateFilter()
        {dataField: "date", text:"Submitted On",filter: textFilter()},
        {dataField: "location", text:"Store Location",filter: textFilter()},
        {dataField: "feedbackType", text:"Feedback Type",filter: textFilter()},
        {dataField: "standard", text:"Standard",filter: textFilter()},
        {dataField: "issue", text:"Issue",filter: textFilter(), headerStyle: (colum, colIndex) => { return { width: '25em', textAlign: 'center' }; }},
        {dataField: "rating", text:"Ratings",filter: textFilter()},
        {dataField: "staffname", text:"Staff Name",filter: textFilter()},
        // {dataField: "custemail", text:"Customer Email",filter: textFilter()},
        // {dataField: "custcontactno", text:"Customer Contact",filter: textFilter()},
        {dataField: "custname", text:"Customer Name",filter: textFilter()},
    ]

    useEffect(() => {
        getFeedbacksData();
    },[])

    customerfeedback.sort((a, b) => a - b).reverse()

    const MyExportCSV = (props) => {
        const handleClick = () => {
          props.onExport();
        };
        return (
          <div>
             <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                  <Button onClick={handleClick} fullWidth color="info">Generate Excel Sheet</Button>
              </GridItem>
          </GridContainer>
          </div>
        );
      };

    return (
        <div>
        <Card>
        <CardHeader color="primary">
        <h4>Customer Feedback</h4>
          <p>
            Feedbacks can be generated as excel sheet and downloaded
          </p>
        </CardHeader>
        <CardBody>
        <ToolkitProvider
          keyField="uuid"
          data={ customerfeedback }
          columns={ columns }
          exportCSV ={ {
            exportAll:false,
            onlyExportFiltered:true
          } }
        >
        {
        props => (
          <div>
            <BootstrapTable
            filter={filterFactory()}
            keyField="uuid"
            data={customerfeedback}
            columns={columns}
            pagination={paginationFactory()}
            filterPosition="top"
            { ...props.baseProps } />
            <hr />
            <MyExportCSV { ...props.csvProps } />
          </div>
        )
      }
    </ToolkitProvider>
        </CardBody>
        </Card>
        </div>
    )
}


