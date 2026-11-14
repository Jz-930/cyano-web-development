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
      className={`mk-scene mk-scene-writing${size === "full" ? " is-split" : ""}`}
    >
      <div className="mk-panel mk-branch-tree">
        <ProvenanceLines
          viewBox="0 0 240 260"
          paths={BRANCH_PATHS}
          surface="dark"
          state="rest"
        />
        <div className="mk-node mk-node-main">
          <i aria-hidden="true" />
          <span>{main ?? <span className="mk-skel mk-w-40" />}</span>
        </div>
        <div className="mk-node mk-node-a is-active">
          <i aria-hidden="true" />
          <span>{branchA ?? <span className="mk-skel mk-w-40" />}</span>
        </div>
        <div className="mk-node mk-node-b">
          <i aria-hidden="true" />
          <span>{branchB ?? <span className="mk-skel mk-w-40" />}</span>
        </div>
      </div>

      {size === "full" ? (
        <div className="mk-mem-drawer">
          {mems.map((m, idx) => (
            <div key={idx} className="mk-paper mk-mem-card">
              <div className="mk-mem-title">
                {m ?? <span className="mk-skel mk-w-40" />}
              </div>
              <div className="mk-skel-group">
                <span className="mk-skel mk-w-92" />
                <span className="mk-skel mk-w-64" />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
