const CHAPTERS = [
  { year: "1928", title: "Juhu Aerodrome opens", text: "A grass field at the edge of Bombay becomes the city's first aerodrome. One runway, 08/26, and a small hangar at its end." },
  { year: "1932", title: "The first commercial flight", text: "On 15 October, JRD Tata flies a de Havilland Puss Moth from Karachi to Juhu carrying a single mail pouch. Indian commercial aviation begins." },
  { year: "Today", title: "You wear that sky", text: "Three skies over Runway 08/26, at noon, at 6:47 PM and at 11 PM, each set into a dial. Three hundred numbered pieces, never repeated." },
];

export default function Story() {
  return (
    <section className="section story" aria-labelledby="story-title">
      <p className="eyebrow">The story</p>
      <h2 id="story-title" className="section-title">One runway. Three dates.</h2>
      <ol className="chapters">
        {CHAPTERS.map((c) => (
          <li key={c.year} className="chapter">
            <span className="chapter-year">{c.year}</span>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
