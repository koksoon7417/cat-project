
import { store } from './app/store';
import { Provider } from 'react-redux';

import { Breeds } from './components/breeds/Breeds';

const App = () => {
  return (
    <Provider store={store}>
        <Breeds />
    </Provider>
  );
};

export default App;
