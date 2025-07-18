prisma = require("./client");
// check if follow request exists between two users
async function findFollowRequest(requesterId, recipientId) {
  return await prisma.followRequest.findUnique({
    where: {
      requesterId_recipientId: {
        requesterId: requesterId,
        recipientId: recipientId,
      },
    },
  });
}

// create a new follow request
async function createFollowRequest(requesterId, recipientId) {
  return await prisma.followRequest.create({
    data: {
      requesterId: requesterId,
      recipientId: recipientId,
      status: "pending",
    },
  });
}

// update status of a friend request
async function updateFollowRequest(requestId, status) {
  return await prisma.followRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: status,
    },
  });
}

// delete a follow request request
async function deleteFollowRequest(requestId) {
  return await prisma.followRequest.delete({
    where: {
      id: requestId,
    },
  });
}
// get all incoming follow requests
async function getIncomingRequest(userId) {
  return await prisma.followRequest.findMany({
    where: {
      recipientId: userId,
      status: "pending",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// get all outgoing friend request
async function getOutgoingRequests(userId) {
  return await prisma.followRequest.findMany({
    where: {
      requesterId: userId,
      status: "pending",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

module.exports = {
  findFollowRequest,
  createFollowRequest,
  updateFollowRequest,
  deleteFollowRequest,
  getIncomingRequest,
  getOutgoingRequests,
};
