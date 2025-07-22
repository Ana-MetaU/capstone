// components/notifications/Notifications.jsx
import React, {useState, useEffect} from "react";
import {
  getIncomingRequests,
  acceptFollowRequest,
  rejectFollowRequet,
} from "../../api/FollowApi";
import {getUserProfile} from "../../api/ProfileApi"; // Import the profile API
import {useUser} from "../../context/UserContext";
import "./Notifications.css";

const Notifications = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [requestsWithProfiles, setRequestsWithProfiles] = useState([]);
  const requestCount = requestsWithProfiles.length;
  const [loading, setLoading] = useState(false);

  const {user} = useUser();

  const fetchIncomingRequests = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // get incoming requests, which only return ids
      const response = await getIncomingRequests();
      if (response.success) {
        const requests = response.requests || [];
        setIncomingRequests(requests);

        // fetch profile of each requester
        const requestsWithProfileData = await Promise.all(
          requests.map(async (request) => {
            try {
              const profileResponse = await getUserProfile(request.requesterId);
              return {
                ...request,
                requesterProfile: profileResponse.success
                  ? profileResponse.profile
                  : null,
              };
            } catch (error) {
              console.error(
                `Failed to fetch profile for user ${request.requesterId}:`,
                error
              );
              return {
                ...request,
                requesterProfile: null,
              };
            }
          })
        );

        setRequestsWithProfiles(requestsWithProfileData);
      }
    } catch (error) {
      console.error("Failed to fetch incoming requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (userId) => {
    try {
      const result = await acceptFollowRequest(userId);
      if (result.success) {
        // Remove from both lists
        setIncomingRequests((prev) =>
          prev.filter((request) => request.requesterId !== userId)
        );
        setRequestsWithProfiles((prev) =>
          prev.filter((request) => request.requesterId !== userId)
        );
        console.log("Request accepted successfully");
      } else {
        console.error("Failed to accept request:", result.message);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (userId) => {
    try {
      const result = await rejectFollowRequet(userId);
      if (result.success) {
        // Remove from both lists
        setIncomingRequests((prev) =>
          prev.filter((request) => request.requesterId !== userId)
        );
        setRequestsWithProfiles((prev) =>
          prev.filter((request) => request.requesterId !== userId)
        );
        console.log("Request rejected successfully");
      } else {
        console.error("Failed to reject request:", result.message);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
  }, [user]);

  return (
    <div className="notifications-section">
      <div className="notifications-header">
        <h4>Follow Requests ({requestCount})</h4>
      </div>

      <div className="notifications-content">
        {loading && <div className="notifications-loading">Loading...</div>}

        {!loading && requestCount === 0 && (
          <div className="no-notifications">No pending requests</div>
        )}

        {!loading &&
          requestsWithProfiles.map((request) => (
            <div key={request.id} className="notification-item">
              <div className="notification-user">
                <div className="user-avatar">
                  <img
                    src={
                      request.requesterProfile?.profilePicture || "/image.png"
                    }
                    alt={request.requesterProfile.username || "User"}
                  />
                </div>
                <div className="notification-details">
                  <span className="username">
                    {request.requesterProfile?.username || "Unknown User"}
                  </span>
                </div>
              </div>

              <div className="notification-actions">
                <button
                  className="accept-button"
                  onClick={() => handleAccept(request.requesterId)}
                >
                  Accept
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleReject(request.requesterId)}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Notifications;
