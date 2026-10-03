"use client";

import Link from "next/link";
import { useState } from "react";
import { commonIssues } from "@/data/commonIssues";
import { ContentSection } from "@/components/ContentSection";

export function CommonIssues() {
  const [search, setSearch] = useState("");
  const term = search.trim().toLocaleLowerCase();
  const issues = commonIssues.filter((issue) =>
    `${issue.title} ${issue.keywords} ${issue.steps.join(" ")}`
      .toLocaleLowerCase()
      .includes(term),
  );
  return (
    <section aria-labelledby="find-issue" className="space-y-4">
      <h2 id="find-issue" className="font-display text-3xl font-extrabold">
        What’s going wrong?
      </h2>
      <label className="block">
        <span className="sr-only">Search common issues</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search: mod mismatch, crashes, Discord, missing rank…"
          className="w-full border border-border bg-bg-card/60 px-4 py-3 text-base placeholder:text-text-muted/80 focus:border-accent/50 focus:outline-none"
        />
      </label>
      <p className="text-sm text-text-muted" role="status">
        {term
          ? `${issues.length} matching ${issues.length === 1 ? "issue" : "issues"}`
          : "Choose your issue for the first checks and what to send staff."}
      </p>
      {issues.map((issue) => (
        <ContentSection key={issue.id} title={issue.title}>
          <ol className="list-decimal space-y-2 pl-5">
            {issue.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="border-l-2 border-accent/50 pl-3">{issue.evidence}</p>
          <Link
            href={issue.href}
            className="inline-block font-semibold text-accent underline underline-offset-4"
          >
            {issue.link} →
          </Link>
        </ContentSection>
      ))}
      {!issues.length && (
        <p className="border border-border bg-bg-card/60 p-4 text-sm text-text-muted">
          No matching issue yet. Try another search or{" "}
          <Link
            href="/support"
            className="text-accent underline underline-offset-4"
          >
            open a support ticket
          </Link>{" "}
          with the error you see.
        </p>
      )}
    </section>
  );
}
