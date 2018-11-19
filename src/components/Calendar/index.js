import React, { Component, Fragment } from "react";
import * as Styled from "./styles";
import calendar, {
	isDate,
	isSameDay2,
	isSameMonth2,
	getDateISO2
} from "../../helpers/calendar";
import {
	getTodaysDate,
	getWeekDays,
	getMonthsForCalendar,
	getNextMonth,
	getPreviousMonth
} from "../../helpers/calendar-converter.js";

class Calendar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			...this.resolveStateFromProp(),
			today: getTodaysDate(props.calendarType)
		};
	}

	getColCount = () => {
		let colCount = 0;
		let weekDays = getWeekDays(this.props.calendarType, this.state.month);

		for (let prop in weekDays) {
			colCount++;
		}
		return colCount;
	};

	resolveStateFromDate(date) {
		var _date;
		if (typeof date === "object" && date.length) {
			_date = date;
		} else {
			_date = getTodaysDate(this.props.calendarType);
		}
		return {
			current: _date,
			month: _date[1],
			year: _date[0]
		};
	}

	resolveStateFromProp() {
		return this.resolveStateFromDate(this.props.date);
	}

	getCalendarDates = () => {
		const { current, month, year } = this.state;
		const calendarMonth = month;
		const calendarYear = year;

		var ret = calendar(
			this.props.calendarType,
			parseInt(calendarYear, 10),
			parseInt(calendarMonth, 10)
		);
		return ret;
	};

	gotoDate = date => evt => {
		evt && evt.preventDefault();
		const { current } = this.state;
		const { onDateChanged } = this.props;

		!(current && isSameDay2(date, current)) &&
			this.setState(this.resolveStateFromDate(date), () => {
				typeof onDateChanged === "function" && onDateChanged(date);
			});
	};

	gotoPreviousMonth = () => {
		const { month, year } = this.state;
		this.setState(getPreviousMonth(this.props.calendarType, year, month));
	};

	gotoNextMonth = () => {
		const { month, year } = this.state;
		this.setState(getNextMonth(this.props.calendarType, year, month));
	};

	gotoPreviousYear = () => {
		const { year } = this.state;
		this.setState({ year: year - 1 });
	};

	gotoNextYear = () => {
		const { year } = this.state;
		this.setState({ year: year + 1 });
	};

	handlePressure = fn => {
		if (typeof fn === "function") {
			fn();
			this.pressureTimeout = setTimeout(() => {
				this.pressureTimer = setInterval(fn, 100);
			}, 500);
		}
	};

	clearPressureTimer = () => {
		this.pressureTimer && clearInterval(this.pressureTimer);
		this.pressureTimeout && clearTimeout(this.pressureTimeout);
	};

	clearDayTimeout = () => {
		this.dayTimeout && clearTimeout(this.dayTimeout);
	};

	handlePrevious = evt => {
		evt && evt.preventDefault();
		const fn = evt.shiftKey ? this.gotoPreviousYear : this.gotoPreviousMonth;
		this.handlePressure(fn);
	};

	handlePreviousYear = evt => {
		evt && evt.preventDefault();
		const fn = this.gotoPreviousYear;
		this.handlePressure(fn);
	};

	handleNext = evt => {
		evt && evt.preventDefault();
		const fn = evt.shiftKey ? this.gotoNextYear : this.gotoNextMonth;
		this.handlePressure(fn);
	};

	handleNextYear = evt => {
		evt && evt.preventDefault();
		const fn = this.gotoNextYear;
		this.handlePressure(fn);
	};

	renderMonthAndYear = () => {
		const { month, year } = this.state;
		const monthname = Object.keys(
			getMonthsForCalendar(this.props.calendarType)
		)[Math.max(month - 1)];

		return (
			<Styled.CalendarHeader>
				<div>
					<Styled.ArrowLeft
						onMouseDown={this.handlePreviousYear}
						onMouseUp={this.clearPressureTimer}
						onMouseLeave={this.clearPressureTimer}
						color={"#eee"}
						title="Previous Year"
					/>
					<Styled.ArrowLeft
						onMouseDown={this.handlePrevious}
						onMouseUp={this.clearPressureTimer}
						onMouseLeave={this.clearPressureTimer}
						title="Previous Month"
					/>
				</div>
				<Styled.CalendarMonth>
					{monthname} {year}
				</Styled.CalendarMonth>
				<div>
					<Styled.ArrowRight
						onMouseDown={this.handleNext}
						onMouseUp={this.clearPressureTimer}
						onMouseLeave={this.clearPressureTimer}
						title="Next Month"
					/>
					<Styled.ArrowRight
						onMouseDown={this.handleNextYear}
						onMouseUp={this.clearPressureTimer}
						onMouseLeave={this.clearPressureTimer}
						color={"#eee"}
						title="Next Year"
					/>
				</div>
			</Styled.CalendarHeader>
		);
	};

	renderDayLabel = (day, index) => {
		const daylabel = getWeekDays(this.props.calendarType, this.state.month)[
			day
		].toUpperCase();
		let colCount = this.getColCount();
		if (!(this.props.calendarType === "positivist" && colCount === 2)) {
			return (
				<Styled.CalendarDay key={daylabel} index={index} cols={colCount}>
					{daylabel}
				</Styled.CalendarDay>
			);
		} else {
			var s = {
				border: "1px solid rgb(0, 102, 204)"
			};
			return <div key={daylabel} style={s} />;
		}
	};

	/*
		date format: [2000, "09", "01"]
	*/
	renderCalendarDate = (date, index) => {
		const { current, month, year, today } = this.state;
		//const _date = new Date(date.join("-"));

		const isToday = isSameDay2(date, today);
		const isCurrent = current && isSameDay2(date, current);
		const inMonth = month && year && isSameMonth2(date, [year, month, 1]);
		const isBlank = date[0] === "blank";

		let onClick = this.gotoDate(date);
		if (date[0] === "blank") {
			onClick = function(evt) {
				evt.preventDefault();
			};
		}

		let colCount = this.getColCount();
		const props = {
			index,
			inMonth,
			onClick,
			isBlank,
			title: "none for now",
			cols: colCount
		};

		const DateComponent = isCurrent
			? Styled.HighlightedCalendarDate
			: isToday
			? Styled.TodayCalendarDate
			: Styled.CalendarDate;

		var dateContents = date[2]; // default

		// special case for positivist festivals
		if (this.props.calendarType === "positivist" && colCount === 2) {
			if (dateContents === "01") {
				dateContents = "Festival of all the Dead";
			} else {
				dateContents = "Festival of Holy Women";
			}
		}

		// special case for "Worlds" day days
		if (
			this.props.calendarType === "world" &&
			(dateContents === "31" && (date[1] === "06" || date[1] === "12"))
		) {
			dateContents = "W";
		}

		return (
			<DateComponent key={date.join("-")} {...props}>
				{dateContents}
			</DateComponent>
		);
	};

	componentDidMount() {
		const now = new Date();
		const tomorrow = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;
		const ms = tomorrow - now;

		this.dayTimeout = setTimeout(() => {
			this.setState(
				{
					today: getTodaysDate(this.props.calendarType)
				},
				this.clearDayTimeout
			);
		}, ms);
	}

	componentDidUpdate(prevProps) {
		const { date, onDateChanged } = this.props;
		const { date: prevDate } = prevProps;
		const dateMatch = date == prevDate || isSameDay2(date, prevDate);

		!dateMatch &&
			this.setState(this.resolveStateFromDate(date), () => {
				typeof onDateChanged === "function" && onDateChanged(date);
			});
	}

	componentWillUnmount() {
		this.clearPressureTimer();
		this.clearDayTimeout();
	}

	render() {
		let colCount = this.getColCount();
		let weekDays = getWeekDays(this.props.calendarType, this.state.month);

		return (
			<Styled.CalendarContainer>
				{this.renderMonthAndYear()}

				<Styled.CalendarGrid cols={colCount}>
					<Fragment>{Object.keys(weekDays).map(this.renderDayLabel)}</Fragment>

					<Fragment>
						{this.getCalendarDates().map(this.renderCalendarDate)}
					</Fragment>
				</Styled.CalendarGrid>
			</Styled.CalendarContainer>
		);
	}
}

export default Calendar;
