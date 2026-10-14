import { useEffect, useState } from 'react'
import './App.css'

const JOKE_API_URL = 'https://official-joke-api.appspot.com/random_joke'

async function requestJoke() {
  const response = await fetch(JOKE_API_URL)

  if (!response.ok) {
    throw new Error(`The joke service responded with status ${response.status}.`)
  }

  const data = await response.json()

  if (!data || typeof data.setup !== 'string' || typeof data.punchline !== 'string') {
    throw new Error('The joke service returned an unexpected response.')
  }

  return data
}

function errorMessage(error) {
  return error instanceof Error
    ? error.message
    : 'Something went wrong while fetching a joke.'
}

function App() {
  const [joke, setJoke] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  function getJoke() {
    setIsLoading(true)
    setError('')

    requestJoke().then(
      (data) => {
        setJoke(data)
        setIsLoading(false)
      },
      (fetchError) => {
        setError(errorMessage(fetchError))
        setJoke(null)
        setIsLoading(false)
      },
    )
  }

  useEffect(() => {
    let isActive = true

    requestJoke().then(
      (data) => {
        if (isActive) {
          setJoke(data)
          setIsLoading(false)
        }
      },
      (fetchError) => {
        if (isActive) {
          setError(errorMessage(fetchError))
          setIsLoading(false)
        }
      },
    )

    return () => {
      isActive = false
    }
  }, [])

  return (
    <main className="page">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Funny Thing">
          Funny Thing
        </a>
      </header>

      <section className="joke-card" aria-labelledby="page-title">
        <div className="card-topline">
          <span className="eyebrow"><span aria-hidden="true"></span> YOUR DAILY DOSE OF FUN</span>
          <span className="sparkle" aria-hidden="true"></span>
        </div>

        <h1 id="page-title">Need a laugh?</h1>

        <div className="joke-content" aria-live="polite" aria-busy={isLoading}>
          {isLoading ? (
            <div className="message-state">
              <span className="loader" aria-hidden="true" />
              <p>Finding a good one...</p>
            </div>
          ) : error ? (
            <div className="message-state error-state" role="alert">
              <span className="error-icon" aria-hidden="true">!</span>
              <p>{error}</p>
            </div>
          ) : joke ? (
            <div className="joke">
              <div className="punchline-wrap">
                <span className="joke-label">THE PUNCHLINE</span>
                <p className="punchline">{joke.punchline}</p>
              </div>
              {joke.type && <span className="joke-type">{joke.type} joke</span>}
            </div>
          ) : null}
        </div>

        <button className="another-button" type="button" onClick={getJoke} disabled={isLoading}>
          {error ? 'Try again' : 'Tell me another'}
        </button>

      </section>

      <footer className="site-footer">
        <span aria-hidden="true"></span>
      </footer>
    </main>
  )
}

export default App


