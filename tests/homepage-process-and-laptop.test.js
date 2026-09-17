const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

describe("homepage process and laptop regression contract", () => {
  test("runs the six-step process once and then releases the sticky section", () => {
    const process = read("frontend/components/homepage/JobSupportProcessSection.js");
    const styles = read("frontend/components/homepage/JobSupportProcess.module.css");

    expect(process).toContain("const TOTAL_STEPS = stepsData.length;");
    expect(process).toContain("(TOTAL_STEPS - 1) * STEP_ROTATION_DEG");
    expect(process).not.toContain("TOTAL_LOOPS");
    expect(styles).toContain("height: 360vh;");
  });

  test("keeps the laptop base perspective and mobile content legible", () => {
    const styles = read("frontend/components/homepage/HeroLaptop.module.css");

    expect(styles).not.toContain("rotateZ(1.25deg)");
    expect(styles).toContain("@container (max-width: 520px)");
    expect(styles).toContain("font-size: max(9px, 2.15cqw);");
    expect(styles).toContain("width: 62%;");
    expect(styles).toContain("transform: rotateZ(.5deg);");
    expect(styles).not.toContain("rotateZ(2.25deg)");
  });

  test("stacks the rotating orbit above the process copy on phones", () => {
    const styles = read("frontend/components/homepage/JobSupportProcess.module.css");

    expect(styles).toContain("@media (max-width: 600px)");
    expect(styles).toContain("grid-template-columns: 1fr;");
    expect(styles).toContain("grid-template-rows: 45% 55%;");
    expect(styles).toContain("transform: scale(0.46);");
    expect(styles).not.toContain(".mobileLayout");
    expect(styles).not.toContain(".finalStep .wheelStageAnchor");
  });

  test("labels the homepage placement dashboard clearly", () => {
    const page = read("frontend/app/page.js");
    const styles = read("frontend/app/globals.css");

    expect(page).toContain('id="placed-clients-title"');
    expect(page).toContain("Placed Clients");
    expect(styles).toContain(".fj-placement-preview-heading");
  });

  test("uses the requested About 9Jobs section heading", () => {
    const videoSection = read("frontend/components/homepage/HomeVideoSection.js");

    expect(videoSection).toContain('aria-label="About 9Jobs"');
    expect(videoSection).toContain('About <span className={styles.highlight}>9Jobs</span>');
    expect(videoSection).not.toContain("Watch How <span");
  });

  test("hides the custom reel play control as soon as inline playback starts", () => {
    const videoSection = read("frontend/components/homepage/HomeVideoSection.js");
    const styles = read("frontend/components/homepage/HomeVideoSection.module.css");

    expect(videoSection).toContain("function startInlineVideo(reelId)");
    expect(videoSection).toContain("onFocus={() => startInlineVideo(card.id)}");
    expect(videoSection).toContain("!startedInlineVideos.has(card.id) &&");
    expect(videoSection).not.toContain("onPointerEnter={() =>");
    expect(styles).toMatch(/\.reelPreview\s*\{[\s\S]*?pointer-events: auto;/);
    expect(styles).toMatch(/\.reelPlayButton\s*\{[\s\S]*?pointer-events: none;/);
    expect(styles).toContain("@media (hover: none), (pointer: coarse)");
    expect(styles).toContain(".thumbnailWrapper:active .reelPlayButton");
  });

  test("adds the animated watch-demo cue without changing the demo destination", () => {
    const hero = read("frontend/components/homepage/HomeHero.js");
    const styles = read("frontend/components/homepage/HomeHero.module.css");

    expect(hero).toContain('href="#how-9jobs-works"');
    expect(hero).toContain("Watch Demo");
    expect(styles).toContain("animation: watchDemoBounce");
    expect(styles).toContain("@media (prefers-reduced-motion: no-preference)");
  });

  test("uses a complete circular icon orbit around the logo hub", () => {
    const process = read("frontend/components/homepage/JobSupportProcessSection.js");

    expect(process).toContain("angleDeg: i * 60");
    expect(process).toContain("r={TRACK_RADIUS}");
    expect(process).toContain("<WheelTrackNode");
    expect(process).toContain('return "blur(5px)"');
    expect(process).not.toContain('strokeDasharray="9 9"');
    expect(process).toContain('stroke="#65c500"');
    expect(process).toContain("Trusted by Job Seekers");
    expect(process).toContain("currentStep.benefits.map");
    expect(process).toContain("width: 260");
    expect(process).toContain("height: 260");
  });
});
