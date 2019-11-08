const express = require('express')
const path = require('path') // core
const app = express()

const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require ('./bugtracker.json')

app.use (express.json())
app.use (express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set ('views', path.resolve (__dirname, 'views'))

// configurações

const documentID = '1iNiSZewugNysXnT6ttiC5WONBnDWDxHvBKvXNODm2EQ'
const wsheetIndex = 0

app.get('/', (req, res) => {

    res.render ('home')
})

app.post('/', (req, res) => {

    const doc = new GoogleSpreadSheet (documentID)

    doc.useServiceAccountAuth(credentials, err => {

        if (err)
        {
            console.log ('não foi possivel abrir a planilha.')
        }
        else
        {
            console.log ('planilha aberta')
    
            doc.getInfo((err, info) => {
    
                const worksheet = info.worksheets [wsheetIndex]
                worksheet.addRow({

                    name: req.body.name,
                    email: req.body.email

                }, err => {
    
                    res.send ('seu relato foi enviado ! obrigado.')
                })
            })
        }
    })
})

app.listen(3000, err => {

    if (err)
    {
        console.log ('erro ao subir servidor: ', err)
    }
    else
    {
        console.log ('BugTracker rodando...')
    }
})