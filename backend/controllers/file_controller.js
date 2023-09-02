/** ------------------ IMPORTING PACKAGE/MODELS ------------------ **/
const fs = require('fs');
const csvParser = require('csv-parser');
const CSV = require('../models/csv');
const path = require('path');

/** ------------------ EXPORTING FUNCTION To upload a file ------------------ **/
module.exports.upload = async function(req, res) {
    try {
        // file is not present
        if(!req.file) {
            return res.status(400).send('No files were uploaded.');
        }
        // file is not csv
        if(req.file.mimetype != "text/csv") {
            return res.status(400).send('Select CSV files only.');
        }
        // console.log(req.file);
        let file = await CSV.create({
            fileName: req.file.originalname,
            filePath: req.file.path,
            file: req.file.filename
        });
        return res.redirect('/');
    } catch (error) {
        console.log('Error in fileController/upload', error);
        res.status(500).send('Internal server error');
    }
}

/** ------------------ EXPORTING FUNCTION To get All files ------------------ **/
module.exports.getAll = async function(req, res) {
    try {
        let csvFile = await CSV.findOne({file: req.params.id});
        const results = [];
        const header =[];
        fs.createReadStream(csvFile.filePath) //seeting up the path for file upload
        .pipe(csvParser())
        .on('headers', (headers) => {
            headers.map((head) => {
                header.push(head);
            });
        })
        .on('data', (data) =>
        results.push(data))
        .on('end', () => {
            res.status(200).json({
                fileName: csvFile.fileName,
                head: header,
                data: results,
                length: results.length
            });
        });
    } catch (error) {
        console.log('Error in fileController/view', error);
        res.status(500).send('Internal server error');
    }
}


/** ------------------ EXPORTING FUNCTION To delete the file ------------------ **/
module.exports.delete = async function(req, res) {
    try {
        // console.log(req.params);
        let isFile = await CSV.findOne({file: req.params.id});

        if(isFile){
            await CSV.deleteOne({file: req.params.id});            
            return res.redirect("/");
        }else{
            console.log("File not found");
            return res.redirect("/");
        }
    } catch (error) {
        console.log('Error in fileController/delete', error);
        return;
    }
}

/** ------------------ EXPORTING FUNCTION To search file ------------------ **/
module.exports.search = async function(req, res) {
    try {
        let query = {};
        let searchValue = req.query.search;
        if (searchValue) {
            let regex = new RegExp(searchValue, 'i');
            let fields = Object.keys(CSV.schema.paths);
            let orQueries = fields.map(field => ({ [field]: regex }));
            query = { $or: orQueries };
        }
        let files = await CSV.find(query);
        if (files.length === 0) {
            return res.status(404).json({ message: 'Nenhum arquivo encontrado.' });
        }
        return res.status(200).json(files);
    } catch (error) {
        console.log('Error in fileController/search', error);
        res.status(500).send('Internal server error');
    }
}


