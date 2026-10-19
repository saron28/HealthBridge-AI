import { Link } from "react-router-dom";
import Icon from "../components/Icon";

const services = [
  {
    to: "/enrollment",
    icon: "shield" as const,
    number: "01",
    title: "Find your plan",
    description: "Compare our fictional coverage options and find a plan that fits your needs.",
    action: "Explore plans",
    tone: "blue",
  },
  {
    to: "/maintenance",
    icon: "file" as const,
    number: "02",
    title: "Manage my policy",
    description: "Look up a demo policy and review its plan and member details.",
    action: "View policy",
    tone: "teal",
  },
  {
    to: "/renewal",
    icon: "refresh" as const,
    number: "03",
    title: "Check renewal",
    description: "See the demo eligibility result for a fictional policy.",
    action: "Check eligibility",
    tone: "lavender",
  },
];

export default function Home() {
  return (
    <>
      <section className="welcome-panel">
        <div className="welcome-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> HEALTH COVERAGE, MADE HUMAN</div>
          <h1>Your health insurance,<br /><span>made simpler with AI.</span></h1>
          <p>Explore your options, keep track of your plan, and get clear answers — all in one place.</p>
          <div className="welcome-actions">
            <Link to="/enrollment" className="button button-light">Explore plans <Icon name="arrow" size={17} /></Link>
            <Link to="/assistant" className="welcome-text-link"><Icon name="sparkles" size={17} /> Ask HealthBridge AI</Link>
          </div>
          <div className="welcome-footnote"><Icon name="lock" size={14} /> A helpful guide, not a substitute for professional advice</div>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="art-circle art-circle-one" />
          <div className="art-circle art-circle-two" />
          <div className="art-heart"><Icon name="heart" size={82} /></div>
          <div className="art-float art-float-one"><span className="float-icon"><Icon name="check" size={17} /></span><span><b>Care that fits</b><small>Support for every step</small></span></div>
          <div className="art-float art-float-two"><span className="float-icon float-icon-teal"><Icon name="sparkles" size={17} /></span><span><b>Answers, anytime</b><small>Your AI guide is here</small></span></div>
          <span className="art-sparkle sparkle-one">✦</span><span className="art-sparkle sparkle-two">✧</span>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><div className="eyebrow">HOW CAN WE HELP?</div><h2>Care starts right here.</h2></div>
          <span className="section-aside">Your next step, made simple <Icon name="arrow" size={16} /></span>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <Link to={service.to} className={`service-card service-${service.tone}`} key={service.title}>
              <div className="service-card-top">
                <span className="service-icon"><Icon name={service.icon} size={22} /></span>
                <span className="service-number">{service.number}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="service-action">{service.action}<Icon name="arrow" size={16} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="assistant-promo">
        <div className="promo-spark"><Icon name="sparkles" size={23} /></div>
        <div className="promo-copy"><span className="eyebrow">MEET YOUR HEALTHBRIDGE GUIDE</span><h2>A little help goes a long way.</h2><p>Have a question about plans, policies, or renewals? Ask in plain language and get pointed in the right direction.</p></div>
        <Link to="/assistant" className="button button-primary">Talk to the AI assistant <Icon name="arrow" size={17} /></Link>
      </section>
      <p className="disclaimer-inline"><Icon name="alert" size={15} /> This prototype uses entirely fictional data and does not provide real insurance, medical, or financial advice.</p>
    </>
  );
}
