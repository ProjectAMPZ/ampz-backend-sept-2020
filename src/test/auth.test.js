import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import app from '../index';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

const user = {
  username: 'hackerbay',
  password: '24567/8'
};
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
  describe('POST api/v1/auth/login', () => {
    it('should successfully login a user if he/she provides valid credentials', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
  });
});
