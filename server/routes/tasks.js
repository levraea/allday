import { Router } from 'express'
import mongoose from 'mongoose'
import Task, { PRIORITIES, STATUSES } from '../models/Task.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { projectId, status, priority } = req.query
    const filter = {}
    if (projectId) {
      if (!mongoose.isValidObjectId(projectId)) {
        const err = new Error('Invalid projectId')
        err.status = 400
        throw err
      }
      filter.projectId = projectId
    }
    if (status && STATUSES.includes(status)) filter.status = status
    if (priority && PRIORITIES.includes(priority)) filter.priority = priority

    const tasks = await Task.find(filter)
      .populate('projectId', 'name')
      .sort({ dueDate: 1, createdAt: -1 })
    res.json(tasks)
  } catch (e) {
    next(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) {
      const err = new Error('Invalid task id')
      err.status = 400
      throw err
    }
    const task = await Task.findById(id).populate('projectId', 'name')
    if (!task) {
      const err = new Error('Task not found')
      err.status = 404
      throw err
    }
    res.json(task)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, status, projectId } = req.body
    if (!title || typeof title !== 'string') {
      const err = new Error('title is required')
      err.status = 400
      throw err
    }
    if (priority && !PRIORITIES.includes(priority)) {
      const err = new Error('Invalid priority')
      err.status = 400
      throw err
    }
    if (status && !STATUSES.includes(status)) {
      const err = new Error('Invalid status')
      err.status = 400
      throw err
    }
    if (projectId && !mongoose.isValidObjectId(projectId)) {
      const err = new Error('Invalid projectId')
      err.status = 400
      throw err
    }
    const task = await Task.create({
      title: title.trim(),
      description: description != null ? String(description) : '',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      status: status || 'open',
      projectId: projectId || null,
    })
    const populated = await Task.findById(task._id).populate('projectId', 'name')
    res.status(201).json(populated)
  } catch (e) {
    next(e)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) {
      const err = new Error('Invalid task id')
      err.status = 400
      throw err
    }
    const updates = {}
    if (req.body.title !== undefined) updates.title = String(req.body.title).trim()
    if (req.body.description !== undefined)
      updates.description = String(req.body.description)
    if (req.body.priority !== undefined) {
      if (!PRIORITIES.includes(req.body.priority)) {
        const err = new Error('Invalid priority')
        err.status = 400
        throw err
      }
      updates.priority = req.body.priority
    }
    if (req.body.dueDate !== undefined) {
      updates.dueDate =
        req.body.dueDate === null || req.body.dueDate === ''
          ? null
          : new Date(req.body.dueDate)
    }
    if (req.body.status !== undefined) {
      if (!STATUSES.includes(req.body.status)) {
        const err = new Error('Invalid status')
        err.status = 400
        throw err
      }
      updates.status = req.body.status
    }
    if (req.body.projectId !== undefined) {
      if (req.body.projectId === null || req.body.projectId === '') {
        updates.projectId = null
      } else if (!mongoose.isValidObjectId(req.body.projectId)) {
        const err = new Error('Invalid projectId')
        err.status = 400
        throw err
      } else {
        updates.projectId = req.body.projectId
      }
    }
    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('projectId', 'name')
    if (!task) {
      const err = new Error('Task not found')
      err.status = 404
      throw err
    }
    res.json(task)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) {
      const err = new Error('Invalid task id')
      err.status = 400
      throw err
    }
    const deleted = await Task.findByIdAndDelete(id)
    if (!deleted) {
      const err = new Error('Task not found')
      err.status = 404
      throw err
    }
    res.status(204).send()
  } catch (e) {
    next(e)
  }
})

export default router
