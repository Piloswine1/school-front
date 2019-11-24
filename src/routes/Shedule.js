import React, { useState } from 'react';

function Shedule(props){
	const [year, setYear] = useState("");
	const [orient, setOrient] = useState("");
	const [group, setGroup] = useState("");

	return(
		<div id="all-page">
			<div id="search-bar">
	
				<label>Курс:</label>
				<input 
					className="year-input"
					list="year-select"
					value={year} 
					onChange={(e)=>setYear(e.target.value)} 
		 		/>
		 		<datalist id="year-select" >
		 			<option value="1" />
		 			<option value="2" />
		 			<option value="3" />
		 		</datalist>
	
				<label>Факультет:</label>
				<input
					className="orient-input" 
					list="orient-select"
					value={orient} 
					onChange={(e)=>setOrient(e.target.value)} 
				 />
		 		<datalist id="orient-select" >
		 			<option value="1" />
		 			<option value="2" />
		 			<option value="3" />
		 		</datalist>
	
				<label>Группа:</label>
				<input 
					className="group-input"
					list="group-select"
					value={group} 
					onChange={(e)=>setGroup(e.target.value)} 
				  />
		 		<datalist id="group-select" >
		 			<option value="1" />
		 			<option value="2" />
		 			<option value="3" />
		 		</datalist>
	
			</div>
		</div>
	);
}

export default Shedule;