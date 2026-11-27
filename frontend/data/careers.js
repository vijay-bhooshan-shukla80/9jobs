// Design previews only. Replace with approved vacancies before accepting role applications.
export const departments = ['Recruitment & Talent Acquisition', 'Software Development & Technology', 'Sales & Business Development', 'Digital Marketing', 'Client Success', 'Operations & Administration'];
export const roles = [
  ['talent-acquisition-specialist', 'Talent Acquisition Specialist', 0, 'Sydney, NSW', 'Full-time', 'Hybrid', 'person_search', 'Partner with hiring leads to source, screen, and guide candidates through a thoughtful, human-centred recruitment experience.'],
  ['full-stack-developer', 'Full Stack Developer', 1, 'Sydney, NSW', 'Full-time', 'Hybrid', 'code', 'Architect and ship scalable SaaS features powering resume workflows, candidate matching, and employer portals.'],
  ['digital-marketing-executive', 'Digital Marketing Executive', 3, 'Melbourne, VIC', 'Full-time', 'Hybrid', 'campaign', 'Drive organic growth, search campaigns, and career-resource storytelling to reach job seekers across Australia.'],
  ['business-development-executive', 'Business Development Executive', 2, 'Sydney, NSW', 'Full-time', 'On-site', 'business_center', 'Build lasting partnerships with employers and recruitment agencies looking to streamline hiring with 9Jobs.'],
  ['client-success-executive', 'Client Success Executive', 4, 'Brisbane, QLD', 'Full-time', 'Hybrid', 'support_agent', 'Support job seekers and corporate clients with onboarding, career service milestones, and responsive guidance.'],
  ['hr-operations-coordinator', 'HR & Operations Coordinator', 5, 'Melbourne, VIC', 'Part-time', 'Hybrid', 'settings_accessibility', 'Coordinate people operations, onboarding schedules, and day-to-day administrative workflows across teams.'],
  ['ai-automation-developer', 'AI Automation Developer', 1, 'Remote (Australia)', 'Contract', 'Remote', 'smart_toy', 'Design intelligent document parsing and automated candidate-matching pipelines to elevate platform efficiency.'],
].map(([slug, title, department, location, type, arrangement, icon, description]) => ({slug, title, department: departments[department], location, type, arrangement, icon, description, preview: true}));
export const culture = [
  ['trending_up', 'Career Growth', 'Learn, develop and grow professionally.'],
  ['memory', 'Innovative Environment', 'Work with modern recruitment and AI technologies.'],
  ['groups', 'Collaborative Culture', 'Build solutions alongside passionate professionals.'],
  ['flag', 'Meaningful Impact', 'Help people achieve their career goals.'],
  ['school', 'Continuous Learning', 'Explore new skills and professional development.'],
  ['handshake', 'Inclusive Workplace', 'Be part of a respectful and diverse team.'],
];
export const faqs = [
  ['How can I apply for a position at 9Jobs?', 'Choose a role and select Apply Now to share your details and resume. The roles currently shown are illustrative previews; submissions are recorded as expressions of interest, not applications for confirmed vacancies.'],
  ['What does the recruitment process involve?', 'The proposed journey includes application review, interview and assessment, followed by an offer and onboarding. Final steps depend on the role and approved recruitment policy.'],
  ['Can I apply for multiple positions?', 'Share your interests in the additional information field. Eligibility and multiple-application guidance will be confirmed by the recruitment team.'],
  ['Are remote or hybrid opportunities available?', 'Work arrangements will be specified in each approved vacancy. The arrangements on preview roles are illustrative.'],
  ['Can graduates and freshers apply?', 'Experience requirements will be listed for each approved vacancy. You can express interest in future opportunities through Submit Your Profile.'],
  ['Can I submit my resume for future opportunities?', 'Yes. Select Submit Your Profile and share your resume as an expression of interest. Future contact depends on relevant opportunities and approved recruitment policies.'],
];
