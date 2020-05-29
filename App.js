/**
 * PurchaseBeat React Native App
 * https://github.com/G33N/PurchaseBeats.git
 *
 * @format
 * @flow
 */

import React from 'react';
import { createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux'
import { configureStore } from './src/store'

import { MainRouter } from './src/routes/MainRouter'

const AppContainer = createAppContainer(MainRouter);
const store = configureStore();

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    console.disableYellowBox = true;
  }

  componentWillUnmount() {
  }

  render() {
    return( 
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}