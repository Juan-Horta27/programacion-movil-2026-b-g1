// ANTES del rediseño: así estaba la Biblioteca.
// Se deja como referencia para comparar; los problemas están en el README.
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { cargarPartituras, type Partitura } from '../partituras';

const BibliotecaAntes: React.FC = () => {
  const [partituras, setPartituras] = useState<Partitura[]>([]);

  useEffect(() => {
    cargarPartituras().then(setPartituras);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ScoreSound</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>
          <IonButton size="small" fill="outline">Cargar PDF</IonButton>
          <IonButton size="small" fill="outline">Escuchar</IonButton>
          <IonButton size="small" fill="outline">Metrónomo</IonButton>
          <IonButton size="small" fill="outline">Compartir</IonButton>
          <IonButton size="small" fill="outline">Borrar todo</IonButton>
        </div>
        {partituras.map((partitura) => (
          <div key={partitura.id} style={{ color: '#b5b5b5', fontSize: '11px', padding: '2px 8px' }}>
            {partitura.titulo} - {partitura.compositor}
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default BibliotecaAntes;
