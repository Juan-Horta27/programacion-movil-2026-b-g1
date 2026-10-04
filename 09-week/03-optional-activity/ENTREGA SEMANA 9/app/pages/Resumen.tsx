import { useParams } from 'react-router-dom';
import {
  IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar
} from '@ionic/react';

/**
 * Segunda página: lee el conteo desde la ruta /resumen/:repeticiones.
 */
const Resumen: React.FC = () => {
  // useParams entrega los parámetros de la ruta siempre como texto.
  const { repeticiones } = useParams<{ repeticiones: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/practica" />
          </IonButtons>
          <IonTitle>Resumen</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding ion-text-center">
        <p>Repeticiones de la sesión</p>
        <h1>{repeticiones}</h1>
      </IonContent>
    </IonPage>
  );
};

export default Resumen;
