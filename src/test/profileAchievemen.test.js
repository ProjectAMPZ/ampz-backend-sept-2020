import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import app from '../index';
import Helper from '../utils/user.utils';
import Auth from '../db/models/users.model';
import Achievement from '../db/models/achievement.model';
import AchievementController from '../controllers/achievement.controller';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

let achievementToken;
let achievementUserId;
let achievementId;

const conmpleteAchievement = {
  title: 'TEST ACHIEVEMENT',
  month: 'june',
  year: '2019',
  description: 'my description',
};

const incompleteAchievement = {
  title: 'TEST ACHIEVEMENT',
  day: '20',
};

const updateAchievement = {
  title: 'TEST ACHIEVEMENT',
};

describe('Profile Achievement Route Endpoint', () => {
  describe('POST api/v1/profile/achievement', () => {
    before((done) => {
      Auth.findOne({ email: 'okwuosachijioke1@gmail.com' }, (err, myuser) => {
        if (myuser) {
          (async () => {
            achievementToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
          done();
        }
      });
    });
    it('should not create achievement if the user does not supply a token', (done) => {
      chai
        .request(app)
        .post('/api/v1/profile/achievement')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create achievement if the token is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/profile/achievement')
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });

    it('should not create achievement if achievement is incomplete', (done) => {
      chai
        .request(app)
        .post('/api/v1/profile/achievement')
        .set('token', achievementToken)
        .send(incompleteAchievement)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have
            .property('error')
            .eql('Your request contains invalid parameters');
          done();
        });
    });
    it('should create achievement if achievement is complete', (done) => {
      chai
        .request(app)
        .post('/api/v1/profile/achievement')
        .set('token', achievementToken)
        .send(conmpleteAchievement)
        .end((err, res) => {
          res.should.have.status(201);
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
      AchievementController.createAchievement(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });

  describe('PUT api/v1/profile/achievement/:achievementId', () => {
    before((done) => {
      Auth.findOne({ email: 'okwuosachijioke1@gmail.com' }, (err, myuser) => {
        if (myuser) {
          (async () => {
            achievementUserId = myuser._id;
            achievementToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
        }
      });
      Achievement.create(
        {
          title: 'TEST ACHIEVEMENT',
          month: 'june',
          year: '2019',
          description: 'my description',
          userId: achievementUserId,
        },
        (err, achievement) => {
          achievementId = achievement._id;
          done();
        }
      );
    });
    it('should not update achievement if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/achievement/${achievementId}`)
        .send(updateAchievement)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });

    it('should not update achievement if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/achievement/${achievementId}`)
        .set('token', 'invalid token')
        .send(updateAchievement)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not update achievement if achievement is not found', (done) => {
      chai
        .request(app)
        .put('/api/v1/profile/achievement/5f723030f2a978274813c51d')
        .set('token', achievementToken)
        .send(updateAchievement)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('message').eql('achievement not found');
          done();
        });
    });
    it('should update achievement if achievement is found', (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/achievement/${achievementId}`)
        .set('token', achievementToken)
        .send(updateAchievement)
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
      AchievementController.updateAchievement(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('GET api/v1/profile/achievement/:achievementId', () => {
    before((done) => {
      Auth.findOne({ email: 'okwuosachijioke1@gmail.com' }, (err, myuser) => {
        if (myuser) {
          (async () => {
            achievementUserId = myuser._id;
            achievementToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
        }
      });
      Achievement.create(
        {
          title: 'TEST ACHIEVEMENT',
          month: 'june',
          year: '2019',
          description: 'my description',
          userId: achievementUserId,
        },
        (err, achievement) => {
          achievementId = achievement._id;
          done();
        }
      );
    });
    it('should not get achievement if the user does not supply token', (done) => {
      chai
        .request(app)
        .get(`/api/v1/profile/achievement/${achievementId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });

    it('should not get achievement if the token is invalid', (done) => {
      chai
        .request(app)
        .get(`/api/v1/profile/achievement/${achievementId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not get achievement if achievement is not found', (done) => {
      chai
        .request(app)
        .get('/api/v1/profile/achievement/5f723030f2a978274813c51d')
        .set('token', achievementToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('message').eql('achievement not found');
          done();
        });
    });
    it('should get achievement if achievement is found', (done) => {
      chai
        .request(app)
        .get(`/api/v1/profile/achievement/${achievementId}`)
        .set('token', achievementToken)
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
      AchievementController.getAchievement(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('DELETE api/v1/profile/achievement/:achievementId', () => {
    before((done) => {
      Auth.findOne({ email: 'okwuosachijioke1@gmail.com' }, (err, myuser) => {
        if (myuser) {
          (async () => {
            achievementUserId = myuser._id;
            achievementToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
        }
      });
      Achievement.create(
        {
          title: 'TEST ACHIEVEMENT',
          month: 'june',
          year: '2019',
          description: 'my description',
          userId: achievementUserId,
        },
        (err, achievement) => {
          achievementId = achievement._id;
          done();
        }
      );
    });
    it('should not delete achievement if the user does not supply a token', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/profile/achievement/${achievementId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not delete achievement if the token is invalid', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/profile/achievement/${achievementId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not delete achievement if achievement is not found', (done) => {
      chai
        .request(app)
        .delete('/api/v1/profile/achievement/5f70f3fee718fe18e4635e48')
        .set('token', achievementToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('404 Not Found');
          res.body.should.have.property('error').eql('achievement not found');
          done();
        });
    });
    it('should delete achievement if achievement is found', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/profile/achievement/${achievementId}`)
        .set('token', achievementToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have
            .property('message')
            .eql('achievement deleted successfully');
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
      AchievementController.deleteAchievement(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
});
