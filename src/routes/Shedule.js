import React, { useState,useEffect,Fragment} from 'react';
import {Link} from 'react-router-dom';
import {Loader,concatUnique,loadGroups,loadAllBody} from './essentials';
import './shedule.css';

function Shedule(){
	const [data,setData]=useState(null);

	useEffect(()=>{
			if (data) return;
			loadAllBody()
			.then((e)=>{
				setData(e);
			})
			.catch((err)=>console.log(err));
	});

	return(<div>
			{(data)?
				<ShedulePage data={data} />
				:
				<h1>Loading...</h1>
			}
		</div>);
}

function ShedulePage(props){
	const data = props.data;
	const [course, setCourse] = useState("");
	const [faculty, setFaculty] = useState("");
	const [toDisplay,setToDisplay] = useState(props.data);

	function isValidInput(){
		if (!data.courses.includes(course)) if (course!=="") return false;
		if (!data.facultys.includes(faculty)) if (faculty!=="") return false;
		return true;
	}

	return(
		<div id="ShedulePage">
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

		 		<button onClick={()=>{
		 			if (!isValidInput()) return;
		 			const filterCourse=(course===""?data.courses:data.courses.filter((e)=>e===course));
		 			const filterFaculty=(faculty===""?data.facultys:data.facultys.filter((e)=>e===faculty));
		 			const newToDisplay={
		 				courses:filterCourse,
		 				facultys:filterFaculty
		 			}
		 			setToDisplay(newToDisplay);
		 		}}>Найти</button>

		 		<button onClick={()=>setToDisplay({
		 			courses:data.courses,
		 			facultys:data.facultys
		 		})}>Показать все группы</button>

			</div>
			<DataTable data={toDisplay} />
		</div>
	);
}


function DataTable(props){
	const [data,setData]=useState(props.data);
	const [toShow,setToShow]=useState(false);

	useEffect(()=>{
		const newToShow=props.data.courses.map(()=>false);
		setToShow(newToShow);
		setData(props.data);
	},[props.data]);

	function handleClick(num){
		const newToShow=toShow.map((e,num_)=>(num===num_)?!e:e);
		setToShow(newToShow);
	}
	
	return (<div 
		id="data-table"
		>
		{data.courses.map((course,num)=>
			<Fragment key={num}>
				<h2
					onClick={()=>handleClick(num)}
				>{course}-Й Курс</h2>
					{(toShow[num])?<CourseBlock key={num} data={{course:course,facultys:data.facultys}} />:null}
			</Fragment>)}
		</div>);
}

function CourseBlock(props){
	const [course,facultys]=[props.data.course,props.data.facultys];

	return (<div id="course-block">
			{facultys.map((faculty,num)=>
				<Fragment key={num}>
					<FacultyBlock data={{course:course,faculty:faculty}} />
				</Fragment>)}
			</div>);
}

function FacultyBlock(props) {
	const [course,faculty] = [props.data.course,props.data.faculty];
	const [groups,setGroups] = useState(null);
	const [answer,setAnswer] = useState(null);
	const [status,setStatus] = useState("close");

	useEffect(()=>{
		if (status!=='pending') return;
		if (answer===null) return;
		if (answer===groups) return;
		console.log(groups,status);
		if (!Array.isArray(answer)) console.log(new Error("wrong answer"));
		if (answer.length===0) {
			setStatus("nodata");
			return;
		}
		setGroups(concatUnique(answer,groups||[]));
		setStatus("open");
	},[answer,groups,status]);

	function handleClick() { 
		if (groups) setStatus((status==="close")?"open":"close");
		if (status==="nodata") setStatus("close");
		if (groups===null && status==="close") {
			setStatus("pending");
			setAnswer(null);
			loadGroups(course,faculty)
			.then((answer)=>setAnswer(answer))
			.catch((err)=>console.log(err));
		} 
		console.log(groups,status);
	}

	return( <div id="faculty-block">
					<h3 onClick={()=>handleClick()}>Факультет {faculty}</h3>
					{(status==="open")?<div>{groups.map((e,num)=><Fragment  key={num}><Link to={"/shedule/"+e}>{e}</Link> </Fragment>)}</div>:<Loader data={status}/>}
			</div>);
}

export default Shedule;