import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
LINTER_SCRIPT = REPO_ROOT / "tools" / "lint_skills.py"


def run_linter(root: Path) -> subprocess.CompletedProcess:
    return subprocess.run(
        [sys.executable, str(root / "tools" / "lint_skills.py")],
        capture_output=True,
        text=True,
    )


class LinterRepoFixture(unittest.TestCase):
    def setUp(self):
        self.root = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.root, ignore_errors=True)

        tools = self.root / "tools"
        tools.mkdir()
        shutil.copy(LINTER_SCRIPT, tools / "lint_skills.py")
        # The Python-test CI job does not install PyYAML; the separate lint job
        # does. These settings-focused tests only need a valid frontmatter map.
        (tools / "yaml.py").write_text(
            "class YAMLError(Exception): pass\n\n"
            "def safe_load(text):\n"
            "    result = {}\n"
            "    for line in text.splitlines():\n"
            "        if ':' in line:\n"
            "            k, _, v = line.partition(':')\n"
            "            result[k.strip()] = v.strip()\n"
            "    return result if result else None\n",
            encoding="utf-8",
        )

        command = self.root / ".opencode" / "commands" / "setup.md"
        command.parent.mkdir(parents=True)
        command.write_text("---\ndescription: Test command\n---\n\n# Content\n", encoding="utf-8")

        skill = self.root / ".opencode" / "skills" / "example" / "SKILL.md"
        skill.parent.mkdir(parents=True)
        skill.write_text(
            "---\nname: example\ndescription: Example skill\n---\n",
            encoding="utf-8",
        )


class BasicLintTests(LinterRepoFixture):
    def test_valid_tree_passes(self):
        result = run_linter(self.root)

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("lint_skills: OK", result.stdout)

    def test_missing_description_in_command_fails(self):
        command = self.root / ".opencode" / "commands" / "bad.md"
        command.write_text("---\nname: test\n---\n\nNo description\n", encoding="utf-8")
        result = run_linter(self.root)
        self.assertEqual(result.returncode, 1)
        self.assertIn("missing required key 'description'", result.stdout)

    def test_missing_frontmatter_in_skill_fails(self):
        skill = self.root / ".opencode" / "skills" / "noskill" / "SKILL.md"
        skill.parent.mkdir(parents=True)
        skill.write_text("No frontmatter here\n", encoding="utf-8")
        result = run_linter(self.root)
        self.assertEqual(result.returncode, 1)
        self.assertIn("missing YAML frontmatter", result.stdout)
if __name__ == "__main__":
    unittest.main()
