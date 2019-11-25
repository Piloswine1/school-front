import React from 'react';
import {Link} from 'react-router-dom';

function Home(argument) {
		return(
			<div>
			<Link to="/shedule">Расписание</Link>
			<br />
			<Link to="/admin">Администратор</Link>
			</div>
			);
}

export default Home;