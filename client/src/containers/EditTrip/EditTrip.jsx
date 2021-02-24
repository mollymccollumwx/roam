import React, { useEffect, useParams } from "react";
import Calendar from "../../components/Calendar/Calendar";
import "./EditTrip.css";
import API from "../../utils/API";
import DestinationForm from "../../components/DestinationForm/DestinationForm";
import InviteForm from "../../components/InviteForm/InviteForm";

const EditTrip = () => {
  // Make API request to prepopulate the data below
  // useEffect(()=>{
  //   axios.get("/api/trips/:id").then(response=>{
  //     console.log(response.data)
  //   }).catch(err=>{
  //     console.log(err)
  //   })
  // }, [])

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half ">
          <h1 className="title">Edit Your Trip</h1>

          <DestinationForm />

          {/* Calendar with date range selector */}
          <div className="mb-5">
            <label className="label">Dates</label>
            <Calendar />
          </div>

          {/* List of travelers */}
          <div className="mb-5">
            <label className="label">Traveler Companions</label>
            <ul>
              <li>Pete</li>
              <li>Tony</li>
              <li>Molly</li>
              <li>Jeana Rose</li>
            </ul>
          </div>

          <InviteForm />

          {/* Save button */}
          <div className="field is-grouped">
            <div className="control">
              <button className="button is-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTrip;
