const GoogleSpreadSheet = require ('google-spreadsheet')

const credentials = require ('./bugtracker.json')

const { promisify } = require('util')

const addRowToSheet = async () => {

    const doc = new GoogleSpreadSheet ("1iNiSZewugNysXnT6ttiC5WONBnDWDxHvBKvXNODm2EQ")

    await promisify (doc.useServiceAccountAuth)(credentials)

    console.log ("planilha aberta")

    const info = await promisify (doc.getInfo)()

    const workSheet = info.worksheets[0]

    await promisify (workSheet.addRow) ({ "name": "promisify", "email": "promisify@node.com" })
}

addRowToSheet()