const express = require('express');
const cors = require('cors');
const { sequelize, Lista } = require('./repositorio'); // Asegúrate de que el nombre del archivo sea correcto

const app = express();
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Middleware para parsear JSON

// Ruta para obtener todas las listas
app.get('/listas', async (req, res) => {
    try {
        const listas = await Lista.findAll(); // Obtener todas las listas
        res.status(200).json(listas); // Devolver las listas en formato JSON
    } catch (error) {
        console.error('Error al obtener las listas:', error);
        res.status(500).json({ error: 'Error al obtener las listas' });
    }
});

// Ruta para crear una nueva lista
app.post('/listas', async (req, res) => {
    try {
        const { Hacer, Compras } = req.body;
        const nuevaLista = await Lista.create({ Hacer, Compras });
        res.status(201).json(nuevaLista); // Responde con el nuevo elemento creado
    } catch (error) {
        console.error('Error al crear la lista:', error);
        res.status(500).json({ error: 'Error al crear la lista' });
    }
});

// Ruta para eliminar una lista por "Hacer"
app.delete('/listas/:hacer', async (req, res) => {
    try {
        const { hacer } = req.params;
        const deleted = await Lista.destroy({ where: { Hacer: hacer } });
        if (deleted) {
            res.status(204).send(); // Respuesta exitosa sin contenido
        } else {
            res.status(404).json({ error: 'Lista no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la lista:', error);
        res.status(500).json({ error: 'Error al eliminar la lista' });
    }
});

// Inicializa la conexión y arranca el servidor
const init = async () => {
    try {
        await sequelize.sync(); // Asegurarse de que la base de datos está sincronizada
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
};

init(); // Llama a la función para iniciar el servidor
