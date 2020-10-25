import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import app from '../index';
import Helper from '../utils/user.utils';
import Auth from '../db/models/users.model';
import WatchlistController from '../controllers/watchlist.controller';
import WatchlistTalent from '../db/models/watchlistTalent.model';
import logger from '../config';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

let token;
let talentId;
let newTalentId;
let userId;
let oldUserId;

before((done) => {
  WatchlistTalent.collection.drop();
  done();
});

describe('Watchlist Watchlist Route Endpoint', async () => {
  describe('POST api/watchlist/:talentId', () => {
    before((done) => {
      Auth.findOne({ email: 'pulisic@gmail.com' }, (err, user) => {
        if (user) {
          newTalentId = user._id;
        }
      });

      Auth.findOne(
        { email: 'rasheedshinaopeyemi@gmail.com' },
        (err, myuser) => {
          if (myuser) {
            userId = myuser._id;
            (async () => {
              token = await Helper.generateToken(
                myuser._id,
                myuser._role,
                myuser.userName
              );
            })();

            Auth.findOne(
              { email: 'okwuosachijioke@gmail.com' },
              (err, myuser) => {
                if (myuser) {
                  talentId = myuser._id;

                  WatchlistTalent.create({
                    userId: talentId,
                    watchlistId: userId,
                  })
                    .then(function (user) {
                      oldUserId = user.userId;
                      done();
                    })
                    .catch(function (err) {
                      logger.error(err);
                    });
                }
              }
            );
          }
        }
      );
    });
    it('should not add talent to watchlist if user does not supply token', (done) => {
      chai
        .request(app)
        .post(`/api/v1/watchlist/${talentId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not add talent to watchlist if token is invalid', (done) => {
      chai
        .request(app)
        .post(`/api/v1/watchlist/${talentId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not add talent if talent exist', (done) => {
      chai
        .request(app)
        .post(`/api/v1/watchlist/${oldUserId}`)
        .set('token', token)
        .send({ oldUserId, userId })
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have
            .property('message')
            .eql('talent already added to watchlist');
          done();
        });
    });
    it('should add talent to watchlist', (done) => {
      const newtalent = {
        userId: newTalentId,
        watchlistId: userId,
      };

      chai
        .request(app)
        .post(`/api/v1/watchlist/${newTalentId}`)
        .set('token', token)
        .send(newtalent)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have
            .property('message')
            .eql('talent added to watchlist');
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
      WatchlistController.addTalent(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('GET api/v1/watchlist', () => {
    before((done) => {
      Auth.findOne(
        { email: 'rasheedshinaopeyemi@gmail.com' },
        (err, myuser) => {
          if (myuser) {
            userId = myuser._id;
            (async () => {
              token = await Helper.generateToken(
                myuser._id,
                myuser._role,
                myuser.userName
              );
            })();
          }
          done();
        }
      );
    });
    it('should not get talents if the user does not supply a token', (done) => {
      chai
        .request(app)
        .get('/api/v1/watchlist')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not get talents if token is invalid', (done) => {
      chai
        .request(app)
        .get('/api/v1/watchlist')
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should get talents if talents is found', (done) => {
      chai
        .request(app)
        .get('/api/v1/watchlist')
        .set('token', token)
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
      WatchlistController.getTalents(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('DELETE api/watchlist/:talentId', () => {
    before((done) => {
      Auth.findOne(
        { email: 'rasheedshinaopeyemi@gmail.com' },
        (err, myuser) => {
          if (myuser) {
            userId = myuser._id;
            (async () => {
              token = await Helper.generateToken(
                myuser._id,
                myuser._role,
                myuser.userName
              );
            })();
          }
          done();
        }
      );
    });
    it('should not delete talent if the user does not supply token', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/watchlist/${talentId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not delete talent if token is invalid', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/watchlist/${talentId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should delete talent if talent is found', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/watchlist/${talentId}`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message').eql('talent removed');
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
      WatchlistController.removeTalent(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
});
