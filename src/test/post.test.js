import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import app from '../index';
import PostController from '../controllers/post.controller';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

describe('Post Routes', () => {
  describe('GET api/v1/post/', () => {
    it('should get all post, events and virtual coach posts', (done) => {
      chai
        .request(app)
        .get('/api/v1/post/')
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
      PostController.getPosts(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });
});
