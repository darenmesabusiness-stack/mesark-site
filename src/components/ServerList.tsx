"use client";

import { useState, useMemo } from "react";
import { ContentSection } from "@/components/ContentSection";
import { CopyIP } from "@/components/CopyIP";
import type { Cluster } from "@/data/servers";

export function ServerList({ clusters }: { clusters: Cluster[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return clusters;

    const q = query.toLowerCase();
    return clusters
      .map((cluster) => ({
        ...cluster,
        servers: cluster.servers.filter(
          (s) =>
            s.map.toLowerCase().includes(q) ||
            s.ip.includes(q) ||
            cluster.name.toLowerCase().includes(q)
        ),
      }))
      .filter((cluster) => cluster.servers.length > 0);
  }, [clusters, query]);

  const totalResults = filtered.reduce((sum, c) => sum + c.servers.length, 0);

  return (
    <>
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search maps or IPs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-bg-card/50 text-text-primary placeholder:text-text-muted/50 text-sm focus:outline-none focus:border-accent/50 transition"
        />
        {query && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted">
            {totalResults} server{totalResults !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p className="text-sm">No servers match &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        filtered.map((cluster, i) => (
          <ContentSection
            key={cluster.name}
            title={`${cluster.name}${query ? ` (${cluster.servers.length})` : ""}`}
            defaultOpen={query ? true : i === 0}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cluster.servers.map((server) => (
                <CopyIP key={server.ip} ip={server.ip} label={server.map} />
              ))}
            </div>
          </ContentSection>
        ))
      )}
    </>
  );
}
