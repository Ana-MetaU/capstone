import {useState} from "react";
import "./SetWatchGoal.css";
const SetGoalModal = ({onSave, onClose}) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setInputValue(val);
    }
  };

  const handleSubmit = () => {
    const numGoal = parseInt(inputValue, 10);
    if (!isNaN(numGoal) && numGoal > 0) {
      onSave(numGoal);
      onClose();
    } else {
      alert("Please enter a valid positive number");
    }
  };

  return (
    <div className="goal-modal">
      <div className="goal">
        <h2>Set Watch Goal</h2>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Number of movies"
        />

        <button onClick={handleSubmit} className="save-button">
          Save Goal
        </button>
        <button onClick={onClose} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SetGoalModal;
