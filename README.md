# nwoork-repository

Introducción: Este proyecto es una aplicación para gestionar tareas, consta de dos partes, el frontend realizado en VueJs, donde el usuario podra dar de alta nuevas tareas y categorias.
- Prerrequisitos: Tener instalado NodeJs v > 14.8 y tener PostgresSQL
- Instalación: 
 Instalar los modulos en la api con el comando:
```sh
npm install --force
```
Y en el frontend
```sh
npm install
```

Crear archivos de las variables de entorno ".env" en la api y frontend

.env -> api
```sh
PORT=3000
DB_USERNAME='postgres'
DB_PASSWORD='Colima2024'
DB_HOST='localhost'
DB_NAME='nwoork'
DB_PORT=5432
```

.env -> frontend
```sh
VITE_BACKEND_URL=http://localhost:3000
```
 
- Configuración de la Base de Datos:
En la api/db se encuentra una copia de la BD con registros de usuario, status, prioridad, etc. puede usarse para importarla o sino tendra que crear la bd nwoork, insertar un registro en la tabla "users, categories, priorities, statuses" para que con esto la aplicación tome un punto de partida

- Ejecución:
En la api y el front se ejecutan con el comando por separado.
```sh
npm run dev
```
- Endpoints Disponibles: 
```sh
/tasks -> [GET/POST/PUT/DELETE]
/categories -> [GET/POST/PUT/DELETE]
/users -> [GET]
/statuses -> [GET]
/priorities -> [GET]
```
- Uso: Ejemplos de cómo interactuar con la aplicación desde el frontend.