

module.exports=function(express, pool, jwt, secret, crypto){


    let authRouter = express.Router();

    authRouter.post('/', async function(req, res){
      console.log('prije ispisa req.body u auth post');
      console.log(req.body);
      console.log('nakon ispisa req.body u auth post');

      pool.getConnection(async function(err, conn) {
        if (err) {
          console.log('error u post dijelu auth');
          throw err;
        }
        let nmbOfResults = 0;
        conn.query('SELECT * FROM users WHERE username = ?', req.body.username, function(err, result) {
          console.log('before select users result');
          if (result.length > 0) {
            console.log(result);
            console.log(result[0]);
            console.log(result[0].password);
            result.forEach(res => {
              for (let r in res) {
                console.log(r + ': ' + res[r]);
              }
              console.log('--------------');
            });
          }
          console.log('after select users result');
          console.log('after foreach');
          console.log('result length: ' + result.length);
          //conn.release();
          nmbOfResults = result.length;
          if (result.length == 0) {
            if (req.body.email) {
              console.log('prije brisanja id-a users');
              console.log(req.body);
              delete req.body._id;
              console.log('prije req u postu auth');
              console.log(req.body);
              console.log('poslije req u postu auth');

              let salt = crypto.randomBytes(128).toString('base64');
              let hash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 64, 'sha512');

              console.log('prije salt i hash u req.body');
              console.log('req.body.password: ' + req.body.password);
              console.log('req.body.salt: ' + req.body.salt);
              req.body.password = hash.toString('hex');
              req.body.salt = salt;
              console.log('req.body.password: ' + req.body.password);
              console.log('req.body.salt: ' + req.body.salt);
              console.log('nakon salt i hash u req.body');
              console.log(req.body);

              conn.query('INSERT INTO users SET ?', req.body, function(err__, result__) {
                console.log('result__: ');
                console.log(result__);
                console.log('insert id in function users: ' + result__.insertId);
                conn.release();
                if (err__) {
                  console.log('neki error je ovdje u post users');
                }
                res.json(result__.insertId);
              });


            } else {
              res.json({status: 'NOT OK', description: 'username doesnt exist!!'});
            }
          } else {
            console.log('result is not zero, found user!');
            console.log('passwords before checking if they are equal:')
            console.log('req.body.password: ' + req.body.password);
            console.log('result[0].password: ' + result[0].password);
            console.log('----------------------');

            let compare = false;

            if (result[0].salt) {
              let hash = crypto.pbkdf2Sync(req.body.password, result[0].salt, 10000, 64, 'sha512');
              compare = hash.toString('hex') == result[0].password;
            }

            if (compare) {
              console.log('passwords are the same:');
              console.log('req.body.password: ' + req.body.password);
              console.log('result[0].password: ' + result[0].password);
              const token = jwt.sign({
                _id: result[0]._id,
                username: result[0].username,
                password: result[0].password,
                name: result[0].name,
                email: result[0].email,
                salt: result[0].salt
              }, secret, {
                expiresIn: 1440
              });
              res.json({status: 200, token: token, user: result[0]});
            } else {
              console.log('PASSWORDS ARE NOT THE SAME!!!');
              console.log('req.body.password: ' + req.body.password);
              console.log('result[0].password: ' + result[0].password);
              res.json({status: 150, description: 'Wrong password'});
            }
          }
        });
      });
    });

    return authRouter;

};
