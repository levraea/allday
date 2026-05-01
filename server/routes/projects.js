import { Router } from 'express'
import mongoose from 'mongoose'
import Project from '../models/Project.js'
import Task from '../models/Task.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ name: 1 })
    res.json(projects)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, description = '' } = req.body
    if (!name || typeof name !== 'string') {
      const err = new Error('name is required')
      err.status = 400
      throw err
    }
    const project = await Project.create({
      userId: req.user.id,
      name: name.trim(),
      description,
    })
    res.status(201).json(project)
  } catch (e) {
    next(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error('Invalid project id')
      err.status = 400
      throw err
    }
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.id })
    if (!project) {
      const err = new Error('Project not found')
      err.status = 404
      throw err
    }
    res.json(project)
  } catch (e) {
    next(e)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) {
      const err = new Error('Invalid project id')
      err.status = 400
      throw err
    }
    const updates = {}
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim()
    if (req.body.description !== undefined)
      updates.description = String(req.body.description)
    const project = await Project.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      {
      new: true,
      runValidators: true,
      }
    )
    if (!project) {
      const err = new Error('Project not found')
      err.status = 404
      throw err
    }
    res.json(project)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) {
      const err = new Error('Invalid project id')
      err.status = 400
      throw err
    }
    const deleted = await Project.findOneAndDelete({ _id: id, userId: req.user.id })
    if (!deleted) {
      const err = new Error('Project not found')
      err.status = 404
      throw err
    }
    await Task.deleteMany({ userId: req.user.id, projectId: id })
    res.status(204).send()
  } catch (e) {
    next(e)
  }
})

export default router
