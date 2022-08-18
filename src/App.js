import './App.css';
import { useState } from 'react';
import Maps from './Components/Map/Maps'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Search from './Components/Search/Search';
import Navigation from './Components/Navigation/Navigation';
import Sidebar from './Components/Sidebar/Sidebar';



function App() {

  const [sidebarProp, setSideBarProp] = useState("search")
  const changeSidebarProps = (value) => {
    setSideBarProp(value)
  }


  return (
    <div className="App">
      <Maps sidebarProp={sidebarProp} changeSidebarProps={changeSidebarProps} />
      {/* <Sidebar /> */}

      {/* <BrowserRouter>
        <Routes>
          <Route path='/search' element={<Search />}></Route>
          <Route path='/navigation' element={<Navigation />}></Route>

        </Routes>
      </BrowserRouter> */}



    </div>
  );
}

export default App;
