const express = require('express')
const mysql = require('mysql')

let mClient = null

let PORT = process.env.PORT || 3000
let mPanding = {}


let app = express()

app.use(express.json())

app.listen(PORT, ()=> {
    console.log('Listening on port '+PORT)
})

app.get('/', async (req, res) => {
    res.end('ok')
})

app.get('/update', async (req, res) => {
    res.end('ok')
})

app.post('/command', async (req, res) => {
    try {
        let cmd = req.body.cmd

        if (cmd) {
            let results = await sqlQuery(cmd)
            if (results != null) {
                res.end(JSON.stringify(results))
            } else {
                res.end('null')
            }
        } else {
            res.end('null')
        }
    } catch (error) {
        res.end('null')
    }
})

app.get('/offline', async (req, res) => {
    try {
        let results = await sqlQuery("SELECT * FROM live WHERE active < "+parseInt(new Date().getTime()/1000))
        
        if (results != null) {
            res.end(JSON.stringify(results))
        } else {
            res.end('null')
        }
    } catch (error) {
        res.end('null')
    }
})

app.post('/offline', async (req, res) => {
    try {
        let results = await sqlQuery("SELECT * FROM live WHERE active < "+parseInt(new Date().getTime()/1000))
        if (results != null) {
            res.end(JSON.stringify(results))
        } else {
            res.end('null')
        }
    } catch (error) {
        res.end('null')
    }
})

app.post('/active', async (req, res) => {
    try {
        let id = req.body.id
        let active = req.body.active

        if (id && active) {
            await insartData(id, active)
        }
    } catch (error) {}

    res.end('ok')
})

app.post('/remove', async (req, res) => {
    try {
        let id = req.body.id

        if (id) {
            await sqlQuery("DELETE FROM live WHERE id='"+id+"'")
        }
    } catch (error) {}

    res.end('ok')
})

async function insartData(id, active) {
    await sqlQuery("INSERT INTO live (id, active) VALUES('"+id+"', "+active+") ON DUPLICATE KEY UPDATE active="+active)
}

async function sqlQuery(query) {
    try {
        if(mClient == null || mClient.state != 'authenticated') {
            mClient = await sqlConnection()
        }
    } catch (error) {}

    return new Promise((resolve) => {
        try {
            if(mClient != null) {
                mClient.query(query, function (err, result, fields) {
                    if (err) {
                        resolve(null)
                    } else {
                        resolve(result)
                    }
                })
            } else {
                resolve(null)
            }
        } catch (error) {
            resolve(null)
        }
    })
}

async function sqlConnection() {
    return new Promise((resolve) => {
        let client = mysql.createConnection({
            host: 'sql12.freesqldatabase.com',
            user: 'sql12726244',
            password: 'mlaiwZiatg',
            database: 'sql12726244'
        })

        client.connect(async function(err) {
            if (err) {
                resolve(null)
            } else {
                resolve(client)
            }
        })
    })
}
