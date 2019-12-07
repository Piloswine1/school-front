import React,{useState,Fragment,useEffect} from 'react';
import './groupeditor.css';
import {loadStudents,loadAllGroups,saveGroup,updateGroup,loadAllBody,parseGroup} from './essentials'

function GroupEditor(props) {
	const [groups,setGroups]=useState(null);
	const [courses,setCourses]=useState(null);
	const [facultys,setFacultys]=useState(null);

	useEffect(()=>{
		if (groups) return;
		loadAllBody()
		.then((answer)=>{
			loadAllGroups()
			.then((answer_)=>{
				setGroups(answer_);
				setCourses(answer.courses);
				setFacultys(answer.facultys);
			})
			.catch((err)=>console.log(err));
		})
		.catch((err)=>console.log(err));
	});



	return(<div id="group-editor-page">
		{(groups && courses && facultys)?  <Editor 
						data={{meta: 
								{
									courses:courses,
									facultys:facultys,
									groups:(groups)=>{
										var arr=[];
										groups.forEach((e)=>{
											const group=parseGroup(e);
											const index=arr.findIndex((e)=>(e.faculty===group.faculty && e.course===group.course));
											if (index===-1) arr.push({faculty:group.faculty,course:group.course,groups:[e]});
											else arr[index].groups.push(e);
										});
										return arr;
									}
								},
							   	groups:groups,
							   	reloadAction:()=>setGroups(null),
							   	setGroups:setGroups
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
	const setGroups=props.data.setGroups;
	const [toShow,setToShow]=useState(props.data.meta);
	const [dialogGroup,setDialogGroup]=useState(null);

	function addGroup(group) {
		if (groups.includes(group)) return;
		setGroups(groups.concat(group));
	}
	function changeGroup(oldGroup,newGroup) {
		setGroups(groups.filter((e)=>e!==oldGroup).concat(newGroup));
	}
	function openDialogWithFields(course,faculty) {
		document.body.style.overflow="hidden";
		setDialogGroup('-'+faculty+'-'+course+'-');
	}

	return(<Fragment>
		{(dialogGroup)?<GroupDialog 
							data={{ type:"global",
									group:dialogGroup,
									saveAction:(e)=>{
										addGroup(e.group);
										saveGroup(e);
									},
									closeAction:()=>{
										document.body.style.overflow=null;
										setDialogGroup(null);
									}}}
						/>:null}
		<button onClick={()=>reloadAction()}>Перезагрузить</button>
		<ToolBar data={{meta:data,toShow:toShow,setToShow:setToShow}}/>
		<DataField data={{toShow:toShow,groups:groups,changeGroup:changeGroup,openDialog:openDialogWithFields}}/>
		</Fragment>);
}

function ToolBar(props) {
	const data=props.data.meta;
	const [toShow,setToShow]=[props.data.toShow,props.data.setToShow];
	const [courses, setCourses] = useState("");
	const [facultys, setFacultys] = useState("");

	function handleChoice() {
		let newCourses=[];
		let newFacultys=[];
		if (courses==="") {
			newCourses=data.courses;
		}else{
			newCourses=courses.trim().split(",");
			if (newCourses.some((e)=>!/\d+/g.test(e))) return false;	
			if (newCourses.some((e)=>!data.courses.includes(e))) return false;		
		}
		if (facultys===""){
			newFacultys=data.facultys;

		}else{
			newFacultys=facultys.trim().split(",");
			if (newFacultys.some((e)=>!/^[A-Z]\d+/g.test(e))) return false;
			if (newFacultys.some((e)=>!data.facultys.includes(e))) return false;
		}
		setToShow({
			courses:newCourses,
			facultys:newFacultys,
			groups:toShow.groups
		});
	}
	function handleAllLoad() {
		setToShow(data);		
	}

	return(<div id="tool-bar">
		<button onClick={()=>handleAllLoad()}>Показать все группы</button>
		<div>
			<label>Курсы:</label>
			<input value={courses} onChange={(e)=>setCourses(e.target.value)}/>
			<label>Факультеты:</label>
			<input value={facultys} onChange={(e)=>setFacultys(e.target.value)}/>
			<button onClick={()=>handleChoice()}>Показать выбранные</button>
		</div>
		</div>);
}

function DataField(props) {
	const data=props.data.toShow;
	const groups=props.data.groups;
	const groupsToShow=data.groups(groups);
	const changeGroup=props.data.changeGroup;
	const openDialog=props.data.openDialog;

	function showElements(course,faculty) {
		const index = groupsToShow.findIndex((e)=>(e.faculty===faculty&&e.course===course)); 
		if (index===-1) return null;
		const arr = groupsToShow[index].groups.map((group,num)=>
			<Element 
				key={'e'+num}
				data={{
					group:group,
					changeGroup:changeGroup
				}}
			/>);
		return arr;
	}

	return(<div id="data-field">
			{data.courses.map((course,num)=><div key={''+num}>
				<h2>{course}-курс</h2>
				{data.facultys.map((faculty,num_)=><div key={''+num+num_}>
					<h3>Факультет {faculty}</h3>
					<h4>Группы:</h4>
					{showElements(course,faculty)}
					<button onClick={(e)=>openDialog(course,faculty)}>Добавить группу</button>
					</div>)}	
			</div>)}
		</div>);
}

function Element(props) {
	const group=props.data.group;
	const changeGroup=props.data.changeGroup;
	const [open,setOpen]=useState(false);

	return(<Fragment>
		<h5 onClick={()=>setOpen(!open)}>{group}</h5>
		{(open)?<GroupDialog 
					data={{type:"local",
							group:group,
							saveAction:(e)=>{
								changeGroup(group,e.group);
								updateGroup(group,e);
							},
							closeAction:()=>setOpen(false)
						  }}
				/>:null}
		</Fragment>)
}

function GroupDialog(props) {
	const group=props.data.group;
	const arr=(group==="")?["","","",""]:group.split("-");
	const [edType,setEdType]=useState(arr[0]);
	const [faculty,setFaculty]=useState(arr[1]);
	const [course,setCourse]=useState(arr[2]);
	const [groupNum,setGroupNum]=useState(arr[3]);
	const [students,setStudents]=useState(null);
	const [toRemove,setToRemove]=useState([]);
	const close=props.data.closeAction;
	const saveAction=props.data.saveAction;
	const type=props.data.type;

	useEffect(()=>{
		if (students) return;
		loadStudents(group)
		.then((answer)=>{
			setStudents(answer);
		})
		.catch((err)=>console.log(err));
	},[students,group]);

	function handleSave() {
		if (!/^[BMS|Bk]$/g.test(edType)) return;
		if (!/^[A-Z]\d+$/g.test(faculty)) return;
		if (!/^\d+$/g.test(course)) return;
		if (!/^\d+$/g.test(groupNum)) return;
		const newGroupName=edType+'-'+faculty+'-'+course+'-'+groupNum;
		const newGroup={group:newGroupName,students:students.filter((e,num)=>!toRemove.includes(num))};
		saveAction(newGroup);
		close();
	}
	function handleRemove(num) {
		if (toRemove.includes(num)) setToRemove(toRemove.filter((e_)=>e_!==num));
		else setToRemove(toRemove.concat(num));
	}

	return(<div id="group-dialog-wrapper"
				className={type} 
				style={(type==="global")?{top:window.scrollY}:null}
			>
		<div id="group-dialog-body"  className={type}>
		<label>Тип обучения</label>
		<input 	value={edType} 
			   	className={(/^[BMS|Bk]$/g.test(edType))?"ok":(edType)?"error":"none"}
			   	onChange={(e)=>setEdType(e.target.value)}
		></input>
		<label>Факультет</label>
		<input 	value={faculty} 
				className={(/^[A-Z]\d+$/g.test(faculty))?"ok":(faculty)?"error":"none"} 
				onChange={(e)=>setFaculty(e.target.value)}
		></input>
		<label>Курс</label>
		<input 	value={course} 
				className={(/^\d+$/g.test(course))?"ok":(course)?"error":"none"} 
				onChange={(e)=>setCourse(e.target.value)}
		></input>
		<label>Номер группы</label>
		<input 	value={groupNum} 
				className={(/^\d+$/g.test(groupNum))?"ok":(groupNum)?"error":"none"} 
				onChange={(e)=>setGroupNum(e.target.value)}></input>
		<StudentsList data={{addStudentAction:(name)=>{
			if (name==="") return;
			setStudents(students.concat(name.trim().split(',')));
		},
							 toRemove:toRemove,
							 handleRemove:handleRemove,
							 students:(students)}}/>
			<div>
			<button className="button" onClick={()=>handleSave()}>Сохранить изменения</button>
			<button className="button" onClick={()=>close()}>Закрыть</button>
			</div>
		</div>
		</div>);
}

function StudentsList(props) {
	const [list,setList]=[props.data.students,props.data.addStudentAction];
	const [toRemove,handleRemove]=[props.data.toRemove,props.data.handleRemove];
	const [toShow,setToShow]=useState(false);

	function AddStudent() {
		const [name,setName]=useState("");
		return (<Fragment>
			<input value={name} onChange={(e)=>setName(e.target.value)} />
			<button id="group-plus-button" onClick={()=>setList(name)}>+</button>
		</Fragment>);
	}

	return(<div id="students-list">
		<h4 onClick={()=>setToShow(!toShow)} id="button" className={(toShow)?"true":"false"} >Студенты {(toShow)?'v':'>'}</h4>
		{(toShow)?<div id="list-body">
			{(list)?list.map((e,num)=>
				<Fragment key={num}>
					<h5 
						style={{textDecoration:(toRemove.includes(num))?"line-through":null}} 
						onClick={()=>handleRemove(num)}
					>{e}</h5>
				</Fragment>)
			:
			<h4>Loading...</h4>}
			<AddStudent />
		</div>:null}
	</div>);
}

export default GroupEditor;