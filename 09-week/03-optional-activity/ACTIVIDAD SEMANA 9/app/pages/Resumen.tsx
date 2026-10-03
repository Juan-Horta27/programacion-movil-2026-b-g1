import { useParams } from 'react-router-dom';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader,
  IonPage, IonTitle, IonToolbar
} from '@ionic/react';

/**
 * Segunda pantalla.
 * Lee el conteo desde la ruta /resumen/:repeticiones con useParams.
 */

const Resumen: React.FC = () => {
  // useParams devuelve los parámetros de la ruta, siempre como texto:
  // /resumen/7 entrega "7", no 7. Por eso hay que convertirlo.
  const { repeticiones } = useParams<{ repeticiones: string }>();
  const total = Number(repeticiones) || 0;

  const mensaje =
    total === 0 ? 'No registraste repeticiones esta vez.'
      : total < 5 ? 'Buen comienzo. Mañana puedes subir un poco.'
        : total < 15 ? 'Buena sesión, mantén ese ritmo.'
          : 'Sesión larga. Recuerda descansar las manos.';

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
        <p className="ion-margin-top">Repeticiones de la sesión</p>
        <h1 style={{ fontSize: '72px', margin: '8px 0' }}>{total}</h1>
        <p>{mensaje}</p>

        <IonButton expand="block" className="ion-margin-top" routerLink="/practica">
          Practicar de nuevo
        </IonButton>

        <IonButton expand="block" fill="outline" routerLink="/home">
          Volver al inicio
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Resumen;
