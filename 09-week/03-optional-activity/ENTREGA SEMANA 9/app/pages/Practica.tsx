import { useEffect, useState } from 'react';
import {
  IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList,
  IonListHeader, IonPage, IonTitle, IonToolbar
} from '@ionic/react';

interface Partitura {
  id: number;
  titulo: string;
  instrumento: string;
  compases: number;
}

const Practica: React.FC = () => {
  const [partituras, setPartituras] = useState<Partitura[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [repeticiones, setRepeticiones] = useState(0);

  // La lista se carga con fetch desde la API de la semana 8.
  useEffect(() => {
    fetch('http://localhost:3000/partituras')
      .then((resp) => {
        if (!resp.ok) throw new Error();
        return resp.json();
      })
      .then(setPartituras)
      .catch(() => setError('No se pudo cargar la lista. ¿Está encendida la API?'));
  }, []);

  // Contador: se pasa una función para recibir siempre el valor más reciente.
  const sumar = () => setRepeticiones((actual) => actual + 1);
  const restar = () => setRepeticiones((actual) => Math.max(0, actual - 1));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Práctica</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <div className="ion-text-center">
          <p>Repeticiones completadas</p>
          <h1>{repeticiones}</h1>
          <IonButton onClick={restar}>−</IonButton>
          <IonButton onClick={sumar}>+</IonButton>
        </div>

        {error && <p className="ion-text-center">{error}</p>}

        <IonList>
          <IonListHeader>
            <IonLabel>Partituras para practicar</IonLabel>
          </IonListHeader>
          {partituras.map((p) => (
            // La key es el id del dato, no la posición en la lista.
            <IonItem key={p.id}>
              <IonLabel>
                <h2>{p.titulo}</h2>
                <p>{p.instrumento} · {p.compases} compases</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        {/* Navega a la segunda página llevando el conteo en la ruta. */}
        <IonButton expand="block" routerLink={`/resumen/${repeticiones}`}>
          Terminar y ver resumen
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Practica;
