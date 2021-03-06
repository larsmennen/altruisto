import React from "react"
import "./App.scss"
import { SnackbarProvider } from "notistack"
import { AuthProvider } from "./common/auth"
import Main from "./Main"

const App: React.FC = () => {
  return (
    <div className="app">
      <AuthProvider>
        <SnackbarProvider
          maxSnack={1}
          autoHideDuration={1500}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          <Main />
        </SnackbarProvider>
      </AuthProvider>
    </div>
  )
}

export default App
