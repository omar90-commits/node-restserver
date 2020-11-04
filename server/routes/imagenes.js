const express = require('express');

const fs = require('fs');
const path= require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');

const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

	const tipo = req.params.tipo;
	const img = req.params.img;

	const plathImg = `./uploads/${tipo}/${img}`;
	const pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

	if ( fs.existsSync(pathImage) ) res.sendFile(pathImage);
	else {
		const noImagePath = path.resolve(__dirname, '../assets/10.1 no-image.jpg');
		res.sendFile(noImagePath);
	}


} );

module.exports = app;