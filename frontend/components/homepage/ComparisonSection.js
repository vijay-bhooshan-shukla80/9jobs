import { Check, X } from "lucide-react";

const comparisonFeatures = [
  {
    feature: "ATS-Optimized Resume Tailoring",
    goingSolo: false,
    aiBots: false,
    nineJobs: true,
  },
  {
    feature: "FREE Custom Cover Letters",
    goingSolo: false,
    aiBots: true,
    nineJobs: true,
  },
  {
    feature: "Keyword Matching & Optimization",
    goingSolo: false,
    aiBots: false,
    nineJobs: true,
  },
  {
    feature: "Proof of Application",
    goingSolo: false,
    aiBots: false,
    nineJobs: true,
  },
  {
    feature: "Human Job Scouting",
    goingSolo: false,
    aiBots: false,
    nineJobs: true,
  },
  {
    feature: "Real Human Support",
    goingSolo: false,
    aiBots: false,
    nineJobs: true,
  },
];

export default function ComparisonSection() {
  return (
    <section className="fj-section fj-comparison-section">
      <div className="fj-container">
        {/* Section Header */}
        <div className="fj-section-head fj-comparison-head">
          <span className="fj-comparison-badge">The Honest Comparison</span>
          <h2>Why not just do it yourself?</h2>
          <p>
            You absolutely can. Most people do. But here&apos;s what they run into &mdash; and why they eventually come to us.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="fj-comparison-card">
          <div className="fj-comparison-table-wrapper">
            <table className="fj-comparison-table">
              <thead>
                <tr>
                  <th className="fj-comp-col-feature">Feature</th>
                  <th className="fj-comp-col-solo">Going Solo</th>
                  <th className="fj-comp-col-bots">AI Bots</th>
                  <th className="fj-comp-col-brand fj-comp-highlight">9Jobs</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((item, index) => (
                  <tr key={item.feature} className={index === comparisonFeatures.length - 1 ? "fj-comp-last-row" : ""}>
                    <td className="fj-comp-feature-title">{item.feature}</td>
                    <td className="fj-comp-cell-center">
                      {item.goingSolo ? (
                        <span className="fj-comp-icon fj-comp-icon--check" aria-label="Yes">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="fj-comp-icon fj-comp-icon--cross" aria-label="No">
                          <X size={14} strokeWidth={2.5} />
                        </span>
                      )}
                    </td>
                    <td className="fj-comp-cell-center">
                      {item.aiBots ? (
                        <span className="fj-comp-icon fj-comp-icon--check" aria-label="Yes">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="fj-comp-icon fj-comp-icon--cross" aria-label="No">
                          <X size={14} strokeWidth={2.5} />
                        </span>
                      )}
                    </td>
                    <td className="fj-comp-cell-center fj-comp-highlight">
                      {item.nineJobs ? (
                        <span className="fj-comp-icon fj-comp-icon--check" aria-label="Yes">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="fj-comp-icon fj-comp-icon--cross" aria-label="No">
                          <X size={14} strokeWidth={2.5} />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
