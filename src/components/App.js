import React, {Placeholder} from "react";
import {  createFetcher } from "../future";
import Spinner from "./Spinner";
import IndexPage from "./IndexPage";
import "./App.css";

const moviePageFetcher = createFetcher(() => import("./MoviePage"));

function AppSpinner() {
  return (
    <div className="AppSpinner">
      <Spinner size="large" />
    </div>
  );
}

function MoviePageLoader(props) {
  const MoviePage = moviePageFetcher.read().default;
  return <MoviePage {...props} />;
}

export default class App extends React.Component {
  state = {
    currentMovieId: null,
    showDetail: false
  };

  render() {
    const { showDetail, currentMovieId } = this.state;
    return (
      <div className="App">
        <div>
          {showDetail && (
            <div className="back-link" onClick={this.handleBackClick}>
              ➜
            </div>
          )}
          <Placeholder delayMs={1500} fallback={<AppSpinner />}>
            {!showDetail ? (
              <IndexPage
                loadingMovieId={currentMovieId}
                onMovieClick={this.handleMovieClick}
              />
            ) : (
              <MoviePageLoader movieId={currentMovieId} />
            )}
          </Placeholder>
        </div>
      </div>
    );
  }

  handleMovieClick = movieId => {
    this.setState({ currentMovieId: movieId, showDetail: true });
  };

  handleBackClick = () => {
    this.setState({ currentMovieId: null, showDetail: false });
  };
}
