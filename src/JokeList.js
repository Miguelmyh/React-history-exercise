// import React, { Component } from "react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Joke from "./Joke";
import "./JokeList.css";
import useJokes from "./hooks/useJokes";

/** List of jokes. */

const JokeList = (props) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //once loaded, call getJokes
  useEffect(() => {
    getJokes();
  }, []);

  const getJokes = async () => {
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let jokes = [];
      let seenJokes = new Set();

      while (jokes.length < props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }

      //done(jokes, false);
      const returnData = { totalJokes: jokes, loadingState: false };
      done(returnData);
    } catch (err) {
      console.error(err);
    }
  };

  const generateNewJokes = () => {
    setIsLoading(true);
    getJokes(done);
  };

  const done = ({ totalJokes, loadingState }) => {
    setJokes(totalJokes);
    setIsLoading(loadingState);
  };

  const vote = (id, delta) => {
    setJokes((oldJokes) =>
      jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  };

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map((j) => (
        <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
      ))}
    </div>
  );
};

export default JokeList;

JokeList.defaultProps = {
  numJokesToGet: 5,
};
