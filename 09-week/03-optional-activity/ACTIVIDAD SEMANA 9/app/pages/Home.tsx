import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ListaPartituras from '../components/ListaPartituras';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ScoreSound</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">ScoreSound</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonButton expand="block" className="ion-margin" routerLink="/practica">
          Iniciar práctica
        </IonButton>

        <ListaPartituras />

      </IonContent>
    </IonPage>
  );
};

export default Home;
