const request = require("supertest");
const app = require("../db/App.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/testData");

beforeEach(() => {
  return seed(testData);
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(() => db.end());

describe("app", () => {
  describe("GET /api/users endpoint", () => {
    it("responds with a status 200 if successful", () => {
      return request(app).get("/api/users").expect(200);
    });
    it("responds with an array of topic objects", () => {
      return request(app)
        .get("/api/users")
        .then((res) => {
          let users = res.body;
          expect(users).toBeInstanceOf(Array);
        });
    });
    it("responds with an array of topic objects with the correct length", () => {
      return request(app)
        .get("/api/users")
        .then((res) => {
          let users = res.body;
          expect(users.length).toBe(4);
        });
    });
    it("responds with an array of topic objects with expected properties and values", () => {
      return request(app)
        .get("/api/users")
        .then((res) => {
          let users = res.body;
          expect(users).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                username: expect.any(String),
                password: expect.any(String),
                avatar_url: expect.any(String),
              }),
            ])
          );
        });
    });
    it("responds with a status 500 when an issue occurs", () => {
      jest.spyOn(db, "query").mockImplementation(() => {
        throw new Error("Internal Server Error");
      });

      return Promise.all([request(app).get("/api/users").expect(500)]);
    });
  });
  describe("GET /api/users/:username endpoint", () => {
    it("responds with a status 200 if successful", () => {
      return request(app).get("/api/users/mallionaire").expect(200);
    });
    it("responds with only one user", () => {
      return request(app)
        .get("/api/users/mallionaire")
        .expect(200)
        .then((res) => {
          let user = res.body;
          expect(user.length).toBe(1);
        });
    });
    it("responds with a user object with the correct properties", () => {
      return request(app)
        .get("/api/users/mallionaire")
        .expect(200)
        .then((res) => {
          let user = res.body;
          expect(user).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                user_id: expect.any(Number),
                username: expect.any(String),
                password: expect.any(String),
                avatar_url: expect.any(String),
              }),
            ])
          );
        });
    });
    it("responds with a status 404 if user not found", () => {
      return Promise.all([request(app).get("/api/users/abi").expect(404)]).then(
        ([res1]) => {
          expect(res1.body.msg).toEqual("Not Found");
        }
      );
    });
  });
  describe("POST /api/users endpoint", () => {
    const testUser = {
      username: "testcoolname",
      password: "veryinsecurepassword",
      avatar_url: "https://www.coolpictures.com/reallycoolimage.jpeg",
    };
    it("responds with a status 201 if successful", () => {
      return request(app).post("/api/users").send(testUser).expect(201);
    });
    it("responds with the posted user", () => {
      return request(app)
        .post("/api/users")
        .send(testUser)
        .expect(201)
        .then((res) => {
          const user = res.body;
          expect(user).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                user_id: expect.any(Number),
                username: expect.any(String),
                password: expect.any(String),
                avatar_url: expect.any(String),
              }),
            ])
          );
        });
    });
    it("actually adds the user to the database", () => {
      return request(app)
        .post("/api/users")
        .send(testUser)
        .expect(201)
        .then((res) => {
          return request(app)
            .get("/api/users/testcoolname")
            .expect(200)
            .then((res) => {
              const user = res.body;
              expect(user).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    user_id: 5,
                    username: "testcoolname",
                    password: "veryinsecurepassword",
                    avatar_url:
                      "https://www.coolpictures.com/reallycoolimage.jpeg",
                  }),
                ])
              );
            });
        });
    });
  });
  describe("GET /api/users/:user_id/geodata endpoint", () => {
    it("responds with a status 200 if successful", () => {
      return request(app).get("/api/users/1/geodata").expect(200);
    });
    it("responds with an array of geodata objects associated with specific user", () => {
      return request(app)
        .get("/api/users/1/geodata")
        .then((res) => {
          let geodata = res.body;
          expect(geodata).toBeInstanceOf(Array);
        });
    });
    it("responds with an array of geodata objects associated with specified user, with the correct length", () => {
      return request(app)
        .get("/api/users/1/geodata")
        .then((res) => {
          let geodata = res.body;
          expect(geodata.length).toBe(2);
          return request(app).get("/api/users/2/geodata");
        })
        .then((res) => {
          let geodata = res.body;
          expect(geodata.length).toBe(1);
          return request(app).get("/api/users/3/geodata");
        })
        .then((res) => {
          let geodata = res.body;
          expect(geodata.length).toBe(0);
        });
    });
    it("responds with an array of geodata objects with expected properties and values", () => {
      return request(app)
        .get("/api/users/1/geodata")
        .then((res) => {
          let geodata = res.body;
          expect(geodata[0]).toEqual(
            expect.objectContaining({
              geodata_id: expect.any(Number),
              location: expect.arrayContaining([
                expect.any(Number),
                expect.any(Number),
              ]),
              img_url: expect.any(String),
              comment: expect.any(String),
              user_id: expect.any(Number),
            })
          );
        });
    });
    it("responds with a status 500 when an issue occurs", () => {
      jest.spyOn(db, "query").mockImplementation(() => {
        throw new Error("Internal Server Error");
      });

      return Promise.all([
        request(app).get("/api/users/:user_id/geodata").expect(500),
      ]);
    });
  });
  describe("GET /api/geodata endpoint", () => {
    it("responds with a status 200 if successful", () => {
      return request(app).get("/api/geodata").expect(200);
    });
    it("responds with an array of geodata objects associated with specific user", () => {
      return request(app)
        .get("/api/geodata")
        .then((res) => {
          let geodata = res.body;
          expect(geodata).toBeInstanceOf(Array);
        });
    });
    it("responds with an array of geodata objects associated with specified user, with the correct length", () => {
      return request(app)
        .get("/api/geodata")
        .then((res) => {
          let geodata = res.body;
          expect(geodata.length).toBe(4);
        });
    });
    it("responds with an array of geodata objects with expected properties and values", () => {
      return request(app)
        .get("/api/geodata")
        .then((res) => {
          let geodata = res.body;
          expect(geodata).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                geodata_id: expect.any(Number),
                user_id: expect.any(Number),
              }),
            ])
          );
        });
    });
    it("responds with a status 500 when an issue occurs", () => {
      jest.spyOn(db, "query").mockImplementation(() => {
        throw new Error("Internal Server Error");
      });

      return Promise.all([request(app).get("/api/geodata").expect(500)]);
    });
  });
  describe("GET /api/geodata/:drop_id endpoint", () => {
    it("responds with a status 200 if successful", () => {
      return request(app).get("/api/geodata/drop/1").expect(200);
    });
    it("responds with only one piece of geodata", () => {
      return request(app)
        .get("/api/geodata/drop/1")
        .expect(200)
        .then((res) => {
          let geodata = res.body;
          expect(geodata.length).toBe(1);
        });
    });
    it("responds with a geodata object with the correct properties", () => {
      return request(app)
        .get("/api/geodata/drop/1")
        .expect(200)
        .then((res) => {
          let geodata = res.body;
          expect(geodata).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                location_id: expect.any(Number),
                location: expect.arrayContaining([
                  expect.any(Number),
                  expect.any(Number),
                ]),
                img_url: expect.any(String),
                comment: expect.any(String),
                user_id: expect.any(Number),
              }),
            ])
          );
        });
    });
    it("responds with a status 404 if drop not found", () => {
      return Promise.all([
        request(app).get("/api/geodata/drop/99999").expect(404),
      ]).then(([res1]) => {
        expect(res1.body.msg).toEqual("Not Found");
      });
    });
  });
});
