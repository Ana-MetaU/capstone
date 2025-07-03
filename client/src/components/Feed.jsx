import {useUser} from "../context/UserContext";
function Feed() {
  const {user} = useUser();
  console.log("here user should be defined", user);
  return (
    <div>
      <p>upcoming Feed page</p>
    </div>
  );
}

export default Feed;
