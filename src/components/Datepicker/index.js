import React from "react";
import Calendar from "../Calendar";
import * as Styled from "./styles";
import {
	convertDate,
	getWeekDayName,
	getMonthName,
	zeroPad
} from '../../helpers/calendar-converter.js';

class Datepicker extends React.Component {
	state = { date: null, calendarOpen: false };

	toggleCalendar = () =>
		this.setState({ calendarOpen: !this.state.calendarOpen });

	handleChange = evt => evt.preventDefault();

	handleDateChange = date => {
		const { value: currentDate, onDateChanged } = this.props;
		const newDate = date;

		if (currentDate !== newDate) {
			this.setState({ calendarOpen: false });
			this.props.handleChange({
				date: newDate,
				calendarType: this.props.calendarType
			});
		}
	};

	componentDidMount() {
		const { value: date } = this.props;
		const newDate = date;

		this.setState({ date: newDate });
	}

	componentDidUpdate(prevProps) {
		const { value: date } = this.props;
		const { value: prevDate } = prevProps;
		const dateISO = date;
		const prevDateISO = prevDate;

		dateISO !== prevDateISO && this.setState({ date: dateISO });
	}

	processDatePickerDisplay = date => {
		var year = parseInt(date[0], 10);
		var month = parseInt(date[1], 10);
		var day = parseInt(date[2], 10);

		if (typeof date === "object" && date !== null && date.join) {
			var format = this.props.format || '';
			format = format.toLowerCase();

			if (format === 'iso') {
				return date.join(" / ");
			} else {
				var weekday = getWeekDayName(this.props.calendarType, date);
				var monthName = getMonthName(this.props.calendarType, date);

				// special handling for positivist festivals
				if (this.props.calendarType === 'positivist' && month === 14) {
					return `${weekday}, ${year}`;
				} else {
					return `${weekday}, ${monthName} ${zeroPad(day, 2)}, ${year}`;
				}
			}
		} else {
			return "";
		}
	};

	render() {
		const { value: date, label } = this.props;
		const { calendarOpen } = this.state;

		return (
			<Styled.DatePickerContainer>
				<Styled.DatePickerFormGroup>
					<Styled.DatePickerLabel>{label}</Styled.DatePickerLabel>
					<Styled.DatePickerInput
						type="text"
						value={this.processDatePickerDisplay(date)}
						onChange={this.handleChange}
						readOnly="readonly"
						placeholder="YYYY / MM / DD"
					/>
				</Styled.DatePickerFormGroup>

				<Styled.DatePickerDropdown
					isOpen={calendarOpen}
					toggle={this.toggleCalendar}
				>
					<Styled.DatePickerDropdownToggle color="transparent" />

					<Styled.DatePickerDropdownMenu>
						{calendarOpen && (
							<Calendar
								date={date}
								onDateChanged={this.handleDateChange}
								calendarType={this.props.calendarType}
							/>
						)}
					</Styled.DatePickerDropdownMenu>
				</Styled.DatePickerDropdown>
			</Styled.DatePickerContainer>
		);
	}
}

export {Datepicker, convertDate};
