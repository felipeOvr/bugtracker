const express = require('express')
const path = require('path') // core
const app = express()
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')

const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require ('./bugtracker.json')

app.use (express.json())
app.use (express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set ('views', path.resolve (__dirname, 'views'))

// configurações

const sgKey = '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'
const documentID = '1iNiSZewugNysXnT6ttiC5WONBnDWDxHvBKvXNODm2EQ'
const wsheetIndex = 0

app.get('/', (req, res) => {

    res.render ('home')
})

app.post('/', async (req, res) => {

    try
    {
        const {
            name,
            email,
            issuetype,
            howtoreproduce,
            expectedoutput,
            receivedoutput,
            userAgent,
            userDate

        } = req.body

        const doc = new GoogleSpreadSheet (documentID)

        await promisify (doc.useServiceAccountAuth)(credentials)

        const info = await promisify (doc.getInfo)()

        const worksheet = info.worksheets [wsheetIndex]

        await promisify (worksheet.addRow)({

            name,
            email,
            issuetype,
            source: req.query.source || "default",
            howtoreproduce,
            expectedoutput,
            receivedoutput,
            userAgent,
            userDate
        })

        // se for crítico

        if (issuetype === 'critical')
        {
            sgMail.setApiKey(sgKey)
            const msg = {
                to: 'goo.felipeoliveira@gmail.com',
                from: 'goo.felipeoliveira@gmail.com',
                subject: 'Bug critico reportado',
                text: `O usuário ${req.body.name} reportou um erro crítico.`,
                html: `O usuário ${req.body.name} reportou um erro crítico.`,
            }
            await sgMail.send(msg)
        }

        res.render ('success')
    }
    catch (error)
    {
        res.send ("erro ao relatar bug")

        console.log (error)
    }
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