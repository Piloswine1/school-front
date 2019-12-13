import React from "react";
import {Link} from 'react-router-dom';

function AdminPage(props) {	
	return(<div id="AdminPage">
		<Link to="/admin/group-editor">Редактор групп</Link>
		<br/>
		<Link to="/admin/shedule-editor">Редактор расписания</Link>
		</div>);
}

export default AdminPage;