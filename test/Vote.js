/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import User from '../src/database/models/User';
import codes from '../src/helpers/statusCodes';
import Question from '../src/database/models/Question';
import {
  aUser, aQuestion, aUser2, anAswer,
} from './testData';

chai.use(chaiHttp);

let token;
let token2;
let questionId;
let answerId;

describe('User asks a question: POST /questions', () => {
  before(async () => {
    const res1 = await chai.request(app).post('/api/v1/auth/signup').send(aUser);
    token = (res1.body.data || {}).token || '';

    const res2 = await chai.request(app).post('/api/v1/questions').send(aQuestion).set('Authorization', token);
    questionId = (res2.body.data || {})._id;

    const res3 = await chai.request(app)
      .post(`/api/v1/questions/${questionId}`).send(anAswer).set('Authorization', token);
    answerId = (res3.body.data || {})._id;

    const res4 = await chai.request(app).post('/api/v1/auth/signup').send(aUser2);
    token2 = (res4.body.data || {}).token || '';
  });

  after(async () => {
    await User.deleteMany({});
    await Question.deleteMany({});
  });

  it('should successfully upvote a question', async () => {
    const response = await chai.request(app)
      .post('/api/v1/votes/question').send({
        vote: 1, id: questionId,
      }).set('Authorization', token2);

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.message).to.eqls('Upvoted successfully.');

    const response2 = await chai.request(app).get(`/api/v1/questions/${questionId}`);
    expect(response2.status).to.eqls(codes.success);
    expect(response2.body.data.voteCount).to.eqls(1);
  });

  it('should successfully downvote a question', async () => {
    const response = await chai.request(app)
      .post('/api/v1/votes/question').send({
        vote: -1, id: questionId,
      }).set('Authorization', token2);

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.message).to.eqls('Downvoted successfully.');

    const response2 = await chai.request(app).get(`/api/v1/questions/${questionId}`);
    expect(response2.status).to.eqls(codes.success);
    expect(response2.body.data.voteCount).to.eqls(0);
  });

  it('should successfully downvote an answer', async () => {
    const response = await chai.request(app)
      .post('/api/v1/votes/answer').send({
        vote: -1, id: answerId,
      }).set('Authorization', token2);

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.message).to.eqls('Downvoted successfully.');

    const response2 = await chai.request(app).get(`/api/v1/questions/${questionId}`);
    expect(response2.status).to.eqls(codes.success);
    expect(response2.body.data.answers[0].voteCount).to.eqls(-1);
  });

  it('should successfully upvote an answer', async () => {
    const response = await chai.request(app)
      .post('/api/v1/votes/answer').send({
        vote: 1, id: answerId,
      }).set('Authorization', token2);

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.message).to.eqls('Upvoted successfully.');

    const response2 = await chai.request(app).get(`/api/v1/questions/${questionId}`);
    expect(response2.status).to.eqls(codes.success);
    expect(response2.body.data.answers[0].voteCount).to.eqls(0);
  });

  it('should fail to vote for self', async () => {
    const response = await chai.request(app)
      .post('/api/v1/votes/answer').send({
        vote: 1, id: answerId,
      }).set('Authorization', token);

    expect(response.status).to.eqls(codes.badRequest);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.badRequest);
    expect(response.body.error).to.eqls('Cannot not vote for your post.');
  });
});
