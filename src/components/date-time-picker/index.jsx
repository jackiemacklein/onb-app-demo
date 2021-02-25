/**
 * Styles
 */
import "./style.scss";

/**
 * External Dependencies
 */
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import pt from "date-fns/locale/pt";
registerLocale("pt", pt);

export default DatePicker;
