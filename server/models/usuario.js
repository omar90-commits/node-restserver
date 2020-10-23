const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const rolesValidos = {
	values: ['ADMIN_ROLE', 'USER_ROLE'],
	message: '{VALUE} no es un ROL valido',
};

const usuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es necesario']
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'El correo es necesario']
	},
	password: {
		type: String,
		required: [true, 'La contraseña es necesario']
	},
	img: {
		type: String,
		required: false
	}, 
	role: {
		type: String,
		default: 'USER_ROLE',
		enum: rolesValidos,
	}, 
	estado: {
		type: Boolean,
		default: true,
	}, 
	google: {
		type: Boolean,
		default: false,
	}
});

usuarioSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;

	return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model( 'Usuario', usuarioSchema );