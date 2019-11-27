import React, { useState,useEffect,Fragment} from 'react';
import {Link} from 'react-router-dom';
import {filter,Loader,concatUnique,loadGroups} from './essentials';
import './shedule.css';

//Подумать над этим блоком, скорее всего поменять, убрать кнопку
//________________________________________________________________
function Shedule(){
	const [data,setData] = useState({available:false,body:{}});

	function loadBody() {
		return new Promise((resolve,reject)=>{
			setTimeout(()=>resolve({
							courses:["1","2","3","4","5","6"],
							facultys:["H1","H2","H3","H4","H5","H6","H7"]
						}), 600);
		});
	}

	useEffect(()=>{
			loadBody()
			.then((e)=>{
				setData({available:true,body:e});
			})
			.catch((err)=>console.log(err));
		});

	return(<div>
			{data.available?
				<ShedulePage data={data.body} />
				:
				<h1>Loading...</h1>
			}
		</div>);
}
//_________________________________________________________________

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
		 		}}>Find</button>

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
	const [groups,setGroups] = useState([]);
	const [status,setStatus] = useState("close");

	useEffect(()=>{
		if (status==="close") return;
		loadGroups(course,faculty)
		.then((answ)=>{
			if (status==="pending"){
				if (answ.length===0) setStatus("nodata"); else {
				setGroups(concatUnique(groups,answ));
				setStatus("open");
				}
				return;
			}
			if (status==="open")
				if (answ===groups) return; 
				else {
					setGroups(concatUnique(groups,answ));
					return;
				}
			console.log(new Error("unknow status",status));
		})
		.catch((err)=>console.log(err));
	},[status]);

	function handleClick() { 
		if (groups.length===0 && status==="close") setStatus("pending"); else
		setStatus((status==="close")?"open":"close");
	}

	return( <div id="faculty-block">
					<h3 onClick={()=>handleClick()}>Факультет {faculty}</h3>
					{(status==="open")?<h4>OK</h4>:<Loader data={status}/>}
			</div>);
}

export default Shedule;