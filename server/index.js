import express from 'express'
import cors from 'cors'
import db, { initializeDatabase, seedDatabase } from './database.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database
initializeDatabase()
seedDatabase()

// ==================== Users API ====================

// Get all users
app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all()
    res.json(users.map(user => ({
      ...user,
      isActive: user.isActive === 1
    })))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ ...user, isActive: user.isActive === 1 })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create user
app.post('/api/users', (req, res) => {
  try {
    const { name, email, phone, weddingDate, templateId } = req.body

    // Generate new user ID
    const lastUser = db.prepare('SELECT id FROM users ORDER BY id DESC LIMIT 1').get()
    const lastNum = lastUser ? parseInt(lastUser.id.replace('user', '')) : 0
    const newId = `user${String(lastNum + 1).padStart(3, '0')}`

    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, phone, isActive, templateId, createdAt, weddingDate)
      VALUES (?, ?, ?, ?, 1, ?, ?, ?)
    `)

    stmt.run(newId, name, email, phone, templateId || null, new Date().toISOString(), weddingDate)

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(newId)
    res.status(201).json({ ...newUser, isActive: newUser.isActive === 1 })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user
app.put('/api/users/:id', (req, res) => {
  try {
    const { name, email, phone, weddingDate, templateId, isActive } = req.body

    const stmt = db.prepare(`
      UPDATE users
      SET name = ?, email = ?, phone = ?, weddingDate = ?, templateId = ?, isActive = ?
      WHERE id = ?
    `)

    stmt.run(name, email, phone, weddingDate, templateId || null, isActive ? 1 : 0, req.params.id)

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)
    res.json({ ...user, isActive: user.isActive === 1 })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete user
app.delete('/api/users/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Toggle user active
app.patch('/api/users/:id/toggle', (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const newActive = user.isActive === 1 ? 0 : 1
    db.prepare('UPDATE users SET isActive = ? WHERE id = ?').run(newActive, req.params.id)

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)
    res.json({ ...updatedUser, isActive: updatedUser.isActive === 1 })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ==================== Templates API ====================

// Get all templates
app.get('/api/templates', (req, res) => {
  try {
    const templates = db.prepare('SELECT * FROM templates').all()
    res.json(templates.map(template => ({
      ...template,
      components: JSON.parse(template.components)
    })))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get template by ID
app.get('/api/templates/:id', (req, res) => {
  try {
    const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(req.params.id)
    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }
    res.json({
      ...template,
      components: JSON.parse(template.components)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create template
app.post('/api/templates', (req, res) => {
  try {
    const { name, thumbnail, category, backgroundColor, backgroundImage, components } = req.body

    // Generate new template ID
    const lastTemplate = db.prepare('SELECT id FROM templates ORDER BY id DESC LIMIT 1').get()
    const lastNum = lastTemplate ? parseInt(lastTemplate.id.replace('template-', '')) : 0
    const newId = `template-${lastNum + 1}`

    const stmt = db.prepare(`
      INSERT INTO templates (id, name, thumbnail, category, backgroundColor, backgroundImage, components)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      newId,
      name,
      thumbnail || '',
      category || 'custom',
      backgroundColor || '#FFFFFF',
      backgroundImage || null,
      JSON.stringify(components || [])
    )

    const newTemplate = db.prepare('SELECT * FROM templates WHERE id = ?').get(newId)
    res.status(201).json({
      ...newTemplate,
      components: JSON.parse(newTemplate.components)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update template
app.put('/api/templates/:id', (req, res) => {
  try {
    const { name, thumbnail, category, backgroundColor, backgroundImage, components } = req.body

    const stmt = db.prepare(`
      UPDATE templates
      SET name = ?, thumbnail = ?, category = ?, backgroundColor = ?, backgroundImage = ?, components = ?
      WHERE id = ?
    `)

    stmt.run(
      name,
      thumbnail || '',
      category || 'custom',
      backgroundColor || '#FFFFFF',
      backgroundImage || null,
      JSON.stringify(components || []),
      req.params.id
    )

    const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(req.params.id)
    res.json({
      ...template,
      components: JSON.parse(template.components)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete template
app.delete('/api/templates/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM templates WHERE id = ?').run(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ==================== Customizations API ====================

// Get all customizations
app.get('/api/customizations', (req, res) => {
  try {
    const customizations = db.prepare('SELECT * FROM customizations').all()
    const result = {}
    customizations.forEach(c => {
      result[c.userId] = {
        ...c,
        components: JSON.parse(c.components)
      }
    })
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get customization by user ID
app.get('/api/customizations/:userId', (req, res) => {
  try {
    const customization = db.prepare('SELECT * FROM customizations WHERE userId = ?').get(req.params.userId)
    if (!customization) {
      return res.status(404).json({ error: 'Customization not found' })
    }
    res.json({
      ...customization,
      components: JSON.parse(customization.components)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Save customization
app.post('/api/customizations/:userId', (req, res) => {
  try {
    const { templateId, backgroundColor, backgroundImage, components } = req.body
    const userId = req.params.userId

    const existing = db.prepare('SELECT * FROM customizations WHERE userId = ?').get(userId)

    if (existing) {
      // Update
      const stmt = db.prepare(`
        UPDATE customizations
        SET templateId = ?, backgroundColor = ?, backgroundImage = ?, components = ?, lastModified = ?
        WHERE userId = ?
      `)
      stmt.run(
        templateId,
        backgroundColor || '#FFFFFF',
        backgroundImage || null,
        JSON.stringify(components),
        new Date().toISOString(),
        userId
      )
    } else {
      // Insert
      const stmt = db.prepare(`
        INSERT INTO customizations (userId, templateId, backgroundColor, backgroundImage, components, lastModified)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      stmt.run(
        userId,
        templateId,
        backgroundColor || '#FFFFFF',
        backgroundImage || null,
        JSON.stringify(components),
        new Date().toISOString()
      )
    }

    const customization = db.prepare('SELECT * FROM customizations WHERE userId = ?').get(userId)
    res.json({
      ...customization,
      components: JSON.parse(customization.components)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete customization
app.delete('/api/customizations/:userId', (req, res) => {
  try {
    db.prepare('DELETE FROM customizations WHERE userId = ?').run(req.params.userId)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get invite data
app.get('/api/invite/:userId', (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.userId)

    if (!user || user.isActive !== 1) {
      return res.status(404).json({ error: 'User not found or inactive' })
    }

    // Check customization first
    const customization = db.prepare('SELECT * FROM customizations WHERE userId = ?').get(req.params.userId)

    if (customization) {
      return res.json({
        user: { ...user, isActive: user.isActive === 1 },
        components: JSON.parse(customization.components),
        templateId: customization.templateId,
        backgroundColor: customization.backgroundColor,
        backgroundImage: customization.backgroundImage
      })
    }

    // Fall back to template
    if (user.templateId) {
      const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(user.templateId)
      if (template) {
        return res.json({
          user: { ...user, isActive: user.isActive === 1 },
          components: JSON.parse(template.components),
          templateId: template.id,
          backgroundColor: template.backgroundColor,
          backgroundImage: template.backgroundImage
        })
      }
    }

    res.status(404).json({ error: 'No template or customization found' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' })
})

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`)
  console.log(`📊 Database: SQLite`)
  console.log(`🔗 API: http://localhost:${PORT}/api`)
})
