const jwt = require('jsonwebtoken');

// ====================
// Verificar token
// ====================

const verificaToken = (req, res, next) => {
	
	const token = req.get('token');

	jwt.verify( token, process.env.SEED, (err, decoded) => {
		
		if (err) {
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no valido'
				},
			});
		}

		req.usuario = decoded.usuario;

		next();
		
	} );
}

// ====================
// Verificar AdminRole
// ====================

const verificaAdmin_Role = (req, res, next) => {
	
	const usuario = req.usuario;

	if (usuario.role === 'ADMIN_ROLE') {
		next();

		return;
	}

	res.json({
  		ok: false,
  		err: {
  			message: 'El usuario no es administrador'
  		}
	});
}

module.exports = {
	verificaToken,
	verificaAdmin_Role
}