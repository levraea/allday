import { Router } from 'express'
import Task from '../models/Task.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAhead = new Date(startOfToday)
    weekAhead.setDate(weekAhead.getDate() + 7)

    const overdueFilter = {
      status: 'open',
      dueDate: { $ne: null, $lt: startOfToday },
    }
    const dueSoonFilter = {
      status: 'open',
      dueDate: { $gte: startOfToday, $lte: weekAhead },
    }

    const [open, completed, overdueCount, overdueTasks, dueSoonTasks, highPriorityOpen] =
      await Promise.all([
        Task.countDocuments({ status: 'open' }),
        Task.countDocuments({ status: 'completed' }),
        Task.countDocuments(overdueFilter),
        Task.find(overdueFilter)
          .populate('projectId', 'name')
          .sort({ dueDate: 1 })
          .limit(50),
        Task.find(dueSoonFilter)
          .populate('projectId', 'name')
          .sort({ dueDate: 1 })
          .limit(50),
        Task.find({ status: 'open', priority: 'high' })
          .populate('projectId', 'name')
          .sort({ dueDate: 1, createdAt: -1 })
          .limit(50),
      ])

    res.json({
      counts: {
        open,
        completed,
        overdue: overdueCount,
      },
      overdueTasks,
      dueSoonTasks,
      highPriorityOpen,
    })
  } catch (e) {
    next(e)
  }
})

export default router
