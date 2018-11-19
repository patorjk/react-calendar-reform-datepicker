import React, { Component } from "react";
import { Datepicker, convertDate } from "../components/Datepicker/index.js";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			gregorianDate: [2018, 11, 1]
		};
		this.state.ifcDate = convertDate(
			this.state.gregorianDate,
			"gregorian",
			"ifc"
		);
		this.state.worldDate = convertDate(
			this.state.gregorianDate,
			"gregorian",
			"world"
		);
		this.state.positivistDate = convertDate(
			this.state.gregorianDate,
			"gregorian",
			"positivist"
		);
		this.state.wscDate = convertDate(
			this.state.gregorianDate,
			"gregorian",
			"wsc"
		);

		this.state.dateFormat = "long";

		this.handleChange = this.handleChange.bind(this);
		this.formatAsIso = this.formatAsIso.bind(this);
		this.formatAsLong = this.formatAsLong.bind(this);
	}

	formatAsIso() {
		this.setState({
			dateFormat: 'iso',
		})
	}

	formatAsLong() {
		this.setState({
			dateFormat: 'long',
		})
	}

	handleChange(evt) {
		this.setState({
			gregorianDate: convertDate(evt.date, evt.calendarType, "gregorian"),
			ifcDate: convertDate(evt.date, evt.calendarType, "ifc"),
			worldDate: convertDate(evt.date, evt.calendarType, "world"),
			positivistDate: convertDate(evt.date, evt.calendarType, "positivist"),
			wscDate: convertDate(evt.date, evt.calendarType, "wsc")
		});
	}

	render() {
		return (
			<div className="w-25 py-5 my-5 mx-auto" style={{ minWidth: "60%" }}>
				<p>
					<button onClick={this.formatAsIso}>Format: ISO</button>
					<button onClick={this.formatAsLong}>Format: Long</button>
				</p>

				<Datepicker
					label="Gregorian"
					calendarType="gregorian"
					value={this.state.gregorianDate}
					handleChange={this.handleChange}
					format={this.state.dateFormat}
				/>
				<Datepicker
					label="International Fixed"
					calendarType="ifc"
					value={this.state.ifcDate}
					handleChange={this.handleChange}
					format={this.state.dateFormat}
				/>
				<Datepicker
					label="World"
					calendarType="world"
					value={this.state.worldDate}
					handleChange={this.handleChange}
					format={this.state.dateFormat}
				/>
				<Datepicker
					label="Positivist"
					calendarType="positivist"
					value={this.state.positivistDate}
					handleChange={this.handleChange}
					format={this.state.dateFormat}
				/>
				<Datepicker
					label="World Season"
					calendarType="wsc"
					value={this.state.wscDate}
					handleChange={this.handleChange}
					format={this.state.dateFormat}
				/>
			</div>
		);
	}
}

export default App;
