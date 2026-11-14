import type { Locale } from "@/lib/locale";
import { mk } from "@/lib/mockups";
import { ProvenanceLines } from "../ProvenanceLines";

const BRANCH_PATHS = [
  "M 56 64 L 184 64",
  "M 96 64 C 124 64, 128 136, 168 136",
  "M 96 64 C 124 64, 128 208, 168 208",
];

export function SceneWriting({
  locale,
  size,
}: {
  locale: Locale;
  size: "full" | "compact";
}) {
  const main = mk("writing", "main", locale);
  const branchA = mk("writing", "branchA", locale);
  const branchB = mk("writing", "branchB", locale);
  const mems = [1, 2, 3].map((n) => mk("writing", `mem${n}`, locale));

  return (
    <div
      className={`mk-scene [font-size:13px] [line-height:1.55] mk-scene-writing${size === "full" ? " is-split" : ""}`}
    >
      <div className="mk-panel mk-branch-tree [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] relative [padding:var(--sp-4)]">
        <ProvenanceLines
          viewBox="0 0 240 260"
          paths={BRANCH_PATHS}
          surface="dark"
          state="rest"
        />
        <div className="mk-node mk-node-main absolute inline-flex items-center [gap:var(--sp-2)] [padding:var(--sp-1)_var(--sp-3)] [border-radius:var(--r-chip)] [font-size:13px]">
          <i aria-hidden="true" />
          <span>{main ?? <span className="mk-skel mk-w-40 block [border-radius:var(--r-chip)] [width:40%]" />}</span>
        </div>
        <div className="mk-node mk-node-a is-active absolute inline-flex items-center [gap:var(--sp-2)] [padding:var(--sp-1)_var(--sp-3)] [border-radius:var(--r-chip)] [font-size:13px]">
          <i aria-hidden="true" />
          <span>{branchA ?? <span className="mk-skel mk-w-40 block [border-radius:var(--r-chip)] [width:40%]" />}</span>
        </div>
        <div className="mk-node mk-node-b absolute inline-flex items-center [gap:var(--sp-2)] [padding:var(--sp-1)_var(--sp-3)] [border-radius:var(--r-chip)] [font-size:13px]">
          <i aria-hidden="true" />
          <span>{branchB ?? <span className="mk-skel mk-w-40 block [border-radius:var(--r-chip)] [width:40%]" />}</span>
        </div>
      </div>

      {size === "full" ? (
        <div className="mk-mem-drawer grid [gap:var(--sp-2)]">
          {mems.map((m, idx) => (
            <div key={idx} className="mk-paper mk-mem-card [background:var(--p2)] [color:var(--ink)] [border-radius:var(--r-control)] [padding:var(--sp-3)] grid [gap:var(--sp-2)]">
              <div className="mk-mem-title [font-size:13px] [font-weight:500] [color:var(--ink)]">
                {m ?? <span className="mk-skel mk-w-40 block [border-radius:var(--r-chip)] [width:40%]" />}
              </div>
              <div className="mk-skel-group grid [gap:var(--sp-2)]">
                <span className="mk-skel mk-w-92 block [border-radius:var(--r-chip)] [width:92%]" />
                <span className="mk-skel mk-w-64 block [border-radius:var(--r-chip)] [width:64%]" />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
