import type { TasksState } from '../App'
import {CreateTodolistAction, DeleteTodolistAction} from "./todolists-reducer.ts";
import {v1} from "uuid";

const initialState: TasksState = {}

type Actions = CreateTodolistAction | DeleteTodolistAction | DeleteTaskAction | CreateTaskAction | ChangeTaskStatusAction | ChangeTaskTitleAction

export type DeleteTaskAction = ReturnType<typeof deleteTaskAC>
export type CreateTaskAction = ReturnType<typeof createTaskAC>
export type ChangeTaskStatusAction = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleAction = ReturnType<typeof changeTaskTitleAC>

export const deleteTaskAC = ({todolistId, taskId}: {todolistId: string, taskId: string}) => {
    return {type: 'delete_task', payload: { todolistId, taskId }} as const
}

export const createTaskAC = ({todolistId, title}: {todolistId: string, title: string}) => {
    return {type: 'create_task', payload: { todolistId, title }} as const
}

export const changeTaskStatusAC = ({todolistId, taskId, isDone}: {todolistId: string, taskId: string, isDone: boolean}) => {
    return {type: 'change_task_status', payload: { todolistId, taskId, isDone }} as const
}

export const changeTaskTitleAC = ({todolistId, taskId, title}: {todolistId: string, taskId: string, title: string}) => {
    return {type: 'change_task_title', payload: { todolistId, taskId, title }} as const
}


export const tasksReducer = (state: TasksState = initialState, action: Actions): TasksState => {
    switch (action.type) {
        case 'create_todolist': {
            return { ...state, [action.payload.id]: [] }
        }
        case 'delete_todolist': {
            const newState = { ...state }
            delete newState[action.payload.id]
            return newState
        }
        case 'delete_task': {
            const { todolistId, taskId } = action.payload
            return {...state, [todolistId]: state[todolistId].filter(task => task.id !== taskId)}
        }
        case 'create_task': {
            const newTask = {id: v1(), title: action.payload.title, isDone: false}
            return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]}
        }
        case 'change_task_status': {
            return {...state, [action.payload.todolistId]: state[action.payload.todolistId].map(task => task.id === action.payload.taskId ? {...task, isDone: action.payload.isDone} : task)}
        }
        case 'change_task_title': {
            return {...state, [action.payload.todolistId]: state[action.payload.todolistId].map(task => task.id === action.payload.taskId ? {...task, title: action.payload.title} : task)}
        }
        default:
            return state
    }
}

