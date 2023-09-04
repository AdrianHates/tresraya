import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

const TURNOS = {
  X: 'X',
  O: 'O'
}

const Cuadrado =  ( { children, isSelected, actualizarTablero, index, data } ) => {
  const className = `cuadrado ${isSelected ? 'selected' : ''}`

  const handleClick = () => {
    actualizarTablero(index)
  }
  return (
    <div onClick={handleClick} className={className} data={data} >
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
  const [inicio, setInicio] = useState(true)
  
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
    
    switch (turno) {
      case TURNOS.X:
        newTablero[index] = turno
        break
      case TURNOS.O: {
        const filtrarIndices = []
        newTablero.forEach( (unidad,index) => {
          if(unidad === null) {
            filtrarIndices.push(index)
          }
        })
        const indiceAleatorio = Math.floor(Math.random()*filtrarIndices.length)
        newTablero[filtrarIndices[indiceAleatorio]] = turno
      }
    }
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

  function Computer () {
    actualizarTablero()
  }

  function jugarTresRaya() {
    setInicio(false)
  }
  useEffect(() => {
    if(turno === TURNOS.O && !tablero.every(x=>x===null)) {
      setTimeout(() => {
        Computer()
      }, 2000);
      
    }
  }, [turno])
  return (
    <>{inicio?(<button className='juega-ahora' onClick={jugarTresRaya}>Juega Ahora</button>):
    
    <main className='tablero'>
      <h1>Tres en raya</h1>
      <button onClick={reiniciarJuego}>Reiniciar partida</button>
      <div className='contenedor'>
        <div>
          <div>
            <Cuadrado isSelected={turno===TURNOS.X} data={turno===TURNOS.X?'You Turn':''}>{TURNOS.X}</Cuadrado>
            
            <div>Player 1</div>
          </div>
        </div>
        <section className='juego'>
          {tablero.map((cuadrado,index)=>{
            return(
              <Cuadrado 
              key={index}
              index={index}
              actualizarTablero={turno===TURNOS.X?actualizarTablero:()=>{}}
              >
                {cuadrado}
              </Cuadrado>
            )
          })}
        </section>
        <div>
          <div>
            <Cuadrado isSelected={turno===TURNOS.O} data={turno===TURNOS.O?'Thinking':''}>{TURNOS.O}</Cuadrado>
            <div>Computer</div>
          </div>
          
        </div>
      </div>
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
    
  
    }</>
  )
}

export default App
