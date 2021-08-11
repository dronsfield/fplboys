import React from "react"
import ReactDOM from "react-dom"
import App from "src/App"
import applyPolyfills from "./polyfills"

applyPolyfills()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)

// use this to get info about perf stats
// reportWebVitals()
