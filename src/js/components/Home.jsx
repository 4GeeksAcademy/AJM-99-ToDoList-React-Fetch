import React from "react";
import "../../styles/index.css";
import {useState, useEffect} from "react"

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

const Home = () => {
	const [toDos, setToDos] = useState([])
	const newToDo = {
		"label":"",
		"is_done": false
	}

	const createUser = async () => {
		const response = await fetch('https://playground.4geeks.com/todo/users/amoreno', {
			method: "POST",
		})
		if (!response.ok){
			console.log("Error al crear el usuario")
			return
		}else{
			getToDos();
		}
		
	}

	const getToDos = async () => {
		const response = await fetch('https://playground.4geeks.com/todo/users/amoreno')
		const data = await response.json()
		if (!response.ok){
			console.log("Error cargando lista de tareas, el usuario no existe. Procediendo a crearlo")
			createUser()
			return
		}
		console.log(response)
		console.log(data)
		setToDos(data.todos)
	}

	useEffect (() => {
		getToDos()
	}, [])

	const addNewToDo = (value) => {
		newToDo.label = value;
		fetch('https://playground.4geeks.com/todo/todos/amoreno', {
		method: "POST",
		body: JSON.stringify(newToDo),
		headers: {
			"Content-Type": "application/json"
		}
		})
		.then(resp => {
			console.log(resp.ok); // Será true si la respuesta es exitosa
			console.log(resp.status); // El código de estado 201, 300, 400, etc.
			return resp.json(); // Intentará parsear el resultado a JSON y retornará una promesa donde puedes usar .then para seguir con la lógica
		})
		.then(data => {
			// Aquí es donde debe comenzar tu código después de que finalice la búsqueda
			console.log(data); // Esto imprimirá en la consola el objeto exacto recibido del servidor
			setToDos([...toDos, data]);
		})
		.catch(error => {
			// Manejo de errores
			console.log(error);
		});
	}
	
	const deleteToDo = (id) => {
		setToDos(toDos.filter((t) => t.id != id))
		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
		method: "DELETE",
		body: JSON.stringify(newToDo),
		headers: {
			"Content-Type": "application/json"
		}
		})
		.then(resp => {
			console.log(resp.ok); // Será true si la respuesta es exitosa
			console.log(resp.status); // El código de estado 201, 300, 400, etc.
		})
		.catch(error => {
			// Manejo de errores
			console.log(error);
		});

	}

	return (
		<div className="text-center">
            <div className="d-flex align-items-center justify-content-center flex-column my-5">
				<h1 className="title">todos</h1>
				<div className="d-flex align-items-center justify-content-center flex-column mt-3 cards">
					<input type="text" className="my-2 w-100 inputToDo" placeholder="What needs to be done?" onKeyDown={(e) => {if (e.key === "Enter") {addNewToDo(e.target.value); e.target.value = ""} }}></input>
					<ul className="flex-column p-2 w-100 justify-content-center d-flex">
						{(toDos.length > 0) ? (toDos.map((toDo) => (
						<li key={toDo.id} className="w-100 d-flex justify-content-between toDosDiv p-2">
								<span>{toDo.label}</span>
								<button className="deleteBtn" onClick={() => deleteToDo(toDo.id)}>X</button>
						</li>
						))) : (
							<li className="w-100 d-flex justify-content-between sinToDos p-2">
								<span> No hay tareas en tu lista, añade alguna nueva</span>
							</li>
						)}

					</ul>
				</div>
			</div>
		</div>
	);
};

export default Home;