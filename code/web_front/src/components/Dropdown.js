import React from 'react';
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const Dropdown = ({label,value,valuesList,valuesListIsAble,setValue,display}) =>  {

  return (
		<div>
			<FormControl variant="filled" style={{width:"100%",marginBottom:"10px"}}>
				<InputLabel>{label}</InputLabel>
				<Select
					value={!!value?value:""}
					onChange={(e)=>{setValue(e.target.value)}}
				>
					{(valuesListIsAble)?valuesList.map((val, index) => {
						return (
							<MenuItem key={index} value={val} > {display(val)} </MenuItem>
						)
					}):[]}
				</Select>
			</FormControl>
		</div>
  );
}

Dropdown.propTypes={
	label:PropTypes.string.isRequired,
	valuesList:PropTypes.array,
	valuesListIsAble:PropTypes.bool,
	setValue:PropTypes.func.isRequired,
	display:PropTypes.func.isRequired,
}

Dropdown.defaultProps={
	valuesListIsAble:true,
	display:(val)=>val.toString(),
}

export default Dropdown;
