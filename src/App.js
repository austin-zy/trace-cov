import React from 'react'
import 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import BLEPeripheral from "react-native-ble-peripheral";
import { Navigator } from '@routes'
import { store, persistor } from '@store'

const App = () => {
  // const serviceUUID = "7a1781c4-c373-44aa-8cd6-c0f7bc1c0673";
  // BLEPeripheral.addService(serviceUUID, true);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Navigator />
      </PersistGate>
    </Provider>
  )
}

export default App
