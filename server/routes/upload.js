const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

	const tipo = req.params.tipo;
	const id = req.params.id;
 
	if (!req.files) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'No se a seleccionado ningun archivo.'
			}
		})
	}

	//Validar tipo
	const tiposValidos = ['productos', 'usuarios'];

	if (!tiposValidos.includes(tipo)) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Los tipos validos son ' + tiposValidos.join(', '),
			}
		});
	}

	const archivo = req.files.archivo;
	const nombreCortado = archivo.name.split('.');

	// Extensiones permitidas
	const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
	const extension = nombreCortado[nombreCortado.length - 1];

	if (!extensionesValidas.includes(extension)) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
				ext: extension,
			}
		});
	}

	// Cambiar nombre al archivo
	const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

	archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
	    if (err){
	      	return res.status(500).json({
				ok: false,
				err
			});
	    }

	    //Aqui, imagen cargada
	    console.log(tipo)
	    tipo === 'productos' ? imagenProducto(id, res, nombreArchivo) : imagenUsuario(id, res, nombreArchivo);
		// imagenUsuario(id, res, nombreArchivo);
		// imagenProducto(id, res, nombreArchivo);
  	});
});

function imagenUsuario(id, res, nombreArchivo) {

	Usuario.findById(id, (err, usuarioBD) => {

		 if (err){
		 	borraArchivo(nombreArchivo, 'usuarios');

	      	return res.status(500).json({
				ok: false,
				err
			});
	    }

	    if (!usuarioBD) {
	    	borraArchivo(nombreArchivo, 'usuarios');
	    	
	    	return res.status(400).json({
				ok: false,
				err: {
					message: 'Usuario no existe',
				}
			});
	    }

	    borraArchivo(usuarioBD, 'usuarios');

	    usuarioBD.img = nombreArchivo;

	    usuarioBD.save((err, usuarioGuardado) => {
			res.json({
		    	ok: true,
		    	usuario: usuarioGuardado,
		    	img: nombreArchivo,
		    });
	    });

	});
}

function imagenProducto(id, res, nombreArchivo) {

	Producto.findById(id, (err, productoBD) => {
		
		 if (err) {
		 	borraArchivo(nombreArchivo, 'productos');

	      	return res.status(500).json({
				ok: false,
				err
			});
	    }

	    if (!productoBD) {
	    	borraArchivo(nombreArchivo, 'productos');
	    	
	    	return res.status(400).json({
				ok: false,
				err: {
					message: 'Producto no existe',
				}
			});
	    }

	    borraArchivo(productoBD, 'productos');

	    productoBD.img = nombreArchivo;

	    productoBD.save((err, productoGuardado) => {
			res.json({
		    	ok: true,
		    	producto: productoGuardado,
		    	img: nombreArchivo,
		    });
	    });
	});
}

function borraArchivo(nombreImagen, tipo) {
	const pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen.img}`);

    if (fs.existsSync(pathImage)) {
    	fs.unlinkSync(pathImage);
    }
}

module.exports = app;