const request = require('supertest'); // supertest allow us to test express apps my meking requests to api end points
const app = require('../src/app');
const User = require('../src/models/user/user.js');
const {userOne, userOneId, setupDatabase} = require('./fixtures/db');


beforeEach(setupDatabase)   //method from jest, it will run before test cases

test('should signup a new user',async()=>{
    const response = await request(app).post('/users').send({
        name:"testname",
        email:"testemail@gmail.com",
        password:"testtestest"
    }).expect(200) //assertion about the response status

    //using response , we can perform assersion (fetch the user from the database and checking is it same as we requested to send)
    const user = await User.findById(response.body.user._id);
    console.log(user,response.body);
    expect(user).not.toBeNull()//error //methods from expect library in supertest

    //assertion about the response body
    expect(response.body).toMatchObject({
        user:{
            name:"testname",
            email:"testemail@gmail.com",
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe("testtestest")
})

test('Should login existing user', async()=>{
    const response = await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non existing user',async()=>{//error
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:'xyz123456'
    }).expect(400) 
})

test('Should get profile for user', async()=>{//error/failed
    await request(app).get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get profile for unauthenticated user',async()=>{
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user',async()=>{//error
    await request(app).delete('/users/me')
        .set('Authorization','Bearer ' + userOne.tokens[0].token)
        .send()
        .expect(200)
        const user = await User.findById(userOneId);
        expect(user).toBeNull();

})

test('should not delete account for unauthenticate user',async()=>{
    await request(app).delete('/users/me')
        .send()
        .expect(401);
})
//flag
test('Should upload avatar image', async()=>{
    await request(app).post('/users/me/avatar')
        .set('Authorization','Bearer ' + userOne.tokens[0].token)
        .attach('avatar','tests/fixtures/flower.jpg')//from root dir
        .expect(200)

    const user = await User.findById(userOneId);
    
    expect(user.avatar).toEqual(expect.any(Buffer)); //toBe() and toEqual are diffrent
})
//flag
test('Should update valid user profile', async () => {
	await request(app).patch('/users/me')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.send({
			name: 'Jess'
		})
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.name).toEqual('Jess');
});

test('Should not update invalid user fields', async () => {
	await request(app).patch('/users/me')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.send({
			location: 'Delhi'
		})
		.expect(400);
});

