export const zeroPad = (value, length) => `${value}`.padStart(length, "0");

const isLeapYear = year => {
	if (year % 4 !== 0) {
		return false;
	} else if (year % 100 !== 0) {
		return true;
	} else if (year % 400 !== 0) {
		return false;
	} else {
		return true;
	}
};

export const getTodaysDate = calType => {
	var gregorianDate = new Date()
		.toISOString()
		.slice(0, 10)
		.split("-");

	var ret = convertDate(gregorianDate, "gregorian", calType);
	return ret;
};

export const getWeekDays = (calType, month) => {
	if (calType === "gregorian") {
		return {
			Sunday: "Sun",
			Monday: "Mon",
			Tuesday: "Tue",
			Wednesday: "Wed",
			Thursday: "Thu",
			Friday: "Fri",
			Saturday: "Sat"
		};
	} else if (calType === "positivist") {
		var ret = {
			Monday: "Mon",
			Tuesday: "Tue",
			Wednesday: "Wed",
			Thursday: "Thu",
			Friday: "Fri",
			Saturday: "Sat",
			Sunday: "Sun"
		};
		if (month === 14) {
			ret = {
				"Festival of all the Dead": "Festival of all the Dead",
				"Festival of Holy Women": "Festival of Holy Women"
			};
		}
		return ret;
	} else {
		return {
			Sunday: "Sun",
			Monday: "Mon",
			Tuesday: "Tue",
			Wednesday: "Wed",
			Thursday: "Thu",
			Friday: "Fri",
			Saturday: "Sat",
			None: "-"
		};
	}
};

export const getMonthsForCalendar = calType => {
	if (calType === "gregorian") {
		return {
			January: "Jan",
			February: "Feb",
			March: "Mar",
			April: "Apr",
			May: "May",
			June: "Jun",
			July: "Jul",
			August: "Aug",
			September: "Sep",
			October: "Oct",
			November: "Nov",
			December: "Dec"
		};
	} else if (calType === "ifc") {
		return {
			January: "Jan",
			February: "Feb",
			March: "Mar",
			April: "Apr",
			May: "May",
			June: "Jun",
			Sol: "Sol",
			July: "Jul",
			August: "Aug",
			September: "Sep",
			October: "Oct",
			November: "Nov",
			December: "Dec"
		};
	} else if (calType === "world") {
		return {
			January: "Jan",
			February: "Feb",
			March: "Mar",
			April: "Apr",
			May: "May",
			June: "Jun",
			July: "Jul",
			August: "Aug",
			September: "Sep",
			October: "Oct",
			November: "Nov",
			December: "Dec"
		};
	} else if (calType === "positivist") {
		return {
			Moses: "Mos",
			Homer: "Hom",
			Aristotle: "Ari",
			Archimedes: "Arc",
			Caesar: "Cae",
			"Saint Paul": "Sai",
			Charlemagne: "Cha",
			Dante: "Dan",
			Gutenberg: "Gut",
			Shakespeare: "Sha",
			Descartes: "Des",
			Frederick: "Fre",
			Bichat: "Bic",
			Festivals: "Fes"
		};
	} else if (calType === "wsc") {
		return {
			A: "A",
			B: "B",
			C: "C",
			D: "D"
		};
	} else {
		throw new Error("Invalid calendar type:" + calType);
	}
};

export const getNumberOfDaysInYear = (calType, year) => {
	var numMonths = getNumberOfMonthsInYear(calType);
	var count = 0;
	for (let ii = 1; ii <= numMonths; ii++) {
		count = count + getMonthDays(calType, year, ii);
	}
	return count;
};

export const getNumberOfMonthsInYear = calType => {
	let months = getMonthsForCalendar(calType);
	let count = 0;
	for (let prop in months) {
		count++;
	}
	return count;
};

export const getPreviousMonth = (calType, year, month) => {
	const numMonths = getNumberOfMonthsInYear(calType);
	const prevMonth = month > 1 ? month - 1 : numMonths;
	const prevMonthYear = month > 1 ? year : year - 1;

	return { month: prevMonth, year: prevMonthYear };
};

export const getNextMonth = (calType, year, month) => {
	const numMonths = getNumberOfMonthsInYear(calType);
	const nextMonth = month < numMonths ? month + 1 : 1;
	const nextMonthYear = month < numMonths ? year : year + 1;

	return { month: nextMonth, year: nextMonthYear };
};

export const getMonthName = (calType, date) => {
	var monthNames = getMonthsForCalendar(calType);
	var months = [];
	for (let prop in monthNames) {
		months.push(prop);
	}
	var monthNum = parseInt(date[1], 10) - 1;
	return months[monthNum];
}

export const getWeekDayName = (calType, date) => {
	var day = parseInt(date[2], 10);
	var month = parseInt(date[1], 10);
	var year = parseInt(date[0], 10);
	var weekDaysObj = getWeekDays(calType, month);
	var weekDays = [];
	for (let prop in weekDaysObj) {
		weekDays.push(prop);
	}

	if (calType === "gregorian") {
		let monthsObj = getMonthsForCalendar("gregorian");
		let months = [];
		for (let prop in monthsObj) {
			months.push(prop);
		}
		let monthName = months[month - 1];

		var dayNum = +new Date(`${monthName} ${day}, ${year}`).getDay() ;
		return weekDays[dayNum];

	} else if (calType === "ifc") {

		var dayNum = (day - 1) % 7;

		// The 29th is always a non-weekday
		if (day === 29) {
			return "-";
		} else {
			return weekDays[dayNum];
		}

	} else if (calType === "world") {
		// 1 = Sunday
		var val = (month - 1) % 3;
		var dayNum = val === 0 ? 0 : val === 1 ? 3 : 5;
		dayNum = dayNum + day - 1;

		// leap and world days don't have a weekday
		if ( (month === 12 && day === 31) || (month === 6 && day === 31) ) {
			return "-";
		} else {
			return weekDays[dayNum % 7];
		}
	} else if (calType === "wsc") {
		if (day === 92) {
			return "-";
		} else {
			return weekDays[(day - 1) % 7];
		}
	} else if (calType === "positivist") {
		return weekDays[ (day - 1) % 7];
	} else {
		throw new Error("Invalid input:" + calType);
	}
}

export const getMonthFirstDay = (calType, year, month) => {
	if (calType === "gregorian") {
		let monthsObj = getMonthsForCalendar("gregorian");
		let months = [];
		for (let prop in monthsObj) {
			months.push(prop);
		}
		let monthName = months[month - 1];

		return +new Date(`${monthName} 1, ${year}`).getDay() + 1;
	} else if (calType === "world") {
		// 1 = Sunday
		var val = (month - 1) % 3;
		return val === 0 ? 1 : val === 1 ? 4 : 6;
	} else if (calType === "wsc") {
		// 1 = Sunday
		return 1;
	} else if (calType === "positivist") {
		return 1; // in case this, Monday will be 1
	} else {
		throw new Error("Invalid input:" + calType);
	}
};

export const getMonthDays = (calType, year, month) => {
	year = parseInt(year, 10);
	month = parseInt(month, 10);

	let leapYear = isLeapYear(year);
	if (calType === "gregorian") {
		const months30 = [4, 6, 9, 11];

		return month === 2
			? leapYear
				? 29
				: 28
			: months30.includes(month)
			? 30
			: 31;
	} else if (calType === "ifc") {
		let months = Array.apply(null, { length: 13 }).map(function() {
			return 28;
		});
		if (leapYear) {
			months[5] = 29;
		}
		months[12] = 29;
		return months[month - 1];
	} else if (calType === "world") {
		let months = Array.apply(null, { length: 12 }).map(function(item, idx) {
			if (idx % 3 === 0 || idx === 11) {
				return 31;
			} else {
				return leapYear && idx === 5 ? 31 : 30;
			}
		});
		return months[month - 1];
	} else if (calType === "positivist") {
		return month <= 13 ? 28 : leapYear ? 2 : 1;
	} else if (calType === "wsc") {
		if (leapYear && month === 2) {
			return 92;
		} else {
			return month === 4 ? 92 : 91;
		}
	} else {
		throw new Error("Invalid calendar type");
	}
};

/*
	date:
		format example: ["2000", "11", "01"] // year, month, day
*/
export const getDaysIntoYear = (calType, date) => {
	var prevMonth = parseInt(date[1], 10) - 1;
	var dayCount = 0;
	for (let ii = 1; ii <= prevMonth; ii++) {
		dayCount = dayCount + getMonthDays(calType, date[0], ii);
	}

	dayCount += parseInt(date[2], 10);
	return dayCount;
};

const dayNumberToDate = (calType, year, dayCount) => {
	let month = 1;
	let day = 1;
	let maxMonthCount = getNumberOfMonthsInYear(calType);

	while (dayCount !== 0) {
		let monthDays = getMonthDays(calType, year, month);

		if (monthDays >= dayCount || month === maxMonthCount) {
			day = dayCount;
			dayCount = 0;
		} else {
			dayCount = dayCount - monthDays;
			month++;
		}
	}

	return [year, month, day];
};

export const convertDate = (date, type1, type2) => {
	var daysIntoYear = getDaysIntoYear(type1, date);

	// handle year differences for wsc and positivist calendars
	var year = parseInt(date[0], 10);
	if (type1 !== type2) {
		// if we're going from a positivist date, we need to shift the year
		if (type1 === "positivist") {
			year = year + 1788;
		} else if (type1 === "wsc") {
			daysIntoYear = daysIntoYear - 11;
			if (daysIntoYear <= 0) {
				year--;
				daysIntoYear = getNumberOfDaysInYear("wsc", year) + daysIntoYear;
			}
		}

		// if we're going to a positivist date, we need to shift the year backward
		if (type2 === "positivist") {
			var year = parseInt(date[0], 10);
			year = year - 1788;

			// handle the fact that WSC's year doesn't start on the same day
		} else if (type2 === "wsc") {
			daysIntoYear = daysIntoYear + 11;
			if (daysIntoYear > getNumberOfDaysInYear("wsc", year)) {
				year++;
				daysIntoYear = daysIntoYear - getNumberOfDaysInYear("wsc", year);
			}
		}
	}
	return dayNumberToDate(type2, year, daysIntoYear);
};
