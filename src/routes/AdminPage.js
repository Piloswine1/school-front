import React from "react";
import {Link} from 'react-router-dom';

function AdminPage(props) {	
	return(<div className="container">
		<Link to="/admin/group-editor">Редактор групп</Link>
		<p/>
		<Link to="/admin/shedule-editor">Редактор расписания</Link>
		</div>);
}

export default AdminPage;