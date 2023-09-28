require('dotenv').config()

const express = require('express')
const helmet = require('helmet');
const morgan = require('morgan');

const { DBTest } = require('./database.js');
const publiModel = require('./publiModel.js');

const app = express()
const PUERTO = process.env.PUERTO

// Configurar EJS como motor de plantilla
app.set('view engine', 'ejs');

// Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async function (req, res) {
    const publi = await publiModel.findAll();

    res.render('inicio', { publi: publi });
})

app.get('/agregar', function (req, res) {
    res.render('agregar')
})

app.post('/agregar', async function (req, res) {
    const { titulo, descri, link } = req.body

    try {
        const nuevaPubli = await publiModel.create({
            titulo: titulo,
            descri: descri,
            link: link
        });

        if (nuevaPubli) {
            res.redirect('/');
        } else {
            res.send('No fue posible cargar la publicación')
        }
    } catch (err) {
        res.send('Error al agregar la publicación: ' + err)
    }
})

app.get('/eliminar/:id', async function (req, res) {
    const { id } = req.params;

    try {
        const borrarPubli = await publiModel.destroy({
            where: {
                id: id
            }
        })

        if (borrarPubli) {
            res.redirect('/');
        } else {
            res.send('No fue posible borrar la publicación')
        }
    } catch (err) {
        res.send('Error al borrar la publicación: ' + err)
    }
})

app.get('/editar/:id', async function (req, res) {
    const { id } = req.params;

    try {
        const publi = await publiModel.findOne({
            where: {
                id: id
            }
        })

        if (publi) {
            res.render('editar', { publi: publi });
        } else {
            res.send('No fue posible encontrar la publicacion')
        }
    } catch (err) {
        res.send('Error al editar la publicación: ' + err)
    }
})

app.post('/editar/:id', async function (req, res) {
    const { id } = req.params;
    const { titulo, descri, link } = req.body

    try {
        const publiActualizada = await publiModel.update(
            {
                titulo: titulo,
                descri: descri,
                link: link
            }, {
                where: {
                    id: id
                }
            }
        )
        
        if (publiActualizada) {
            res.redirect('/');
        } else {
            res.send('No fue posible actualizar la publicación')
        }
    } catch (err) {
        res.send('Error al editar la publicación: ' + err)
    }
})

DBTest()

app.listen(PUERTO, () => {
    console.log(`El servidor está corriendo en el puerto ${PUERTO}`)
})
