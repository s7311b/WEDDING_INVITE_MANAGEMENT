import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, 'data', 'wedding.db')

// Ensure data directory exists
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize database schema
export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      isActive INTEGER DEFAULT 1,
      templateId TEXT,
      createdAt TEXT NOT NULL,
      weddingDate TEXT NOT NULL,
      fontFamily TEXT
    )
  `)

  // Templates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      thumbnail TEXT,
      category TEXT,
      backgroundColor TEXT DEFAULT '#FFFFFF',
      backgroundImage TEXT,
      components TEXT NOT NULL,
      fontFamily TEXT
    )
  `)

  // Customizations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customizations (
      userId TEXT PRIMARY KEY,
      templateId TEXT,
      backgroundColor TEXT DEFAULT '#FFFFFF',
      backgroundImage TEXT,
      components TEXT NOT NULL,
      lastModified TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Migration: Add fontFamily column if it doesn't exist
  try {
    db.exec(`ALTER TABLE users ADD COLUMN fontFamily TEXT`)
    console.log('Added fontFamily column to users table')
  } catch (error) {
    // Column already exists or other error
    if (!error.message.includes('duplicate column')) {
      console.error('Error adding fontFamily to users:', error.message)
    }
  }

  try {
    db.exec(`ALTER TABLE templates ADD COLUMN fontFamily TEXT`)
    console.log('Added fontFamily column to templates table')
  } catch (error) {
    // Column already exists or other error
    if (!error.message.includes('duplicate column')) {
      console.error('Error adding fontFamily to templates:', error.message)
    }
  }

  console.log('Database initialized successfully')
}

// Seed initial data
export function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()

  if (userCount.count === 0) {
    console.log('Seeding database with initial data...')

    // Import sample data
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../src/mock/users.json'), 'utf-8')
    )
    const templatesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../src/mock/templates.json'), 'utf-8')
    )
    const customizationsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../src/mock/customizations.json'), 'utf-8')
    )

    // Insert users
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, phone, isActive, templateId, createdAt, weddingDate, fontFamily)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    for (const user of usersData) {
      insertUser.run(
        user.id,
        user.name,
        user.email,
        user.phone,
        user.isActive ? 1 : 0,
        user.templateId,
        user.createdAt,
        user.weddingDate,
        user.fontFamily || null
      )
    }

    // Insert templates
    const insertTemplate = db.prepare(`
      INSERT INTO templates (id, name, thumbnail, category, backgroundColor, backgroundImage, components, fontFamily)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    for (const template of templatesData) {
      insertTemplate.run(
        template.id,
        template.name,
        template.thumbnail,
        template.category,
        template.backgroundColor || '#FFFFFF',
        template.backgroundImage,
        JSON.stringify(template.components),
        template.fontFamily || null
      )
    }

    // Insert customizations
    const insertCustomization = db.prepare(`
      INSERT INTO customizations (userId, templateId, backgroundColor, backgroundImage, components, lastModified)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    for (const [userId, customization] of Object.entries(customizationsData)) {
      insertCustomization.run(
        userId,
        customization.templateId,
        customization.backgroundColor || '#FFFFFF',
        customization.backgroundImage,
        JSON.stringify(customization.components),
        customization.lastModified
      )
    }

    console.log('Database seeded successfully')
  }
}

export default db
