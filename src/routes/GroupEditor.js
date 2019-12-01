import React,{useState,Fragment,useEffect} from 'react';
import {Link} from 'react-router-dom';
import './groupeditor.css';
import {loadGroups,parseGroup,loadAllGroups,loadAllBody,testGroup} from './essentials'

function GroupEditor(props) {
	const [groups,setGroups]=useState([]);
	const [courses,setCourses]=useState([]);
	const [facultys,setFacultys]=useState([]);
	const [available,setAvailable]=useState(false);

	useEffect(()=>{
		if (available) return;
		loadAllBody()
		.then((answer)=>{
			setCourses(answer.courses);
			setFacultys(answer.facultys);
			loadAllGroups()
			.then((answer_)=>{
				setGroups(answer_);
				setAvailable(true);
			})
			.catch((err)=>console.log(err));
		})
		.catch((err)=>console.log(err));
	},[available]);



	return(<div id="group-editor-page">
		{available? <Editor 
						data={{meta: 
								{
									courses:courses,
									facultys:facultys
								},
							   	groups:groups,
							   	reloadAction:()=>setAvailable(false),
							   	setters:[setGroups,
							   			 setCourses,
							   			 setFacultys]
							 }}
					/>
					:
					<h1>Loading...</h1>}
	</div>);
}

function Editor(props) {
	const reloadAction=props.data.reloadAction;
	const groups=props.data.groups;
	const data=props.data.meta;
	const [setGroups,setCourses,setFacultys]=props.data.setters;
	const [toShow,setToShow]=useState(props.data.meta);
	const [open,setOpen]=useState(false);
	const [dialogGroup,setDialogGroup]=useState("");

	function addGroup(e) {
		setGroups(groups.concate(e));
	}
	function changeGroup(oldGroup,newGroup) {
		setGroups(
				groups
				.filter((e)=>e!==oldGroup)
				.concate(newGroup)
				);
	}
	function addFaculty(e) {
		setFacultys(data.facultys.concate(e));
		setToShow({
			courses:toShow.courses,
			facultys:toShow.facultys.concate(e)
		});
	}
	function deleteFaculty(faculty) {
			setFacultys(data.facultys.filter((e)=>e!==faculty));
			setToShow({
				courses:toShow.courses,
				facultys:toShow.facultys.filter((e)=>e!==faculty)
			});
	}
	function addCourse(e) {
		setCourses(data.courses.concate(e));
		setToShow({
			courses:toShow.courses.concate(e),
			facultys:toShow.facultys
		});
	}
	function deleteCourse(course) {
		setCourses(data.courses.filter((e)=>e!==course));
		setToShow({
			courses:toShow.courses.filter((e)=>e!==course),
			facultys:toShow.facultys
		});
	}
	function openDialogWithFields(course,faculty) {
		setDialogGroup('-'+faculty+'-'+course+'-');
		setOpen(true);
	}

	return(<Fragment>
		{(open)?<Dialog data={{type:"global",group:dialogGroup,saveAction:addGroup,closeAction:()=>setOpen(false)}}/>:null}
		<button onClick={()=>reloadAction()}>Перезагрузить</button>
		<ToolBar data={{meta:data,setToShow:setToShow}}/>
		<DataField data={{toShow:toShow,groups:groups,actions:{
																addGroup:addGroup,
																changeGroup:changeGroup,
																addFaculty:addFaculty,
																deleteFaculty:deleteFaculty,
																addCourse:addCourse,
																deleteCourse:deleteCourse,
																openDialog:()=>setOpen(true),
																openDialogWithFields:openDialogWithFields
															  }}}/>
		</Fragment>);
}

function ToolBar(props) {
	const data=props.data.meta;
	const setToShow=props.data.setToShow;
	const [courses, setCourses] = useState("");
	const [facultys, setFacultys] = useState("");

	function handleChoice() {
		let newCourses=[];
		let newFacultys=[];
		if (courses==="") {
			newCourses=data.courses;
		}else{
			newCourses=courses.trim().split(",");
			if (newCourses.some((e)=>!/\d+/g.exec(e))) return false;	
			if (newCourses.some((e)=>!data.courses.includes(e))) return false;		
		}
		if (facultys===""){
			newFacultys=data.facultys;

		}else{
			newFacultys=facultys.trim().split(",");
			if (newFacultys.some((e)=>!/^[A-Z]\d+/g.exec(e))) return false;
			if (newFacultys.some((e)=>!data.facultys.includes(e))) return false;
		}
		setToShow({
			courses:newCourses,
			facultys:newFacultys,
		});
	}
	function handleAllLoad() {
		setToShow(data);		
	}

	return(<div id="tool-bar">
		<button onClick={()=>handleAllLoad()}>Показать все группы</button>
		<label>Курсы:</label>
		<input value={courses} onChange={(e)=>setCourses(e.target.value)}/>
		<label>Факультеты:</label>
		<input value={facultys} onChange={(e)=>setFacultys(e.target.value)}/>
		<button onClick={()=>handleChoice()}>Показать выбранные</button>
		</div>);
}

function DataField(props) {
	const data=props.data.toShow;
	const groups=props.data.groups;
	const action=props.data.actions;

	return(<div id="data-field">
			{data.courses.map((course,num)=><div key={''+num}>
				<h2>{course}-курс</h2>
				{data.facultys.map((faculty,num_)=><div key={''+num+num_}>
					<h3>Факультет {faculty}</h3>
					<h4>Группы:</h4>
					{groups.map((group,num__)=>(testGroup(group,course,faculty))?
						<Element 
							key={''+num+num_+num__}
							data={{
								group:group,
								actions:{
									changeGroup:action.changeGroup
								}
							}}
						/>
						:
						null)}
					<button onClick={(e)=>action.openDialogWithFields(course,faculty)}>AddGroup</button>
					</div>)}	
					<button >add faculty...</button>
			</div>)}
			<button >add course...</button>
		</div>);
}

function Element(props) {
	const group=props.data.group;
	const changeGroup=props.data.actions.changeGroup;
	const [open,setOpen]=useState(false);

	return(<Fragment>
		<h5 onClick={()=>setOpen(!open)}>{group}</h5>
		{(open)?<Dialog data={{type:"local",group:group,saveAction:(e)=>changeGroup(group,e),closeAction:()=>setOpen(false)}}/>:null}
		</Fragment>)
}

function Dialog(props) {
	const arr=(props.data.group==="")?["","","",""]:props.data.group.split("-");
	const [edType,setEdType]=useState(arr[0]);
	const [faculty,setFaculty]=useState(arr[1]);
	const [course,setCourse]=useState(arr[2]);
	const [groupNum,setGroupNum]=useState(arr[3]);
	const close=props.data.closeAction;
	const saveAction=props.data.saveAction;
	const type=props.data.type;

	function handleSave() {
		if (edType==="") return;
		if (faculty==="") return;
		if (course==="") return;
		if (groupNum==="") return;
		console.log(edType+'-'+faculty+'-'+course+'-'+groupNum);
		close();
	}

	return(<div id="dialog-wrapper"
				className={type} 
				onWheel={(e)=>(type==="global")?e.preventDefault():null}
				style={(type==="global")?{top:100}:null}
			>
		<div id="dialog-body" className={type}>
		<label>Тип обучения</label>
		<input value={edType} onChange={(e)=>setEdType(e.target.value)}></input>
		<label>Факультет</label>
		<input value={faculty} onChange={(e)=>setFaculty(e.target.value)}></input>
		<label>Курс</label>
		<input value={course} onChange={(e)=>setCourse(e.target.value)}></input>
		<label>Номер группы</label>
		<input value={groupNum} onChange={(e)=>setGroupNum(e.target.value)}></input>
			<div>
			<button onClick={()=>handleSave()}>Сохранить изменения</button>
			<button onClick={()=>close()}>Закрыть</button>
			</div>
		</div>
		</div>);
}

export default GroupEditor;