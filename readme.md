# Simple HTTP Server with file routing (For Educational Purposes)

This code provides a basic HTTP server and file routing implementation using Node.js. It is designed for educational purposes to help you better understand how Node.js works and how to create a simple server with file based routing.

## Getting Started

To get started with this code:

1. Ensure you have Node.js installed on your machine.
2. Clone this repository or create a new Node.js project.
3. Copy the provided code into your project directory.
4. Start the server by running the script.

## Usage

### File structure

```javascript
.
|-- src/                      // Source code directory
|   |-- pkg/                  // Package directory: Contains code for file-based routing and other methods
|   |-- app/                  // Application directory: Contains the main logic of our application
|       |-- index.ts          // Entry point of the application or central initialization file
|       |-- middleware/       // Middleware directory: Contains code for handling middleware
|           |-- middleware.ts // Middleware functions used in the application
|       |-- routes/           // Routes directory: Contains application routes
|           |-- index.ts      // Main route
|           |-- routename/    // Directory for a specific route
|               |-- route.ts  // Logic specific to a particular route


```

### 1. Define Routes

Routes are defined in separate files within the `src/app/routes` directory. Each route file should export a function that handles incoming requests.

```javascript

import { TRequest, TResponse } from '../../../pkg'

export function GET(req: TRequest, res: TResponse) {
    res.json({ msg: 'start route' })
}


```

### 2. Middleware

Middleware can be applied to intercept and process requests before they reach the route handler. Middleware functions are defined in the `middleware` directory, in middleware file you shoud export a function that handles incoming requests, and config object with dependency array.

```javascript

import { TRequest, TResponse } from 'src/pkg'

export function middleware(
    req: TRequest,
    res: TResponse,
    next: () => Promise<void>
) {
    console.log(
        `Hi there, I'm middleware and
        i will be executed only for route that defined in confige obj,
        if you leave confige empty I'll execute for every route in your application`
    )

    const currentPage = req.getCurrentPage()

    if (currentPage === 'start') {
        res.redirect('http://localhost:3000/params?id=1')
    } else {
        next()
    }
}

export const confige = {
    matcher: ['/start', '/'],
}

```

### 3. Handling Requests

The `handleRequest` module is responsible for processing incoming requests and routing them to the appropriate handler based on the requested URL.

```javascript
// you can get body using

const body = await req.body()

// and params

const params = req.getParams()
```

### 4. Sending Responses

The `sendJSON` and `sendHTML` modules provide utility functions for sending JSON and HTML responses, respectively.

```javascript
//send json

res.json(msg)

res.html('<div>html</div>')

// and you can specify statusCode

res.status(404).json({ msg })

// default status code is 200
```

### 5. Starting the Server

To start the server, call the `server()` function and specify the desired port number using the `start()` method.

```javascript
import { start } from '../pkg/index'
start(3000) // Example port number
```
