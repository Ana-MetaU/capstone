import {useEffect, useState} from "react";
import SetGoalModal from "./SetGoalModal";
import {getWatchGoal, setWatchGoal} from "../../api/UsersApi";
import {getWatchedMovies} from "../../api/MovieApi";
import {getWatchedTVShows} from "../../api/TVShowApi";
import {EditButton} from "../UI/Buttons";
import "./WatchGoal.css";

const WatchGoal = ({userId}) => {
  const [goal, setGoal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [watched, setWatched] = useState(0);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchGoal();
  }, [userId, currentYear]);

  useEffect(() => {
    fetchWatched();
  }, []);

  const fetchWatched = async () => {
    const movies = await getWatchedMovies();
    const shows = await getWatchedTVShows();
    if (movies.success && shows.success) {
      const all = [...movies.movies, ...shows.shows];
      setWatched(all?.length);
    } else {
      console.log("Failed to fetch watched movies:", shows.message);
    }
  };

  const fetchGoal = async () => {
    const fetchedGoal = await getWatchGoal(userId, currentYear);
    if (fetchedGoal.success) {
      setGoal(fetchedGoal.goal);
    } else {
      setGoal(0);
    }
  };

  const handleSaveGoal = async (newGoal) => {
    try {
      const savedGoal = await setWatchGoal(userId, currentYear, newGoal);
      if (savedGoal.success) {
        setGoal(newGoal);
      }
    } catch (error) {
      console.log("error in setting goal", error);
      setGoal(0);
    }
  };

  return (
    <div className="goal-container">
      <div className="goal-header">
        <span>{currentYear} Watch Goal</span>
        <span>
          Progress: {watched}/{goal}
        </span>
        {goal !== 0 && (
          <button
            className="goal-edit-button"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <EditButton />
          </button>
        )}
      </div>

      <div className="bar-content">
        {isModalOpen && (
          <SetGoalModal
            onSave={handleSaveGoal}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        {goal === 0 ? (
          <>
            <button
              className="goal-button"
              onClick={() => setIsModalOpen(true)}
            >
              Start
            </button>
          </>
        ) : (
          <div className="progress-container">
            <div className="goal-bar">
              <progress
                value={watched}
                max={goal}
                className="progress-fill"
              ></progress>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchGoal;
