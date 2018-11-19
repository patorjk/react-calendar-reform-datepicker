import {
	getMonthDays,
	getPreviousMonth,
	getNextMonth,
	getMonthFirstDay
} from "./calendar-converter.js";

export const CALENDAR_WEEKS = 6;

export const zeroPad = (value, length) => `${value}`.padStart(length, "0");

export const isDate = date => {
	const isDate = Object.prototype.toString.call(date) === "[object Date]";
	const isValidDate = date && !Number.isNaN(date.valueOf());
	return isDate && isValidDate;
};

export const getDateISO2 = dateArr => {
	return dateArr.join("-");
};

export const getDateISO = (date = new Date()) => {
	if (!isDate(date)) return null;

	return [
		date.getFullYear(),
		zeroPad(+date.getMonth() + 1, 2),
		zeroPad(+date.getDate(), 2)
	].join("-");
};

export const isSameMonth = (date, basedate = new Date()) => {
	if (!(isDate(date) && isDate(basedate))) return false;

	const basedateMonth = +basedate.getMonth() + 1;
	const basedateYear = basedate.getFullYear();

	const dateMonth = +date.getMonth() + 1;
	const dateYear = date.getFullYear();

	return +basedateMonth === +dateMonth && +basedateYear === +dateYear;
};

// date format: [year, month]
export const isSameMonth2 = (date1, date2) => {
	var sameYear = parseInt(date1[0], 10) === parseInt(date2[0], 10);
	var sameMonth = parseInt(date1[1], 10) === parseInt(date2[1], 10);

	return sameYear && sameMonth;
};

// date format: [year, month, day]
export const isSameDay2 = (date1, date2) => {
	var sameYear = parseInt(date1[0], 10) === parseInt(date2[0], 10);
	var sameMonth = parseInt(date1[1], 10) === parseInt(date2[1], 10);
	var sameDay = parseInt(date1[2], 10) === parseInt(date2[2], 10);

	return sameYear && sameMonth && sameDay;
};

export const isSameDay = (date, basedate = new Date()) => {
	if (!(isDate(date) && isDate(basedate))) return false;

	const basedateDate = basedate.getDate();
	const basedateMonth = +basedate.getMonth() + 1;
	const basedateYear = basedate.getFullYear();

	const dateDate = date.getDate();
	const dateMonth = +date.getMonth() + 1;
	const dateYear = date.getFullYear();

	return (
		+basedateDate === +dateDate &&
		+basedateMonth === +dateMonth &&
		+basedateYear === +dateYear
	);
};

const createPositivistCalendar = (year, month) => {
	const monthDays = getMonthDays("positivist", year, month);
	const thisMonthDates = [...new Array(monthDays)].map((n, index) => {
		const day = index + 1;
		return [year, zeroPad(month, 2), zeroPad(day, 2)];
	});

	let cal = thisMonthDates;

	return thisMonthDates;
};

const createWorldSeasonCalendar = (year, month) => {
	const monthDays = getMonthDays("wsc", year, month);
	const thisMonthDates = [...new Array(monthDays)].map((n, index) => {
		const day = index + 1;
		return [year, zeroPad(month, 2), zeroPad(day, 2)];
	});

	let cal = [];
	var blankNum = 1;
	while (thisMonthDates.length > 13) {
		cal = [...cal, ...thisMonthDates.splice(0, 7), ["blank", blankNum++, "00"]];
	}
	cal = [...cal, ...thisMonthDates.splice(0)];

	return cal;
};

const createIfcCalendar = (year, month) => {
	const monthDays = getMonthDays("ifc", year, month);
	const thisMonthDates = [...new Array(monthDays)].map((n, index) => {
		const day = index + 1;
		return [year, zeroPad(month, 2), zeroPad(day, 2)];
	});

	let cal = [
		...thisMonthDates.splice(0, 7),
		["blank", "1", "00"],
		...thisMonthDates.splice(0, 7),
		["blank", "2", "00"],
		...thisMonthDates.splice(0, 7),
		["blank", "3", "00"],
		...thisMonthDates.splice(0, 7)
	];

	if (thisMonthDates.length > 0) {
		cal = [...cal, ...thisMonthDates];
	} else {
		cal.push(["blank", "4", "00"]);
	}

	return cal;
};

const createWorldCalendar = (year, month) => {
	month = parseInt(month, 10);
	year = parseInt(year, 10);

	const monthDays = getMonthDays("world", year, month);
	const monthFirstDay = getMonthFirstDay("world", year, month);

	let daysFromPrevMonth = monthFirstDay - 1;
	let daysFromNextMonth = 5 * 7 - (daysFromPrevMonth + monthDays);

	daysFromPrevMonth = Math.max(daysFromPrevMonth, 0);
	daysFromNextMonth = Math.max(daysFromNextMonth, 0);

	const { month: prevMonth, year: prevMonthYear } = getPreviousMonth(
		"world",
		year,
		month
	);
	const { month: nextMonth, year: nextMonthYear } = getNextMonth(
		"world",
		year,
		month
	);

	const prevMonthDays = getMonthDays("world", prevMonthYear, prevMonth);

	const prevMonthDates = [...new Array(daysFromPrevMonth)].map((n, index) => {
		const day = index + 1 + (prevMonthDays - daysFromPrevMonth);
		return [prevMonthYear, zeroPad(prevMonth, 2), zeroPad(day, 2)];
	});

	const thisMonthDates = [...new Array(monthDays)].map((n, index) => {
		const day = index + 1;
		return [year, zeroPad(month, 2), zeroPad(day, 2)];
	});

	const nextMonthDates = [...new Array(daysFromNextMonth)].map((n, index) => {
		const day = index + 1;
		return [nextMonthYear, zeroPad(nextMonth, 2), zeroPad(day, 2)];
	});

	let ret = [...prevMonthDates, ...thisMonthDates, ...nextMonthDates];

	let cal = [
		...ret.splice(0, 7),
		["blank", "1", "00"],
		...ret.splice(0, 7),
		["blank", "2", "00"],
		...ret.splice(0, 7),
		["blank", "3", "00"],
		...ret.splice(0, 7),
		["blank", "4", "00"],
		...ret.splice(0, 7)
	];

	if (ret.length > 0) {
		cal = [...cal, ...ret];
	} else {
		cal.push(["blank", "5", "00"]);
	}

	return cal;
};

const createGregorianCalendar = (year, month) => {
	month = parseInt(month, 10);
	year = parseInt(year, 10);

	const monthDays = getMonthDays("gregorian", year, month);
	const monthFirstDay = getMonthFirstDay("gregorian", year, month);

	const daysFromPrevMonth = monthFirstDay - 1;
	const daysFromNextMonth =
		CALENDAR_WEEKS * 7 - (daysFromPrevMonth + monthDays);

	const { month: prevMonth, year: prevMonthYear } = getPreviousMonth(
		"gregorian",
		year,
		month
	);
	const { month: nextMonth, year: nextMonthYear } = getNextMonth(
		"gregorian",
		year,
		month
	);

	const prevMonthDays = getMonthDays("gregorian", prevMonthYear, prevMonth);

	const prevMonthDates = [...new Array(daysFromPrevMonth)].map((n, index) => {
		const day = index + 1 + (prevMonthDays - daysFromPrevMonth);
		return [prevMonthYear, zeroPad(prevMonth, 2), zeroPad(day, 2)];
	});

	const thisMonthDates = [...new Array(monthDays)].map((n, index) => {
		const day = index + 1;
		return [year, zeroPad(month, 2), zeroPad(day, 2)];
	});

	const nextMonthDates = [...new Array(daysFromNextMonth)].map((n, index) => {
		const day = index + 1;
		return [nextMonthYear, zeroPad(nextMonth, 2), zeroPad(day, 2)];
	});

	return [...prevMonthDates, ...thisMonthDates, ...nextMonthDates];
};

export default (calType, year, month) => {
	if (calType === "gregorian") return createGregorianCalendar(year, month);
	if (calType === "ifc") return createIfcCalendar(year, month);
	if (calType === "world") return createWorldCalendar(year, month);
	if (calType === "positivist") return createPositivistCalendar(year, month);
	if (calType === "wsc") return createWorldSeasonCalendar(year, month);
};
