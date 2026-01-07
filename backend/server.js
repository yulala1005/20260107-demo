const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')

const app = express()
app.use(cors())
app.use(express.json())

// Database connection
let db
async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: 'db',
      user: 'root',
      password: 'password',
      database: 'myapp',
    })
    console.log('✅ Connected to MySQL')

    // Create table if not exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Table ready')

    // デフォルトアイテムを挿入（テーブルが空の場合のみ）
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM items')
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO items (name, description) VALUES
        ('Learn Docker', 'Understand the basics of Docker Compose and containerization'),
        ('Build Full-Stack App', 'Create a simple CRUD application with Next.js + Express + MySQL'),
        ('Test API Endpoints', 'Verify all REST API endpoints are working correctly'),
        ('Deploy to Production', 'Deploy the application to production environment')
      `)
      console.log('✅ デフォルトアイテムを挿入しました')
    }
  } catch (error) {
    console.error('❌ Database error:', error)
    setTimeout(connectDB, 5000) // Retry after 5 seconds
  }
}

connectDB()

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' })
})

app.get('/api/items', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM items ORDER BY created_at DESC',
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/items', async (req, res) => {
  try {
    const { name, description } = req.body
    const [result] = await db.execute(
      'INSERT INTO items (name, description) VALUES (?, ?)',
      [name, description],
    )
    res.json({ id: result.insertId, name, description })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/items/:id', async (req, res) => {
  try {
    const { name, description } = req.body
    await db.execute(
      'UPDATE items SET name = ?, description = ? WHERE id = ?',
      [name, description, req.params.id],
    )
    res.json({ id: req.params.id, name, description })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/items/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM items WHERE id = ?', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = 4000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
})
