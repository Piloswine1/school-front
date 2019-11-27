import React from 'react';

function Loader(props) {
	const status = props.data;
	if (status==="close") return(null);
	if (status==="pending") return(<h5>Loading...</h5>);
	if (status==="nodata") return(<h6>No Data</h6>);
}

function filter(e,course,faculty) {
	const arr = e.trim().split("-");
	return (arr[1]===faculty && arr[2]===course);
}

function concatUnique(arr1,arr2) {
    return arr1.concat(arr2.filter((e) => arr1.indexOf(e) < 0));
}

function loadGroups(course,faculty){
	return new Promise((resolve,reject)=>setTimeout(function() {
		if (course==="1" && faculty==="H1") resolve(["B-H1-1-11","M-H1-1-11","B-H1-1-23","Bk-H1-1-33"]);
		if (course==="1" && faculty==="H2") resolve(["B-H2-1-11","M-H2-1-11","B-H2-1-23","Bk-H2-1-33"]);
		if (course==="2" && faculty==="H2") resolve(["B-H2-2-11","M-H2-2-11","B-H2-2-23","Bk-H2-2-33"]);
		if (course==="3" && faculty==="H3") resolve(["B-H3-3-33","M-H3-3-33","B-H3-3-23","Bk-H3-3-33"]);
		if (course==="4" && faculty==="H4") resolve(["B-H4-4-44","M-H4-4-44","B-H4-4-23","Bk-H4-4-33"]);
		resolve([]);
	},1000));
}

export {filter,Loader,concatUnique,loadGroups};
