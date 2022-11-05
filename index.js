const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./schemas/Post');
const User = require('./schemas/User');
const Comment = require('./schemas/Comment');
const { application, response } = require('express');

const mongoDb = 'mongodb://127.0.0.1/mongoose-test';
mongoose.connect(mongoDb, {useNewUrlParser: true});
const db = mongoose.connection;

db.once('open', () => {
    console.log(`Connected to mongoDb at ${db.host}:${db.port}`);
});

db.on('error', (error) => {
    console.log(`Database Error: ${error}`);
})

app.use(express.urlencoded({ extended: false}));

app.get("/home", (req, res) => {
    res.json({
        message: ("Welcome to my first API")
    })
});

app.get('/users', (req, res) => {
    User.find({})
    .then(users => {
        console.log('All users', users);
        res.json({ users: users });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

app.get('/users/:email', (req, res) => {
    console.log('find user by', req.params.email)
    User.findOne({
        email: req.params.email
    })
    .then(user => {
        console.log('Here is the user', user.name);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});
    
app.post('/users', (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        meta: {
            age: req.body.age,
            website: req.body.website
        }
    })
    .then(user => {
        console.log('New user =>>', user);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

app.put('/users/:email', (req, res) => {
    console.log('route is being on PUT')
    User.findOne({ email: req.params.email })
    .then(foundUser => {
        console.log('User found', foundUser);
        User.findOneAndUpdate({ email: req.params.email }, 
        { 
            name: req.body.name ? req.body.name : foundUser.name,
            email: req.body.email ? req.body.email : foundUser.email,
            meta: {
                age: req.body.age ? req.body.age : foundUser.age,
                website: req.body.website ? req.body.website : foundUser.website
            }
        })
        .then(user => {
            console.log('User was updated', user);
            res.json({ user: user })
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});

app.delete('/users/:email', (req, res) => {
    User.findOneAndRemove({ email: req.params.email })
    .then(response => {
        console.log('This was deleted', response);
        res.json({ message: `${req.params.email} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

app.get('/posts', (req, res) => {
    Post.find({}) 
        .then(posts => {
            console.log("All posts", posts);
            res.json({ posts: posts});
        })
        .catch(error => { 
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
});

app.get('/posts/:title', (req, res) => {
    console.log("Find post by title", req.params.title)
    Post.findOne({ 
        posts: req.params.title, 
    })
    .then(post => {
        console.log("Here is the post", post.title);
        res.json({ post: post });
    })
    .catch(error => {
        console.log("Error", error);
        res.json({ message: "Error ocurred, please try again" });
    })
});

app.post('/post/new', (req, res) => {
    Post.create({
        title: req.body.title,
        meta: {
            content: req.body.content,
            comments: req.body.comments,
        }
    })
    .then(post => {
        console.log("New post =>>", post);
        res.json({ post: post });
    })
    .catch(error => {
        console.log("Error", error);
        res.json({ message: "Error ocurred, please try again" });
    });
})

app.put('/posts/:title', (req,res) => {
    console.log('route is being on PUT');
    Post.findOne({ title: req.params.title })
    .then(foundPost => {
        console.log('Post was found');
        Post.findOne({ title: req.params.title },
        {
            title: req.body.title ? req.body.title : foundPost.title,
            meta: {
                content: req.body.content ? req.body.content : foundPost.content,
                comments: req.body.comments ? req.body.comments : foundComment.comments
                }
            })
            .then(user => {
                console.log('User was updated', user);
                res.json({ user: user })
            })
            .catch(error => {
                console.log('error', error) 
                res.json({ message: "Error ocurred, please try again" })
            })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
});

app.delete('/posts/:title', (req, res) => {
    Post.findOneAndDelete({ title: req.params.title })
    .then(response => {
        console.log("This post has been deleted", response);
        res.json({ message: `${req.params.title} was deleted` })
    })
    .catch(error => {
        console.log('error', error);
        res.json({ message: "Error occured,pleale try again" });
    })      
})

app.get('/comments', (req, res) => {
    Comment.find({}) 
    .then(comments => {
        console.log('All comments', comments);
        res.json({ comments: comments})
    })
    .cath(error => {
        console.log('error', error);
        res.json({ message: "Error occured, please try again" });
    });
})

app.get('/comments/:header', (req, res) => {
    console.log('find one comment by', req.params.header)
    Comment.findOne({
        header: req.params.header,
        content: req.body.content,
        date: req.body.date
    })
    .then(comment => {
        console.log('Here is the comment', comment);
        res.json({ comment: comment});
    })
    .catch(error => {
        console.log('error', error);
        res.json({ message: "Error occured, please try again" });
    })
});

app.post('/comments', (req, res) => {
    Comment.create({
        header: req.body.header,
        content: req.body.content,
        date: req.body.date
    })
    .then(comment => {
        console.log('New comment =>>', comment);
        res.json({ comment: comment });
    })
    .catch(error => {
        console.log('error', error);
        res.json({ message: "Error occured, please try again" });
    });
});

app.put('/comments/:header', (req, res) => {
    console.log('Route is being on PUT')
    Comment.findOne({ header: req.params.header })
    .then(foundComment => {
        console.log('Found comment', foundComment);
            Comment.findOneAndUpdate({ header: req.params.header },
        {
            header: req.body.header ? req.body.header : foundComment.header,
            content: req.body.content ? req.body.content : foundComment.content,
            date: req.body.date ? req.body.date : foundComment.date,
        })
        .then(comment => {
            console.log('Comment was updated', comment);
            res.json({ comment: comment })
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: "Error occured, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error);
        res.json({ message: "Error occured, please try again" })
    })
});

app.delete('/comments/:header', (req, res) => {
    Comment.findOneAndRemove({ header: req.params.header })
    .then(response => {
        console.log('This comment has been removed', response);
        res.json({ message: `${req.params.header} was deleted` })
    })
    .catch(error => {
        console.log('error', error);
        res.json({ message: "Error occured, please try again" });
    })
});
// app.get('/' , (req, res) => {
//     const Bobby = new User({
//         name: 'Bobby',
//         email: 'Bobby@test.com',
//         meta: {
//             age: 30, 
//             website: 'https://bobby.me'
//         }
//     });
    
//     bobby.save((err) => {
//         if (err) return console.log(err);
//         console.log('User Created!');
//     });

//     res.send(bobby.sayHello());
// })

// app.get('/findAll', (req,res) => {
//     User.find({}, (err, users) => {
//         if (err) res.send(`Failed to find record, mongodb error ${err}`);
//         res.send(users);
//     })
// })

// app.get('/findById/:id', (req,res) => {
//     User.findById(req.params.id, (err, users) => {
//         if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
//         res.send(users);
//     })

//     //find by Id without the findByID command, not ideal
//     // User.find({_id: mongoose.Types.ObjectId(Objreq.params.id)}, (err, users) => {
//     //     if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
//     //     res.send(users);
//     // })
// })

// app.get('/findByEmail/:email', (req,res) => {
//     User.findOne({email: req.params.email}, (err, users) => {
//         if (err) res.send(`Failed to find record by email, mongodb error ${err}`);
//         res.send(users);
//     })
// })
// const Chris = new User({
//     name: 'Chris',
//     email: 'Chris@gmail.com',
//     meta: {
//         age: 30, 
//         website: 'https://chris.me'
//     }
// });


// Chris.save((err) => {
//     if (err) return console.log(err);
//     console.log('User Created!');
// });

// creating users directly form model using model.save() and creating user using mode.Create
// User.create({
//     name: 'created using Create()',
//     email: 'Tester2@gmail.com'
// })

// const newUser = new User({
//     name: 'created using new USer and Save()',
//     email: 'Tester3@gmail.com'
// });

// newUser.save((err) => {
//     if (err) return console.log(err);
//     console.log('created new user');
// })

// // Creating a simple post document in the post collection
// Post.create({
//     content: 'This ia pst content...'
// });

// mongoose UPDATE statement
// User.updateOne({name: 'Chris'}, {meta: {
//     age: 23,
// }}, (err, updateOutcome) => {
//     if(err) return console.log(err);
//     console.log(`Updated user: ${updateOutcome.matchedCount} : ${updateOutcome.modifiedCount}`)
// })

//  findOneAndUpdate
// User.findOneAndUpdate({name: 'Chris'},
//     {
//         meta: {
//             name: "Christopher",
//         }
//     },(err, user) => {
//         if (err) return console.log(err);
//         console.log(user);
//     }
// )

// mongoose DELETE route
// User.deleteOne({name: 'Bobby'}, (err) => {
//     if (err) return console.log(err);
//     console.log('user was removed');
// })

// User.findOneAndDelete({name: "created using Create()"}, (err, user) => {
//     if (err) return console.log(err);
//     console.log('user was removed');
// });

// const newPost = new Post({
//     title: "Hey there", 
//     body: 'just saying hello'});

// newPost.comments.push({
//     header: "our first comment", 
//     content: 'dolar em sumpiterator',
// })

// newPost.save(function(err){
//     if (err) return console.log(err);
//     console.log("newPost");
// })

app.listen(8000, () => {
    console.log('Running port 8000')
});