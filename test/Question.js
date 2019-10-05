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
import { aUser, aQuestion } from './testData';

chai.use(chaiHttp);

let token;
let questionId;

describe('User asks a question: POST /questions', () => {
  before(async () => {
    const password = bcrypt.hashSync(aUser.password, 10);
    await User.create({ ...aUser, password });

    const response = await chai.request(app).post('/api/v1/auth/login').send(aUser);
    token = (response.body.data || {}).token || '';
  });

  after(async () => {
    await User.deleteMany({});
    await Question.deleteMany({});
  });

  it('should successfully post a question', async () => {
    const response = await chai.request(app)
      .post('/api/v1/questions').send(aQuestion).set('Authorization', token);

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data.title).to.eqls(aQuestion.title);
    expect(response.body.data.body).to.eqls(aQuestion.body);
  });

  it('should fail to ask a question without a body', async () => {
    const response = await chai.request(app)
      .post('/api/v1/questions').send({
        title: 'Hello',
      }).set('Authorization', token);

    expect(response.status).to.eqls(codes.badRequest);
    expect(response.body.status).to.eqls(codes.badRequest);
    expect(response.body.error).eqls('Validation errors.');
    expect(response.body.fields.body).eqls('Body is required.');
  });

  it('should view questions', async () => {
    const response = await chai.request(app).get('/api/v1/questions');

    questionId = ((response.body.data || [])[0] || {})._id;

    expect(response.status).to.eqls(codes.success);
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data).to.be.an('array');
    expect(response.body.data[0].title).eqls(aQuestion.title);
  });

  it('should view a question', async () => {
    const response = await chai.request(app).get(`/api/v1/questions/${questionId}`);

    expect(response.status).to.eqls(codes.success);
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data).to.be.an('object');
    expect(response.body.data.title).eqls(aQuestion.title);
  });

  it('should fail to view a question that does not exist', async () => {
    const response = await chai.request(app).get('/api/v1/questions/455');

    expect(response.status).to.eqls(codes.notFound);
    expect(response.body.status).to.eqls(codes.notFound);
    expect(response.body.error).eqls('Question not found.');
  });
});
