/**
 * External Dependencies
 */
import { combineReducers } from "redux";
import Cookies from "js-cookie";
import Omit from "object.omit";

/**
 * Internal Dependencies
 */
import { getUID } from "../utils";
import defaultSettings from "../settings";
import { UPDATE_AUTH, UPDATE_SETTINGS, ADD_TOAST, REMOVE_TOAST } from "../actions";

// initial state.
const INITIAL_SETTINGS_STATE = {
  ...defaultSettings,
};
const INITIAL_AUTH_STATE = {
  token: Cookies.get("rui-auth-token"),
  user_id: Cookies.get("rui-auth-user_id"),
  user_name: Cookies.get("rui-auth-user_name"),
  user_email: Cookies.get("rui-auth-user_email"),
  filial_id: Cookies.get("rui-auth-filial_id"),
  filial_name: Cookies.get("rui-auth-filial_name"),
  user_image_path: Cookies.get("rui-auth-user_image_path"),
  profile_id: Cookies.get("rui-auth-profile_id"),
  profile_name: Cookies.get("rui-auth-profile_name"),
  sales_cancel: Cookies.get("rui-auth-sales_cancel"),
};
const INITIAL_TOASTS_STATE = [];

/**
 * Reducer
 */
const rootReducer = combineReducers({
  auth: (state = INITIAL_AUTH_STATE, action) => {
    switch (action.type) {
      case UPDATE_AUTH:
        // save token to cookies for 3 days.
        if (typeof action.auth.token !== "undefined") {
          Cookies.set("rui-auth-token", action.auth.token, { expires: 3 });
          Cookies.set("rui-auth-user_id", action.auth.user_id, { expires: 3 });
          Cookies.set("rui-auth-user_name", action.auth.user_name, { expires: 3 });
          Cookies.set("rui-auth-user_email", action.auth.user_email, { expires: 3 });
          Cookies.set("rui-auth-filial_id", action.auth.filial_id, { expires: 3 });
          Cookies.set("rui-auth-filial_name", action.auth.filial_name, { expires: 3 });
          Cookies.set("rui-auth-user_image_path", action.auth.user_image_path, { expires: 3 });
          Cookies.set("rui-auth-profile_id", action.auth.profile_id, { expires: 3 });
          Cookies.set("rui-auth-profile_name", action.auth.profile_name, { expires: 3 });
          Cookies.set("rui-auth-sales_cancel", action.auth.sales_cancel, { expires: 3 });
        }

        return Object.assign({}, state, action.auth);
      default:
        return state;
    }
  },
  settings: (state = INITIAL_SETTINGS_STATE, action) => {
    switch (action.type) {
      case UPDATE_SETTINGS:
        return Object.assign({}, state, action.settings);
      default:
        return state;
    }
  },
  toasts: (state = INITIAL_TOASTS_STATE, action) => {
    switch (action.type) {
      case ADD_TOAST:
        const newData = {
          ...{
            title: "",
            content: "",
            color: "brand",
            time: false,
            duration: 0,
            closeButton: true,
          },
          ...action.data,
        };

        if (newData.time === true) {
          newData.time = new Date();
        }

        return {
          ...state,
          [getUID()]: newData,
        };
      case REMOVE_TOAST:
        if (!action.id || !state[action.id]) {
          return state;
        }
        return Omit(state, action.id);
      default:
        return state;
    }
  },
});

export default rootReducer;
