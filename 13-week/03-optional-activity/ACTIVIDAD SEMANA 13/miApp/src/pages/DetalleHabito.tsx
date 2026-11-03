import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonList,
  IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import { listarHabitos, Habito, SesionInvalidaError } from '../services/api';

/**
 * Pantalla de detalle de un hábito.
 * La API solo expone GET /habitos y POST /habitos, así que el hábito se busca
 * en la respuesta del GET usando el id que viene en la ruta.
 */

const DetalleHabito: React.FC = () => {
  // useParams entrega los parámetros de la ruta siempre como texto.
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [habito, setHabito] = useState<Habito | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listarHabitos()
      .then((lista) => setHabito(lista.find((h) => h.id === Number(id)) ?? null))
      .catch((e: Error) => {
        // 401: se vuelve al login con el mensaje; otro error se muestra aquí.
        if (e instanceof SesionInvalidaError) {
          navigate('/login', { replace: true, state: { aviso: e.message } });
        } else {
          setError(e.message);
        }
      });
  }, [id, navigate]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/habitos" />
          </IonButtons>
          <IonTitle>Detalle</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        {error && (
          <IonCard color="danger">
            <IonCardContent>
              <strong>Error:</strong> {error}
            </IonCardContent>
          </IonCard>
        )}

        {habito && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{habito.nombre}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="none">
                <IonItem>
                  <IonLabel>
                    <p>Categoría</p>
                    <h3>{habito.categoria}</h3>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <p>Meta</p>
                    <h3>{habito.meta}</h3>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

      </IonContent>
    </IonPage>
  );
};

export default DetalleHabito;
