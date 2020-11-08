import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import app from '../index';
import Helper from '../utils/user.utils';
import Auth from '../db/models/users.model';
import UserController from '../controllers/user.controller';
import UserServices from '../services/user.services';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

let userToken;
let profileId;

describe('User Route Endpoint', () => {
  before((done) => {
    Auth.findOne({ email: 'okwuosachijioke1@gmail.com' }, (err, myuser) => {
      if (myuser) {
        (async () => {
          userToken = await Helper.generateToken(
            myuser._id,
            myuser._role,
            myuser.userName
          );
          profileId = myuser._id;
        })();
        done();
      }
    });
  });
  describe('PUT api/v1/user/follow/:profileId', () => {
    it('should not follow or unfollow a profile if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/user/follow/${profileId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not follow or unfollow profile if the supplied token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/user/follow/${profileId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should follow a user if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/user/follow/${profileId}`)
        .set('token', userToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should unfollow a profile if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/user/follow/${profileId}`)
        .set('token', userToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });
    it('Should fake server error', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      UserController.followUser(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('User Services Mock', () => {
    it('Should fake server error on followedByUser function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      UserServices.followedByUser(req, res);
      res.status.should.have.callCount(0);
      done();
    });
    it('Should fake server error on unFollowUser function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      UserServices.unFollowUser(req, res);
      res.status.should.have.callCount(0);
      done();
    });
    it('Should fake server error on followUser function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      UserServices.followUser(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });
  describe('GET api/v1/user/:profileId', () => {
    it('Should get a users information when valid user id is provided', (done) => {
      chai
        .request(app)
        .get(`/api/v1/user/${profileId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('Should not get a users information when invalid user id is provided', (done) => {
      chai
        .request(app)
        .get('/api/v1/user/5f749b6d8c767d03d926e945')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error');
          done();
        });
    });
    it('Should fake server error', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      UserController.getUser(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('GET api/v1/user/users/all', () => {
    it('should get all users', (done) => {
      chai
        .request(app)
        .get('/api/v1/user/users/all')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('Should fake server error', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      UserController.getUsers(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });
});
