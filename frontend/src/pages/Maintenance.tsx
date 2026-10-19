import { useState, type FormEvent } from "react";
import Icon from "../components/Icon";
import { getPolicy } from "../services/api";
import type { Policy } from "../types/insurance";

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Maintenance() {
  const [policyId, setPolicyId] = useState("");
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!policyId.trim()) {
      setError("Enter a demo policy ID to continue.");
      return;
    }
    setLoading(true);
    setError("");
    setPolicy(null);
    try {
      setPolicy(await getPolicy(policyId));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't retrieve that policy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-heading">
        <div className="eyebrow">YOUR COVERAGE, AT A GLANCE</div>
        <h1>Manage my policy</h1>
        <p>Look up a fictional policy to review its current information.</p>
      </div>

      <form className="lookup-panel" onSubmit={lookup}>
        <div className="lookup-icon"><Icon name="file" size={22} /></div>
        <div className="lookup-content">
          <label className="field-label" htmlFor="maintenance-policy-id">Demo policy ID</label>
          <p>Try <button className="inline-button" type="button" onClick={() => setPolicyId("HB-1001")}>HB-1001</button> or <button className="inline-button" type="button" onClick={() => setPolicyId("HB-1002")}>HB-1002</button>.</p>
          <div className="lookup-row">
            <input id="maintenance-policy-id" value={policyId} onChange={(event) => { setPolicyId(event.target.value); setError(""); }} placeholder="e.g. HB-1001" aria-describedby={error ? "maintenance-error" : undefined} />
            <button className="button button-primary" type="submit" disabled={loading}>{loading ? <><span className="spinner spinner-light" /> Looking up…</> : <>Find policy <Icon name="arrow" size={16} /></>}</button>
          </div>
          {error && <div id="maintenance-error" className="form-error" role="alert"><Icon name="alert" size={16} />{error}</div>}
        </div>
      </form>

      {policy && (
        <div className="policy-result">
          <div className="policy-topline"><div><span className="eyebrow">POLICY OVERVIEW</span><h2>{policy.planName}</h2><span className="policy-id">Policy ID: {policy.policyId}</span></div><span className={`status-badge status-${policy.status.toLowerCase()}`}><span />{policy.status}</span></div>
          <div className="policy-metrics">
            <div className="policy-metric"><span className="metric-icon"><Icon name="calendar" size={18} /></span><span>Renewal date</span><strong>{formatDate(policy.renewalDate)}</strong></div>
            <div className="policy-metric"><span className="metric-icon"><Icon name="shield" size={18} /></span><span>Monthly premium</span><strong>${policy.monthlyPremium} <small>/ month</small></strong></div>
          </div>
          <div className="policy-details">
            <h3>Member details <span>Fictional information</span></h3>
            <div className="detail-grid">
              <div><Icon name="user" size={17} /><span><small>Member name</small><strong>{policy.memberName}</strong></span></div>
              <div><Icon name="mail" size={17} /><span><small>Email address</small><strong>{policy.email}</strong></span></div>
              <div><Icon name="phone" size={17} /><span><small>Phone number</small><strong>{policy.phone}</strong></span></div>
              <div><Icon name="pin" size={17} /><span><small>Mailing address</small><strong>{policy.address}</strong></span></div>
            </div>
          </div>
          <div className="maintenance-notice"><Icon name="lock" size={17} /><div><strong>Policy changes are not enabled in this demo</strong><p>Contact and address updates will be available after the backend supports identity verification and validated submissions.</p></div></div>
        </div>
      )}
    </section>
  );
}
