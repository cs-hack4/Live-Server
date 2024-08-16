const express = require('express')
const mysql = require('mysql')

const client = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12726244',
    password: 'mlaiwZiatg',
    database: 'sql12726244'
})

let PORT = process.env.PORT || 3000
let mConnected = false
let mPanding = {}


client.connect(async function(err) {
    mConnected = true

    for(let [key, value] of Object.entries(mPanding)) {
        await insartData(key, value)
    }
})

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
            if (mConnected) {
                let results = await sqlQuery(cmd)
                if (results != null) {
                    res.end(JSON.stringify(results))
                } else {
                    res.end('Null Data')
                }
            } else {
                mPanding[id] = active
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
        if (mConnected) {
            let results = await sqlQuery("SELECT * FROM live WHERE active < "+parseInt(new Date().getTime()/1000))
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

app.post('/offline', async (req, res) => {
    try {
        if (mConnected) {
            let results = await sqlQuery("SELECT * FROM live WHERE active < "+parseInt(new Date().getTime()/1000))
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

app.post('/active', async (req, res) => {
    try {
        let id = req.body.id
        let active = req.body.active

        if (id && active) {
            if (mConnected) {
                await insartData(id, active)
            } else {
                mPanding[id] = active
            }
        }
    } catch (error) {}

    res.end('ok')
})

app.post('/remove', async (req, res) => {
    try {
        let id = req.body.id

        if (id && mConnected) {
            await sqlQuery("DELETE FROM live WHERE id='"+id+"'")
        }
    } catch (error) {}

    res.end('ok')
})

async function insartData(id, active) {
    await sqlQuery("INSERT INTO live (id, active) VALUES('"+id+"', "+active+") ON DUPLICATE KEY UPDATE active="+active)
}

async function sqlQuery(query) {
    return new Promise((resolve) => {
        client.query(query, function (err, result, fields) {
            if (err) {
                resolve(null)
            } else {
                resolve(result)
            }
        })
    })
}
