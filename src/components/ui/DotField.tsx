/**
 * DotField — constellation-style scattered dots layered behind all content.
 * Fixed overlay, pointer-events-none, purely decorative.
 */
export function DotField() {
  return (
    <svg
      viewBox="0 0 430 900"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {/* ── Light gray — primary field ─────────────────────────────────── */}
      <g fill="rgba(160,157,152,0.38)">
        {/* top band */}
        <circle cx="22"  cy="34"  r="1" />
        <circle cx="58"  cy="19"  r="1" />
        <circle cx="94"  cy="44"  r="1" />
        <circle cx="148" cy="12"  r="1" />
        <circle cx="182" cy="38"  r="1" />
        <circle cx="238" cy="22"  r="1" />
        <circle cx="272" cy="48"  r="1" />
        <circle cx="318" cy="15"  r="1" />
        <circle cx="364" cy="36"  r="1" />
        <circle cx="408" cy="24"  r="1" />

        {/* upper-mid */}
        <circle cx="14"  cy="108" r="1" />
        <circle cx="48"  cy="92"  r="1" />
        <circle cx="88"  cy="118" r="1" />
        <circle cx="132" cy="88"  r="1" />
        <circle cx="168" cy="112" r="1" />
        <circle cx="205" cy="96"  r="1" />
        <circle cx="252" cy="122" r="1" />
        <circle cx="295" cy="84"  r="1" />
        <circle cx="338" cy="108" r="1" />
        <circle cx="378" cy="94"  r="1" />
        <circle cx="418" cy="118" r="1" />

        {/* mid */}
        <circle cx="28"  cy="198" r="1" />
        <circle cx="72"  cy="215" r="1" />
        <circle cx="118" cy="188" r="1" />
        <circle cx="158" cy="208" r="1" />
        <circle cx="215" cy="195" r="1" />
        <circle cx="262" cy="218" r="1" />
        <circle cx="305" cy="182" r="1" />
        <circle cx="348" cy="205" r="1" />
        <circle cx="392" cy="192" r="1" />
        <circle cx="422" cy="215" r="1" />

        {/* lower-mid */}
        <circle cx="18"  cy="305" r="1" />
        <circle cx="55"  cy="288" r="1" />
        <circle cx="95"  cy="318" r="1" />
        <circle cx="142" cy="298" r="1" />
        <circle cx="188" cy="312" r="1" />
        <circle cx="228" cy="285" r="1" />
        <circle cx="275" cy="308" r="1" />
        <circle cx="315" cy="292" r="1" />
        <circle cx="358" cy="318" r="1" />
        <circle cx="405" cy="298" r="1" />

        {/* lower */}
        <circle cx="32"  cy="415" r="1" />
        <circle cx="78"  cy="398" r="1" />
        <circle cx="122" cy="422" r="1" />
        <circle cx="165" cy="405" r="1" />
        <circle cx="208" cy="418" r="1" />
        <circle cx="255" cy="395" r="1" />
        <circle cx="298" cy="412" r="1" />
        <circle cx="342" cy="398" r="1" />
        <circle cx="385" cy="422" r="1" />
        <circle cx="418" cy="408" r="1" />

        {/* bottom */}
        <circle cx="42"  cy="525" r="1" />
        <circle cx="88"  cy="508" r="1" />
        <circle cx="132" cy="535" r="1" />
        <circle cx="178" cy="515" r="1" />
        <circle cx="225" cy="528" r="1" />
        <circle cx="268" cy="508" r="1" />
        <circle cx="315" cy="522" r="1" />
        <circle cx="358" cy="538" r="1" />
        <circle cx="402" cy="515" r="1" />

        {/* deep bottom */}
        <circle cx="25"  cy="638" r="1" />
        <circle cx="72"  cy="618" r="1" />
        <circle cx="115" cy="645" r="1" />
        <circle cx="162" cy="625" r="1" />
        <circle cx="205" cy="642" r="1" />
        <circle cx="252" cy="615" r="1" />
        <circle cx="298" cy="635" r="1" />
        <circle cx="345" cy="648" r="1" />
        <circle cx="388" cy="622" r="1" />
        <circle cx="415" cy="638" r="1" />
      </g>

      {/* ── Slightly bolder gray — secondary anchors ───────────────────── */}
      <g fill="rgba(140,137,132,0.55)">
        <circle cx="68"  cy="155" r="1.5" />
        <circle cx="205" cy="145" r="1.5" />
        <circle cx="348" cy="162" r="1.5" />
        <circle cx="92"  cy="348" r="1.5" />
        <circle cx="308" cy="335" r="1.5" />
        <circle cx="155" cy="452" r="1.5" />
        <circle cx="385" cy="435" r="1.5" />
        <circle cx="45"  cy="558" r="1.5" />
        <circle cx="222" cy="568" r="1.5" />
        <circle cx="375" cy="548" r="1.5" />
      </g>

      {/* ── Cherry red accents — sparse, muted ─────────────────────────── */}
      <g fill="rgba(196,30,58,0.22)">
        <circle cx="128" cy="82"  r="1.5" />
        <circle cx="305" cy="218" r="1.5" />
        <circle cx="72"  cy="422" r="1.5" />
        <circle cx="388" cy="328" r="1.5" />
        <circle cx="218" cy="618" r="1.5" />
      </g>

      {/* ── Near-black — very occasional ───────────────────────────────── */}
      <g fill="rgba(26,25,22,0.22)">
        <circle cx="182" cy="158" r="1" />
        <circle cx="362" cy="448" r="1" />
        <circle cx="92"  cy="532" r="1" />
      </g>
    </svg>
  )
}
