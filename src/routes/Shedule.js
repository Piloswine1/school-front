import React, { useState,useEffect } from 'react';
import './shedule.css';

function ShedulePage(props){
	const [data,setData] = useState(props.data);
	const [course, setCourse] = useState("");
	const [faculty, setFaculty] = useState("");
	const [group, setGroup] = useState("");
	//возможно поменять
	const [disabled,setDisabled] = useState(true);
	const [toDisplay,setToDisplay] = useState(props.data);

	function isValidInput(){
		if (!data.courses.includes(course)) if (course!=="") return false;
		if (!data.facultys.includes(faculty)) if (faculty!=="") return false;
		return true;
	}

	return(
		<div id="all-page">
			<div id="search-bar">
	
				<label>Курс:</label>
				<input 
					className="course-input"
					list="course-select"
					value={course} 
					onChange={(e)=>setCourse(e.target.value)} 
		 		/>
		 		<datalist id="course-select" >
		 			{data.courses.map((e,key)=><option key={key} value={e} />)}		 		
		 		</datalist>
	
				<label>Факультет:</label>
				<input
					className="faculty-input" 
					list="faculty-select"
					value={faculty} 
					onChange={(e)=>setFaculty(e.target.value)} 
				 />
		 		<datalist id="faculty-select" >
		 			{data.facultys.map((e,key)=><option key={key} value={e} />)}	
		 		</datalist>

		 		{/*Скорее всего перенести это на запрос к серверу, долго фильтровать*/}
		 		<button onClick={()=>{
		 			if (!isValidInput()) return;
		 			const filterCourse=(course===""?data.courses:data.courses.filter((e)=>e===course));
		 			const filterFaculty=(faculty===""?data.facultys:data.facultys.filter((e)=>e===faculty));

		 			// const filterGroup=(group===""?filterOrient:filterOrient.map((e)=>{
		 			// 		if (!e.facultys.some((sube)=>sube.groups.includes(group))) return;
		 			// 		return ({
		 			// 			course:e.course,
		 			// 			facultys:e.facultys.map((sube)=>)
		 			// 		});
		 			// 	}));

		 			const newToDisplay={
		 				courses:filterCourse,
		 				facultys:filterFaculty
		 			}
		 			setToDisplay(newToDisplay);
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

			</div>
			<Table data={toDisplay} />
		</div>
	);
}

function Shedule(){
	const [data,setData] = useState({available:false,body:{facultys:[],courses:[]}});
	return(<div>
		{data.available?<ShedulePage data={data.body} />:<button onClick={()=>{
			const newData={
				available:true,
				body:{
					courses:["1","2","3","4","5","6"],
					facultys:["Н1","Н2","Н3","Н4","Н5","Н6","Н7"]
				}
			}
			setData(newData);
		}}>Get this data</button>}
	</div>);
}

function Table(props){
	const [data,setData] = useState(props.data);
	const [toPop,setToPop] = useState(props.data.courses.map(()=>false));
	const [groups,setGroups] = useState([]);

	useEffect(()=>{
		setData(props.data);
		setToPop(props.data.courses.map(()=>false));
	},[props.data]);
    
	function loadGroups(cours,fac){
    	new Promise((ok,err)=>{ok(["БN1-1-1-19","МN1-1-1-19"])}).then((e)=>setGroups(e));

	}
	/*Все менять! слишком громоздко*/
	return(<div>
		{
			data.courses.map((course,num)=><div key={num}>
					<h3 
						onClick={()=>{
							let time=0;
							if (toPop[num]) {
								const node = document.getElementById("drop-"+num);
								if (node === null) return;
								node.className="drop-up";
								time=600;
							}
							setTimeout(function() {setToPop(toPop.map((e_,num_)=>(num===num_)?!e_:e_))}, time);;
						}} 
					> {course}-й курс </h3>
					{(toPop[num])?<div id={"drop-"+num} className="drop-down">
						{data.facultys.map((fuc,num2)=>
							<div key={""+num+num2} >
							<h4 
								onClick={()=>loadGroups(course,fuc)} 
							> Факультет {fuc} </h4>
							{groups.map((e,num3)=><h5 key={""+num+num2+num3}>{e}</h5>)}
							</div>
						)}
							</div>:null}
				</div>)
		}
	</div>);
}

export default Shedule;