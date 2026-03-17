import config from "../data/siteConfig";
import { flagUrl } from "./Globe";

function Ticker() {
  const { languages } = config;
  // Double the array so the infinite scroll is seamless
  const items = [...languages, ...languages];

  return (
    <section className="ticker-section">
      <div className="ticker-row">
        {items.map((l, i) => (
          <div className="ticker-item" key={i}>
            <img className="flag-img" src={flagUrl(l.flagCode)} alt={l.name} />
            <span className="lang-name">{l.name}</span>
            <span className="ticker-dot" />
          </div>
        ))}
      </div>
      <div className="ticker-row-2">
        {[...items].reverse().map((l, i) => (
          <div className="ticker-item" key={i}>
            <img className="flag-img" src={flagUrl(l.flagCode)} alt={l.name} />
            <span className="lang-name">{l.name}</span>
            <span className="ticker-dot" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Ticker;
