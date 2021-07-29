const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user/user.js');
const Task = require('../../src/models/task/task.js');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneId,
	name: 'mike',
	email: 'mike123@any.com',
	password: '12345678',
	tokens: [
		{
			token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
		}
	]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
	_id: userTwoId,
	name: 'kohli',
	email: 'kohli123@any.com',
	password: '12345678',
	tokens: [
		{
			token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
		}
	]
};

const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	description: 'First Task',
	completed: false,
	owner: userOne._id
};

const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	description: 'Second Task',
	completed: true,
	owner: userOne._id
};

const taskThree = {
	_id: new mongoose.Types.ObjectId(),
	description: 'Third Task',
	completed: true,
	owner: userTwo._id
};

const setupDatabase = async () => {
	await User.deleteMany();//empty all the users before test cases, we want empty db before any test
	await Task.deleteMany();

	await new User(userOne).save();
	await new User(userTwo).save();

	await new Task(taskOne).save();
	await new Task(taskTwo).save();
	await new Task(taskThree).save();
};

module.exports = {
	userOne,
	userOneId,
	userTwo,
	userTwoId,
	taskOne,
	taskTwo,
	taskThree,
	setupDatabase
}