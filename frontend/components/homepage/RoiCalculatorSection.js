"use client";

import { useState } from "react";
import { ArrowRight, Clock3, BadgePercent, FileText, Brain } from "lucide-react";
import { CalendlyLink } from "../CalendlyWidget";

export default function RoiCalculatorSection() {
  const [hourlyRate, setHourlyRate] = useState(45);
  const [timePerApp, setTimePerApp] = useState(10);
  const [appsPerMonth, setAppsPerMonth] = useState(90);

  // Dynamic calculations
  const hoursSaved = Math.round((appsPerMonth * timePerApp) / 60);
  const dollarsSaved = Math.round(hoursSaved * hourlyRate);

  // Range percentage helper for slider fill track
  const getTrackStyle = (val, min, max) => {
    const pct = ((val - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, #65a30d 0%, #74c414 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`,
    };
  };

  return (
    <section className="fj-section fj-roi-section">
      <div className="fj-container">
        {/* Header */}
        <div className="fj-section-head fj-roi-head">
          <h2>
            Calculate Your <span className="heading-mark">Return on Investment</span>
          </h2>
          <p>See how much time and money you&apos;ll save by letting us handle your job applications.</p>
        </div>

        {/* 2-Column Calculator Box */}
        <div className="fj-roi-calculator-box">
          {/* Sliders on Left */}
          <div className="fj-roi-sliders-col">
            {/* Slider 1: Hourly rate */}
            <div className="fj-roi-slider-card">
              <div className="fj-roi-slider-header">
                <span className="fj-roi-slider-label">What&apos;s your time worth?</span>
                <span className="fj-roi-slider-val">
                  ${hourlyRate} <small>/hr</small>
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={150}
                step={5}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="fj-roi-range"
                style={getTrackStyle(hourlyRate, 15, 150)}
                aria-label="What is your time worth per hour"
              />
              <div className="fj-roi-slider-bounds">
                <span>$15/hr</span>
                <span>$150/hr</span>
              </div>
            </div>

            {/* Slider 2: Time per application */}
            <div className="fj-roi-slider-card">
              <div className="fj-roi-slider-header">
                <span className="fj-roi-slider-label">Time per application</span>
                <span className="fj-roi-slider-val">
                  {timePerApp} <small>min</small>
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={timePerApp}
                onChange={(e) => setTimePerApp(Number(e.target.value))}
                className="fj-roi-range"
                style={getTrackStyle(timePerApp, 5, 30)}
                aria-label="Time spent per job application"
              />
              <div className="fj-roi-slider-bounds">
                <span>5 min (quick)</span>
                <span>30 min (detailed)</span>
              </div>
            </div>

            {/* Slider 3: Applications per month */}
            <div className="fj-roi-slider-card">
              <div className="fj-roi-slider-header">
                <span className="fj-roi-slider-label">Applications per month</span>
                <span className="fj-roi-slider-val">
                  {appsPerMonth} <small>jobs</small>
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={1000}
                step={10}
                value={appsPerMonth}
                onChange={(e) => setAppsPerMonth(Number(e.target.value))}
                className="fj-roi-range"
                style={getTrackStyle(appsPerMonth, 20, 1000)}
                aria-label="Number of job applications per month"
              />
              <div className="fj-roi-slider-bounds">
                <span>20 jobs</span>
                <span>1,000 jobs</span>
              </div>
            </div>
          </div>

          {/* Results Dark Card on Right */}
          <div className="fj-roi-results-card">
            <div className="fj-roi-result-block">
              <div className="fj-roi-result-num">{hoursSaved}</div>
              <div className="fj-roi-result-label">HOURS SAVED / MONTH</div>
            </div>

            <div className="fj-roi-result-divider" />

            <div className="fj-roi-result-block">
              <div className="fj-roi-result-num fj-roi-result-num--lime">
                ${dollarsSaved.toLocaleString()}
              </div>
              <div className="fj-roi-result-label">VALUE RETURNED TO YOU MONTHLY</div>
            </div>
          </div>
        </div>

        {/* Section 2: The Hidden Costs of Job Searching */}
        <div className="fj-section-head fj-roi-hidden-head">
          <h2>
            The Hidden Costs of <span className="heading-mark">Job Searching</span>
          </h2>
          <p>A job search costs more than money. Here&apos;s where the time and effort often go.</p>
        </div>

        <div className="fj-hidden-costs-grid">
          {/* Card 1 */}
          <div className="fj-hidden-cost-card">
            <div className="fj-hidden-cost-icon">
              <Clock3 size={20} />
            </div>
            <h4>Repeated Applications</h4>
            <div className="fj-hidden-cost-amount">Time spent</div>
            <p>Every role needs reviewing, tailoring and form filling</p>
          </div>

          {/* Card 2 */}
          <div className="fj-hidden-cost-card">
            <div className="fj-hidden-cost-icon">
              <BadgePercent size={20} />
            </div>
            <h4>Recruitment Agency Fees</h4>
            <div className="fj-hidden-cost-amount">Percentage-based</div>
            <p>Fees vary by provider, role and hiring arrangement</p>
          </div>

          {/* Card 3 */}
          <div className="fj-hidden-cost-card">
            <div className="fj-hidden-cost-icon">
              <FileText size={20} />
            </div>
            <h4>Resume Support</h4>
            <div className="fj-hidden-cost-amount">From $49</div>
            <p>A clear one-time price shown before payment</p>
          </div>

          {/* Card 4 */}
          <div className="fj-hidden-cost-card">
            <div className="fj-hidden-cost-icon">
              <Brain size={20} />
            </div>
            <h4>Job-search Fatigue</h4>
            <div className="fj-hidden-cost-amount">Hard to measure</div>
            <p>Repeated forms and follow-ups add to the mental load</p>
          </div>
        </div>

        {/* Section 3: Callout Banner */}
        <div className="fj-roi-banner">
          <div className="fj-roi-banner-text">
            <span className="fj-roi-banner-tag">Plans Starting At</span>
            <h3>
              Get started for just{" "}
              <span className="fj-roi-banner-highlight">$149/month</span>
            </h3>
          </div>
          <CalendlyLink className="fj-roi-banner-btn">
            Book a Free Consultation Call <ArrowRight size={16} />
          </CalendlyLink>
        </div>
      </div>
    </section>
  );
}
