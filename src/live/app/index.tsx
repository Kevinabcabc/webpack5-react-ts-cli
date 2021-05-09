import React from 'react'
import style from './index.scss'
import Test from 'components/Test'

const App:React.FC<any> = () => {
  return (
    <div className={style.app}>
      <Test name='jack' age={24}/>
    </div>
  )
}

export default App
