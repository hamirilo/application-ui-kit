import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as publicApi from "./index";

const applicationDir = join(process.cwd(), "components/application");

function implementationNames(): string[] {
  return readdirSync(applicationDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^Application[A-Z][A-Za-z0-9]*\.tsx$/.test(entry.name))
    .map((entry) => entry.name.replace(/\.tsx$/, ""))
    .sort();
}

describe("Application* public API", () => {
  const components = implementationNames();

  it("Application* 実装を検出できている", () => {
    expect(components.length).toBeGreaterThan(10);
  });

  it.each(components)("%s が public entry から export されている", (name) => {
    expect(publicApi).toHaveProperty(name);
    expect((publicApi as Record<string, unknown>)[name]).toBeDefined();
  });
});
