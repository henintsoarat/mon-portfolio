import React, { useMemo, useState } from "react";

export default function LifeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [lifeExpectancy, setLifeExpectancy] = useState("");

  const stats = useMemo(() => {
    if (!birthDate || lifeExpectancy === "") return null;

    const birth = new Date(birthDate);
    const today = new Date();

    if (Number.isNaN(birth.getTime()) || birth > today) {
      return null;
    }

    const oneDay = 1000 * 60 * 60 * 24;
    const yearsLived = Math.floor((today.getTime() - birth.getTime()) / oneDay) / 365.25;

    if (Number(lifeExpectancy) <= yearsLived) return null;

    const daysLived = Math.floor((today.getTime() - birth.getTime()) / oneDay);
    const totalDaysExpected = Math.floor(Number(lifeExpectancy) * 365.25);
    const remainingDays = Math.max(0, totalDaysExpected - daysLived);
    const progress = Math.min(100, Math.max(0, (daysLived / totalDaysExpected) * 100));

    const deathYear = birth.getFullYear() + Number(lifeExpectancy);

    return {
      daysLived,
      remainingDays,
      totalDaysExpected,
      progress,
      yearsLived: yearsLived.toFixed(1),
      deathYear,
    };
  }, [birthDate, lifeExpectancy]);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            ⏳ Calculateur de Vie
          </h1>

          <p className="text-slate-400 text-lg">
            Découvrez combien de jours vous avez déjà vécus
            et visualisez votre progression de vie.
          </p>
        </div>

        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">
                Date de naissance
              </label>

              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Espérance de vie (années)
              </label>

              <input
                type="number"
                min="1"
                max="150"
                value={lifeExpectancy}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setLifeExpectancy("");
                  } else {
                    setLifeExpectancy(Number(val));
                  }
                }}
                placeholder="Ex: 85"
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
              />
            </div>
          </div>
        </div>

          {birthDate && lifeExpectancy !== "" && !stats && (
            <p className="mt-6 text-red-400 text-sm text-center">
              ⚠️ L'espérance de vie doit être strictement supérieure à votre âge actuel.
            </p>
          )}

        {stats && (
          <div className="mt-10 space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-slate-400 mb-2">
                  Jours vécus
                </h3>

                <p className="text-4xl font-bold">
                  {stats.daysLived.toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-slate-400 mb-2">
                  Jours restants
                </h3>

                <p className="text-4xl font-bold">
                  {stats.remainingDays.toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-slate-400 mb-2">
                  Âge actuel
                </h3>
                <p className="text-4xl font-bold">
                  {stats.yearsLived} ans
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-slate-400 mb-2">
                  Année estimée
                </h3>
                <p className="text-4xl font-bold">
                  {stats.deathYear}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <div className="flex justify-between mb-4">
                <span>Progression de vie</span>
                <span>
                  {stats.progress.toFixed(1)}%
                </span>
              </div>

              <div className="w-full h-6 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-6 bg-white transition-all duration-700"
                  style={{
                    width: `${stats.progress}%`,
                  }}
                />
              </div>

              <p className="mt-6 text-slate-400">
                Basé sur une espérance de vie de{" "}
                {lifeExpectancy} ans.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}