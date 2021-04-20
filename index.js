const { json } = require('express')
const express = require('express')
const session = require('express-session')
const cors = require('cors')

const dataService = require('./services/data.service')

const app = express();

app.use(cors({
    origin:'  http://localhost:4200',
    credentials:true
}))

app.use(session({
    secret: "randomsecurestring",
    resave: false,
    saveUninitialized: false
}))
const logMiddleware = (req, resp, next) => {
    console.log(req.body)
    next();
}

//app.use(logMiddleware)

const authMiddleware = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.json({
            status: false,
            statusCode: 422,
            message: "please login"
        })
    }
    else {
        next()
    }
}



app.use(express.json());



app.get('/', (req, res) => {
    res.status(440).send("get method")
})
app.post('/', (req, res) => {
    res.send("POST METHOD")
})

app.put('/', (req, res) => {
    res.send("PUT METHOD")
})

app.post('/register', (req, res) => {
    // console.log(req.body);
    const result = dataService.register(req.body.acno, req.body.name, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

    //  res.status(result.statusCode)
    // console.log(res.json(result));
})
app.post('/login', (req, res) => {
    //  console.log(req.body);
    dataService.login(req, req.body.acno, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
app.post('/deposit', authMiddleware, (req, res) => {
    //   console.log(req.session.currentUser);
    dataService.deposit(req.body.acno, req.body.pswd, req.body.amount)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
    
app.post('/withdraw', authMiddleware, (req, res) => {
    //  console.log(req.body);
    dataService.withdraw(req,req.body.acno, req.body.pswd, req.body.amount)
    .then(result => {
        res.status(result.statusCode).json(result)
    })
   
})
app.delete('/deleteAccDetails/:acno', (req, res) => {
    dataService.deleteAccDetails(req.params.acno)
    .then(result => {
        res.status(result.statusCode).json(result)
    })
  //  res.send("delte method")
})
app.patch('/', (req, res) => {
    res.send("patch method")
})
app.delete('/', (req, res) => {
    res.send("delte method")
})
app.listen(3000, () => {
    console.log("Server started at 3000");
}
);
//1xx=clientInformation
// 2xx=Success
// 3xx=redirect 
// 4xx=cleint error 
// 5xx=server error