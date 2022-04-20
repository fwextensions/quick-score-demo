import React, {useState} from "react";
import styled from "styled-components";
import {AdapterConfig} from "@/adapters/configs";


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


interface ScorerSelectorProps {
	configs: AdapterConfig[],
	onChange: (e: AdapterConfig) => void,
	onKbdClick: (e: React.MouseEvent) => void
}

export default function ScorerSelector({
	configs,
	onChange,
	onKbdClick
}: ScorerSelectorProps)
{
	const [selectedIndex, setSelectedIndex] = useState(0);
	const items = configs.map(({adapter: {name}}, i) => (
		<option
			key={i}
			value={i}
		>
			{name}
		</option>
	));
	const [leftDescription, rightDescription] = configs[selectedIndex].description;


	function handleChange(
		event: React.ChangeEvent<HTMLSelectElement>)
	{
		const newSelectedIndex = Number(event.target?.value);

		onChange(configs[newSelectedIndex]);
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
