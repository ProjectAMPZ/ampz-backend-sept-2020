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
let postId;
let mediaUrl;

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
    it('should not create post if the file type is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=academy')
        .set('token', postToken)
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

    it('should not create post if the file type is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=event')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'Humble Beginings')
        .field(
          'description',
          'Join one of the top football academies such as Pepsi Academy, KSFA, Mildas Academy through our annaul Basketball Tour.'
        )
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
        .field('caption', 'Humble Beginings')
        .field(
          'description',
          'Join one of the top football academies such as Pepsi Academy, KSFA, Mildas Academy through our annaul Basketball Tour.'
        )
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/sport.jpg'))
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
        .field('caption', 'Humble Beginings')
        .field(
          'description',
          'Join one of the top football academies such as Pepsi Academy, KSFA, Mildas Academy through our annaul Basketball Tour.'
        )
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/sport.jpg'))
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
        .field('caption', 'Humble Beginings')
        .field(
          'description',
          'Join one of the top football academies such as Pepsi Academy, KSFA, Mildas Academy through our annaul Basketball Tour.'
        )
        .field('eventType', 'Football event')
        .field('sport', 'Football')
        .field('minAge', '16')
        .field('maxAge', '20')
        .field('country', 'Nigeria')
        .field('state', 'Lagos')
        .field('venue', 'Yaba')
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/sport.jpg'))
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

  describe('PUT api/v1/post/:postId', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/post')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'Humble Beginings')
        .field(
          'description',
          'Join one of the top football academies such as Pepsi Academy, KSFA, Mildas Academy through our annaul Basketball Tour.'
        )
        .field('eventType', 'Football event')
        .field('sport', 'Football')
        .field('minAge', '16')
        .field('maxAge', '20')
        .field('country', 'Nigeria')
        .field('state', 'Lagos')
        .field('venue', 'Yaba')
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/sport.jpg'))
        .end((err, res) => {
          postId = res.body.data._id;
          done();
        });
    });
    it('should not update post if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/${postId}`)
        .field(
          'description',
          'Join one of the top football academies such as Pepsi Academy, KSFA, Mildas Academy through our annaul Basketball Tour.'
        )
        .field('eventType', 'Football event')
        .attach('media', path.resolve(__dirname, '../assets/img/sport.jpg'))
        .field(
          'mediaUrl',
          'https://ampz-backend-sept.s3-us-west-1.amazonaws.com/1601135199782'
        )
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not update post if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/${postId}`)
        .set('token', 'invalid token')
        .field(
          'description',
          'Join one of the top football academies such as Pepsi Academy, KSFA, Mildas Academy through our annaul Basketball Tour.'
        )
        .field('eventType', 'Football event')
        .attach('media', path.resolve(__dirname, '../assets/img/sport.jpg'))
        .field(
          'mediaUrl',
          'https://ampz-backend-sept.s3-us-west-1.amazonaws.com/1601135199782'
        )
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });

    it('should not update post if the file type is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/${postId}`)
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'Humble Beginings')
        .field(
          'description',
          'Join one of the top football academies such as Pepsi Academy, KSFA, Mildas Academy through our annaul Basketball Tour.'
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

    it('should update post if update fields is supplied', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/${postId}`)
        .set('token', postToken)
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
      PostController.updatePost(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
});
