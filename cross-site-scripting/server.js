const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const moment = require('moment');

const { scheduleVisit } = require('./visitor');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

const db = low(new FileSync('/var/lib/xss/db.json'));
db.defaults({ posts: [
	{ id: '0', author: 'admin', timestamp: Date.now(), title: "Hello, Geekcamp 2018!", content: "Hey there! Hope you enjoy this challenge.\nNotice: I'm very strict today and will reject most posts. I also love links to cat pictures", approved: true, accepted: true },
], users: [] }).write();

const secret = process.env.JWT_SECRET;

const SCOPE_USER = 'user';
const SCOPE_ADMIN = 'admin';
const auth = (...scopes) => {
	return (req, res, next) => {
		const token = req.cookies.token;
		if (!token) {
			return res.redirect('/login');
		}
		const payload = jwt.verify(token, secret, {
			algorithms: ['HS256'],
			maxAge: '24h',
		});
		if (scopes.indexOf(payload.scope) < 0) {
			throw new Error('Scope does not match');
		}
		req.user = payload;
		next();
	};
};
const login = (res, subject, scope) => {
	const token = jwt.sign({
		scope: scope,
	}, secret, {
		algorithm: 'HS256',
		subject: subject,
	});
	res.cookie('token', token, { secure: false }); // httpOnly == false
	res.redirect(scope === SCOPE_ADMIN ? '/admin/' : '/');
};
const logout = (res) => {
	res.clearCookie('token', { secure: false });
	res.redirect('/');
};

const layout = (body) => {
	return `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Cross-Site Scripting</title>
			<link rel="stylesheet" href="/assets/bootstrap/css/bootstrap.min.css">
		</head>
		<body>
			${body}
		</body>
		</html>
	`;
};

app.use('/assets/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

const layout_login = (err) => {
	return layout(`
		<div class="container-fluid d-flex justify-content-center align-items-center vh-100">
			<div class="card w-100" style="max-width: 20rem">
				<h5 class="card-header">Login</h5>
				<div class="card-body">
					${err ? `
						<div class="alert alert-danger" role="alert">
							${err.message}
						</div>
					` : ''}
					<form method="POST">
						<div class="form-group">
							<label>Username</label>
							<input class="form-control" name="username">
						</div>
						<div class="form-group">
							<label>Password</label>
							<input type="password" class="form-control" name="password">
						</div>
						<input type="submit" class="btn btn-primary" value="Login">
						<a href="/signup" class="btn btn-link">Signup</a>
					</form>
				</div>
			</div>
		</div>
	`);
};

app.get('/login', (req, res) => {
	res.end(layout_login());
});

app.post('/login', (req, res) => {
	const { username, password } = req.body;
	if (typeof username !== 'string' || typeof password != 'string') {
		throw new Error('Bad form data');
	}
	if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
		return login(res, username, SCOPE_ADMIN);
	}
	const user = db.get('users').find({ username: username }).value();
	if (!user) {
		throw new Error('Username does not exist');
	}
	if (user.password !== password) {
		throw new Error('Password is incorrect');
	}
	login(res, username, SCOPE_USER);
	res.redirect('/');
}, (err, req, res, next) => {
	res.end(layout_login(err));
});

app.get('/logout', (req, res) => {
	return logout(res);
});

const layout_signup = (err) => {
	return layout(`
		<div class="container-fluid d-flex justify-content-center align-items-center vh-100">
			<div class="card w-100" style="max-width: 20rem">
				<h5 class="card-header">Signup</h5>
				<div class="card-body">
					${err ? `
						<div class="alert alert-danger" role="alert">
							${err.message}
						</div>
					` : ''}
					<form method="POST">
						<div class="form-group">
							<label>Username</label>
							<input class="form-control" name="username">
						</div>
						<div class="form-group">
							<label>Password</label>
							<input type="password" class="form-control" name="password">
						</div>
						<div class="form-group">
							<label>Confirm Password</label>
							<input type="password" class="form-control" name="passwordverify">
						</div>
						<input type="submit" class="btn btn-primary" value="Signup">
						<a href="/login" class="btn btn-link">Login</a>
					</form>
				</div>
			</div>
		</div>
	`);
};

app.get('/signup', (req, res) => {
	res.end(layout_signup());
});

app.post('/signup', (req, res) => {
	const { username, password, passwordverify } = req.body;
	if (typeof username !== 'string' || typeof password != 'string' || typeof passwordverify != 'string') {
		throw new Error('Bad form data');
	}
	if (password !== passwordverify) {
		throw new Error('Passwords do not match');
	}
	if (!username.match(/^[a-zA-Z0-9_\-.]{1,100}$/)) {
		throw new Error('Only characters, numbers, dashes, underscores and periods are allowed in usernames');
	}
	const user = db.get('users').find({ username: username }).value();
	if (user) {
		throw new Error('Username exists');
	}
	db.get('users').push({
		username: username,
		password: password,
	}).write();
	res.end(layout(`
		<div class="container-fluid d-flex justify-content-center align-items-center vh-100">
			<div class="card w-100" style="max-width: 20rem">
				<h5 class="card-header">Signup</h5>
				<div class="card-body">
					<p>User registered successfully</p>
					<a href="/login" class="btn btn-primary">Login</a>
				</div>
			</div>
		</div>
	`));
}, (err, req, res, next) => {
	res.end(layout_signup(err));
});

app.get('/', auth(SCOPE_ADMIN, SCOPE_USER), (req, res) => {
	const author = req.user.sub;
	const posts = db.get('posts').filter({ approved: true, accepted: true }).value();
	const your = db.get('posts').filter({ author: author }).value();
	res.end(layout(`
		<div class="container-fluid">
			<div class="row justify-content-center my-3 my-md-5">
				<div class="col-12 col-md-6">
					<div class="d-flex w-100 align-items-center">
						<h1 class="my-4 mr-auto">Posts</h1>
						<a href="/new" class="btn btn-primary">New</a>
						<a href="/logout" class="btn btn-link">Logout</a>
					</div>
					<div class="list-group">
						${posts.length === 0 ? `
							<div class="list-group-item">
								No posts
							</div>
						` : ''}
						${posts.map(p => `
						<a href="/post/${p.id}" class="list-group-item list-group-item-action">
							<div class="d-flex w-100 justify-content-between">
								<h5 class="mb-1">${p.title}</h5>
								<small>
									<time datetime="${moment(p.timestamp).format()}" title="${moment(p.timestamp).format('llll')}">
										${moment(p.timestamp).fromNow()}
									</time>
								</small>
							</div>
							<p>
								By ${p.author}
							</p>
						</a>
						`).join('')}
					</div>
					<h4 class="mt-4">Your posts</h4>
					<div class="list-group">
						${your.length === 0 ? `
							<div class="list-group-item">
								Click "New" to start publishing
							</div>
						` : ''}
						${your.map(p => `
						<a href="/post/${p.id}" class="list-group-item list-group-item-action list-group-item-${p.approved ? (p.accepted ? 'success' : 'danger') : 'light'}">
							<div class="d-flex w-100 justify-content-between">
								<h5 class="mb-1">${p.title}</h5>
								<small>
									<time datetime="${moment(p.timestamp).format()}" title="${moment(p.timestamp).format('llll')}">
										${moment(p.timestamp).fromNow()}
									</time>
								</small>
							</div>
							<p>
								${p.approved ? (p.accepted ? 'Accepted' : 'Rejected') : 'Waiting approval'}
							</p>
						</a>
						`).join('')}
					</div>
				</div>
			</div>
		</div>
	`));
});

app.get('/admin/', auth(SCOPE_ADMIN), (req, res) => {
	const posts = db.get('posts').filter({ approved: false }).value();
	const approved = db.get('posts').filter({ approved: true }).value();
	res.end(layout(`
		<div class="container-fluid">
			<div class="row justify-content-center my-3 my-md-5">
				<div class="col-12 col-md-6">
					<div class="d-flex w-100 align-items-center">
						<h1 class="my-4 mr-auto">Queue</h1>
						<a href="/" class="btn btn-primary">Home</a>
						<a href="/logout" class="btn btn-link">Logout</a>
					</div>
					<p>FLAG: ${process.env.MODE === 'two' ? 'flag{XSS_Within_Links}' : 'flag{E4sy_S4nitiz3_Input}'}</p>
					<div class="list-group">
						${posts.length === 0 ? `
							<div class="list-group-item">
								No posts
							</div>
						` : ''}
						${posts.map(p => `
						<a href="/post/${p.id}" class="list-group-item list-group-item-action">
							<div class="d-flex w-100 justify-content-between">
								<h5 class="mb-1">${p.title}</h5>
								<small>
									<time datetime="${moment(p.timestamp).format()}" title="${moment(p.timestamp).format('llll')}">
										${moment(p.timestamp).fromNow()}
									</time>
								</small>
							</div>
							<p>
								By ${p.author}
							</p>
							<form action="/post/${p.id}/approve" method="POST">
								<input type="submit" class="btn btn-success" name="accepted" value="Accept">
								<input type="submit" class="btn btn-danger" value="Reject">
							</form>
						</a>
						`).join('')}
					</div>
					<h4 class="mt-4">Approved</h4>
					<div class="list-group">
						${approved.length === 0 ? `
							<div class="list-group-item">
								No posts
							</div>
						` : ''}
						${approved.map(p => `
						<a href="/post/${p.id}" class="list-group-item list-group-item-action list-group-item-${p.approved ? (p.accepted ? 'success' : 'danger') : 'light'}">
							<div class="d-flex w-100 justify-content-between">
								<h5 class="mb-1">${p.title}</h5>
								<small>
									<time datetime="${moment(p.timestamp).format()}" title="${moment(p.timestamp).format('llll')}">
										${moment(p.timestamp).fromNow()}
									</time>
								</small>
							</div>
							<p>
								By ${p.author}, 
								${p.approved ? (p.accepted ? 'Accepted' : 'Rejected') : 'Waiting approval'}
							</p>
							<form action="/post/${p.id}/approve" method="POST">
								${p.accepted ? `
								<input type="submit" class="btn btn-sm btn-danger" value="Reject">
								` : `
								<input type="submit" class="btn btn-sm btn-success" name="accepted" value="Accept">
								`}
							</form>
						</a>
						`).join('')}
					</div>
				</div>
			</div>
		</div>
	`));
});

app.get('/new', auth(SCOPE_ADMIN, SCOPE_USER), (req, res) => {
	res.end(layout(`
		<div class="container-fluid">
			<div class="row justify-content-center my-3 my-md-5">
				<div class="col-12 col-md-6">
					<div class="d-flex w-100 align-items-center">
						<h1 class="my-4 mr-auto">New Post</h1>
						<a href="/" class="btn btn-warning">Cancel</a>
						<a href="/logout" class="btn btn-link">Logout</a>
					</div>
					<form method="POST">
						<div class="form-group">
							<input class="form-control" name="title" required placeholder="Title">
						</div>
						<div class="form-group">
							<textarea class="form-control" name="content" rows="8" required></textarea>
						</div>
						<input type="submit" class="btn btn-primary" value="Submit">
					</form>
				</div>
			</div>
		</div>
	`));
});

app.post('/new', auth(SCOPE_ADMIN, SCOPE_USER), (req, res) => {
	const { title, content } = req.body;
	const timestamp = Date.now();
	const id = timestamp.toString();
	const author = req.user.sub;
	if (typeof title !== 'string' || typeof content != 'string') {
		throw new Error('Bad form data');
	}
	if (!title.match(/^[a-zA-Z0-9_\-.,'" !?]{1,100}$/)) {
		throw new Error('Title should be plain English');
	}
	db.get('posts').push({
		id: id,
		author: author,
		timestamp: timestamp,
		title: title,
		content: content,
		approved: false,
		accepted: false,
	}).write();
	res.end(layout(`
		<div class="container-fluid">
			<div class="row justify-content-center my-3 my-md-5">
				<div class="col-12 col-md-6">
					<div class="d-flex w-100 align-items-center">
						<h1 class="my-4 mr-auto">New Post</h1>
						<a href="/" class="btn btn-primary">Okay</a>
						<a href="/logout" class="btn btn-link">Logout</a>
					</div>
					<p>Your post has been submitted for approval by an adminstrator.</p>
				</div>
			</div>
		</div>
	`));
	scheduleVisit(id, () => {
		db.get('posts').find({ id: id }).assign({ approved: true, accepted: false }).write();
	});
});

app.get('/post/:id', auth(SCOPE_ADMIN, SCOPE_USER), (req, res) => {
	const post = db.get('posts').find({ id: req.params.id }).value();
	if (!post) {
		throw new Error('Post with id ' + req.params.id + ' not found');
	}
	let content = post.content;
	if (process.env.MODE === 'two') {
		content = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	}
	content = content.replace(/\n/g, '<br>');
	res.end(layout(`
		<div class="container-fluid">
			<div class="row justify-content-center my-3 my-md-5">
				<div class="col-12 col-md-6">
					<div class="d-flex w-100 align-items-center">
						<h1 class="my-4 mr-auto">${post.title}</h1>
						<a href="#" onclick="window.history.back()" class="btn btn-primary">Back</a>
						<a href="/logout" class="btn btn-link">Logout</a>
					</div>
					<p>${content}</p>
				</div>
			</div>
		</div>
	`));
}, (err, req, res, next) => {
	res.end(layout(`
		<div class="container-fluid">
			<div class="row justify-content-center my-3 my-md-5">
				<div class="col-12 col-md-6">
					<div class="d-flex w-100 align-items-center">
						<h1 class="my-4 mr-auto"></h1>
						<a href="#" onclick="window.history.back()" class="btn btn-primary">Back</a>
						<a href="/logout" class="btn btn-link">Logout</a>
					</div>
					${err ? `
						<div class="alert alert-danger" role="alert">
							${err.message}
						</div>
					` : ''}
				</div>
			</div>
		</div>
	`));
});

/*
app.post('/post/:id/approve', auth(SCOPE_ADMIN), (req, res) => {
	const { accepted } = req.body;
	const post = db.get('posts').find({ id: req.params.id }).value();
	if (!post) {
		throw new Error('Post not found');
	}
	db.get('posts').find({ id: req.params.id }).assign({ approved: true, accepted: !!accepted }).write();
	res.redirect('/admin/');
});
*/


app.listen(8080);
