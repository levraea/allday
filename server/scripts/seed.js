import 'dotenv/config'
import mongoose from 'mongoose'
import Project from '../models/Project.js'
import Task from '../models/Task.js'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

const uri = process.env.MONGODB_URI

if (!uri) {
  console.error('Missing MONGODB_URI')
  process.exit(1)
}

const sampleProjects = [
  {
    name: 'Personal Admin',
    description: 'Life maintenance, appointments, and paperwork.',
  },
  {
    name: 'Coursework Sprint',
    description: 'Weekly planning for assignments and deliverables.',
  },
]

async function runSeed() {
  await mongoose.connect(uri)

  await Task.deleteMany({})
  await Project.deleteMany({})
  await User.deleteMany({})

  const demoUser = await User.create({
    username: 'demo',
    passwordHash: await bcrypt.hash('password123', 12),
  })

  const projects = await Project.insertMany(
    sampleProjects.map((p) => ({ ...p, userId: demoUser._id }))
  )
  const personal = projects.find((p) => p.name === 'Personal Admin')
  const coursework = projects.find((p) => p.name === 'Coursework Sprint')

  await Task.insertMany([
    {
      title: 'Call dentist office',
      description: 'Ask for first available cleaning appointment.',
      priority: 'medium',
      status: 'open',
      dueDate: new Date(),
      userId: demoUser._id,
      projectId: personal?._id || null,
    },
    {
      title: 'Review MERN milestone checklist',
      description: 'Confirm routes, models, and UI requirements are complete.',
      priority: 'high',
      status: 'open',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      userId: demoUser._id,
      projectId: coursework?._id || null,
    },
    {
      title: 'Draft project walkthrough slides',
      description: 'Prepare slides for demo video and team speaking points.',
      priority: 'medium',
      status: 'open',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      userId: demoUser._id,
      projectId: coursework?._id || null,
    },
  ])

  console.log('Seed complete: demo user, projects, and tasks inserted.')
  console.log('Demo login => username: demo, password: password123')
}

runSeed()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
