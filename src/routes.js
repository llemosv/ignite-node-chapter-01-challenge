import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const searchData = search ? {
                title: search,
                description: search,
            } : null;

            const users = database.select('tasks', searchData)

            return res.end(JSON.stringify(users))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            if (!title) return res.writeHead(400).end(JSON.stringify({ message: 'title é obrigatório.' }))

            if (!description) return res.writeHead(400).end(JSON.stringify({ message: 'description é obrigatório.' }))

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()

            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const task = database.select('tasks', { id })

            if (!task) return res.writeHead(404).end(JSON.stringify({ message: 'Task não encontrada.' }))

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            const task = database.select('tasks', { id })

            if (!task) return res.writeHead(404).end(JSON.stringify({ message: 'Task não encontrada.' }))

            database.update('tasks', id, { title, description, updated_at: new Date() })


            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const task = database.select('tasks', { id })

            if (!task) return res.writeHead(404).end(JSON.stringify({ message: 'Task não encontrada.' }))

            const completed_at = !!task.completed_at ? null : new Date()

            database.update('tasks', id, { completed_at })

            return res.writeHead(204).end()
        }
    }
]