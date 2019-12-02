import React from 'react';
import {useParams} from 'react-router-dom';

function Group(props) {
	const {id} =useParams();
	return(<div id="group-page">Page Id: {id}</div>);
}

export default Group;