import React from "react";


// this class was based on this GitHub comment: https://github.com/facebook/react/issues/955#issuecomment-281802381


export default class Input extends React.Component {
	static defaultProps = {
		value: "",
		onChange() {},
		onFocus() {},
		onBlur() {}
	};


	state = {
		isFocused: false,
		currentValue: this.props.value
	};
	input = null;


	constructor(props)
	{
		super(props);
	}


	componentDidMount()
	{
		const queryLength = this.props.value.length;

		if (queryLength) {
				// even if there's a default value, the insertion point gets set
				// to the beginning of the input field, instead of at the end.
				// so move it there after the field is created.
			this.input.setSelectionRange(queryLength, queryLength);
		}
	}


	componentWillReceiveProps(nextProps)
	{
			// the parent can pass forceUpdate to force the input's value
			// to change even if it's focused
		if (!this.state.isFocused || nextProps.forceUpdate) {
			this.setState({ currentValue: nextProps.value });
		}
	}


	setSelectionRange(start, end)
	{
		if (this.input) {
			this.input.setSelectionRange(start, end);
		}
	}


	handleRef = (input) =>
	{
		this.input = input;
	};


	handleChange = (e) =>
	{
		this.setState({ currentValue: e.target.value });
		e.persist();
		this.props.onChange(e);
	};


	handleFocus = (e) =>
	{
		this.setState({ isFocused: true });
		e.persist();
		this.props.onFocus(e);
	};


	handleBlur = (e) =>
	{
		this.setState({ isFocused: false });
		e.persist();
		this.props.onBlur(e);
	};


	render()
	{
			// expand the props first so that they don't override the ones we
			// set after that
		return (
			<input
				{...this.props}
				ref={this.handleRef}
				value={this.state.currentValue}
				onChange={this.handleChange}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
			/>
		);
	}
}
