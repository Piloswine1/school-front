import React,{useState,useEffect,Fragment} from 'react';
import {loadShedule,loadAllGroups} from './essentials';
import './sheduleeditor.css';

function SheduleEditor(props) {
	const [groupShedule,setGroupShedule]=useState([]);
	const [loaded,setLoaded]=useState("none");

	function addDay(e) {
		setGroupShedule(groupShedule.concat(e));
	}
	function addLesson(day,lesson) {
		setGroupShedule(groupShedule.filter((e)=>e!==day).concat({
			date:day.date,
			body:day.body.concat(lesson)
		}));
	}
	function changeLesson(day,oldLesson,newLesson) {
		setGroupShedule(groupShedule.filter((e)=>e!==day).concat({
			date:day.date,
			body:day.body.filter((lesson)=>lesson!==oldLesson).concat(newLesson)
		}));
	}
	function changeDay(oldDay,newDay) {
		setGroupShedule(groupShedule.filter((e)=>e!==oldDay).concat(newDay));
	}

	return(<div id="shedule-editor-page">
		<SearchBar data={{loadShedule:setGroupShedule,setLoad:setLoaded}}/>
		<DataField data={{shedule:groupShedule,status:loaded,actions:{
														addDay:addDay,
														addLesson:addLesson,
														changeDay:changeDay,
														changeLesson:changeLesson
														}}}/>
		</div>);
}

function SearchBar(props) {
	const [group,setGroup]=useState("");
	const setShedule=props.data.loadShedule;
	const setLoad=props.data.setLoad;

	function handleLoadShedule() {
		loadShedule()
		.then((answer)=>{
			setShedule(answer);
			setLoad("ok");
		})
		.catch((err)=>console.log(err));
	}

	return(<div id="search-bar">
		<label>Группа:</label>
		<input value={group} onChange={(e)=>setGroup(e.target.value)}></input>
		<button onClick={()=>handleLoadShedule()}>Показать расписание</button>
		</div>);
}

function DataField(props) {
	const [shedule,setShedule]=useState(props.data.shedule);
	const status=props.data.status;
	const actions=props.data.actions;

	useEffect(()=>setShedule(props.data.shedule),[props.data.shedule]);

	return(<div id="data-field">
			{shedule.map((day,num)=><div key={num}>
				<DayDialog data={{type:"change",day:day,action:(e)=>actions.changeDay(day,e)}}/>
				</div>)}
			{(status==="none")?null:<DayDialog data={{type:"add",action:actions.addDay}}/>}
			</div>);
}

function DayDialog(props) {
	let toDate,toLessons;
	const type=props.data.type;
	const action=props.data.action;
	if (type==="change") {
		const day=props.data.day;
		toDate=day.date;
		toLessons=day.body;
	}
	if (type==="add"){
		const curr=new Date();
		toDate=curr.getDate()+'-'+(curr.getMonth()+1)+'-'+curr.getFullYear();
		toLessons=[];
	}
	const [open,setOpen]=useState(false);

	// useEffect(()=>{
	// 	if (type!=="change") return;
	// 	const day=props.data.day;
	// 	setDate(day.date);
	// 	setLessons(day.body);
	// },[props.data.day]);


	function DayDialogBody(props) {
		const [date,setDate]=useState(toDate);
		const [lessons,setLessons]=useState(toLessons);
		const [lesson,setLesson]=useState("");

		function handleAction(){
			action({
				date:date,
				body:lessons
			});
			close();
		}
		function handlePushLesson() {
			if (lesson==="") return;
			setLessons(lessons.concat(lesson.split(",")));
			setLesson("");
		}
		function close() {
			setLessons(toLessons);
			setLesson("");
			setOpen(false);
		}

		return(	<div id="day-dialog-body">
					<label>Дата</label>
					<input value={date} onChange={(e)=>setDate(e.target.value)}></input>
					<label>Занятия</label>
					{lessons.map((e,num)=><h3 key={num}>{e}</h3>)}
					<input value={lesson} onChange={(e)=>setLesson(e.target.value)}></input>
					<button onClick={()=>handlePushLesson()}>+</button>
					<div>
						<button onClick={()=>handleAction()}>Добавить</button>
						<button onClick={()=>close()}>Закрыть</button>
					</div>
				</div>);
	}

	if (type==="change") return(
		<div id="change-day-dialog">
			<h3 onClick={()=>setOpen(true)}>{props.data.day.date}</h3>
			{(open)?<DayDialogBody />
			:
			<Fragment>{props.data.day.body.map((e,num)=><h4 key={num}>{e}</h4>)}</Fragment>}	
		</div>
	);

	if (type==="add") return(
		<div id="add-day-dialog">
			{(open)?<DayDialogBody />
			:
			<button onClick={()=>setOpen(true)}>Добавить день</button>}		
		</div>
	);
}

export default SheduleEditor;