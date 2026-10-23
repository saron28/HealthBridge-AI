import { useState, type FormEvent } from "react";
import Icon from "../components/Icon";
import { checkRenewal, usesMockApi } from "../services/api";
import type { RenewalCheck } from "../types/insurance";

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Renewal() {
  const [policyId, setPolicyId] = useState("");
  const [result, setResult] = useState<RenewalCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCheck = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!policyId.trim()) {
      setError("Enter a demo policy ID to check eligibility.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setShowReview(false);
    setConfirmed(false);
    try {
      const response = await checkRenewal(policyId);
      if (!response.success) throw new Error("The eligibility check could not be completed. Please try again.");
      setResult(response);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't check eligibility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-heading">
        <div className="eyebrow">A CLEARER NEXT STEP</div>
        <h1>Check your renewal</h1>
        <p>Get an eligibility result for a fictional policy — no guesswork, just the demo service response.</p>
      </div>

      <div className="renewal-intro">
        <div className="renewal-orbit"><span><Icon name="refresh" size={27} /></span><i /><i /><i /></div>
        <div><h2>A little peace of mind, one step at a time.</h2><p>First, we'll look up the demo policy and check the renewal result. If eligible, you can review the request — submitting renewals is not enabled in this prototype.</p></div>
        <div className="secure-label"><Icon name="lock" size={14} /> Read-only check</div>
      </div>

      <form className="lookup-panel renewal-lookup" onSubmit={handleCheck}>
        <div className="lookup-icon lookup-icon-teal"><Icon name="shield" size={22} /></div>
        <div className="lookup-content">
          <label className="field-label" htmlFor="renewal-policy-id">Enter your demo policy ID</label>
          <p>For example, <button className="inline-button" type="button" onClick={() => setPolicyId("HB-1001")}>HB-1001</button> or <button className="inline-button" type="button" onClick={() => setPolicyId("HB-1002")}>HB-1002</button>.</p>
          <div className="lookup-row">
            <input id="renewal-policy-id" value={policyId} onChange={(event) => { setPolicyId(event.target.value); setError(""); }} placeholder="e.g. HB-1001" />
            <button className="button button-primary" type="submit" disabled={loading}>{loading ? <><span className="spinner spinner-light" /> Checking…</> : <>Check eligibility <Icon name="arrow" size={16} /></>}</button>
          </div>
          {error && <div className="form-error" role="alert"><Icon name="alert" size={16} />{error}</div>}
        </div>
      </form>

      {result && (
        <div className="renewal-result" aria-live="polite">
          <div className="result-heading">
            <div><span className="eyebrow">ELIGIBILITY CHECK COMPLETE</span><h2>Your policy details</h2></div>
            <span className="status-badge status-active"><span />{result.policy.status}</span>
          </div>
          <div className="renewal-policy-grid">
            <div><span>Policy ID</span><strong>{result.policy.policyId}</strong></div>
            <div><span>Current plan</span><strong>{result.policy.planName}</strong></div>
            <div><span>Monthly premium</span><strong>${result.policy.monthlyPremium}</strong></div>
            <div><span>Renewal date</span><strong>{formatDate(result.policy.renewalDate)}</strong></div>
          </div>
          <div className={`eligibility-panel ${result.renewal.eligibleForDemoRenewal ? "eligible" : "not-eligible"}`}>
            <span className="eligibility-icon"><Icon name={result.renewal.eligibleForDemoRenewal ? "check" : "clock"} size={21} /></span>
            <div>
              <span className="eyebrow">DEMO SERVICE RESULT</span>
              <h3>{result.renewal.eligibleForDemoRenewal ? "Eligible for demo renewal review" : "Not currently eligible for demo renewal"}</h3>
              {result.renewal.issues.length > 0 ? <ul>{result.renewal.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul> : <p>The demo service returned no eligibility issues.</p>}
            </div>
          </div>
          <p className="result-source"><Icon name="lock" size={14} /> {usesMockApi ? "This result is from a local fictional demo fixture." : "This result was returned by the HealthBridge service."} Eligibility is determined by the service, not by this page.</p>

          {result.renewal.eligibleForDemoRenewal && (
            <div className="renewal-next-step">
              {!showReview ? (
                <div className="next-step-row"><div><strong>Ready to review?</strong><p>Continue to see a summary of a possible demo renewal request.</p></div><button className="button button-primary" onClick={() => setShowReview(true)}>Review request <Icon name="arrow" size={16} /></button></div>
              ) : (
                <div className="renewal-review">
                  <span className="eyebrow">REQUEST REVIEW</span><h3>Review before you continue</h3>
                  <p>This would be a request to renew <strong>{result.policy.planName}</strong> (policy <strong>{result.policy.policyId}</strong>). This prototype cannot submit renewal requests.</p>
                  <label className="checkbox-row"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span>I have reviewed this fictional renewal summary.</span></label>
                  <button className="button button-disabled" disabled title="Renewal request submission is not enabled in the demo">
                    Confirm renewal request <Icon name="lock" size={16} />
                  </button>
                  <p className="disabled-reason"><Icon name="lock" size={14} /> Submission remains disabled until identity verification and explicit confirmation are enforced by the backend.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div className="renewal-footnote"><Icon name="alert" size={15} /><span>Demo eligibility is not an offer or guarantee of insurance coverage. Never enter a real policy number.</span></div>
    </section>
  );
}
