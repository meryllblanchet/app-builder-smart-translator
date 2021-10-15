/* 
* <license header>
*/

import React, { useState } from 'react'
import { Provider, defaultTheme, Grid, View } from '@adobe/react-spectrum'
import ErrorBoundary from 'react-error-boundary'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import SideBar from './SideBar'
import TranslationForm from './TranslationForm'
import { Home } from './Home'
import { About } from './About'

function App (props) {
  console.log('runtime object:', props.runtime)
  console.log('runtime locale:', props.runtimeLocale)
  const [state, setState] = useState({
    runtimeLocale: props.runtimeLocale
  })

  // use exc runtime event handlers
  // respond to configuration change events (e.g. user switches org)
  props.runtime.on('configuration', ({ locale }) => {
    console.log('configuration change', { locale })
    setState({...state, runtimeLocale: locale})
  })

  return (
    <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
      <Router>
        <Provider theme={defaultTheme} colorScheme={`light`}>
          <Grid
            areas={['sidebar content']}
            columns={['256px', '3fr']}
            rows={['auto']}
            height='100vh'
            gap='size-100'
          >
            <View
              gridArea='sidebar'
              backgroundColor='gray-200'
              padding='size-200'
            >
              <SideBar></SideBar>
            </View>
            <View gridArea='content' padding='size-200'>
              <Switch>
                <Route exact path='/'>
                  <Home></Home>
                </Route>
                <Route path='/translation'>
                  <TranslationForm runtimeLocale={state.runtimeLocale}></TranslationForm>
                </Route>
                <Route path='/about'>
                  <About></About>
                </Route>
              </Switch>
            </View>
          </Grid>
        </Provider>
      </Router>
    </ErrorBoundary>
  )

  // Methods

  // error handler on UI rendering failure
  function onError (e, componentStack) { }

  // component to show if UI fails rendering
  function fallbackComponent ({ componentStack, error }) {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
          Something went wrong :(
        </h1>
        <pre>{componentStack + '\n' + error.message}</pre>
      </React.Fragment>
    )
  }
}

export default App
