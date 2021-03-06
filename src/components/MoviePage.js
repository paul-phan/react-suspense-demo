import React, {unstable_Suspense as Suspense} from "react";
import { fetchMovieDetails, fetchMovieReviews } from "../api";

import {createResource} from 'react-cache';
import {cache} from '../cache'
import Icon from "./Icon";
import Spinner from "./Spinner";
import "./MoviePage.css";

const movieDetailsFetcher = createResource(fetchMovieDetails);
const movieReviewsFetcher = createResource(fetchMovieReviews);

function Rating({ label, score, icon }) {
  if (typeof score !== "number" || score < 0) return null;
  return (
    <div className="Rating">
      <div className="small-title">{label}</div>
      {icon && (
        <div>
          <Icon type={icon} size="medium" />
        </div>
      )}
      <div className="rating-score">{score}%</div>
    </div>
  );
}

function MovieReview({ quote, critic }) {
  return (
    <div className="MovieReview box">
      <div>{quote}</div>
      <div className="sub-text">{critic.name}</div>
    </div>
  );
}

function MovieReviews({ movieId }) {
  const reviews = movieReviewsFetcher.read(cache, movieId);
  return (
    <div className="MovieReviews">
      {reviews.map(review => <MovieReview key={review.id} {...review} />)}
    </div>
  );
}

const imageFetcher = createResource(
  src =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(src);
      image.onerror = reject;
      image.src = src;
    })
);

function Img(props) {
  return <img {...props} src={imageFetcher.read(cache,props.src)} />;
}

function MovieDetails({ movieId }) {
  const { ratingSummary, ratings, title, posters } = movieDetailsFetcher.read(cache,
    movieId
  );

  return (
    <div className="MovieDetails">
      <div className="poster">
        <Img src={posters.detailed} alt="poster" />
      </div>
      <div className="details">
        <h1>{title}</h1>
        <div className="ratings">
          <Rating
            label="Tomatometer"
            score={ratings.critics_score}
            icon={ratings.critics_rating}
          />
          <Rating
            label="Audience"
            score={ratings.audience_score}
            icon={ratings.audience_rating}
          />
        </div>
        <div className="critic">
          <div className="small-title">Critics consensus</div>
          {ratingSummary.consensus}
        </div>
      </div>
    </div>
  );
}

export default function MoviePage({ movieId }) {
  return (
    <>
      <MovieDetails movieId={movieId} />
      <Suspense maxDuration={500} fallback={<Spinner />}>
        <MovieReviews movieId={movieId} />
      </Suspense>
    </>
  );
}
