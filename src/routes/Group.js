import React,{useState,useEffect,Fragment} from 'react';
import {useParams} from 'react-router-dom';
import {loadShedule} from './essentials';
import './group.css';

function Group(props) {
	const {id} =useParams();
	const [shedule,setShedule]=useState(null)

	useEffect(()=>{
		if (shedule) return;
		loadShedule(id)
		.then((answer)=>{
			setShedule(answer);
		})
		.catch((err)=>console.log(err));
	});

	return((shedule)?<GroupPage data={{shedule:shedule}}/>:<h2>Loading...</h2>);
}

function GroupPage(props) {
	const shedule=props.data.shedule;
	const currDate=new Date();
	const [toShow,setToShow]=useState(shedule.filter((e)=>{
									  	const date=new Date(e.date);
									  	return (date>=currDate);
									  }));

	function reset() {
		const newToShow=shedule.filter((e)=>{
			const date=new Date(e.date);
			return (date>=currDate);
		});
		setToShow(newToShow);
	}

	return(<div className="container" id="group-page">
			<SearchBar data={{shedule:shedule,actions:{reset:reset,setToShow:setToShow}}}/>
		    <DataField data={{shedule:toShow}} />
		</div>);
}

function SearchBar(props) {
	const shedule=props.data.shedule;
	const actions=props.data.actions;
	const [date,setDate]=useState("");

	function handleFilter(e) {
		e.preventDefault();
		if (date==="") {
			actions.reset();
			return;
		} 
		const filterDate=new Date(date);
		actions.setToShow(shedule.filter((e)=>{
			const arr=e.date.split('-');
			const date=new Date(arr[0]+'-'+(arr[1]-1)+'-'+arr[2]);
			return (date>=filterDate);
		}))
	}

	return(<form onSubmit={handleFilter}>
				<label htmlFor="curr-group-input">Дата:</label>
				<div id="group-search-bar" className="input-group">
				<input 
				id="curr-group-input" 
				value={date} 
				className="form-control"
				onChange={(e)=>setDate(e.target.value)}></input>
				<div className="input-group-append">
				    <button className="btn btn-outline-secondary" type="button" onClick={handleFilter}>OK</button>
				</div>
				</div>
			</form>
		);
}

function DataField(props) {
	const shedule=props.data.shedule;

	return(<div id="group-data-field">
		{shedule.map((day,num)=>{
			const date=new Date(day.date);
			const printDate=date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
			return(
			<div id="data-element" key={''+num}>
				<h3>{printDate}</h3>
				{day.body.map((lesson,num_)=>{
					const arr=lesson.split('-');
					return(<Fragment key={''+num+num_}>
						<h4>{arr[0]} в {arr[2]}</h4>
						<h5>{arr[1]}</h5>
					</Fragment>);
				})}
			</div>
				);
		})}
		</div>);
}

export default Group;