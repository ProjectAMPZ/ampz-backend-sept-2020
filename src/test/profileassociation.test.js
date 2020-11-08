import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import app from '../index';
import Helper from '../utils/user.utils';
import Auth from '../db/models/users.model';
import Association from '../db/models/association.model';
import AssociationController from '../controllers/association.contoller';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

let associationToken;
let associationUserId;
let associationId;

const partiallyconmpleteAssociation = {
  associationType: 'associationType',
  associationName: 'associationName',
  issueMonth: 1,
  issueYear: 1,
  active: true,
  description: 'description',
};

const conmpleteAssociation = {
  associationType: 'associationType',
  associationName: 'associationName',
  issueMonth: 1,
  issueYear: 1,
  expiryMonth: 1,
  expiryYear: 1,
  description: 'description',
  active: true,
};
const incompleteAssociation = {
  associationType: 'associationType',
  associationName: 'associationName',
};

const updateExperience = {
  associationType: 'associationType',
};

describe('Profile Association Route Endpoint', () => {
  describe('POST api/v1/profile/association', () => {
    before((done) => {
      Auth.findOne({ email: 'john@gmail.com' }, (err, myuser) => {
        if (myuser) {
          (async () => {
            associationToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
          done();
        }
      });
    });
    it('should not create association if the user does not supply a token', (done) => {
      chai
        .request(app)
        .post('/api/v1/profile/association')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create association if the token is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/profile/association')
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });

    it('should not create association if association is incomplete', (done) => {
      chai
        .request(app)
        .post('/api/v1/profile/association')
        .set('token', associationToken)
        .send(incompleteAssociation)
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
    it('should create association if association is partiallycomplete', (done) => {
      chai
        .request(app)
        .post('/api/v1/profile/association')
        .set('token', associationToken)
        .send(partiallyconmpleteAssociation)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should create association if association is complete', (done) => {
      chai
        .request(app)
        .post('/api/v1/profile/association')
        .set('token', associationToken)
        .send(conmpleteAssociation)
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
      AssociationController.createAssociation(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });

  describe('PUT api/v1/profile/association/:associationId', () => {
    before((done) => {
      Auth.findOne({ email: 'john@gmail.com' }, (err, myuser) => {
        if (myuser) {
          (async () => {
            associationUserId = myuser._id;
            associationToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
        }
      });
      Association.create(
        {
          associationName: 'institution',
          associationType: 'associationType',
          issueMonth: 1,
          issueYear: 1,
          expiryMonth: 1,
          expiryYear: 1,
          description: 'description',
          active: false,
          userId: associationUserId,
        },
        (err, association) => {
          associationId = association._id;
          done();
        }
      );
    });
    it('should not update association if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/association/${associationId}`)
        .send(updateExperience)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });

    it('should not update association if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/association/${associationId}`)
        .set('token', 'invalid token')
        .send(updateExperience)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not update association if association is not found', (done) => {
      chai
        .request(app)
        .put('/api/v1/profile/association/5f723030f2a978274813c51d')
        .set('token', associationToken)
        .send(updateExperience)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('message').eql('association not found');
          done();
        });
    });
    it('should update association if association is found', (done) => {
      chai
        .request(app)
        .put(`/api/v1/profile/association/${associationId}`)
        .set('token', associationToken)
        .send(updateExperience)
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
      AssociationController.updateAssociation(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('GET api/v1/profile/association/:associationId', () => {
    before((done) => {
      Auth.findOne({ email: 'john@gmail.com' }, (err, myuser) => {
        if (myuser) {
          (async () => {
            associationUserId = myuser._id;
            associationToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
        }
      });
      Association.create(
        {
          associationName: 'institution',
          associationType: 'associationType',
          issueMonth: 1,
          issueYear: 1,
          expiryMonth: 1,
          expiryYear: 1,
          description: 'description',
          active: true,
          userId: associationUserId,
        },
        (err, association) => {
          associationId = association._id;
          done();
        }
      );
    });
    it('should not get association if the user does not supply a token', (done) => {
      chai
        .request(app)
        .get(`/api/v1/profile/association/${associationId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });

    it('should not get association if the token is invalid', (done) => {
      chai
        .request(app)
        .get(`/api/v1/profile/association/${associationId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not get association if association is not found', (done) => {
      chai
        .request(app)
        .get('/api/v1/profile/association/5f723030f2a978274813c51d')
        .set('token', associationToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('message').eql('association not found');
          done();
        });
    });
    it('should get association if association is found', (done) => {
      chai
        .request(app)
        .get(`/api/v1/profile/association/${associationId}`)
        .set('token', associationToken)
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
      AssociationController.getAssociation(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });

  describe('DELETE api/v1/profile/association/:associationId', () => {
    before((done) => {
      Auth.findOne({ email: 'john@gmail.com' }, (err, myuser) => {
        if (myuser) {
          (async () => {
            associationUserId = myuser._id;
            associationToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
        }
      });
      Association.create(
        {
          associationName: 'institution',
          associationType: 'associationType',
          issueMonth: 1,
          issueYear: 1,
          expiryMonth: 1,
          expiryYear: 1,
          description: 'description',
          active: false,
          userId: associationUserId,
        },
        (err, association) => {
          associationId = association._id;
          done();
        }
      );
    });
    it('should not delete association if the user does not supply a token', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/profile/association/${associationId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not delete association if the token is invalid', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/profile/association/${associationId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not delete association if association is not found', (done) => {
      chai
        .request(app)
        .delete('/api/v1/profile/association/5f70f3fee718fe18e4635e48')
        .set('token', associationToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('404 Not Found');
          res.body.should.have.property('error').eql('association not found');
          done();
        });
    });
    it('should delete association if association is found', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/profile/association/${associationId}`)
        .set('token', associationToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have
            .property('message')
            .eql('association deleted successfully');
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
      AssociationController.deleteAssociation(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
});
