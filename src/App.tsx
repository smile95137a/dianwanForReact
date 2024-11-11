import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import GlobalRoutes from './routes/GlobalRoutes';
import { Provider } from 'react-redux';
import store from './store';
const App: FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <GlobalRoutes />
    </BrowserRouter>
  </Provider>
);

export default App;
