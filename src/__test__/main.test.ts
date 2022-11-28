/**
 * @jest-environment jsdom
 */

import * as functions from "../ts/main";
import { IAddResponse } from "../ts/models/IAddResult";
import { Todo } from "../ts/models/Todo";


describe("createHtml", ()=> {
    test("should add text to ul-container", ()=> {
        document.body.innerHTML = `
        <ul id="todos" class="todo"></ul>`;
        let todos :Todo[] = [new Todo("hello", true), new Todo("world", false)];

        functions.createHtml(todos);

        expect(document.getElementById("todos")?.innerHTML).toMatch('<li class="todo__text--done todo__text">hello</li>');
        expect(document.getElementById("todos")?.innerHTML).toMatch('<li class="todo__text">world</li>');
    })

    test("should not add text to ul-container", ()=> {
        document.body.innerHTML = `
        <ul id="todos" class="todo"></ul>`;
        let todos :Todo[] = [];

        functions.createHtml(todos);

        expect(document.getElementById("todos")?.innerHTML).toBe("");
    })
})




describe("displayError", ()=> {
    test("should add text to container", ()=> {
        document.body.innerHTML = `
        <div id="error" class="error"></div>`;
        let error :string = "errortext";
        let show :boolean = true;
        
        functions.displayError(error, show);

        expect(document.getElementById("error")?.innerHTML).toBe("errortext");
    })

    test("should add class", ()=> {
        document.body.innerHTML = `
        <form id="newTodoForm">
        <div id="error" class="error"></div>
        </form>
        `;
        let error :string = "errortext";
        let show :boolean = true;

        functions.displayError(error, show);

        expect(document.getElementById("newTodoForm")?.innerHTML).toMatch("show");
    })

    test("should remove class", ()=> {
        document.body.innerHTML = `
        <form id="newTodoForm">
        <div id="error" class="error show"></div>
        </form>
        `;
        let error :string = "errortext";
        let show: boolean = false;

        functions.displayError(error, show);

        expect(document.getElementById("newTodoForm")?.innerHTML).not.toMatch("show");
    })
})



describe("addTodo", ()=> {
    test("should add object to list", ()=> {
        let todos :Todo[] = [];
        let text :string = "hello world";

        functions.addTodo(text, todos);

        expect(todos.length).toBe(1);
    })

    test("should not add object to list", ()=> {
        let todos :Todo[] = [];
        let text :string = "he";

        functions.addTodo(text, todos);

        expect(todos.length).toBe(0);
    })   

    test("should be truthy", ()=> {
        let todos :Todo[] = [];
        let text :string = "he"
        let results: IAddResponse = {success:true, error:"text"};
        let spy = jest.spyOn(functions,"addTodo").mockReturnValue(results);

        functions.addTodo(text, todos);

        expect(spy).toHaveReturned();

        spy.mockClear();
    })

    test("should be falsy", ()=> {
        let todos :Todo[] = [];
        let text :string = "hello world"
        let results: IAddResponse = {success:true, error:"text"};
        let spy = jest.spyOn(functions,"addTodo").mockReturnValue(results);

        functions.addTodo(text, todos);

        expect(spy).toHaveReturned();

        spy.mockClear();
    })
})


describe("changeTodo", ()=> {
    test("should be truthy", ()=> {
        let todo :Todo = new Todo("hello", false);

        functions.changeTodo(todo);

        expect(todo.done).toBe(true);
    })

    test("should be falsy", ()=> {
        let todo :Todo = new Todo("hello", true);

        functions.changeTodo(todo);

        expect(todo.done).toBe(false);
    })
})


describe("removeAllTodos", ()=> {
    test("should remove all objects in list", ()=> {
        let todos :Todo[] = [new Todo("hello", true), new Todo("world", false)];

        functions.removeAllTodos(todos);

        expect(todos.length).toBe(0);
    })
})


describe("clearTodos", ()=> {
    test("should call two functions with one parameter", ()=> {
        let spyA = jest.spyOn(functions,"removeAllTodos").mockReturnValue();
        let spyB = jest.spyOn(functions, "createHtml").mockReturnValue();
        let todos :Todo[] = [];

        functions.clearTodos(todos);

        expect(spyA).toHaveBeenCalledWith(todos);
        expect(spyA).toHaveBeenCalledTimes(1);
        expect(spyB).toHaveBeenCalledWith(todos);
        expect(spyB).toHaveBeenCalledTimes(1);

        spyA.mockReset();
        spyB.mockReset();
    })
})


describe("toggleTodo", ()=> {
    test("should call two functions", ()=> {
        let spyA = jest.spyOn(functions,"changeTodo").mockReturnValue();
        let spyB = jest.spyOn(functions, "createHtml").mockReturnValue();
        let todos :Todo[] = [];
        let todo :Todo = new Todo("hello", true);

        functions.toggleTodo(todo);

        expect(spyA).toHaveBeenCalledTimes(1);
        expect(spyA).toHaveBeenCalledWith(todo);
        expect(spyB).toHaveBeenCalledTimes(1);
        expect(spyB).toHaveBeenCalledWith(todos);

        spyA.mockReset();
        spyB.mockReset();
    })
})

describe("createNewTodo", ()=> {
    test("should call functions and be truthy", ()=> {
        document.body.innerHTML = `
        <ul id="todos" class="todo"></ul>`;
        let results: IAddResponse = {success:true, error:"text"};
        let text: string = "hello world";
        let todos :Todo[] = [new Todo("hello", true)];
        let spyA = jest.spyOn(functions, "addTodo").mockReturnValue(results);
        let spyB = jest.spyOn(functions, "createHtml").mockReturnValue();
        let spyC = jest.spyOn(functions, "displayError").mockReturnValue();

        functions.createNewTodo(text, todos);

        expect(spyA).toHaveBeenCalledTimes(1);
        expect(results.success).toBe(true);
        expect(spyB).toHaveBeenCalledTimes(1);
        expect(spyC).toHaveBeenCalledTimes(0);

        
        spyA.mockReset();
        spyB.mockReset();
        spyC.mockReset();
    })

    test("should call functions and be falsy", ()=> {
        document.body.innerHTML = `
        <ul id="todos" class="todo"></ul>`;
        let results: IAddResponse = {success:false, error:"text"};
        let text: string = "hello world";
        let todos :Todo[] = [new Todo("hello", true)];
        let spyA = jest.spyOn(functions, "addTodo").mockReturnValue(results);
        let spyB = jest.spyOn(functions, "createHtml").mockReturnValue();
        let spyC = jest.spyOn(functions, "displayError").mockReturnValue();

        functions.createNewTodo(text, todos);

        expect(spyA).toHaveBeenCalledTimes(1);
        expect(results.success).toBe(false);
        expect(spyB).toHaveBeenCalledTimes(0);
        expect(spyC).toHaveBeenCalledTimes(1);

        
        spyA.mockReset();
        spyB.mockReset();
        spyC.mockReset();
    })
})

describe ("sortTodos", ()=> {
    test("should sort list", ()=> {
        let todos :Todo[] = [new Todo("Bubbles", true), new Todo("Clean", false), new Todo("Acrobatics", true)];
        let todo1 :Todo = todos[0];
        let todo2 :Todo = todos[1];
        let todo3 :Todo = todos[2];

        functions.sortTodos(todos);

        expect(todos[0]).toBe(todo3);
        expect(todos[1]).toBe(todo1);
        expect(todos[2]).toBe(todo2);
    })
})