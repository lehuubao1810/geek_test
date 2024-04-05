import { useState } from 'react'
import './App.css'
import SelectMenu from './components/SelectMenu'
import List from './components/ListItem'

function App() {


  return (
    <div className="flex flex-col p-5">
      <SelectMenu />
      {/* <List /> */}
    </div>
  )
}

export default App
