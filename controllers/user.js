
var bcrypt = require('bcryptjs');
var User = require('../models/users');



// ==========================================
// Obtener todos los usuarios
// ==========================================

var getAllUsers = (req,res)=>{

    var from = req.query.desde || 0;
    var limit = req.query.limite || 0;
    from = Number(from);
    limit = Number(limit);

    User.find({}, 'nombre email img role google')
        .skip(from)
        .limit(limit)
        .exec(
            (err, users) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario',
                        errors: err
                    });
                }
                console.log(users);
                User.count({}, (err, counter) => {

                    res.status(200).json({
                        ok: true,
                        usuarios: users,
                        listados: users.length,
                        total: counter
                    });

                });

            });
};


// ==========================================
// Actualizar usuario
// ==========================================
var updateUser = (req,res)=>{

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }


        user.nombre = body.nombre;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userUpdated) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            userUpdated.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: userUpdated
            });

        });

    });

};



// ==========================================
// Crear un nuevo usuario
// ==========================================
var addUser = (req,res)=> {

    var body = req.body;

    var user = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, userAdded) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: userAdded,
            usuariotoken: req.usuario
        });


    });

};


// ============================================
//   Borrar un usuario por el id
// ============================================
var deleteUser = (req,res)=>{

    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: userDeleted
        });

    });

};

// ============================================
//   Buscar un usuario por el id
// ============================================
var findUserById = (req,res) =>{    

    var id = req.params.id;

    User.findById(id, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando usuario',
                errors: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: user
        });

    });

};

module.exports = {
    addUser,
    getAllUsers,
    findUserById,
    deleteUser,
    updateUser
}