import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.should();
chai.use(chaiHttp);

const user = {
  username: 'hackerbay',
  password: '24567/8'
};
const invalidUser = {
  username: '',
  password: '24567/8'
};

describe('Auth Route Endpoints', () => {
  describe('POST api/v1/auth/login', () => {
    it('should successfully login a user if he/she provides valid credentials', (done) => {
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
    it('should not login a user if he/she provides invalid credentials', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(invalidUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
  });
});