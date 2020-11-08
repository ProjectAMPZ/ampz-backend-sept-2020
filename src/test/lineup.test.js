import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import path from 'path';
import app from '../index';
import Helper from '../utils/user.utils';
import Auth from '../db/models/users.model';
import LineupController from '../controllers/lineup.controller';
import TalentLineup from '../db/models/talentLineup.model';
import logger from '../config';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

let token;
let lineupId;
let talentId;
let newTalentId;
let oldTalentId;

const updatetalent = {
  marketValue: '90000',
  contractEndMonth: 'January',
  contractEndYear: '2025',
};

before((done) => {
  Auth.findOne({ email: 'aim@ampz.tv' }, (err, myuser) => {
    if (myuser) {
      (async () => {
        token = await Helper.generateToken(
          myuser._id,
          myuser._role,
          myuser.userName
        );
      })();
      TalentLineup.collection.drop();
      done();
    }
  });
});

describe('Lineup Route Endpoint', () => {
  describe('POST api/v1/lineup', () => {
    before((done) => {
      Auth.findOne({ email: 'aim@ampz.tv' }, (err, myuser) => {
        if (myuser) {
          (async () => {
            token = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
          done();
        }
      });
    });
    it('should not create lineup if the user does not supply token', (done) => {
      chai
        .request(app)
        .post('/api/v1/lineup')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create lineup if token is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/lineup')
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not create lineup if the file type is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/lineup')
        .set('token', token)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'Humble Beginings')
        .field(
          'description',
          'Join one of the top football academies such as Pepsi Academy, KSFA, Mildas Academy through our annaul Basketball Tour.'
        )
        .attach('media', path.resolve(__dirname, '../assets/img/svgimage.svg'))
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should create lineup if lineup fields are submitted', (done) => {
      chai
        .request(app)
        .post('/api/v1/lineup')
        .set('token', token)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('name', '2025 Talent Stream')
        .field(
          'description',
          'Suspendisse auctor nisi luctus mauris porttitor, quis tincidunt ma aliquet.'
        )
        .attach('media', path.resolve(__dirname, '../assets/img/sport.jpg'))
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          lineupId = res.body.data._id;
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
      LineupController.createLineup(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });
  describe('PUT api/v1/lineup/:lineupId', () => {
    it('should not update lineup if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/lineup/${lineupId}`)
        .field('name', '2028 Talent Stream')
        .field(
          'description',
          'Suspendisse auctor nisi luctus mauris porttitor, quis tincidunt massa aliquet.'
        )
        .attach('media', path.resolve(__dirname, '../assets/img/sport.jpg'))
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not update lineup if token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/lineup/${lineupId}`)
        .set('token', 'dsskdkdkdkkdkdkdkdk')
        .field('name', '2020 Talent Stream')
        .field('description', 'Suspendisse auctor')
        .attach('media', path.resolve(__dirname, '../assets/img/sport.jpg'))
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not update lineup if the file type is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/lineup/${lineupId}`)
        .set('token', token)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('name', '2025 Talent Stream')
        .field(
          'description',
          'Suspendisse auctor nisi luctus mauris porttitor, quis tincidunt massa aliquet.'
        )
        .attach('media', path.resolve(__dirname, '../assets/img/svgimage.svg'))
        .field(
          'mediaUrl',
          'https://ampz-backend-sept.s3-us-west-1.amazonaws.com/1601135199782'
        )
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should update lineup if fields are supplied', (done) => {
      chai
        .request(app)
        .put(`/api/v1/lineup/${lineupId}`)
        .set('token', token)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'Humble Beginings')
        .attach('media', path.resolve(__dirname, '../assets/img/sport.jpg'))
        .field(
          'mediaUrl',
          'https://ampz-backend-sept.s3-us-west-1.amazonaws.com/1601135199782'
        )
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
      LineupController.updateLineup(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('GET api/v1/lineup/:lineupId', () => {
    it('should not get lineup if the user does not supply a token', (done) => {
      chai
        .request(app)
        .get(`/api/v1/lineup/${lineupId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not get lineup if the token is invalid', (done) => {
      chai
        .request(app)
        .get(`/api/v1/lineup/${lineupId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should get lineup if lineup is found', (done) => {
      chai
        .request(app)
        .get(`/api/v1/lineup/${lineupId}`)
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
      LineupController.getLineup(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('GET api/v1/lineup', () => {
    it('should not get lineups if the user does not supply a token', (done) => {
      chai
        .request(app)
        .get('/api/v1/lineup')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not get lineups if the token is invalid', (done) => {
      chai
        .request(app)
        .get('/api/v1/lineup')
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should get lineups if lineup is found', (done) => {
      chai
        .request(app)
        .get('/api/v1/lineup')
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
      LineupController.getLineups(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('DELETE api/v1/lineup/:lineupId', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/lineup')
        .set('token', token)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('name', '2025 Talent Stream')
        .field(
          'description',
          'Suspendisse auctor nisi luctus mauris porttitor, quis tincidunt massa aliquet.'
        )
        .attach('media', path.resolve(__dirname, '../assets/img/sport.jpg'))
        .end((err, res) => {
          lineupId = res.body.data._id;
          done();
        });
    });
    it('should not delete lineup if the user does not supply a token', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/lineup/${lineupId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not delete lineup if the token is invalid', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/lineup/${lineupId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should delete lineup if lineup is found', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/lineup/${lineupId}`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have
            .property('message')
            .eql('lineup deleted successfully');
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
      LineupController.deleteLineup(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('POST api/v1/lineup/talent/:talentId', () => {
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
            lineupId = myuser._id;
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

                  TalentLineup.create({
                    userId: talentId,
                    lineupId,
                  })
                    .then((user) => {
                      oldTalentId = user.userId;
                      done();
                    })
                    .catch((err) => {
                      logger.error(err);
                    });
                }
              }
            );
          }
        }
      );
    });
    it('should not add talent if the user does not supply a token', (done) => {
      chai
        .request(app)
        .post(`/api/v1/lineup/talent/${talentId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not add talent if the token is invalid', (done) => {
      chai
        .request(app)
        .post(`/api/v1/lineup/talent/${talentId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not add talent if talent already exist', (done) => {
      chai
        .request(app)
        .post(`/api/v1/lineup/talent/${oldTalentId}`)
        .send({
          oldTalentId,
          lineupId,
          marketValue: '80000',
          contractEndMonth: 'June',
          contractEndYear: '2020',
        })
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have
            .property('message')
            .eql('you already sent a request to this talent');
          done();
        });
    });
    it('should add talent if talent does not exist', (done) => {
      chai
        .request(app)
        .post(`/api/v1/lineup/talent/${newTalentId}`)
        .set('token', token)
        .send({
          newTalentId,
          lineupId,
        })
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
      LineupController.addTalentToLineup(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });

  describe('PUT api/v1/lineup/talent/:talentId', () => {
    before((done) => {
      Auth.findOne({ email: 'john@gmail.com' }, (err, myuser) => {
        if (myuser) {
          (async () => {
            talentId = myuser._id;
            token = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
          done();
        }
      });
    });
    it('should not update talent if the user does not supply  token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/lineup/talent/${talentId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not update talent if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/lineup/talent/${talentId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should update talent ', (done) => {
      chai
        .request(app)
        .put(`/api/v1/lineup/talent/${talentId}`)
        .set('token', token)
        .send(updatetalent)
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
      LineupController.updateTalent(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('GET api/v1/lineup/talent/all', () => {
    it('should not get talents if the user does not supply a token', (done) => {
      chai
        .request(app)
        .get('/api/v1/lineup/talent/all')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not get talents if the token is invalid', (done) => {
      chai
        .request(app)
        .get('/api/v1/lineup/talent/all')
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should get talents if talents are found', (done) => {
      chai
        .request(app)
        .get('/api/v1/lineup/talent/all')
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
      LineupController.getLineUpTalents(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('DELETE /api/v1/lineup/talent/talentId', () => {
    it('should not delete talent if the user does not supply a token', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/lineup/talent/${talentId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not delete talent if the token is invalid', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/lineup/talent/${talentId}`)
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
        .delete(`/api/v1/lineup/talent/${talentId}`)
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
      LineupController.removeTalentFromLineup(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
});
