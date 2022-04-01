
import React, { useState } from "react";
import { Container, Form, Button, Alert, Card, Dropdown, Row, Modal } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import TextField from "@mui/material/TextField";


function Landing({ onLoginSuccessful }) {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(""); 
  const [sumCalories,setSumCalories] = useState(0);  
  const [bmi, setBmi] = useState(0);
  const [bmr, setBmr] = useState(0);
  const [below_100, setBelow_100] = useState(false);
  const [on_100_200,setOn_100_200] = useState(false);
  const [on_200_300, setOn_200_300] = useState(false);
  const [on_300_above, setOn_300_above] = useState(false);
  const [carbs,setCarbs] = useState(false);
  const [protein,setProtein] = useState(false);
  const [fiber,setFiber] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onWeightChange = (event) => setWeight(event.target.value);
  const onHeightChange = (event) => setHeight(event.target.value);
  const onGenderChange = (event) => setGender(event.target.value);
  const onAgeChange = (event) => setAge(event.target.value);


  var BMI = 0;
  var minBMI = 0;
  var maxBMI = 0;
  var avgBMI = 0;
  var BMR = 0;
  var totalCalories = 0;
  
  const calculateStats = () => {
    BMI = weight / (height * height);

    if (gender == "M") {
        BMR =  88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    }
    if (gender == "F") {
        BMR =  447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    setBmi(BMI);
    setBmr(BMR);

  }
  
  const onStatSubmit = (e) => {
    calculateStats();
    e.preventDefault();
  };


  const onFilterSubmit = () => {};

  const columns = [{
    dataField: 'foodID',
    text: 'ID'
    }, {
    dataField: 'foodName',
    text: 'Food Name'
    }, {
    dataField: 'carbsCalories',
    text: 'Carbohydrate Calories'
    }, {
    dataField: 'proteinCalories',
    text: 'Protein Calories'
    }, {
    dataField: 'fiberCalories',
    text: 'Fiber Calories'
    }];

  const foods = [{
    foodID: 1,
    foodName: "apple",
    carbsCalories: 100,
    proteinCalories: 100,
    fiberCalories: 50
    },{
    foodID: 2,
    foodName: "banana",
    carbsCalories: 20,
    proteinCalories: 30,
    fiberCalories: 40
  },{
    foodID: 3,
    foodName: "grapes",
    carbsCalories: 20,
    proteinCalories: 30,
    fiberCalories: 40
  },{
    foodID: 4,
    foodName: "orange",
    carbsCalories: 20,
    proteinCalories: 30,
    fiberCalories: 40
  }];
  
  var selectRowProp = { 
    mode: "checkbox",
    clickToSelect: true,
    onSelect: onRowSelect
  };

  function onRowSelect(row, isSelected){
    for(var prop in row){
      console.log(prop)
        if (prop != "foodID" && prop != "foodName" && isSelected) {
          totalCalories += parseInt(row[prop]);
        }
        else if(prop != "foodID" && prop != "foodName" && !isSelected)
        {
          totalCalories -= parseInt(row[prop]);
        }
    }
    
    console.log(row["foodID"] + ", " + totalCalories);
  }

  function clearHistory() {}

  function generateHistory() {}

  function generateSummary() {
    var summary = "";
    if (bmr - sumCalories < 0) {
      summary += "deficit";
    } else {
      summary += "surplus";
    }
    return summary;
  }

  // function clickHandler(text,isClicked)
  // {
  //       if(isClicked)
  //       console.log(text+"clicked");
  //       else
  //       console.log(text+"unclicked");
  // }

  function informationState()
  {
    if(below_100)console.log("100 is clicked");
    if(on_100_200)console.log("on_100_200 is clicked");
    if(on_200_300)console.log("on_200_300 is clicked");
    if(on_300_above)console.log("on_300_above is clicked");
    if(carbs)console.log("carbs is clicked");
    if(protein)console.log("protein is clicked");
    if(fiber)console.log("fiber is clicked");
    console.log("im in inform"+bmi);
    console.log("im in inform"+bmr);


  }
  return (
    <Container>
    <Button variant="secondary" type="submit">
        Logout
    </Button>
      <Card className="mt-5">
        <Card.Header as="h1">Calories Tracker</Card.Header>
        <Card.Header as="h2">Step 1: Enter Stats</Card.Header>
        <Card.Body>
          <Form className="w-100" onSubmit={onStatSubmit}>
            <Form.Group controlId="weight">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="weight"
                placeholder="Enter weight in kg"
                onChange={onWeightChange}
                value={weight}
              />
            </Form.Group>

            <Form.Group controlId="height">
              <Form.Label>Height</Form.Label>
              <Form.Control
                type="height"
                placeholder="Enter height in cm"
                onChange={onHeightChange}
                value={height}
              />
            </Form.Group>

            <Form.Group controlId="Age">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="age"
                placeholder="Enter age in years"
                onChange={onAgeChange}
                value={age}
              />
            </Form.Group>

            <Form.Group controlId="gender">
            <Form.Label>Gender</Form.Label>
            <Form.Select aria-label="Default select example" onChange={onGenderChange}>
                <option>Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
            </Form.Select>
            </Form.Group>
            <br></br>
            <Button variant="primary" type="submit">
              Submit Stats
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Card className="mt-5">
        <Card.Header as="h2">Step 2: Select Foods</Card.Header>
        <Card.Header as="h3">You need {bmr} calories per day</Card.Header>
        <Card.Body>
          <Form className="w-100">

          <Dropdown className="d-inline mx-2">
            <Dropdown.Toggle id="dropdown-autoclose-true">
              Select Filter
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Form>
                <Form.Check 
                    type='checkbox'
                    label='High Carbohydate'
                    onChange = {() => {setCarbs(!carbs)}}
                />
              </Form>
              <Form>
                <Form.Check 
                    type='checkbox'
                    label='High Protein'
                    onChange = {() => {setProtein(!protein)}}
                />
              </Form>
              <Form>
                <Form.Check 
                    type='checkbox'
                    label='High Fiber'
                    onChange = {() => {setFiber(!fiber)}}
                />
              </Form>

            <Dropdown.Divider />
            <Form>
                <Form.Check 
                    type='checkbox'
                    label='Below 100 kcal'
                    onChange = {() => {setBelow_100(!below_100)}}
                    
                />
              </Form>
              <Form>
                <Form.Check 
                    type='checkbox'
                    label='100 - 200 kcal'
                    onChange = {() => {setOn_100_200(!on_100_200)}}
                />
              </Form>
              <Form>
                <Form.Check 
                    type='checkbox'
                    label='200 - 300 kcal'
                    onChange = {() => {setOn_200_300(!on_200_300)}}
                />
              </Form>
              <Form>
                <Form.Check 
                    type='checkbox'
                    label='Above 300 kcal'
                    onChange = {() => {setOn_300_above(!on_300_above)}}
                />
              </Form>

              <Button variant="success" size="sm"  onClick = {()=>informationState()}>
                 Apply
              </Button>
            </Dropdown.Menu>
          </Dropdown>
        
            <BootstrapTable selectRow={ selectRowProp } search={ {searchFormatted: true} } data={foods} striped={true} hover={true}>
              <TableHeaderColumn dataField="foodID" isKey={true} dataAlign="center" dataSort={true}>ID</TableHeaderColumn>
              <TableHeaderColumn dataField="foodName" dataAlign="center">Food Name</TableHeaderColumn>
              <TableHeaderColumn dataField="carbsCalories" dataAlign="center">Carbs Calories</TableHeaderColumn>
              <TableHeaderColumn dataField="proteinCalories" dataAlign="center">Protein Calories</TableHeaderColumn>
              <TableHeaderColumn dataField="fiberCalories" dataAlign="center">Fiber Calories</TableHeaderColumn>
            </BootstrapTable>
            <br></br>
            <h4>Total Order Calories: {sumCalories} </h4>
            <Button variant="primary" onClick={() => {setSumCalories(sumCalories+totalCalories); console.log(bmi);console.log(bmr);  generateSummary()}}>
              Submit Order
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Card className="mt-5">
        <Card.Header as="h2">Step 3: Summary</Card.Header>
        <Card.Body>
            <h4>You are on {bmr - sumCalories} kcal {generateSummary()}</h4>
            <Button variant="primary" onClick={() => {generateHistory(); handleShow()}}>
              View History
            </Button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>History</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Highest BMI: {maxBMI}
                <br></br> 
                Lowest BMI: {minBMI}
                <br></br> 
                Average BMI: {avgBMI}
                <br></br> 
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={clearHistory}>
                  Clear History
                </Button>
              </Modal.Footer>
            </Modal>
            {/* <h4>We recommend the following exercises that best fit your health record:</h4> */}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Landing;