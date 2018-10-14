import React, {unstable_Suspense as Suspense} from 'react'
import {unstable_scheduleCallback} from 'scheduler'
import {createResource} from 'react-cache'
import {cache} from '../cache'
import Spinner from './Spinner'
import IndexPage from './IndexPage'
import './App.css'

const moviePageFetcher = createResource(() => import('./MoviePage'))

function AppSpinner() {
	return (
		<div className="AppSpinner">
			<Spinner size="large"/>
		</div>
	)
}

function MoviePageLoader(props) {
	const MoviePage = moviePageFetcher.read(cache).default
	return <MoviePage {...props} />
}

export default class App extends React.Component {
	state = {
		currentMovieId: null,
		showDetail: false
	}
	handleMovieClick = id => {
		this.setState({
			currentMovieId: id
		})
		unstable_scheduleCallback(() =>
			this.setState({
				showDetail: true
			})
		)
	}
	handleBackClick = () => {
		this.setState({currentMovieId: null, showDetail: false})
	}


	render() {
		const {showDetail, currentMovieId} = this.state
		return (
			<div className="App">
				<div>
					{showDetail && (
						<div className="back-link" onClick={this.handleBackClick}>
							➜
						</div>
					)}
					<Suspense maxDuration={1500} fallback={<AppSpinner/>}>
						{!showDetail ? (
							<IndexPage
								loadingMovieId={currentMovieId}
								onMovieClick={this.handleMovieClick}
							/>
						) : (
							<MoviePageLoader movieId={currentMovieId}/>
						)}
					</Suspense>
				</div>
			</div>
		)
	}
}
