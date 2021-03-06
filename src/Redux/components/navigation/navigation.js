import { v4 } from 'uuid';
import getCityDetail from '../../../API/name-to-coordinate';
import cityWeather from '../../../API/currentWeatherData';

const ADD_SINGLE_CITY = 'Redux/components/navigation/navigation/ADD_SINGLE_CITY';
const APPLY_FILTER = 'Redux/components/navigation/navigation/TRUE';
const REMOVE_FILTER = 'Redux/components/navigation/navigation/false';

export const searchAndAddCity = (cityName, navigator) => async (dispatch) => {
  try {
    let city = await getCityDetail(cityName);
    [city] = city;
    if (!city) { throw Error('No city found'); }
    const cityInfo = await cityWeather(city.lat, city.lon);
    const {
      name, distance = false, population = 0, country, country: countryCode,
    } = city;
    const {
      clouds, coord, main, wind, weather, unit,
    } = cityInfo;
    const action = {
      type: ADD_SINGLE_CITY,
      payload: {
        id: v4(),
        name,
        distance,
        population,
        nearMe: 0,
        country,
        countryCode,
        clouds,
        coord,
        weather,
        unit,
        main,
        wind,
      },
    };
    dispatch(action);
    navigator(`/detail?id=${action.payload.id}`);
  } catch (error) {
    navigator('/error?message=We could not find your city');
    throw Error('fail to fetch city', error);
  }
};

export const applyFilter = (filterType, navigate) => {
  if (navigate) navigate('/');
  return { type: APPLY_FILTER, payload: filterType };
};
export const removeFilter = () => ({ type: REMOVE_FILTER });

export const searchReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_SINGLE_CITY:
      return [action.payload, ...state];
    default:
      return state;
  }
};

export const filterReducer = (state = 'All', action) => {
  switch (action.type) {
    case APPLY_FILTER:
      return action.payload;
    case REMOVE_FILTER:
      return 'All';
    default:
      return state;
  }
};
