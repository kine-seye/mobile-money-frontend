import { useState, useEffect } from 'react';

const API_URL = 'https://mobile-money-comparator-api.onrender.com';

function App() {
  const [typeOperation, setTypeOperation] = useState('transfert');
  const [montant, setMontant] = useState('');
  const [resultats, setResultats] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  const comparer = async () => {
    if (!montant || montant <= 0) {
      setErreur("Entrez un montant valide");
      return;
    }
    setChargement(true);
    setErreur(null);
    try {
      const reponse = await fetch(
        `${API_URL}/comparer?type_operation=${typeOperation}&montant=${montant}`
      );
      if (!reponse.ok) throw new Error("Erreur de l'API");
      const donnees = await reponse.json();
      setResultats(donnees.resultats);
    } catch (e) {
      setErreur("Impossible de comparer pour le moment");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    if (montant && montant > 0) {
      comparer();
    }
  }, [typeOperation, montant]);

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '48px 24px' }}>
      <h1 className="display" style={{ fontSize: '2rem', marginBottom: '8px' }}>
        Le vrai coût de votre argent
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Comparez Wave, Orange Money et Yas en un instant.
      </p>

      <select
        value={typeOperation}
        onChange={(e) => setTypeOperation(e.target.value)}
        style={{ padding: '12px', width: '100%', marginBottom: '12px' }}
      >
        <option value="transfert">Transfert</option>
        <option value="retrait">Retrait</option>
        <option value="depot">Dépôt</option>
      </select>

      <input
        type="number"
        placeholder="Montant en FCFA"
        value={montant}
        onChange={(e) => setMontant(e.target.value)}
        style={{ padding: '12px', width: '100%', marginBottom: '12px' }}
      />

      {montant && (
        <p style={{ color: 'var(--text-secondary)', margin: '0 0 12px', fontSize: '0.9rem' }}>
          {Number(montant).toLocaleString('fr-FR')} FCFA
        </p>
      )}

      <button
        onClick={comparer}
        disabled={chargement}
        style={{
          padding: '12px 24px',
          background: 'var(--accent-gold)',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        {chargement ? 'Comparaison...' : 'Comparer'}
      </button>

      {erreur && <p style={{ color: 'salmon', marginTop: '16px' }}>{erreur}</p>}

      {resultats && (
        <div style={{ marginTop: '32px' }}>
          {resultats.map((r, i) => (
            <div key={r.operateur} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{r.operateur}</span>
                <span>{r.frais_total.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div
                style={{
                  height: '8px',
                  width: `${(r.frais_total / resultats[resultats.length - 1].frais_total) * 100}%`,
                  background: i === 0 ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  borderRadius: '4px',
                }}
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                dont {r.frais_operateur.toLocaleString('fr-FR')} FCFA frais {r.operateur} + {r.tta.toLocaleString('fr-FR')} FCFA taxe d'État
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
