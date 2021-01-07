import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import app from '../index';
import Helper from '../utils/user.utils';
import FilterController from '../controllers/filter.controller';
import Auth from '../db/models/users.model';
import Filter from '../db/models/filter.model';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

const filter = {
  gender: 'Male',
  sport: '1',
  position: 'CD',
  education: '2',
  skillrating: '7',
  location: 'Ogun',
  age: '19',
};

const updatefilter = {
  gender: 'Female',
};

let token;
let userId;
let filterId;

before((done) => {
  Auth.findOne({ email: 'rasheedshinaopeyemi@gmail.com' }, (err, user) => {
    if (user) {
      (async () => {
        userId = user._id;
        token = await Helper.generateToken(user._id, user._role, user.userName);
      })();
      done();
    }
  });
});

describe('Filter Route Endpoint', () => {
  describe('POST api/v1/filter', () => {
    it('should not create filter if the user does not supply token', (done) => {
      chai
        .request(app)
        .post('/api/v1/filter')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create filter if the token is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/filter')
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not create filter if filter name is absent', (done) => {
      chai
        .request(app)
        .post('/api/v1/filter')
        .set('token', token)
        .send({
          gender: 'Male',
          sport: '1',
          position: 'CD',
          userId,
        })
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
    it('should create filter if the token is valid', (done) => {
      chai
        .request(app)
        .post('/api/v1/filter')
        .set('token', token)
        .send({
          gender: 'Male',
          sport: '1',
          position: 'CD',
          education: '2',
          filterName: 'first Filter',
          userId,
        })
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
      FilterController.createFilter(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });

  describe('PUT api/v1/filter/:filterId', () => {
    before((done) => {
      Filter.create(
        {
          gender: 'Male',
          sport: '1',
          userId,
        },
        (err, filter) => {
          filterId = filter._id;
          done();
        }
      );
    });
    it('should not update filter if the user does not supply token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/filter/${filterId}`)
        .send(filter)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });

    it('should not update filter if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/filter/${filterId}`)
        .set('token', 'invalid token')
        .send(filter)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not update filter if filter is not found', (done) => {
      chai
        .request(app)
        .put('/api/v1/filter/5f723030f2a978274813c51d')
        .set('token', token)
        .send(filter)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('message').eql('filter not found');
          done();
        });
    });
    it('should update filter if filter is found', (done) => {
      chai
        .request(app)
        .put(`/api/v1/filter/${filterId}`)
        .set('token', token)
        .send(updatefilter)
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
      FilterController.updateFilter(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('GET api/v1/filter/:filterId', () => {
    before((done) => {
      Filter.create(
        {
          sport: '1',
          position: 'CD',
          education: '2',
          userId,
        },
        (err, filter) => {
          filterId = filter._id;
          done();
        }
      );
    });
    it('should not get filter if the user does not supply a token', (done) => {
      chai
        .request(app)
        .get(`/api/v1/filter/${filterId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not get filter if the token is invalid', (done) => {
      chai
        .request(app)
        .get(`/api/v1/filter/${filterId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not get filter if filter is not found', (done) => {
      chai
        .request(app)
        .get('/api/v1/filter/5f723030f2a978274813c51d')
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('message').eql('filter not found');
          done();
        });
    });
    it('should get filter if filter is found', (done) => {
      chai
        .request(app)
        .get(`/api/v1/filter/${filterId}`)
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
      FilterController.getFilter(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('GET api/v1/filter/filters/user', () => {
    it('should not get filters if the user does not supply a token', (done) => {
      chai
        .request(app)
        .get('/api/v1/filter/filters/user')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not get filters if the token is invalid', (done) => {
      chai
        .request(app)
        .get('/api/v1/filter/filters/user')
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should get filters if filters are found', (done) => {
      chai
        .request(app)
        .get('/api/v1/filter/filters/user')
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
      FilterController.getFilters(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('DELETE api/v1/filter/:filterId', () => {
    before((done) => {
      Filter.create(
        {
          sport: '1',
          position: 'CD',
          education: '2',
          userId,
        },
        (err, filter) => {
          filterId = filter._id;
          done();
        }
      );
    });
    it('should not delete filter if user does not supply token', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/filter/${filterId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not delete filter if the token is invalid', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/filter/${filterId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not delete filter if filter is not found', (done) => {
      chai
        .request(app)
        .delete('/api/v1/filter/5f70f3fee718fe18e4635e48')
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('404 Not Found');
          res.body.should.have.property('error').eql('filter not found');
          done();
        });
    });
    it('should delete filter if filter is found', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/filter/${filterId}`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have
            .property('message')
            .eql('filter deleted successfully');
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
      FilterController.deleteFilter(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
});
