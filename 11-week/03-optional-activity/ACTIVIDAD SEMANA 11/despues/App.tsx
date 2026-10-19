// Navegación tipo stack: Biblioteca → Detalle, con botón atrás.
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import BibliotecaPage from './BibliotecaPage';
import PartituraPage from './PartituraPage';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/biblioteca" component={BibliotecaPage} />
        <Route exact path="/biblioteca/:id" component={PartituraPage} />
        <Redirect exact from="/" to="/biblioteca" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
