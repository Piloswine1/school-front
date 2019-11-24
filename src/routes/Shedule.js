import React, { useState } from 'react';

function ShedulePage(props){
	const [data,setData] = useState(props.data);
	const [year, setYear] = useState("");
	const [orient, setOrient] = useState("");
	const [group, setGroup] = useState("");
	//возможно поменять
	const [disabled,setDisabled] = useState(true);
	const [toDisplay,setToDisplay] = useState(props.data.groups);

	function isValidInput(){
		if (!data.year.includes(year)) if (year!=="") return false;
		if (!data.orient.includes(orient)) if (orient!=="") return false;
		return true;
	}

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
		 			{data.year.map((e,key)=><option key={key} value={e} />)}		 		
		 		</datalist>
	
				<label>Факультет:</label>
				<input
					className="orient-input" 
					list="orient-select"
					value={orient} 
					onChange={(e)=>setOrient(e.target.value)} 
				 />
		 		<datalist id="orient-select" >
		 			{data.orient.map((e,key)=><option key={key} value={e} />)}	
		 		</datalist>

		 		{/*Скорее всего перенести это на запрос к серверу, долго фильтровать*/}
		 		<button onClick={()=>{
		 			if (!isValidInput()) return;
		 			const filterYear=(year===""?data.groups:data.groups.filter((e)=>e.year===year));
		 			const filterOrient=(orient===""?filterYear:filterYear.map((e)=>{
		 					if (!e.orients.some((sube)=>sube.name===orient)) return;
		 					return ({
		 						year:e.year,
		 						orients:e.orients.filter((sube)=>sube.name===orient)
		 					});
		 				}));
		 			// const filterGroup=(group===""?filterOrient:filterOrient.map((e)=>{
		 			// 		if (!e.orients.some((sube)=>sube.groups.includes(group))) return;
		 			// 		return ({
		 			// 			year:e.year,
		 			// 			orients:e.orients.map((sube)=>)
		 			// 		});
		 			// 	}));
		 			setToDisplay(filterOrient);
		 		}}>Find</button>
				
				<div>
				<label>Группа:</label>
				<input 
					className="group-input"
					value={group} 
					onChange={(e)=>setGroup(e.target.value)} 
					disabled={disabled}
				  />
				</div>

				<Table data={toDisplay} />
	
			</div>
		</div>
	);
}

//Переделать получение информации!!
let gotData=false;

function Shedule(){
	const [data,setData] = useState({group:[],orient:[],year:[]});
	return(<div>
		{gotData?<ShedulePage data={data} />:<button onClick={()=>{
			gotData=true;
			setData({
				year:["1","2","3","4","5","6"],
				orient:["N1","N2","N3","N4","N5","N6","N7"],
				groups:[{
					year:"1",
					orients:[{
						name:"N1",
						groups:["111","112","113"]
					},{
						name:"N2",
						groups:["211","212","313"]
					},{
						name:"N3",
						groups:["311","312","313"]
					}]
				},{
					year:"2",
					orients:[{
						name:"N1",
						groups:["121","122","123"]
					},{
						name:"N2",
						groups:["221","222","323"]
					},{
						name:"N3",
						groups:["321","322","323"]
					}]
				},{
					year:"3",
					orients:[{
						name:"N1",
						groups:["131","132","133"]
					},{
						name:"N2",
						groups:["231","232","333"]
					},{
						name:"N3",
						groups:["331","332","333"]
					}]
				}]
			});
		}}>Get this data</button>}
	</div>);
}

function Table(props){
	const groups = props.data;

	return(<div>
		{groups.map((e,key)=><div key={key}>
			<h1>{e.year}</h1>
			{e.orients.map((sube1,subkey1)=><div key={""+key+subkey1}>
				<h2>{sube1.name}:</h2>
				<h3>{sube1.groups.reduce((accum,curr)=>accum+","+curr)}</h3>
				</div>				
			)}
		</div>)}
	</div>);
}

export default Shedule;