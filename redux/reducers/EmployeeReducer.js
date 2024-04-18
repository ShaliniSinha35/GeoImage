// EmployeeReducer.js
import { SET_EMPLOYEE_VALUE } from "../actions/Employee";

const initialState = {
  value: null,
};

const EmployeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMPLOYEE_VALUE:
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

export default EmployeeReducer;
