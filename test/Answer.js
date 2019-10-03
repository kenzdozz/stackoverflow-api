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

const aQuestion = {
  title: 'Http request in Go',
  body: 'How can I make a http request in Go?',
};

const anAswer = {
  body: 'Its so easy',
};

let token;
let questionId;

describe('User asks a question: POST /questions', () => {
  before(async () => {
    const password = bcrypt.hashSync(aUser.password, 10);
    await User.create({ ...aUser, password });

    const res1 = await chai.request(app).post('/api/v1/auth/login').send(aUser);
    token = (res1.body.data || {}).token || '';

    const res2 = await chai.request(app).post('/api/v1/questions').send(aQuestion).set('Authorization', token);
    questionId = ((res2.body.data || {}))._id;
  });

  after(async () => {
    await User.deleteMany({});
    await Question.deleteMany({});
  });

  it('should successfully post an answer', async () => {
    const response = await chai.request(app)
      .post(`/api/v1/questions/${questionId}`).send(anAswer).set('Authorization', token);

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data.body).to.eqls(anAswer.body);
  });

  it('should fail to answer a question without Authorization', async () => {
    const response = await chai.request(app)
      .post(`/api/v1/questions/${questionId}`).send({ body: 'Hello' });

    expect(response.status).to.eqls(codes.unAuthorized);
    expect(response.body.status).to.eqls(codes.unAuthorized);
    expect(response.body.error).eqls('Authorization is required.');
  });

  it('should fail to answer a question that does not exist', async () => {
    const response = await chai.request(app)
      .post('/api/v1/questions/897').send({ body: 'Hello' }).set('Authorization', token);

    expect(response.status).to.eqls(codes.notFound);
    expect(response.body.status).to.eqls(codes.notFound);
    expect(response.body.error).eqls('Question not found.');
  });
});
