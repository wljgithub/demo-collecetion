from flask import  Flask,request,abort

app = Flask(__name__)

todos = []
success_response = {
    "code":0,
    "message":"ok"
}

@app.route('/')
def hello_world():
    return 'Hello,World!!!'

@app.route('/task/addTask',methods=['POST'])
def add_task():
    if not request.json or "name" not in request.json:
        abort(400)

    task_name = request.json["name"]
    todos.append({
        "task_id":calcId(),
        "completed":False,
        "task_name":task_name
    })
    return success_response

@app.route('/task/deleteOneTask',methods=['DELETE'])
def delete_one_task():
    if not request.json or 'task' not in request.json:
        abort(400)

    task_id = request.json["task"]
    for ele in todos:
       if 'task_id' in ele and ele["task_id"] == task_id:
           todos.remove(ele)
           return success_response

    return {"code":1,"message":"can't not find task id"}

@app.route("/task/deleteMultipleTask",methods=['DELETE'])
def delete_multiple_task():
    if not request.json or 'tasks' not in request.json:
        abort(400)

    task_ids = request.json["tasks"]
    global todos
    remain = todos[:]
    for ele in todos:
        for task_id in task_ids:
            if 'task_id' in ele and ele["task_id"] == task_id:
                remain.remove(ele)
                break

    todos = remain
    return success_response

@app.route("/task/updateOneTask",methods=['PUT'])
def update_one_task():
    if not request.json or "task_id" not in request.json:
        abort(400)

    task = request.json
    for index in range(len(todos)):
        if todos[index]["task_id"] == task["task_id"]:
            todos[index] = task
            return success_response

    return {"code":1,"message":"can not find task,invalid task id"}

@app.route("/task/updateMultipleTask",methods=['PUT'])
def update_multiple_task():

    if not request.json or "tasks" not in request.json:
        abort(400)

    tasks = request.json["tasks"]
    for index in range(len(todos)):
        for task in tasks:
            if todos[index]["task_id"] == task["task_id"]:
                todos[index] = task
    return success_response

@app.route("/task/getTaskList",methods=['GET'])
def get_task_list():

    return {
        "code":0,
        "message":"ok",
        "data":todos
    }

def calcId():
    return len(todos)+1

if __name__ == '__main__':
    app.run(debug=True,port="3001")