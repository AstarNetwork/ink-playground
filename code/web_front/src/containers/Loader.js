import React from 'react';
import { css } from '@emotion/core';
import { FadeLoader } from 'react-spinners';

const override = css`
	display: block;
	margin: 0 auto;
`;

const Loader = (props) => {
	return(
		<div>
		<FadeLoader
			css={override}
			sizeUnit={"px"}
			size={500}
			color={'#FFFFFF'}
			loading={props.flag}
		/>
		<h2 style={{display: props.flag?'':'none'}}> compiling ...</h2>
		</div>
	);

}

export default Loader;
