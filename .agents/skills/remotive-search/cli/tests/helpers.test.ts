import { describe, it, expect } from "bun:test"
import { cleanHtml } from "../src/helpers.js"

describe("cleanHtml", () => {
  it("strips tags and preserves paragraph breaks", () => {
    expect(cleanHtml("<p>Hello</p><p>World</p>")).toBe("Hello\nWorld")
  })
  it("decodes common entities", () => {
    expect(cleanHtml("A &amp; B &lt; C")).toBe("A & B < C")
  })
  it("collapses runs of whitespace", () => {
    expect(cleanHtml("a   b\n\n\n\nc")).toBe("a b\n\nc")
  })
  it("returns null for empty input", () => {
    expect(cleanHtml("")).toBeNull()
    expect(cleanHtml(null)).toBeNull()
  })
})
