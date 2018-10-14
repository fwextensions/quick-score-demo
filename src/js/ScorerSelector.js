import React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";


const SearchWidgetContainer = styled.div`
	margin: 1em 1em 0 1em;
	padding: 5px;
	vertical-align: top;
	display: inline-block;
	position: relative;
`;
const Scorer = styled.div`
	width: 500px;
`;
const Selector = styled.div`
	padding-bottom: .5em;
`;
const Label = styled.label`
	font-weight: bold;
	margin-right: .5em;
	color:#666;
`;


export default class ScorerSelector extends React.Component {
	state = {
		selectedIndex: 0
	};


	onChange = (
		event) =>
	{
		const {scorers, onChange} = this.props;
		const selectedIndex = +event.target.value;

		onChange(scorers[selectedIndex]);
		this.setState({ selectedIndex });
	};


	render()
	{
		const {scorers} = this.props;
		const items = scorers.map((scorer, i) => (
			<option
				key={i}
				value={i}
			>
				{scorer.name}
			</option>
		));
		const [leftDescription, rightDescription] = scorers[this.state.selectedIndex].description;

		return (
			<div>
				<SearchWidgetContainer>
					<Scorer>
						<Selector>
							<Label>Scorer:</Label>QuickScore
						</Selector>
						<div>
							{leftDescription}
						</div>
					</Scorer>
				</SearchWidgetContainer>
				<SearchWidgetContainer>
					<Scorer>
						<Selector>
							<Label htmlFor="menu">Scorer:</Label>
							<select id="menu"
								onChange={this.onChange}
							>
								{items}
							</select>
						</Selector>
						<div>
							{rightDescription}
						</div>
					</Scorer>
				</SearchWidgetContainer>
			</div>
		)
	}
}

ScorerSelector.propTypes = {
	scorers: PropTypes.any,
	onChange: PropTypes.any
};
