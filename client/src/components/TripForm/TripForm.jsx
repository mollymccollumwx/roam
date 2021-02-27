import React, { useState, useEffect, useContext } from "react";
import "./TripForm.css";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import UserContext from "../../contexts/UserContext";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import {
  VERTICAL_ORIENTATION,
  HORIZONTAL_ORIENTATION,
} from "react-dates/constants";

const TripForm = (props) => {
  const { userContext } = useContext(UserContext);
  // state for form object
  const [destination, setDestination] = useState("");
  // TODO: Do we want travel start date initiated as today?
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [calendarStack, setCalendarStack] = useState("HORIZONTAL_ORIENTATION");

  const [travelers, setTravelers] = useState([
    {
      travelerId: props.tripCreatorId,
      travelerEmail: userContext.email,
      status: "Trip Creator",
      // TODO: We want it to be creator as You will show up on the non-creators trips as well
    },
  ]);

  // state to add traveler to travelers list state
  const [traveler, setTraveler] = useState("");
  const [validEmailPromptState, setValidEmailPromptState] = useState(true);
  const [validRemoveState, setValidRemoveState] = useState(true);

  // browser params
  const { tripId } = useParams();
  const { userId } = useParams();

  useEffect(() => {
    if (tripId) {
      axios
        .get(`/api/trips/${tripId}`)
        .then((response) => {
          const responseStartDate = moment(response.data.startDate);
          const responseEndDate = moment(response.data.endDate);
          setDestination(response.data.destination);
          setStartDate(responseStartDate);
          setEndDate(responseEndDate);

          setTravelers(response.data.travelers);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [tripId]);

  // check window viewport to set orientation of calendar so it is responsive in mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setCalendarStack(VERTICAL_ORIENTATION);
    } else {
      setCalendarStack(HORIZONTAL_ORIENTATION);
    }
  }, []);

  // add traveler to the travelers list
  const addTraveler = (e) => {
    e.preventDefault();
    const newTraveler = travelers.find((traveler) => {
      return traveler.travelerEmail === e.target.traveler.value.toLowerCase();
    });
    if (newTraveler) {
      //Todo: add alert
      console.log("user already exists");
    } else {
      if (validateEmail(e.target.traveler.value)) {
        setValidEmailPromptState(true);
        const newInvite = e.target.traveler.value.toLowerCase();
        setTravelers([
          ...travelers,
          { travelerEmail: newInvite, travelerId: "", status: "pending" },
        ]);
        setTraveler("");
      } else {
        setValidEmailPromptState(false);
      }
      // TODO: "Invite Sent" alert or message
    }
  };

  // remove traveler
  const removeTraveler = (targetEmail) => {
    if (targetEmail === userContext.email) {
      console.log(targetEmail);
      console.log(traveler.travelerEmail);
      setValidRemoveState(false);
    } else {
      let filteredTravelers = travelers.filter(
        (traveler) => traveler.travelerEmail !== targetEmail
      );
      setTravelers(filteredTravelers);
      setValidRemoveState(true);
    }
  };

  // set calendar dates
  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  // validates an email address
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  return (
    <>
      <div className="columns is-centered">
        <div className="column is-half">
          <form
            className="trip-form"
            onSubmit={(e) =>
              props.handleFormSubmit(e, {
                tripCreator: userId,
                destination,
                startDate,
                endDate,
                travelers,
              })
            }
          >
            {/* destination section  */}
            <div className="field mb-2">
              <label className="label">Destination</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Destination"
                  name="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
            {/* date picker section  */}
            <div className="mb-5">
              <label className="label">Dates</label>

              <DateRangePicker
                className="date-range-picker"
                startDate={startDate}
                startDateId="trip-start-date"
                endDate={endDate}
                endDateId="trip-end-date"
                onDatesChange={handleDatesChange}
                focusedInput={focusedInput}
                onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
                // optional props
                showDefaultInputIcon={true} // calendar icon
                showClearDates={true} // clear dates with x button
                isOutsideRange={() => false} // allow past dates
                //  // for mobile view: https://github.com/airbnb/react-dates/issues/262
                // orientation={react-dates/constants.VERTICAL_ORIENTATION} does wonders combined with withPortal={true} or with withFullScreenPortal={true}
                orientation={calendarStack}
                // withPortal={true}

                //  // if we want to use date range picker on single trip view
                // disabled={true}
                // showClearDates={false}
              />
            </div>
          </form>
          {/* invite travelers section  */}

          <form className="invite" onSubmit={addTraveler}>
            <label className="label">Invite Others!</label>
            <div className="columns is-vcentered">
              <div className="column">
                <div className="field has-addons has-addons-fullwidth">
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      placeholder="User email"
                      name="traveler"
                      value={traveler}
                      onChange={(e) => setTraveler(e.target.value)}
                    />
                    <span className="icon is-medium is-left">
                      <i className="fas fa-users"></i>
                    </span>
                    {!validEmailPromptState && (
                      <p className="validation">
                        Please enter a valid email address
                      </p>
                    )}

                    <span>
                      <i
                        type="submit"
                        className="fas fa-plus fa-lg add-traveler-button"
                        className=""
                      ></i>
                    </span>
                  </div>
                  <div className="control">
                    <button type="submit" className="button">
                      <i className="fas fa-plus fa-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Traveler bubbles */}
            <div className="mb-5">
              {!validRemoveState && (
                <p className="validation">
                  Cannot remove trip creator. Cancel or delete trip.
                </p>
              )}
              {travelers.map((traveler, index) => (
                <p className="travelers" key={index}>
                  <span className="travelers-tag p-2 mr-2">
                    {traveler.travelerEmail === userContext.email && (
                      <span>YOU - </span>
                    )}
                    {/* if no traveler email, do not render  */}
                    {traveler.travelerEmail && (
                      <span> {`${traveler.travelerEmail} - `}</span>
                    )}
                    <span>
                      <em>{traveler.status}</em>
                    </span>
                    <span
                      // data-email={traveler.email}
                      onClick={() => removeTraveler(traveler.travelerEmail)}
                      // onClick={(e) => removeTraveler(e)}
                    >
                      {" "}
                      x{" "}
                    </span>
                  </span>
                </p>
              ))}
            </div>

            {/* Save button */}
            <div className="field is-grouped">
              <div className="control">
                <button
                  className={`button is-primary ${props.loadingState}`}
                  type="submit"
                  onClick={(e) =>
                    props.handleFormSubmit(e, {
                      tripCreator: userId,
                      destination,
                      startDate,
                      endDate,
                      travelers,
                    })
                  }
                >
                  {props.buttonText}
                </button>

                <Link to={`/user/${userId}/trips`}>
                  <button className="button  ml-4 cancel-button">Cancel</button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TripForm;
