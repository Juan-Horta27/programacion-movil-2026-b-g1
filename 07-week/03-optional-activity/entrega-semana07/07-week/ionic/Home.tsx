import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import Saludo from '../components/Saludo';
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

        <Saludo nombre="Juan José" />

        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
