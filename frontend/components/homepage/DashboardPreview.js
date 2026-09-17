"use client";

import { useState, useEffect } from "react";
import { UsersRound, Briefcase, Gauge, Sparkles, Bell, Check, MapPin } from "lucide-react";

const candidates = [
  {
    name: "Jack Miller",
    initials: "JM",
    role: "Full Stack Developer",
    category: "IT",
    amount: "$145,000",
    status: "Placed",
    location: "Sydney, NSW",
  },
  {
    name: "Sarah Wilson",
    initials: "SW",
    role: "Financial Accountant",
    category: "Non-IT",
    amount: "$128,000",
    status: "Placed",
    location: "Melbourne, VIC",
  },
  {
    name: "Ryan Chen",
    initials: "RC",
    role: "Cloud & DevOps Engineer",
    category: "IT",
    amount: "$152,000",
    status: "Placed",
    location: "Brisbane, QLD",
  },
  {
    name: "Emma Davis",
    initials: "ED",
    role: "HR Business Partner",
    category: "Non-IT",
    amount: "$135,000",
    status: "Placed",
    location: "Melbourne, VIC",
  },
  {
    name: "Liam Taylor",
    initials: "LT",
    role: "Data & BI Analyst",
    category: "IT",
    amount: "$124,000",
    status: "Placed",
    location: "Sydney, NSW",
  },
  {
    name: "Alex Brown",
    initials: "AB",
    role: "Supply Chain Lead",
    category: "Non-IT",
    amount: "$118,000",
    status: "Placed",
    location: "Perth, WA",
  },
];

function getAustralianGreeting() {
  try {
    const formatter = new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Sydney",
      hour: "numeric",
      hour12: false,
    });
    const hour = parseInt(formatter.format(new Date()), 10);
    if (hour >= 5 && hour < 12) return "Good morning!";
    if (hour >= 12 && hour < 17) return "Good afternoon!";
    if (hour >= 17 && hour < 21) return "Good evening!";
    return "Good night!";
  } catch (e) {
    return "Good morning!";
  }
}

export default function DashboardPreview() {
  const [greeting, setGreeting] = useState(() => getAustralianGreeting());

  useEffect(() => {
    setGreeting(getAustralianGreeting());
    const interval = setInterval(() => {
      setGreeting(getAustralianGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fj-dashboard">
      <div className="fj-dashboard-sidebar">
        <span className="fj-brand-mark fj-brand-mark--small" role="presentation">
          <span />
          <span />
        </span>
        {[UsersRound, Briefcase, Gauge, Sparkles].map((Icon, idx) => (
          <span className="fj-dashboard-icon" key={idx}>
            <Icon size={19} />
          </span>
        ))}
      </div>
      <div className="fj-dashboard-main">
        <div className="fj-dashboard-top">
          <div>
            <p className="fj-dashboard-title">{greeting}</p>
            <div className="fj-dashboard-filters">
              <span>Location <strong>All Australia</strong></span>
              <span>Status <strong style={{ color: "#047857" }}>Placed</strong></span>
            </div>
          </div>
          <div className="fj-dashboard-actions">
            <span className="fj-sparkles-gold"><Sparkles size={18} /></span>
            <span><Bell size={18} /></span>
          </div>
        </div>
        <div className="fj-table">
          <div className="fj-table-head">
            <span>Candidates</span>
            <span>Role</span>
            <span>Status</span>
            <span>Package</span>
            <span>Location</span>
          </div>
          {candidates.map((candidate) => (
            <div className="fj-table-row" key={candidate.name}>
              <span className="fj-user-cell">
                <span className="fj-check is-active">
                  <Check size={15} />
                </span>
                <span className="fj-avatar">{candidate.initials}</span>
                <span className="fj-candidate-name">{candidate.name}</span>
              </span>
              <span className="fj-role-cell">
                <span className="fj-role-title">{candidate.role}</span>
                {candidate.category === "IT" ? (
                  <em className="is-lime">IT</em>
                ) : (
                  <em className="is-gold">Non-IT</em>
                )}
              </span>
              <span><mark className="is-placed">{candidate.status}</mark></span>
              <span>{candidate.amount}</span>
              <span className="fj-location-cell">
                <MapPin size={13} className="fj-location-icon" />
                {candidate.location}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
