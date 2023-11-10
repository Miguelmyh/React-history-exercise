import React from "react";
import axios from "axios";

const useJokes = (done) => {
  const getJokes = async () => {
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let jokes = [];
      let seenJokes = new Set();

      while (jokes.length < this.props.numJokesToGet) {
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
};

export default useJokes;
