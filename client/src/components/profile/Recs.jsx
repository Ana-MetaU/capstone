import {useEffect, useState} from "react";
import {useUser} from "../../context/UserContext";
import UserSearchItem from "./UserSearchItem";
import {getRecs} from "../../api/FollowApi";
import Profile from "./Profile";

const Recs = () => {
  const {user} = useUser();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecs();
    }
  }, [user]);

  const fetchRecs = async () => {
    setLoading(true);

    try {
      const result = await getRecs();
      if (result.success) {
        setRecs(result.recommendations);
      }
    } catch (error) {
      console.log("error fetching friend recs");
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return <div> Loading recommendations...</div>;
  }

  if (recs.length === 0) {
    return <div>No recommendations available yet </div>;
  }
  return (
    <div>
      <h3>People you may know</h3>
      {recs.map((rec) => (
        <UserSearchItem
          key={rec.id}
          user={{
            userId: rec.id,
            username: rec.username,
            profilePicture: rec.profilePicture,
          }}
          currentUser={user}
        ></UserSearchItem>
      ))}
    </div>
  );
};

export default Recs;
