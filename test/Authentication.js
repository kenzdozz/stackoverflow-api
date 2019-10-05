/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import app from '../src/app';
import User from '../src/database/models/User';
import codes from '../src/helpers/statusCodes';
import { aUser } from './testData';

chai.use(chaiHttp);

describe('Login a user: POST /auth/login', () => {
  before(async () => {
    const password = bcrypt.hashSync(aUser.password, 10);
    await User.create({ ...aUser, password });
  });

  after(async () => {
    await User.deleteOne({ email: aUser.email });
  });

  it('should successfully login a user', async () => {
    const response = await chai.request(app)
      .post('/api/v1/auth/login').send({
        email: aUser.email,
        password: aUser.password,
      });

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data.token).to.be.a('string');
    expect(response.body.data.user).to.be.an('object');
    expect(response.body.data.user.displayName).to.eqls(aUser.displayName);
    expect(response.body.data.user.email).to.eqls(aUser.email);
  });

  it('should fail to login a user with incorrect email', async () => {
    const response = await chai.request(app)
      .post('/api/v1/auth/login').send({
        email: 'random@email.com',
        password: aUser.password,
      });

    expect(response.status).to.eqls(codes.unAuthorized);
    expect(response.body.status).to.eqls(codes.unAuthorized);
    expect(response.body.error).eqls('Invalid email address or password.');
  });

  it('should fail to login a user with incorrect password', async () => {
    const response = await chai.request(app)
      .post('/api/v1/auth/login').send({
        email: aUser.email,
        password: 'Userpassword',
      });

    expect(response.status).to.eqls(codes.unAuthorized);
    expect(response.body.status).to.eqls(codes.unAuthorized);
    expect(response.body.error).eqls('Invalid email address or password.');
  });
});

describe('Sign up a user: POST /auth/signup', () => {
  after(async () => {
    await User.deleteOne({ email: aUser.email });
  });

  it('should successfully signup a new user', async () => {
    const response = await chai.request(app).post('/api/v1/auth/signup').send(aUser);

    expect(response.status).to.eqls(codes.created);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.created);
    expect(response.body.data.token).to.be.a('string');
    expect(response.body.data.user).to.be.an('object');
    expect(response.body.data.user.displayName).to.eqls(aUser.displayName);
    expect(response.body.data.user.email).to.eqls(aUser.email);
  }).timeout(5000);

  it('should fail to create a user without a name', async () => {
    const aUser2 = { ...aUser, email: 'ken@ken.com' };
    delete aUser2.displayName;
    const response = await chai.request(app).post('/api/v1/auth/signup').send(aUser2);

    expect(response.status).to.eqls(codes.badRequest);
    expect(response.body.status).to.eqls(codes.badRequest);
    expect(response.body.error).eqls('Validation errors.');
    expect(response.body.fields.displayName).eqls('DisplayName is required.');
  });
});
