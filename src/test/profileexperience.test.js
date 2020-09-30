import chai from "chai";
import chaiHttp from "chai-http";
import Sinonchai from "sinon-chai";
import sinon from "sinon";
import app from "../index";
import Helper from "../utils/user.utils";
import Auth from "../db/models/users.model";
import Experience from "../db/models/experience.model";
import ExperienceController from "../controllers/experince.controller";

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

let experienceToken;
let experienceUserId;
let experienceId;

const partiallyconmpleteExperience = {
  teamName: "TEST EXPEREINCE",
  competitionType: "another competition",
  startMonth: "august",
  startYear: "2019",
  keyAchievements: "awesome achievements",
  active: true,
};

const conmpleteExperience = {
  teamName: "TEST EXPEREINCE",
  competitionType: "another competition",
  startMonth: "august",
  startYear: "2019",
  endMonth: "Dec",
  endYear: "2019",
  keyAchievements: "awesome achievements",
  active: true,
};

const incompleteExperience = {
  teamName: "EXPEREINCE 2",
  competitionType: "another competition",
  startMonth: "august",
  startYear: "2019",
};

const updateExperience = {
  teamName: "EXPEREINCE 2",
};

describe("Profile Experience Route Endpoint", () => {
  describe("POST api/v1/profile/experience", () => {
    before((done) => {
      Auth.findOne({ email: "okwuosachijioke1@gmail.com" }, (err, myuser) => {
        if (myuser) {
          (async () => {
            experienceToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
          done();
        }
      });
    });
    it("should not create experience if the user does not supply a token", (done) => {
      chai
        .request(app)
        .post("/api/v1/profile/experience")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error");
          done();
        });
    });
    it("should not create experience if the token is invalid", (done) => {
      chai
        .request(app)
        .post("/api/v1/profile/experience")
        .set("token", "invalid token")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error").eql("Access token is Invalid");
          done();
        });
    });

    it("should not create experience if experience is incomplete", (done) => {
      chai
        .request(app)
        .post("/api/v1/profile/experience")
        .set("token", experienceToken)
        .send(incompleteExperience)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("400 Invalid Request");
          res.body.should.have
            .property("error")
            .eql("Your request contains invalid parameters");
          done();
        });
    });
    it("should create experience if experience is partiallycomplete", (done) => {
      chai
        .request(app)
        .post("/api/v1/profile/experience")
        .set("token", experienceToken)
        .send(partiallyconmpleteExperience)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have.property("data");
          done();
        });
    });
    it("should create experience if experience is complete", (done) => {
      chai
        .request(app)
        .post("/api/v1/profile/experience")
        .set("token", experienceToken)
        .send(conmpleteExperience)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have.property("data");
          done();
        });
    });
    it("Should fake server error", (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, "status").returnsThis();
      ExperienceController.createExperience(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });

  describe("PUT api/v1/profile/experience/:experienceId", () => {
    before((done) => {
      Auth.findOne({ email: "okwuosachijioke1@gmail.com" }, (err, myuser) => {
        if (myuser) {
          (async () => {
            experienceUserId = myuser._id;
            experienceToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
        }
      });
      Experience.create(
        {
          teamName: "TEST EXPEREINCE",
          competitionType: "another competition",
          startMonth: "august",
          startYear: "2019",
          endMonth: "Dec",
          endYear: "2019",
          keyAchievements: "awesome achievements",
          active: true,
          userId: experienceUserId,
        },
        (err, experience) => {
          experienceId = experience._id;
          done();
        }
      );
    });
    it("should not update experience if the user does not supply a token", (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/experience/${experienceId}`)
        .send(updateExperience)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error");
          done();
        });
    });

    it("should not update experience if the token is invalid", (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/experience/${experienceId}`)
        .set("token", "invalid token")
        .send(updateExperience)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error").eql("Access token is Invalid");
          done();
        });
    });
    it("should not update experience if experience is not found", (done) => {
      chai
        .request(app)
        .put("/api/v1/profile/experience/5f723030f2a978274813c51d")
        .set("token", experienceToken)
        .send(updateExperience)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("experience not found");
          done();
        });
    });
    it("should update experience if experience is found", (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/experience/${experienceId}`)
        .set("token", experienceToken)
        .send(updateExperience)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have.property("data");
          done();
        });
    });
    it("Should fake server error", (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, "status").returnsThis();
      ExperienceController.updateExperience(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe("GET api/v1/profile/experience/:experienceId", () => {
    before((done) => {
      Auth.findOne({ email: "okwuosachijioke1@gmail.com" }, (err, myuser) => {
        if (myuser) {
          (async () => {
            experienceUserId = myuser._id;
            experienceToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
        }
      });
      Experience.create(
        {
          teamName: "NEW EXPEREINCE",
          competitionType: "another competition",
          startMonth: "august",
          startYear: "2019",
          endMonth: "Dec",
          endYear: "2019",
          keyAchievements: "awesome achievements",
          active: true,
          userId: experienceUserId,
        },
        (err, experience) => {
          experienceId = experience._id;
          done();
        }
      );
    });
    it("should not get experience if the user does not supply a token", (done) => {
      chai
        .request(app)
        .get(`/api/v1/profile/experience/${experienceId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error");
          done();
        });
    });
    it("should not get experience if the token is invalid", (done) => {
      chai
        .request(app)
        .get(`/api/v1/profile/experience/${experienceId}`)
        .set("token", "invalid token")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error").eql("Access token is Invalid");
          done();
        });
    });
    it("should not get experience if experience is not found", (done) => {
      chai
        .request(app)
        .get("/api/v1/profile/experience/5f723030f2a978274813c51d")
        .set("token", experienceToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("experience not found");
          done();
        });
    });
    it("should get experience if experience is found", (done) => {
      chai
        .request(app)
        .get(`/api/v1/profile/experience/${experienceId}`)
        .set("token", experienceToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have.property("data");
          done();
        });
    });
    it("Should fake server error", (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, "status").returnsThis();
      ExperienceController.getExperience(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe("DELETE api/v1/profile/experience/:experienceId", () => {
    before((done) => {
      Auth.findOne({ email: "okwuosachijioke1@gmail.com" }, (err, myuser) => {
        if (myuser) {
          (async () => {
            experienceUserId = myuser._id;
            experienceToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
        }
      });
      Experience.create(
        {
          teamName: "TEST EXPEREINCE",
          competitionType: "another competition",
          startMonth: "august",
          startYear: "2019",
          endMonth: "Dec",
          endYear: "2019",
          keyAchievements: "awesome achievements",
          active: true,
          userId: experienceUserId,
        },
        (err, experience) => {
          experienceId = experience._id;
          done();
        }
      );
    });
    it("should not delete experience if the user does not supply a token", (done) => {
      chai
        .request(app)
        .delete(`/api/v1/profile/experience/${experienceId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error");
          done();
        });
    });
    it("should not delete experience if the token is invalid", (done) => {
      chai
        .request(app)
        .delete(`/api/v1/profile/experience/${experienceId}`)
        .set("token", "invalid token")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error").eql("Access token is Invalid");
          done();
        });
    });
    it("should not delete experience if experience is not found", (done) => {
      chai
        .request(app)
        .delete("/api/v1/profile/experience/5f70f3fee718fe18e4635e48")
        .set("token", experienceToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("404 Not Found");
          res.body.should.have.property("error").eql("experience not found");
          done();
        });
    });
    it("should delete experience if experience is found", (done) => {
      chai
        .request(app)
        .delete(`/api/v1/profile/experience/${experienceId}`)
        .set("token", experienceToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("experience deleted successfully");
          done();
        });
    });
    it("Should fake server error", (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, "status").returnsThis();
      ExperienceController.deleteExperience(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
});
