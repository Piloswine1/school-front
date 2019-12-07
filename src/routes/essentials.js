import React from 'react';
import axios from 'axios';

function saveShedule(group,action) {
	return new Promise((resolve,reject)=>{
		axios.post('http://localhost:3001/groupSheduleSave',{group:group,date:action.date,body:action.body})
			 .then((answer)=>resolve(answer.status))
			 .catch((err)=>reject(err));
	})
}
function loadShedule(group) {
	return new Promise((resolve,reject)=>{
		axios.post('http://localhost:3001/groupShedule',{group:group})
			 .then((answer)=>resolve(answer.data))
			 .catch((err)=>reject(err));
	})
}

function loadStudents(group) {
	return new Promise((resolve,reject)=>{
		if (group==="") resolve([]);
		axios.post('http://localhost:3001/groupStudents',{group:group})
			 .then((answer)=>resolve(answer.data))
			 .catch((err)=>reject(err));
	})
}

function loadAllBody() {
	return new Promise((resolve,reject)=>{
		resolve({
					courses:["1","2","3","4","5","6"],
					facultys:["H1","H2","H3","H4","H5","H6","H7"]
				});
	});
}

function testGroup(e,course,faculty) {
	const arr = e.trim().split("-");
	return (arr[1]===faculty && arr[2]===course);
}

function parseGroup(group) {
	return group.trim().split("-");
}

function Loader(props) {
	const status = props.data;
	if (status==="close") return(null);
	if (status==="pending") return(<h5>Loading...</h5>);
	if (status==="nodata") return(<h6>No Data</h6>);
}

function concatUnique(arr1,arr2) {
    return arr1.concat(arr2.filter((e) => !arr1.includes(e)));
}

function loadGroups(course,faculty){
	return new Promise((resolve,reject)=>{
		axios.post('http://localhost:3001/groupsFind',
					{course:course,faculty:faculty})
			 .then((answer)=>resolve(answer.data))
			 .catch((err)=>reject(err));
	});
}

function loadAllGroups() {
	return new Promise((resolve,reject)=>{
		axios.get('http://localhost:3001/groups')
			 .then((answer)=>resolve(answer.data))
			 .catch((err)=>reject(err));
	});
}

export {testGroup,saveShedule,loadShedule,loadStudents,Loader,concatUnique,loadGroups,loadAllGroups,loadAllBody,parseGroup};
