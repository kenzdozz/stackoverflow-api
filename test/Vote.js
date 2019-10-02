/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import app from '../src/app';
import User from '../src/database/models/User';
import codes from '../src/helpers/statusCodes';
import Question from '../src/database/models/Question';

chai.use(chaiHttp);

const aUser = {
  displayName: 'Kenz',
  email: 'kennet.onah@gmail.com',
  password: 'secret123',
};

const aUser2 = {
  displayName: 'Dozz',
  email: 'kenzdozz@gmail.com',
  password: 'secret123',
};

const aQuestion = {
  title: 'Http request in Go',
  body: 'How can I make a http request in Go?',
};

const anAswer = {
  body: 'Its so easy',
};

let token;
let token2;
let questionId;
let answerId;

describe('User asks a question: POST /questions', () => {
  before(async () => {
    const password = bcrypt.hashSync(aUser.password, 10);
    await User.create({ ...aUser, password });

    const res1 = await chai.request(app).post('/api/v1/auth/login').send(aUser);
    token = (res1.body.data || {}).token || '';

    const res2 = await chai.request(app).post('/api/v1/questions').send(aQuestion).set('Authorization', token);
    questionId = ((res2.body.data || [])[0] || {})._id;

    const res3 = await chai.request(app)
      .post(`/api/v1/questions/${questionId}`).send(anAswer).set('Authorization', token);
    answerId = ((res3.body.data || [])[0] || {})._id;

    const password2 = bcrypt.hashSync(aUser2.password, 10);
    await User.create({ ...aUser2, password2 });

    const res4 = await chai.request(app).post('/api/v1/auth/login').send(aUser2);
    token2 = (res4.body.data || {}).token || '';
  });

  after(async () => {
    await User.deleteMany({});
    await Question.deleteMany({});
  });

  it('should successfully upvote a question', async () => {
    const response = await chai.request(app)
      .post('/api/v1/votes/question').send({
        action: 'up', id: questionId,
      }).set('Authorization', token2);

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data.message).to.eqls('Upvoted successfully.');
  });

  it('should successfully downvote a question', async () => {
    const response = await chai.request(app)
      .post('/api/v1/votes/question').send({
        action: 'down', id: questionId,
      }).set('Authorization', token2);

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data.message).to.eqls('Downvoted successfully.');
  });

  it('should successfully upvote an answer', async () => {
    const response = await chai.request(app)
      .post('/api/v1/votes/answer').send({
        action: 'up', id: answerId,
      }).set('Authorization', token2);

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data.message).to.eqls('Upvoted successfully.');
  });

  it('should successfully downvote an answer', async () => {
    const response = await chai.request(app)
      .post('/api/v1/votes/answer').send({
        action: 'down', id: answerId,
      }).set('Authorization', token2);

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data.message).to.eqls('Downvoted successfully.');
  });

  it('should fail to vote for self', async () => {
    const response = await chai.request(app)
      .post('/api/v1/votes/answer').send({
        action: 'down', id: answerId,
      }).set('Authorization', token);

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.error).to.eqls('Cannot not vote for your post.');
  });
});
