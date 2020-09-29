import chai from "chai";
import chaiHttp from "chai-http";
import Sinonchai from "sinon-chai";
import sinon from "sinon";
import path from "path";
import app from "../index";
import Helper from "../utils/user.utils";
import BioController from "../controllers/bio.controller";
import FeatureController from "../controllers/feature.controller";
import Auth from "../db/models/users.model";

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

const updateFeature = {
  sport: "Baseball",
  preferedArm: "Right",
  preferedFoot: "Right",
  position: "DM",
  height: "5.4",
  weight: "65",
};

const incompleteFeature = {
  sport: "Baseball",
  preferedArm: "Right",
  preferedFoot: "Right",
};

const role = {
  role: "2525",
};

const emptyRole = {};

let token;
let featureToken;

(async () => {
  token = await Helper.generateToken(
    "5f6afb3f57964d34ac4f38b5",
    "talent",
    "hackerbay"
  );
})();

describe("Profile Route Endpoints", () => {
  describe("PUT api/v1/profile/bio", () => {
    it("should not update profile if the user does not supply token", (done) => {
      chai
        .request(app)
        .put("/api/v1/profile/bio")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error");
          done();
        });
    });
    it("should not update profile if the token is invalid", (done) => {
      chai
        .request(app)
        .put("/api/v1/profile/bio")
        .set("token", "invalid token")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error").eql("Access token is Invalid");
          done();
        });
    });
    it("should not upload image if the file type is invalid", (done) => {
      chai
        .request(app)
        .put("/api/v1/profile/bio")
        .set("token", token)
        .set("Content-Type", "multipart/form-data")
        .set("Connection", "keep-alive")
        .field("userLocation", "Osun State")
        .field("education", "MSC")
        .field("primarySport", "Football")
        .field(
          "profilePhotoUrl",
          "https://ampz-backend-sept.s3-us-west-1.amazonaws.com/1601135199782"
        )
        .field(
          "coverPhotoUrl",
          "https://ampz-backend-sept.s3-us-west-1.amazonaws.com/1601135199782"
        )
        .attach("image", path.resolve(__dirname, "../assets/img/svgimage.svg"))
        .attach("image", path.resolve(__dirname, "../assets/img/svgimage.svg"))
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("400 Invalid Request");
          res.body.should.have.property("error");
          done();
        });
    });
    it("should upload image and update profile if token is valid", (done) => {
      chai
        .request(app)
        .put("/api/v1/profile/bio")
        .set("token", token)
        .set("Content-Type", "multipart/form-data")
        .set("Connection", "keep-alive")
        .field("userLocation", "Osun State")
        .field("education", "MSC")
        .field("primarySport", "Football")
        .field(
          "profilePhotoUrl",
          "https://ampz-backend-sept.s3-us-west-1.amazonaws.com/1601135199782"
        )
        .field(
          "coverPhotoUrl",
          "https://ampz-backend-sept.s3-us-west-1.amazonaws.com/1601135199782"
        )
        .attach("image", path.resolve(__dirname, "../assets/img/image1.jpg"))
        .attach("image", path.resolve(__dirname, "../assets/img/image2.jpg"))
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have.property("message");
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
      BioController.updateBio(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe("PUT api/v1/profile/bio/role", () => {
    it("should not update role if the user does not supply a token", (done) => {
      chai
        .request(app)
        .put("/api/v1/profile/bio/role")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error");
          done();
        });
    });
    it("should not update role if the token is invalid", (done) => {
      chai
        .request(app)
        .put("/api/v1/profile/bio/role")
        .set("token", "invalid token")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error").eql("Access token is Invalid");
          done();
        });
    });
    it("should not update role if the user does not supply role ", (done) => {
      chai
        .request(app)
        .put("/api/v1/profile/bio/role")
        .set("token", token)
        .send(emptyRole)
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
    it("should update role if the user exist", (done) => {
      chai
        .request(app)
        .put("/api/v1/profile/bio/role")
        .set("token", token)
        .send(role)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("bio updated successfully");
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
      BioController.updateBioRole(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe("PUT api/v1/profile/feature", () => {
    before((done) => {
      Auth.findOne({ email: "okwuosachijioke1@gmail.com" }, (err, myuser) => {
        if (myuser) {
          (async () => {
            featureToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
          done();
        }
      });
    });
    it("should not update feature if the user does not supply a token", (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/feature`)
        .send(updateFeature)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error");
          done();
        });
    });
    it("should not update feature if the token is invalid", (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/feature`)
        .set("token", "invalid token")
        .send(updateFeature)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("401 Unauthorized");
          res.body.should.have.property("error").eql("Access token is Invalid");
          done();
        });
    });
    it("should not update feature if user supplies incomplete information", (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/feature`)
        .set("token", featureToken)
        .send(incompleteFeature)
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
    it("should not update feature if feature is not found", (done) => {
      chai
        .request(app)
        .put("/api/v1/profile/feature")
        .set("token", token)
        .send(updateFeature)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("404 Not Found");
          res.body.should.have.property("message").eql("feature not found");
          done();
        });
    });
    it("should update feature if feature is found", (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/feature`)
        .set("token", featureToken)
        .send(updateFeature)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("feature updated successfully");
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
      FeatureController.updateFeature(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
});
