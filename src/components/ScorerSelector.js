import React, {useState} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";


const SearchWidgetContainer = styled.div`
	vertical-align: top;
	display: inline-block;
	position: relative;

	& ~ & {
		margin-left: 30px;
	}
`;
const Scorer = styled.div`
	width: 516px;
`;
const Selector = styled.div`
	height: 1.5em;
`;
const Label = styled.label`
	font-weight: bold;
	margin-right: .5em;
	color: #666;
`;


export default function ScorerSelector({scorers,
	onChange,
	onKbdClick})
{
	const [selectedIndex, setSelectedIndex] = useState(0);
	const items = scorers.map(({name}, i) => (
		<option
			key={i}
			value={i}
		>
			{name}
		</option>
	));
	const [leftDescription, rightDescription] = scorers[selectedIndex].description;


	function handleChange(
		event)
	{
		const newSelectedIndex = Number(event.target.value);

		onChange(scorers[newSelectedIndex]);
		setSelectedIndex(newSelectedIndex);
	}


	return (
		<div>
			<SearchWidgetContainer>
				<Scorer>
					<Selector>
						<Label>Scorer:</Label>QuickScore
					</Selector>
					<div onClick={onKbdClick}>
						{leftDescription}
					</div>
				</Scorer>
			</SearchWidgetContainer>
			<SearchWidgetContainer>
				<Scorer>
					<Selector>
						<Label htmlFor="menu">Scorer:</Label>
						<select id="menu"
							onChange={handleChange}
						>
							{items}
						</select>
					</Selector>
					<div onClick={onKbdClick}>
						{rightDescription}
					</div>
				</Scorer>
			</SearchWidgetContainer>
		</div>
	);
}


ScorerSelector.propTypes = {
	scorers: PropTypes.arrayOf(PropTypes.object).isRequired,
	onChange: PropTypes.func.isRequired,
	onKbdClick: PropTypes.func.isRequired
};
