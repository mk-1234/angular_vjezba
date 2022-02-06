const path = require("path");
module.exports=function(express,pool, jwt, secret){

  const apiRouter = express.Router();

  apiRouter.get('/', function(req, res) {
    console.log('Dobro dosli na api');
    res.json({ message: 'Dobro dosli na nas API!' });
  });

  apiRouter.use(function(req, res, next){
    const token = req.body.token || req.params.token || req.headers['x-access-token'] || req.query.token;
    console.log(req.params);
    console.log(token);
    if (token){
      jwt.verify(token, secret, function (err, decoded){
        if (err){
          return res.status(403).send({
            success:false,
            message:'Wrong token'
          });
        } else {
          req.decoded=decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
        success:false,
        message:'No token'
      });
    }
  });


  // ---------------- USERS ------------------


  apiRouter.route('/users').get(async function(req, res){

    pool.getConnection(function(err, conn) {
      if (err) {
        console.log('error u get users dijelu');
        throw err;
      }
      conn.query('SELECT * FROM users', function(err, results) {

        results.forEach(res => {
          for(let r in res) {
            console.log(r + ': ' + res[r]);
          }
          console.log('--------------');
        });
        conn.release();
        if (err) {
          console.log('neki errror je ovdje u get users');
        }
        res.json(results);
      });
    });
  }).put(function(req, res){

    console.log('prije req body');
    console.log(req.body);
    console.log(req.body.username);
    console.log(req.body.password);
    console.log(req.body.name);
    console.log(req.body.email);
    console.log('poslije req body');

    pool.getConnection(async function(err, conn) {
      if (err) {
        console.log('error u put dijelu users');
        throw err;
      }
      let q = await conn.query(
        'UPDATE users SET username = ?, password = ?, name = ?, email = ? WHERE _id = ?',
        [req.body.username, req.body.password, req.body.name, req.body.email, req.body._id]);
      conn.release();
      console.log('changed rows: ' + q.affectedRows);
      if (err) {
        console.log('neki errror je ovdje u put');
      }
      res.json(q.affectedRows);
    });
  });

  apiRouter.route('/users/:id').get(async function(req, res) {
    console.log('user id za get: ' + req.params.id);

    pool.getConnection(function(err, conn) {
      if (err) {
        console.log('error u get users id dijelu');
        throw err;
      }
      conn.query('SELECT * FROM users WHERE _id = ?', req.params.id, function(err, results) {
        console.log(results);
        /*results.forEach(res => {
          for(let r in res) {
            console.log(r + ': ' + res[r]);
          }
          console.log('--------------');
        });*/
        conn.release();
        if (err) {
          console.log('neki errror je ovdje u get users id');
        }
        res.json(results);
      });
    });
  }).delete(function(req, res) {
    console.log('user id za delete: ' + req.params.id);

    pool.getConnection(async function(err, conn) {
      if (err) {
        console.log('error u delete id dijelu');
        throw err;
      }
      let q = await conn.query('DELETE FROM users WHERE _id = ?', req.params.id);
      conn.release();
      if (err) {
        console.log('neki error je ovdje u delete users id');
      }
      res.json(q.affectedRows);
    });
  });


  // ---------------- POSTS ------------------


  apiRouter.route('/posts').get(async function(req,res){

    pool.getConnection(function(err, conn) {
      if (err) {
        console.log('error u get dijelu');
        throw err;
      }
      conn.query('SELECT * FROM posts', function(err, results, fields) {
        //console.log(results);
        /*results.forEach(res => {
          for(let r in res) {
            console.log(r + ': ' + res[r]);
          }
          console.log('--------------');
        });*/
        conn.release();
        if (err) {
          console.log('neki errror je ovdje');
        }
        res.json(results);
      });
    });
  }).post(async function(req, res) {

    console.log('prije brisanja id-a');
    console.log(req.body);
    delete req.body._id;
    console.log('prije req u postu');
    console.log(req.body);
    console.log('poslije req u postu');

    pool.getConnection(async function(err, conn) {
      if (err) {
        console.log('error u post dijelu');
        throw err;
      }
      conn.query('INSERT INTO posts SET ?', req.body, function(err, result) {
        console.log('insert id in function: ' + result.insertId);
        conn.release();
        if (err) {
          console.log('neki error je ovdje u post');
        }
        res.json(result.insertId);
      });
    });

  }).put(function(req, res){

    console.log('prije req body');
    console.log(req.body);
    console.log(req.body.userId);
    console.log(req.body.timestamp);
    console.log(req.body.comment);
    console.log('poslije req body');

    pool.getConnection(async function(err, conn) {
      if (err) {
        console.log('error u put dijelu');
        throw err;
      }
      let q = await conn.query(
        'UPDATE posts SET userId = ?, timestamp = ?, comment = ? WHERE _id = ?',
        [req.body.userId, req.body. timestamp, req.body.comment, req.body._id]);
      conn.release();
      console.log('changed rows: ' + q.affectedRows);
      if (err) {
        console.log('neki errror je ovdje u put');
      }
      res.json(q.affectedRows);
    });
  });

  apiRouter.route('/posts/:id').delete(function(req, res) {

    console.log('id za delete: ' + req.params.id);

    pool.getConnection(async function(err, conn) {
      if (err) {
        console.log('error u delete dijelu');
        throw err;
      }
      let q = await conn.query('DELETE FROM posts WHERE _id = ?', req.params.id);
      conn.release();
      if (err) {
        console.log('neki error je ovdje u delete');
      }
      res.json(q.affectedRows);
    });
  });

  apiRouter.get('/me', function (req, res){
    console.log('req decoded: ');
    console.log(req.decoded);
    console.log('logged decoded');
    res.send({status:200, user:req.decoded});
  });

  console.log('prije returna');
  return apiRouter;

};

