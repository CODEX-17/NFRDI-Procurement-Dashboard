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

app.post('/verifyAccount', async (req, res) => {
    const password = req.body.currentPassword
    const email = req.body.currentEmail
  
    const verifyQuery = "SELECT * FROM `tbl_accounts`INNER JOIN tbl_images ON tbl_accounts.image_id = tbl_images.image_id WHERE tbl_accounts.email =?"

    db.query(verifyQuery,[email], async (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            console.log(data)
            //If the inputted email is doesn't exist in database it will return false
            if (data.length > 0) {
                const result = data
                const correctPassword = result[0].password
            
                //Verify it the inoutted password matches the hash password
                if (await argon2.verify(correctPassword, password)) {
                    console.log(data)
                    delete data[0].password
                    res.json(data)
                } else {
                    console.log(false)
                    res.json(false)
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

// Delete file function
const deleteFilesByFilename = (selectedFileName) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'uploads', 'files', selectedFileName);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file ${selectedFileName}:`, err);
                reject(err);
            } else {
                console.log(`File ${selectedFileName} deleted successfully`);
                resolve();
            }
        });
    });
};

app.put('/deleteProject', async (req, res) => {
    const data = req.body;
    const pr_no = data.pr_no;
    const { bac_resolution, notice_of_award, contract, notice_to_proceed, philgeps_award_notice } = data;

    const queryProjectDetails = 'DELETE FROM tbl_project_details WHERE pr_no=?';
    const queryProjectFiles = 'DELETE FROM tbl_project_files WHERE pr_no=?';

    db.beginTransaction(async (err) => {
        if (err) {
            console.error("Error starting transaction:", err);
            return res.status(500).json({ message: "Error starting transaction.", error: err });
        }

        try {
            // Delete from project details
            await new Promise((resolve, reject) => {
                db.query(queryProjectDetails, [pr_no], (error, results) => {
                    if (error) {
                        console.error("Error deleting from tbl_project_details:", error);
                        return db.rollback(() => reject(error));
                    }
                    resolve();
                });
            });

            // Delete from project files
            await new Promise((resolve, reject) => {
                db.query(queryProjectFiles, [pr_no], (error, results) => {
                    if (error) {
                        console.error("Error deleting from tbl_project_files:", error);
                        return db.rollback(() => reject(error));
                    }
                    resolve();
                });
            });

            // Delete files
            const fileDeletionPromises = [];
            if (bac_resolution) fileDeletionPromises.push(deleteFilesByFilename(bac_resolution));
            if (notice_of_award) fileDeletionPromises.push(deleteFilesByFilename(notice_of_award));
            if (contract) fileDeletionPromises.push(deleteFilesByFilename(contract));
            if (notice_to_proceed) fileDeletionPromises.push(deleteFilesByFilename(notice_to_proceed));
            if (philgeps_award_notice) fileDeletionPromises.push(deleteFilesByFilename(philgeps_award_notice));

            await Promise.all(fileDeletionPromises);

            // Commit transaction
            db.commit((err) => {
                if (err) {
                    console.error("Error committing transaction:", err);
                    return db.rollback(() => {
                        res.status(500).json({ message: "Error committing transaction.", error: err });
                    });
                }
                res.status(200).json({ message: 'Files and records successfully deleted!' });
            });

        } catch (error) {
            console.error("Transaction error:", error);
            db.rollback(() => {
                res.status(500).json({ message: "Transaction error.", error });
            });
        }
    });
});


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


//API for uploading files multiple times
app.post('/uploadFiles/:pr_no', (req, res) => {

    const pr_no = req.params.pr_no;

    //Multer Storage Filename format and storage configuration
    const storageFiles = multer.diskStorage({
        destination: './uploads/files',
        filename: (req, file, cb) => {
            cb(null, pr_no + '_' + file.fieldname + path.extname(file.originalname))
        }
    })
    
    //Multer configuration
    const uploadFile = multer({ storage: storageFiles }).fields([
        { name: 'bac_resolution', maxCount: 1 },
        { name: 'notice_of_award', maxCount: 1 },
        { name: 'contract', maxCount: 1 },
        { name: 'notice_to_proceed', maxCount: 1 },
        { name: 'philgeps_award_notice', maxCount: 1 },
    ]);

    //Delete file function
    const deleteFilesByFilename = (selectedFileName) => {
        const filePath = path.join(__dirname, 'uploads', 'files', selectedFileName)
        fs.unlink(filePath, (err) => {
            if (err) {
            console.error(`Error deleting file ${selectedFileName}:`, err);
            } else {
            console.log(`File ${selectedFileName} deleted successfully`);
            }
        })
    }

    uploadFile(req, res, (err) => {

        //If theirs an error in multer
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: "Multer error occurred.", error: err })
        } else if (err) {
            return res.status(500).json({ message: "An unknown error occurred.", error: err })
        }

        const files = req.files
        const date = new Date()
        const names = req.body
        const file_id = generateUniqueId()
    

        //Store filenames in one variable array
        let filenames = Object.keys(files).reduce((acc, key) => {
            if (files[key] && files[key][0] && files[key][0].filename) {
                acc[key] = files[key][0].filename
            }
            return acc
        },{})


        //Delete the existing files in the uploads/files folder
        if (filenames.bac_resolution) {
            console.log('execute 1')
            deleteFilesByFilename(filenames.bac_resolution)
        }
        if (filenames.notice_of_award) {
            console.log('execute 2')
           deleteFilesByFilename(filenames.notice_of_award) 
        }
        if (filenames.contract) {
             console.log('execute 3')
           deleteFilesByFilename(filenames.contract)
        }
        if (filenames.philgeps_award_notice) {
             console.log('execute 4')
           deleteFilesByFilename(filenames.philgeps_award_notice)
        }
        if (filenames.notice_to_proceed) {
             console.log('execute 5')
           deleteFilesByFilename(filenames.notice_to_proceed)       
        }

        const query = 'INSERT INTO tbl_project_files (file_id, pr_no, bac_resolution, notice_of_award, contract, notice_to_proceed, philgeps_award_notice, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        
        db.query(query, [file_id, pr_no, filenames.bac_resolution, filenames.notice_of_award, filenames.contract, filenames.notice_to_proceed, filenames.philgeps_award_notice, date], (err) => {
            if (err) {
                console.error("Error inserting files into database:", err);
                return res.status(500).json({ message: "Error inserting files into database.", error: err });
            }

            //After deleting the files it will return message
            res.json({ message: 'Files successfully added!' })

        });
    });
});


//API edit file 
app.post('/editFiles/:pr_no', (req, res) => {
    const pr_no = req.params.pr_no;

    // Multer Storage Filename format and storage configuration
    const storageFiles = multer.diskStorage({
        destination: './uploads/files',
        filename: (req, file, cb) => {
            cb(null, pr_no + '_' + file.fieldname + path.extname(file.originalname));
        }
    });

    // Multer configuration
    const uploadFile = multer({ storage: storageFiles }).fields([
        { name: 'bac_resolution', maxCount: 1 },
        { name: 'notice_of_award', maxCount: 1 },
        { name: 'contract', maxCount: 1 },
        { name: 'notice_to_proceed', maxCount: 1 },
        { name: 'philgeps_award_notice', maxCount: 1 },
    ]);

    // Delete file function
    const deleteFilesByFilename = (selectedFileName) => {
        const filePath = path.join(__dirname, 'uploads', 'files', selectedFileName);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file ${selectedFileName}:`, err);
            } else {
                console.log(`File ${selectedFileName} deleted successfully`);
            }
        });
    };

    uploadFile(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: "Multer error occurred.", error: error });
        } else if (error) {
            return res.status(500).json({ message: "An unknown error occurred.", error: error });
        }

        // Store all files that processed in multer
        const files = req.files;
        const oldNames = req.body; // Correctly use req.body

        // Delete the existing files in the uploads/files folder
        if (oldNames?.bac_resolution && files?.bac_resolution) {
            deleteFilesByFilename(oldNames.bac_resolution);
        }
        if (oldNames?.notice_of_award && files?.notice_of_award) {
            deleteFilesByFilename(oldNames.notice_of_award);
        }
        if (oldNames?.contract && files?.contract) {
            deleteFilesByFilename(oldNames.contract);
        }
        if (oldNames?.philgeps_award_notice && files?.philgeps_award_notice) {
            deleteFilesByFilename(oldNames.philgeps_award_notice);
        }
        if (oldNames?.notice_to_proceed && files?.notice_to_proceed) {
            deleteFilesByFilename(oldNames.notice_to_proceed);
        }

        db.beginTransaction((err) => {
            if (err) {
                return res.status(500).json({ message: "Error starting transaction.", error: err });
            }

            const query = 'UPDATE tbl_project_files SET bac_resolution=?, notice_of_award=?, contract=?, notice_to_proceed=?, philgeps_award_notice=? WHERE pr_no=?';
            const bac_resolution = files.bac_resolution ? files.bac_resolution[0].filename : oldNames.bac_resolution;
            const notice_of_award = files.notice_of_award ? files.notice_of_award[0].filename : oldNames.notice_of_award;
            const contract = files.contract ? files.contract[0].filename : oldNames.contract;
            const notice_to_proceed = files.notice_to_proceed ? files.notice_to_proceed[0].filename : oldNames.notice_to_proceed;
            const philgeps_award_notice = files.philgeps_award_notice ? files.philgeps_award_notice[0].filename : oldNames.philgeps_award_notice;

            db.query(query, [bac_resolution, notice_of_award, contract, notice_to_proceed, philgeps_award_notice, pr_no], (error) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error updating files:", error);
                        return res.status(500).json({ message: "Error updating files." });
                    });
                }

                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Error committing transaction:", err);
                            return res.status(500).json({ message: "Error committing transaction.", error: err });
                        });
                    }

                    res.json({ message: 'Files successfully updated!' });
                });
            });
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

const fileStorage = multer.diskStorage({
    destination: './uploads/files',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
    }
})

app.post('/updatePorjectFiles',  (req, res) => {
    const { file_id } = req.body
    console.log(file_id)
})

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

app.post('/updateProjectDetails', (req, res) => {
    const data = req.body.obj
    console.log(req.body.obj)
    const pr_no = data.pr_no
    const title = data.title
    const contractor = data.contractor
    const contract_amount = data.contract_amount
    const date_published = data.date_published
    const status = data.status

    const query = 'UPDATE tbl_project_details SET pr_no=?, title=?, contractor=?, contract_amount=?, date_published=?, status=? WHERE pr_no=?'

    db.query(query,[pr_no, title, contractor, contract_amount, date_published, status, pr_no], (error, result, field) => {
        if (error) {
            console.log(error)
            res.status(404).send(error)
        }else {
            res.json({ message: 'Project details successfully updated!' })
        }
    })
})




const port = process.env.PORT || 5000

server.listen(port, ()=> {
    console.log('Listening to port: ', port)
})
