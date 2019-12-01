import React from "react";
import {Link} from 'react-router-dom';

function AdminPage(props) {

	function showPanel(argument) {
		
	}
	
	return(<div id="AdminPage">
		<Link to="/admin/group-editor">Редактор групп</Link>
		<button>Редактор расписания</button>
		</div>);
}

export default AdminPage;