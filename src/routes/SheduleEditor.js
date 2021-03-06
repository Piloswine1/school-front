import React,{useState,useEffect,Fragment} from 'react';
import {loadShedule,loadAllGroups,saveShedule,updateShedule} from './essentials';
import './sheduleeditor.css';

function SheduleEditor(props) {
	const [groupShedule,setGroupShedule]=useState(null);
	const [group,setGroup]=useState("");

	function addDay(e) {
		setGroupShedule(groupShedule.concat(e));
		saveShedule(group,e);
	}
	function changeDay(oldDay,newDay) {
		setGroupShedule(groupShedule.filter((e)=>e!==oldDay).concat(newDay));
		updateShedule(group,oldDay,newDay);
	}

	return(<div className="container" id="shedule-editor-page">
		<SearchBar data={{loadShedule:setGroupShedule,group:group,setGroup:setGroup}}/>
		{(groupShedule)?<DataField data={{shedule:groupShedule,group:group,actions:{
															addDay:addDay,
															changeDay:changeDay
															}}}/>:null}
		</div>);
}

function SearchBar(props) {
	const [groups,setGroups]=useState(null);
	const [group,setGroup]=[props.data.group,props.data.setGroup];
	const setShedule=props.data.loadShedule;

	useEffect(()=>{
		if (groups) return;
		console.log(groups);
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
				<div className="input-group mb-3">
				  <select className="custom-select" value={group} onChange={(e)=>setGroup(e.target.value)} id="group-select">
				    <option value="">Выберите группу</option>
					{groups.map((e,key)=><option key={key} value={e}>{e}</option>)}
				  </select>
				  <div className="input-group-append">
				    <button className="btn btn-outline-secondary" onClick={()=>handleLoadShedule()} type="button">Показать расписание</button>
				  </div>
				</div>	
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
			if (isNaN(Date.parse(date))) return;
			action({
				date:date,
				body:lessons.filter((e,num)=>!toRemove.includes(num))
			});
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

		return(	<div id="day-dialog-wrapper">
				<div className="form-group" id="day-dialog-body">
					<label htmlFor="day-dialog-input" >Дата</label>
					<input 
					value={date} 
					id="day-dialog-input" 
					className={(!isNaN(Date.parse(date)))?"ok":(date)?"error":"none"} 
					onChange={(e)=>setDate(e.target.value)}></input>
					<label>Занятия</label>
					{lessons.map((e,num)=>
						<h3 
							key={num}
							onClick={()=>handleRemove(num)}
							style={{textDecoration:(toRemove.includes(num))?"line-through":null}}
						>{e}</h3>)}
					<div className="input-group">
						<input value={lesson} className="form-control" onChange={(e)=>setLesson(e.target.value)}></input>
						<div className="input-group-append">
							<button className="btn btn-primary" onClick={()=>handlePushLesson()}>+</button>
						</div>
					</div>
					<div className="container">
						<button className="btn btn-primary" onClick={()=>handleAction()}>Сохранить</button>
						<button className="btn btn-primary" onClick={()=>close()}>Закрыть</button>
					</div>
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
			<button className="btn btn-primary" onClick={()=>setOpen(true)}>Добавить день</button>}		
		</div>
	);
}

export default SheduleEditor;