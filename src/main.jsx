import * as React from "react";
import './styles.css'
import * as ReactDOM from "react-dom/client";
import { Form } from "./Form";
import App from "./App";
import Room from "./room";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter ([
  {
    path:'/',
    element: <App />,
    
  },
  {
    path: '/login',
    element: <Form />
  },
  {
    path: '/AF1',
    element: <Room roomName={'AF1'}/>
  },
  {
    path: '/ET1',
    element: <Room roomName={'ET1'}/>
  },
  {
    path: '/CL1',
    element: <Room roomName={'CL1'}/>
  },
  {
    path: '/HR1',
    element: <Room roomName={'HR1'}/>
  },
  {
    path: '/AI1',
    element: <Room roomName={'AI1'}/>
  },
  {
    path: '/DI1',
    element: <Room roomName={'DI1'}/>
  } 
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);