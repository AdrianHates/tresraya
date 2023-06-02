import { useState } from 'react'
import confetti from 'canvas-confetti'

const TURNOS = {
  X: 'X',
  O: 'O'
}

const Cuadrado =  ( { children, isSelected, actualizarTablero, index } ) => {
  const className = `cuadrado ${isSelected ? 'selected' : ''}`

  const handleClick = () => {
    actualizarTablero(index)
  }
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}


const COMBOS_GANADORES = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [2,4,6],
  [0,3,6],
  [1,4,7],
  [2,5,8]
]

function App() {
  const [tablero, setTablero] = useState(Array(9).fill(null));
  const [turno, setTurno] = useState(TURNOS.X)
  const [ganador, setGanador] = useState(null)

  const reiniciarJuego = () => {
    setTablero(Array(9).fill(null))
    setTurno(TURNOS.X)
    setGanador(null)
  }

  const verificarFinalizarJuego = (newTablero) => {
    return newTablero.every((cuadrado) => cuadrado !== null) 
  }

  const verificarGanador = (tableroParaVerificar)=>{
    for (const combo of COMBOS_GANADORES) {
      const [a,b,c]=combo
      if(
        tableroParaVerificar[a] &&
        tableroParaVerificar[a] === tableroParaVerificar[b] &&
        tableroParaVerificar[a] === tableroParaVerificar[c]
        )
      {
        return tableroParaVerificar[a]
      }
    }
  }

  const actualizarTablero = (index) => {
    if(tablero[index] || ganador) return
    const newTablero = [...tablero]
    newTablero[index] = turno
    setTablero(newTablero)
    const newTurno = turno===TURNOS.X ? TURNOS.O : TURNOS.X
    setTurno(newTurno)
    //revisar ganador
    const nuevoGanador = verificarGanador(newTablero)
    if(nuevoGanador) {
      confetti()
      setGanador(nuevoGanador)
    } else if (verificarFinalizarJuego(newTablero)) {
      setGanador(false)
    }
  }

  return (
    <main className='tablero'>
      <h1>Tres en raya</h1>
      <button onClick={reiniciarJuego}>Reiniciar partida</button>
      <section className='juego'>
        {tablero.map((cuadrado,index)=>{
          return(
            <Cuadrado 
            key={index}
            index={index}
            actualizarTablero={actualizarTablero}
            >
              {cuadrado}
            </Cuadrado>
          )
        })}
      </section>
      <section className='turno'>
        <Cuadrado isSelected={turno===TURNOS.X}>{TURNOS.X}</Cuadrado>
        <Cuadrado isSelected={turno===TURNOS.O}>{TURNOS.O}</Cuadrado>
      </section>
      {
        ganador !== null && (
          <section className='ganador'>
            <div className='texto'>
              <h2>
                {
                  ganador === false ? 'Empate' : 'Ganó'
                }
              </h2>
              <header className='ganar'>
                {ganador && <Cuadrado>{ganador}</Cuadrado>}
              </header>
              <footer>
                <button onClick={reiniciarJuego}>Empezar de nuevo</button>
              </footer>
            </div>
          </section>
        )
      }
    </main>
  )
}

export default App
