import { Route, Redirect } from 'react-router-dom'
import React, { Component } from "react"
import AnimalManager from "../modules/AnimalManager"
import EmployeeManager from "../modules/EmployeeManager"
import LocationManager from "../modules/LocationManager"
import OwnerManager from "../modules/OwnerManager"
import AnimalList from './animals/AnimalList'
import LocationList from './locations/LocationList'
import EmployeeList from './employee/EmployeeList'
import OwnerList from './owners/OwnerList'
import Login from './authentication/Login'


export default class ApplicationViews extends Component {

  state = {
    employees: [],
    locations: [],
    animals: [],
    owners: [],
    petOwners: []
  }

  // Check if credentials are in local storage
  isAuthenticated = () => sessionStorage.getItem("credentials") !== null

  componentDidMount() {
    const newState = {}

    AnimalManager.getAll().then(allAnimals => {
      this.setState({
        animals: allAnimals
      })
    })
    EmployeeManager.getAll().then(allEmployees => {
      this.setState({
        employees: allEmployees
      })
    })
    LocationManager.getAll().then(allLocations => {
      this.setState({
        locations: allLocations
      })
    })
    OwnerManager.getAll().then(allOwners => {
      this.setState({
        owners: allOwners
      })
    })
      .then(() => fetch("http://localhost:5002/petOwners")
        .then(r => r.json()))
      .then(petOwners => newState.petOwners = petOwners)
      .then(() => this.setState(newState))
  }

  deleteAnimal = id => {
    return fetch(`http://localhost:5002/animals/${id}`, {
      method: "DELETE"
    })
      .then(e => e.json())
      .then(() => fetch(`http://localhost:5002/animals`))
      .then(e => e.json())
      .then(animals => this.setState({
        animals: animals
      })
      )
  }

  deleteEmployee = id => {
    return fetch(`http://localhost:5002/employees/${id}`, {
      method: "DELETE"
    })
      .then(e => e.json())
      .then(() => fetch(`http://localhost:5002/employees`))
      .then(e => e.json())
      .then(employees => this.setState({
        employees: employees
      })
      )
  }

  deleteOwner = id => {
    return fetch(`http://localhost:5002/owners/${id}`, {
      method: "DELETE"
    })
      .then(e => e.json())
      .then(() => fetch(`http://localhost:5002/owners`))
      .then(e => e.json())
      .then(owners => this.setState({
        owners: owners
      })
      )
  }

  render() {
    return (
      <React.Fragment>
        <Route exact path="/" render={(props) => {
          if (this.isAuthenticated()) {
            return <LocationList locations={this.state.locations} />
          } else {
            return <Redirect to="/login" />
          }
        }} />
        <Route path="/login" component={Login} />
        <Route path="/animals" render={(props) => {
          if (this.isAuthenticated()) {
            return <AnimalList
              deleteAnimal={this.deleteAnimal}
              animals={this.state.animals}
              owners={this.state.owners}
              petOwners={this.state.petOwners} />
          } else {
            return <Redirect to="/login" />
          }
        }} />
        <Route exact path="/employees" render={props => {
          if (this.isAuthenticated()) {
            return <EmployeeList deleteEmployee={this.deleteEmployee}
              employees={this.state.employees} />
          } else {
            return <Redirect to="/login" />
          }
        }} />
        <Route path="/owners" render={(props) => {
          if (this.isAuthenticated()) {
            return <OwnerList
              owners={this.state.owners}
              deleteOwner={this.deleteOwner} />
          } else {
            return <Redirect to="/login" />
          }
        }} />
      </React.Fragment>
    )
  }
}