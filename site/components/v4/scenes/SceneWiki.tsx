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
          className="mk-cite inline-flex items-center justify-center [margin-left:var(--sp-1)] [padding:1px_6px] [min-width:20px] [min-height:20px] [border-radius:var(--r-control)] [font:500_12px/1.3_var(--mono)]"
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
      <span key={n} className="mk-cite inline-flex items-center justify-center [margin-left:var(--sp-1)] [padding:1px_6px] [min-width:20px] [min-height:20px] [border-radius:var(--r-control)] [font:500_12px/1.3_var(--mono)]" data-active={active ? "true" : undefined}>
        {n}
      </span>
    );
  };

  return (
    <div className={`mk-scene [font-size:13px] [line-height:1.55] mk-scene-wiki${withRail ? " has-rail-right" : ""}`}>
      <div className="mk-wiki-main flex flex-col [gap:var(--sp-3)]">
        <div className="mk-panel mk-search-bar [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] flex items-center [gap:var(--sp-2)] [min-height:44px] [padding:0_var(--sp-3)] [color:var(--light)] [font-size:13px]">
          <Search size={16} aria-hidden="true" />
          <span>{question}</span>
        </div>

        <div className="mk-paper mk-wiki-card [background:var(--p2)] [color:var(--ink)] [border-radius:var(--r-control)] flex flex-col [gap:var(--sp-3)] [flex:1]">
          {answer ? (
            <p className="mk-wiki-answer m-0 [font-size:13px] [line-height:1.65]" data-visible={step >= 3 ? "true" : "false"}>
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
            <div className="mk-skel-group grid [gap:var(--sp-2)]">
              <span className="mk-skel mk-w-92 block [border-radius:var(--r-chip)] [width:92%]" />
              <span className="mk-skel mk-w-64 block [border-radius:var(--r-chip)] [width:64%]" />
            </div>
          )}

          <div
            className="mk-wiki-sources mk-s3 flex flex-wrap [gap:var(--sp-2)]"
            data-visible={step >= 3 ? "true" : "false"}
          >
            {src1 ? (
              <span
                className="mk-pill inline-flex items-center [padding:var(--sp-1)_var(--sp-2)] [border-radius:var(--r-chip)] [font-size:13px] [color:var(--ink)] [transition:border-color_var(--qtf),background-color_var(--qtf)]"
                data-active={focusCite === 1 ? "true" : undefined}
              >
                {src1}
              </span>
            ) : (
              <span className="mk-skel mk-w-40 block [border-radius:var(--r-chip)] [width:40%]" />
            )}
            {src2 ? (
              <span
                className="mk-pill inline-flex items-center [padding:var(--sp-1)_var(--sp-2)] [border-radius:var(--r-chip)] [font-size:13px] [color:var(--ink)] [transition:border-color_var(--qtf),background-color_var(--qtf)]"
                data-active={focusCite === 2 ? "true" : undefined}
              >
                {src2}
              </span>
            ) : (
              <span className="mk-skel mk-w-40 block [border-radius:var(--r-chip)] [width:40%]" />
            )}
          </div>

          {size === "full" ? (
            <div
              className="mk-wiki-foot flex items-center justify-between [gap:var(--sp-2)] [margin-top:auto] [padding-top:var(--sp-3)] [border-top:1px_solid_var(--line)]"
              data-done={step >= 4 ? "true" : "false"}
            >
              <span className="mk-perm inline-flex items-center [gap:var(--sp-1)] [font-size:13px] [color:var(--link)]">
                <ShieldCheck size={14} aria-hidden="true" />
                {perm ?? <span className="mk-skel mk-w-40 block [border-radius:var(--r-chip)] [width:40%]" />}
              </span>
              {handoff ? (
                <span className="mk-handoff inline-flex items-center [height:32px] [padding:0_var(--sp-3)] [border-radius:var(--r-chip)] [border:1px_solid_var(--line)] [font-size:13px] [color:var(--ink)] [background:var(--p1)]">{handoff}</span>
              ) : (
                <span className="mk-skel mk-w-28 block [border-radius:var(--r-chip)] [width:28%]" />
              )}
            </div>
          ) : null}
        </div>
      </div>

      {withRail ? (
        <aside className="mk-wiki-stats grid [gap:var(--sp-3)]">
          {[meta.stats[0], meta.stats[1]].map((st) => (
            <div key={st.label} className="mk-panel mk-mini-stat [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] flex flex-col justify-center [gap:var(--sp-1)] [padding:var(--sp-3)]">
              <strong className="figure">{st.value}</strong>
              <span>{st.label}</span>
            </div>
          ))}
        </aside>
      ) : null}
    </div>
  );
}
