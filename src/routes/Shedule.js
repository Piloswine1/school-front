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

//Подумать над этим блоком, скорее всего поменять, убрать кнопку
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
	const [groups,setGroups] = useState({course:null,faculty:null,arr:[]});

	useEffect(()=>{
		setData(props.data);
		//сброс анимации при изменении данных
		cleanUpAnimation();

	},[props.data]);

	function cleanUpAnimation() {
		//очистка анимации для блоков в массиве ['1','2']		
		for (let num in ["1","2"]){
		const nodes = document.getElementsByClassName("drop-down-"+num);
		for (let i=0;i<nodes.length;i++) nodes[i].style.maxHeight=null;
		}
	}
    
	function loadGroups(course,fac){
		if (groups.course===course && groups.faculty===fac) return;

		//Добавить фетч + сделать подгрузку новых групп (сейчас происходит перезапись)
    	const newGrops={course:course,faculty:fac,arr:(course==="1")?["БН1-1-1-19"]:["МН1-2-1-19"]};
    	//

    	setGroups(newGrops);
	}

	function invokeDrop(e){
    	if (e === null) return;
    	if (e.style.maxHeight){
    	  e.style.maxHeight = null;
    	} else {
    	  e.style.maxHeight = e.scrollHeight + "px";
    	}
	}

	function clickOnCourse(e){
		if (e===null) console.log(new Error("got null"));
		const elem=e.target.nextSibling;
		invokeDrop(elem);
	}

	function clickOnFac(e,course,fac){
		if (e===null) console.log(new Error("got null"));
		loadGroups(course,fac);
		const elem=e.target.nextSibling;
	}

	/*Еще подумать над компоновкой*/
	return(<div  id="course-block">
		{
			data.courses.map((course,num)=><div key={num}>
					<h3 
						onClick={(e)=>clickOnCourse(e)} 
					> {course}-й курс </h3>

					<div className="drop-down-1">
						{data.facultys.map((fac,num2)=>
							<div key={""+num+num2} >
								<h4 
									onClick={(e)=>clickOnFac(e,course,fac)} 
								> Факультет {fac} </h4>
								{/*Поменять условие, чтобы отображалось несколько групп (сейчас отображается только одна)*/}
								{(groups.course===course && groups.faculty===fac)?<GroupsBlock data={groups} />:null}
							</div>
						)}
					</div>

				</div>)
		}
	</div>);
}

function GroupsBlock(props){
		const [data,setData] = useState(props.data.arr);

		useEffect(()=>{
			setData(props.data.arr);
			//мб подумать над анимацией (при mount блока делать анимацию)
			//анимация все еще некорректно отображаается
		},[props.data]);

		return( <div >
					{data.map((e,num)=><h5 key={""+num}>{e}</h5>)}
				</div>);
	}

export default Shedule;