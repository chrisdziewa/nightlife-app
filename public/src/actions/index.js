import * as constants from '../constants';
import axios from 'axios';

// Venue actions


export function updateVenue(venueId) {
  return (dispatch) => {
    axios.get(`/venue/${venueId}`).then(venue => {
      dispatch(venueUpdated(venue.data));
    })
    .catch(e => {
      console.log(e);
    })
  }
}

function venueUpdated(venue) {
  return {
    type: constants.UPDATE_VENUE,
    payload: venue
  }
}

function venueSuccess(venues) {
  return {
    type: constants.GET_VENUES,
    payload: venues
  }
}

export function getVenues(keyword) {
  let url = `/api/yelp/${keyword}`
  return (dispatch) => {
    axios.get(url).then(response => {
      let venues = response.data;
      console.log(venues);
      dispatch(venueSuccess(venues));
    })
    .catch((error) => {
      console.log('error: ', error);
    });
  }
}

function userLoggedIn(user) {
  return {
    type: constants.USER_LOGGED_IN,
    payload: user
  }
}

export function checkAuthenticated() {
  return (dispatch) => {
    axios.get('/users/current').then(user => {
      let { data } = user;
      dispatch(userLoggedIn(data));
      dispatch(updateSearch(data.recentSearch));
      dispatch(getVenues(data.recentSearch));
    })
    .catch(errorResponse => {
      let { recentSearch } = errorResponse.data;
      if (recentSearch !== '' && typeof recentSearch !== 'undefined') {
        dispatch(updateSearch(recentSearch));
        dispatch(getVenues(recentSearch));
      }
    })
  }
}

// Search Actions

export function updateSearch(term) {
  return {
    type: constants.UPDATE_SEARCH_TERM,
    payload: term
  }
}
