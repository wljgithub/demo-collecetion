import {get,post,put,del} from './base'

const PREFIX = '/task'
module.exports = {
  addTask(name){
    let url = `${PREFIX}/addTask`
    return post(url,{name})
  },
  deleteOneTask(task){
    let url = `${PREFIX}/deleteOneTask`
    return del(url,{task})
  },
  deleteMultipleTask(tasks){
    let url = `${PREFIX}/deleteMultipleTask`
    return del(url,{tasks})
  },
  updateOneTask(para){
    let url = `${PREFIX}/updateOneTask`
    return put(url,para)
  },
  updateMultipleTask(tasks){
    let url = `${PREFIX}/updateMultipleTask`
    return put(url,{tasks})
  },
  getTaskList(){
    let url = `${PREFIX}/getTaskList`
    return get(url)
  }
}