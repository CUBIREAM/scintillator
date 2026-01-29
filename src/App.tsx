import { Route, Switch } from 'wouter'
import { About } from './components/pages/about'
import { Home } from './components/pages/home'

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route>404 Not Found</Route>
    </Switch>
  )
}

export default App
