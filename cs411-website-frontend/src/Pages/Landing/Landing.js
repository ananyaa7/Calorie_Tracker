import React, { useState } from "react";
import { Container, Form, Button, Alert, Card, Dropdown, Row, Modal } from "react-bootstrap";
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import "./Landing.css";


function Landing({ onLoginSuccessful }) {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(""); 
  const [sumCalories,setSumCalories] = useState(0);  
  const [bmi, setBmi] = useState(0);
  const [bmr, setBmr] = useState(0);
  const [avgBmi, setAvgBmi] = useState(0);
  const [maxBmi, setMaxBmi] = useState(0);
  const [minBmi, setMinBmi] = useState(0);
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
  const [search,setSearch] = useState("");

  const onWeightChange = (event) => setWeight(event.target.value);
  const onHeightChange = (event) => setHeight(event.target.value);
  const onGenderChange = (event) => setGender(event.target.value);
  const onAgeChange = (event) => setAge(event.target.value);

  /* STAGE 1 */

  var BMI = 0;
  var minBMI = 0;
  var maxBMI = 0;
  var avgBMI = 0;
  var BMR = 0;
  var totalCalories = 0;
  
  const calculateStats = () => {
    BMI = weight / ((height/100) * (height/100));
    if (gender == "M") {
        BMR =  88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    }
    if (gender == "F") {
        BMR =  447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    setBmi(BMI);
    console.log(BMI);
    setBmr(BMR);

  }
  
  var onStatSubmit = (e) => {
    e.preventDefault();

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    console.log(BMI)

    let body = {
      "gender": gender,
      "weight": weight,
      "height": height,
      "BMI": bmi,
      "BMR": bmr,
      "CaloriesNeeded": bmr,
      "curr_date": today
    }
    axios.post("http://localhost:8000/submitstats", body).then((res) => {
        console.log(res.status);
    })
  }

  /* STAGE 2 */

  function getSelected() {
    var grid = document.getElementById("foodTable");
    var checkboxes = grid.getElementsByTagName("INPUT");
    totalCalories = 0;
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          var row = checkboxes[i].parentNode.parentNode;
          // console.log(row)
          // console.log(row.cells[2].innerHTML)
          // console.log(row.cells[3].innerHTML)
          // console.log(row.cells[4].innerHTML)
          totalCalories += parseInt(row.cells[2].innerHTML);
          totalCalories += parseInt(row.cells[3].innerHTML);
          totalCalories += parseInt(row.cells[4].innerHTML);
          // console.log(totalCalories)
          // console.log(sumCalories)
        } 
        setSumCalories(totalCalories);
    }
  }

  const [foods, setFoods] = useState([]);

  var onFilterSubmit = () => {
    if (!carbs && !protein && ! fiber) {
      setFoods([])
    }

    if (carbs && !protein && !fiber) {
      axios.get("http://localhost:8000/highcarbohydrate").then((res) => {
        // console.log(res.data)
        setFoods(res.data)
      })
    }
    
    if (protein && !carbs && !fiber) {
      axios.get("http://localhost:8000/highprotein").then((res) => {
        // console.log(res.data)
        setFoods(res.data)
      })
    }

    if (fiber && !protein && !carbs) {
      axios.get("http://localhost:8000/highfiber").then((res) => {
        // console.log(res.data)
        setFoods(res.data)
      })
    }
    
    /* NOT IMPLEMENTED YET */
    if (fiber && protein && !carbs) {
      axios.get("http://localhost:8000/highprotein-fibers").then((res) => {
        // console.log(res.data)
        setFoods(res.data)
      })
    }

    if (carbs && protein && !fiber) {
      axios.get("http://localhost:8000/highcarbs-protein").then((res) => {
        // console.log(res.data)
        setFoods(res.data)
      })
    }

    if (carbs && fiber && !protein) {
      axios.get("http://localhost:8000/highcarbs-fibers").then((res) => {
        // console.log(res.data)
        setFoods(res.data)
      })
    }

    if (carbs && fiber && protein) {
      axios.get("http://localhost:8000/highcarbs-protein-fibers").then((res) => {
        // console.log(res.data)
        setFoods(res.data)
      })
    }

  };

  function generateSummary() {
    var summary = "";
    if (bmr - sumCalories < 0) {
      summary += "surplus";
    } else {
      summary += "deficit";
    }
    return summary;
  }

  var onOrderSubmit = (e) => {
    console.log("sum" + sumCalories)
    let body = {
      "totalOrderCalories": sumCalories,
    }
    axios.post("http://localhost:8000/submitorder", body).then((res) => {
        console.log(res.status);
    })
  }

  /* STAGE 3 */

  var onViewHistory = () => {
    axios.get("http://localhost:8000/gethistory").then((res) => {
        // console.log(res.data)
        // console.log(res.data.minBMI)
        // console.log(res.data.maxBMI)
        // console.log(res.data.avgBMI)
        setMinBmi(res.data.minBMI)
        setMaxBmi(res.data.maxBMI)
        setAvgBmi(res.data.avgBMI)
        // console.log(minBmi)
        // console.log(maxBmi)
        // console.log(avgBmi)
    })
  }

  var onClearHistory = () => {
    axios.post("http://localhost:8000/clearhistory", {}).then((res) => {
        console.log(res.status);
    })
  }

  var onSearch = () => {
   
    console.log(search);
    axios.get("http://localhost:8000/search",{
      params: {
        foodName: search 
      }
    }).then((res) => {
      setFoods(res.data)
      console.log(res.data)
    })
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

        {/* STAGE 1 : ENTER STATS */}
        <Card.Body>
          <Form className="w-100" onSubmit={onStatSubmit}>
            <Form.Group controlId="weight">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter weight in kg"
                onChange={onWeightChange}
                value={weight}
                required
              />
            </Form.Group>

            <Form.Group controlId="height">
              <Form.Label>Height</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter height in cm"
                onChange={onHeightChange}
                value={height}
                required
              />
            </Form.Group>

            <Form.Group controlId="Age">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter age in years"
                onChange={onAgeChange}
                value={age}
                required
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
            <Button variant="primary" type="submit" onClick={calculateStats}>
              Submit Stats
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* STAGE 2 : ORDER */}

      <Card className="mt-5">
        <Card.Header as="h2">Step 2: Select Foods</Card.Header>
        <Card.Header as="h3">You need {bmr} calories per day</Card.Header>
        <Card.Body>
          <Form className="w-100">

          {/* FILTERS */}
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

            {/* <Dropdown.Divider />
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
              </Form> */}

              <Button variant="success" size="sm"  onClick = {()=>{informationState(); onFilterSubmit()}}>
                 Apply
              </Button>
            </Dropdown.Menu>
          </Dropdown>
    
          {/* INSERT SEARCH BAR */}
          
          {/* FOOD TABLE */}
            <table className="table is-striped is-fullwidth" id="foodTable">
                <thead>
                    <tr>
                        <td></td>
                        <th>Food Name</th>
                        <th>Carbs Calories</th>
                        <th>Protein Calories</th>
                        <th>Fiber Calories</th>
                        
                        <TextField 
                        style={{width: '20ch' }} 
                        id="standard-basic" 
                        label="" 
                        variant="standard" 
                        onChange={ (e) => {setSearch(e.target.value)}}
                        />
                        <IconButton sx={{ p: '10px' }} aria-label="search" onClick={()=>{onSearch()}}>
                             <SearchIcon />
                        </IconButton>
                    </tr>
                </thead>
                <tbody>
                    { foods.map((food, index) => (
                        <tr key={ food.foodID }>
                            <td><input type="checkbox"/></td>
                            <td>{ food.foodName }</td>
                            <td>{ food.carbsCalories }</td>
                            <td>{ food.proteinCalories }</td>
                            <td>{ food.fiberCalories }</td>
                        </tr>
                    )) }
                </tbody>
            </table>
            <br></br>

            <h4>Total Order Calories: {sumCalories} </h4>
            <Button variant="primary" onClick={() => {console.log(bmi); console.log(bmr); getSelected(); 
                generateSummary(); onOrderSubmit()}}>
              Submit Order
            </Button>
          </Form>
        </Card.Body>
      
      {/* STAGE 3 : SUMMARY */}
      </Card>
      <Card className="mt-5">
        <Card.Header as="h2">Step 3: Summary</Card.Header>
        <Card.Body>
            <h4>You are on {bmr - sumCalories} kcal {generateSummary()}</h4>
            <Button variant="primary" onClick={() => {onViewHistory(); handleShow()}}>
              View History
            </Button>
            
            {/* HISTORY POP UP */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>History</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Highest BMI: {maxBmi}
                <br></br> 
                Lowest BMI: {minBmi}
                <br></br> 
                Average BMI: {avgBmi}
                <br></br> 
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={onClearHistory}>
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