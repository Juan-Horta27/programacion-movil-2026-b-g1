import { useState } from 'react';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem,
  IonLabel, IonList, IonListHeader, IonNote, IonPage, IonTitle, IonToolbar
} from '@ionic/react';

/**
 * Pantalla de práctica.
 * - IonList con los ejercicios de la sesión
 * - Contador de repeticiones con useState
 * - Navegación a la segunda página, llevándole el conteo
 */

// Los ejercicios no cambian, así que no son estado: son una constante.
const EJERCICIOS = [
  { id: 1, nombre: 'Calentamiento de manos', duracion: '5 min' },
  { id: 2, nombre: 'Rudimentos: golpe doble', duracion: '10 min' },
  { id: 3, nombre: 'Lectura a primera vista', duracion: '10 min' },
  { id: 4, nombre: 'Patrón de bolero', duracion: '15 min' },
  { id: 5, nombre: 'Repaso del repertorio', duracion: '10 min' }
];

const Practica: React.FC = () => {
  // useState devuelve el valor actual y la función para cambiarlo.
  const [repeticiones, setRepeticiones] = useState(0);

  // Se le pasa una función en lugar del valor: así React entrega
  // siempre el conteo más reciente y no uno leído de antes.
  const sumar = () => setRepeticiones((actual) => actual + 1);
  const restar = () => setRepeticiones((actual) => Math.max(0, actual - 1));
  const reiniciar = () => setRepeticiones(0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Práctica</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* ---------- Contador ---------- */}
        <div className="ion-text-center ion-margin-bottom">
          <p>Repeticiones completadas</p>
          <h1 style={{ fontSize: '56px', margin: '4px 0' }}>{repeticiones}</h1>

          <IonButton onClick={restar} disabled={repeticiones === 0}>−</IonButton>
          <IonButton onClick={sumar}>+</IonButton>
          <IonButton fill="clear" onClick={reiniciar}>Reiniciar</IonButton>
        </div>

        {/* ---------- Lista ---------- */}
        <IonList>
          <IonListHeader>
            <IonLabel>Ejercicios de hoy</IonLabel>
          </IonListHeader>

          {EJERCICIOS.map((ejercicio) => (
            // La key es el id del dato, nunca la posición: si la lista
            // se reordena, la posición apunta a otro elemento.
            <IonItem key={ejercicio.id}>
              <IonLabel>
                <h2>{ejercicio.nombre}</h2>
                <p>{ejercicio.duracion}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        {/* ---------- Navegación a la segunda página ---------- */}
        <IonButton
          expand="block"
          className="ion-margin-top"
          routerLink={`/resumen/${repeticiones}`}
        >
          Terminar y ver resumen
        </IonButton>

        <IonNote className="ion-text-center" style={{ display: 'block', marginTop: '10px' }}>
          El conteo viaja a la siguiente pantalla como parámetro de la ruta.
        </IonNote>

      </IonContent>
    </IonPage>
  );
};

export default Practica;
