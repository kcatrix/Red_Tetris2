import React from 'react';
import '../App.css';
import { useDispatch } from 'react-redux';
import { showHighScoreOff } from '../reducers/showHighScoreSlice';

export const HighScoreBoard = ({scoresList}) => {

	const dispatch = useDispatch();

	const titleGrid = () => (

		<div className='grid-container'>
			<div className="jtem1">  Player's Name </div>
			<div className="jtem2">	Best score </div>
			<div className="jtem3"> Type </div>
		</div>	
	)

	const displayGrid = () => (

		scoresList.map((score, i) => (
			<div key={i} className='grid-container'>
				<div className="item1">  {score.name} </div>
				<div className="item2">	{score.scores} </div>
				<div className="item3"> {score.nature} </div>
			</div>
		))
	)
	
	return (
		<div>
			{scoresList.length == 0 ? 
				<div>
					<p> No Score Yet </p>
					<div className="button">
						<button onClick={() => dispatch(showHighScoreOff())}> Go Back </button>
					</div>
				</div>
			 : (
				<div>
					<div>
						{titleGrid()}
						{displayGrid()}
						<div className="button">
						<button onClick={() => dispatch(showHighScoreOff())}> Go Back </button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}