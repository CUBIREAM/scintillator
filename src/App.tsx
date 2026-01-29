import { Route, Switch } from 'wouter'
import { About } from './components/pages/about'
import { DiffDetail } from './components/pages/diffs/detail'
import { DiffsList } from './components/pages/diffs/list'
import { Home } from './components/pages/home'

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/diffs" component={DiffsList} />
      <Route path="/diffs/:hash" component={DiffDetail} />
      <Route>404 Not Found</Route>
    </Switch>
  )
}

export default App
