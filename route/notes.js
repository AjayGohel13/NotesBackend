const noteRouter = require("express").Router();
const pool = require("../entities/db");

noteRouter.post("/create-note", async (req, res) => {
    const { userId, note } = req.body;

    try {
        if (!note || !userId) {
            return res.status(400).json({ error: 'Missing note or userId' });
        }
        const query = 'INSERT INTO notes (note, userId) VALUES ($1, $2) RETURNING *';
        const values = [note, userId];
        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Note saved', user: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
})

noteRouter.get('/get-notes/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM notes WHERE userId = $1',
            [userId]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ notes: result.rows });
        } else {
            res.status(404).json({ message: 'No notes found for this user' });
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

noteRouter.delete('/delete-note/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM notes WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length > 0) {
            res.status(200).json({ notes: result.rows });
        } else {
            res.status(404).json({ message: 'No notes found for delete' });
        }

    } catch (error) {
        console.error('Error deleting notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = noteRouter;