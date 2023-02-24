const Format_coords = (arr) => {
  let newOutput = arr[0].toString();
  let newOutput2 = arr[1].toString();
  let output = `{${newOutput}, ${newOutput2}}`;
  return output;
};

const dummyData = [
  {
    entry_id: 7,
    trip_id: 2,
    user_id: 1,
    location: [-0.1429489005651874, 51.50080870807764],
    circle_size: 0.5,
  },
  {
    entry_id: 8,
    trip_id: 2,
    user_id: 1,
    location: [-0.15314146762585779, 51.534935924609954],
    circle_size: 0.5,
  },
];

const formatTrips = (payload) => {
  const formattedResponse = {
    user_id: payload[0].user_id,
    trip_id: payload[0].trip_id,
    points: payload.map((entry) => ({
      coordinates: entry.location,
      circleSize: entry.circle_size,
    })),
  };
  return formattedResponse;
};

console.log(JSON.stringify(formatTrips(dummyData), null, 2));

module.exports = { Format_coords };
