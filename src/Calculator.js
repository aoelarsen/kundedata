import React, { useState, useEffect, useCallback } from 'react';

function Calculator() {
  const [kostPris, setKostPris] = useState('');
  const [salgsPris, setSalgsPris] = useState('');
  const [rabatt, setRabatt] = useState('');
  const [butikk, setButikk] = useState('Slemmestad');
  const [resultat, setResultat] = useState({});
  const [leie, setLeie] = useState(6.5);
  const [kalkyleProsent, setKalkyleProsent] = useState('');

  const kalkyle = useCallback(() => {
    const betaltDesimal = 1 - (rabatt || 0) / 100;
    const etterRabatt = Math.round(salgsPris * betaltDesimal);
    const mva = etterRabatt * 0.2;
    const prisEtterMva = etterRabatt - mva;
    const dekningsbidragKr = Math.round(prisEtterMva - kostPris);
    const dekningsbidragProsent = ((dekningsbidragKr / prisEtterMva) * 100).toFixed(1);
    const husleieKost = Math.round(prisEtterMva * (leie / 100));
    const dbEtterHusleie = Math.round(dekningsbidragKr - husleieKost);

    setResultat({
      etterRabatt,
      dekningsbidragKr,
      dekningsbidragProsent,
      husleieKost,
      dbEtterHusleie,
    });

    if (kalkyleProsent) {
      const kalkyleDesimal = kalkyleProsent / 100;
      const prisExMva = kostPris / (1 - kalkyleDesimal);
      const kalkylePris = Math.round(prisExMva * 1.25);

      const beregnetRabatt = ((salgsPris - kalkylePris) / salgsPris) * 100;
      setRabatt(beregnetRabatt.toFixed(1));
    }
  }, [kostPris, salgsPris, rabatt, leie, kalkyleProsent]);

  useEffect(() => {
    kalkyle();
  }, [kostPris, salgsPris, rabatt, butikk, kalkyle]);

  const handleKalkyleChange = (e) => {
    setKalkyleProsent(e.target.value);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Kalkylekalkulator oppdatert</h2>
      <p className="text-lg mb-6 text-gray-600">
        Regn ut kalkyle og dekningsbidrag på varer ved å legge inn kostpris og salgspris i
        skjemaet under.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="insertKostPris" className="block text-sm font-medium text-gray-700">Innkjøpspris (ex. mva):</label>
          <input
            type="text"
            id="insertKostPris"
            value={kostPris}
            onChange={(e) => setKostPris(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="insertSalgsPris" className="block text-sm font-medium text-gray-700">Veiledende pris:</label>
          <input
            type="text"
            id="insertSalgsPris"
            value={salgsPris}
            onChange={(e) => setSalgsPris(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="insertRabatt" className="block text-sm font-medium text-gray-700">Rabatt (%):</label>
          <input
            id="insertRabatt"
            value={rabatt}
            onChange={(e) => setRabatt(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="insertKalkyleProsent" className="block text-sm font-medium text-gray-700">Salgskalkyle (%):</label>
          <input
            id="insertKalkyleProsent"
            value={kalkyleProsent}
            onChange={handleKalkyleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <div className="flex items-center">
          <input
            type="radio"
            id="insertSlemmestad"
            name="radioButikk"
            value="Slemmestad"
            checked={butikk === 'Slemmestad'}
            onChange={() => {
              setButikk('Slemmestad');
              setLeie(6.5);
            }}
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
          />
          <label htmlFor="Slemmestad" className="ml-2 block text-sm font-medium text-gray-700">Slemmestad</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="insertRoyken"
            name="radioButikk"
            value="Røyken"
            checked={butikk === 'Røyken'}
            onChange={() => {
              setButikk('Røyken');
              
              setLeie(5);
            }}
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
          />
          <label htmlFor="Royken" className="ml-2 block text-sm font-medium text-gray-700">Røyken</label>
        </div>
      </div>

      <div id="headingButikk" className="mt-8">
        <p className="text-lg font-semibold text-gray-800">
          KALKYLEUTREGNING for Sport1 {butikk}
        </p>
      </div>

      <table className="w-full mt-4 border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-gray-700">
              Salgskalkylen er {resultat.dekningsbidragProsent}%
            </th>
          </tr>
        </thead>
      </table>

      <div id="results" className="mt-6">
        <p className="text-gray-700"><strong>Totalpris:</strong> {resultat.etterRabatt},-</p>
        <p className="text-gray-700"><strong>DB kroner:</strong> {resultat.dekningsbidragKr},-</p>
        <p className="text-gray-700"><strong>Husleie utgjør:</strong> {resultat.husleieKost},-</p>
        <p className="text-gray-700"><strong>DB kroner etter husleie:</strong> {resultat.dbEtterHusleie},-</p>
      </div>
    </div>
  );
}

export default Calculator;
