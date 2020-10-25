import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import path from 'path';
import app from '../index';
import Helper from '../utils/user.utils';
import Auth from '../db/models/users.model';
import PostController from '../controllers/post.controller';
import PostServices from '../services/post.services';

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
    it('should not create post if token is invalid', (done) => {
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
        .field('startDate', '10/10/2020')
        .field('endDate', '20/10/2020')
        .field('startTime', '09:00AM')
        .field('endTime', '4:00PM')
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
        .attach(
          'media',
          path.resolve(
            __dirname,
            '../assets/img/pexels-digital-buggu-186241.jpg'
          )
        )
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
        .field('startDate', '10/10/2020')
        .field('endDate', '20/10/2020')
        .field('startTime', '09:00AM')
        .field('endTime', '4:00PM')
        .attach(
          'media',
          path.resolve(
            __dirname,
            '../assets/img/pexels-saruul-saruulaa-5489581.mp4'
          )
        )
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
        .field('startDate', '10/10/2020')
        .field('endDate', '20/10/2020')
        .field('startTime', '09:00AM')
        .field('endTime', '4:00PM')
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
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not update post if the file is invalid', (done) => {
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
    it('should update post if update fields are supplied', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/${postId}`)
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'Humble Beginings')
        .attach(
          'media',
          path.resolve(
            __dirname,
            '../assets/img/pexels-saruul-saruulaa-5489581.mp4'
          )
        )
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
  describe('PUT api/v1/post/like/:postId', () => {
    it('should not like or unlike post if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/like/${postId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not like or unlike post if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/like/${postId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should like a post if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/like/${postId}`)
        .set('token', postToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should unlike a post if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/like/${postId}`)
        .set('token', postToken)
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
      PostController.likePost(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('PUT api/v1/post/bookmark/:postId', () => {
    it('should not bookmark or remove post if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/bookmark/${postId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not bookmark or remove post if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/bookmark/${postId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should bookmark a post if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/bookmark/${postId}`)
        .set('token', postToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should remove bookamrk from a post if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/bookmark/${postId}`)
        .set('token', postToken)
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
      PostController.bookmarkPost(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('PUT api/v1/post/comment/:postId', () => {
    it('should not comment on post if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/comment/${postId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not comment on post if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/comment/${postId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not comment on post if comment is not supplied', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/comment/${postId}`)
        .set('token', postToken)
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
    it('should comment on a post if a user supplies valid token and comment', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/comment/${postId}`)
        .set('token', postToken)
        .send({ text: 'This is test comment' })
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
      PostController.commentOnPost(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('PUT api/v1/post/count/:postId', () => {
    it('should not increase post count if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/count/${postId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not increase post count if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/count/${postId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not increase post count if category is not supplied', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/count/${postId}`)
        .set('token', postToken)
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
    it('should increase post view count if a user supplies valid token and category', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/count/${postId}`)
        .set('token', postToken)
        .send({ category: 'share' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should increase post share count if a user supplies valid token and category', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/count/${postId}`)
        .set('token', postToken)
        .send({ category: 'share7' })
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
      PostController.increaseCount(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('Post Services Mock', () => {
    it('Should fake server error on likedByUser function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.likedByUser(req, res);
      res.status.should.have.callCount(0);
      done();
    });
    it('Should fake server error on unlike function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.unLike(req, res);
      res.status.should.have.callCount(0);
      done();
    });
    it('Should fake server error on like function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.like(req, res);
      res.status.should.have.callCount(0);
      done();
    });
    it('Should fake server error on likedByUser function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.bookmarkedByUser(req, res);
      res.status.should.have.callCount(0);
      done();
    });
    it('Should fake server error on unlike function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.bookmark(req, res);
      res.status.should.have.callCount(0);
      done();
    });
    it('Should fake server error on like function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.removeBookmark(req, res);
      res.status.should.have.callCount(0);
      done();
    });
    it('Should fake server error on appliedForByUser function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.appliedForByUser(req, res);
      res.status.should.have.callCount(0);
      done();
    });
    it('Should fake server error on removeApplication function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.removeApplication(req, res);
      res.status.should.have.callCount(0);
      done();
    });
    it('Should fake server error on makeApplication function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.makeApplication(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });
  describe('DELETE api/v1/profile/post/:postId', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/post')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'UPDATE POST')
        .field('description', 'UPDATE POST DESCRIPTION')
        .field('eventType', 'Football event')
        .field('sport', 'Football')
        .field('minAge', '16')
        .field('maxAge', '20')
        .field('country', 'Nigeria')
        .field('state', 'Lagos')
        .field('venue', 'Yaba')
        .field('startDate', '10/10/2020')
        .field('endDate', '20/10/2020')
        .field('startTime', '09:00AM')
        .field('endTime', '4:00PM')
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/image1.jpg'))
        .end((err, res) => {
          postId = res.body.data._id;
          mediaUrl = res.body.data.mediaUrl;
          done();
        });
    });
    it('should not delete post if the user does not supply a token', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/post/${postId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not delete post if the token is invalid', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/post/${postId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not delete post if post is not found', (done) => {
      chai
        .request(app)
        .delete('/api/v1/post/5f70f3fee718fe18e4635e48')
        .set('token', postToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('404 Not Found');
          res.body.should.have.property('error').eql('post not found');
          done();
        });
    });
    it('should delete post if post is found', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/post/${postId}`)
        .set('token', postToken)
        .send('mediaUrl', `${mediaUrl}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have
            .property('message')
            .eql('post deleted successfully');
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
      PostController.deletePost(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('PUT api/v1/post/application/:postId', () => {
    it('should not make application if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/application/${postId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not not make application if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/application/${postId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should apply for an event if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/application/${postId}`)
        .set('token', postToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should apply for an event if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/application/${postId}`)
        .set('token', postToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should remove an application if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/application/${postId}`)
        .set('token', postToken)
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
      PostController.applyForEvent(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('PUT api/v1/post/report/:postId', () => {
    it('should not report post if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/report/${postId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not report post if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/report/${postId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not report post if text is not supplied', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/report/${postId}`)
        .set('token', postToken)
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
    it('should report post if a user supplies valid token and text', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/report/${postId}`)
        .set('token', postToken)
        .send({ text: 'This is test report' })
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
      PostController.reportPost(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('GET api/v1/post/:postId', () => {
    it('should get all post, events and virtual coach posts', (done) => {
      chai
        .request(app)
        .get(`/api/v1/post/${postId}`)
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
      PostController.getPost(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
});
