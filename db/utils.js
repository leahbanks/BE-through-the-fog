const Format_coords = (arr) => {
  let newOutput = arr[0].toString();
  let newOutput2 = arr[1].toString();
  let output = `{${newOutput}, ${newOutput2}}`;
  return output;
};

const dummyIncomingData = [
  {
    entry_id: 8,
    trip_id: 2,
    user_id: 1,
    location: [-0.1429489005651874, 51.50080870807764],
    circle_size: 0.5,
  },
  {
    entry_id: 9,
    trip_id: 2,
    user_id: 1,
    location: [-0.15314146762585779, 51.534935924609954],
    circle_size: 0.5,
  },
  {
    entry_id: 6,
    trip_id: 1,
    user_id: 1,
    location: [-0.1429489005651874, 51.50080870807764],
    circle_size: 0.5,
  },
  {
    entry_id: 7,
    trip_id: 1,
    user_id: 1,
    location: [-0.232332305651874, 51.777770807764],
    circle_size: 0.5,
  },
];

const dummyOutgoingData = {
  user_id: 1,
  trips: [
    {
      trip_id: 2,
      points: [
        {
          coordinates: [-0.1429489005651874, 51.50080870807764],
          circleSize: 0.5,
        },
        {
          coordinates: [-0.15314146762585779, 51.534935924609954],
          circleSize: 0.5,
        },
      ],
    },
    {
      trip_id: 1,
      points: [
        {
          coordinates: [-0.1429489005651874, 51.50080870807764],
          circleSize: 0.5,
        },
        {
          coordinates: [-0.232332305651874, 51.777770807764],
          circleSize: 0.5,
        },
      ],
    },
  ],
};

// Used when getting from database
const formatGetTrips = (payload) => {
  const user_id = payload[0].user_id;
  const trips = payload.reduce((accumulator, current) => {
    const trip = accumulator.find((trip) => trip.trip_id === current.trip_id);
    if (trip) {
      trip.points.push({
        coordinates: current.location,
        circleSize: current.circle_size,
      });
    } else {
      accumulator.push({
        trip_id: current.trip_id,
        points: [
          {
            coordinates: current.location,
            circleSize: current.circle_size,
          },
        ],
      });
    }
    return accumulator;
  }, []);
  return { user_id, trips };
};

// Used when posting to database
const formatPostTrips = (payload) => {
  const entries = payload.trips.flatMap(({ trip_id, points }) => {
    return points.map(({ coordinates, circleSize }, i) => {
      return {
        trip_id,
        user_id: payload.user_id,
        location: Format_coords(coordinates),
        circle_size: circleSize,
      };
    });
  });
  return entries;
};

module.exports = { Format_coords, formatGetTrips, formatPostTrips };
