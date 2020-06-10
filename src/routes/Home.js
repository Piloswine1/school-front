import React from 'react';
import {Link} from 'react-router-dom';

function Home(argument) {
		return(
			<div className="container">
			<Link to="/shedule">Расписание</Link>
			<p/>
			<Link to="/admin">Администратор</Link>
			</div>
			);
}

export default Home;