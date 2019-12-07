import React,{useState,useEffect,Fragment} from 'react';
import {loadShedule,loadAllGroups,saveShedule} from './essentials';
import './sheduleeditor.css';

function SheduleEditor(props) {
	const [groupShedule,setGroupShedule]=useState(null);
	const [group,setGroup]=useState("");

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
		<SearchBar data={{loadShedule:setGroupShedule,group:group,setGroup:setGroup}}/>
		{(groupShedule)?<DataField data={{shedule:groupShedule,group:group,actions:{
															addDay:addDay,
															addLesson:addLesson,
															changeDay:changeDay,
															changeLesson:changeLesson
															}}}/>:null}
		</div>);
}

function SearchBar(props) {
	const [groups,setGroups]=useState(null);
	const [group,setGroup]=[props.data.group,props.data.setGroup];
	const setShedule=props.data.loadShedule;

	useEffect(()=>{
		if (groups) return;
		loadAllGroups().then((answer)=>setGroups(answer));
	});

	function handleLoadShedule() {
		if (group==="") {
			setShedule(null);
			return;
		}
		loadShedule(group)
		.then((answer)=>{
			setShedule(answer);
		})
		.catch((err)=>{
			console.log(err);
			setShedule(null);
		});
	}

	return(<div id="search-bar">
		{(groups)?<Fragment>
				<select value={group} onChange={(e)=>setGroup(e.target.value)} id="group-select" >
					<option value="">Выберите группу</option>
					{groups.map((e,key)=><option key={key} value={e}>{e}</option>)}		 		
				</select>
				<button onClick={()=>handleLoadShedule()}>Показать расписание</button>
			</Fragment>:<h3>Loading...</h3>}
		</div>);
}

function DataField(props) {
	const shedule=props.data.shedule;
	const actions=props.data.actions;
	const group=props.data.group;

	if (shedule===null) return(<h3>Выберите группу</h3>);
	return(<div id="data-field">
			{shedule.map((day,num)=><div key={num}>
				<DayDialog data={{type:"change",group:group,day:day,action:(e)=>actions.changeDay(day,e)}}/>
				</div>)}
			<DayDialog data={{type:"add",group:group,action:actions.addDay}}/>
			</div>);
}

function DayDialog(props) {
	const type=props.data.type;
	const action=props.data.action;
	const group=props.data.group;
	let toDate,toLessons;
	if (type==="change") {
		const day=props.data.day;
		toDate=day.date;
		toLessons=day.body;
	}
	if (type==="add"){
		const curr=new Date();
		toDate=curr.getFullYear()+'-'+curr.getMonth()+'-'+curr.getDate();
		toLessons=[];
	}
	const [open,setOpen]=useState(false);


	function DayDialogBody(props) {
		const [date,setDate]=useState(toDate);
		const [lessons,setLessons]=useState(toLessons);
		const [lesson,setLesson]=useState("");
		const [toRemove,setToRemove]=useState([]);

		function handleAction(){
			action({
				date:date,
				body:lessons.filter((e,num)=>!toRemove.includes(num))
			});
			saveShedule(group,action)
			.then((answer)=>console.log(answer));
			close();
		}
		function handlePushLesson() {
			if (lesson==="") return;
			setLessons(lessons.concat(lesson.split(",")));
			setLesson("");
		}
		function handleRemove(num) {
			if (toRemove.includes(num)) setToRemove(toRemove.filter((e)=>e!==num));
			else setToRemove(toRemove.concat(num));
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
					{lessons.map((e,num)=>
						<h3 
							key={num}
							onClick={()=>handleRemove(num)}
							style={{textDecoration:(toRemove.includes(num))?"line-through":null}}
						>{e}</h3>)}
					<input value={lesson} onChange={(e)=>setLesson(e.target.value)}></input>
					<button onClick={()=>handlePushLesson()}>+</button>
					<div>
						<button onClick={()=>handleAction()}>Сохранить</button>
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