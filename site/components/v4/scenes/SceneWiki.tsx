import { Search, ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { caseMetaByMockup, mk, wikiDemoQuestion } from "@/lib/mockups";
import type { SceneCommonProps } from "./SceneProposal";

function splitAnswerClauses(text: string, locale: Locale): [string, string] {
  const sep = locale === "zh" ? "。" : ". ";
  const idx = text.indexOf(sep);
  if (idx < 0) return [text, ""];
  const first = text.slice(0, idx + (locale === "zh" ? 1 : 1));
  const rest = text.slice(idx + sep.length).trim();
  return [first, rest];
}

export function SceneWiki({
  locale,
  size,
  step = 6,
  focusCite = null,
  onCite,
  showRail = true,
  interactiveCites = false,
}: SceneCommonProps) {
  const question = wikiDemoQuestion(locale);
  const answer = mk("wiki", "answer", locale);
  const src1 = mk("wiki", "src1", locale);
  const src2 = mk("wiki", "src2", locale);
  const perm = mk("wiki", "perm", locale);
  const handoff = mk("wiki", "handoff", locale);
  const meta = caseMetaByMockup("wiki", locale);

  const [clause1, clause2] = answer ? splitAnswerClauses(answer, locale) : ["", ""];
  const withRail = size === "full" && showRail;

  const renderCite = (n: 1 | 2) => {
    const active = focusCite === n;
    if (interactiveCites) {
      return (
        <button
          key={n}
          type="button"
          className="mk-cite"
          data-active={active ? "true" : undefined}
          data-motion="transform"
          onPointerEnter={() => onCite?.(n)}
          onPointerLeave={() => onCite?.(null)}
          onFocus={() => onCite?.(n)}
          onBlur={() => onCite?.(null)}
        >
          {n}
        </button>
      );
    }
    return (
      <span key={n} className="mk-cite" data-active={active ? "true" : undefined}>
        {n}
      </span>
    );
  };

  return (
    <div className={`mk-scene mk-scene-wiki${withRail ? " has-rail-right" : ""}`}>
      <div className="mk-wiki-main">
        <div className="mk-panel mk-search-bar">
          <Search size={16} aria-hidden="true" />
          <span>{question}</span>
        </div>

        <div className="mk-paper mk-wiki-card">
          {answer ? (
            <p className="mk-wiki-answer" data-visible={step >= 3 ? "true" : "false"}>
              <span className={`mk-s1${focusCite === 1 ? " mk-hl" : ""}`}>
                {clause1}
              </span>
              {renderCite(1)}{" "}
              {clause2 ? (
                <>
                  <span className={`mk-s2${focusCite === 2 ? " mk-hl" : ""}`}>
                    {clause2}
                  </span>
                  {renderCite(2)}
                </>
              ) : null}
            </p>
          ) : (
            <div className="mk-skel-group">
              <span className="mk-skel mk-w-92" />
              <span className="mk-skel mk-w-64" />
            </div>
          )}

          <div
            className="mk-wiki-sources mk-s3"
            data-visible={step >= 3 ? "true" : "false"}
          >
            {src1 ? (
              <span
                className="mk-pill"
                data-active={focusCite === 1 ? "true" : undefined}
              >
                {src1}
              </span>
            ) : (
              <span className="mk-skel mk-w-40" />
            )}
            {src2 ? (
              <span
                className="mk-pill"
                data-active={focusCite === 2 ? "true" : undefined}
              >
                {src2}
              </span>
            ) : (
              <span className="mk-skel mk-w-40" />
            )}
          </div>

          {size === "full" ? (
            <div
              className="mk-wiki-foot"
              data-done={step >= 4 ? "true" : "false"}
            >
              <span className="mk-perm">
                <ShieldCheck size={14} aria-hidden="true" />
                {perm ?? <span className="mk-skel mk-w-40" />}
              </span>
              {handoff ? (
                <span className="mk-handoff">{handoff}</span>
              ) : (
                <span className="mk-skel mk-w-28" />
              )}
            </div>
          ) : null}
        </div>
      </div>

      {withRail ? (
        <aside className="mk-wiki-stats">
          {[meta.stats[0], meta.stats[1]].map((st) => (
            <div key={st.label} className="mk-panel mk-mini-stat">
              <strong className="figure">{st.value}</strong>
              <span>{st.label}</span>
            </div>
          ))}
        </aside>
      ) : null}
    </div>
  );
}
