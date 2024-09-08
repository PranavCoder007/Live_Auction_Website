import { useEffect, useState ,createContext} from "react";
import {BrowserRouter, createBrowserRouter , RouterProvider ,Routes, Route} from "react-router-dom";
import Home from './pages/Hompage'
import Afterlogin from './pages/Afterlogin'
import Form from './pages/Forms'
import Search from './pages/Search'
import Login from './pages/Login'
import Auction from './pages/Auction'
import List from './pages/List'
import Bidder from './pages/Bidder'
import {HashLink as Link} from "react-router-hash-link";
const router = createBrowserRouter(
  [
    {
      path: '/' ,
      element: <Home/>
    },
    {
      path:'/Login',
      element:<Login/>
    },
    {
        path:'/Afterlogin',
        element:<Afterlogin/>
    },
    {
      path:'/Search',
      element:<Search/>
    },
    {
      path:'/Auction/:_id',
      element:<Auction/>
    },
    {
      path:'/Bidder/:_id',
      element:<Bidder/>
    },
    
    {
      path:'/Forms',
      element:<Form/>
    },
    {
      path:'/List',
      element:<List/>
    },
  ]
)

const FirstNameContext = createContext();
const App = () => {
  const [firstName,setFirstName] =useState("");
  const [roomCode,setRoomCode] = useState("");
  return (
    <FirstNameContext.Provider value={{ firstName,setFirstName,roomCode,setRoomCode}}>
      <RouterProvider router={router}/>
    </FirstNameContext.Provider> 
  )
}
export {FirstNameContext}
export default App