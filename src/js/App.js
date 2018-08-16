import React from "react";
import Input from "./Input";


export default class App extends React.Component {
	state = {
	};


	constructor(
		props)
	{
		super(props);
	}


	render()
	{
		return (
			<div>booyah
			<Input value="ffs"/>
			</div>
		);
	}
}
