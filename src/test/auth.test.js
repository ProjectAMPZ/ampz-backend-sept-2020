import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sgMail from '@sendgrid/mail';
import sinon from 'sinon';
import app from '../index';
import Auth from '../db/models/users.model';
import Activation from '../db/models/accountActivation.model';
import AuthController from '../controllers/auth.controller';
import Email from '../utils/email.utils';
import AuthService from '../services/auth.services';
import logger from '../config';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);
const { expect } = chai;

let passcode;

const incompleteUser = {
  username: 'hackerbay',
  password: '24567/8'
};
const user = {
  fullName: 'hackerbay',
  userName: 'jackson',
  email: 'okwuosachijioke1@gmail.com',
  password: '123456',
  confirmPassword: '123456',
  gender: 'male',
  country: '234',
  phoneNumber: '07037381011',
  dayOfBirth: '22',
  monthOfBirth: '08',
  yearOfBirth: '1990',
  role: '123'
};
const emailExist = {
  fullName: 'hackerbay',
  userName: 'mackson',
  email: 'okwuosachijioke1@gmail.com',
  password: '123456',
  confirmPassword: '123456',
  gender: 'male',
  country: '234',
  phoneNumber: '08037381011',
  dayOfBirth: '22',
  monthOfBirth: '08',
  yearOfBirth: '1990',
  role: '123'
};
const usernameExist = {
  fullName: 'hackerbay',
  userName: 'jackson',
  email: 'okwuosachijioke91@gmail.com',
  password: '123456',
  confirmPassword: '123456',
  gender: 'male',
  country: '234',
  phoneNumber: '08037381011',
  dayOfBirth: '22',
  monthOfBirth: '08',
  yearOfBirth: '1990',
  role: '123'
};
const phoneExist = {
  fullName: 'hackerbay',
  userName: 'jacksojn',
  email: 'okwuosachij8ioke9@gmail.com',
  password: '123456',
  confirmPassword: '123456',
  gender: 'male',
  country: '234',
  phoneNumber: '07037381011',
  dayOfBirth: '22',
  monthOfBirth: '08',
  yearOfBirth: '1990',
  role: '123'
};
const invalidEmail = {
  email: 'hackerbay@gmail.com',
  passcode: '245678',
  password: '123456'
};
const wrongPasscode = {
  email: 'okwuosachijioke1@gmail.com',
  passcode: 'passcode',
  password: 'uuiyuiy'
};

before((done) => {
  Activation.deleteMany({ email: 'okwuosachijioke1@gmail.com' }, (err) => {
    if (err) {
      logger.error(err);
    } else {
      Auth.deleteOne({ email: 'okwuosachijioke1@gmail.com' }, (err) => {
        if (err) {
          logger.error(err);
        } else {
          done();
        }
      });
    }
  });
});

describe('No Matching Endpoint', () => {
  describe('* Unknown ', () => {
    it('should throw 404 error when endpoint is not found', (done) => {
      chai.request(app)
        .post('/api/v1/auth/none')
        .send(user)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});

describe('Auth Route Endpoints', () => {
  describe('POST api/v1/auth/signup', () => {
    it('should not create account if the user supplies incomplete information', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(incompleteUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should create account if the user supplies complete and valid information', (done) => {
      const stub = sinon.stub(sgMail, 'send').callsFake(() => 'done');
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message');
          stub.restore();
          done();
        });
    });
    it('should not create account if the user supplies already exisiting email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(emailExist)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('409 Conflict');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create account if the user supplies already exisiting username', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(usernameExist)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('409 Conflict');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create account if the user supplies already exisiting phone number', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(phoneExist)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('409 Conflict');
          res.body.should.have.property('error');
          done();
        });
    });
    it('Should fake server error', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {}
      };
      sinon.stub(res, 'status').returnsThis();
      AuthController.signUp(req, res);
      (res.status).should.have.callCount(0);
      done();
    });
  });
  describe('POST api/v1/auth/activate_account', () => {
    before((done) => {
      Activation.find({ email: 'okwuosachijioke1@gmail.com' }, (err, myuser) => {
        if (myuser) {
          passcode = myuser[0].passcode;
          done();
        }
      });
    });
    it('should not activate user account if the user supplies incomplete information', (done) => {
      chai.request(app)
        .post('/api/v1/auth/activate_account')
        .send(incompleteUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should activate user account if the user supplies complete valid information', (done) => {
      chai.request(app)
        .post('/api/v1/auth/activate_account')
        .send({
          email: 'okwuosachijioke1@gmail.com',
          passcode
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should not activate user account if the user email cannot be found', (done) => {
      chai.request(app)
        .post('/api/v1/auth/activate_account')
        .send(invalidEmail)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not activate user account if the user supplies wrong passcode', (done) => {
      chai.request(app)
        .post('/api/v1/auth/activate_account')
        .send(wrongPasscode)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
    it('Should fake server error', (done) => {
      const req = { body: {} };
      const res = {
        status() { },
        send() { }
      };
      sinon.stub(res, 'status').returnsThis();
      AuthController.activateAccount(req, res);
      (res.status).should.have.callCount(0);
      done();
    });
  });
  describe('Auth Services Mock', () => {
    it('Should fake server error on emailExist function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {}
      };
      sinon.stub(res, 'status').returnsThis();
      AuthService.emailExist(req, res);
      (res.status).should.have.callCount(0);
      done();
    });
    it('Should fake server error on usernameExist function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {}
      };
      sinon.stub(res, 'status').returnsThis();
      AuthService.usernameExist(req, res);
      (res.status).should.have.callCount(0);
      done();
    });
    it('Should fake server error on phoneExist function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {}
      };
      sinon.stub(res, 'status').returnsThis();
      AuthService.phoneExist(req, res);
      (res.status).should.have.callCount(0);
      done();
    });
    it('Should fake server error on matchCode function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {}
      };
      sinon.stub(res, 'status').returnsThis();
      AuthService.matchCode(req, res);
      (res.status).should.have.callCount(0);
      done();
    });
    it('Should mock encrypt password', () => {
      expect(AuthService.encrptPassword('reqBody'));
    });
    it('Should mock email function', () => {
      expect(Email());
    });
  });
  describe('POST api/v1/auth/login', () => {
    it('should not login a user if the user supplies incomplete information', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(incompleteUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should login a user account if the user supplies complete valid information', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should not login a user if the user email cannot be found', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(invalidEmail)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not login a user if the user supplies wrong password', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(wrongPasscode)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('Should fake server error', (done) => {
      const req = { body: {} };
      const res = {
        status() { },
        send() { }
      };
      sinon.stub(res, 'status').returnsThis();
      AuthController.login(req, res);
      (res.status).should.have.callCount(0);
      done();
    });
  });
});
