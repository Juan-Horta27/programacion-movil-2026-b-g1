import { useState } from 'react';
import { IonButton, IonCard, IonCardContent } from '@ionic/react';
import './Saludo.css';

/**
 * Componente Saludo
 * Muestra un nombre y un botón que cambia el saludo al tocarlo.
 *
 * Semana 7 · Programación Móvil · CORHUILA
 */

// El tipo de las props: el nombre se recibe desde afuera.
interface SaludoProps {
  nombre: string;
}

const SALUDOS = [
  'Hola',
  'Bienvenido',
  'Qué tal',
  'Buenas'
];

const Saludo: React.FC<SaludoProps> = ({ nombre }) => {
  // useState guarda el estado del componente: al cambiarlo, React
  // vuelve a dibujar la pantalla solo.
  const [indice, setIndice] = useState(0);

  const cambiarSaludo = () => {
    setIndice((actual) => (actual + 1) % SALUDOS.length);
  };

  return (
    <IonCard className="saludo">
      <IonCardContent className="saludo__contenido">
        <p className="saludo__texto">
          {SALUDOS[indice]}, <strong>{nombre}</strong>
        </p>
        <IonButton expand="block" onClick={cambiarSaludo}>
          Cambiar saludo
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default Saludo;
