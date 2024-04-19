const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const multer = require('multer')
const bodyParser = require('body-parser')
const path = require('path')
const http = require('http')
const argon2 = require('argon2');
const { error } = require('console')
const fs = require('fs');

const corsOptions = {
    origin: '*',
    credentials: true,
};

const app = express()
app.use(express.json())
app.use(cors())
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));


app.use(express.static('uploads/files'))
//app.use('/uploads/files', express.static(path.join(__dirname, 'server-side', 'uploads', 'files')));


const server = http.createServer(app)

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nfrdi_procurement'
})

const generateUniqueId = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const length = 8
    let result = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      result += charset.charAt(randomIndex)
    }
    return result
}


app.get('/getAccount', (req, res) => {
    const query = "SELECT * FROM tbl_accounts"
    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.json(data)
        }
    })
})

app.get('/getImages', (req, res) => {
    const query = "SELECT * FROM tbl_images"
    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.json(data)
        }
    })
})

app.get('/getFiles', (req, res) => {
    const query = "SELECT * FROM tbl_project_files"
    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.json(data)
        }
    })
})

app.get('/getProject', (req, res) => {
    const query = "SELECT * FROM `tbl_project_details` INNER JOIN tbl_project_files ON tbl_project_details.pr_no = tbl_project_files.pr_no;"
    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.json(data)
        }
    })
})

app.post('/verifyAccount', (req, res) => {
    const password = req.body.currentPassword
    const email = req.body.currentEmail

    const query = "SELECT * FROM tbl_accounts"

    db.query(query, async (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const correctPassword = data[i].password;
                    const correctEmail = data[i].email;

                    if (correctEmail === email) {
                        if (await argon2.verify(correctPassword, password)) {
                            console.log(data[i])
                            res.json(data[i])
                        } else {
                            res.json(false)
                        } 
                    }else {
                        res.json(false)
                    }
                }
               
            }else {
                res.json(false)
            }
            
        }
    })
})

app.post('/verifyPassword', async (req, res) => {
    const hashPassword = req.body.hashPassword
    const password = req.body.oldpassword

    if (await argon2.verify(hashPassword, password)) {
        return res.json(true)
    }

    return res.json(false)

})


app.put('/changePassword', async (req,res) => {
    const newPassword = req.body.newpassword
    const accnt_id = req.body.accnt_id
    const hash = await argon2.hash(newPassword)
    const query = 'UPDATE tbl_accounts SET password=? WHERE accnt_id=?'

    db.query(query, [hash, accnt_id], (error, data, field) => {
        if (error) {
           return res.json(error)
        }

        res.json(true)
    })


})

app.put('/deleteProject', (req, res) => {
    const pr_no = req.body.pr_no

    const query = 'DELETE FROM tbl_project_details WHERE pr_no=?'
    const query1 = 'DELETE FROM tbl_project_files WHERE pr_no=?'

    db.query(query, [pr_no], (error, data, field) => {
        if (error) {
            return res.json(error)
        }

   
        db.query(query1, [pr_no], (error1, data1, field1) => {
            if (error1) {
                return res.json(error1)
            }

            res.json({ success: true })
        })
    })
})



app.post('/addProject', (req, res) => {
   
    const data = req.body.obj
    const pr_no = data.pr_no
    const accnt_id = data.accnt_id
    const type = data.type
    const title = data.title
    const contractor = data.contractor
    const contract_amount = data.contract_amount
    const date_published = data.date_published
    const status = data.status

    const query = "INSERT INTO tbl_project_details (pr_no, accnt_id, type, title, contractor, contract_amount, date_published, status ) VALUES (?,?,?,?,?,?,?,?)"

    db.query(query, [
        pr_no,
        accnt_id,
        type,
        title,
        contractor,
        contract_amount,
        date_published,
        status,
    ], (error, result) => {
        if (error) {
            console.error('Error adding project:', error)
            res.status(500).json({ message: 'Failed to add project data' })
        } else {
            res.json({ message: 'project successfully added!', insertedId: result.insertId })
        }
    })
})


const storagImages = multer.diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const uploadImages = multer({ storagImages })

app.post('/uploadImages', uploadImages.single('images'), (req, res) => {

    const image_id = generateUniqueId()
    const { filename } = req.file
    const date = new Date()

    const query = 'INSERT INTO tbl_images (image_id , image_name, date) VALUES (?,?,?)';

    db.query(query,[image_id, filename, date],  (err) => {
        try {
            res.json({  
                message: 'images succefully added!'
            })
        } catch (error) {
            res.json(error)
        }
    });

});


app.post('/uploadFiles/:pr_no', (req, res) => {

    const pr_no = req.params.pr_no;

    const storageFiles = multer.diskStorage({
        destination: './uploads/files',
        filename: (req, file, cb) => {
            cb(null, pr_no+'_'+file.fieldname + path.extname(file.originalname))
        }
    })
    
    const uploadFile = multer({ storage: storageFiles }).fields([
        { name: 'bac_resolution', maxCount: 1 },
        { name: 'notice_of_award', maxCount: 1 },
        { name: 'contract', maxCount: 1 },
        { name: 'notice_to_proceed', maxCount: 1 },
        { name: 'philgeps_award_notice', maxCount: 1 },
    ]);

    uploadFile(req, res, (err) => {

        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: "Multer error occurred.", error: err })
        } else if (err) {
            return res.status(500).json({ message: "An unknown error occurred.", error: err })
        }

        const files = req.files
        const date = new Date()
        const file_id = generateUniqueId()
  
        let filenames = Object.keys(files).reduce((acc, key) => {
            if (files[key] && files[key][0] && files[key][0].filename) {
                acc[key] = files[key][0].filename
            }
            return acc
        },{})

        const query = 'INSERT INTO tbl_project_files (file_id, pr_no, bac_resolution, notice_of_award, contract, notice_to_proceed, philgeps_award_notice, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [file_id, pr_no, filenames.bac_resolution, filenames.notice_of_award, filenames.contract, filenames.notice_to_proceed, filenames.philgeps_award_notice, date], (err) => {
            if (err) {
                console.error("Error inserting files into database:", err);
                return res.status(500).json({ message: "Error inserting files into database.", error: err });
            }

            res.json({ message: 'Files successfully added!' });
        });
    });
});

const storageImage = multer.diskStorage({
    destination: './uploads/files',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer(
    { 
        storage: storageImage,
        limits: {
            fieldNameSize: 100,
            fieldSize: 1024 * 1024 * 10,
        }
    }
);

app.post('/updateAccount', upload.single('image'), (req, res) => {

    const {
        first_name,
        middle_name,
        last_name,
        email,
        image_id,
        accnt_id,
    } = req.body;

    const date = new Date();

    const query = 'UPDATE tbl_accounts SET image_id=?, email=?, first_name=?, middle_name=?, last_name=? WHERE accnt_id=? '
    const queryImage = 'INSERT INTO tbl_images (image_id, image_name, date) VALUES (?,?,?)'

    db.query(query, [image_id, email, first_name, middle_name, last_name, accnt_id], (error, data, field) => {
        if (error) {
            return res.json(error)
        }else {

            if (req.file) {
                const { filename } = req.file;
                db.query(queryImage, [image_id, filename, date], (error, data, field) => {
                    if (error) {
                        return res.json(error)
                    }else {
                        return res.json(true)
                    }
                })
            }

        }
    })

});



app.post('/deleteImage', (req, res) => {
    const image_name = req.body.image_name
    console.log(image_name)
    const uploadFolder = path.join(__dirname, '..', 'uploads', 'files')
    const filePath = path.join(uploadFolder, image_name)
    const query = 'DELETE FROM tbl_images WHERE image_name=?'
    
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err)
                res.status(500).send('Error deleting file')
            } else {
                db.query(query, [image_name], (error, data, fields) => {
                    if (error) {
                        console.error(error)
                        res.status(500).send('Error deleting file')
                    }else{
                        console.log('File deleted successfully')
                        res.send('File deleted successfully')
                    }
                })
                
            }
        })
        } else {
            res.status(404).send('File not found')
    }
})




const port = process.env.PORT || 5000

server.listen(port, ()=> {
    console.log('Listening to port: ', port)
})
