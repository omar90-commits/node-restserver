const express = require('express');
const _ = require('underscore');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

const Producto = require('../models/producto');

// =====================================
// Obtener todos los productos
// =====================================
app.get('/productos', verificaToken, (req, res) => {

	const desde = req.query.desde || 0;
	const limite = req.query.limite || 5;
	
	Producto.find({ disponible: true })
  		.skip(Number(desde))
		.limit(Number(limite))
		.populate('categoria', 'descripcion')
		.populate('usuario', 'nombre email')
		.exec((err, productos) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err,
				});
			}
			
			Producto.count({ disponible: true }, (err, conteo) => {
				res.json({
					ok: true,
					productos,
					cuantos: conteo,
				});
			});
		})

});

// // =====================================
// // Obtener producto por ID
// // =====================================
app.get('/productos/:id', verificaToken, (req, res) => {
	
	const id = req.params.id;

	Producto.findById(id)
		.populate('categoria', 'descripcion')
		.populate('usuario', 'nombre email')
		.exec((err, productoBD) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err: {
						message: 'A ocurrido un error'
					},
				});
			}

			if (!productoBD) {
				return res.status(400).json({
					ok: false,
					err: {
						message: 'El producto con este id no existe.'
					},
				});
			}

			res.json({
				ok: true,
				producto: productoBD,
			});
		})
});

// =====================================
// Buscar productos
// =====================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

	const termino = req.params.termino;
	const regex = new RegExp(termino, 'i');

	Producto.find({nombre : regex})
			.populate('categoria', 'descripcion')
			.exec((err, productos) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						err: {
							message: 'A ocurrido un error'
						},
					});
				}

				res.json({
					ok: true,
					productos,
				})
			})

});

// =====================================
// Crear un producto
// =====================================

app.post('/productos', verificaToken, (req, res) => {

	const body = req.body;

	const producto = new Producto({
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		disponible: body.disponible,
		categoria: body.categoria,
		usuario: req.usuario._id,
	});

	producto.save((err, productoDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		res.json({
			ok: true,
			producto: productoDB
		});
	});
});

// =====================================
// Actualizar un producto
// =====================================

app.put('/productos/:id', verificaToken, (req, res) => {
	
	const id = req.params.id;
	const body = _.pick(req.body, ['nombre', 'precioUni', 'categoria', 'disponible', 'descripcion'] );

	Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});

		} else if (!productoDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El producto con este id no existe.'
				},
			});
		}

	  	res.json({
	  		ok: true,
	  		producto: productoDB
	  	});
	});
});

// // =====================================
// // Borrar un producto
// // =====================================

app.delete('/productos/:id', verificaToken, (req, res) => {

	const id = req.params.id;
	const camibaEstado = {
		disponible: false
	}

	Producto.findByIdAndUpdate(id, camibaEstado, { new: true }, (err, productoEliminado) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!productoEliminado) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Producto con este ID no encontrado'
				}
			});
		}
		
		res.json({
			ok: true,
			producto: productoEliminado,
			message: 'producto borrado correctamente'
		})
	});
});

module.exports = app;