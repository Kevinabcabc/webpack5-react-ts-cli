import style from './index.scss'
import {add} from 'utils/index'

if (module && module.hot) {
  module.hot.accept();
}

console.log('add: ', add(1, 3));


console.log('home mounted');
const ele = document.querySelector('#home')
ele.innerHTML = 'home';

const newEle = document.createElement("div")
newEle.className = style.ele
newEle.innerHTML = '测试css module22222'
ele.appendChild(newEle)
