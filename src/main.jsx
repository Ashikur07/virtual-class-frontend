import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './components/Root/Root.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import AuthProvider from './AuthProvider/AuthProvider.jsx';
import ErrorPage from './components/ErrorPage/ErrorPage.jsx';
import Home from './components/Home/Home.jsx';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx';
import Profile from './components/Profile/Profile.jsx';
import FixedRoutine from './components/Routine/FixedRoutine.jsx';
import StudentDailyView from './components/Routine/StudentDailyView.jsx';
import TeacherDailyView from './components/Routine/TeacherDailyView.jsx';
import AddTask from './components/AddTask/AddTask.jsx';
import TaskList from './components/TaskList/TaskList.jsx';
import ViewSubmissions from './components/ViewSubmissions/ViewSubmissions.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,

    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/routine/fixedRoutine",
        element: <FixedRoutine />,
      },
      {
        path: "/routine/StudentDailyView",
        element: <PrivateRoute> <StudentDailyView /></PrivateRoute>,
      },
      {
        path: "/routine/TeacherDailyView",
        element: <PrivateRoute> <TeacherDailyView /> </PrivateRoute>,
      },
      {
        path: "/addTask",
        element: <PrivateRoute> <AddTask /> </PrivateRoute>,
      },
      {
        path: "/taskList",
        element: <PrivateRoute> <TaskList /> </PrivateRoute>,
      },
      {
        path: "/viewSubmissions",
        element: <PrivateRoute> <ViewSubmissions /> </PrivateRoute>,
      },
      {
        path: '/login',
        element: <Login></Login>,
      },
      {
        path: '/register',
        element: <Register></Register>,
      },
      {
        path: '/profile',
        element: <PrivateRoute><Profile></Profile></PrivateRoute>,
      },
 
    ]
  }     
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </>,
)