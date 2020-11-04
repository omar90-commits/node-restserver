const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');

// =====================================
// Mostrar todas las categorias
// =====================================

app.get('/categoria', (req, res) => {
	
	Categoria.find({})
			.sort('descripcion')
			.populate('usuario', 'nombre email')
			.exec( (err, categorias) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						err,
					});
				}
				
				Categoria.count({}, (err, conteo) => {
					res.json({
						ok: true,
						categorias,
						cuantos: conteo,
					});
				});
			} )	
});

// // =====================================
// // Mostrar todas las categorias por ID
// // =====================================

app.get('/categoria/:id', (req, res) => {

	const id = req.params.id; 

	Categoria.findById(id, (err, categoriaDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!categoriaDB) {
			return res.status(500).json({
				ok: false,
				err: {
					message: 'No existe categoria con ese ID'
				},
			});
		}

		res.json({
			ok: true,
			categoria: categoriaDB
		});
	});
});

// =====================================
// Crear una nueva categoria
// =====================================

app.post('/categoria', verificaToken, (req, res) => {
	
	const body = req.body;

	const categoria = new Categoria({
		descripcion: body.descripcion,
		usuario: req.usuario._id,
	});

	categoria.save((err, categoriaDB) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		res.json({
			ok: true,
			categoria: categoriaDB
		});
	});
});

// =====================================
// Actualizar categoria
// =====================================

app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
	
	const id = req.params.id;
	const actualizar = {
		descripcion: req.body.descripcion,
	}

	Categoria.findByIdAndUpdate(id, actualizar, { new: true, runValidators: true }, (err, categoriaDB) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});

		} else if (!categoriaDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'La categoria con este id no existe.'
				},
			});
		}

	  	res.json({
	  		ok: true,
	  		usuario: categoriaDB
	  	});
	});
	
});

// // =====================================
// // Elminar categoria
// // =====================================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

	const id = req.params.id;

	Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!categoriaBorrada) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Categoria no encontrado'
				}
			});
		}
		
		res.json({
			ok: true,
			categoria: categoriaBorrada,
		});
	});	
});

module.exports = app;