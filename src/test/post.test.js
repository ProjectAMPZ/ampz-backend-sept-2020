import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import path from 'path';
import app from '../index';
import Helper from '../utils/user.utils';
import Auth from '../db/models/users.model';
import PostController from '../controllers/post.controller';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

let postToken;

describe('Post Route Endpoint', () => {
  describe('POST api/v1/post', () => {
    before((done) => {
      Auth.findOne({ email: 'okwuosachijioke1@gmail.com' }, (err, myuser) => {
        if (myuser) {
          (async () => {
            postToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
          done();
        }
      });
    });
    it('should not create post if the user does not supply a token', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=post')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create post if the token is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=post')
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });

    it('should not create post if the file type is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=post')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'POST CAPTION')
        .field('description', 'POST DESCRIPTION')
        .attach('media', path.resolve(__dirname, '../assets/img/svgimage.svg'))
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create post if the file type is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=academy')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', ' TEST ACADEMY CAPTION')
        .field('description', 'TEST ACADEMY DESCRIPTION')
        .attach('media', path.resolve(__dirname, '../assets/img/svgimage.svg'))
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });

    it('should not create post if the file type is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=event')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'TEST EVENT CAPTION')
        .field('description', 'TEST EVENT DESCRIPTION')
        .field('eventType', 'Football event')
        .field('sport', 'Football')
        .field('minAge', '16')
        .field('maxAge', '20')
        .field('country', 'Nigeria')
        .field('state', 'Lagos')
        .field('venue', 'Yaba')
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/svgimage.svg'))
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });

    it('should create post if post fields are submitted', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=post')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'TEST POST CAPTION')
        .field('description', 'TEST POST DESCRIPTION')
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/img3.jpg'))
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });

    it('should create post if virtual academy post fields are submitted', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=academy')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'TEST ACADEMY CAPTION')
        .field('description', 'TEST ACADEMY DESCRIPTION')
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/image2.jpg'))
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should create post if events post fields are submitted', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=event')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'TEST EVENT CAPTION')
        .field('description', 'TEST EVENT DESCRIPTION')
        .field('eventType', 'Football event')
        .field('sport', 'Football')
        .field('minAge', '16')
        .field('maxAge', '20')
        .field('country', 'Nigeria')
        .field('state', 'Lagos')
        .field('venue', 'Yaba')
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/image1.jpg'))
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
      PostController.createPost(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
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
